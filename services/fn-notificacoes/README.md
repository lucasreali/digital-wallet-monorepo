# fn-notificacoes

**Azure Function** que consome os eventos do sistema e calcula informações derivadas deles.

## O que faz

| Função | Gatilho | Descrição |
|---|---|---|
| `wallet-events` | Fila (Service Bus `wallet-events`) | Recebe cada evento publicado pelos microsserviços e grava na tabela `events` (Table Storage) |
| `insights` | HTTP `GET /api/insights?ownerId=` | Score financeiro de 0 a 1000: proporção de depósitos sobre o total movimentado (500 sem movimentação) |
| `activity` | HTTP `GET /api/activity?limit=` | Feed de atividade: os eventos mais recentes primeiro |

Os eventos e seus payloads estão documentados em `docs/events/asyncapi.yaml`.

## Como está organizado

A lógica fica em módulos puros e testados (`events.ts`, `score.ts`), o acesso à Table Storage em `event-store.ts`, e os handlers em `functions/` são finos.

## Rodando localmente

Requer o [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local).

```bash
docker compose up azurite
cp services/fn-notificacoes/local.settings.example.json services/fn-notificacoes/local.settings.json
pnpm --filter fn-notificacoes build
cd services/fn-notificacoes && func start   # porta 7071
```
