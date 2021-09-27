/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Fiber} from './ReactFiber';

import {getStackByFiberInDevAndProd} from './ReactCurrentFiber';

import getComponentName from 'shared/getComponentName';
import {StrictMode} from './ReactTypeOfMode';
import lowPriorityWarning from 'shared/lowPriorityWarning';
import warningWithoutStack from 'shared/warningWithoutStack';

type LIFECYCLE =
  | 'UNSAFE_componentWillMount'
  | 'UNSAFE_componentWillReceiveProps'
  | 'UNSAFE_componentWillUpdate';
type LifecycleToComponentsMap = {[lifecycle: LIFECYCLE]: Array<Fiber>};
type FiberToLifecycleMap = Map<Fiber, LifecycleToComponentsMap>;
type FiberArray = Array<Fiber>;
type FiberToFiberComponentsMap = Map<Fiber, FiberArray>;

const ReactStrictModeWarnings = {
  discardPendingWarnings(): void {},
  flushPendingDeprecationWarnings(): void {},
  flushPendingUnsafeLifecycleWarnings(): void {},
  recordDeprecationWarnings(fiber: Fiber, instance: any): void {},
  recordUnsafeLifecycleWarnings(fiber: Fiber, instance: any): void {},
  recordLegacyContextWarning(fiber: Fiber, instance: any): void {},
  flushLegacyContextWarning(): void {},
};

