# AGENTS.md

Guidance for AI coding agents and contributors working in this repository.

## Project

- npm package **`infinite-toggle-manager`** (v2.0.0): a small TypeScript library for tracking the active/inactive state
  of named UI elements (tabs, menus, modals, accordions). It has no runtime dependencies.
- Vite (library mode) bundles it to ESM (`dist/index.js`) and CommonJS (`dist/index.cjs`). `tsc` emits the declarations
  to `dist/types/`. `dist/` is gitignored.
- Build, packaging and config rules live in [docs/library-rules.md](docs/library-rules.md). Read it before changing
  `package.json`, `vite.config.ts`, any `tsconfig*.json` or `eslint.config.mjs`.
- Naming history: the local folder is `active-state-switcher` and the GitHub repo is `vue-switch-controller`. Older code
  used `SwitchController` / `SwitchState` with `on` / `off`. None of that exists on `master`, so always use the current
  names (`ElementState`, `active` / `inactive`, `isAlwaysActive`).
- In `src/`, the controller class is `InfiniteToggleManager` and its error class is `InfiniteToggleManagerError`.
  `src/index.ts` still exports them under their public names, `ElementStateController` and `ElementControllerError`.

## Commands

| Task      | Command                                                 | Notes                                                                             |
| --------- | ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Install   | `npm ci`                                                | Installs exactly what `package-lock.json` pins                                    |
| Test      | `npm test`                                              | Jest 29 + ts-jest (compiled through `tsconfig.test.json`); 58 tests               |
| One file  | `npx jest test/element-state.test.ts`                   |                                                                                   |
| One test  | `npx jest -t "toggle should toggle a specific element"` |                                                                                   |
| Typecheck | `npm run typecheck`                                     | `tsc -p tsconfig.json`: `src/`, `test/` and `vite.config.ts`; emits nothing       |
| Lint      | `npm run lint` / `npm run lint:fix`                     | ESLint 10, type-aware; covers `src/`, `test/` and config files; expect 0 problems |
| Format    | `npm run format` / `npm run format:check`               | Whole repo; `format` rewrites files                                               |
| Build     | `npm run build`                                         | `vite build && tsc -p tsconfig.build.json`; writes only to `dist/`                |

- Before finishing a change, run `npm run lint`, `npm run typecheck` and `npm test`. If you touched the build,
  `package.json` or any config file, also follow "Verifying the build" in
  [docs/library-rules.md](docs/library-rules.md).
- `npm run format:check` currently flags `package.json` and `docs/todo.yaml`, which were already unformatted. Format
  only the files you changed
  (`npx prettier --write <files>`) unless reformatting the repo is the task.

## Layout

```
src/
  index.ts                    public entry. Named exports: ElementStateController (InfiniteToggleManager),
                              ElementState, ElementStateData (type), ElementControllerError (InfiniteToggleManagerError),
                              ElementStateError. The error type enums are NOT exported here.
  element-state.ts            one element's state; exports ElementState, isElementStateData, ElementStateData (type)
  infinite-toggle-manager.ts  InfiniteToggleManager: manages a named group of states; DEFAULT export
  error/infinite-toggle-manager.error.ts
                              InfiniteToggleManagerError class + ToggleManagerErrorType enum
  error/element-state.error.ts
                              ElementStateError class + ElementStateErrorType enum
test/
  element-state.test.ts            ts-jest; tests import from ../src/*.js
  infinite-toggle-manager.test.ts
docs/library-rules.md         build, packaging and config rules
docs/TODO                     owner's notes on open work
dist/                         build output (gitignored)
```

Config files:

- `tsconfig.json`: strict base, `NodeNext`, no emit
- `tsconfig.build.json`: declarations to `dist/types`
- `tsconfig.test.json`: CommonJS settings for ts-jest
- `vite.config.ts`: library mode
- `jest.config.js`: ESM, because the package is `"type": "module"`
- `eslint.config.mjs`, `.prettierrc.json`, `.editorconfig`

## How it works

### ElementState

- `new ElementState({ name, value?, isAlwaysActive? })`
  - `name` must be a non-empty string, otherwise it throws.
  - `value` defaults to `false`. A truthy non-boolean throws.
  - `isAlwaysActive: true` requires `value: true`, otherwise it throws.
- Methods: `active()`, `inactive()`, `toggle()`, `isActive()`, `isAlwaysActive()`, a `name` getter, and
  `setIsAlwaysActive(bool)`. Passing `true` also activates the state; passing `false` clears the flag, then deactivates.
- On an always-active state, `inactive()` and `toggle()` throw `ElementStateError` and change nothing.

### ElementStateController (`InfiniteToggleManager`)

- `new ElementStateController(elements, options)`
  - `elements`: `Record<string, ElementState | ElementStateData>`. **The record key is the lookup name**, not
    `ElementState.name`.
  - `options`: `{ activeAll?, inactiveAll?, multiple? }`. This is a required positional argument, so pass `{}` for
    defaults. Setting `activeAll` and `inactiveAll` together throws.
- **Single-active rule:** when `multiple` is `false` (the default), the controller tracks `_isAnyActiveStateFound`. Any
  operation that would make another element active throws `ElementControllerError` (`ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE`).
  The only exception is `toggle(name)`, which turns the other elements off (see below).
