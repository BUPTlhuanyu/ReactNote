/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {FiberRoot} from './ReactFiberRoot';
import type {ExpirationTime} from './ReactFiberExpirationTime';

import {NoWork} from './ReactFiberExpirationTime';

// TODO: Offscreen updates should never suspend. However, a promise that
// suspended inside an offscreen subtree should be able to ping at the priority
// of the outer render.

// 利用传入的expirationTime更新[earliestPendingTime,latestPendingTime]区间
// 这个区间是root树上的更新的到期时间的区间
export function markPendingPriorityLevel(
  root: FiberRoot,
  expirationTime: ExpirationTime,
): void {
  // If there's a gap between completing a failed root and retrying it,
  // additional updates may be scheduled. Clear `didError`, in case the update
  // is sufficient to fix the error.
  root.didError = false;

  // Update the latest and earliest pending times
  const earliestPendingTime = root.earliestPendingTime;
  if (earliestPendingTime === NoWork) {
    // No other pending updates.
    //  没有其挂起的更新，则将传入的到期时间赋值为root.earliestPendingTime以及root.latestPendingTime
    root.earliestPendingTime = root.latestPendingTime = expirationTime;
  } else {
    if (earliestPendingTime < expirationTime) {
      // This is the earliest pending update.
      root.earliestPendingTime = expirationTime;
    } else {
      const latestPendingTime = root.latestPendingTime;
      if (latestPendingTime > expirationTime) {
        // This is the latest pending update
        root.latestPendingTime = expirationTime;
      }
    }
  }
  findNextExpirationTimeToWorkOn(expirationTime, root);
}

export function markCommittedPriorityLevels(
  root: FiberRoot,
  earliestRemainingTime: ExpirationTime,
): void {
  root.didError = false;

  if (earliestRemainingTime === NoWork) {
    // Fast path. There's no remaining work. Clear everything.
    root.earliestPendingTime = NoWork;
    root.latestPendingTime = NoWork;
    root.earliestSuspendedTime = NoWork;
    root.latestSuspendedTime = NoWork;
    root.latestPingedTime = NoWork;
    findNextExpirationTimeToWorkOn(NoWork, root);
    return;
  }

  // Let's see if the previous latest known pending level was just flushed.
  const latestPendingTime = root.latestPendingTime;
  if (latestPendingTime !== NoWork) {
    if (latestPendingTime > earliestRemainingTime) {
      // We've flushed all the known pending levels.
      root.earliestPendingTime = root.latestPendingTime = NoWork;
    } else {
      const earliestPendingTime = root.earliestPendingTime;
      if (earliestPendingTime > earliestRemainingTime) {
        // We've flushed the earliest known pending level. Set this to the
        // latest pending time.
        root.earliestPendingTime = root.latestPendingTime;
      }
    }
  }

  // Now let's handle the earliest remaining level in the whole tree. We need to
  // decide whether to treat it as a pending level or as suspended. Check
  // it falls within the range of known suspended levels.

  const earliestSuspendedTime = root.earliestSuspendedTime;
  if (earliestSuspendedTime === NoWork) {
    // There's no suspended work. Treat the earliest remaining level as a
    // pending level.
    markPendingPriorityLevel(root, earliestRemainingTime);
    findNextExpirationTimeToWorkOn(NoWork, root);
    return;
  }

  const latestSuspendedTime = root.latestSuspendedTime;
  if (earliestRemainingTime < latestSuspendedTime) {
    // The earliest remaining level is later than all the suspended work. That
    // means we've flushed all the suspended work.
    root.earliestSuspendedTime = NoWork;
    root.latestSuspendedTime = NoWork;
    root.latestPingedTime = NoWork;

    // There's no suspended work. Treat the earliest remaining level as a
    // pending level.
    markPendingPriorityLevel(root, earliestRemainingTime);
    findNextExpirationTimeToWorkOn(NoWork, root);
    return;
  }

  if (earliestRemainingTime > earliestSuspendedTime) {
    // The earliest remaining time is earlier than all the suspended work.
    // Treat it as a pending update.
    markPendingPriorityLevel(root, earliestRemainingTime);
    findNextExpirationTimeToWorkOn(NoWork, root);
    return;
  }

  // The earliest remaining time falls within the range of known suspended
  // levels. We should treat this as suspended work.
  findNextExpirationTimeToWorkOn(NoWork, root);
}

