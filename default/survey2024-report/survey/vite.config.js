import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'survey-report-2024.js',
        chunkFileNames: 'survey-report-2024.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'survey-report-2024.css'
          }
          return assetInfo.name
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: false,
    chunkSizeWarningLimit: 2000
  }
})