- Public methods:
  - `getElement(name)`
  - `addElement(stateOrData)` takes a single argument and stores it under `.name`. A duplicate name throws
    `ELEMENT_ALREADY_EXIST`.
  - `active(name)`, `inactive(name)`. `inactive(name)` on an always-active element throws `ElementStateError`.
  - `toggle(name)` flips only `name`. With `multiple: false`, turning `name` on first turns every other element off. If
    another element is always-active, it throws `ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE` and changes nothing. On an
    always-active `name`, it calls `console.warn` and does nothing.
  - `activeAll()` throws `CANNOT_ACTIVATE_ALL_WITHOUT_MULTIPLE` unless `multiple` is true, including when called from
    the constructor through `{ activeAll: true }`.
  - `inactiveAll()` leaves always-active elements active.
  - `setIsAlwaysActive(name, value)`
  - `hasAllowMultipleElements()`, `setMultipleElementsAllowState(bool)`, `hasAnyActiveStateFound()`
- An unknown name throws `ElementControllerError` (`ELEMENT_NOT_SET`).

### Errors

- `ElementState` throws `ElementStateError` (exported under that name) for invalid input, and for `inactive()` /
  `toggle()` on an always-active state. Most messages start with `ElementState: `, and `.type` is a numeric
  `ElementStateErrorType`.
- Every error the controller raises itself is an `InfiniteToggleManagerError` (public name `ElementControllerError`), and
  `.type` is a numeric `ToggleManagerErrorType`. That covers lookups, duplicates, single-active rule violations,
  `activeAll()` without `multiple`, conflicting options (`CONFLICTING_OPTIONS`) and invalid elements
  (`INVALID_ELEMENT`). Rule and lookup messages start with `InfiniteToggleManager - `. Input validation messages keep
  their older `ElementStateController: …` prefix. Don't throw a plain `Error` in `infinite-toggle-manager.ts`.
- Both error classes are built through static factory methods, such as `InfiniteToggleManagerError.elementNotSet(name)`
  and `ElementStateError.invalidName()`, not with `new`. When you add an error type, add a factory for it and append
  the enum member at the end, so existing `.type` values don't shift.
- Tests assert exact message strings. If you change a message, update the tests in the same change.

## Known bugs (verified on `master`)

This is current behavior. Don't fix it silently inside an unrelated change. Make each fix a deliberate change that comes
with tests.

1. `inactive(name)` doesn't clear the active-state flag. With `multiple: false`, after `active('a'); inactive('a')`, a
   call to `active('b')` throws.
2. With `multiple: false`, calling `active(name)` on the element that is already active throws.
3. `inactiveAll()` sets the flag from the last element only. An always-active element earlier in the map stays active
   while `hasAnyActiveStateFound()` returns `false`.
4. `ElementStateController.setIsAlwaysActive(name, true)` is ignored (only `false` is applied), and its rule check
   throws even when the value is `false`.
5. The constructor stores elements under the record key, but `addElement` uses `.name`. If the key and name differ, the
   element can't be looked up by its own name.
6. `ElementState` value validation only rejects truthy non-booleans, so `0` and `''` are accepted.

Minor issues:

- `ToggleManagerErrorType` isn't exported from `src/index.ts`.
- There's a stray comma expression `(this, …)` in the `ElementState` constructor.

## Code conventions

- TypeScript `strict`, plus `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess` and `noUnusedParameters`. Because of
  `noUncheckedIndexedAccess`, record lookups have type `T | undefined`. Existing code uses `?.` after a `_hasElement`
  check, so follow that or narrow explicitly.
- File and folder names are kebab-case, as in `element-state.ts` and `error/infinite-toggle-manager.error.ts`. A test
  file takes its source file's name: `test/<name>.test.ts`. Class names stay PascalCase.
- **Relative imports end in `.js`**, as in `from './element-state.js'`, even though the files are `.ts`. `NodeNext`
  requires it, and without it the published `.d.ts` files break for consumers using `node16`/`nodenext`. Jest maps the
  imports back to `.ts`.
- Type-only symbols use `import type` / `export type`. `isolatedModules` requires this and ESLint enforces it.
- These ESLint rules are errors:
  - an explicit return type on every function
  - no `public` keyword
  - no `any`
  - `eqeqeq`
  - exhaustive `switch` statements
  - Prettier differences, which are reported as lint errors
- Prettier: semicolons, single quotes, trailing commas, print width 120, 2-space indent, **LF** line endings. LF is
  enforced by the `prettier/prettier` lint rule and `.editorconfig`.
- One class per file, `private _camelCase` fields, and a JSDoc block (`@param`, `@returns`, `@throws`) on every method.
  Source files start with the header `Copyright - 2025 - Maleesha Gimshan (www.github.com/maleeshagimshan98)`.
- In `src/`, only `console.warn` / `console.error` are allowed, and any other `console` call is a lint error. The one
  intentional warning is `ElementStateController.toggle()` on an always-active element.
- Tests use one `describe` per class, with names like `test('should …')` or `test('<method> should …')`. Assert through
  the public API (`isActive()`, `getElement()`). Mock `console.warn` with `jest.spyOn(console, 'warn')` and restore it
  afterwards.

## Build & packaging

The full rules are in [docs/library-rules.md](docs/library-rules.md). In short:

- The package is `"type": "module"`.
  - `main` → `./dist/index.cjs`
  - `module` → `./dist/index.js`
  - `types` → `./dist/types/index.d.ts`
  - The `exports` map lists `types` first.
  - All of these must match what `npm run build` actually emits.
- `files: ["dist"]`, `sideEffects: false`, zero runtime dependencies. `directories.test` is informational only.
- Supported consumers:
  - bundlers
  - Node ESM/CJS at runtime
  - TypeScript `bundler`, `nodenext`, and `node16` ESM
  - Not supported: TypeScript `node16` CommonJS projects (they get `TS1479`).
- When you change dependencies, update `package-lock.json` too, but don't commit unrelated lockfile churn.

## Git

- The default branch is `master`. Changes land through pull requests from feature branches.
- Commit messages are short, lowercase and describe the change, for example `added tests for ElementStateController`.
