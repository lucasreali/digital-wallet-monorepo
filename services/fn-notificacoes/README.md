# fn-notificacoes

**Azure Function** que consome os eventos do sistema e calcula informações derivadas deles.

## Arquitetura

Componente serverless: consome a fila `wallet-events` (gatilho de Service Bus), grava cada evento na Table Storage e expõe por HTTP o score e o feed de atividade, que o BFF consulta. Visão completa, com os diagramas C4, no [README da raiz](../../README.md#arquitetura) e no [PDF arc42](../../docs/Carteira-Digital-Arquitetura-arc42-Entrega3.pdf).

## Tecnologias

- Azure Functions v4, modelo de programação Node.js v4 (`@azure/functions` 4), Node.js 22
- Gatilho de Azure Service Bus e gatilhos HTTP
- `@azure/data-tables` 13 para a Azure Table Storage
- Vitest 5: testes unitários e de arquitetura
- Na nuvem: Azure Functions (`func-pjbl-cd`); a imagem `f4d3l/carteira-fn-notificacoes` no Docker Hub serve para rodar com Docker

## O que faz

| Função | Gatilho | Descrição |
|---|---|---|
| `walletEvents` | Fila do Service Bus `wallet-events` | Recebe cada evento publicado pelos microsserviços e grava na tabela `events` (Table Storage) |
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

## Integrantes

| Nome | RA / Matrícula |
|---|---|
| Lucas Reali | 40092691 |
| Guilherme Fadel | 40101681 |
| Thiago Akimoto | 40090610 |
| Gabriel Conti | 40095589 |
