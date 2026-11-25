/**
 * Copyright - 2025 - Maleesha Gimshan (www.github.com/maleeshagimshan98)
 */

enum ElementStateErrorType {
  'INVALID_NAME',
  'INVALID_VALUE',
  'ALWAYS_ACTIVE_REQUIRES_ACTIVE_VALUE',
  'INVALID_ALWAYS_ACTIVE_VALUE',
  'CANNOT_INACTIVE_ALWAYS_ACTIVE',
  'CANNOT_TOGGLE_ALWAYS_ACTIVE',
}

class ElementStateError extends Error {
  type: ElementStateErrorType;

  /**
   * constructor - prefer the static factory methods, which build the message for each error type
   *
   * @param {ElementStateErrorType} type error type
   * @param {string} message error message
   */
  constructor(type: ElementStateErrorType, message: string) {
    super(message);
    this.type = type;
  }

  /**
   * Error for a missing or non-string name
   *
   * @returns {ElementStateError}
   */
  static invalidName(): ElementStateError {
    return new ElementStateError(ElementStateErrorType.INVALID_NAME, `ElementState: An ElementState must have a name`);
  }

  /**
   * Error for a value that is not a boolean
   *
   * @returns {ElementStateError}
   */
  static invalidValue(): ElementStateError {
    return new ElementStateError(ElementStateErrorType.INVALID_VALUE, `ElementState: Invalid value type for value`);
  }

  /**
   * Error for isAlwaysActive set to true while the value is false
   *
   * @param {string} name element state name
   * @returns {ElementStateError}
   */
  static alwaysActiveRequiresActiveValue(name: string): ElementStateError {
    return new ElementStateError(
      ElementStateErrorType.ALWAYS_ACTIVE_REQUIRES_ACTIVE_VALUE,
      `ElementState: the element value cannot be false when isAlwaysActive is set to true in ${name}`,
    );
  }

  /**
   * Error for a non-boolean isAlwaysActive value
   *
   * @param {string} name element state name
   * @param {string} foundType type of the value that was passed
   * @returns {ElementStateError}
   */
  static invalidAlwaysActiveValue(name: string, foundType: string): ElementStateError {
    return new ElementStateError(
      ElementStateErrorType.INVALID_ALWAYS_ACTIVE_VALUE,
      `Trying to set the isAlwaysActive in ${name}. The value must be a boolean, but found ${foundType}`,
    );
  }

  /**
   * Error for turning off an always active state
   *
   * @param {string} name element state name
   * @returns {ElementStateError}
   */
  static cannotInactiveAlwaysActive(name: string): ElementStateError {
    return new ElementStateError(
      ElementStateErrorType.CANNOT_INACTIVE_ALWAYS_ACTIVE,
      `ElementState: Cannot turn off an always active state - ${name}`,
    );
  }

  /**
   * Error for toggling an always active state
   *
   * @param {string} name element state name
   * @returns {ElementStateError}
   */
  static cannotToggleAlwaysActive(name: string): ElementStateError {
    return new ElementStateError(
      ElementStateErrorType.CANNOT_TOGGLE_ALWAYS_ACTIVE,
      `ElementState: Cannot toggle an always active state - ${name}`,
    );
  }
}

export { ElementStateError, ElementStateErrorType };
