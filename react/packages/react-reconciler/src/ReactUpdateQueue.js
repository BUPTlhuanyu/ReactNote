/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// UpdateQueue is a linked list of prioritized updates.
//
// Like fibers, update queues come in pairs: a current queue, which represents
// the visible state of the screen, and a work-in-progress queue, which is
// can be mutated and processed asynchronously before it is committed — a form
// of double buffering. If a work-in-progress render is discarded before
// finishing, we create a new work-in-progress by cloning the current queue.
//
// Both queues share a persistent, singly-linked list structure. To schedule an
// update, we append it to the end of both queues. Each queue maintains a
// pointer to first update in the persistent list that hasn't been processed.
// The work-in-progress pointer always has a position equal to or greater than
// the current queue, since we always work on that one. The current queue's
// pointer is only updated during the commit phase, when we swap in the
// work-in-progress.
//
// For example:
//
//   Current pointer:           A - B - C - D - E - F
//   Work-in-progress pointer:              D - E - F
//                                          ^
//                                          The work-in-progress queue has
//                                          processed more updates than current.
//
// The reason we append to both queues is because otherwise we might drop
// updates without ever processing them. For example, if we only add updates to
// the work-in-progress queue, some updates could be lost whenever a work-in
// -progress render restarts by cloning from current. Similarly, if we only add
// updates to the current queue, the updates will be lost whenever an already
// in-progress queue commits and swaps with the current queue. However, by
// adding to both queues, we guarantee that the update will be part of the next
// work-in-progress. (And because the work-in-progress queue becomes the
// current queue once it commits, there's no danger of applying the same
// update twice.)
//
// Prioritization
// --------------
//
// Updates are not sorted by priority, but by insertion; new updates are always
// appended to the end of the list.
//
// The priority is still important, though. When processing the update queue
// during the render phase, only the updates with sufficient priority are
// included in the result. If we skip an update because it has insufficient
// priority, it remains in the queue to be processed later, during a lower
// priority render. Crucially, all updates subsequent to a skipped update also
// remain in the queue *regardless of their priority*. That means high priority
// updates are sometimes processed twice, at two separate priorities. We also
// keep track of a base state, that represents the state before the first
// update in the queue is applied.
//
// For example:
//
//   Given a base state of '', and the following queue of updates
//
//     A1 - B2 - C1 - D2
//
//   where the number indicates the priority, and the update is applied to the
//   previous state by appending a letter, React will process these updates as
//   two separate renders, one per distinct priority level:
//
//   First render, at priority 1:
//     Base state: ''
//     Updates: [A1, C1]
//     Result state: 'AC'
//
//   Second render, at priority 2:
//     Base state: 'A'            <-  The base state does not include C1,
//                                    because B2 was skipped.
//     Updates: [B2, C1, D2]      <-  C1 was rebased on top of B2
//     Result state: 'ABCD'
//
// Because we process updates in insertion order, and rebase high priority
// updates when preceding updates are skipped, the final result is deterministic
// regardless of priority. Intermediate state may vary according to system
// resources, but the final state is always the same.

import type {Fiber} from './ReactFiber';
import type {ExpirationTime} from './ReactFiberExpirationTime';

import {NoWork} from './ReactFiberExpirationTime';
import {Callback, ShouldCapture, DidCapture} from 'shared/ReactSideEffectTags';
import {ClassComponent} from 'shared/ReactWorkTags';

import {
  debugRenderPhaseSideEffects,
  debugRenderPhaseSideEffectsForStrictMode,
} from 'shared/ReactFeatureFlags';

import {StrictMode} from './ReactTypeOfMode';

import invariant from 'shared/invariant';
import warningWithoutStack from 'shared/warningWithoutStack';

export type Update<State> = {
  expirationTime: ExpirationTime,

  tag: 0 | 1 | 2 | 3,
  payload: any,
  callback: (() => mixed) | null,

  next: Update<State> | null,
  nextEffect: Update<State> | null,
};

