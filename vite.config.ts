import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    root: 'src/__tests__',
    environment: 'jsdom',
    setupFiles: 'vitest.setup.ts',
    deps: {
      experimentalOptimizer: {
        include: [
          'preact/jsx-runtime',
          'preact/jsx-dev-runtime',
          'preact/test-utils',
          'preact/compat',
          'preact/hooks',
        ],
        enabled: true,
      },
    },
    coverage: {
      all: true,
    },
  },
  clearScreen: false,
  build: {
    chunkSizeWarningLimit: 50,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // if (id.includes('wouter')) {
          //   return '@router-bas';
          // }
          // if (id.includes('preact')) {
          //   return '@preact-bas';
          // }
          // if (id.includes('components')) {
          //   return '@components-loc';
          // }
        },
      },
    },
  },
  server: {
    strictPort: true,
    port: 3050,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [preact()],
});
