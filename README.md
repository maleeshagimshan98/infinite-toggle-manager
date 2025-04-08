# Active-State-Switcher

Introducing Active State Switcher – The Ultimate JavaScript Class for Efficient Management Of Active State In Anything But Javascript ! 🚀

Are you tired of dealing with messy code when managing active states for muliple things (Probably HTML element/ Component) in your application? Say goodbye to complexity and embrace the simplicity of Active-State-Switcher!

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
  - [Example](#example)

- [ElementState](#elementstate)
  - [Constructor](#constructor-1)
  - [active()](#active)
  - [inactive()](#inactive)
  - [toggle()](#toggle)
  - [isAlwaysActive(): boolean](#isalwayson-boolean)
  - [Example](#example-1)

---

## ElementStateController

ElementStateController and ElementState are two JavaScript classes that provide a convenient and versatile way to manage states. The classes allow you to control a group of items's states.

🔧 Seamlessly Control Element States: With ElementStateController, you can effortlessly make active, inactive, or toggle states of the elements, giving you complete control over their functionality. 💡

🎯 Perfect for Every Use Case: Whether it's managing user settings, controlling UI elements, or implementing dynamic behavior, ElementStateController has got you covered! 🧩

💪 Manage Multiple Elements with Ease: Say goodbye to repetitive tasks! ElementStateController empowers you to handle multiple elements with a single instance.

🎨 Customize to Your Heart's Content: Tailor each element's behavior to requirements with ease.

📦 Simple Installation: Installing ElementStateController is a breeze! Just run a single npm command, and you're ready to go.

### Constructor

```javascript
constructor(elements: Object, options: Object)
```

| Parameter | Type   | Description                                                                                                                                                                                                                                                                                                                                    |
| --------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| elements  | Object | A collection of elements to be managed. Each key represents the element name, and the value can be either an instance of `ElementState` or a plain object representing the element state.                                                                                                                                                      |
| options   | Object | An optional object that can contain the following properties:<br>`activeAll`: A boolean value to determine whether all elements should be turned on initially.<br>`inactiveAll`: A boolean value to determine whether all elements should be initially inactive.<br>`multiple`: A boolean value to allow turning on multiple elements at once. |

### Methods

| Method                                                  | Description                                                      |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| `addElement(name: string, elementState: Object): void`  | Adds a new element to the `ElementStateController`.              |
| `getElement(name: string): ElementState`                | Get an element state                                             |
| `activeAll(): void`                                     | Turns on all elements managed by the `ElementStateController`.   |
| `inactiveAll(): void`                                   | Turns off all elements managed by the `ElementStateController`.  |
| `active(name: string): void`                            | Turns on the specified element by its name.                      |
| `inactive(name: string): void`                          | Turns off the specified element by its name.                     |
| `toggle(name: string): void`                            | Toggles the specified element by its name.                       |
| `setIsAlwaysActive(name: string, value: boolean): void` | Set isAlwaysActive property on an element specified by the name. |

### Example

```javascript
// Creating a new ElementStateController instance with initial states
const states = {
  state1: new ElementState({ name: 'state1', value: false }),
  state2: { name: 'state2', value: true, isAlwaysActive: true },
};
const options = {
  activeAll: true, // Turn all states are in active initially
  multiple: true, // Allow multiple states to be active simultaneously
};
const elementStateController = new ElementStateController(elements, options);

// Turning off a specific element
elementStateController.inactive('state1');

// Toggling the state of a specific element
elementStateController.toggle('state1');

// Adding a new element
elementStateController.addElement('state3', new ElementState({ name: 'state3', value: true }));
```

---

## ElementState

The `ElementState` class represents an individual element state. It allows you to manage the state and behavior of individual elements.

### Constructor

```javascript
constructor({ name: string, value: boolean, isAlwaysActive?: boolean })
```

| Parameter      | Type    | Description                                                                                                                      |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| name           | String  | The name of the element.                                                                                                         |
| value          | Boolean | The initial value of the element (true for active, false for inactive).                                                          |
| isAlwaysActive | Boolean | An optional parameter that determines if the element's state should always be active and cannot be inactive. Default is `false`. |

### Methods

| Method                           | Description                                                                      |
| -------------------------------- | -------------------------------------------------------------------------------- |
| `active(): void`                 | Turns on the element.                                                            |
| `inactive(): void`               | Turns off the element.                                                           |
| `toggle(): void`                 | Toggles the value of the element between active and inactive.                    |
| `isActive(): void`               | Checks if the element state is active or inactive.                               |
| `isAlwaysActive(): boolean`      | Returns a boolean value indicating if the element state is set to always active. |
| `setIsAlwaysActive(value): void` | Sets the state is always active or not.                                          |

### Example

```javascript
// Creating a new ElementState instance
const element1 = new ElementState({ name: 'element1', value: false, isAlwaysActive: true });

// Turning on the element
element1.active();

// Toggling the state of the element
element1.toggle();

// Checking if the element is always active
const alwaysActive = element1.isAlwaysActive(); // Returns true
```

---

## License

This component is open source and available under the [MIT License](LICENSE).

## Author

Vue Preloader is developed and maintained by [Maleesha Gimshan](https://github.com/maleeshagimshan98). If you have any questions or suggestions, feel free to reach out.

## Contributing

Contributions are highly appreciated and contribute to the thriving open-source community. If you have a suggestion to improve this component, please fork the repository and create a pull request. Alternatively, you can open an issue with the tag "enhancement". Don't forget to show your support by giving the project a star! Thank you for your contributions!

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request