export type UpdateQueue<State> = {
  baseState: State,

  firstUpdate: Update<State> | null,
  lastUpdate: Update<State> | null,

  firstCapturedUpdate: Update<State> | null,
  lastCapturedUpdate: Update<State> | null,

  firstEffect: Update<State> | null,
  lastEffect: Update<State> | null,

  firstCapturedEffect: Update<State> | null,
  lastCapturedEffect: Update<State> | null,
};

export const UpdateState = 0;
export const ReplaceState = 1;
export const ForceUpdate = 2;
export const CaptureUpdate = 3;

// Global state that is reset at the beginning of calling `processUpdateQueue`.
// It should only be read right after calling `processUpdateQueue`, via
// `checkHasForceUpdateAfterProcessing`.
let hasForceUpdate = false;

let didWarnUpdateInsideUpdate;
let currentlyProcessingQueue;
export let resetCurrentlyProcessingQueue;
if (__DEV__) {
  didWarnUpdateInsideUpdate = false;
  currentlyProcessingQueue = null;
  resetCurrentlyProcessingQueue = () => {
    currentlyProcessingQueue = null;
  };
}

export function createUpdateQueue<State>(baseState: State): UpdateQueue<State> {
  const queue: UpdateQueue<State> = {
    baseState, // 之前的state
    firstUpdate: null, // 指向第一个更新器
    lastUpdate: null, // 指向最后一个更新器
    firstCapturedUpdate: null, // 发生错误的时候捕获的第一个更新器
    lastCapturedUpdate: null, // 发生错误的时候捕获的最后一个更新器
    firstEffect: null,// 指向第一个副作用
    lastEffect: null,//指向最后一个副作用
    firstCapturedEffect: null,// 发生错误的时候捕获的第一个副作用
    lastCapturedEffect: null,// 发生错误的时候捕获的最后一个副作用
  };
  return queue;
}

/**
 * 将更新队列的effect清除
 * @param {*} currentQueue 
 */
function cloneUpdateQueue<State>(
  currentQueue: UpdateQueue<State>,
): UpdateQueue<State> {
  const queue: UpdateQueue<State> = {
    baseState: currentQueue.baseState, // 当前的state
    firstUpdate: currentQueue.firstUpdate, //第一个更新任务对象
    lastUpdate: currentQueue.lastUpdate, //最后一个更新任务对象

    // TODO：重用或者跳过子组件树，则需要保持这些effects
    // 目前：设置为null
    // TODO: With resuming, if we bail out and resuse the child tree, we should
    // keep these effects.
    firstCapturedUpdate: null,
    lastCapturedUpdate: null,

    firstEffect: null,
    lastEffect: null,

    firstCapturedEffect: null,
    lastCapturedEffect: null,
  };
  return queue;
}

//传入一个到期时间，返回一个对象
export function createUpdate(expirationTime: ExpirationTime): Update<*> {
  return {
    expirationTime: expirationTime,//到期时间

    tag: UpdateState,//对于state的处理类型为更新state
    payload: null,//setState中新的state对象或者初始化时候的container下第一个节点fiber
    callback: null, // 更新之后的回调函数

    next: null, // 指向下一个update
    nextEffect: null, // 下一个副作用
  };
}

function appendUpdateToQueue<State>(
  queue: UpdateQueue<State>,
  update: Update<State>,
) {
  // Append the update to the end of the list.
  if (queue.lastUpdate === null) {
    // Queue is empty
    queue.firstUpdate = queue.lastUpdate = update;
  } else {
    queue.lastUpdate.next = update;
    queue.lastUpdate = update;
  }
}

/**
 * fiber: 发生更新的fiber对象
 * update： 当前fiber对应的更新器
 */
