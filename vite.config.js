/* vue-untitled / 2025-05-13 / gis@jou.edu.cn */
import vue from '@vitejs/plugin-vue';
import {defineConfig} from 'vite';
import {resolve} from 'path';

// https://vite.dev/config/

const host = 'localhost';
const root = './';
const base = './';
const file = 'index.html';
const main = `${root}${file}`;

const define = {};
const resolvealias = {
    alias: {
        '@': resolve(__dirname, 'public'),
        '@views': resolve(__dirname, 'src/views'),
        '@stores': resolve(__dirname, 'src/stores'),
        '@components': resolve(__dirname, 'src/components'),
    }
};

const server = {
    host: host,
    port: 5173,
    open: false,
    watch: {
        usePolling: true,
        disableGlobbing: false,
    },
};

const build = {
    manifest: true,
    emptyOutDir: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 4096,
    rollupOptions: {
        input: {
            main: resolve(main),
        },
        output: {
            entryFileNames: '[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash][extname]',
        },
    },
};

const preview = {
    host: host,
    port: 4173,
    open: false,
};
/*---------------------------------------------------------*/
const config = {
    root: root,
    base: base,
    define: define,
    resolve: resolvealias,
    plugins: [vue()],
    server: server,
    build: build,
    preview: preview,
};
console.log('/* vue-untitled / gis@jou.edu.cn */');
const viteConfig = defineConfig(config);
export default viteConfig;
