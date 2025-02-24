import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    visualizer({
      open: true, // Abre el reporte automáticamente en el navegador
      filename: 'stats.html', // Nombre del archivo de salida
      // gzip: true, // Mostrar tamaño con gzip
      brotliSize: true, // Mostrar tamaño con Brotli
    }),
  ],
  base: '/',
  clearScreen: false,
  build: {
    chunkSizeWarningLimit: 50,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // if (id.includes('wouter')) {
          //   return '@router-base';
          // }
          // if (id.includes('preact')) {
          //   return '@preact-base';
          // }
          // if (id.includes('components/common')) {
          //   return '@components-common-base';
          // }
          // if (id.includes('components/compose')) {
          //   return '@components-compose-base';
          // }
          // if (id.includes('utils')) {
          //   return '@utils-base';
          // }
          // if (id.includes('assets')) {
          //   return '@assets-base';
          // }
          if (id.includes('react-google-maps')) {
            return '@google-base'; // 148.81 kB
          }
          if (id.includes('lodash')) {
            return '@lodash-base'; // 98.54 kB
          }
          if (id.includes('jspdf')) {
            return '@jspdf-base'; // 358.25 kB
          }
          if (id.includes('tanstack')) {
            return '@tanstack-base'; // 55.80 kB
          }
          if (id.includes('qrcode')) {
            return '@qrcode-base'; // 24.56 kB
          }
          if (id.includes('dnd-kit')) {
            return '@dnd-kit-base'; // 67.50 kB
          }
          if (id.includes('aws-amplify')) {
            return '@aws-amplify-base'; // 413.17 kB
          }
          // if (id.includes('chart')) {
          //   return '@chart-base';
          // }
          if (id.includes('final-form')) {
            return '@final-form-base'; // 30.90 kB
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
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
});
