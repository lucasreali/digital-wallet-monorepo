# Carteira Digital — monorepo

| Pasta | O que é | Stack | Porta local | Swagger |
|---|---|---|---|---|
| `apps/web` | Front (consome só o BFF) | TanStack Start + Query + Kubb | 5173 | — |
| `apps/bff` | BFF, `GET /aggregated-data` | NestJS + Fastify | 3000 | http://localhost:3000/docs |
| `services/svc-identidade` | Usuários | NestJS + Fastify + MongoDB | 3001 | http://localhost:3001/docs |
| `services/svc-carteira` | Carteiras | NestJS + Fastify + Azure SQL | 3002 | http://localhost:3002/docs |
| `services/fn-notificacoes` | Azure Function (HTTP `/api/insights`) | Azure Functions v4 (Node) | 7071 | — |

O JSON do OpenAPI fica em `/docs-json`. Ele é gerado a partir do código pelo plugin do `@nestjs/swagger` (ver `nest-cli.json`):
DTOs em arquivos `*.dto.ts` / `*.entity.ts`, tipos de retorno e comentários `/** */` viram documentação sozinhos.

## Rodar

```bash
pnpm install
docker compose up --build                                      # tudo
docker compose -f services/svc-identidade/docker-compose.yml up --build   # um serviço só
```

> Mac Apple Silicon: SQL Server e Azure Functions só têm imagem amd64. Ative
> Docker Desktop → Settings → General → "Use Rosetta for x86_64/amd64 emulation".

## Estrutura de cada serviço (Clean Architecture + Vertical Slice)

```
src/
├── domain/          entidades e portas (classes abstratas), sem Nest nem banco
├── features/<caso>/ uma pasta por caso de uso: controller + dto
└── infrastructure/  adaptadores (Mongo, SQL) que implementam as portas
```

## Publicar no Docker Hub

```bash
docker build -f Dockerfile.nest --build-arg APP=bff -t <user>/carteira-bff:v1 .
docker build -f services/fn-notificacoes/Dockerfile -t <user>/carteira-fn-notificacoes:v1 .
docker push <user>/carteira-bff:v1
```

## Client do front gerado pelo Kubb

O front não escreve chamada HTTP à mão: tipos, client `fetch` e hooks do TanStack Query saem do Swagger do BFF.

```bash
pnpm --filter bff openapi     # grava apps/bff/openapi.json a partir do código
pnpm --filter web generate    # Kubb lê esse arquivo e gera apps/web/src/gen
```

Rode os dois sempre que mudar um endpoint ou DTO do BFF. A URL do BFF vem de `VITE_BFF_URL` (`apps/web/.env`).
