import { defineConfig } from 'tsdown'

export default defineConfig([
  // {
  //   // ESM build mirrors source structure for subpath exports
  //   entry: ['src/**/*.js', 'src/**/*.mjs', 'src/**/*.cjs'],
  //   format: 'esm',
  //   outDir: 'lib/esm',
  //   sourcemap: false,
  //   target: 'es2019',
  //   platform: 'node',
  //   minify: true,
  //   dts: false
  // },
  // {
  //   // CJS build mirrors source structure for subpath exports
  //   entry: ['src/**/*.js', 'src/**/*.mjs', 'src/**/*.cjs'],
  //   format: 'cjs',
  //   outDir: 'lib/cjs',
  //   sourcemap: false,
  //   target: 'es2019',
  //   platform: 'node',
  //   minify: true,
  //   dts: false
  // },
  //  {
  //   entry: ['src/**/*.js', 'src/**/*.mjs', 'src/**/*.cjs'],
  //   platform: "browser",
  //   name: "base",
  //   outDir: 'lib/X',  
  //   exports: false
  // },
  // {
  //   entry: ['src/index.js'],
  //   format: "iife",
  //   name: "math",  
  //   platform: "browser",
  //   sourcemap: true,
  //   exports: false,
  //   external: [],
  //   // minify: true,
  //   outputOptions: {
  //     file: "lib/math.iife.js",
  //     name: "math"
  //   }
    
  // },
  // {
  //   entry: ['src/index.js'],
  //   format: "umd",
  //   name: "math",
  //   platform: "browser",
  //   sourcemap: true,
  //   exports: false,
  //   minify: true,
  //   external: [],
  //   // outExtensions,
  //   outputOptions: {
  //     file: "lib/math.umd.js",
  //     name: "math"
  //   }
  // },
  {
    entry: ['src/**/*.js', 'src/**/*.mjs', 'src/**/*.cjs'],
    format: "esm",
    name: "esm",
    platform: "node",
    target: 'es2019',
    outDir: "lib/esm",
    unbundle: true
  },
  {
    entry: ['src/**/*.js', 'src/**/*.mjs', 'src/**/*.cjs'],
    format: "commonjs",
    name: "cjs",
    platform: "node",
    target: 'es2019',  
    outDir: "lib/cjs",
    unbundle: true
  }
])
