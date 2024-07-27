import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react()
  ],

  build: {
    outDir: "../build",
  },

  server: {
    host: true,
    port: 3000,
    hmr: {
      host: 'localhost',
      protocol: 'wss',
      path: '/vite-development-wss'
    }
  }
})