export function enqueueUpdate<State>(fiber: Fiber, update: Update<State>) {
  // Update queues are created lazily.
  // 使用alternate属性双向连接一个当前fiber和其work-in-progress，当前fiber实例的alternate属性指向其work-in-progress，work-in-progress的alternate属性指向当前稳定fiber。
  const alternate = fiber.alternate;
  let queue1;
  let queue2;
  if (alternate === null) {
    // 初次渲染的时候alternate === null
    // There's only one fiber.
    queue1 = fiber.updateQueue;
    queue2 = null;
    if (queue1 === null) {
      // 当前fiber上没有更新队列，则创建更新队列
      //如果当前组件没有等待setState的队列则创建一个，
        // 利用fiber当前已经记录并需要整合的state存储到queue1与fiber.updateQueue
      queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
    }
  } else {
    // There are two owners.
    // 如果fiber树以及workinprogress树都存在，下面的逻辑则会同步两个树的update队列
    queue1 = fiber.updateQueue;
    queue2 = alternate.updateQueue;
    // 当两个树的队列至少有一个不存在的时候执行队列创建或者复制操作
    if (queue1 === null) {
      if (queue2 === null) {
        // Neither fiber has an update queue. Create new ones.
        //  两个队列都没有则根据各自的memoizedState创建update队列
        queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
        queue2 = alternate.updateQueue = createUpdateQueue(
          alternate.memoizedState,
        );
      } else {
        // 如果有一个没有则复制另一个队列给它
        // Only one fiber has an update queue. Clone to create a new one.
        queue1 = fiber.updateQueue = cloneUpdateQueue(queue2);
      }
    } else {
      if (queue2 === null) {
        // 如果有一个没有则复制另一个队列给它
        // Only one fiber has an update queue. Clone to create a new one.
        queue2 = alternate.updateQueue = cloneUpdateQueue(queue1);
      } else {
        // Both owners have an update queue.
      }
    }
  }

  if (queue2 === null || queue1 === queue2) {
    // There's only a single queue.
    // 如果只有一个树，或者两棵树队列是同一个，则将传入的更新对象添加到第一个队列中
    appendUpdateToQueue(queue1, update);
  } else {
    // There are two queues. We need to append the update to both queues,
    // while accounting for the persistent structure of the list — we don't
    // want the same update to be added multiple times.
    //  如果两个队列存在，则将更新任务加入两个队列中，并避免被添加多次
    if (queue1.lastUpdate === null || queue2.lastUpdate === null) {
      // One of the queues is not empty. We must add the update to both queues.
      //  有一个队列不为空，将update添加到两个队列
      appendUpdateToQueue(queue1, update);
      appendUpdateToQueue(queue2, update);
    } else {
      // Both queues are non-empty. The last update is the same in both lists,
      // because of structural sharing. So, only append to one of the lists.
      appendUpdateToQueue(queue1, update);
      // But we still need to update the `lastUpdate` pointer of queue2.
      queue2.lastUpdate = update;
    }
  }

  if (__DEV__) {
    if (
      fiber.tag === ClassComponent &&
      (currentlyProcessingQueue === queue1 ||
        (queue2 !== null && currentlyProcessingQueue === queue2)) &&
      !didWarnUpdateInsideUpdate
    ) {
      warningWithoutStack(
        false,
        'An update (setState, replaceState, or forceUpdate) was scheduled ' +
          'from inside an update function. Update functions should be pure, ' +
          'with zero side-effects. Consider using componentDidUpdate or a ' +
          'callback.',
      );
      didWarnUpdateInsideUpdate = true;
    }
  }
}

export function enqueueCapturedUpdate<State>(
  workInProgress: Fiber,
  update: Update<State>,
) {
  // Captured updates go into a separate list, and only on the work-in-
  // progress queue.
  let workInProgressQueue = workInProgress.updateQueue;
  if (workInProgressQueue === null) {
    workInProgressQueue = workInProgress.updateQueue = createUpdateQueue(
      workInProgress.memoizedState,
    );
  } else {
    // TODO: I put this here rather than createWorkInProgress so that we don't
    // clone the queue unnecessarily. There's probably a better way to
    // structure this.
    workInProgressQueue = ensureWorkInProgressQueueIsAClone(
      workInProgress,
      workInProgressQueue,
    );
  }

  // Append the update to the end of the list.
  if (workInProgressQueue.lastCapturedUpdate === null) {
    // This is the first render phase update
    workInProgressQueue.firstCapturedUpdate = workInProgressQueue.lastCapturedUpdate = update;
  } else {
    workInProgressQueue.lastCapturedUpdate.next = update;
    workInProgressQueue.lastCapturedUpdate = update;
  }
}

