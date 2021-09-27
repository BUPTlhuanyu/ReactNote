/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {
  MeasureInWindowOnSuccessCallback,
  MeasureLayoutOnSuccessCallback,
  MeasureOnSuccessCallback,
  NativeMethodsMixinType,
  ReactNativeBaseComponentViewConfig,
} from './ReactNativeTypes';

import {
  mountSafeCallback_NOT_REALLY_SAFE,
  warnForStyleProps,
} from './NativeMethodsMixinUtils';
import * as ReactNativeAttributePayload from './ReactNativeAttributePayload';
import * as ReactNativeFrameScheduling from './ReactNativeFrameScheduling';
import * as ReactNativeViewConfigRegistry from 'ReactNativeViewConfigRegistry';

import deepFreezeAndThrowOnMutationInDev from 'deepFreezeAndThrowOnMutationInDev';
import invariant from 'shared/invariant';

import {dispatchEvent} from './ReactFabricEventEmitter';

// Modules provided by RN:
import TextInputState from 'TextInputState';
import {
  createNode,
  cloneNode,
  cloneNodeWithNewChildren,
  cloneNodeWithNewChildrenAndProps,
  cloneNodeWithNewProps,
  createChildSet as createChildNodeSet,
  appendChild as appendChildNode,
  appendChildToSet as appendChildNodeToSet,
  completeRoot,
  registerEventHandler,
} from 'FabricUIManager';
import UIManager from 'UIManager';

// Counter for uniquely identifying views.
// % 10 === 1 means it is a rootTag.
// % 2 === 0 means it is a Fabric tag.
// This means that they never overlap.
let nextReactTag = 2;

type Node = Object;
export type Type = string;
export type Props = Object;
export type Instance = {
  node: Node,
  canonical: ReactFabricHostComponent,
};
export type TextInstance = {
  node: Node,
};
export type HydratableInstance = Instance | TextInstance;
export type PublicInstance = ReactFabricHostComponent;
export type Container = number;
export type ChildSet = Object;
export type HostContext = $ReadOnly<{|
  isInAParentText: boolean,
|}>;
export type UpdatePayload = Object;

export type TimeoutHandle = TimeoutID;
export type NoTimeout = -1;

// TODO: Remove this conditional once all changes have propagated.
if (registerEventHandler) {
  /**
   * Register the event emitter with the native bridge
   */
  registerEventHandler(dispatchEvent);
}

/**
 * This is used for refs on host components.
 */
class ReactFabricHostComponent {
  _nativeTag: number;
  viewConfig: ReactNativeBaseComponentViewConfig<>;
  currentProps: Props;

  constructor(
    tag: number,
    viewConfig: ReactNativeBaseComponentViewConfig<>,
    props: Props,
  ) {
    this._nativeTag = tag;
    this.viewConfig = viewConfig;
    this.currentProps = props;
  }

  blur() {
    TextInputState.blurTextInput(this._nativeTag);
  }

  focus() {
    TextInputState.focusTextInput(this._nativeTag);
  }

  measure(callback: MeasureOnSuccessCallback) {
    UIManager.measure(
      this._nativeTag,
      mountSafeCallback_NOT_REALLY_SAFE(this, callback),
    );
  }

  measureInWindow(callback: MeasureInWindowOnSuccessCallback) {
    UIManager.measureInWindow(
      this._nativeTag,
      mountSafeCallback_NOT_REALLY_SAFE(this, callback),
    );
  }

  measureLayout(
    relativeToNativeNode: number,
    onSuccess: MeasureLayoutOnSuccessCallback,
    onFail: () => void /* currently unused */,
  ) {
    UIManager.measureLayout(
      this._nativeTag,
      relativeToNativeNode,
      mountSafeCallback_NOT_REALLY_SAFE(this, onFail),
      mountSafeCallback_NOT_REALLY_SAFE(this, onSuccess),
    );
  }

  setNativeProps(nativeProps: Object) {
    if (__DEV__) {
      warnForStyleProps(nativeProps, this.viewConfig.validAttributes);
    }

    const updatePayload = ReactNativeAttributePayload.create(
      nativeProps,
      this.viewConfig.validAttributes,
    );

    // Avoid the overhead of bridge calls if there's no update.
    // This is an expensive no-op for Android, and causes an unnecessary
    // view invalidation for certain components (eg RCTTextInput) on iOS.
    if (updatePayload != null) {
      UIManager.updateView(
        this._nativeTag,
        this.viewConfig.uiViewClassName,
        updatePayload,
      );
    }
  }
}

// eslint-disable-next-line no-unused-expressions
(ReactFabricHostComponent.prototype: NativeMethodsMixinType);

export * from 'shared/HostConfigWithNoMutation';
export * from 'shared/HostConfigWithNoHydration';

export function appendInitialChild(
  parentInstance: Instance,
  child: Instance | TextInstance,
): void {
  appendChildNode(parentInstance.node, child.node);
}

export function createInstance(
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object,
): Instance {
  const tag = nextReactTag;
  nextReactTag += 2;

  const viewConfig = ReactNativeViewConfigRegistry.get(type);

  if (__DEV__) {
    for (const key in viewConfig.validAttributes) {
      if (props.hasOwnProperty(key)) {
        deepFreezeAndThrowOnMutationInDev(props[key]);
      }
    }
  }

  invariant(
    type !== 'RCTView' || !hostContext.isInAParentText,
    'Nesting of <View> within <Text> is not currently supported.',
  );

  const updatePayload = ReactNativeAttributePayload.create(
    props,
    viewConfig.validAttributes,
  );

  const node = createNode(
    tag, // reactTag
    viewConfig.uiViewClassName, // viewName
    rootContainerInstance, // rootTag
    updatePayload, // props
    internalInstanceHandle, // internalInstanceHandle
  );

  const component = new ReactFabricHostComponent(tag, viewConfig, props);

  return {
    node: node,
    canonical: component,
  };
}

