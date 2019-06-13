/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111
// MAX_SIGNED_31_BIT_INT = 1073741823;
import MAX_SIGNED_31_BIT_INT from './maxSigned31BitInt';

export type ExpirationTime = number;

export const NoWork = 0;// 该节点没有任务等待处理，优先级最低
export const Never = 1;//
export const Sync = MAX_SIGNED_31_BIT_INT;//同步模式，优先级最高，根据后面的计算可知其到期时间会很小

const UNIT_SIZE = 10;// 过期时间单元（ms）
const MAGIC_NUMBER_OFFSET = MAX_SIGNED_31_BIT_INT - 1;// 到期时间偏移量


// 1 unit of expiration time represents 10ms.
//将传入真实的时间换算成定义单位的到期时间
//一单位到期时间等于10ms
export function msToExpirationTime(ms: number): ExpirationTime {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  return MAGIC_NUMBER_OFFSET - ((ms / UNIT_SIZE) | 0);
}
//将到期时间换算成ms
export function expirationTimeToMs(expirationTime: ExpirationTime): number {
  return (MAGIC_NUMBER_OFFSET - expirationTime) * UNIT_SIZE;
}
//向上取整，间隔在precision内的两个num最终得到的相同的值
function ceiling(num: number, precision: number): number {
  return (((num / precision) | 0) + 1) * precision;
}
//根据到期时间与单位为ms的时间之间的转换关系，定制ceiling来得到到期时间
function computeExpirationBucket(
  currentTime,
  expirationInMs,
  bucketSizeMs,
): ExpirationTime {
  return (
    MAGIC_NUMBER_OFFSET -
    ceiling(
      MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE,
      bucketSizeMs / UNIT_SIZE,
    )
  );
}

//异步任务的到期时间
export const LOW_PRIORITY_EXPIRATION = 5000;
export const LOW_PRIORITY_BATCH_SIZE = 250;
//计算异步到期时间
export function computeAsyncExpiration(
  currentTime: ExpirationTime,
): ExpirationTime {
  return computeExpirationBucket(
    currentTime,
    LOW_PRIORITY_EXPIRATION,
    LOW_PRIORITY_BATCH_SIZE,
  );
}

//交互动作的到期时间
// We intentionally set a higher expiration time for interactive updates in
// dev than in production.
//
// If the main thread is being blocked so long that you hit the expiration,
// it's a problem that could be solved with better scheduling.
//
// People will be more likely to notice this and fix it with the long
// expiration time in development.
//
// In production we opt for better UX at the risk of masking scheduling
// problems, by expiring fast.
export const HIGH_PRIORITY_EXPIRATION = __DEV__ ? 500 : 150;
export const HIGH_PRIORITY_BATCH_SIZE = 100;

export function computeInteractiveExpiration(currentTime: ExpirationTime) {
  return computeExpirationBucket(
    currentTime,
    HIGH_PRIORITY_EXPIRATION,
    HIGH_PRIORITY_BATCH_SIZE,
  );
}
