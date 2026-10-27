import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Architecture tests (ArchUnit-style). Layers: functions/ (triggers), event-store.ts (Table Storage adapter),
// events.ts and score.ts (pure logic)
const SRC = __dirname;
const LOGIC = ['events.ts', 'score.ts'];

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

describe('architecture', () => {
  it('every source file belongs to a known layer', () => {
    expect(
      files
        .map(({ file }) => file)
        .filter((f) => !f.startsWith('functions/') && ![...LOGIC, 'event-store.ts'].includes(f)),
    ).toEqual([]);
  });

  it('pure logic depends on nothing but other pure logic', () => {
    expect(
      violations(
        (f) => LOGIC.includes(f),
        (imp) => !LOGIC.includes(`${imp}.ts`),
      ),
    ).toEqual([]);
  });

  it('the storage adapter does not depend on the triggers', () => {
    expect(
      violations(
        (f) => f === 'event-store.ts',
        (imp) => imp.startsWith('functions/'),
      ),
    ).toEqual([]);
  });

  it('a function trigger does not import another trigger', () => {
    expect(
      violations(
        (f) => f.startsWith('functions/'),
        (imp) => imp.startsWith('functions/'),
      ),
    ).toEqual([]);
  });
});
