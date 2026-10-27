# TODO — Entrega 3 (code)

What is still missing in the code for the delivery. Each item says **what** to do; the implementing agent decides **how**
(names, fields, status codes, libraries), following `CLAUDE.md` (TDD, Clean Architecture, Vertical Slice, Biome) and
`docs/prototype.html` for the UI. Source of truth: `docs/entrega.md`.

## 1. svc-identidade (users, MongoDB) — full CRUD

- [x] Get one user by id
- [x] Update a user
- [x] Delete a user (the prototype says the API refuses the deletion while the user still owns a wallet)
- [x] Publish a `UserCreated` event when a user is created
- [x] Domain errors for every new rule, mapped to HTTP by the existing filter
- [x] Unit specs for every new use case (happy path + each domain error)
- [x] Swagger documents every endpoint and DTO

## 2. svc-carteira (wallets, Azure SQL) — full CRUD + business rules

- [x] Get one wallet by id
- [x] Deposit into a wallet
- [x] Withdraw from a wallet (cannot leave a negative balance)
- [x] Close/delete a wallet
- [x] Wallet transactions (deposits and withdrawals) are persisted and can be listed per wallet
- [x] Publish `WalletOpened`, `Deposit`, `Withdrawal` and `WalletClosed` events
- [x] Domain errors for every new rule, mapped to HTTP by the existing filter
- [x] Unit specs for every new use case (happy path + each domain error)
- [x] Swagger documents every endpoint and DTO

## 3. Events (event-driven flow)

- [x] Pick a message broker the Azure Function can trigger from, and add it to local `docker compose` if it has an emulator
- [x] Both services publish their events to it
- [x] Azure Function with a message trigger that consumes those events
- [x] The consumed events feed the financial score (0 to 1000) and the activity feed
- [x] Event documentation ("Swagger — Eventos"): every event, its channel and its payload (AsyncAPI or EventCatalog)

## 4. fn-notificacoes (Azure Function)

- [x] Replace the fixed `/api/insights` value with a real calculation based on the consumed events
- [x] HTTP endpoint that exposes the activity feed (recent events)
- [x] Unit tests for the calculation logic

## 5. BFF

- [x] CRUD proxy routes for users (list, get, create, update, delete)
- [x] CRUD proxy routes for wallets (list, get, open, deposit, withdraw, close, transactions)
- [x] Proxy route for the activity feed
- [x] `GET /aggregated-data` keeps returning Mongo + SQL + Function data in one response, with typed DTOs instead of `object`
- [x] Errors from the services reach the frontend with the right status and message
- [x] Swagger documents every route
- [x] Clean Architecture + Vertical Slice layout, like the services
- [x] Unit tests and architecture tests (add a Vitest project for it)
- [x] Regenerate `openapi.json` and the web client after the changes

## 6. Frontend (apps/web)

Build every screen from `docs/prototype.html`, using only the generated hooks (talks only to the BFF).

- [x] Layout: sidebar (desktop) and bottom nav (mobile), light and dark theme
- [x] Dashboard (Painel): data from `/aggregated-data`, score gauge, recent activity
- [x] Users: list, create, edit, delete (with the API refusal shown)
- [x] User detail: with and without a wallet
- [x] Wallets: list and open a wallet
- [x] Wallet detail: balance, deposit, withdraw, transactions, close
- [x] Activity: event feed
- [x] About the system (Sobre o sistema): the architecture components
- [x] Loading, empty, error and success states on every screen
- [x] Forms validated before sending
- [ ] Production build points to the API Gateway URL, not `localhost`

## 7. Architecture and quality

- [ ] `architecture.spec.ts` in every backend package covers every layer and folder that exists
- [ ] No controller depends on a repository; no slice imports another slice
- [ ] Code, comments and messages in English (translate the Portuguese ones)
- [ ] `pnpm test`, `pnpm check` and every package `build` pass

## 8. Cloud deploy (public URLs for the video)

- [ ] MongoDB Atlas (free tier) database, used by svc-identidade
- [ ] Azure SQL Database (free), used by svc-carteira, with its schema created
- [ ] svc-identidade, svc-carteira and BFF running in the cloud from their Docker Hub images
- [ ] Azure Function app deployed (HTTP and message triggers)
- [ ] Message broker provisioned in the cloud
- [ ] AWS API Gateway in front of the BFF (routing + some security, e.g. CORS/throttling/key)
- [ ] Frontend deployed (Azure Static Web Apps) calling the API Gateway
- [ ] Swagger of the BFF and of each service reachable by public URL
- [ ] Event docs published at a public URL
- [ ] Secrets and URLs come from environment variables, never committed

## 9. Docker Hub

- [ ] Image for svc-identidade, svc-carteira, BFF and the Function, tagged and pushed
- [ ] Every image builds and starts with only env vars

## 10. Repositories and READMEs

- [ ] Public GitHub repository (or one per project, as the brief's table asks)
- [ ] README in each project: architecture, tech stack, how to run locally, student names
- [ ] Root README updated with the public URLs (frontend, gateway, Swaggers, event docs, Docker Hub)
