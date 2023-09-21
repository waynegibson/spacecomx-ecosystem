import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  const isProd = !options.watch

  return {
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    minify: isProd,
    sourcemap: true
  }
})
