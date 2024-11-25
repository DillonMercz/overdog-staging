import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Updated for custom domain
  plugins: [react()],
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
