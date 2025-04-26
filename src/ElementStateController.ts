/**
 * Copyright - 2025 - Maleesha Gimshan (www.github.com/maleeshagimshan98)
 */

import { ElementState } from './ElementState';
import type { ElementStateData } from './ElementState';
import { ElementError, ElementErrorType } from './Error/ElementError';

interface ElementStateControllerOptions {
  activeAll?: boolean;
  inactiveAll?: boolean;
  multiple?: boolean;
}

class ElementStateController {
  /**
   * contains the ElementStates
   */
  private _elements: Record<string, ElementState> = {};

  /**
   * Set to true to activate multiple element states simultaniousely
   */
  private _multiple: boolean = false;

  /**
   * Indicates wheher any element state is active or not
   */
  private _isAnyActiveStateFound: boolean = false;

  /**
   * constructor
   *
   * @param {object} elements names of elements
   * @returns {void} ElementStateController
   * @throws {Error}
   */
  constructor(
    elements: Record<string, ElementState | ElementStateData>,
    { activeAll, inactiveAll, multiple }: ElementStateControllerOptions,
  ) {
    this._multiple = multiple ?? false;
    this._initElements(elements);

    if (activeAll && inactiveAll) {
      throw new Error(`ElementStateController: activeAll and inactiveAll cannot be true at the same time`);
    }

    if (activeAll) {
      this.activeAll();
    }
    if (inactiveAll) {
      this.inactiveAll();
    }
  }

