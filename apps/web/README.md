# web

Frontend da Carteira Digital: uma SPA em **React** (TanStack Start/Router, Query, Form e Table) que conversa **apenas com o BFF**.

## O que faz

- **Painel**: indicadores, score financeiro, atividade recente (dados de `/aggregated-data`).
- **Usuários**: listar, criar, editar e excluir; detalhe com ou sem carteira.
- **Carteiras**: listar e abrir; detalhe com saldo, depósito, saque, extrato e encerramento.
- **Atividade**: feed dos eventos do sistema.
- **Sobre o sistema**: os componentes da arquitetura.

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
