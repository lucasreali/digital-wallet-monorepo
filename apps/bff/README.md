# bff

**Backend for Frontend** da Carteira Digital. É a única API que o frontend chama: repassa as chamadas para os microsserviços e junta dados de várias fontes numa resposta só. Na nuvem fica atrás do AWS API Gateway.

## Arquitetura

Fica entre o API Gateway e os serviços: recebe tudo o que o frontend pede, chama o `svc-identidade`, o `svc-carteira` e a `fn-notificacoes` por HTTP e, quando a tela precisa de várias fontes, devolve um único JSON (`GET /aggregated-data`). Visão completa, com os diagramas C4, no [README da raiz](../../README.md#arquitetura) e no [PDF arc42](../../docs/Carteira-Digital-Arquitetura-arc42-Entrega3.pdf).

## Tecnologias

- Node.js 24, NestJS 12 sobre Fastify
- `@nestjs/swagger` (Swagger em `/docs` e `openapi.json`) e class-validator
- `fetch` nativo para chamar os serviços
- Vitest 5: testes unitários e de arquitetura
- Na nuvem: Azure Container Apps atrás do AWS API Gateway, imagem `f4d3l/carteira-bff` no Docker Hub

## O que faz

- Proxy do CRUD de usuários (`/users`) para o `svc-identidade`.
- Proxy das carteiras (`/wallets`, depósito, saque, extrato, encerramento) para o `svc-carteira`.
- `GET /activity`: feed de eventos vindo da `fn-notificacoes`.
- `GET /aggregated-data`: usuários (MongoDB) + carteiras (Azure SQL) + score (Azure Function) numa única resposta, usada pelo Painel.
- Repassa os erros dos serviços com o mesmo status e mensagem; serviço fora do ar vira 502.

Swagger em `/docs`. O contrato é exportado para `openapi.json`, de onde o frontend gera os hooks.

## Como está organizado

Clean Architecture + Vertical Slice, como os serviços: portas para cada serviço em `domain/`, adaptadores HTTP (`fetch`) em `infrastructure/`, uma pasta por rota em `features/`.

## Rodando localmente

```bash
pnpm --filter bff dev            # porta 3000
pnpm --filter bff openapi        # regenera openapi.json após mudar rotas ou DTOs
```

Variáveis: `SVC_IDENTIDADE_URL` (padrão `:3001`), `SVC_CARTEIRA_URL` (padrão `:3002`), `FN_NOTIFICACOES_URL` (padrão `:7071`).

## Integrantes

| Nome | RA / Matrícula |
|---|---|
| Lucas Reali | 40092691 |
| Guilherme Fadel | 40101681 |
| Thiago Akimoto | 40090610 |
| Gabriel Conti | 40095589 |
