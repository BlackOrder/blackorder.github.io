import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static SPA served at the domain root (blackorder.dev) on GitHub Pages.
// Static pre-rendering (SSG) is provided by vite-react-ssg (see package.json `build`),
// which emits fully-rendered HTML + meta tags into dist/ for SEO and link previews.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020',
  },
});
