/**
 * Copyright - 2025 - Maleesha Gimshan (www.github.com/maleeshagimshan98)
 */

import { ElementState, isElementStateData } from './element-state.js';
import type { ElementStateData } from './element-state.js';
import { InfiniteToggleManagerError } from './error/infinite-toggle-manager.error.js';

interface ToggleManagerOptions {
  activeAll?: boolean;
  inactiveAll?: boolean;
  multiple?: boolean;
}

class InfiniteToggleManager {
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
   * @param {Record<string, ElementState | ElementStateData>} elements states or state data, keyed by lookup name
   * @param {ToggleManagerOptions} options controller options - pass `{}` for the defaults
   * @param {boolean} [options.activeAll] activate every element after initialising (only applied when multiple is true)
   * @param {boolean} [options.inactiveAll] deactivate every element after initialising, except always-active ones
   * @param {boolean} [options.multiple=false] allow more than one element to be active at the same time
   * @throws {InfiniteToggleManagerError} if activeAll and inactiveAll are both true, an element cannot be initialised,
   * the elements break the single-active rule, or activeAll is true while multiple is false
   */
  constructor(
    elements: Record<string, ElementState | ElementStateData>,
    { activeAll, inactiveAll, multiple }: ToggleManagerOptions,
  ) {
    this._multiple = multiple ?? false;
    this._initElements(elements);

    if (activeAll && inactiveAll) {
      throw InfiniteToggleManagerError.conflictingOptions();
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
   * Set isAnyActiveStateFound property - true if any of the element states is active, otherwise false
   *
   * @returns {void}
   */
  private _setActiveStateFound(): void {
    this._isAnyActiveStateFound = Object.values(this._elements).some((elementState) => elementState.isActive());
  }

  /**
   * Set isAnyActiveStateFound to true if the given element state is active.
   *
   * @param {ElementState} elementState
   * @returns {void}
   */
  private _updateAnyActiveStateFound(elementState: ElementState): void {
    if (elementState.isActive()) {
      this._isAnyActiveStateFound = true;
    }
  }

  /**
   * Checks if the state's active status is contradicting with multiple active states rule
   *
   * @param {boolean} isStateActive element's active status
   * @returns {boolean}
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
   * @throws {InfiniteToggleManagerError} if the state is active while another one is active and multiple is false
   */
  private _setElement(name: string, elementState: ElementState): void {
    if (this._contradictWithMultipleElementRule(elementState.isActive())) {
      throw InfiniteToggleManagerError.contradictsMultipleStateRule(name);
    }
    this._elements[name] = elementState;
    this._updateAnyActiveStateFound(elementState);
  }

  /**
   * Create a new instance of ElementState or return the passed argument if it is an instance of ElementState
   *
   * @param {ElementStateData | ElementState} elementState element state
   * @returns {ElementState}
   * @throws {InfiniteToggleManagerError} if elementState is not ElementStateData
   */
  private _createElement(elementState: ElementStateData | ElementState): ElementState {
    if (elementState instanceof ElementState) {
      return elementState;
    }
    if (isElementStateData(elementState)) {
      return new ElementState(elementState);
    } else {
      throw InfiniteToggleManagerError.emptyElement();
    }
  }

  /**
   * initialise the elements passed into constructor
   *
   * @param {Record<string, ElementState | ElementStateData>} elements
   * @returns {void} void
   * @throws {InfiniteToggleManagerError} if an element is empty or invalid, or the elements break the single-active rule
   */
  private _initElements(elements: Record<string, ElementState | ElementStateData>): void {
    for (const element in elements) {
      if (elements[element]) {
        this._setElement(element, this._createElement(elements[element]));
      } else {
        throw InfiniteToggleManagerError.invalidInitialElement(typeof elements[element]);
      }
    }
  }

  /**
   * check if the given element is available
   *
   * @param {string} name
   * @returns {boolean} true if an element is set under the given name
   */
  private _hasElement(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(this._elements, name) && this._elements[name] instanceof ElementState;
  }

  /**
   * Get an element state
   *
   * @param {string} name elementState name
   * @returns {ElementState}
   * @throws {InfiniteToggleManagerError}
   */
  getElement(name: string): ElementState {
    if (!this._hasElement(name)) {
      throw InfiniteToggleManagerError.elementNotSet(name);
    }
    return this._elements[name]!;
  }

  /**
   * add a new element
   *
   * @param {ElementState | ElementStateData} elementState
   * @returns {void} void
   * @throws {InfiniteToggleManagerError} if elementState is empty or invalid, the name already exists, or it contradicts
   * the multiple active state rule
   */
  addElement(elementState: ElementState | ElementStateData): void {
    if (!(elementState instanceof ElementState) && !isElementStateData(elementState)) {
      throw InfiniteToggleManagerError.invalidElement();
    }
    if (this._hasElement(elementState.name)) {
      throw InfiniteToggleManagerError.elementAlreadyExists(elementState.name);
    }
    const element = this._createElement(elementState);
    this._setElement(element.name, element);
  }

  /**
   * change the state of all the elements to active
   *
   * @returns {void} void
   * @throws {InfiniteToggleManagerError} if multiple is false
   */
  activeAll(): void {
    if (!this._multiple) {
      throw InfiniteToggleManagerError.cannotActivateAll();
    }
    for (const element in this._elements) {
      const elementState = this._elements[element];
      if (!elementState) {
        continue;
      }
      elementState.active();
      this._updateAnyActiveStateFound(elementState);
    }
  }

  /**
   * change the state of all the elements to inactive - if any one of state is alwaysActive, it will not be inactive by calling this method
   *
   * @returns {void} void
   */
  inactiveAll(): void {
    for (const element in this._elements) {
      const elementState = this._elements[element];
      if (!elementState) {
        continue;
      }
      if (!elementState.isAlwaysActive()) {
        elementState.inactive();
      }
    }
    this._setActiveStateFound();
  }

  /**
   * change the given element's state to active
   *
   * @param {string} name
   * @returns {void} void
   * @throws {InfiniteToggleManagerError} if the element is not set, or it contradicts the multiple active state rule
   */
  active(name: string): void {
    if (!this._hasElement(name)) {
      throw InfiniteToggleManagerError.elementNotSet(name);
    }
    if (this._contradictWithMultipleElementRule(true)) {
      //... cannot set the state to active - contradicts with multiple active state rule
      throw InfiniteToggleManagerError.contradictsMultipleStateRule(name);
    }
    this._elements[name]?.active();
    this._setActiveStateFound();
  }

  /**
   * change the given element's state to inactive
   *
   * @param {string} name
   * @returns {void} void
   * @throws {InfiniteToggleManagerError} if the element is not set
   * @throws {ElementStateError} if the element is always active
   */
  inactive(name: string): void {
    if (!this._hasElement(name)) {
      throw InfiniteToggleManagerError.elementNotSet(name);
    }
    this._elements[name]?.inactive();
    this._setActiveStateFound();
  }

  /**
   * toggle the given element active or inactive.
   * When multiple is false, turning an element on turns every other element off.
   * An always active element is left unchanged, with a warning.
   *
   * @param {string} name
   * @returns {void} void
   * @throws {InfiniteToggleManagerError} if the element is not set, or another element is always active while multiple is false
   */
  toggle(name: string): void {
    const elementState = this.getElement(name);
    if (elementState.isAlwaysActive()) {
      //... keep element active
      console.warn(`ElementStateController: Trying to toggle the state of an always on element - ${name}`);
      return;
    }

    if (this._multiple || elementState.isActive()) {
      elementState.toggle();
      this._setActiveStateFound();
      return;
    }

    //... single-active mode: an always active element cannot be turned off, so it blocks turning this one on
    for (const element in this._elements) {
      if (element !== name && this._elements[element]?.isAlwaysActive()) {
        throw InfiniteToggleManagerError.contradictsMultipleStateRule(name);
      }
    }
    for (const element in this._elements) {
      if (element !== name) {
        this._elements[element]?.inactive();
      }
    }
    elementState.active();
    this._setActiveStateFound();
  }

  /**
   * Set isAlwaysActive property on a state
   *
   * @param {string} name element state name
   * @param {boolean} value value to set
   * @returns {void}
   * @throws {InfiniteToggleManagerError}
   */
  setIsAlwaysActive(name: string, value: boolean): void {
    if (!this._hasElement(name)) {
      throw InfiniteToggleManagerError.elementNotSet(name);
    }

    if (this._contradictWithMultipleElementRule(true)) {
      throw InfiniteToggleManagerError.contradictsMultipleStateRule(name);
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
   * @param {boolean} state true to allow multiple elements to be active at the same time
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

export default InfiniteToggleManager;
