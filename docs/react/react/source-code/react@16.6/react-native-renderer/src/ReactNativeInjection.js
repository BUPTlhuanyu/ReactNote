/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import './ReactNativeInjectionShared';

import * as ReactNativeComponentTree from './ReactNativeComponentTree';
import * as EventPluginUtils from 'events/EventPluginUtils';
import * as ReactNativeEventEmitter from './ReactNativeEventEmitter';
import ReactNativeGlobalResponderHandler from './ReactNativeGlobalResponderHandler';
import ResponderEventPlugin from 'events/ResponderEventPlugin';

// Module provided by RN:
import RCTEventEmitter from 'RCTEventEmitter';

/**
 * Register the event emitter with the native bridge
 */
RCTEventEmitter.register(ReactNativeEventEmitter);

EventPluginUtils.setComponentTree(
  ReactNativeComponentTree.getFiberCurrentPropsFromNode,
  ReactNativeComponentTree.getInstanceFromNode,
  ReactNativeComponentTree.getNodeFromInstance,
);

ResponderEventPlugin.injection.injectGlobalResponderHandler(
  ReactNativeGlobalResponderHandler,
);
