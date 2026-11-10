# svc-identidade

Microsserviço de **usuários** da Carteira Digital. Guarda nome e e-mail de cada usuário no **MongoDB** (Atlas na nuvem) e expõe um CRUD completo.

## Arquitetura

Microsserviço 1 (Database per Service): só ele acessa o banco `identidade` no MongoDB Atlas. É chamado pelo BFF; antes de excluir um usuário, pergunta ao `svc-carteira` por HTTP se ele tem carteira; publica `UserCreated` na fila `wallet-events` do Azure Service Bus. Visão completa, com os diagramas C4, no [README da raiz](../../README.md#arquitetura) e no [PDF arc42](../../docs/Carteira-Digital-Arquitetura-arc42-Entrega3.pdf).

## Tecnologias

- Node.js 24, NestJS 12 sobre Fastify
- Mongoose 9 com MongoDB Atlas
- `@azure/service-bus` 7 para publicar eventos
- `@nestjs/swagger` e class-validator
- Vitest 5: testes unitários e de arquitetura
- Na nuvem: Azure Container Apps, imagem `f4d3l/carteira-svc-identidade` no Docker Hub

## O que faz

| Rota | Descrição |
|---|---|
| `GET /users` | Lista os usuários |
| `GET /users/:id` | Busca um usuário (404 se não existir) |
| `POST /users` | Cria um usuário (409 se o e-mail já estiver em uso) e publica o evento `UserCreated` |
| `PATCH /users/:id` | Altera nome e/ou e-mail |
| `DELETE /users/:id` | Exclui o usuário; recusa com 409 enquanto ele ainda tiver carteira (consulta o `svc-carteira`) |

Swagger em `/docs`.

## Como está organizado

Clean Architecture + Vertical Slice: `domain/` (entidade, portas e erros), `features/<caso-de-uso>/` (use case, controller e DTO), `infrastructure/` (Mongoose, cliente HTTP do svc-carteira, publicação na fila), `api/` (mapeia erros de domínio para HTTP).

## Rodando localmente

```bash
docker compose up mongo-identidade
PORT=3001 SERVICEBUS_CONNECTION_STRING='<connection string>' pnpm --filter svc-identidade dev
```

Variáveis: `MONGO_URL` (padrão `mongodb://localhost:27017/identidade`), `SVC_CARTEIRA_URL` (padrão `http://localhost:3002`), `SERVICEBUS_CONNECTION_STRING` (Azure Service Bus; sem ela, os eventos não são publicados).

## Integrantes

| Nome | RA / Matrícula |
|---|---|
| Lucas Reali | 40092691 |
| Guilherme Fadel | 40101681 |
| Thiago Akimoto | 40090610 |
| Gabriel Conti | 40095589 |
