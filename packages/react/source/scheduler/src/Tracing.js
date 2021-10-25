/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
// packages\shared\ReactFeatureFlags.js中enableSchedulerTracing = __PROFILE__
// 而在react-master\scripts\rollup\build.js中找到如下代码，表示构建过程中全局__PROFILE__的取值
// isProfiling表明处于profile状态，isProduction表示在生产环境
// __PROFILE__: isProfiling || !isProduction ? 'true' : 'false'
// __PROFILE__为true，因此这里认为enableSchedulerTracing = true
import {enableSchedulerTracing} from 'shared/ReactFeatureFlags';

export type Interaction = {|
  __count: number,
  id: number,
  name: string,
  timestamp: number,
|};

export type Subscriber = {
  // A new interaction has been created via the trace() method.
  onInteractionTraced: (interaction: Interaction) => void,

  // All scheduled async work for an interaction has finished.
  onInteractionScheduledWorkCompleted: (interaction: Interaction) => void,

  // New async work has been scheduled for a set of interactions.
  // When this work is later run, onWorkStarted/onWorkStopped will be called.
  // A batch of async/yieldy work may be scheduled multiple times before completing.
  // In that case, onWorkScheduled may be called more than once before onWorkStopped.
  // Work is scheduled by a "thread" which is identified by a unique ID.
  onWorkScheduled: (interactions: Set<Interaction>, threadID: number) => void,

  // A batch of scheduled work has been canceled.
  // Work is done by a "thread" which is identified by a unique ID.
  onWorkCanceled: (interactions: Set<Interaction>, threadID: number) => void,

  // A batch of work has started for a set of interactions.
  // When this work is complete, onWorkStopped will be called.
  // Work is not always completed synchronously; yielding may occur in between.
  // A batch of async/yieldy work may also be re-started before completing.
  // In that case, onWorkStarted may be called more than once before onWorkStopped.
  // Work is done by a "thread" which is identified by a unique ID.
  onWorkStarted: (interactions: Set<Interaction>, threadID: number) => void,

  // A batch of work has completed for a set of interactions.
  // Work is done by a "thread" which is identified by a unique ID.
  onWorkStopped: (interactions: Set<Interaction>, threadID: number) => void,
};

export type InteractionsRef = {
  current: Set<Interaction>,
};

export type SubscriberRef = {
  current: Subscriber | null,
};

const DEFAULT_THREAD_ID = 0;

// Counters used to generate unique IDs.
let interactionIDCounter: number = 0;
let threadIDCounter: number = 0;

// Set of currently traced interactions.
// Interactions "stack"–
// Meaning that newly traced interactions are appended to the previously active set.
// When an interaction goes out of scope, the previous set (if any) is restored.
let interactionsRef: InteractionsRef = (null: any);

// Listener(s) to notify when interactions begin and end.
let subscriberRef: SubscriberRef = (null: any);

if (enableSchedulerTracing) {
  interactionsRef = {
    current: new Set(),
  };
  subscriberRef = {
    current: null,
  };
}

export {interactionsRef as __interactionsRef, subscriberRef as __subscriberRef};

export function unstable_clear(callback: Function): any {
  if (!enableSchedulerTracing) {
    return callback();
  }

  const prevInteractions = interactionsRef.current;
  interactionsRef.current = new Set();

  try {
    return callback();
  } finally {
    interactionsRef.current = prevInteractions;
  }
}

export function unstable_getCurrent(): Set<Interaction> | null {
  if (!enableSchedulerTracing) {
    return null;
  } else {
    return interactionsRef.current;
  }
}

export function unstable_getThreadID(): number {
  return ++threadIDCounter;
}