/**
 * 确保workInProgress.updateQueue与current.updateQueue是同一个对象，并且这个对象的effect相关的属性被重置为null
 * @param {*} workInProgress 
 * @param {*} queue 
 */
function ensureWorkInProgressQueueIsAClone<State>(
  workInProgress: Fiber,
  queue: UpdateQueue<State>,
): UpdateQueue<State> {
  // current在updatHost的时候不为null
  const current = workInProgress.alternate;
  if (current !== null) {
    // If the work-in-progress queue is equal to the current queue,
    // we need to clone it first.
    // 如果workInProgress.updateQueue更新队列与current.updateQueue更新队列是同一个，则将workInProgress.updateQueue克隆，并分别设置到workInProgress与current上，保证这两者指向同一个
    if (queue === current.updateQueue) {
      queue = workInProgress.updateQueue = cloneUpdateQueue(queue);
    }
  }
  // 不操作，直接返回传入的更新队列
  return queue;
}

function getStateFromUpdate<State>(
  workInProgress: Fiber,
  queue: UpdateQueue<State>,
  update: Update<State>,
  prevState: State,
  nextProps: any,
  instance: any,
): any {
  switch (update.tag) {
    case ReplaceState: {
      const payload = update.payload;
      if (typeof payload === 'function') {
        // Updater function
        if (__DEV__) {
          if (
            debugRenderPhaseSideEffects ||
            (debugRenderPhaseSideEffectsForStrictMode &&
              workInProgress.mode & StrictMode)
          ) {
            payload.call(instance, prevState, nextProps);
          }
        }
        return payload.call(instance, prevState, nextProps);
      }
      // State object
      return payload;
    }
    case CaptureUpdate: {
      workInProgress.effectTag =
        (workInProgress.effectTag & ~ShouldCapture) | DidCapture;
    }
    // Intentional fallthrough
    case UpdateState: {
      const payload = update.payload;
      let partialState;
      //两种不同的setState方式：第一个参数是一个对象或者一个函数
      if (typeof payload === 'function') {
        // Updater function
        if (__DEV__) {
          if (
            debugRenderPhaseSideEffects ||
            (debugRenderPhaseSideEffectsForStrictMode &&
              workInProgress.mode & StrictMode)
          ) {
            payload.call(instance, prevState, nextProps);
          }
        }
        partialState = payload.call(instance, prevState, nextProps);
      } else {
        // Partial state object
        partialState = payload;
      }
      if (partialState === null || partialState === undefined) {
        // Null and undefined are treated as no-ops.
        // 如果合并后的state为null或者undefined则返回之前的state
        return prevState;
      }
      // Merge the partial state and the previous state.
      // 合并state，并返回，Object.assign这里是第一层深拷贝，如果state比较复杂，就会存在深层属性浅拷贝的现象
      return Object.assign({}, prevState, partialState);
    }
    case ForceUpdate: {
      hasForceUpdate = true;
      return prevState;
    }
  }
  return prevState;
}

/**
 * 处理传入fiber的更新队列
 * @param {*} workInProgress 
 * @param {*} queue  workInProgress.updateQueue
 * @param {*} props 
 * @param {*} instance 
 * @param {*} renderExpirationTime 
 */
