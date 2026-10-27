# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Goal

This repo is the PUCPR "Arquitetura de Soluções com Cloud" PJBL final delivery (Entrega 3), a digital wallet. `docs/entrega.md` is the brief and its checklist is the definition of done. `docs/aulas/*.md` are the course slides, so they set how the work is graded. Every change should move an item on that checklist forward.

**No proactivity.** Do only what the user asked or what `docs/entrega.md` requires. Do not add pages, screens, features, endpoints, files or "nice to have" extras on your own initiative, even if they seem helpful for the video or the grade. If you think something extra is worth it, suggest it in one line and wait for a yes. Use file names exactly as the user gives them.

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
| Tests | Unit tests + architecture tests | One root Vitest (`vitest.config.ts`, one project per backend package); use-case specs + `src/architecture.spec.ts` in both services | Covers existing slices; every new slice adds its own (see TDD) |
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
- `docker compose up azurite` for the event broker (Storage Queue `wallet-events`) and the Function's Table Storage; on the host use `AZURE_STORAGE_CONNECTION_STRING=UseDevelopmentStorage=true`
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
- UI: `docs/prototype.html` is the design prototype (open it in a browser). Build every web interface from it: same screens, layout, components and styling.
- Each Nest service (`svc-identidade`, `svc-carteira`) follows the same layout; `create-user` / `create-wallet` are the reference slices:

  ```
  src/
    domain/                     # Domain: entities, repository ports (abstract classes), errors.ts. Imports nothing outside domain/
    features/<use-case>/        # one vertical slice per use case (create-user, get-user, update-user, ...)
      <use-case>.use-case.ts    # Application: plain class, `execute(input)`, depends only on domain ports. No Nest/DB imports
      <use-case>.use-case.spec.ts
      <use-case>.controller.ts  # API: HTTP only, injects the use case (never a repository)
      <use-case>.dto.ts         # API: request DTO with class-validator, separate from the entity
    infrastructure/             # Infrastructure: TypeORM/Mongoose adapters implementing the ports
    api/domain-error.filter.ts  # maps DomainError -> HTTP (NotFoundError 404, ConflictError 409, other DomainError 422)
    testing/                    # in-memory repository fakes for unit tests
    architecture.spec.ts        # layer rules (ArchUnit-style)
  ```

- Wiring in `app.module.ts`: ports with `{ provide: Port, useClass: Adapter }`; use cases with a factory (`{ provide: UseCase, useFactory: (repo: Port) => new UseCase(repo), inject: [Port] }`) so they carry no `@Injectable()`.
- Business rules throw domain errors from `domain/errors.ts` (subclass them for specific cases); never throw `HttpException` outside controllers.
- A slice never imports another slice. Code shared by two slices goes in `domain/`.
- The use-case input is a plain type (`CreateUserInput`), not the DTO; the DTO only has to be structurally compatible.
- `docs/entrega.md` is the assignment brief. Check it for the required endpoints and deliverables.

## TDD workflow (mandatory)

Development here is test-driven. For every new use case, business rule or bug fix:

1. **Red**: write the spec first (`<use-case>.use-case.spec.ts`) against the in-memory fake from `src/testing/`. If the use case needs a new port method, add it to the port and the fake. Run `pnpm test --project <name>` and see it fail for the expected reason.
2. **Green**: write the smallest use case that passes. Then the controller + DTO, the adapter method and the factory in `app.module.ts`.
3. **Refactor** with the tests green. Finish with `pnpm test`, `pnpm check` and `pnpm --filter <name> build`, then commit.

- Unit tests target use cases and domain logic; they never touch a real DB or Nest DI. Instantiate with `new UseCase(new InMemoryXRepository())`.
- Cover the happy path and every domain error the use case can throw (assert the error class, e.g. `rejects.toThrow(NotFoundError)`).
- `architecture.spec.ts` must stay green. If it fails, fix the dependency, not the rule. When adding a new layer or folder, add its rule there.
- Bug fixes start with a failing test that reproduces the bug.

## Conventions

- Write code, comments, docs and commit messages in English. Some existing comments are in Portuguese.
- Biome formats and lints the whole repo (`biome.json` at the root): single quotes, 2 spaces, 120 columns, semicolons in Nest code and none in `apps/web`. Run `pnpm check` (format + lint + sorted imports, with fixes) before every commit; `pnpm lint` and `pnpm format` run each part alone. Generated code, Markdown and YAML are ignored.
- Tests use a single Vitest installed at the root (the repo is delivered as a monorepo). `pnpm test` runs every project; `pnpm test:watch --project <name>` for the TDD loop. Packages have no `test` script of their own. Specs live next to the code as `*.spec.ts` and are excluded from the build (`tsconfig.build.json` in the Nest services, `exclude` in `fn-notificacoes`).
