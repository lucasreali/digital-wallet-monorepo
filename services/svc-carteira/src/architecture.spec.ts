import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Architecture tests (ArchUnit-style): fail the build when a layer rule is broken
const SRC = __dirname;
const FRAMEWORKS = /^(@nestjs\/|@azure\/|typeorm|mongoose|mssql|class-validator|class-transformer)/;

// Production files only, with each import resolved to a src-relative path (packages kept as-is)
const files = readdirSync(SRC, { recursive: true, encoding: 'utf8' })
  .filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts') && !f.startsWith('testing/'))
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

describe('architecture', () => {
  it('domain depends on nothing but itself', () => {
    expect(
      violations(
        (f) => f.startsWith('domain/'),
        (imp) => !imp.startsWith('domain/'),
      ),
    ).toEqual([]);
  });

  it('use cases (application) do not depend on frameworks, infrastructure or the API', () => {
    expect(
      violations(
        (f) => f.endsWith('.use-case.ts'),
        (imp) =>
          FRAMEWORKS.test(imp) ||
          imp.startsWith('infrastructure/') ||
          imp.startsWith('api/') ||
          /\.(controller|dto)$/.test(imp),
      ),
    ).toEqual([]);
  });

  it('controllers depend on use cases, never on repositories', () => {
    expect(
      violations(
        (f) => f.endsWith('.controller.ts'),
        (imp) => imp.endsWith('.repository') || imp.startsWith('infrastructure/'),
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
});
