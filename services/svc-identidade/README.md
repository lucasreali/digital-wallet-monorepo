# svc-identidade

Microsserviço de **usuários** da Carteira Digital. Guarda nome e e-mail de cada usuário no **MongoDB** (Atlas na nuvem) e expõe um CRUD completo.

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
docker compose up mongo-identidade azurite
PORT=3001 AZURE_STORAGE_CONNECTION_STRING=UseDevelopmentStorage=true pnpm --filter svc-identidade dev
```

Variáveis: `MONGO_URL` (padrão `mongodb://localhost:27017/identidade`), `SVC_CARTEIRA_URL` (padrão `http://localhost:3002`), `AZURE_STORAGE_CONNECTION_STRING` (sem ela, os eventos não são publicados).
