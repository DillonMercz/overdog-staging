import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'copy-files',
      enforce: 'post',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: '404.html',
          source: require('fs').readFileSync('404.html', 'utf-8')
        });
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
    },
    fs: {
      strict: true,
    }
  },
  preview: {
    port: 5173,
    strictPort: true,
  }
})
