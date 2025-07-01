import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      "@src": "/src",
      "@components": "/src/components",
      "@domain": "/src/domain",
      "@data": "/src/data",
      "@utils": "/src/utils"
    }
  }
})