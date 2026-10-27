import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Architecture tests (ArchUnit-style): fail the build when a layer rule is broken.
// main.ts and app.module.ts are the composition root and may import anything.
const SRC = __dirname;
const FRAMEWORKS = /^(@nestjs\/|typeorm|mongoose|class-validator|class-transformer)/;
const VALIDATION = /^(class-validator|class-transformer|@nestjs\/swagger)/;

// Every non-spec file (including testing/ fakes), with each import resolved to a src-relative path (packages kept as-is)
const files = readdirSync(SRC, { recursive: true, encoding: 'utf8' })
  .filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'))
  .map((file) => ({
    file,
    imports: [...readFileSync(join(SRC, file), 'utf8').matchAll(/from '([^']+)'/g)].map(([, spec]) =>
      spec.startsWith('.') ? relative(SRC, resolve(SRC, dirname(file), spec)) : spec,
    ),
  }));

const violations = (filter: (file: string) => boolean, forbidden: (imp: string, file: string) => boolean) =>
  files
    .filter(({ file }) => filter(file))
    .flatMap(({ file, imports }) => imports.filter((imp) => forbidden(imp, file)).map((imp) => `${file} -> ${imp}`));

const featureOf = (path: string) => path.match(/^features\/([^/]+)/)?.[1];
const isEntity = (imp: string) => /^domain\/.+\.entity$/.test(imp);

describe('architecture', () => {
  it('every source file belongs to a known layer', () => {
    const layers = /^(domain|features|infrastructure|api|testing)\/|^(main|app\.module)\.ts$/;
    expect(files.map(({ file }) => file).filter((f) => !layers.test(f))).toEqual([]);
  });

  it('domain depends on nothing but itself', () => {
    expect(
      violations(
        (f) => f.startsWith('domain/'),
        (imp) => !imp.startsWith('domain/'),
      ),
    ).toEqual([]);
  });

  it('use cases (application) depend only on the domain and their own slice', () => {
    expect(
      violations(
        (f) => f.endsWith('.use-case.ts'),
        (imp, file) => !imp.startsWith('domain/') && !(featureOf(imp) === featureOf(file) && imp.endsWith('.use-case')),
      ),
    ).toEqual([]);
  });

  it('controllers depend on their own use case, DTOs and domain entities, never on service ports or adapters', () => {
    expect(
      violations(
        (f) => f.endsWith('.controller.ts'),
        (imp, file) => !imp.startsWith('@nestjs/') && featureOf(imp) !== featureOf(file) && !isEntity(imp),
      ),
    ).toEqual([]);
    expect(
      violations(
        (f) => f.endsWith('.controller.ts'),
        (imp) => imp.startsWith('infrastructure/') || (imp.startsWith('domain/') && !isEntity(imp)),
      ),
    ).toEqual([]);
  });

  it('DTOs depend only on validation/OpenAPI libraries and domain entities', () => {
    expect(
      violations(
        (f) => f.endsWith('.dto.ts'),
        (imp) => !VALIDATION.test(imp) && !isEntity(imp),
      ),
    ).toEqual([]);
  });

  it('a feature slice does not import another slice', () => {
    expect(
      violations(
        (f) => f.startsWith('features/'),
        (imp, file) => !!featureOf(imp) && featureOf(imp) !== featureOf(file),
      ),
    ).toEqual([]);
  });

  it('infrastructure does not depend on features or the API', () => {
    expect(
      violations(
        (f) => f.startsWith('infrastructure/'),
        (imp) => imp.startsWith('features/') || imp.startsWith('api/'),
      ),
    ).toEqual([]);
  });

  it('the API layer (error filter) depends only on Nest and the domain', () => {
    expect(
      violations(
        (f) => f.startsWith('api/'),
        (imp) => !imp.startsWith('@nestjs/') && !imp.startsWith('domain/'),
      ),
    ).toEqual([]);
  });

  it('test fakes implement domain ports without frameworks or infrastructure', () => {
    expect(
      violations(
        (f) => f.startsWith('testing/'),
        (imp) => FRAMEWORKS.test(imp) || /^(infrastructure|features|api)\//.test(imp),
      ),
    ).toEqual([]);
  });

  it('production code never imports the test fakes', () => {
    expect(
      violations(
        (f) => !f.startsWith('testing/'),
        (imp) => imp.startsWith('testing/'),
      ),
    ).toEqual([]);
  });
});
