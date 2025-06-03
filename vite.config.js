import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'pages/privacy.html'),
        cookie: resolve(__dirname, 'pages/cookie-policy.html'),
        notFound: resolve(__dirname, 'pages/404.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  // Configurazione per gestire correttamente i file statici
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@foto': resolve(__dirname, './FOTO2')
    }
  }
})