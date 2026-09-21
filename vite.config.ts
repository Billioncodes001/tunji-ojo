import { defineConfig } from 'vite';
import { siteConfig } from './scripts/site-config.ts';

export default defineConfig({
  base: process.env.SITE_URL || process.env.SITE_BASE ? siteConfig().base : '/',
  build: {
    target: 'es2022',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion';
          return undefined;
        },
      },
    },
  },
});