export function processUpdateQueue<State>(
  workInProgress: Fiber,
  queue: UpdateQueue<State>,
  props: any,
  instance: any,
  renderExpirationTime: ExpirationTime,
): void {
  // 1 强制更新的标志
  hasForceUpdate = false;

  // 2 确保workInProgress.updateQueue与current.updateQueue是同一个对象，并且这个对象的effect相关的属性被重置为null
  queue = ensureWorkInProgressQueueIsAClone(workInProgress, queue);

  if (__DEV__) {
    currentlyProcessingQueue = queue;
  }

  // These values may change as we process the queue.
  let newBaseState = queue.baseState; // 执行更新队列中的更新任务之前的state
  let newFirstUpdate = null; // 用于暂存当前的更新任务
  let newExpirationTime = NoWork; // 保存一个被跳过的更新任务中优先级最高任务的到期时间，这个到期时间也是被跳过的任务中最大的。

  // Iterate through the list of updates to compute the result.
  // 3 循环遍历更新队列，然后计算出这些更新的结果
  let update = queue.firstUpdate; // 第一个更新任务
  let resultState = newBaseState; // 执行完更新队列中的更新任务之后的state
  while (update !== null) {
    const updateExpirationTime = update.expirationTime; // 遍历到当前的更新任务的到期时间
    if (updateExpirationTime < renderExpirationTime) { 
      // 如果当前更新任务没有过期，则跳过这个循环，但是需要将这个被跳过的更新处置妥当
      // This update does not have sufficient priority. Skip it.
      if (newFirstUpdate === null) {
        // 如果这是第一个被跳过的更新任务，则将其存储在❗newFirstUpdate，将resultState存储在❗newBaseState
        // This is the first skipped update. It will be the first update in
        // the new list.
        newFirstUpdate = update;
        // Since this is the first update that was skipped, the current result
        // is the new base state.
        newBaseState = resultState;
      }
      // Since this update will remain in the list, update the remaining
      // expiration time.
      // 如果之前所有的被跳过的更新任务的最高优先级低于当前被跳过的更新任务的优先级，则将这个优先级对应的到期时间保存在newExpirationTime中，当然这个到期时间也是他们中最大的
      if (newExpirationTime < updateExpirationTime) {
        newExpirationTime = updateExpirationTime;
      }
    } else {
      // 开始根据这个任务计算state
      // This update does have sufficient priority. Process it and compute
      // a new result.
      resultState = getStateFromUpdate(
        workInProgress,
        queue,
        update,
        resultState,
        props,
        instance,
      );
      // 获取当前更新任务的回调
      const callback = update.callback;
      // ❗处理effect？？？
      // 如果更新任务还要回调函数，则将这个更新任务设置到更新队列的effect队列上，queue.firstEffect指向第一个副作用，lastEffect指向最后一个副作用，lastEffect.nextEffect指向
      // 如果更新队列的effect队列为空，则queue.firstEffect = queue.lastEffect = update;
      // 如果不为空，则添加到队列末尾，先将queue.lastEffect指向的对象的nextEffect指向当前的这个更新任务，然后将queue.lastEffect指向当前的这个更新任务
      if (callback !== null) {
        // effectTag的作用？
        workInProgress.effectTag |= Callback;
        // Set this to null, in case it was mutated during an aborted render.
        // 清除effect
        update.nextEffect = null;
        if (queue.lastEffect === null) {
          queue.firstEffect = queue.lastEffect = update;
        } else {
          queue.lastEffect.nextEffect = update;
          queue.lastEffect = update;
        }
      }
    }
    // 获取下一个更新任务
    // Continue to the next update.
    update = update.next;
  }

  // Separately, iterate though the list of captured updates.
  // ❗什么是捕获类型的更新任务？？？
  let newFirstCapturedUpdate = null;
  update = queue.firstCapturedUpdate;
  while (update !== null) {
    const updateExpirationTime = update.expirationTime;
    if (updateExpirationTime < renderExpirationTime) {
      // This update does not have sufficient priority. Skip it.
      if (newFirstCapturedUpdate === null) {
        // This is the first skipped captured update. It will be the first
        // update in the new list.
        newFirstCapturedUpdate = update;
        // If this is the first update that was skipped, the current result is
        // the new base state.
        if (newFirstUpdate === null) {
          newBaseState = resultState;
        }
      }
      // Since this update will remain in the list, update the remaining
      // expiration time.
      if (newExpirationTime < updateExpirationTime) {
        newExpirationTime = updateExpirationTime;
      }
    } else {
      // This update does have sufficient priority. Process it and compute
      // a new result.
      resultState = getStateFromUpdate(
        workInProgress,
        queue,
        update,
        resultState,
        props,
        instance,
      );
      const callback = update.callback;
      if (callback !== null) {
        workInProgress.effectTag |= Callback;
        // Set this to null, in case it was mutated during an aborted render.
        update.nextEffect = null;
        if (queue.lastCapturedEffect === null) {
          queue.firstCapturedEffect = queue.lastCapturedEffect = update;
        } else {
          queue.lastCapturedEffect.nextEffect = update;
          queue.lastCapturedEffect = update;
        }
      }
    }
    update = update.next;
  }

  if (newFirstUpdate === null) {
    queue.lastUpdate = null;
  }
  if (newFirstCapturedUpdate === null) {
    queue.lastCapturedUpdate = null;
  } else {
    workInProgress.effectTag |= Callback;
  }
  if (newFirstUpdate === null && newFirstCapturedUpdate === null) {
    // We processed every update, without skipping. That means the new base
    // state is the same as the result state.
    newBaseState = resultState;
  }

  queue.baseState = newBaseState;
  queue.firstUpdate = newFirstUpdate;
  queue.firstCapturedUpdate = newFirstCapturedUpdate;

  // Set the remaining expiration time to be whatever is remaining in the queue.
  // This should be fine because the only two other things that contribute to
  // expiration time are props and context. We're already in the middle of the
  // begin phase by the time we start processing the queue, so we've already
  // dealt with the props. Context in components that specify
  // shouldComponentUpdate is tricky; but we'll have to account for
  // that regardless.
  workInProgress.expirationTime = newExpirationTime;
  workInProgress.memoizedState = resultState;

  if (__DEV__) {
    currentlyProcessingQueue = null;
  }
}

