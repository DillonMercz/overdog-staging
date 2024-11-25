import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/overdog-staging/', // Add base URL for GitHub Pages
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
