import { defineConfig } from 'vite';

// Library build: Vite emits the JavaScript bundles (ESM + CJS); `tsc -p tsconfig.build.json` emits the types.
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      // With "type": "module" in package.json: es -> dist/index.js, cjs -> dist/index.cjs
      fileName: 'index',
    },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    sourcemap: true,
    // Ship readable code; consumers' bundlers minify for production.
    minify: false,
  },
});
