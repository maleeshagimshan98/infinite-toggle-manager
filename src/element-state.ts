/**
 * Copyright - 2025 - Maleesha Gimshan (www.github.com/maleeshagimshan98)
 */

import { ElementStateError } from './error/element-state.error.js';

interface ElementStateData {
  name: string;
  value?: boolean;
  isAlwaysActive?: boolean;
}

/**
 * Type guard for ElementStateData - checks that the given data is a non-null object with a string name.
 * The optional value and isAlwaysActive fields are validated by the ElementState constructor.
 *
 * @param {unknown} data data to check
 * @returns {boolean} true if data has the shape of ElementStateData
 */
function isElementStateData(data: unknown): data is ElementStateData {
  return typeof data === 'object' && data !== null && 'name' in data && typeof data.name === 'string';
}

class ElementState {
  /**
   * name
   *
   * @type {string}
   */
  private _name: string;

  /**
   * value
   *
   * @type {boolean}
   */
  private _value: boolean;

  /**
   * isAlwaysActive
   *
   * @type {boolean}
   */
  private _isAlwaysActive: boolean;

  /**
   * constructor
   *
   * @param {ElementStateData} data
   * @throws {ElementStateError} if the name is empty, the value is invalid, or isAlwaysActive is true while value is false
   */
  constructor({ name, value, isAlwaysActive }: ElementStateData) {
    if (!name || typeof name !== 'string') {
      throw ElementStateError.invalidName();
    }
    this._name = name;
    if (value && typeof value !== 'boolean') {
      throw ElementStateError.invalidValue();
    }
    this._isAlwaysActive = isAlwaysActive ?? false;

    if ((this, this._isAlwaysActive && !value)) {
      throw ElementStateError.alwaysActiveRequiresActiveValue(name);
    }
    this._value = value ?? false;

    //... if always active, keep the _value true always
    if (isAlwaysActive) {
      this._value = true;
    }
  }

  /**
   * Getter for ElementState's name
   *
   * @returns {string}
   */
  get name(): string {
    return this._name;
  }

  /**
   * change the state to active
   *
   * @returns {void} void
   */
  active(): void {
    this._value = true;
  }

  /**
   * change the state to inactive
   *
   * @returns {void} void
   * @throws {ElementStateError} if the state is always active
   */
  inactive(): void {
    if (this._isAlwaysActive) {
      throw ElementStateError.cannotInactiveAlwaysActive(this._name);
    }
    this._value = false;
  }

  /**
   * toggle the elements status
   *
   * @returns {void} void
   * @throws {ElementStateError} if the state is always active
   */
  toggle(): void {
    if (this._isAlwaysActive) {
      throw ElementStateError.cannotToggleAlwaysActive(this._name);
    }
    if (this._value === true) {
      this._value = false;
    } else {
      this._value = true;
    }
  }

  /**
   * Check if the element state is active
   *
   * @returns {boolean}
   */
  isActive(): boolean {
    return this._value === true;
  }

  /**
   * Check if the element state is always active
   *
   * @returns {boolean}
   */
  isAlwaysActive(): boolean {
    return this._isAlwaysActive;
  }

  /**
   * Set the isAlwaysActive property
   *
   * @param {boolean} value
   * @returns {void}
   * @throws {ElementStateError} if the value is not a boolean
   */
  setIsAlwaysActive(value: boolean): void {
    if (typeof value !== 'boolean') {
      throw ElementStateError.invalidAlwaysActiveValue(this._name, typeof value);
    }
    this._isAlwaysActive = value;
    if (value) {
      this.active();
    } else {
      this.inactive();
    }
  }
}

export { ElementState, isElementStateData };
export type { ElementStateData };
