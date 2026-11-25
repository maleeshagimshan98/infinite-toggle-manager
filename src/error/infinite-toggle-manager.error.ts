/**
 * Copyright - 2025 - Maleesha Gimshan (www.github.com/maleeshagimshan98)
 */

enum ToggleManagerErrorType {
  'ELEMENT_NOT_SET',
  'ELEMENT_ALREADY_EXIST',
  'ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE',
  'CANNOT_ACTIVATE_ALL_WITHOUT_MULTIPLE',
  'CONFLICTING_OPTIONS',
  'INVALID_ELEMENT',
}

class InfiniteToggleManagerError extends Error {
  type: ToggleManagerErrorType;

  /**
   * constructor - prefer the static factory methods, which build the message for each error type
   *
   * @param {ToggleManagerErrorType} type error type
   * @param {string} message error message
   */
  constructor(type: ToggleManagerErrorType, message: string) {
    super(message);
    this.type = type;
  }

  /**
   * Error for an element name that is not set
   *
   * @param {string} name element name
   * @returns {InfiniteToggleManagerError}
   */
  static elementNotSet(name: string): InfiniteToggleManagerError {
    return new InfiniteToggleManagerError(
      ToggleManagerErrorType.ELEMENT_NOT_SET,
      `InfiniteToggleManager - Element with the name ${name} is not defined in ElementStateController`,
    );
  }

  /**
   * Error for adding an element under a name that is already set
   *
   * @param {string} name element name
   * @returns {InfiniteToggleManagerError}
   */
  static elementAlreadyExists(name: string): InfiniteToggleManagerError {
    return new InfiniteToggleManagerError(
      ToggleManagerErrorType.ELEMENT_ALREADY_EXIST,
      `InfiniteToggleManager - An element with name ${name} is already exists.`,
    );
  }

  /**
   * Error for an element that would break the single-active rule
   *
   * @param {string} name element name
   * @returns {InfiniteToggleManagerError}
   */
  static contradictsMultipleStateRule(name: string): InfiniteToggleManagerError {
    return new InfiniteToggleManagerError(
      ToggleManagerErrorType.ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE,
      `InfiniteToggleManager - An element with name ${name} contradicts with multiple active state rule.`,
    );
  }

  /**
   * Error for activating every element while multiple is false
   *
   * @returns {InfiniteToggleManagerError}
   */
  static cannotActivateAll(): InfiniteToggleManagerError {
    return new InfiniteToggleManagerError(
      ToggleManagerErrorType.CANNOT_ACTIVATE_ALL_WITHOUT_MULTIPLE,
      `InfiniteToggleManager - Cannot activate all elements while multiple is set to false.`,
    );
  }

  /**
   * Error for setting the activeAll and inactiveAll options together
   *
   * @returns {InfiniteToggleManagerError}
   */
  static conflictingOptions(): InfiniteToggleManagerError {
    return new InfiniteToggleManagerError(
      ToggleManagerErrorType.CONFLICTING_OPTIONS,
      `ElementStateController: activeAll and inactiveAll cannot be true at the same time`,
    );
  }

  /**
   * Error for adding something that is neither an ElementState nor ElementStateData
   *
   * @returns {InfiniteToggleManagerError}
   */
  static invalidElement(): InfiniteToggleManagerError {
    return new InfiniteToggleManagerError(
      ToggleManagerErrorType.INVALID_ELEMENT,
      `ElementStateController: parameter elementState must be a valid object having a name property or an instance of ElementState`,
    );
  }

  /**
   * Error for creating an element from an object that is not ElementStateData
   *
   * @returns {InfiniteToggleManagerError}
   */
  static emptyElement(): InfiniteToggleManagerError {
    return new InfiniteToggleManagerError(
      ToggleManagerErrorType.INVALID_ELEMENT,
      `ElementStateController: Cannot create the state with an empty object`,
    );
  }

  /**
   * Error for an empty value in the elements passed into the constructor
   *
   * @param {string} foundType type of the value that was passed
   * @returns {InfiniteToggleManagerError}
   */
  static invalidInitialElement(foundType: string): InfiniteToggleManagerError {
    return new InfiniteToggleManagerError(
      ToggleManagerErrorType.INVALID_ELEMENT,
      `Cannot initialize elements with type of ${foundType}`,
    );
  }
}

export { InfiniteToggleManagerError, ToggleManagerErrorType };