if (__DEV__) {
  const LIFECYCLE_SUGGESTIONS = {
    UNSAFE_componentWillMount: 'componentDidMount',
    UNSAFE_componentWillReceiveProps: 'static getDerivedStateFromProps',
    UNSAFE_componentWillUpdate: 'componentDidUpdate',
  };

  let pendingComponentWillMountWarnings: Array<Fiber> = [];
  let pendingComponentWillReceivePropsWarnings: Array<Fiber> = [];
  let pendingComponentWillUpdateWarnings: Array<Fiber> = [];
  let pendingUnsafeLifecycleWarnings: FiberToLifecycleMap = new Map();
  let pendingLegacyContextWarning: FiberToFiberComponentsMap = new Map();

  // Tracks components we have already warned about.
  const didWarnAboutDeprecatedLifecycles = new Set();
  const didWarnAboutUnsafeLifecycles = new Set();
  const didWarnAboutLegacyContext = new Set();

  const setToSortedString = set => {
    const array = [];
    set.forEach(value => {
      array.push(value);
    });
    return array.sort().join(', ');
  };

  ReactStrictModeWarnings.discardPendingWarnings = () => {
    pendingComponentWillMountWarnings = [];
    pendingComponentWillReceivePropsWarnings = [];
    pendingComponentWillUpdateWarnings = [];
    pendingUnsafeLifecycleWarnings = new Map();
    pendingLegacyContextWarning = new Map();
  };

  ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings = () => {
    ((pendingUnsafeLifecycleWarnings: any): FiberToLifecycleMap).forEach(
      (lifecycleWarningsMap, strictRoot) => {
        const lifecyclesWarningMesages = [];

        Object.keys(lifecycleWarningsMap).forEach(lifecycle => {
          const lifecycleWarnings = lifecycleWarningsMap[lifecycle];
          if (lifecycleWarnings.length > 0) {
            const componentNames = new Set();
            lifecycleWarnings.forEach(fiber => {
              componentNames.add(getComponentName(fiber.type) || 'Component');
              didWarnAboutUnsafeLifecycles.add(fiber.type);
            });

            const formatted = lifecycle.replace('UNSAFE_', '');
            const suggestion = LIFECYCLE_SUGGESTIONS[lifecycle];
            const sortedComponentNames = setToSortedString(componentNames);

            lifecyclesWarningMesages.push(
              `${formatted}: Please update the following components to use ` +
                `${suggestion} instead: ${sortedComponentNames}`,
            );
          }
        });

        if (lifecyclesWarningMesages.length > 0) {
          const strictRootComponentStack = getStackByFiberInDevAndProd(
            strictRoot,
          );

          warningWithoutStack(
            false,
            'Unsafe lifecycle methods were found within a strict-mode tree:%s' +
              '\n\n%s' +
              '\n\nLearn more about this warning here:' +
              '\nhttps://fb.me/react-strict-mode-warnings',
            strictRootComponentStack,
            lifecyclesWarningMesages.join('\n\n'),
          );
        }
      },
    );

    pendingUnsafeLifecycleWarnings = new Map();
  };

  const findStrictRoot = (fiber: Fiber): Fiber | null => {
    let maybeStrictRoot = null;

    let node = fiber;
    while (node !== null) {
      if (node.mode & StrictMode) {
        maybeStrictRoot = node;
      }
      node = node.return;
    }

    return maybeStrictRoot;
  };

  ReactStrictModeWarnings.flushPendingDeprecationWarnings = () => {
    if (pendingComponentWillMountWarnings.length > 0) {
      const uniqueNames = new Set();
      pendingComponentWillMountWarnings.forEach(fiber => {
        uniqueNames.add(getComponentName(fiber.type) || 'Component');
        didWarnAboutDeprecatedLifecycles.add(fiber.type);
      });

      const sortedNames = setToSortedString(uniqueNames);

      lowPriorityWarning(
        false,
        'componentWillMount is deprecated and will be removed in the next major version. ' +
          'Use componentDidMount instead. As a temporary workaround, ' +
          'you can rename to UNSAFE_componentWillMount.' +
          '\n\nPlease update the following components: %s' +
          '\n\nLearn more about this warning here:' +
          '\nhttps://fb.me/react-async-component-lifecycle-hooks',
        sortedNames,
      );

      pendingComponentWillMountWarnings = [];
    }

    if (pendingComponentWillReceivePropsWarnings.length > 0) {
      const uniqueNames = new Set();
      pendingComponentWillReceivePropsWarnings.forEach(fiber => {
        uniqueNames.add(getComponentName(fiber.type) || 'Component');
        didWarnAboutDeprecatedLifecycles.add(fiber.type);
      });

      const sortedNames = setToSortedString(uniqueNames);

      lowPriorityWarning(
        false,
        'componentWillReceiveProps is deprecated and will be removed in the next major version. ' +
          'Use static getDerivedStateFromProps instead.' +
          '\n\nPlease update the following components: %s' +
          '\n\nLearn more about this warning here:' +
          '\nhttps://fb.me/react-async-component-lifecycle-hooks',
        sortedNames,
      );

      pendingComponentWillReceivePropsWarnings = [];
    }

    if (pendingComponentWillUpdateWarnings.length > 0) {
      const uniqueNames = new Set();
      pendingComponentWillUpdateWarnings.forEach(fiber => {
        uniqueNames.add(getComponentName(fiber.type) || 'Component');
        didWarnAboutDeprecatedLifecycles.add(fiber.type);
      });

      const sortedNames = setToSortedString(uniqueNames);

      lowPriorityWarning(
        false,
        'componentWillUpdate is deprecated and will be removed in the next major version. ' +
          'Use componentDidUpdate instead. As a temporary workaround, ' +
          'you can rename to UNSAFE_componentWillUpdate.' +
          '\n\nPlease update the following components: %s' +
          '\n\nLearn more about this warning here:' +
          '\nhttps://fb.me/react-async-component-lifecycle-hooks',
        sortedNames,
      );

      pendingComponentWillUpdateWarnings = [];
    }
  };

  ReactStrictModeWarnings.recordDeprecationWarnings = (
    fiber: Fiber,
    instance: any,
  ) => {
    // Dedup strategy: Warn once per component.
    if (didWarnAboutDeprecatedLifecycles.has(fiber.type)) {
      return;
    }

    // Don't warn about react-lifecycles-compat polyfilled components.
    if (
      typeof instance.componentWillMount === 'function' &&
      instance.componentWillMount.__suppressDeprecationWarning !== true
    ) {
      pendingComponentWillMountWarnings.push(fiber);
    }
    if (
      typeof instance.componentWillReceiveProps === 'function' &&
      instance.componentWillReceiveProps.__suppressDeprecationWarning !== true
    ) {
      pendingComponentWillReceivePropsWarnings.push(fiber);
    }
    if (
      typeof instance.componentWillUpdate === 'function' &&
      instance.componentWillUpdate.__suppressDeprecationWarning !== true
    ) {
      pendingComponentWillUpdateWarnings.push(fiber);
    }
  };

  ReactStrictModeWarnings.recordUnsafeLifecycleWarnings = (
    fiber: Fiber,
    instance: any,
  ) => {
    const strictRoot = findStrictRoot(fiber);
    if (strictRoot === null) {
      warningWithoutStack(
        false,
        'Expected to find a StrictMode component in a strict mode tree. ' +
          'This error is likely caused by a bug in React. Please file an issue.',
      );
      return;
    }

    // Dedup strategy: Warn once per component.
    // This is difficult to track any other way since component names
    // are often vague and are likely to collide between 3rd party libraries.
    // An expand property is probably okay to use here since it's DEV-only,
    // and will only be set in the event of serious warnings.
    if (didWarnAboutUnsafeLifecycles.has(fiber.type)) {
      return;
    }

    let warningsForRoot;
    if (!pendingUnsafeLifecycleWarnings.has(strictRoot)) {
      warningsForRoot = {
        UNSAFE_componentWillMount: [],
        UNSAFE_componentWillReceiveProps: [],
        UNSAFE_componentWillUpdate: [],
      };

      pendingUnsafeLifecycleWarnings.set(strictRoot, warningsForRoot);
    } else {
      warningsForRoot = pendingUnsafeLifecycleWarnings.get(strictRoot);
    }

    const unsafeLifecycles = [];
    if (
      (typeof instance.componentWillMount === 'function' &&
        instance.componentWillMount.__suppressDeprecationWarning !== true) ||
      typeof instance.UNSAFE_componentWillMount === 'function'
    ) {
      unsafeLifecycles.push('UNSAFE_componentWillMount');
    }
    if (
      (typeof instance.componentWillReceiveProps === 'function' &&
        instance.componentWillReceiveProps.__suppressDeprecationWarning !==
          true) ||
      typeof instance.UNSAFE_componentWillReceiveProps === 'function'
    ) {
      unsafeLifecycles.push('UNSAFE_componentWillReceiveProps');
    }
    if (
      (typeof instance.componentWillUpdate === 'function' &&
        instance.componentWillUpdate.__suppressDeprecationWarning !== true) ||
      typeof instance.UNSAFE_componentWillUpdate === 'function'
    ) {
      unsafeLifecycles.push('UNSAFE_componentWillUpdate');
    }

    if (unsafeLifecycles.length > 0) {
      unsafeLifecycles.forEach(lifecycle => {
        ((warningsForRoot: any): LifecycleToComponentsMap)[lifecycle].push(
          fiber,
        );
      });
    }
  };

  ReactStrictModeWarnings.recordLegacyContextWarning = (
    fiber: Fiber,
    instance: any,
  ) => {
    const strictRoot = findStrictRoot(fiber);
    if (strictRoot === null) {
      warningWithoutStack(
        false,
        'Expected to find a StrictMode component in a strict mode tree. ' +
          'This error is likely caused by a bug in React. Please file an issue.',
      );
      return;
    }

    // Dedup strategy: Warn once per component.
    if (didWarnAboutLegacyContext.has(fiber.type)) {
      return;
    }

    let warningsForRoot = pendingLegacyContextWarning.get(strictRoot);

    if (
      fiber.type.contextTypes != null ||
      fiber.type.childContextTypes != null ||
      (instance !== null && typeof instance.getChildContext === 'function')
    ) {
      if (warningsForRoot === undefined) {
        warningsForRoot = [];
        pendingLegacyContextWarning.set(strictRoot, warningsForRoot);
      }
      warningsForRoot.push(fiber);
    }
  };

  ReactStrictModeWarnings.flushLegacyContextWarning = () => {
    ((pendingLegacyContextWarning: any): FiberToFiberComponentsMap).forEach(
      (fiberArray: FiberArray, strictRoot) => {
        const uniqueNames = new Set();
        fiberArray.forEach(fiber => {
          uniqueNames.add(getComponentName(fiber.type) || 'Component');
          didWarnAboutLegacyContext.add(fiber.type);
        });

        const sortedNames = setToSortedString(uniqueNames);
        const strictRootComponentStack = getStackByFiberInDevAndProd(
          strictRoot,
        );

        warningWithoutStack(
          false,
          'Legacy context API has been detected within a strict-mode tree: %s' +
            '\n\nPlease update the following components: %s' +
            '\n\nLearn more about this warning here:' +
            '\nhttps://fb.me/react-strict-mode-warnings',
          strictRootComponentStack,
          sortedNames,
        );
      },
    );
  };
}

export default ReactStrictModeWarnings;
