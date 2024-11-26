import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle: async () => {
        // Copy 404.html to dist after build
        const src = path.resolve('404.html')
        const dest = path.resolve('dist/404.html')
        await fs.promises.copyFile(src, dest)
      }
    }
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:8888',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
