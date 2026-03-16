import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: [],
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // server-only is a Next.js build guard — stub it out in test environment
      'server-only': path.resolve(__dirname, 'src/__mocks__/server-only.ts'),
    },
  },
})
