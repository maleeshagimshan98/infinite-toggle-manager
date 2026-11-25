# Library build & config rules

Rules for how `infinite-toggle-manager` is built, typed, linted and published. They apply to anyone changing
`package.json`, `vite.config.ts`, the `tsconfig*.json` files or `eslint.config.mjs`. Each rule explains why it exists,
so you can tell when an exception would actually be safe.

## How the pieces fit

| Tool                                 | Job                                                               | Output                                        |
| ------------------------------------ | ----------------------------------------------------------------- | --------------------------------------------- |
| Vite (library mode)                  | Bundle `src/index.ts` into JavaScript                             | `dist/index.js` (ESM), `dist/index.cjs` (CJS) |
| `tsc -p tsconfig.build.json`         | Emit type declarations only                                       | `dist/types/**/*.d.ts`                        |
| `tsc -p tsconfig.json` (`typecheck`) | Type-check `src/`, `test/` and `vite.config.ts`, emitting nothing | none                                          |
| ts-jest (`tsconfig.test.json`)       | Compile tests to CommonJS for Jest                                | in memory                                     |
| ESLint (`eslint.config.mjs`)         | Type-aware linting + Prettier formatting check                    | none                                          |

`npm run build` = `vite build && tsc -p tsconfig.build.json`. It only writes to `dist/`; it never formats or rewrites
source files.

## package.json

1. **`"type": "module"`.** Plain `.js` files in this repo are ESM, so config files such as `jest.config.js` use
   `export default`. Vite relies on this to name its outputs `index.js` (ESM) and `index.cjs` (CJS).
2. **`main` points into `dist/`:** `./dist/index.cjs`. It's the fallback for tools that don't read `exports`. Never
   point it at `src/`, because `src/` isn't published.
3. **`module` is `./dist/index.js`.** It's the legacy ESM hint for older bundlers.
4. **`types` points into the types folder:** `./dist/types/index.d.ts`. It must match `declarationDir` in
   `tsconfig.build.json` plus the entry file name.
5. **`exports` is the source of truth.** Within the `.` entry, `types` comes **first** (TypeScript requires this), then
   `import`, then `require`. Keep `"./package.json"` exported for tooling. Any path you add here has to exist after
   `npm run build`.
6. **`files` is `["dist"]`.** Only build output is published (npm always adds `package.json`, `README.md` and
   `LICENSE`). Don't add `src` or `test`.
7. **`sideEffects: false`.** Importing the package has no side effects, so bundlers can tree-shake unused exports. If
   you ever add module-level side effects (polyfills, CSS), change this.
8. **`directories` is informational.** npm doesn't use `directories.test` for anything. Don't rely on it for publishing
   or tooling.
9. **Keep `main`, `module`, `types`, `exports` and `files` in sync.** When one changes, check all five against the
   actual `dist/` contents (see [Verifying the build](#verifying-the-build)).
10. **Runtime dependencies stay at zero.** Everything belongs in `devDependencies`. If a runtime dependency ever becomes
    necessary, it must also go in `build.rolldownOptions.external` in `vite.config.ts` so it isn't bundled (Vite 8
    deprecated the old `build.rollupOptions` name).

## Vite (`vite.config.ts`)

1. **Library mode only.** The config uses `build.lib` with `entry: 'src/index.ts'`, `formats: ['es', 'cjs']` and
   `fileName: 'index'`. No app/dev-server settings and no framework plugins: the package is framework-agnostic.
2. **`target: 'es2020'`** has to match `target` in `tsconfig.json`.
3. **`minify: false`, `sourcemap: true`.** Consumers' bundlers minify. Readable output plus sourcemaps (with embedded
   sources) keeps stack traces useful.
4. **`emptyOutDir: true`.** Vite clears `dist/` first, and `tsc` then adds `dist/types/`. That's why Vite must run before
   `tsc` in the build script.
5. **Vite doesn't type-check or emit `.d.ts` files.** Those come from `tsc`. Don't add a declaration plugin unless the
   types layout is being redesigned.

## TypeScript

1. **`tsconfig.json` is the single strict base**, with `noEmit: true`. It covers `src/`, `test/` and `vite.config.ts`
   and serves the editor, `npm run typecheck` and ESLint's type-aware rules.
