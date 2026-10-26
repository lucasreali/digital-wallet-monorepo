# Build a partir da raiz: docker build -f services/fn-notificacoes/Dockerfile .
FROM node:22-alpine AS build
RUN npm i -g pnpm@12.14.0
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile --filter "fn-notificacoes..."
RUN pnpm --filter fn-notificacoes build && pnpm --filter fn-notificacoes deploy --prod /out

FROM mcr.microsoft.com/azure-functions/node:4-node22
ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true
COPY --from=build /out /home/site/wwwroot
