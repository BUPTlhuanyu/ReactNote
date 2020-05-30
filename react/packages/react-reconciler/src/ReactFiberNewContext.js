/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {ReactContext} from 'shared/ReactTypes';
import type {Fiber} from './ReactFiber';
import type {StackCursor} from './ReactFiberStack';
import type {ExpirationTime} from './ReactFiberExpirationTime';

export type ContextDependency<T> = {
  context: ReactContext<T>,
  observedBits: number,
  next: ContextDependency<mixed> | null,
};

import warningWithoutStack from 'shared/warningWithoutStack';
import {isPrimaryRenderer} from './ReactFiberHostConfig';
import {createCursor, push, pop} from './ReactFiberStack';
import MAX_SIGNED_31_BIT_INT from './maxSigned31BitInt';
import {ContextProvider, ClassComponent} from 'shared/ReactWorkTags';

import invariant from 'shared/invariant';
import warning from 'shared/warning';
import {
  createUpdate,
  enqueueUpdate,
  ForceUpdate,
} from 'react-reconciler/src/ReactUpdateQueue';

const valueCursor: StackCursor<mixed> = createCursor(null);

let rendererSigil;
if (__DEV__) {
  // Use this to detect multiple renderers using the same context
  rendererSigil = {};
}

let currentlyRenderingFiber: Fiber | null = null;
let lastContextDependency: ContextDependency<mixed> | null = null;
let lastContextWithAllBitsObserved: ReactContext<any> | null = null;

export function resetContextDependences(): void {
  // This is called right before React yields execution, to ensure `readContext`
  // cannot be called outside the render phase.
  currentlyRenderingFiber = null;
  lastContextDependency = null;
  lastContextWithAllBitsObserved = null;
}

export function pushProvider<T>(providerFiber: Fiber, nextValue: T): void {
  const context: ReactContext<T> = providerFiber.type._context;

  if (isPrimaryRenderer) {
    push(valueCursor, context._currentValue, providerFiber);

    context._currentValue = nextValue;
    if (__DEV__) {
      warningWithoutStack(
        context._currentRenderer === undefined ||
          context._currentRenderer === null ||
          context._currentRenderer === rendererSigil,
        'Detected multiple renderers concurrently rendering the ' +
          'same context provider. This is currently unsupported.',
      );
      context._currentRenderer = rendererSigil;
    }
  } else {
    push(valueCursor, context._currentValue2, providerFiber);

    context._currentValue2 = nextValue;
    if (__DEV__) {
      warningWithoutStack(
        context._currentRenderer2 === undefined ||
          context._currentRenderer2 === null ||
          context._currentRenderer2 === rendererSigil,
        'Detected multiple renderers concurrently rendering the ' +
          'same context provider. This is currently unsupported.',
      );
      context._currentRenderer2 = rendererSigil;
    }
  }
}

export function popProvider(providerFiber: Fiber): void {
  const currentValue = valueCursor.current;

  pop(valueCursor, providerFiber);

  const context: ReactContext<any> = providerFiber.type._context;
  if (isPrimaryRenderer) {
    context._currentValue = currentValue;
  } else {
    context._currentValue2 = currentValue;
  }
}

export function calculateChangedBits<T>(
  context: ReactContext<T>,
  newValue: T,
  oldValue: T,
) {
  // Use Object.is to compare the new context value to the old value. Inlined
  // Object.is polyfill.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
  if (
    (oldValue === newValue &&
      (oldValue !== 0 || 1 / oldValue === 1 / (newValue: any))) ||
    (oldValue !== oldValue && newValue !== newValue) // eslint-disable-line no-self-compare
  ) {
    // No change
    return 0;
  } else {
    const changedBits =
      typeof context._calculateChangedBits === 'function'
        ? context._calculateChangedBits(oldValue, newValue)
        : MAX_SIGNED_31_BIT_INT;

    if (__DEV__) {
      warning(
        (changedBits & MAX_SIGNED_31_BIT_INT) === changedBits,
        'calculateChangedBits: Expected the return value to be a ' +
          '31-bit integer. Instead received: %s',
        changedBits,
      );
    }
    return changedBits | 0;
  }
}

