import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8091,
  },
  build: {
    outDir: 'build',
    target: 'esnext',
  },
});