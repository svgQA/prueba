import { defineConfig, loadEnv } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      preact(),
      visualizer({
        open: false, // Abre el reporte automáticamente en el navegador
        filename: 'stats.html', // Nombre del archivo de salida
        // gzip: true, // Mostrar tamaño con gzip
        brotliSize: true, // Mostrar tamaño con Brotli
      }),
    ],
    define: {
      global: 'globalThis',
      __APP_VERSION__: JSON.stringify(pkg.version),
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    base: '/',
    clearScreen: false,
    build: {
      chunkSizeWarningLimit: 50,
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            const prioritizedChunks: Array<{
              name: string;
              test: (id: string) => boolean;
            }> = [
              {
                name: '@maps',
                test: (target) =>
                  /react-google-maps|maplibre-gl|mapbox-gl|ol\/|ol\//.test(target),
              },
              { name: '@lodash', test: (target) => target.includes('lodash') },
              { name: '@pdf', test: (target) => /jspdf|pdf-lib|pako/.test(target) },
              {
                name: '@tanstack',
                test: (target) => target.includes('tanstack'),
              },
              { name: '@qrcode', test: (target) => target.includes('qrcode') },
              { name: '@dnd-kit', test: (target) => target.includes('dnd-kit') },
              {
                name: '@aws-amplify',
                test: (target) => target.includes('aws-amplify'),
              },
              { name: '@charts', test: (target) => /chart|apexcharts/.test(target) },
              { name: '@excel', test: (target) => target.includes('exceljs') },
              {
                name: '@forms',
                test: (target) => target.includes('react-final'),
              },
              {
                name: '@calendar',
                test: (target) => target.includes('@fullcalendar'),
              },
              { name: '@sockets', test: (target) => target.includes('socket.io-client') },
              { name: '@phoenix', test: (target) => target.includes('phoenix') },
              {
                name: '@pdfme',
                test: (target) => target.includes('@pdfme'),
              },
              { name: '@reactflow', test: (target) => target.includes('reactflow') },
              {
                name: '@grafana',
                test: (target) => target.includes('grafana'),
              },
            ];

            const matchingChunk = prioritizedChunks.find(({ test }) => test(id));
            if (matchingChunk) {
              return matchingChunk.name;
            }

            if (id.includes('node_modules')) {
              const pnpmMatch = id.match(/node_modules\/\.pnpm\/([^/]+)\/node_modules\/([^/]+)/);
              if (pnpmMatch) {
                const [_, encodedName, nestedPkg] = pnpmMatch;
                // encodedName: "@scope+pkg@1.0.0" or "pkg@1.0.0"
                const decodedName = encodedName
                  .replace(/^@/, '')
                  .replace(/\+.*/, '-')
                  .replace(/@.*/, '');
                return `vendor-${decodedName || nestedPkg}`;
              }

              const [, scope = '', pkg = ''] = id.match(
                /node_modules\/(?:@([^/]+)\/)?([^/]+)/,
              ) ?? [];
              const cleanedScope = scope ? `${scope}-` : '';
              return `vendor-${cleanedScope}${pkg}`;
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
  };
});
