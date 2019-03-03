/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Interaction, Subscriber} from './Tracing';

import {enableSchedulerTracing} from 'shared/ReactFeatureFlags';
import {__subscriberRef} from './Tracing';

let subscribers: Set<Subscriber> = (null: any);
if (enableSchedulerTracing) {
  subscribers = new Set();
}

// 添加subscriber到subscribers，
// 如果subscribers集合只有刚添加的subscriber，则将__subscriberRef.current构建成一个对象，并添加一些方法
export function unstable_subscribe(subscriber: Subscriber): void {
  if (enableSchedulerTracing) {
    subscribers.add(subscriber);

    if (subscribers.size === 1) {
      __subscriberRef.current = {
        onInteractionScheduledWorkCompleted,
        onInteractionTraced,
        onWorkCanceled,
        onWorkScheduled,
        onWorkStarted,
        onWorkStopped,
      };
    }
  }
}

// 删除subscribers集合中指定的subscriber，如果集合为空，则__subscriberRef.current = null
export function unstable_unsubscribe(subscriber: Subscriber): void {
  if (enableSchedulerTracing) {
    subscribers.delete(subscriber);

    if (subscribers.size === 0) {
      __subscriberRef.current = null;
    }
  }
}

// 定义subscriber中的方法

// 当前订阅者__subscriberRef.current执行onInteractionTraced，
// 其他订阅者都会执行其onInteractionTraced
function onInteractionTraced(interaction: Interaction): void {
  let didCatchError = false;
  let caughtError = null;

  //为了不打断forEach，设置didCatchError与caughtError
  subscribers.forEach(subscriber => {
    try {
      subscriber.onInteractionTraced(interaction);
    } catch (error) {
      //记录第一个发生错误的信息
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

//当前订阅者__subscriberRef.current执行onInteractionScheduledWorkCompleted，
// 其他订阅者都会执行其onInteractionScheduledWorkCompleted
function onInteractionScheduledWorkCompleted(interaction: Interaction): void {
  let didCatchError = false;
  let caughtError = null;

  subscribers.forEach(subscriber => {
    try {
      subscriber.onInteractionScheduledWorkCompleted(interaction);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

// 当一个订阅者执行onWorkScheduled，其他订阅者都会执行其onWorkScheduled
function onWorkScheduled(
  interactions: Set<Interaction>,
  threadID: number,
): void {
  let didCatchError = false;
  let caughtError = null;

  subscribers.forEach(subscriber => {
    try {
      subscriber.onWorkScheduled(interactions, threadID);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

//当前订阅者__subscriberRef.current执行onWorkStarted，
// 其他订阅者都会执行其onWorkStarted
function onWorkStarted(interactions: Set<Interaction>, threadID: number): void {
  let didCatchError = false;
  let caughtError = null;

  subscribers.forEach(subscriber => {
    try {
      subscriber.onWorkStarted(interactions, threadID);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

//当前订阅者__subscriberRef.current执行onWorkStopped，
// 其他订阅者都会执行其onWorkStopped
function onWorkStopped(interactions: Set<Interaction>, threadID: number): void {
  let didCatchError = false;
  let caughtError = null;

  subscribers.forEach(subscriber => {
    try {
      subscriber.onWorkStopped(interactions, threadID);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

//当前订阅者__subscriberRef.current执行onWorkCanceled，
// 其他订阅者都会执行其onWorkCanceled
function onWorkCanceled(
  interactions: Set<Interaction>,
  threadID: number,
): void {
  let didCatchError = false;
  let caughtError = null;

  subscribers.forEach(subscriber => {
    try {
      subscriber.onWorkCanceled(interactions, threadID);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}
