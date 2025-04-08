/**
 * Copyright - 2025 - Maleesha Gimshan (www.github.com/maleeshagimshan98)
 */


interface ElementStateData {
  name: string,
  value?: boolean,
  isAlwaysActive?: boolean
}

class ElementState {

  /**
   * name
   * 
   * @type {string}
   */
  private _name: string

  /**
   * value
   * 
   * @type {boolean}
   */
  private _value: boolean

  /**
   * isAlwaysActive
   * 
   * @type {boolean}
   */
  private _isAlwaysActive: boolean

  /**
   * constructor
   *
   * @param {ElementStateData} data
   * @returns {ElementState}
   */
  constructor({ name, value, isAlwaysActive }: ElementStateData) {
    if (!name || typeof name !== 'string') {
      throw new Error(`ElementState: An ElementState must have a name`)
    }
    this._name = name
    if (value && typeof value !== 'boolean') {
      throw new Error(`ElementState: Invalid value type for value`)      
    }
    this._value = value ?? false
    this._isAlwaysActive = isAlwaysActive ?? false

    //... if always active, keep the _value true always
    if (isAlwaysActive) {
      this._value = true
    }
  }

  /**
   * Getter for ElementState's name
   * 
   * @returns {string}
   */
  get name (): string {
    return this._name
  }

  /**
   * change the state to active
   *
   * @returns {void} void
   */
  active(): void {
    this._value = true
  }

  /**
   * change the state to inactive
   *
   * @returns {void} void
   */
  inactive(): void {
    if (this._isAlwaysActive) {
      console.warn(`Cannot turn off the an always active state - ${this._name}`)
      return
    }
    this._value = false
  }

  /**
   * toggle the elements status
   *
   * @returns {void} void
   */
  toggle(): void {
    if (this._isAlwaysActive) {
      console.warn(`Trying to toggle the state of an always active state - ${this._name}`)
      return
    }
    if (this._value === true) {
      this._value = false
    } else {
      this._value = true
    }
  }

  /**
   * Check if the element state is active
   * 
   * @returns {boolean}
   */
  isActive (): boolean {
    return this._value === true
  }

  /**
   * Check if the element state is always active
   *
   * @returns {boolean}
   */
  isAlwaysActive(): boolean {
    return this._isAlwaysActive
  }

  /**
   * Set the isAlwaysActive property
   * 
   * @param {boolean} value
   * @returns {void}
   * @throws {Error}
   */
  setIsAlwaysActive (value: boolean): void {
    if (typeof value !== 'boolean') {
      throw new Error(`Trying to set the isAlwaysActive in ${this._name}. The value must be a boolean, but found ${typeof value}`)
    }
    this._isAlwaysActive = value
    value ? this.active() : this.inactive()
  }
}

export {ElementState, ElementStateData}