  /**
   *
   *
   * @returns {boolean}
   * @throws {Error}
   */
  private _hasAllowedMultipleElements(): boolean {
    if (this._multiple) {
      return true;
    }
    if (!this._multiple && this._isAnyActiveStateFound) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Set isAnyActiveStateFound property
   *
   * @param {boolean} value
   * @returns {void}
   */
  private _setActiveStateFound(value: boolean): void {
    this._isAnyActiveStateFound = value;
  }

  /**
   * Set isAnyActiveStateFound to true
   *
   * @param {ElementState} elementState
   * @returns {void}
   */
  private _updateAnyActiveStateFound(elementState: ElementState): void {
    if (elementState.isActive()) {
      this._setActiveStateFound(true);
    }
  }

  /**
   * Checks if the state's active status is contradicting with multiple active states rule
   *
   * @param {boolean} isStateActive element's active status
   * @return {boolean}
   */
  private _contradictWithMultipleElementRule(isStateActive: boolean): boolean {
    return !this._hasAllowedMultipleElements() && this._isAnyActiveStateFound && isStateActive;
  }

  /**
   * Set the element state in the class's internal structure
   *
   * @param {string} name element state name
   * @param {ElementState} elementState element state
   * @returns {void}
   */
  private _setElement(name: string, elementState: ElementState): void {
    if (this._contradictWithMultipleElementRule(elementState.isActive())) {
      throw new ElementError(ElementErrorType.ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE, name);
    }
    this._elements[name] = elementState;
    this._updateAnyActiveStateFound(elementState);
  }

  /**
   * Create a new instance of ElementState or return the passed argument if it is an instance of ElementState
   *
   * @param {ElementStateData | ElementState} elementState element state
   * @returns {ElementState}
   * @throws {Error}
   */
  private _createElement(elementState: ElementStateData | ElementState): ElementState {
    if (elementState instanceof ElementState) {
      return elementState;
    }
    if (Object.keys(elementState).length > 0) {
      return new ElementState(elementState);
    } else {
      throw new Error(`ElementStateController: Cannot create the state with an empty object`);
    }
  }

  /**
   * initialise the elements passed into constructor
   *
   * @param {object} elements
   * @returns {void} void
   * @throws {Error}
   */
  private _initElements(elements: Record<string, ElementState | ElementStateData>): void {
    for (const element in elements) {
      if (elements[element] instanceof ElementState) {
        this._setElement(element, elements[element]);
        continue;
      }
      if (elements[element] && Object.keys(elements[element]).length > 0) {
        this._setElement(element, new ElementState(elements[element]));
      } else {
        throw new Error(`ElementStateController: Cannot initialise the states`);
      }
    }
  }

  /**
   * check if the given element is available
   *
   * @param {string} name
   * @returns {boolean} void
   * @throws {Error}
   */
  private _hasElement(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(this._elements, name) && this._elements[name] instanceof ElementState;
  }

  /**
   * Get an element state
   *
   * @param {string} name elementState name
   * @returns {ElementState}
   * @throws {ElementError}
   */
  getElement(name: string): ElementState {
    if (!this._hasElement(name)) {
      throw new ElementError(ElementErrorType.ELEMENT_NOT_SET, name);
    }
    return this._elements[name]!;
  }

  /**
   * add a new element
   *
   * @param {ElementState|ElementStateData} elementState
   * @returns {void} void
   * @throws {Error}
   */
  addElement(elementState: ElementState | ElementStateData): void {
    if (!elementState || Object.keys(elementState).length == 0) {
      throw new Error(
        `ElementStateController: parameter elementState must be a valid object having a name property or an instance of ElementState`,
      );
    }
    if (this._hasElement(elementState.name)) {
      throw new ElementError(ElementErrorType.ELEMENT_ALREADY_EXIST, elementState.name);
    }
    const element = this._createElement(elementState);
    this._setElement(element.name, element);
  }

  /**
   * change the state of all the elements to active
   *
   * @returns {void} void
   */
  activeAll(): void {
    if (!this._multiple) {
      console.warn(
        `ElementStateController: Cannot turn on all the elements - ElementStateController.multiple is set to ${this._multiple}`,
      );
      return;
    }
    for (const element in this._elements) {
      this._elements[element]?.active();
    }
    this._setActiveStateFound(true);
  }

  /**
   * change the state of all the elements to inactive - if any one of state is alwaysActive, it will not be inactive by calling this method
   *
   * @returns {void} void
   */
  inactiveAll(): void {
    for (const element in this._elements) {
      if (this._elements[element]) {
        this._elements[element].inactive();
        this._setActiveStateFound(false);
        this._updateAnyActiveStateFound(this._elements[element]);
      }
    }
  }

  /**
   * change the given element's state to active
   *
   * @param {string} name
   * @returns {void} void
   */
  active(name: string): void {
    if (!this._hasElement(name)) {
      throw new ElementError(ElementErrorType.ELEMENT_NOT_SET, name);
    }
    if (this._contradictWithMultipleElementRule(true)) {
      //... cannot set the state to active - contradicts with multiple active state rule
      throw new ElementError(ElementErrorType.ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE, name);
    }
    this._elements[name]?.active();
    this._setActiveStateFound(true);
  }

  /**
   * change the given element's state to inactive
   *
   * @param {string} name
   * @returns {void} void
   */
  inactive(name: string): void {
    if (!this._hasElement(name)) {
      throw new ElementError(ElementErrorType.ELEMENT_NOT_SET, name);
    }
    this._elements[name]?.inactive();
  }

  /**
   * toggle the given element active or inactive
   * and set rest of elements to inactive
   *
   * @param {string} name
   * @returns {void} void
   * @throws {Error}
   */
  toggle(name: string): void {
    if (!this._hasElement(name)) {
      throw new ElementError(ElementErrorType.ELEMENT_NOT_SET, name);
    }
    if (this._elements[name]?.isAlwaysActive()) {
      //... keep element active
      console.warn(`ElementStateController: Trying to toggle the state of an always on element - ${name}`);
      return;
    }

    for (const element in this._elements) {
      const togglingElementState = this._elements[element];
      if (togglingElementState) {
        if (togglingElementState.isAlwaysActive()) {
          //... keep element active
          continue;
        }
        if (this._contradictWithMultipleElementRule(togglingElementState.isActive() ? false : true)) {
          //... cannot toggle this state - contradicts with the multiple elements rule
          throw new ElementError(ElementErrorType.ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE, element);
        }
        togglingElementState.toggle();
      }
    }
  }

  /**
   * Set isAlwaysActive property on a state
   *
   * @param {string} name element state name
   * @param {boolean} value value to set
   * @returns {void}
   * @throws {ElementError}
   */
  setIsAlwaysActive(name: string, value: boolean): void {
    if (!this._hasElement(name)) {
      throw new ElementError(ElementErrorType.ELEMENT_NOT_SET, name);
    }

    if (this._contradictWithMultipleElementRule(true)) {
      throw new ElementError(ElementErrorType.ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE, name);
    }
    if (value === false) {
      this._elements[name]?.setIsAlwaysActive(value);
    }
  }

  /**
   *
   *
   * @returns {boolean}
   */
  hasAllowMultipleElements(): boolean {
    return this._hasAllowedMultipleElements();
  }

  /**
   *
   * @param {boolean}
   * @returns {void}
   */
  setMultipleElementsAllowState(state: boolean): void {
    this._multiple = state;
  }

  /**
   *
   * @returns {boolean}
   */
  hasAnyActiveStateFound(): boolean {
    return this._isAnyActiveStateFound;
  }
}

export default ElementStateController;
