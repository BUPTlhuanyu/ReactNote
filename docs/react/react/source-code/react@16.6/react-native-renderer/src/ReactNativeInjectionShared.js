/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/**
 * Make sure essential globals are available and are patched correctly. Please don't remove this
 * line. Bundles created by react-packager `require` it before executing any application code. This
 * ensures it exists in the dependency graph and can be `require`d.
 * TODO: require this in packager, not in React #10932517
 */
// Module provided by RN:
import 'InitializeCore';

import * as EventPluginHub from 'events/EventPluginHub';
import ResponderEventPlugin from 'events/ResponderEventPlugin';

import ReactNativeBridgeEventPlugin from './ReactNativeBridgeEventPlugin';
import ReactNativeEventPluginOrder from './ReactNativeEventPluginOrder';

/**
 * Inject module for resolving DOM hierarchy and plugin ordering.
 */
EventPluginHub.injection.injectEventPluginOrder(ReactNativeEventPluginOrder);

/**
 * Some important event plugins included by default (without having to require
 * them).
 */
EventPluginHub.injection.injectEventPluginsByName({
  ResponderEventPlugin: ResponderEventPlugin,
  ReactNativeBridgeEventPlugin: ReactNativeBridgeEventPlugin,
});
