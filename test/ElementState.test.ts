import {ElementState, ElementStateData} from "../src/ElementState";

describe('ElementState', () => {
  // Constructor Tests
  test('should initialize with valid values', () => {
    const element = new ElementState({ name: 'test', value: true, isAlwaysActive: false });
    expect(element.name).toBe('test');
    expect(element.isActive()).toBe(true);
    expect(element.isAlwaysActive()).toBe(false);
  });

  test('should initialize with default values', () => {
    const element = new ElementState({ name: 'defaultTest' });
    expect(element.isActive()).toBe(false);
    expect(element.isAlwaysActive()).toBe(false);
  });

  test('should throw error if name is not a string', () => {
    expect(() => new ElementState({ name: 123 as unknown as string })).toThrow(
      'ElementState: An ElementState must have a name'
    );
  });  
  
  test('should handle invalid value types gracefully', () => {
    expect(() => new ElementState({ name: 'test', value: 'invalid' as unknown as boolean })).toThrow(
      'ElementState: Invalid value type for value'
    );
  });

  test('should throw error if isAlwaysActive is true but value is false', () => {
    expect(() => {
      new ElementState({ name: 'invalidAlwaysActive', value: false, isAlwaysActive: true });
    }).toThrow(
      'ElementState: the element value cannot be false when isAlwaysActive is set to true in invalidAlwaysActive'
    );
  });

  test('should throw error if name is missing', () => {
    expect(() => new ElementState({} as unknown as ElementStateData)).toThrow('ElementState: An ElementState must have a name');
  });

  // Method: active
  test('should activate the state', () => {
    const element = new ElementState({ name: 'activateTest' });
    element.active();
    expect(element.isActive()).toBe(true);
  });

  // Method: inactive
  test('should deactivate the state', () => {
    const element = new ElementState({ name: 'deactivateTest', value: true });
    element.inactive();
    expect(element.isActive()).toBe(false);
  });

  test('should not deactivate an always active state', () => {
    console.warn = jest.fn();
    const element = new ElementState({ name: 'alwaysActiveTest', value: true, isAlwaysActive: true });
    element.inactive();
    expect(console.warn).toHaveBeenCalledWith('Cannot turn off the an always active state - alwaysActiveTest');
    expect(element.isActive()).toBe(true);
  });

  // Method: toggle
  test('should toggle the state', () => {
    const element = new ElementState({ name: 'toggleTest', value: true });
    element.toggle();
    expect(element.isActive()).toBe(false);
    element.toggle();
    expect(element.isActive()).toBe(true);
  });

  test('should not toggle an always active state', () => {
    console.warn = jest.fn();
    const element = new ElementState({ name: 'alwaysActiveToggleTest', value: true, isAlwaysActive: true });
    element.toggle();
    expect(console.warn).toHaveBeenCalledWith('Trying to toggle the state of an always active state - alwaysActiveToggleTest');
    expect(element.isActive()).toBe(true);
  });

  test('should toggle state multiple times', () => {
    const element = new ElementState({ name: 'toggleMultipleTest', value: false });
    element.toggle();
    expect(element.isActive()).toBe(true);
    element.toggle();
    expect(element.isActive()).toBe(false);
    element.toggle();
    expect(element.isActive()).toBe(true);
  });

  // Method: isActive
  test('should return true if active', () => {
    const element = new ElementState({ name: 'isActiveTest', value: true });
    expect(element.isActive()).toBe(true);
  });

  test('should return false if inactive', () => {
    const element = new ElementState({ name: 'isInactiveTest', value: false });
    expect(element.isActive()).toBe(false);
  });

  // Method: isAlwaysActive
  test('should return true if always active', () => {
    const element = new ElementState({ name: 'isAlwaysActiveTest', value: true, isAlwaysActive: true });
    expect(element.isAlwaysActive()).toBe(true);
  });

  test('should set value to true when isAlwaysActive is set to true', () => {
    const element = new ElementState({ name: 'testSetAlwaysActive' });
    element.setIsAlwaysActive(true);
    expect(element.isActive()).toBe(true);
  });

  test('should not allow invalid state transitions', () => {
    const element = new ElementState({ name: 'invalidTransitionTest', value: true, isAlwaysActive: true });
    element.inactive();
    expect(element.isActive()).toBe(true);
    element.toggle();
    expect(element.isActive()).toBe(true);
  });
  
  test('should set value to false when isAlwaysActive is set to false', () => {
    const element = new ElementState({ name: 'testUnsetAlwaysActive', value: true, isAlwaysActive: true });
    element.setIsAlwaysActive(false);
    expect(element.isActive()).toBe(false);
  });

  test('should return false if not always active', () => {
    const element = new ElementState({ name: 'isNotAlwaysActiveTest', isAlwaysActive: false });
    expect(element.isAlwaysActive()).toBe(false);
  });

  // Method: setIsAlwaysActive
  test('should set isAlwaysActive to true', () => {
    const element = new ElementState({ name: 'setAlwaysActiveTest' });
    element.setIsAlwaysActive(true);
    expect(element.isAlwaysActive()).toBe(true);
  });

  test('should set isAlwaysActive to false', () => {
    const element = new ElementState({ name: 'setNotAlwaysActiveTest', value: true, isAlwaysActive: true });
    element.setIsAlwaysActive(false);
    expect(element.isAlwaysActive()).toBe(false);
  });

  test('should throw error on invalid isAlwaysActive value', () => {
    const element = new ElementState({ name: 'invalidActiveTest' });
    expect(() => element.setIsAlwaysActive('' as unknown as boolean)).toThrow(
      'Trying to set the isAlwaysActive in invalidActiveTest. The value must be a boolean, but found string'
    );
  });

  test('should handle a large number of ElementState instances', () => {
    const elements: ElementState[] = [];
    for (let i = 0; i < 10000; i++) {
      elements.push(new ElementState({ name: `element${i}` }));
    }
    expect(elements.length).toBe(10000);
  });
});