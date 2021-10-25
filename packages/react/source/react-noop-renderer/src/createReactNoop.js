/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/**
 * This is a renderer of React that doesn't have a render target output.
 * It is useful to demonstrate the internals of the reconciler in isolation
 * and for testing semantics of reconciliation separate from the host
 * environment.
 */

import type {Fiber} from 'react-reconciler/src/ReactFiber';
import type {UpdateQueue} from 'react-reconciler/src/ReactUpdateQueue';
import type {ReactNodeList} from 'shared/ReactTypes';

import * as ReactPortal from 'shared/ReactPortal';
import expect from 'expect';
import {REACT_FRAGMENT_TYPE, REACT_ELEMENT_TYPE} from 'shared/ReactSymbols';

type Container = {
  rootID: string,
  children: Array<Instance | TextInstance>,
};
type Props = {prop: any, hidden: boolean, children?: mixed};
type Instance = {|
  type: string,
  id: number,
  children: Array<Instance | TextInstance>,
  text: string | null,
  prop: any,
  hidden: boolean,
|};
type TextInstance = {|text: string, id: number, hidden: boolean|};

const NO_CONTEXT = {};
const UPDATE_SIGNAL = {};
if (__DEV__) {
  Object.freeze(NO_CONTEXT);
  Object.freeze(UPDATE_SIGNAL);
}

