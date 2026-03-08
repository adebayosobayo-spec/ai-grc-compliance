import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Raise the warning threshold — Three.js vendor chunk will sit just under this
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Three.js + react-three ecosystem → dedicated vendor chunk
          if (id.includes('node_modules/three') ||
            id.includes('node_modules/@react-three')) {
            return 'vendor-three'
          }
          // Recharts + d3 deps → chart vendor chunk
          if (id.includes('node_modules/recharts') ||
            id.includes('node_modules/d3-') ||
            id.includes('node_modules/victory-vendor')) {
            return 'vendor-charts'
          }
          // React router → router chunk
          if (id.includes('node_modules/react-router') ||
            id.includes('node_modules/@remix-run')) {
            return 'vendor-router'
          }
          // Remaining node_modules → general vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
})
