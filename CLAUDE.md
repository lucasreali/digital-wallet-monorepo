# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Goal

This repo is the PUCPR "Arquitetura de Soluções com Cloud" PJBL final delivery (Entrega 3), a digital wallet. `docs/entrega.md` is the brief and its checklist is the definition of done. `docs/aulas/*.md` are the course slides, so they set how the work is graded. Every change should move an item on that checklist forward.

Required pieces and what exists today:

| Piece | Brief requires | Here | Status |
|---|---|---|---|
| Frontend | React SPA, talks **only** to the BFF | `apps/web` | Done; still needs a cloud deploy (the slides use Azure Static Web Apps) |
| BFF | Node/Nest, CRUD proxy + `GET /aggregated-data` (Mongo + SQL + Function in one response) | `apps/bff` | Only `aggregated-data` exists; CRUD proxy routes are missing |
| Microservice 1 | MongoDB Atlas, full CRUD + Swagger | `svc-identidade` (users) | Create + list only |
| Microservice 2 | Azure SQL, full CRUD + Swagger | `svc-carteira` (wallets) | Create + list only |
| Azure Function | HTTP trigger, calculation/enrichment | `fn-notificacoes` (`/api/insights`) | Exists |
| Events | Event-driven flow, shown in the video, with event docs ("Swagger — Eventos") | none | Missing. Plan: a service publishes an event (e.g. wallet created), a Function message trigger consumes it, documented with AsyncAPI/EventCatalog |
| API Gateway | AWS API Gateway in front of the BFF | none | Missing |
| Tests | Unit tests + architecture tests | none | Missing |
| Docker Hub | Image for every service + BFF | Dockerfiles exist | Not pushed |

Grading points from the slides:

- Clean Architecture: Domain → Application (use cases) → Infrastructure → API (controllers). Dependencies point inward, and controllers depend on use cases, never on repositories. Keep it pragmatic: the slides warn against interface overload on simple CRUD.
- Vertical Slice: one folder per use case (`CreateWallet`, `GetWallet`, ...). Keep each slice small and the shared code minimal.
- Architecture tests (the slides show ArchUnit): assert the layer rules, e.g. `domain/` imports nothing from Nest, TypeORM, Mongoose or `infrastructure/`.
- SOLID and Clean Code: constructor injection, DTOs separate from entities, explicit domain errors mapped to HTTP.
- Documentation goes in the PDF and lives outside the code: arc42 (`docs/Carteira-Digital-Arquitetura-arc42-1.pdf`), C4 (context, containers, components; Mermaid is fine), Software Architecture Canvas, and screenshots.
- Each repo/project README needs the architecture, the tech stack, how to run it locally and the student names. The video must use public cloud URLs, never `localhost`.

## Workspace

pnpm workspace (`apps/*`, `services/*`). Filter names: `web`, `bff`, `svc-identidade`, `svc-carteira`, `fn-notificacoes`.
pnpm enforces a minimum release age: very recent dependency versions get rejected (see `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`).

## Running locally

DBs in Docker, apps on the host:

- `docker compose up mongo-identidade sql-carteira sql-carteira-init`
- Every Nest app defaults to `PORT=3000`, so root `pnpm dev` clashes. BFF expects identidade on 3001 and carteira on 3002:
  - `PORT=3001 pnpm --filter svc-identidade dev`
  - `PORT=3002 DB_PASSWORD='Carteira@Local123' DB_TRUST_CERT=true pnpm --filter svc-carteira dev`
  - `pnpm --filter bff dev` (3000), `pnpm --filter web dev` (5173)
- `fn-notificacoes` `dev` only runs `tsc -w`; serving it needs `func start` (Azure Functions Core Tools, port 7071).
- Swagger UI on each Nest app at `/docs`.

## Generated code — never edit by hand

- `apps/web/src/gen/` (Kubb, wiped on every run) and `apps/web/src/routeTree.gen.ts` (TanStack Router).
- After changing any BFF endpoint or DTO, regenerate in order:
  1. `pnpm --filter bff openapi` (writes `apps/bff/openapi.json`, which is committed)
  2. `pnpm --filter web generate`
- OpenAPI comes from the `@nestjs/swagger` CLI plugin with `introspectComments`: document DTOs with `/** */` comments in `*.dto.ts`, not `@ApiProperty`. Hook names derive from method + controller name (`AggregatedDataController.get` → `getAggregatedData`).

## Architecture

- The web app talks only to the BFF, via the generated TanStack Query hooks (`#/gen/hooks`). The BFF calls services with plain `fetch`.
- Each Nest service:
  - `src/domain/`: entities and repository ports as abstract classes, with no Nest or DB imports
  - `src/infrastructure/`: TypeORM/Mongoose adapters
  - `src/features/<use-case>/`: controller + DTO
  - Ports are bound in `app.module.ts` (`{ provide: Port, useClass: Adapter }`).
- New features add an Application layer: a use-case class between controller and repository port. The existing features call repositories straight from controllers, which is legacy; don't copy that pattern.
- `docs/entrega.md` is the assignment brief. Check it for the required endpoints and deliverables.

## Conventions

- Write code, comments, docs and commit messages in English. Some existing comments are in Portuguese.
- No linter or formatter. Match the surrounding style: Nest code uses semicolons; web code uses no semicolons. Both use single quotes.
- No tests exist yet, and root `pnpm test` is a no-op. Unit and architecture tests are required deliverables (see Goal).