export function hasLowerPriorityWork(
  root: FiberRoot,
  erroredExpirationTime: ExpirationTime,
): boolean {
  const latestPendingTime = root.latestPendingTime;
  const latestSuspendedTime = root.latestSuspendedTime;
  const latestPingedTime = root.latestPingedTime;
  return (
    (latestPendingTime !== NoWork &&
      latestPendingTime < erroredExpirationTime) ||
    (latestSuspendedTime !== NoWork &&
      latestSuspendedTime < erroredExpirationTime) ||
    (latestPingedTime !== NoWork && latestPingedTime < erroredExpirationTime)
  );
}

export function isPriorityLevelSuspended(
  root: FiberRoot,
  expirationTime: ExpirationTime,
): boolean {
  const earliestSuspendedTime = root.earliestSuspendedTime;
  const latestSuspendedTime = root.latestSuspendedTime;
  return (
    earliestSuspendedTime !== NoWork &&
    expirationTime <= earliestSuspendedTime &&
    expirationTime >= latestSuspendedTime
  );
}

export function markSuspendedPriorityLevel(
  root: FiberRoot,
  suspendedTime: ExpirationTime,
): void {
  root.didError = false;
  clearPing(root, suspendedTime);

  // First, check the known pending levels and update them if needed.
  const earliestPendingTime = root.earliestPendingTime;
  const latestPendingTime = root.latestPendingTime;
  if (earliestPendingTime === suspendedTime) {
    if (latestPendingTime === suspendedTime) {
      // Both known pending levels were suspended. Clear them.
      root.earliestPendingTime = root.latestPendingTime = NoWork;
    } else {
      // The earliest pending level was suspended. Clear by setting it to the
      // latest pending level.
      root.earliestPendingTime = latestPendingTime;
    }
  } else if (latestPendingTime === suspendedTime) {
    // The latest pending level was suspended. Clear by setting it to the
    // latest pending level.
    root.latestPendingTime = earliestPendingTime;
  }

  // Finally, update the known suspended levels.
  const earliestSuspendedTime = root.earliestSuspendedTime;
  const latestSuspendedTime = root.latestSuspendedTime;
  if (earliestSuspendedTime === NoWork) {
    // No other suspended levels.
    root.earliestSuspendedTime = root.latestSuspendedTime = suspendedTime;
  } else {
    if (earliestSuspendedTime < suspendedTime) {
      // This is the earliest suspended level.
      root.earliestSuspendedTime = suspendedTime;
    } else if (latestSuspendedTime > suspendedTime) {
      // This is the latest suspended level
      root.latestSuspendedTime = suspendedTime;
    }
  }

  findNextExpirationTimeToWorkOn(suspendedTime, root);
}

export function markPingedPriorityLevel(
  root: FiberRoot,
  pingedTime: ExpirationTime,
): void {
  root.didError = false;

  // TODO: When we add back resuming, we need to ensure the progressed work
  // is thrown out and not reused during the restarted render. One way to
  // invalidate the progressed work is to restart at expirationTime + 1.
  const latestPingedTime = root.latestPingedTime;
  if (latestPingedTime === NoWork || latestPingedTime > pingedTime) {
    root.latestPingedTime = pingedTime;
  }
  findNextExpirationTimeToWorkOn(pingedTime, root);
}

function clearPing(root, completedTime) {
  // TODO: Track whether the root was pinged during the render phase. If so,
  // we need to make sure we don't lose track of it.
  const latestPingedTime = root.latestPingedTime;
  if (latestPingedTime !== NoWork && latestPingedTime >= completedTime) {
    root.latestPingedTime = NoWork;
  }
}

