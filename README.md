# Active-State-Switcher

Introducing Active State Switcher – The Ultimate JavaScript Class for Efficient Management Of Active State In Anything But Javascript! 🚀

Are you tired of dealing with messy code when managing active states for multiple things (Probably HTML elements/Components) in your application? Say goodbye to complexity and embrace the simplicity of Active-State-Switcher!

## Table of Contents

- [ElementStateController](#elementstatecontroller)
  - [Usability](#usability)
  - [Key Features](#key-features)
  - [Constructor](#constructor)
  - [addElement(name: string, elementState: Object)](#addswitchname-string-switchobj-object)
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
- [ElementError](#elementerror)
  - [Error Types](#error-types)
  - [Example](#example-2)

---

## ElementStateController

ElementStateController and ElementState are two JavaScript classes that provide a convenient and versatile way to manage states. The classes allow you to control a group of items' states.

🔧 Seamlessly Control Element States: With ElementStateController, you can effortlessly make active, inactive, or toggle states of the elements, giving you complete control over their functionality. 💡

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

Turns on all elements managed by the `ElementStateController`. Logs a warning if `multiple` is false.

#### inactiveAll(): void

Turns off all elements managed by the `ElementStateController`. Elements marked as `isAlwaysActive` will remain active.

#### active(name: string): void

Activates a specific element by name. Throws an error if the element contradicts the "multiple active state" rule.

#### inactive(name: string): void

Deactivates a specific element by name.

#### toggle(name: string): void

Toggles the state of a specific element by name. Logs a warning if the element is marked as `isAlwaysActive`. If `multiple` is false, toggling one element will deactivate others.

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

Deactivates the element. Logs a warning if the element is marked as `isAlwaysActive`.

#### toggle(): void

Toggles the state of the element. Logs a warning if the element is marked as `isAlwaysActive`.

#### isActive(): boolean

Returns `true` if the element is active, otherwise `false`.

#### isAlwaysActive(): boolean

Returns `true` if the element is marked as always active, otherwise `false`.

#### setIsAlwaysActive(value: boolean): void

Sets the `isAlwaysActive` property. If set to `true`, the element is automatically activated. Throws an error if the value is not a boolean.

---

## ElementError

The `ElementError` class is used to handle specific error scenarios in `ElementStateController` and `ElementState`. It provides predefined error messages for common issues.

### Error Types

| Error Type                                | Description                                                         |
| ----------------------------------------- | ------------------------------------------------------------------- |
| `ELEMENT_NOT_SET`                         | Thrown when attempting to access an element that is not defined.    |
| `ELEMENT_ALREADY_EXIST`                   | Thrown when attempting to add an element with a duplicate name.     |
| `ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE` | Thrown when an operation violates the "multiple active state" rule. |

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