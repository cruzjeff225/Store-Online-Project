import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['tailwindcss'],
  },
  server: {
    proxy: {
      '/ws': {
        target: 'http://localhost:3000', // Tu backend
        ws: true,
        changeOrigin: true
      }
    }
  }
})