export function createTextInstance(
  text: string,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object,
): TextInstance {
  invariant(
    hostContext.isInAParentText,
    'Text strings must be rendered within a <Text> component.',
  );

  const tag = nextReactTag;
  nextReactTag += 2;

  const node = createNode(
    tag, // reactTag
    'RCTRawText', // viewName
    rootContainerInstance, // rootTag
    {text: text}, // props
    internalInstanceHandle, // instance handle
  );

  return {
    node: node,
  };
}

export function finalizeInitialChildren(
  parentInstance: Instance,
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
): boolean {
  return false;
}

export function getRootHostContext(
  rootContainerInstance: Container,
): HostContext {
  return {isInAParentText: false};
}

export function getChildHostContext(
  parentHostContext: HostContext,
  type: string,
  rootContainerInstance: Container,
): HostContext {
  const prevIsInAParentText = parentHostContext.isInAParentText;
  const isInAParentText =
    type === 'AndroidTextInput' || // Android
    type === 'RCTMultilineTextInputView' || // iOS
    type === 'RCTSinglelineTextInputView' || // iOS
    type === 'RCTText' ||
    type === 'RCTVirtualText';

  if (prevIsInAParentText !== isInAParentText) {
    return {isInAParentText};
  } else {
    return parentHostContext;
  }
}

export function getPublicInstance(instance: Instance): * {
  return instance.canonical;
}

export function prepareForCommit(containerInfo: Container): void {
  // Noop
}

export function prepareUpdate(
  instance: Instance,
  type: string,
  oldProps: Props,
  newProps: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
): null | Object {
  const viewConfig = instance.canonical.viewConfig;
  const updatePayload = ReactNativeAttributePayload.diff(
    oldProps,
    newProps,
    viewConfig.validAttributes,
  );
  // TODO: If the event handlers have changed, we need to update the current props
  // in the commit phase but there is no host config hook to do it yet.
  // So instead we hack it by updating it in the render phase.
  instance.canonical.currentProps = newProps;
  return updatePayload;
}

export function resetAfterCommit(containerInfo: Container): void {
  // Noop
}

export function shouldDeprioritizeSubtree(type: string, props: Props): boolean {
  return false;
}

export function shouldSetTextContent(type: string, props: Props): boolean {
  // TODO (bvaughn) Revisit this decision.
  // Always returning false simplifies the createInstance() implementation,
  // But creates an additional child Fiber for raw text children.
  // No additional native views are created though.
  // It's not clear to me which is better so I'm deferring for now.
  // More context @ github.com/facebook/react/pull/8560#discussion_r92111303
  return false;
}

// The Fabric renderer is secondary to the existing React Native renderer.
export const isPrimaryRenderer = false;
export const now = ReactNativeFrameScheduling.now;
export const scheduleDeferredCallback =
  ReactNativeFrameScheduling.scheduleDeferredCallback;
export const cancelDeferredCallback =
  ReactNativeFrameScheduling.cancelDeferredCallback;
export const shouldYield = ReactNativeFrameScheduling.shouldYield;

export const scheduleTimeout = setTimeout;
export const cancelTimeout = clearTimeout;
export const noTimeout = -1;

// -------------------
//     Persistence
// -------------------

export const supportsPersistence = true;

export function cloneInstance(
  instance: Instance,
  updatePayload: null | Object,
  type: string,
  oldProps: Props,
  newProps: Props,
  internalInstanceHandle: Object,
  keepChildren: boolean,
  recyclableInstance: null | Instance,
): Instance {
  const node = instance.node;
  let clone;
  if (keepChildren) {
    if (updatePayload !== null) {
      clone = cloneNodeWithNewProps(node, updatePayload);
    } else {
      clone = cloneNode(node);
    }
  } else {
    if (updatePayload !== null) {
      clone = cloneNodeWithNewChildrenAndProps(node, updatePayload);
    } else {
      clone = cloneNodeWithNewChildren(node);
    }
  }
  return {
    node: clone,
    canonical: instance.canonical,
  };
}

export function cloneHiddenInstance(
  instance: Instance,
  type: string,
  props: Props,
  internalInstanceHandle: Object,
): Instance {
  const viewConfig = instance.canonical.viewConfig;
  const node = instance.node;
  const updatePayload = ReactNativeAttributePayload.create(
    {style: {display: 'none'}},
    viewConfig.validAttributes,
  );
  return {
    node: cloneNodeWithNewProps(node, updatePayload),
    canonical: instance.canonical,
  };
}

export function cloneUnhiddenInstance(
  instance: Instance,
  type: string,
  props: Props,
  internalInstanceHandle: Object,
): Instance {
  const viewConfig = instance.canonical.viewConfig;
  const node = instance.node;
  const updatePayload = ReactNativeAttributePayload.diff(
    {...props, style: [props.style, {display: 'none'}]},
    props,
    viewConfig.validAttributes,
  );
  return {
    node: cloneNodeWithNewProps(node, updatePayload),
    canonical: instance.canonical,
  };
}

export function createHiddenTextInstance(
  text: string,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object,
): TextInstance {
  throw new Error('Not yet implemented.');
}

export function createContainerChildSet(container: Container): ChildSet {
  return createChildNodeSet(container);
}

export function appendChildToContainerChildSet(
  childSet: ChildSet,
  child: Instance | TextInstance,
): void {
  appendChildNodeToSet(childSet, child.node);
}

export function finalizeContainerChildren(
  container: Container,
  newChildren: ChildSet,
): void {
  completeRoot(container, newChildren);
}

export function replaceContainerChildren(
  container: Container,
  newChildren: ChildSet,
): void {}
