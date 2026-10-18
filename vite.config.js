import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'src/index.html'),
        commands: resolve(import.meta.dirname, 'src/commands.html'),
        faq: resolve(import.meta.dirname, 'src/faq.html'),
        docs: resolve(import.meta.dirname, 'src/docs.html'),
        pricing: resolve(import.meta.dirname, 'src/pricing.html'),
        changelog: resolve(import.meta.dirname, 'src/changelog.html'),
        legal: resolve(import.meta.dirname, 'src/legal.html'),
        notfound: resolve(import.meta.dirname, 'src/404.html'),
      },
    },
  },
})
