# svc-carteira

Microsserviço de **carteiras** da Carteira Digital. Guarda carteiras, saldos e transações no **Azure SQL** e aplica as regras de dinheiro.

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
