# Infinite-Toggle-Manager

A Lightweight JavaScript Toggle Manager for Effortless State Control! 🚀

Tired of juggling messy classList.toggle() calls or tracking active states across multiple elements/components? Infinite-Toggle-Manager simplifies it all!

✨ Why use it?

🔄 Toggle anything – Manage active/inactive states for HTML elements, UI components, or even JS objects.

🧩 Minimal setup – Ditch manual state checks and let this class handle the logic.

🚫 No more conflicts – Cleanly enforce single-active or multi-active states without spaghetti code.

Perfect for tabs, modals, menus, or any interactive UI!

## Table of Contents

- [ElementStateController](#elementstatecontroller)
  - [Usability](#usability)
  - [Key Features](#key-features)
  - [Constructor](#constructor)
  - [addElement(name: string, elementState: ElementState | ElementStateData)](#addswitchname-string-switchobj-object)
  - [activeAll()](#activeall)
  - [inactiveAll()](#inactiveall)
  - [active(name: string)](#onname-string)
  - [inactive(name: string)](#offname-string)
  - [toggle(name: string)](#togglename-string)
  - [setIsAlwaysActive(name: string, value: boolean)](#setisalwaysactive)
  - [hasAllowMultipleElements()](#hasallowmultipleelements)
  - [Example](#example)
- [ElementState](#elementstate)
  - [Constructor](#constructor-1)
  - [active()](#active)
  - [inactive()](#inactive)
  - [toggle()](#toggle)
  - [isActive(): boolean](#isactive-boolean)
  - [isAlwaysActive(): boolean](#isalwayson-boolean)
  - [setIsAlwaysActive(value: boolean)](#setisalwaysactive-1)
  - [Example](#example-1)
- [ElementControllerError](#elementcontrollererror)
  - [Error Types](#error-types)
  - [Example](#example-2)
- [ElementStateError](#elementstateerror)

---

## ElementStateController

ElementStateController and ElementState are two JavaScript classes that provide a convenient and versatile way to manage states. The classes allow you to control a group of items' states.

🔧 Control Element States: With ElementStateController, you can effortlessly make active, inactive, or toggle states of the elements, giving you complete control over their functionality. 💡

🎯 Perfect for Every Use Case: Whether it's managing user settings, controlling UI elements, or implementing dynamic behavior, ElementStateController has got you covered! 🧩

💪 Manage Multiple Elements with Ease: Say goodbye to repetitive tasks! ElementStateController empowers you to handle multiple elements with a single instance.

🎨 Customize to Your Heart's Content: Tailor each element's behavior to requirements with ease.

📦 Simple Installation: Installing ElementStateController is a breeze! Just run a single npm command, and you're ready to go.

### Constructor

```javascript
constructor(elements: Object, options: Object)
```

**Parameters:**

- `elements` (Object): A record of element names and their corresponding `ElementState` or `ElementStateData` objects.
- `options` (Object): An optional object that can contain the following properties:
  - `activeAll` (boolean): Determines whether all elements should be turned on initially. Cannot be true if `inactiveAll` is also true.
  - `inactiveAll` (boolean): Determines whether all elements should be initially inactive. Cannot be true if `activeAll` is also true.
  - `multiple` (boolean): Allows turning on multiple elements at once.

---

### Methods

#### addElement(name: string, elementState: Object): void

Adds a new element to the controller. Throws an error if an element with the same name already exists.

#### activeAll(): void

Turns on all elements managed by the `ElementStateController`. Throws an `ElementControllerError` if `multiple` is false.

#### inactiveAll(): void

Turns off all elements managed by the `ElementStateController`. Elements marked as `isAlwaysActive` will remain active.

#### active(name: string): void

Activates a specific element by name. Throws an error if the element contradicts the "multiple active state" rule.

#### inactive(name: string): void

Deactivates a specific element by name. Throws an `ElementStateError` if the element is marked as `isAlwaysActive`.

#### toggle(name: string): void

Toggles the state of a specific element by name. Logs a warning and does nothing if the element is marked as `isAlwaysActive`. If `multiple` is false, turning an element on turns every other element off. In that case, if another element is marked as `isAlwaysActive`, it throws an `ElementControllerError` and changes nothing.

#### setIsAlwaysActive(name: string, value: boolean): void

Sets the `isAlwaysActive` property for a specific element. Throws an error if the value is not a boolean.

#### hasAllowMultipleElements(): boolean

Returns `true` if multiple active elements are allowed, otherwise `false`.

---

## ElementState

The `ElementState` class represents the state of an individual element.

### Constructor

**Parameters:**

- `name` (String): The name of the element. Must be a non-empty string.
- `value` (Boolean): An optional parameter that determines the initial state of the element. Default is `false`.
- `isAlwaysActive` (Boolean): An optional parameter that determines if the element's state should always be active. Default is `false`. If set to `true`, the `value` must also be `true`.

---

### Methods

#### active(): void

Activates the element.

#### inactive(): void

Deactivates the element. Throws an `ElementStateError` if the element is marked as `isAlwaysActive`.

#### toggle(): void

Toggles the state of the element. Throws an `ElementStateError` if the element is marked as `isAlwaysActive`.

#### isActive(): boolean

Returns `true` if the element is active, otherwise `false`.

#### isAlwaysActive(): boolean

Returns `true` if the element is marked as always active, otherwise `false`.

#### setIsAlwaysActive(value: boolean): void

Sets the `isAlwaysActive` property. If set to `true`, the element is automatically activated. Throws an `ElementStateError` if the value is not a boolean.

---

## ElementControllerError

The `ElementControllerError` class is thrown by `ElementStateController` for every error it raises itself: unknown element names, duplicate names, violations of the single-active rule, `activeAll()` while `multiple` is false, conflicting options and invalid elements. It provides predefined error messages for these cases. `ElementState` never throws it.

### Error Types

| Error Type                                | Description                                                         |
| ----------------------------------------- | ------------------------------------------------------------------- |
| `ELEMENT_NOT_SET`                         | Thrown when attempting to access an element that is not defined.    |
| `ELEMENT_ALREADY_EXIST`                   | Thrown when attempting to add an element with a duplicate name.     |
| `ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE` | Thrown when an operation violates the "multiple active state" rule. |
| `CANNOT_ACTIVATE_ALL_WITHOUT_MULTIPLE`    | Thrown when `activeAll()` is called while `multiple` is false.      |
| `CONFLICTING_OPTIONS`                     | Thrown when `activeAll` and `inactiveAll` are both true.            |
| `INVALID_ELEMENT`                         | Thrown when an element is empty or not a valid element state.       |

---

## ElementStateError

The `ElementStateError` class is thrown by `ElementState` for invalid input (a missing name, a non-boolean `value` or `isAlwaysActive`, or `isAlwaysActive: true` with `value: false`) and when `inactive()` or `toggle()` is called on an element marked as `isAlwaysActive`. Each error has a `type` property that identifies the case.

```javascript
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


## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Contact

- **Author**: Maleesha Gimshan
- **Email**: [maleesha.gimshan.98@outlook.com](mailto:maleesha.gimshan.98@outlook.com)
- **GitHub**: [github.com/maleeshagimshan98](https://github.com/maleeshagimshan98)