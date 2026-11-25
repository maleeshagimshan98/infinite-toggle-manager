# Infinite-Toggle-Manager

A Lightweight JavaScript Toggle Manager for Effortless State Control! 🚀

Tired of juggling messy classList.toggle() calls or tracking active states across multiple elements/components? Infinite-Toggle-Manager simplifies it all!

✨ Why use it?

🔄 Toggle anything – Manage active/inactive states for HTML elements, UI components, or even JS objects.

🧩 Minimal setup – Ditch manual state checks and let this class handle the logic.

🚫 No more conflicts – Cleanly enforce single-active or multi-active states without spaghetti code.

Perfect for tabs, modals, menus, or any interactive UI!

## Table of Contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [ElementStateController](#elementstatecontroller)
  - [Constructor](#constructor)
  - [Methods](#methods)
  - [Example](#example)
- [ElementState](#elementstate)
  - [Constructor](#constructor-1)
  - [Methods](#methods-1)
  - [Example](#example-1)
- [Errors](#errors)
  - [ElementControllerError](#elementcontrollererror)
  - [ElementStateError](#elementstateerror)
- [Module formats and TypeScript](#module-formats-and-typescript)
- [Migrating from 1.x](#migrating-from-1x)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Installation

```bash
npm install infinite-toggle-manager
```

The package has no runtime dependencies. It ships ES modules, CommonJS and TypeScript declarations.

```js
import { ElementStateController, ElementState } from 'infinite-toggle-manager';
// or
const { ElementStateController, ElementState } = require('infinite-toggle-manager');
```

## Quick start

A set of tabs where only one tab can be open at a time:

```js
import { ElementStateController } from 'infinite-toggle-manager';

const tabs = new ElementStateController(
  {
    home: { name: 'home', value: true },
    profile: { name: 'profile' },
    settings: { name: 'settings' },
  },
  {},
);

tabs.toggle('profile'); // opens "profile" and closes "home"

tabs.getElement('profile').isActive(); // true
tabs.getElement('home').isActive(); // false

// Reflect the states in the DOM
for (const name of ['home', 'profile', 'settings']) {
  document.getElementById(name).classList.toggle('active', tabs.getElement(name).isActive());
}
```

## How it works

- Each element's state is an `ElementState`. It has a `name`, an active or inactive value, and an optional `isAlwaysActive` flag. An always-active element stays active and can't be turned off.
- An `ElementStateController` manages a named group of element states.
- By default the controller is in **single-active mode** (`multiple: false`), where at most one element can be active at a time:
  - `toggle(name)` switches: turning an element on turns the others off.
  - `active(name)` doesn't turn other elements off. It throws if any element is already active, including `name` itself.
  - Always-active elements count as active, so they also block other elements from turning on.
- With `multiple: true`, any number of elements can be active, and each method only changes the element you name.
- Change states through the controller (for example `tabs.active('home')`), not through `tabs.getElement('home').active()`. Otherwise the controller can't enforce the single-active rule.

---

## ElementStateController

### Constructor

```ts
new ElementStateController(elements, options);
```

- `elements`: an object of `ElementState` instances or `ElementStateData` objects (`{ name, value?, isAlwaysActive? }`). **The object key is the name you look the element up by.** `addElement()` stores elements under their own `name`, so give each element the same `name` as its key.
- `options` (required, so pass `{}` for the defaults):
  - `multiple` (boolean, default `false`): allow more than one element to be active at the same time.
  - `activeAll` (boolean): activate every element after creating them. This requires `multiple: true`.
  - `inactiveAll` (boolean): deactivate every element after creating them, except always-active ones.

The constructor throws:

- `ElementControllerError` (`CONFLICTING_OPTIONS`) if `activeAll` and `inactiveAll` are both `true`.
- `ElementControllerError` (`CANNOT_ACTIVATE_ALL_WITHOUT_MULTIPLE`) if `activeAll` is `true` while `multiple` is `false`.
- `ElementControllerError` (`INVALID_ELEMENT`) if an entry is empty or isn't an element state.
- `ElementControllerError` (`ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE`) if `multiple` is `false` and more than one element starts active.
- `ElementStateError` if an entry has invalid data, such as an empty `name`.

### Methods

#### `getElement(name): ElementState`

Returns the element state stored under `name`. Throws `ElementControllerError` (`ELEMENT_NOT_SET`) if there isn't one.

#### `addElement(elementState): void`

Adds an `ElementState` or `ElementStateData` and stores it under its `name`. Throws `ElementControllerError` with:

- `INVALID_ELEMENT` if the argument isn't an element state.
- `ELEMENT_ALREADY_EXIST` if the name is already taken.
- `ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE` if the new element is active while another one is active and `multiple` is `false`.

#### `active(name): void`

Activates the element. When `multiple` is `false`, it throws `ElementControllerError` (`ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE`) if any element is already active, including `name` itself. Use `toggle(name)` to switch from one element to another.

#### `inactive(name): void`

Deactivates the element. Throws `ElementStateError` if the element is always active.

#### `toggle(name): void`

Turns the element on if it's off, and off if it's on.

- When `multiple` is `false`, turning an element on turns every other element off. If another element is always active, it throws `ElementControllerError` (`ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE`) and changes nothing.
- When `multiple` is `true`, only `name` changes.
- If `name` itself is always active, it logs a warning and does nothing.

#### `activeAll(): void`

Activates every element. Throws `ElementControllerError` (`CANNOT_ACTIVATE_ALL_WITHOUT_MULTIPLE`) unless `multiple` is `true`.

#### `inactiveAll(): void`

Deactivates every element except always-active ones.

#### `setIsAlwaysActive(name, value): void`

Clears the element's always-active flag when `value` is `false`, which also deactivates it. In 2.0.0 there are two limitations:

- `value: true` is ignored. To make an element always active, create it with `isAlwaysActive: true`.
- When `multiple` is `false`, the call throws `ElementControllerError` (`ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE`) whenever any element is active.

#### `hasAllowMultipleElements(): boolean`

Returns `true` if another element can be activated right now. That's the case when `multiple` is `true` or no element is active.

#### `setMultipleElementsAllowState(state): void`

Turns `multiple` on or off. It doesn't change any element's state.

#### `hasAnyActiveStateFound(): boolean`

Returns `true` if any element is active.

### Example

Filters where several can be on at once, plus one that always stays on:

```js
import { ElementStateController } from 'infinite-toggle-manager';

const filters = new ElementStateController(
  {
    sale: { name: 'sale' },
    latest: { name: 'latest' },
    inStock: { name: 'inStock', value: true, isAlwaysActive: true },
  },
  { multiple: true },
);

filters.toggle('sale'); // sale on, the others unchanged
filters.activeAll(); // all three on
filters.inactiveAll(); // sale and latest off, inStock stays on

filters.hasAnyActiveStateFound(); // true
```

---

## ElementState

### Constructor

```ts
new ElementState({ name, value, isAlwaysActive });
```

- `name` (string, required): the element's name. Must be a non-empty string.
- `value` (boolean, default `false`): whether the element starts active.
- `isAlwaysActive` (boolean, default `false`): keep the element active. If it's `true`, `value` must be `true` too.

The constructor throws `ElementStateError` if any of these are invalid.

### Methods

#### `name: string`

A read-only getter for the element's name.

#### `active(): void`

Activates the element.

#### `inactive(): void`

Deactivates the element. Throws `ElementStateError` if the element is always active.

#### `toggle(): void`

Turns the element on if it's off, and off if it's on. Throws `ElementStateError` if the element is always active.

#### `isActive(): boolean`

Returns `true` if the element is active.

#### `isAlwaysActive(): boolean`

Returns `true` if the element is always active.

#### `setIsAlwaysActive(value): void`

Sets the always-active flag. `true` also activates the element, and `false` also deactivates it. Throws `ElementStateError` if `value` isn't a boolean.

### Example

```js
import { ElementState } from 'infinite-toggle-manager';

const menu = new ElementState({ name: 'menu' });

menu.toggle();
menu.isActive(); // true

menu.setIsAlwaysActive(true);
menu.isAlwaysActive(); // true
```

---

## Errors

Both error classes extend `Error`, and each has a numeric `type` property that identifies the case. The type enums aren't exported in 2.0.0, so use `instanceof` and compare `error.type` with the values in the tables below.

### ElementControllerError

`ElementStateController` throws `ElementControllerError` for every error it raises itself. `ElementState` never throws it.

| `type` | Name                                      | Thrown when                                                                   |
| ------ | ----------------------------------------- | ----------------------------------------------------------------------------- |
| `0`    | `ELEMENT_NOT_SET`                         | No element is stored under the given name.                                    |
| `1`    | `ELEMENT_ALREADY_EXIST`                   | `addElement()` is called with a name that's already taken.                    |
| `2`    | `ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE` | An operation would break the single-active rule.                              |
| `3`    | `CANNOT_ACTIVATE_ALL_WITHOUT_MULTIPLE`    | `activeAll()` is called, or passed as an option, while `multiple` is `false`. |
| `4`    | `CONFLICTING_OPTIONS`                     | The `activeAll` and `inactiveAll` options are both `true`.                    |
| `5`    | `INVALID_ELEMENT`                         | An element is empty or isn't an element state.                                |

```js
import { ElementStateController, ElementControllerError } from 'infinite-toggle-manager';

const tabs = new ElementStateController({ home: { name: 'home' } }, {});
try {
  tabs.active('missing');
} catch (error) {
  if (error instanceof ElementControllerError) {
    console.log(error.type); // 0
    console.log(error.message); // InfiniteToggleManager - Element with the name missing is not defined in ElementStateController
  }
}
```

### ElementStateError

`ElementState` throws `ElementStateError`. It can also reach you through the controller, for example from `inactive(name)` on an always-active element, or when the constructor or `addElement()` gets invalid element data.

| `type` | Name                                  | Thrown when                                              |
| ------ | ------------------------------------- | -------------------------------------------------------- |
| `0`    | `INVALID_NAME`                        | `name` is missing or isn't a non-empty string.           |
| `1`    | `INVALID_VALUE`                       | `value` isn't a boolean.                                 |
| `2`    | `ALWAYS_ACTIVE_REQUIRES_ACTIVE_VALUE` | `isAlwaysActive` is `true` while `value` is `false`.     |
| `3`    | `INVALID_ALWAYS_ACTIVE_VALUE`         | `setIsAlwaysActive()` gets a value that isn't a boolean. |
| `4`    | `CANNOT_INACTIVE_ALWAYS_ACTIVE`       | `inactive()` is called on an always-active element.      |
| `5`    | `CANNOT_TOGGLE_ALWAYS_ACTIVE`         | `toggle()` is called on an always-active element.        |

```js
import { ElementState, ElementStateError } from 'infinite-toggle-manager';

const header = new ElementState({ name: 'header', value: true, isAlwaysActive: true });
try {
  header.inactive();
} catch (error) {
  if (error instanceof ElementStateError) {
    console.log(error.message); // ElementState: Cannot turn off an always active state - header
  }
}
```

---

## Module formats and TypeScript

The package includes its own type declarations, including the `ElementStateData` type:

```ts
import { ElementStateController } from 'infinite-toggle-manager';
import type { ElementStateData } from 'infinite-toggle-manager';

const data: ElementStateData = { name: 'home', value: true };
const tabs = new ElementStateController({ home: data }, {});
```

| Consumer                                                  | Supported                                                  |
| --------------------------------------------------------- | ---------------------------------------------------------- |
| Bundlers (Vite, webpack and others), TypeScript `bundler` | ✅                                                         |
| Node ESM `import`, TypeScript `node16` / `nodenext` ESM   | ✅                                                         |
| Node CommonJS `require`, TypeScript `nodenext` CommonJS   | ✅ (TypeScript 5.8 or later)                               |
| TypeScript `node16` CommonJS project                      | ❌ fails with `TS1479`. Switch to `nodenext` or `bundler`. |

---

## Migrating from 1.x

2.0.0 contains breaking changes:

- **Error export renamed.** `ElementError` is now `ElementControllerError`, and its messages start with `InfiniteToggleManager - ` instead of `ActiveStateSwitcher - `.
- **Always-active elements throw.** `ElementState.inactive()` and `toggle()` on an always-active element now throw `ElementStateError` instead of logging a warning. So does `ElementStateController.inactive(name)`. Check `isAlwaysActive()` first, or catch the error.
- **`activeAll()` throws in single-active mode.** It used to log a warning when `multiple` was `false`. Only call it, or pass `activeAll: true`, when `multiple` is `true`.
- **`toggle(name)` changes only `name`.** In single-active mode, turning `name` on turns the others off, and an always-active element blocks it.
- **Validation errors are typed.** Invalid input throws `ElementStateError` or `ElementControllerError` instead of a plain `Error`. Both still extend `Error`.
- **The package has an `exports` map.** Import from `infinite-toggle-manager` itself. Deep imports into `dist/` no longer resolve.

---

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Install dependencies (`npm ci`), then make your changes.
4. Make sure `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` all pass.
5. Commit your changes (`git commit -m 'Add YourFeature'`).
6. Push to the branch (`git push origin feature/YourFeature`).
7. Open a pull request against `master`.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## Contact

- **Author**: Maleesha Gimshan
- **Email**: [maleesha.gimshan.98@outlook.com](mailto:maleesha.gimshan.98@outlook.com)
- **GitHub**: [github.com/maleeshagimshan98](https://github.com/maleeshagimshan98)
