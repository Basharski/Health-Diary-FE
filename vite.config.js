import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        fetch: resolve(__dirname, 'fetchtestaus.html'),
        login: resolve(__dirname, 'src/auth/login.html'),
        bmi: resolve(__dirname, 'src/bmi/index.html'),
        about: resolve(__dirname, 'src/about/index.html'),
        contact: resolve(__dirname, 'src/contact/index.html'),
        entries: resolve(__dirname, 'src/entries/index.html'),
      },
    },
  },
  base: './', /* This ensures Vite uses relative paths for assets */
});