2. **`module` / `moduleResolution` are `NodeNext`.** It's the strictest mode: code that passes it works in Node and in
   every bundler. It also forces rule 3.
3. **Relative imports carry a `.js` extension**, as in `import { ElementState } from './ElementState.js'` (even though
   the file is `.ts`). The emitted `.d.ts` files keep the import paths verbatim, and without extensions they break for
   consumers using `node16`/`nodenext` resolution.
4. **`isolatedModules: true`.** Vite transpiles each file on its own, so type-only re-exports must use
   `export type { … }` and type-only imports must use `import type { … }`. ESLint enforces both.
5. **`lib: ["ES2020", "DOM"]`.** This is a browser-facing library. Don't use Node-only APIs in `src/`; there are no
   `@types/node`.
6. **Strictness flags stay on:** `strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`,
   `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noUnusedParameters`. Don't loosen them to
   make an error go away; fix the code.
7. **`tsconfig.build.json`** extends the base and only emits declarations (`emitDeclarationOnly`, `rootDir: src`,
   `declarationDir: dist/types`, `types: []` so test globals can't leak into the published types). No declaration maps:
   they would point at `src/`, which isn't published.
8. **`tsconfig.test.json`** extends the base and only switches `module`/`moduleResolution` to CommonJS/Node10 for
   ts-jest. Jest's `moduleNameMapper` strips the `.js` extension at runtime.

## ESLint (`eslint.config.mjs`)

1. **Flat config with `defineConfig`.** Global ignores (`dist/`, `coverage/`, `node_modules/`) live in their own
   object. `npm run lint` is `eslint .` and covers `src/`, `test/` and config files.
2. **TypeScript files use `tseslint.configs.recommendedTypeChecked`** with `projectService: true`. Every linted `.ts`
   file must be included by `tsconfig.json`.
3. **Project rules, all errors:**
   - explicit function return types
   - no `public` keyword (`explicit-member-accessibility: no-public`)
   - `import type` / `export type` for type-only symbols, with no type-import side effects
   - no `any`
   - no unused vars (prefix with `_` to opt out)
   - exhaustive `switch` statements
   - `eqeqeq`
4. **`src/`:** browser globals. `no-console` is an error except for `console.warn`/`console.error`, which are part of
   the library's behavior (warnings on always-active elements).
5. **`test/`:** Jest globals. Explicit return types, `unbound-method` and `no-empty-function` are turned off because
   they fight normal Jest patterns.
6. **Prettier runs through ESLint and goes last** (`eslint-plugin-prettier/recommended`). Formatting options live only
   in `.prettierrc.json`, never duplicated in the ESLint config.

## Verifying the build

Run this whenever you change anything above, and before every publish (`prepublishOnly` covers steps 1–2
automatically):

1. `npm run lint && npm run typecheck && npm test`
2. `npm run build`. Expect `dist/index.js`, `dist/index.cjs`, their `.map` files, and `dist/types/**/*.d.ts`.
3. `npm pack --dry-run`. The tarball must contain only `dist/**`, `package.json`, `README.md` and `LICENSE`.
4. Consumer smoke test: install the packed `.tgz` into a scratch project, then confirm that
   - `require('infinite-toggle-manager')` and `import … from 'infinite-toggle-manager'` both work at runtime;
   - a TypeScript file importing the package type-checks under `moduleResolution` `bundler` and `nodenext`.

### Supported consumers (verified with v2.0.0)

| Consumer                                        | Status                                                         |
| ----------------------------------------------- | -------------------------------------------------------------- |
| Bundlers (Vite, webpack, etc.), TS `bundler`    | ✅                                                             |
| Node ESM `import`, TS `node16` / `nodenext` ESM | ✅                                                             |
| Node CJS `require`, TS `nodenext` CJS           | ✅ (TypeScript ≥ 5.8)                                          |
| TS `node16` **CommonJS** project                | ❌ `TS1479`: one ESM-flavored `.d.ts` tree serves both formats |

To support the last row, the build would have to emit a second, CommonJS-flavored declaration tree and point
`exports["."].require.types` at it. That's a deliberate layout change, so update this document if you make it.
