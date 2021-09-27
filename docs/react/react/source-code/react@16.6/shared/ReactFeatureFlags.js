/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

export const enableUserTimingAPI = __DEV__;

export const enableHooks = false;
// Helps identify side effects in begin-phase lifecycle hooks and setState reducers:
export const debugRenderPhaseSideEffects = false;

// In some cases, StrictMode should also double-render lifecycles.
// This can be confusing for tests though,
// And it can be bad for performance in production.
// This feature flag can be used to control the behavior:
export const debugRenderPhaseSideEffectsForStrictMode = __DEV__;

// To preserve the "Pause on caught exceptions" behavior of the debugger, we
// replay the begin phase of a failed component inside invokeGuardedCallback.
export const replayFailedUnitOfWorkWithInvokeGuardedCallback = __DEV__;

// Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:
export const warnAboutDeprecatedLifecycles = false;

// Gather advanced timing metrics for Profiler subtrees.
export const enableProfilerTimer = __PROFILE__;

// Trace which interactions trigger each commit.
// 在react-master\scripts\rollup\build.js中找到如下代码，表示构建过程中全局__PROFILE__的取值
// isProfiling表明处于profile状态，isProduction表示在生产环境
// __PROFILE__: isProfiling || !isProduction ? 'true' : 'false'
// __PROFILE__为true
export const enableSchedulerTracing = __PROFILE__;

// Only used in www builds.
export const enableSuspenseServerRenderer = false;

// Only used in www builds.
export function addUserTimingListener() {
  throw new Error('Not implemented.');
}

// React Fire: prevent the value and checked attributes from syncing
// with their related DOM properties
export const disableInputAttributeSyncing = false;

// These APIs will no longer be "unstable" in the upcoming 16.7 release,
// Control this behavior with a flag to support 16.6 minor releases in the meanwhile.
export const enableStableConcurrentModeAPIs = false;
