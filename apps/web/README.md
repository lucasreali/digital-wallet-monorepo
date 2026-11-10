# web

Frontend da Carteira Digital: uma SPA em **React** (TanStack Start/Router, Query, Form e Table; componentes acessíveis do **Base UI**) que conversa **apenas com o BFF**.

## Arquitetura

Primeira camada do fluxo: o navegador carrega a SPA servida pelo Container App `web`, e todas as chamadas vão para o AWS API Gateway, que as repassa ao BFF. O frontend não conhece os microsserviços nem a Function. Visão completa, com os diagramas C4, no [README da raiz](../../README.md#arquitetura) e no [PDF arc42](../../docs/Carteira-Digital-Arquitetura-arc42-Entrega3.pdf).

## Tecnologias

- React 19 (SPA) com TanStack Start, Router, Query, Form e Table
- Base UI (componentes acessíveis) e Tailwind CSS 4
- Kubb 5: tipos, cliente `fetch`, hooks do TanStack Query e schemas zod gerados do `openapi.json` do BFF
- Vite 8 e Node.js 24 (imagem `node:24-alpine`)
- Na nuvem: Azure Container Apps, imagem `f4d3l/carteira-web` no Docker Hub

## O que faz

- **Painel**: indicadores, score financeiro, atividade recente (dados de `/aggregated-data`).
- **Usuários**: listar, criar, editar e excluir; detalhe com ou sem carteira.
- **Carteiras**: listar e abrir; detalhe com saldo, depósito, saque, extrato e encerramento.
- **Atividade**: feed dos eventos do sistema.

Layout com menu lateral (desktop) e barra inferior (celular), tema claro e escuro, seguindo `docs/prototype.html`.

## Como está organizado

As chamadas à API usam hooks gerados pelo Kubb a partir do `openapi.json` do BFF (`src/gen/`, nunca editar à mão). Rotas em `src/routes/`, componentes em `src/components/`, telas que fazem mutações em `src/features/`.

## Rodando localmente

```bash
cp apps/web/.env.example apps/web/.env
pnpm --filter web dev        # porta 5173
pnpm --filter web generate   # regenera os hooks após mudar o BFF
```

`VITE_BFF_URL` define a URL da API; no build de produção deve apontar para o API Gateway.

## Integrantes

| Nome | RA / Matrícula |
|---|---|
| Lucas Reali | 40092691 |
| Guilherme Fadel | 40101681 |
| Thiago Akimoto | 40090610 |
| Gabriel Conti | 40095589 |
