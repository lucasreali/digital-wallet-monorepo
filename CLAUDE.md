# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- No tests exist yet, and root `pnpm test` is a no-op.
