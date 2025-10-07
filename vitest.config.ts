/// <reference types="vitest" />
import baseConfig from './vite.config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  typeof baseConfig === 'function'
    ? baseConfig({ mode: 'test', command: 'serve' })
    : baseConfig,
  defineConfig({
    test: {
      globals: true,
      root: 'src/__tests__',
      environment: 'jsdom',
      setupFiles: 'vitest.setup.ts',
      deps: {
        optimizer: {
          web: {
            enabled: true,
            include: [
              'preact/jsx-runtime',
              'preact/jsx-dev-runtime',
              'preact/test-utils',
            ],
          },
        },
      },
      coverage: {
        all: true,
      },
    },
  })
);
