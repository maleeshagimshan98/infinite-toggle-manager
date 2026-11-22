import InfiniteToggleManager from './infinite-toggle-manager.js';
import { ElementState } from './element-state.js';
import type { ElementStateData } from './element-state.js';
import { InfiniteToggleManagerError } from './error/infinite-toggle-manager.error.js';

export {
  InfiniteToggleManager as ElementStateController,
  ElementState,
  InfiniteToggleManagerError as ElementControllerError,
};
export type { ElementStateData };
