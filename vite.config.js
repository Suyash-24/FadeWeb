import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [
    {
      name: 'clean-urls',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && !req.url.includes('.') && req.url !== '/' && !req.url.startsWith('/@')) {
            const [pathname, search] = req.url.split('?');
            req.url = `${pathname}.html${search ? `?${search}` : ''}`;
          }
          next();
        });
      },
    },
  ],
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
