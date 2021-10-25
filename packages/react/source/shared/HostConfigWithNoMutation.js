/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import invariant from 'shared/invariant';

// Renderers that don't support mutation
// can re-export everything from this module.

function shim(...args: any) {
  invariant(
    false,
    'The current renderer does not support mutation. ' +
      'This error is likely caused by a bug in React. ' +
      'Please file an issue.',
  );
}

// Mutation (when unsupported)
export const supportsMutation = false;
export const appendChild = shim;
export const appendChildToContainer = shim;
export const commitTextUpdate = shim;
export const commitMount = shim;
export const commitUpdate = shim;
export const insertBefore = shim;
export const insertInContainerBefore = shim;
export const removeChild = shim;
export const removeChildFromContainer = shim;
export const resetTextContent = shim;
export const hideInstance = shim;
export const hideTextInstance = shim;
export const unhideInstance = shim;
export const unhideTextInstance = shim;
