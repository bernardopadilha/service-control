import react from '@vitejs/plugin-react'
import path from 'path'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import type { InlineConfig } from 'vitest'

export default defineConfig({
  plugins: [react()],
  resolve: {
    mainFields: ['browser', 'module', 'jsnext:main', 'jsnext'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
  server: {
    host: true,
  },
} as UserConfig & { test: InlineConfig })
