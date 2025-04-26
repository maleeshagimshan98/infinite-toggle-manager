enum ElementErrorType {
  'ELEMENT_NOT_SET',
  'ELEMENT_ALREADY_EXIST',
  'ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE',
}

const errorMessage = {
  [ElementErrorType.ELEMENT_NOT_SET]: (name: string): string => {
    return `ActiveStateSwitcher - Element with the name ${name} is not defined in ElementStateController`;
  },
  [ElementErrorType.ELEMENT_ALREADY_EXIST]: (name: string): string => {
    return `ActiveStateSwitcher - An element with name ${name} is already exists.`;
  },
  [ElementErrorType.ELEMENT_CONTRADICTS_MULTIPLE_STATE_RULE]: (name: string): string => {
    return `ActiveStateSwitcher - An element with name ${name} contradicts with multiple active state rule.`;
  },
};

class ElementError extends Error {
  type: ElementErrorType;
  constructor(type: ElementErrorType, inputName: string) {
    super(errorMessage[type](inputName));
    this.type = type;
  }
}

export { ElementError, ElementErrorType };
