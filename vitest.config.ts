import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Enable globals for backward compatibility
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'src/**/*.d.ts'],
      reporter: ['text', 'json', 'html'],
      all: true,
    } as any,
  },
});