function callCallback(callback, context) {
  invariant(
    typeof callback === 'function',
    'Invalid argument passed as callback. Expected a function. Instead ' +
      'received: %s',
    callback,
  );
  callback.call(context);
}

export function resetHasForceUpdateBeforeProcessing() {
  hasForceUpdate = false;
}

export function checkHasForceUpdateAfterProcessing(): boolean {
  return hasForceUpdate;
}

export function commitUpdateQueue<State>(
  finishedWork: Fiber,
  finishedQueue: UpdateQueue<State>,
  instance: any,
  renderExpirationTime: ExpirationTime,
): void {
  // If the finished render included captured updates, and there are still
  // lower priority updates left over, we need to keep the captured updates
  // in the queue so that they are rebased and not dropped once we process the
  // queue again at the lower priority.
  if (finishedQueue.firstCapturedUpdate !== null) {
    // Join the captured update list to the end of the normal list.
    if (finishedQueue.lastUpdate !== null) {
      finishedQueue.lastUpdate.next = finishedQueue.firstCapturedUpdate;
      finishedQueue.lastUpdate = finishedQueue.lastCapturedUpdate;
    }
    // Clear the list of captured updates.
    finishedQueue.firstCapturedUpdate = finishedQueue.lastCapturedUpdate = null;
  }

  // Commit the effects
  commitUpdateEffects(finishedQueue.firstEffect, instance);
  finishedQueue.firstEffect = finishedQueue.lastEffect = null;

  commitUpdateEffects(finishedQueue.firstCapturedEffect, instance);
  finishedQueue.firstCapturedEffect = finishedQueue.lastCapturedEffect = null;
}

function commitUpdateEffects<State>(
  effect: Update<State> | null,
  instance: any,
): void {
  while (effect !== null) {
    const callback = effect.callback;
    if (callback !== null) {
      effect.callback = null;
      callCallback(callback, instance);
    }
    effect = effect.nextEffect;
  }
}