export function findEarliestOutstandingPriorityLevel(
  root: FiberRoot,
  renderExpirationTime: ExpirationTime,
): ExpirationTime {
  let earliestExpirationTime = renderExpirationTime;

  const earliestPendingTime = root.earliestPendingTime;
  const earliestSuspendedTime = root.earliestSuspendedTime;
  if (earliestPendingTime > earliestExpirationTime) {
    earliestExpirationTime = earliestPendingTime;
  }
  if (earliestSuspendedTime > earliestExpirationTime) {
    earliestExpirationTime = earliestSuspendedTime;
  }
  return earliestExpirationTime;
}

export function didExpireAtExpirationTime(
  root: FiberRoot,
  currentTime: ExpirationTime,
): void {
  const expirationTime = root.expirationTime;
  if (expirationTime !== NoWork && currentTime <= expirationTime) {
    // The root has expired. Flush all work up to the current time.
    root.nextExpirationTimeToWorkOn = currentTime;
  }
}

// 查找下一个到期时间
// root.nextExpirationTimeToWorkOn：
// 决定哪些更新要在当前周期中被执行
// 通过跟每个节点的expirationTime比较决定该节点是否可以直接bailout（跳过）
function findNextExpirationTimeToWorkOn(completedExpirationTime, root) {
  const earliestSuspendedTime = root.earliestSuspendedTime;
  const latestSuspendedTime = root.latestSuspendedTime;
  const earliestPendingTime = root.earliestPendingTime;
  const latestPingedTime = root.latestPingedTime;

  // Work on the earliest pending time. Failing that, work on the latest
  // pinged time.
  //  root.earliestPendingTime & root.lastestPendingTime用来记录当前root的子树中需要进行渲染的更新的expirationTime的区间
  //  区间为[latestPendingTime，earliestPendingTime]，latestPendingTime值小于等于earliestPendingTime，
    // 因此earliestPendingTime会先于latestPendingTime过期，原因是react的时间是从1073741823开始随着时间的推移而减少的
    // 下面对nextExpirationTimeToWorkOn赋值的逻辑是：如果earliestPendingTime不等于0则返回earliestPendingTime，否则返回latestPingedTime
    // 将nextExpirationTimeToWorkOn设置为当前root对应fiber树中更新任务的最先过期的到期时间
    let nextExpirationTimeToWorkOn =
    earliestPendingTime !== NoWork ? earliestPendingTime : latestPingedTime;

  // If there is no pending or pinged work, check if there's suspended work
  // that's lower priority than what we just completed.
  //  如果最先过期的到期时间为0说明当前fiber树没有任务需要执行，
    // 并且如果存在被挂起的任务中最低优先级小于刚完成任务的优先级，说明所有挂起任务还不需要执行，
    // 因此将这个最低优先级任务到期时间赋值给nextExpirationTimeToWorkOn，也就是下一次渲染用到的到期时间
  if (
    nextExpirationTimeToWorkOn === NoWork &&
    (completedExpirationTime === NoWork ||
      latestSuspendedTime < completedExpirationTime)
  ) {
    // The lowest priority suspended work is the work most likely to be
    // committed next. Let's start rendering it again, so that if it times out,
    // it's ready to commit.
    nextExpirationTimeToWorkOn = latestSuspendedTime;
  }

  //下一次渲染存在任务并且优先级小于挂起的任务的最高优先级，则将当前渲染的到期时间设置为该优先级。
  let expirationTime = nextExpirationTimeToWorkOn;
  if (expirationTime !== NoWork && earliestSuspendedTime > expirationTime) {
    // Expire using the earliest known expiration time.
    expirationTime = earliestSuspendedTime;
  }

  root.nextExpirationTimeToWorkOn = nextExpirationTimeToWorkOn;
  root.expirationTime = expirationTime;
}
