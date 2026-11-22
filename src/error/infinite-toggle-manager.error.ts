/**
 * Copyright - 2025 - Maleesha Gimshan (www.github.com/maleeshagimshan98)
 */

enum ToggleManagerErrorType {
  'ELEMENT_NOT_SET',
  'ELEMENT_ALREADY_EXIST',
  'ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE',
}

const errorMessage = {
  [ToggleManagerErrorType.ELEMENT_NOT_SET]: (name: string): string => {
    return `InfiniteToggleManager - Element with the name ${name} is not defined in ElementStateController`;
  },
  [ToggleManagerErrorType.ELEMENT_ALREADY_EXIST]: (name: string): string => {
    return `InfiniteToggleManager - An element with name ${name} is already exists.`;
  },
  [ToggleManagerErrorType.ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE]: (name: string): string => {
    return `InfiniteToggleManager - An element with name ${name} contradicts with multiple active state rule.`;
  },
};

class InfiniteToggleManagerError extends Error {
  type: ToggleManagerErrorType;

  /**
   * constructor
   *
   * @param {ToggleManagerErrorType} type error type, which selects the message
   * @param {string} inputName name of the element the error refers to
   */
  constructor(type: ToggleManagerErrorType, inputName: string) {
    super(errorMessage[type](inputName));
    this.type = type;
  }
}

export { InfiniteToggleManagerError, ToggleManagerErrorType };
