import { defineConfig } from 'vitest/config';

// One Vitest for the whole monorepo; each backend package runs as its own project (name = package.json name)
export default defineConfig({
  test: {
    projects: ['services/*', 'apps/bff'],
    passWithNoTests: true,
  },
});
