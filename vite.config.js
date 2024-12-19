import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [preact()],
    base: '',
    clearScreen: false,
    build: {
        chunkSizeWarningLimit: 50,
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    // if (id.includes('wouter')) {
                    //     return '@router-bas';
                    // }
                    // if (id.includes('preact')) {
                    //     return '@preact-bas';
                    // }
                    // if (id.includes('components')) {
                    //   return '@components-loc';
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
            '&': path.resolve(__dirname, './src/pages/settings'),
            $: path.resolve(__dirname, 'src/services'),
        },
    },
});
