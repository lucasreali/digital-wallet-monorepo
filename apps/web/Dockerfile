# Build a partir da raiz: docker build -f apps/web/Dockerfile --build-arg VITE_BFF_URL=https://<api-gateway> .
FROM node:24-alpine AS build
# Inlined into the bundle at build time: the URL the browser uses to call the BFF
ARG VITE_BFF_URL=http://localhost:3000
RUN npm i -g pnpm@12.14.0
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile --filter "web..."
RUN pnpm --filter web build

FROM node:24-alpine
WORKDIR /app
ENV PORT=3000
COPY --from=build /repo/apps/web/.output .
EXPOSE 3000
CMD ["node", "server/index.mjs"]