export function propagateContextChange(
  workInProgress: Fiber,
  context: ReactContext<mixed>,
  changedBits: number,
  renderExpirationTime: ExpirationTime,
): void {
  let fiber = workInProgress.child;
  if (fiber !== null) {
    // Set the return pointer of the child to the work-in-progress fiber.
    fiber.return = workInProgress;
  }
  while (fiber !== null) {
    let nextFiber;

    // Visit this fiber.
    // 往下遍历，在遍历的过程中会判断 type
    let dependency = fiber.firstContextDependency;
    if (dependency !== null) {
      do {
        // Check if the context matches.
        // 如果provider的value 有变化，并且是当前的context
        if (
          dependency.context === context &&
          (dependency.observedBits & changedBits) !== 0
        ) {
          // Match! Schedule an update on this fiber.

          if (fiber.tag === ClassComponent) {
            // 创建一个 update， 到期时间为当前更新的时候到期时间
            // Schedule a force update on the work-in-progress.
            const update = createUpdate(renderExpirationTime);
            // 强制更新
            update.tag = ForceUpdate;
            // TODO: Because we don't have a work-in-progress, this will add the
            // update to the current fiber, too, which means it will persist even if
            // this render is thrown away. Since it's a race condition, not sure it's
            // worth fixing.
            // 将更新任务添加到 fiber 更新链表上
            enqueueUpdate(fiber, update);
          }
          // 更新到期时间
          if (fiber.expirationTime < renderExpirationTime) {
            fiber.expirationTime = renderExpirationTime;
          }
          let alternate = fiber.alternate;
          if (
            alternate !== null &&
            alternate.expirationTime < renderExpirationTime
          ) {
            alternate.expirationTime = renderExpirationTime;
          }
          // 更新到期时间
          // Update the child expiration time of all the ancestors, including
          // the alternates.
          let node = fiber.return;
          while (node !== null) {
            alternate = node.alternate;
            if (node.childExpirationTime < renderExpirationTime) {
              node.childExpirationTime = renderExpirationTime;
              if (
                alternate !== null &&
                alternate.childExpirationTime < renderExpirationTime
              ) {
                alternate.childExpirationTime = renderExpirationTime;
              }
            } else if (
              alternate !== null &&
              alternate.childExpirationTime < renderExpirationTime
            ) {
              alternate.childExpirationTime = renderExpirationTime;
            } else {
              // Neither alternate was updated, which means the rest of the
              // ancestor path already has sufficient priority.
              break;
            }
            node = node.return;
          }
        }
        nextFiber = fiber.child;
        dependency = dependency.next;
      } while (dependency !== null);
    } else if (fiber.tag === ContextProvider) {
      // 当遇到相同的context的provider，那么不会遍历其child，而是在下一个 if 中往右往上遍历。
      // 如果当前遍历到的 fiber 与 传入的 providerFiber 是同一个 context，比如 MyContext.Provider
      // 则将 nextFiber 设置为 null，否则继续遍历 fiber 的子节点。 
      // Don't scan deeper if this is a matching provider
      nextFiber = fiber.type === workInProgress.type ? null : fiber.child;
    } else {
      // 继续往下遍历
      // Traverse down.
      nextFiber = fiber.child;
    }

    // 往右往上遍历
    if (nextFiber !== null) {
      // 设置父节点？？？
      // Set the return pointer of the child to the work-in-progress fiber.
      nextFiber.return = fiber;
    } else {
//              A
//            /   \
//          B       C
//          |     /   \
//          D    E     F
//    B , D, C, F 都没有兄弟节
//    1. 比如上面的 fiber 是 F，由于 F 右边没有兄弟节点，所以 while 循环往上搜寻到 C，
//    C 右边也没有兄弟，继续往上到 A，此时 A 已经是 传入的 workinprogress 了， while 循环结束。
//    2. 如果上面的 fiber 是 E ，那么 while 结束，该函数需要处理的下一个节点就是 F。
      // No child. Traverse to next sibling.
      nextFiber = fiber;
      while (nextFiber !== null) {
        if (nextFiber === workInProgress) {
          // We're back to the root of this subtree. Exit.
          nextFiber = null;
          break;
        }
        // 遍历到兄弟节点
        let sibling = nextFiber.sibling;
        if (sibling !== null) {
          // 将当前的 fiber 节点的兄弟节点的父节点设置为当前的 fiber 节点的父节点，然后推出循环
          // Set the return pointer of the sibling to the work-in-progress fiber.
          sibling.return = nextFiber.return;
          nextFiber = sibling;
          break;
        }
        // No more siblings. Traverse up.
        // 往上遍历
        nextFiber = nextFiber.return;
      }
    }
    fiber = nextFiber;
  }
}

export function prepareToReadContext(
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): void {
  currentlyRenderingFiber = workInProgress;
  lastContextDependency = null;
  lastContextWithAllBitsObserved = null;

  // Reset the work-in-progress list
  workInProgress.firstContextDependency = null;
}

export function readContext<T>(
  context: ReactContext<T>,
  observedBits: void | number | boolean,
): T {
  if (lastContextWithAllBitsObserved === context) {
    // Nothing to do. We already observe everything in this context.
  } else if (observedBits === false || observedBits === 0) {
    // Do not observe any updates.
  } else {
    let resolvedObservedBits; // Avoid deopting on observable arguments or heterogeneous types.
    if (
      typeof observedBits !== 'number' ||
      observedBits === MAX_SIGNED_31_BIT_INT
    ) {
      // Observe all updates.
      lastContextWithAllBitsObserved = ((context: any): ReactContext<mixed>);
      resolvedObservedBits = MAX_SIGNED_31_BIT_INT;
    } else {
      resolvedObservedBits = observedBits;
    }

    let contextItem = {
      context: ((context: any): ReactContext<mixed>),
      observedBits: resolvedObservedBits,
      next: null,
    };

    if (lastContextDependency === null) {
      invariant(
        currentlyRenderingFiber !== null,
        'Context can only be read while React is ' +
          'rendering, e.g. inside the render method or getDerivedStateFromProps.',
      );
      // This is the first dependency in the list
      currentlyRenderingFiber.firstContextDependency = lastContextDependency = contextItem;
    } else {
      // Append a new context item.
      lastContextDependency = lastContextDependency.next = contextItem;
    }
  }
  return isPrimaryRenderer ? context._currentValue : context._currentValue2;
}
