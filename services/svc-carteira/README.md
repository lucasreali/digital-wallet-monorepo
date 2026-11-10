# svc-carteira

Microsserviço de **carteiras** da Carteira Digital. Guarda carteiras, saldos e transações no **Azure SQL** e aplica as regras de dinheiro.

## Arquitetura

Microsserviço 2 (Database per Service): só ele acessa o Azure SQL (tabelas `wallets` e `transactions`). É chamado pelo BFF e pelo `svc-identidade`; publica os eventos da carteira na fila `wallet-events` do Azure Service Bus. Visão completa, com os diagramas C4, no [README da raiz](../../README.md#arquitetura) e no [PDF arc42](../../docs/Carteira-Digital-Arquitetura-arc42-Entrega3.pdf).

## Tecnologias

- Node.js 24, NestJS 12 sobre Fastify
- TypeORM 1.1 com o driver mssql e Azure SQL Database
- `@azure/service-bus` 7 para publicar eventos
- `@nestjs/swagger` e class-validator
- Vitest 5: testes unitários e de arquitetura
- Na nuvem: Azure Container Apps, imagem `f4d3l/carteira-svc-carteira` no Docker Hub

## O que faz

| Rota | Descrição |
|---|---|
| `GET /wallets?ownerId=` | Lista as carteiras (filtro opcional por dono) |
| `GET /wallets/:id` | Busca uma carteira |
| `POST /wallets` | Abre uma carteira (uma por usuário; 409 se já existir) |
| `POST /wallets/:id/deposit` | Deposita um valor |
| `POST /wallets/:id/withdraw` | Saca um valor (422 se o saldo não cobrir) |
| `DELETE /wallets/:id` | Encerra a carteira (409 se o saldo não for zero) |
| `GET /wallets/:id/transactions` | Extrato, do mais recente para o mais antigo |

Cada operação publica um evento na fila `wallet-events`: `WalletOpened`, `Deposit`, `Withdrawal` ou `WalletClosed`. Swagger em `/docs`.

## Como está organizado

Clean Architecture + Vertical Slice: as regras de saldo ficam no domínio (`domain/wallet.entity.ts`, cálculo em centavos), cada caso de uso tem sua pasta em `features/`, e o TypeORM e a fila ficam em `infrastructure/`. As tabelas são criadas pelo TypeORM (`synchronize`).

## Rodando localmente

```bash
docker compose up sql-carteira sql-carteira-init
PORT=3002 DB_PASSWORD='Carteira@Local123' DB_TRUST_CERT=true SERVICEBUS_CONNECTION_STRING='<connection string>' pnpm --filter svc-carteira dev
```

Variáveis: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_TRUST_CERT`, `SERVICEBUS_CONNECTION_STRING` (Azure Service Bus; sem ela, os eventos não são publicados).

## Integrantes

| Nome | RA / Matrícula |
|---|---|
| Lucas Reali | 40092691 |
| Guilherme Fadel | 40101681 |
| Thiago Akimoto | 40090610 |
| Gabriel Conti | 40095589 |