export function unstable_trace(
  name: string,
  timestamp: number,
  callback: Function,
  threadID: number = DEFAULT_THREAD_ID,
): any {
  if (!enableSchedulerTracing) {
    return callback();
  }

  //根据传入的参数name、timestamp，以及当前交互事件数量interactionIDCounter构建一个interaction
  const interaction: Interaction = {
    __count: 1,
    id: interactionIDCounter++,
    name,
    timestamp,
  };

  //保存当前interactionsRef.current为prevInteractions
  const prevInteractions = interactionsRef.current;

  // Traced interactions should stack/accumulate.
  // To do that, clone the current interactions.
  // The previous set will be restored upon completion.
  // 被跟踪的interactions应该被处理，
  // 复制当前interactions到prevInteractions，完成之后再还原interactions
  // 利用prevInteractions构建一个interactions，然后把要跟踪的interaction添加进去
  const interactions = new Set(prevInteractions);
  interactions.add(interaction);
  // 之前的interactions被保存在中prevInteractions，然后在当前的interactions中插入一个interaction
  interactionsRef.current = interactions;

  // 获取当前的订阅者
  const subscriber = subscriberRef.current;
  let returnValue;

  //interaction为当前正在被追踪的活动
  //多个订阅者订阅了这个interaction，所以interaction.__count的数量就是订阅者的数量
  //执行订阅者上的onInteractionTraced(interaction)
  //执行subscriber.onWorkStarted(interactions, threadID)
  //执行returnValue = callback()
  //恢复interactionsRef.current = prevInteractions
  //执行subscriber.onWorkStopped(interactions, threadID);
  //interaction发生，订阅者执行相应的回调之后，interaction.__count的数量就减少一个，interaction.__count--;
  //当该活动的订阅者都执行了相应的回调，即interaction.__count === 0，就执行subscriber.onInteractionScheduledWorkCompleted(interaction);
  try {
    if (subscriber !== null) {
      //scheduler\src\TracingSubscriptions.js中subscribers订阅者集合所有的subscriber都会执行其subscriber.onInteractionTraced(interaction)
      subscriber.onInteractionTraced(interaction);
    }
  } finally {
    try {
      if (subscriber !== null) {
        subscriber.onWorkStarted(interactions, threadID);
      }
    } finally {
      try {
        returnValue = callback();
      } finally {
        interactionsRef.current = prevInteractions;

        try {
          if (subscriber !== null) {
            subscriber.onWorkStopped(interactions, threadID);
          }
        } finally {
          interaction.__count--;

          // If no async work was scheduled for this interaction,
          // Notify subscribers that it's completed.
          if (subscriber !== null && interaction.__count === 0) {
            subscriber.onInteractionScheduledWorkCompleted(interaction);
          }
        }
      }
    }
  }

  return returnValue;
}

export function unstable_wrap(
  callback: Function,
  threadID: number = DEFAULT_THREAD_ID,
): Function {
  if (!enableSchedulerTracing) {
    return callback;
  }

  const wrappedInteractions = interactionsRef.current;

  //subscribers订阅所有wrappedInteractions
  let subscriber = subscriberRef.current;
  if (subscriber !== null) {
    subscriber.onWorkScheduled(wrappedInteractions, threadID);
  }

  // Update the pending async work count for the current interactions.
  // Update after calling subscribers in case of error.
  // 每个interaction.__count加一
  wrappedInteractions.forEach(interaction => {
    interaction.__count++;
  });

  let hasRun = false;

  //用于执行subscriber上订阅的wrappedInteractions，
  //执行完callback并return returnValue之后每个interaction.__count减一
  function wrapped() {
    const prevInteractions = interactionsRef.current;
    interactionsRef.current = wrappedInteractions;

    subscriber = subscriberRef.current;

    try {
      let returnValue;

      try {
        if (subscriber !== null) {
          subscriber.onWorkStarted(wrappedInteractions, threadID);
        }
      } finally {
        try {
          returnValue = callback.apply(undefined, arguments);
        } finally {
          interactionsRef.current = prevInteractions;

          if (subscriber !== null) {
            subscriber.onWorkStopped(wrappedInteractions, threadID);
          }
        }
      }

      return returnValue;
    } finally {
      if (!hasRun) {
        // We only expect a wrapped function to be executed once,
        // But in the event that it's executed more than once–
        // Only decrement the outstanding interaction counts once.
        hasRun = true;

        // Update pending async counts for all wrapped interactions.
        // If this was the last scheduled async work for any of them,
        // Mark them as completed.
        wrappedInteractions.forEach(interaction => {
          interaction.__count--;

          if (subscriber !== null && interaction.__count === 0) {
            subscriber.onInteractionScheduledWorkCompleted(interaction);
          }
        });
      }
    }
  }

  //  用于取消subscriber上订阅的wrappedInteractions
  //  每个interaction.__count减一
  wrapped.cancel = function cancel() {
    subscriber = subscriberRef.current;

    try {
      if (subscriber !== null) {
        subscriber.onWorkCanceled(wrappedInteractions, threadID);
      }
    } finally {
      // Update pending async counts for all wrapped interactions.
      // If this was the last scheduled async work for any of them,
      // Mark them as completed.
      wrappedInteractions.forEach(interaction => {
        interaction.__count--;

        if (subscriber && interaction.__count === 0) {
          subscriber.onInteractionScheduledWorkCompleted(interaction);
        }
      });
    }
  };

  return wrapped;
}
