import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.js',
      name: 'math',
      formats: ['iife'],
      fileName: () => 'math.js'
    },
    outDir: 'lib/browser',
    sourcemap: true,
    emptyOutDir: false
  }
})
