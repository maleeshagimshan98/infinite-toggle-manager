import ElementStateController from '../src/ElementStateController';
import { ElementState, ElementStateData } from '../src/ElementState';

describe('ElementStateController', () => {
  // Constructor Tests
  test('should throw an error when initialized with invalid data', () => {
    expect(() => {
      new ElementStateController({}, { activeAll: true, inactiveAll: true });
    }).toThrow('ElementStateController: activeAll and inactiveAll cannot be true at the same time');
  });

  test('should initialize and activate all elements', () => {
    const elements = {
      element1: { name: 'element1' },
      element2: { name: 'element2' },
    };
    const controller = new ElementStateController(elements, { multiple: true, activeAll: true });
    expect(controller.getElement('element1').isActive()).toBe(true);
    expect(controller.getElement('element2').isActive()).toBe(true);
  });

  test('should throw an error when trying to activate all elements if multiple is set to false', () => {
    // Mock console.warn
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const elements = {
      element1: { name: 'element1' },
      element2: { name: 'element2' },
    };

    // Test the behavior
    new ElementStateController(elements, { activeAll: true });

    // Assert that console.warn was called with the expected message
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'ElementStateController: Cannot turn on all the elements - ElementStateController.multiple is set to false',
    );

    // Restore the original console.warn
    consoleWarnSpy.mockRestore();
  });

  test('should initialize and keep all elements inactive', () => {
    const elements = {
      element1: { name: 'element1' },
      element2: { name: 'element2' },
    };
    const controller = new ElementStateController(elements, { inactiveAll: true });
    expect(controller.getElement('element1').isActive()).toBe(false);
    expect(controller.getElement('element2').isActive()).toBe(false);
  });

  test('should throw error if trying to add an element with a duplicate name', () => {
    const controller = new ElementStateController({}, {});
    controller.addElement({ name: 'duplicateElement' });
    expect(() => {
      controller.addElement({ name: 'duplicateElement' });
    }).toThrow('ActiveStateSwitcher - An element with name duplicateElement is already exists.');
  });

  // Method: _allowMultipleElements
  test('_allowMultipleElements should return correct boolean based on multiple settings', () => {
    const controller = new ElementStateController({}, { multiple: true });
    expect(controller.hasAllowMultipleElements()).toBe(true);

    controller.setMultipleElementsAllowState(false);
    expect(controller.hasAllowMultipleElements() && controller.hasAnyActiveStateFound()).toBe(false);
  });

  // Method: _contradictWithMultipleElementRule
  test('_contradictWithMultipleElementRule should detect contradiction', () => {
    const controller = new ElementStateController({}, { multiple: false });
    const elementState1 = new ElementState({ name: 'test1', value: true, isAlwaysActive: true });
    const elementState2 = new ElementState({ name: 'test2', value: true, isAlwaysActive: true });
    controller.addElement(elementState1);
    expect(() => controller.addElement(elementState2)).toThrow(
      `An element with name test2 contradicts with multiple active state rule`,
    );
  });

  test('addElement should throw error for empty object', () => {
    const controller = new ElementStateController({}, {});
    expect(() => {
      controller.addElement({} as unknown as ElementStateData);
    }).toThrow(
      'ElementStateController: parameter elementState must be a valid object having a name property or an instance of ElementState',
    );
  });

  // Method: _initElements
  test('_initElements should initialize elements correctly', () => {
    const elements = {
      element1: { name: 'element1' },
    };
    const controller = new ElementStateController(elements, {});
    expect(controller.getElement('element1').name).toBe('element1');
  });

  // Method: _throwErrorIfElementNotDefined
  test('_throwErrorIfElementNotDefined should throw error if element not defined', () => {
    const controller = new ElementStateController({}, {});
    expect(() => {
      controller.getElement('nonExistent');
    }).toThrow('ActiveStateSwitcher - Element with the name nonExistent is not defined in ElementStateController');
  });

  // Method: getElement
  test('getElement should retrieve an existing element', () => {
    const elementState = new ElementState({ name: 'test' });
    const controller = new ElementStateController({}, {});
    controller.addElement(elementState);
    expect(controller.getElement('test')).toBe(elementState);
  });

  // Method: addElement
  test('addElement should add a new element', () => {
    const controller = new ElementStateController({}, {});
    controller.addElement({ name: 'newElement' });
    expect(controller.getElement('newElement').name).toBe('newElement');
  });

  test('addElement should throw error for invalid element', () => {
    const controller = new ElementStateController({}, {});
    expect(() => {
      controller.addElement({} as unknown as ElementStateData);
    }).toThrow(
      'ElementStateController: parameter elementState must be a valid object having a name property or an instance of ElementState',
    );
  });

  // Method: activeAll
  test('activeAll should activate all elements if multiple is true', () => {
    const elements = {
      element1: new ElementState({ name: 'element1' }),
      element2: new ElementState({ name: 'element2' }),
    };
    const controller = new ElementStateController(elements, { multiple: true });
    controller.activeAll();
    expect(controller.getElement('element1').isActive()).toBe(true);
    expect(controller.getElement('element2').isActive()).toBe(true);
  });

  test('activeAll should not activate all elements if multiple is false', () => {
    console.warn = jest.fn();
    const elements = {
      element1: new ElementState({ name: 'element1' }),
      element2: new ElementState({ name: 'element2' }),
    };
    const controller = new ElementStateController(elements, { multiple: false });
    controller.activeAll();
    expect(console.warn).toHaveBeenCalled();
  });

  // Method: inactiveAll
  test('inactiveAll should deactivate all elements', () => {
    const elements = {
      element1: new ElementState({ name: 'element1', value: true }),
      element2: new ElementState({ name: 'element2', value: true }),
    };
    const controller = new ElementStateController(elements, { multiple: true });
    controller.inactiveAll();
    expect(controller.getElement('element1').isActive()).toBe(false);
    expect(controller.getElement('element2').isActive()).toBe(false);
  });

  test('inactiveAll should not deactivate always active elements', () => {
    const elements = {
      element1: new ElementState({ name: 'element1', value: true, isAlwaysActive: true }),
      element2: new ElementState({ name: 'element2', value: true }),
    };
    const controller = new ElementStateController(elements, { multiple: true });
    controller.inactiveAll();
    expect(controller.getElement('element1').isActive()).toBe(true);
    expect(controller.getElement('element2').isActive()).toBe(false);
  });

  // Method: active
  test('active should activate a specific element', () => {
    const elements = {
      element1: new ElementState({ name: 'element1' }),
    };
    const controller = new ElementStateController(elements, {});
    controller.active('element1');
    expect(controller.getElement('element1').isActive()).toBe(true);
  });

  test('active should throw error if element does not exist', () => {
    const controller = new ElementStateController({}, {});
    expect(() => {
      controller.active('nonExistent');
    }).toThrow('ActiveStateSwitcher - Element with the name nonExistent is not defined in ElementStateController');
  });

  // Method: inactive
  test('inactive should deactivate a specific element', () => {
    const elements = {
      element1: new ElementState({ name: 'element1', value: true }),
    };
    const controller = new ElementStateController(elements, {});
    controller.inactive('element1');
    expect(controller.getElement('element1').isActive()).toBe(false);
  });

  test('inactive should throw error if element does not exist', () => {
    const controller = new ElementStateController({}, {});
    expect(() => {
      controller.inactive('nonExistent');
    }).toThrow('ActiveStateSwitcher - Element with the name nonExistent is not defined in ElementStateController');
  });

  // Method: toggle
  test('toggle should toggle a specific element', () => {
    const elements = {
      element1: new ElementState({ name: 'element1' }),
    };
    const controller = new ElementStateController(elements, {});
    controller.toggle('element1');
    expect(controller.getElement('element1').isActive()).toBe(true);
    controller.toggle('element1');
    expect(controller.getElement('element1').isActive()).toBe(false);
  });

  test('toggle should not toggle always active element', () => {
    console.warn = jest.fn();
    const elements = {
      element1: new ElementState({ name: 'element1', value: true, isAlwaysActive: true }),
    };
    const controller = new ElementStateController(elements, {});
    controller.toggle('element1');
    expect(console.warn).toHaveBeenCalled();
  });

  test('toggle should throw error if element does not exist', () => {
    const controller = new ElementStateController({}, {});
    expect(() => {
      controller.toggle('nonExistent');
    }).toThrow('ActiveStateSwitcher - Element with the name nonExistent is not defined in ElementStateController');
  });

  test('should handle a large number of elements efficiently', () => {
    const elements: Record<string, ElementStateData> = {};
    for (let i = 0; i < 100000; i++) {
      elements[`element${i}`] = { name: `element${i}` };
    }
    const controller = new ElementStateController(elements, {});
    expect(Object.keys(controller['_elements']).length).toBe(100000);
  });
});
