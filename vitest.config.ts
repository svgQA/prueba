/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vite';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
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
              // 'preact/compat',
              // 'preact/hooks',
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
