import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: '/',
  clearScreen: false,
  build: {
    chunkSizeWarningLimit: 50,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('wouter')) {
            return '@router-base';
          }
          if (id.includes('preact')) {
            return '@preact-base';
          }
          if (id.includes('components/common')) {
            return '@components-common-base';
          }
          if (id.includes('components/compose')) {
            return '@components-compose-base';
          }
          if (id.includes('utils')) {
            return '@utils-base';
          }
          if (id.includes('assets')) {
            return '@assets-base';
          }
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
      '&': path.resolve(__dirname, './src/pages/settings'),
      $: path.resolve(__dirname, 'src/services'),
    },
  },
});
