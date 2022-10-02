import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8091,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext',
  },
});