function createReactNoop(reconciler: Function, useMutation: boolean) {
  let scheduledCallback = null;
  let scheduledCallbackTimeout = -1;
  let instanceCounter = 0;
  let hostDiffCounter = 0;
  let hostUpdateCounter = 0;
  let hostCloneCounter = 0;

  function appendChildToContainerOrInstance(
    parentInstance: Container | Instance,
    child: Instance | TextInstance,
  ): void {
    const index = parentInstance.children.indexOf(child);
    if (index !== -1) {
      parentInstance.children.splice(index, 1);
    }
    parentInstance.children.push(child);
  }

  function appendChildToContainer(
    parentInstance: Container,
    child: Instance | TextInstance,
  ): void {
    if (typeof parentInstance.rootID !== 'string') {
      // Some calls to this aren't typesafe.
      // This helps surface mistakes in tests.
      throw new Error(
        'appendChildToContainer() first argument is not a container.',
      );
    }
    appendChildToContainerOrInstance(parentInstance, child);
  }

  function appendChild(
    parentInstance: Instance,
    child: Instance | TextInstance,
  ): void {
    if (typeof (parentInstance: any).rootID === 'string') {
      // Some calls to this aren't typesafe.
      // This helps surface mistakes in tests.
      throw new Error('appendChild() first argument is not an instance.');
    }
    appendChildToContainerOrInstance(parentInstance, child);
  }

  function insertInContainerOrInstanceBefore(
    parentInstance: Container | Instance,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance,
  ): void {
    const index = parentInstance.children.indexOf(child);
    if (index !== -1) {
      parentInstance.children.splice(index, 1);
    }
    const beforeIndex = parentInstance.children.indexOf(beforeChild);
    if (beforeIndex === -1) {
      throw new Error('This child does not exist.');
    }
    parentInstance.children.splice(beforeIndex, 0, child);
  }

  function insertInContainerBefore(
    parentInstance: Container,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance,
  ) {
    if (typeof parentInstance.rootID !== 'string') {
      // Some calls to this aren't typesafe.
      // This helps surface mistakes in tests.
      throw new Error(
        'insertInContainerBefore() first argument is not a container.',
      );
    }
    insertInContainerOrInstanceBefore(parentInstance, child, beforeChild);
  }

  function insertBefore(
    parentInstance: Instance,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance,
  ) {
    if (typeof (parentInstance: any).rootID === 'string') {
      // Some calls to this aren't typesafe.
      // This helps surface mistakes in tests.
      throw new Error('insertBefore() first argument is not an instance.');
    }
    insertInContainerOrInstanceBefore(parentInstance, child, beforeChild);
  }

  function removeChildFromContainerOrInstance(
    parentInstance: Container | Instance,
    child: Instance | TextInstance,
  ): void {
    const index = parentInstance.children.indexOf(child);
    if (index === -1) {
      throw new Error('This child does not exist.');
    }
    parentInstance.children.splice(index, 1);
  }

  function removeChildFromContainer(
    parentInstance: Container,
    child: Instance | TextInstance,
  ): void {
    if (typeof parentInstance.rootID !== 'string') {
      // Some calls to this aren't typesafe.
      // This helps surface mistakes in tests.
      throw new Error(
        'removeChildFromContainer() first argument is not a container.',
      );
    }
    removeChildFromContainerOrInstance(parentInstance, child);
  }

  function removeChild(
    parentInstance: Instance,
    child: Instance | TextInstance,
  ): void {
    if (typeof (parentInstance: any).rootID === 'string') {
      // Some calls to this aren't typesafe.
      // This helps surface mistakes in tests.
      throw new Error('removeChild() first argument is not an instance.');
    }
    removeChildFromContainerOrInstance(parentInstance, child);
  }

  function cloneInstance(
    instance: Instance,
    updatePayload: null | Object,
    type: string,
    oldProps: Props,
    newProps: Props,
    internalInstanceHandle: Object,
    keepChildren: boolean,
    recyclableInstance: null | Instance,
  ): Instance {
    const clone = {
      id: instance.id,
      type: type,
      children: keepChildren ? instance.children : [],
      text: shouldSetTextContent(type, newProps)
        ? (newProps.children: any) + ''
        : null,
      prop: newProps.prop,
      hidden: newProps.hidden === true,
    };
    Object.defineProperty(clone, 'id', {
      value: clone.id,
      enumerable: false,
    });
    Object.defineProperty(clone, 'text', {
      value: clone.text,
      enumerable: false,
    });
    hostCloneCounter++;
    return clone;
  }

  function shouldSetTextContent(type: string, props: Props): boolean {
    if (type === 'errorInBeginPhase') {
      throw new Error('Error in host config.');
    }
    return (
      typeof props.children === 'string' || typeof props.children === 'number'
    );
  }

  let elapsedTimeInMs = 0;

  const sharedHostConfig = {
    getRootHostContext() {
      return NO_CONTEXT;
    },

    getChildHostContext() {
      return NO_CONTEXT;
    },

    getPublicInstance(instance) {
      return instance;
    },

    createInstance(type: string, props: Props): Instance {
      if (type === 'errorInCompletePhase') {
        throw new Error('Error in host config.');
      }
      const inst = {
        id: instanceCounter++,
        type: type,
        children: [],
        text: shouldSetTextContent(type, props)
          ? (props.children: any) + ''
          : null,
        prop: props.prop,
        hidden: props.hidden === true,
      };
      // Hide from unit tests
      Object.defineProperty(inst, 'id', {value: inst.id, enumerable: false});
      Object.defineProperty(inst, 'text', {
        value: inst.text,
        enumerable: false,
      });
      return inst;
    },

    appendInitialChild(
      parentInstance: Instance,
      child: Instance | TextInstance,
    ): void {
      parentInstance.children.push(child);
    },

    finalizeInitialChildren(
      domElement: Instance,
      type: string,
      props: Props,
    ): boolean {
      return false;
    },

    prepareUpdate(
      instance: Instance,
      type: string,
      oldProps: Props,
      newProps: Props,
    ): null | {} {
      if (type === 'errorInCompletePhase') {
        throw new Error('Error in host config.');
      }
      if (oldProps === null) {
        throw new Error('Should have old props');
      }
      if (newProps === null) {
        throw new Error('Should have new props');
      }
      hostDiffCounter++;
      return UPDATE_SIGNAL;
    },

    shouldSetTextContent,

    shouldDeprioritizeSubtree(type: string, props: Props): boolean {
      return !!props.hidden;
    },

    createTextInstance(
      text: string,
      rootContainerInstance: Container,
      hostContext: Object,
      internalInstanceHandle: Object,
    ): TextInstance {
      const inst = {text: text, id: instanceCounter++, hidden: false};
      // Hide from unit tests
      Object.defineProperty(inst, 'id', {value: inst.id, enumerable: false});
      return inst;
    },

    scheduleDeferredCallback(callback, options) {
      if (scheduledCallback) {
        throw new Error(
          'Scheduling a callback twice is excessive. Instead, keep track of ' +
            'whether the callback has already been scheduled.',
        );
      }
      scheduledCallback = callback;
      if (
        typeof options === 'object' &&
        options !== null &&
        typeof options.timeout === 'number'
      ) {
        const newTimeout = options.timeout;
        if (
          scheduledCallbackTimeout === -1 ||
          scheduledCallbackTimeout > newTimeout
        ) {
          scheduledCallbackTimeout = elapsedTimeInMs + newTimeout;
        }
      }
      return 0;
    },

    cancelDeferredCallback() {
      if (scheduledCallback === null) {
        throw new Error('No callback is scheduled.');
      }
      scheduledCallback = null;
      scheduledCallbackTimeout = -1;
    },

    shouldYield,

    scheduleTimeout: setTimeout,
    cancelTimeout: clearTimeout,
    noTimeout: -1,

    prepareForCommit(): void {},

    resetAfterCommit(): void {},

    now(): number {
      return elapsedTimeInMs;
    },

    isPrimaryRenderer: true,
    supportsHydration: false,
  };

  const hostConfig = useMutation
    ? {
        ...sharedHostConfig,

        supportsMutation: true,
        supportsPersistence: false,

        commitMount(instance: Instance, type: string, newProps: Props): void {
          // Noop
        },

        commitUpdate(
          instance: Instance,
          updatePayload: Object,
          type: string,
          oldProps: Props,
          newProps: Props,
        ): void {
          if (oldProps === null) {
            throw new Error('Should have old props');
          }
          hostUpdateCounter++;
          instance.prop = newProps.prop;
          instance.hidden = newProps.hidden === true;
          if (shouldSetTextContent(type, newProps)) {
            instance.text = (newProps.children: any) + '';
          }
        },

        commitTextUpdate(
          textInstance: TextInstance,
          oldText: string,
          newText: string,
        ): void {
          hostUpdateCounter++;
          textInstance.text = newText;
        },

        appendChild,
        appendChildToContainer,
        insertBefore,
        insertInContainerBefore,
        removeChild,
        removeChildFromContainer,

        hideInstance(instance: Instance): void {
          instance.hidden = true;
        },

        hideTextInstance(textInstance: TextInstance): void {
          textInstance.hidden = true;
        },

        unhideInstance(instance: Instance, props: Props): void {
          if (!props.hidden) {
            instance.hidden = false;
          }
        },

        unhideTextInstance(textInstance: TextInstance, text: string): void {
          textInstance.hidden = false;
        },

        resetTextContent(instance: Instance): void {
          instance.text = null;
        },
      }
    : {
        ...sharedHostConfig,
        supportsMutation: false,
        supportsPersistence: true,

        cloneInstance,

        createContainerChildSet(
          container: Container,
        ): Array<Instance | TextInstance> {
          return [];
        },

        appendChildToContainerChildSet(
          childSet: Array<Instance | TextInstance>,
          child: Instance | TextInstance,
        ): void {
          childSet.push(child);
        },

        finalizeContainerChildren(
          container: Container,
          newChildren: Array<Instance | TextInstance>,
        ): void {},

        replaceContainerChildren(
          container: Container,
          newChildren: Array<Instance | TextInstance>,
        ): void {
          container.children = newChildren;
        },

        cloneHiddenInstance(
          instance: Instance,
          type: string,
          props: Props,
          internalInstanceHandle: Object,
        ): Instance {
          const clone = cloneInstance(
            instance,
            null,
            type,
            props,
            props,
            internalInstanceHandle,
            true,
            null,
          );
          clone.hidden = true;
          return clone;
        },

        cloneUnhiddenInstance(
          instance: Instance,
          type: string,
          props: Props,
          internalInstanceHandle: Object,
        ): Instance {
          const clone = cloneInstance(
            instance,
            null,
            type,
            props,
            props,
            internalInstanceHandle,
            true,
            null,
          );
          clone.hidden = props.hidden;
          return clone;
        },

        createHiddenTextInstance(
          text: string,
          rootContainerInstance: Container,
          hostContext: Object,
          internalInstanceHandle: Object,
        ): TextInstance {
          const inst = {text: text, id: instanceCounter++, hidden: true};
          // Hide from unit tests
          Object.defineProperty(inst, 'id', {
            value: inst.id,
            enumerable: false,
          });
          return inst;
        },
      };

  const NoopRenderer = reconciler(hostConfig);

  const rootContainers = new Map();
  const roots = new Map();
  const DEFAULT_ROOT_ID = '<default>';

  let yieldedValues = null;

  let didYield;
  let unitsRemaining;

  function shouldYield() {
    if (
      scheduledCallbackTimeout === -1 ||
      elapsedTimeInMs > scheduledCallbackTimeout
    ) {
      return false;
    } else {
      if (didYield || yieldedValues !== null) {
        return true;
      }
      if (unitsRemaining-- > 0) {
        return false;
      }
      didYield = true;
      return true;
    }
  }

  function* flushUnitsOfWork(n: number): Generator<Array<mixed>, void, void> {
    unitsRemaining = n + 1;
    didYield = false;
    try {
      while (!didYield && scheduledCallback !== null) {
        let cb = scheduledCallback;
        scheduledCallback = null;
        cb();
        if (yieldedValues !== null) {
          const values = yieldedValues;
          yieldedValues = null;
          yield values;
        }
      }
    } finally {
      unitsRemaining = -1;
      didYield = false;
    }
  }

  function childToJSX(child, text) {
    if (text !== null) {
      return text;
    }
    if (child === null) {
      return null;
    }
    if (typeof child === 'string') {
      return child;
    }
    if (Array.isArray(child)) {
      if (child.length === 0) {
        return null;
      }
      if (child.length === 1) {
        return childToJSX(child[0], null);
      }
      // $FlowFixMe
      const children = child.map(c => childToJSX(c, null));
      if (children.every(c => typeof c === 'string' || typeof c === 'number')) {
        return children.join('');
      }
      return children;
    }
    if (Array.isArray(child.children)) {
      // This is an instance.
      const instance: Instance = (child: any);
      const children = childToJSX(instance.children, instance.text);
      const props = ({prop: instance.prop}: any);
      if (instance.hidden) {
        props.hidden = true;
      }
      if (children !== null) {
        props.children = children;
      }
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type: instance.type,
        key: null,
        ref: null,
        props: props,
        _owner: null,
        _store: __DEV__ ? {} : undefined,
      };
    }
    // This is a text instance
    const textInstance: TextInstance = (child: any);
    if (textInstance.hidden) {
      return '';
    }
    return textInstance.text;
  }

  const ReactNoop = {
    getChildren(rootID: string = DEFAULT_ROOT_ID) {
      const container = rootContainers.get(rootID);
      if (container) {
        return container.children;
      } else {
        return null;
      }
    },

    getOrCreateRootContainer(
      rootID: string = DEFAULT_ROOT_ID,
      isConcurrent: boolean = false,
    ) {
      let root = roots.get(rootID);
      if (!root) {
        const container = {rootID: rootID, children: []};
        rootContainers.set(rootID, container);
        root = NoopRenderer.createContainer(container, isConcurrent, false);
        roots.set(rootID, root);
      }
      return root.current.stateNode.containerInfo;
    },

    getChildrenAsJSX(rootID: string = DEFAULT_ROOT_ID) {
      const children = childToJSX(ReactNoop.getChildren(rootID), null);
      if (children === null) {
        return null;
      }
      if (Array.isArray(children)) {
        return {
          $$typeof: REACT_ELEMENT_TYPE,
          type: REACT_FRAGMENT_TYPE,
          key: null,
          ref: null,
          props: {children},
          _owner: null,
          _store: __DEV__ ? {} : undefined,
        };
      }
      return children;
    },

    createPortal(
      children: ReactNodeList,
      container: Container,
      key: ?string = null,
    ) {
      return ReactPortal.createPortal(children, container, null, key);
    },

    // Shortcut for testing a single root
    render(element: React$Element<any>, callback: ?Function) {
      ReactNoop.renderToRootWithID(element, DEFAULT_ROOT_ID, callback);
    },

    renderLegacySyncRoot(element: React$Element<any>, callback: ?Function) {
      const rootID = DEFAULT_ROOT_ID;
      const isConcurrent = false;
      const container = ReactNoop.getOrCreateRootContainer(
        rootID,
        isConcurrent,
      );
      const root = roots.get(container.rootID);
      NoopRenderer.updateContainer(element, root, null, callback);
    },

    renderToRootWithID(
      element: React$Element<any>,
      rootID: string,
      callback: ?Function,
    ) {
      const isConcurrent = true;
      const container = ReactNoop.getOrCreateRootContainer(
        rootID,
        isConcurrent,
      );
      const root = roots.get(container.rootID);
      NoopRenderer.updateContainer(element, root, null, callback);
    },

    unmountRootWithID(rootID: string) {
      const root = roots.get(rootID);
      if (root) {
        NoopRenderer.updateContainer(null, root, null, () => {
          roots.delete(rootID);
          rootContainers.delete(rootID);
        });
      }
    },

    findInstance(
      componentOrElement: Element | ?React$Component<any, any>,
    ): null | Instance | TextInstance {
      if (componentOrElement == null) {
        return null;
      }
      // Unsound duck typing.
      const component = (componentOrElement: any);
      if (typeof component.id === 'number') {
        return component;
      }
      if (__DEV__) {
        return NoopRenderer.findHostInstanceWithWarning(
          component,
          'findInstance',
        );
      }
      return NoopRenderer.findHostInstance(component);
    },

    flushDeferredPri(timeout: number = Infinity): Array<mixed> {
      // The legacy version of this function decremented the timeout before
      // returning the new time.
      // TODO: Convert tests to use flushUnitsOfWork or flushAndYield instead.
      const n = timeout / 5 - 1;

      let values = [];
      // eslint-disable-next-line no-for-of-loops/no-for-of-loops
      for (const value of flushUnitsOfWork(n)) {
        values.push(...value);
      }
      return values;
    },

    flush(): Array<mixed> {
      return ReactNoop.flushUnitsOfWork(Infinity);
    },

    flushAndYield(
      unitsOfWork: number = Infinity,
    ): Generator<Array<mixed>, void, void> {
      return flushUnitsOfWork(unitsOfWork);
    },

    flushUnitsOfWork(n: number): Array<mixed> {
      let values = yieldedValues || [];
      yieldedValues = null;
      // eslint-disable-next-line no-for-of-loops/no-for-of-loops
      for (const value of flushUnitsOfWork(n)) {
        values.push(...value);
      }
      return values;
    },

    flushThrough(expected: Array<mixed>): void {
      let actual = [];
      if (expected.length !== 0) {
        // eslint-disable-next-line no-for-of-loops/no-for-of-loops
        for (const value of flushUnitsOfWork(Infinity)) {
          actual.push(...value);
          if (actual.length >= expected.length) {
            break;
          }
        }
      }
      expect(actual).toEqual(expected);
    },

    flushNextYield(): Array<mixed> {
      let actual = null;
      // eslint-disable-next-line no-for-of-loops/no-for-of-loops
      for (const value of flushUnitsOfWork(Infinity)) {
        actual = value;
        break;
      }
      return actual !== null ? actual : [];
    },

    flushWithHostCounters(
      fn: () => void,
    ):
      | {|
          hostDiffCounter: number,
          hostUpdateCounter: number,
        |}
      | {|
          hostDiffCounter: number,
          hostCloneCounter: number,
        |} {
      hostDiffCounter = 0;
      hostUpdateCounter = 0;
      hostCloneCounter = 0;
      try {
        ReactNoop.flush();
        return useMutation
          ? {
              hostDiffCounter,
              hostUpdateCounter,
            }
          : {
              hostDiffCounter,
              hostCloneCounter,
            };
      } finally {
        hostDiffCounter = 0;
        hostUpdateCounter = 0;
        hostCloneCounter = 0;
      }
    },

    expire(ms: number): Array<mixed> {
      ReactNoop.advanceTime(ms);
      return ReactNoop.flushExpired();
    },

    advanceTime(ms: number): void {
      elapsedTimeInMs += ms;
    },

    flushExpired(): Array<mixed> {
      return ReactNoop.flushUnitsOfWork(0);
    },

    yield(value: mixed) {
      if (yieldedValues === null) {
        yieldedValues = [value];
      } else {
        yieldedValues.push(value);
      }
    },

    clearYields() {
      const values = yieldedValues;
      yieldedValues = null;
      return values;
    },

    hasScheduledCallback() {
      return !!scheduledCallback;
    },

    batchedUpdates: NoopRenderer.batchedUpdates,

    deferredUpdates: NoopRenderer.deferredUpdates,

    unbatchedUpdates: NoopRenderer.unbatchedUpdates,

    interactiveUpdates: NoopRenderer.interactiveUpdates,

    flushSync(fn: () => mixed) {
      yieldedValues = [];
      NoopRenderer.flushSync(fn);
      return yieldedValues;
    },

    // Logs the current state of the tree.
    dumpTree(rootID: string = DEFAULT_ROOT_ID) {
      const root = roots.get(rootID);
      const rootContainer = rootContainers.get(rootID);
      if (!root || !rootContainer) {
        console.log('Nothing rendered yet.');
        return;
      }

      let bufferedLog = [];
      function log(...args) {
        bufferedLog.push(...args, '\n');
      }

      function logHostInstances(
        children: Array<Instance | TextInstance>,
        depth,
      ) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const indent = '  '.repeat(depth);
          if (typeof child.text === 'string') {
            log(indent + '- ' + child.text);
          } else {
            // $FlowFixMe - The child should've been refined now.
            log(indent + '- ' + child.type + '#' + child.id);
            // $FlowFixMe - The child should've been refined now.
            logHostInstances(child.children, depth + 1);
          }
        }
      }
      function logContainer(container: Container, depth) {
        log('  '.repeat(depth) + '- [root#' + container.rootID + ']');
        logHostInstances(container.children, depth + 1);
      }

      function logUpdateQueue(updateQueue: UpdateQueue<mixed>, depth) {
        log('  '.repeat(depth + 1) + 'QUEUED UPDATES');
        const firstUpdate = updateQueue.firstUpdate;
        if (!firstUpdate) {
          return;
        }

        log(
          '  '.repeat(depth + 1) + '~',
          '[' + firstUpdate.expirationTime + ']',
        );
        while (firstUpdate.next) {
          log(
            '  '.repeat(depth + 1) + '~',
            '[' + firstUpdate.expirationTime + ']',
          );
        }
      }

      function logFiber(fiber: Fiber, depth) {
        log(
          '  '.repeat(depth) +
            '- ' +
            // need to explicitly coerce Symbol to a string
            (fiber.type ? fiber.type.name || fiber.type.toString() : '[root]'),
          '[' +
            fiber.childExpirationTime +
            (fiber.pendingProps ? '*' : '') +
            ']',
        );
        if (fiber.updateQueue) {
          logUpdateQueue(fiber.updateQueue, depth);
        }
        // const childInProgress = fiber.progressedChild;
        // if (childInProgress && childInProgress !== fiber.child) {
        //   log(
        //     '  '.repeat(depth + 1) + 'IN PROGRESS: ' + fiber.pendingWorkPriority,
        //   );
        //   logFiber(childInProgress, depth + 1);
        //   if (fiber.child) {
        //     log('  '.repeat(depth + 1) + 'CURRENT');
        //   }
        // } else if (fiber.child && fiber.updateQueue) {
        //   log('  '.repeat(depth + 1) + 'CHILDREN');
        // }
        if (fiber.child) {
          logFiber(fiber.child, depth + 1);
        }
        if (fiber.sibling) {
          logFiber(fiber.sibling, depth);
        }
      }

      log('HOST INSTANCES:');
      logContainer(rootContainer, 0);
      log('FIBERS:');
      logFiber(root.current, 0);

      console.log(...bufferedLog);
    },

    flushWithoutCommitting(
      expectedFlush: Array<mixed>,
      rootID: string = DEFAULT_ROOT_ID,
    ) {
      const root: any = roots.get(rootID);
      const expiration = NoopRenderer.computeUniqueAsyncExpiration();
      const batch = {
        _defer: true,
        _expirationTime: expiration,
        _onComplete: () => {
          root.firstBatch = null;
        },
        _next: null,
      };
      root.firstBatch = batch;
      const actual = ReactNoop.flush();
      expect(actual).toEqual(expectedFlush);
      return (expectedCommit: Array<mixed>) => {
        batch._defer = false;
        NoopRenderer.flushRoot(root, expiration);
        expect(yieldedValues).toEqual(expectedCommit);
      };
    },

    getRoot(rootID: string = DEFAULT_ROOT_ID) {
      return roots.get(rootID);
    },
  };

  return ReactNoop;
}

export default createReactNoop;
