/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Fiber} from './ReactFiber';
import type {Batch, FiberRoot} from './ReactFiberRoot';
import type {ExpirationTime} from './ReactFiberExpirationTime';
import type {Interaction} from 'scheduler/src/Tracing';

import {
  __interactionsRef,
  __subscriberRef,
  unstable_wrap as Schedule_tracing_wrap,
} from 'scheduler/tracing';
import {
  unstable_scheduleCallback as Schedule_scheduleCallback,
  unstable_cancelCallback as Schedule_cancelCallback,
} from 'scheduler';
import {
  invokeGuardedCallback,
  hasCaughtError,
  clearCaughtError,
} from 'shared/ReactErrorUtils';
import ReactSharedInternals from 'shared/ReactSharedInternals';
import ReactStrictModeWarnings from './ReactStrictModeWarnings';
import {
  NoEffect,
  PerformedWork,
  Placement,
  Update,
  Snapshot,
  PlacementAndUpdate,
  Deletion,
  ContentReset,
  Callback,
  DidCapture,
  Ref,
  Incomplete,
  HostEffectMask,
  Passive,
} from 'shared/ReactSideEffectTags';
import {
  ClassComponent,
  HostComponent,
  ContextProvider,
  ForwardRef,
  FunctionComponent,
  HostPortal,
  HostRoot,
  MemoComponent,
  SimpleMemoComponent,
} from 'shared/ReactWorkTags';
import {
  enableHooks,
  enableSchedulerTracing,
  enableProfilerTimer,
  enableUserTimingAPI,
  replayFailedUnitOfWorkWithInvokeGuardedCallback,
  warnAboutDeprecatedLifecycles,
} from 'shared/ReactFeatureFlags';
import getComponentName from 'shared/getComponentName';
import invariant from 'shared/invariant';
import warningWithoutStack from 'shared/warningWithoutStack';

import ReactFiberInstrumentation from './ReactFiberInstrumentation';
import * as ReactCurrentFiber from './ReactCurrentFiber';
import {
  now,
  scheduleDeferredCallback,
  cancelDeferredCallback,
  shouldYield,
  prepareForCommit,
  resetAfterCommit,
  scheduleTimeout,
  cancelTimeout,
  noTimeout,
} from './ReactFiberHostConfig';
import {
  markPendingPriorityLevel,
  markCommittedPriorityLevels,
  markSuspendedPriorityLevel,
  markPingedPriorityLevel,
  hasLowerPriorityWork,
  isPriorityLevelSuspended,
  findEarliestOutstandingPriorityLevel,
  didExpireAtExpirationTime,
} from './ReactFiberPendingPriority';
import {
  recordEffect,
  recordScheduleUpdate,
  startRequestCallbackTimer,
  stopRequestCallbackTimer,
  startWorkTimer,
  stopWorkTimer,
  stopFailedWorkTimer,
  startWorkLoopTimer,
  stopWorkLoopTimer,
  startCommitTimer,
  stopCommitTimer,
  startCommitSnapshotEffectsTimer,
  stopCommitSnapshotEffectsTimer,
  startCommitHostEffectsTimer,
  stopCommitHostEffectsTimer,
  startCommitLifeCyclesTimer,
  stopCommitLifeCyclesTimer,
} from './ReactDebugFiberPerf';
import {createWorkInProgress, assignFiberPropertiesInDEV} from './ReactFiber';
import {onCommitRoot} from './ReactFiberDevToolsHook';
import {
  NoWork,
  Sync,
  Never,
  msToExpirationTime,
  expirationTimeToMs,
  computeAsyncExpiration,
  computeInteractiveExpiration,
} from './ReactFiberExpirationTime';
import {ConcurrentMode, ProfileMode, NoContext} from './ReactTypeOfMode';
import {
  enqueueUpdate,
  resetCurrentlyProcessingQueue,
  ForceUpdate,
  createUpdate,
} from './ReactUpdateQueue';
import {createCapturedValue} from './ReactCapturedValue';
import {
  isContextProvider as isLegacyContextProvider,
  popTopLevelContextObject as popTopLevelLegacyContextObject,
  popContext as popLegacyContext,
} from './ReactFiberContext';
import {popProvider, resetContextDependences} from './ReactFiberNewContext';
import {resetHooks} from './ReactFiberHooks';
import {popHostContext, popHostContainer} from './ReactFiberHostContext';
import {
  recordCommitTime,
  startProfilerTimer,
  stopProfilerTimerIfRunningAndRecordDelta,
} from './ReactProfilerTimer';
import {
  checkThatStackIsEmpty,
  resetStackAfterFatalErrorInDev,
} from './ReactFiberStack';
import {beginWork} from './ReactFiberBeginWork';
import {completeWork} from './ReactFiberCompleteWork';
import {
  throwException,
  unwindWork,
  unwindInterruptedWork,
  createRootErrorUpdate,
  createClassErrorUpdate,
} from './ReactFiberUnwindWork';
import {
  commitBeforeMutationLifeCycles,
  commitResetTextContent,
  commitPlacement,
  commitDeletion,
  commitWork,
  commitLifeCycles,
  commitAttachRef,
  commitDetachRef,
  commitPassiveHookEffects,
} from './ReactFiberCommitWork';
import {Dispatcher, DispatcherWithoutHooks} from './ReactFiberDispatcher';

export type Thenable = {
  then(resolve: () => mixed, reject?: () => mixed): mixed,
};

const {ReactCurrentOwner} = ReactSharedInternals;

let didWarnAboutStateTransition;
let didWarnSetStateChildContext;
let warnAboutUpdateOnUnmounted;
let warnAboutInvalidUpdates;

if (enableSchedulerTracing) {
  // Provide explicit error message when production+profiling bundle of e.g. react-dom
  // is used with production (non-profiling) bundle of schedule/tracing
  invariant(
    __interactionsRef != null && __interactionsRef.current != null,
    'It is not supported to run the profiling version of a renderer (for example, `react-dom/profiling`) ' +
      'without also replacing the `schedule/tracing` module with `schedule/tracing-profiling`. ' +
      'Your bundler might have a setting for aliasing both modules. ' +
      'Learn more at http://fb.me/react-profiling',
  );
}

if (__DEV__) {
  didWarnAboutStateTransition = false;
  didWarnSetStateChildContext = false;
  const didWarnStateUpdateForUnmountedComponent = {};

  warnAboutUpdateOnUnmounted = function(fiber: Fiber, isClass: boolean) {
    // We show the whole stack but dedupe on the top component's name because
    // the problematic code almost always lies inside that component.
    const componentName = getComponentName(fiber.type) || 'ReactComponent';
    if (didWarnStateUpdateForUnmountedComponent[componentName]) {
      return;
    }
    warningWithoutStack(
      false,
      "Can't perform a React state update on an unmounted component. This " +
        'is a no-op, but it indicates a memory leak in your application. To ' +
        'fix, cancel all subscriptions and asynchronous tasks in %s.%s',
      isClass
        ? 'the componentWillUnmount method'
        : 'a useEffect cleanup function',
      ReactCurrentFiber.getStackByFiberInDevAndProd(fiber),
    );
    didWarnStateUpdateForUnmountedComponent[componentName] = true;
  };

  warnAboutInvalidUpdates = function(instance: React$Component<any>) {
    switch (ReactCurrentFiber.phase) {
      case 'getChildContext':
        if (didWarnSetStateChildContext) {
          return;
        }
        warningWithoutStack(
          false,
          'setState(...): Cannot call setState() inside getChildContext()',
        );
        didWarnSetStateChildContext = true;
        break;
      case 'render':
        if (didWarnAboutStateTransition) {
          return;
        }
        warningWithoutStack(
          false,
          'Cannot update during an existing state transition (such as within ' +
            '`render`). Render methods should be a pure function of props and state.',
        );
        didWarnAboutStateTransition = true;
        break;
    }
  };
}

// Used to ensure computeUniqueAsyncExpiration is monotonically decreasing.
let lastUniqueAsyncExpiration: number = Sync - 1;

// Represents the expiration time that incoming updates should use. (If this
// is NoWork, use the default strategy: async updates in async mode, sync
// updates in sync mode.)
let expirationContext: ExpirationTime = NoWork;

let isWorking: boolean = false;

// The next work in progress fiber that we're currently working on.
let nextUnitOfWork: Fiber | null = null;
let nextRoot: FiberRoot | null = null;
// The time at which we're currently rendering work.
let nextRenderExpirationTime: ExpirationTime = NoWork;
let nextLatestAbsoluteTimeoutMs: number = -1;
let nextRenderDidError: boolean = false;

// The next fiber with an effect that we're currently committing.
let nextEffect: Fiber | null = null;

let isCommitting: boolean = false;
let rootWithPendingPassiveEffects: FiberRoot | null = null;
let passiveEffectCallbackHandle: * = null;
let passiveEffectCallback: * = null;

let legacyErrorBoundariesThatAlreadyFailed: Set<mixed> | null = null;

// Used for performance tracking.
let interruptedBy: Fiber | null = null;

let stashedWorkInProgressProperties;
let replayUnitOfWork;
let mayReplayFailedUnitOfWork;
let isReplayingFailedUnitOfWork;
let originalReplayError;
let rethrowOriginalError;
if (__DEV__ && replayFailedUnitOfWorkWithInvokeGuardedCallback) {
  stashedWorkInProgressProperties = null;
  mayReplayFailedUnitOfWork = true;
  isReplayingFailedUnitOfWork = false;
  originalReplayError = null;
  replayUnitOfWork = (
    failedUnitOfWork: Fiber,
    thrownValue: mixed,
    isYieldy: boolean,
  ) => {
    if (
      thrownValue !== null &&
      typeof thrownValue === 'object' &&
      typeof thrownValue.then === 'function'
    ) {
      // Don't replay promises. Treat everything else like an error.
      // TODO: Need to figure out a different strategy if/when we add
      // support for catching other types.
      return;
    }

    // Restore the original state of the work-in-progress
    if (stashedWorkInProgressProperties === null) {
      // This should never happen. Don't throw because this code is DEV-only.
      warningWithoutStack(
        false,
        'Could not replay rendering after an error. This is likely a bug in React. ' +
          'Please file an issue.',
      );
      return;
    }
    assignFiberPropertiesInDEV(
      failedUnitOfWork,
      stashedWorkInProgressProperties,
    );

    switch (failedUnitOfWork.tag) {
      case HostRoot:
        popHostContainer(failedUnitOfWork);
        popTopLevelLegacyContextObject(failedUnitOfWork);
        break;
      case HostComponent:
        popHostContext(failedUnitOfWork);
        break;
      case ClassComponent: {
        const Component = failedUnitOfWork.type;
        if (isLegacyContextProvider(Component)) {
          popLegacyContext(failedUnitOfWork);
        }
        break;
      }
      case HostPortal:
        popHostContainer(failedUnitOfWork);
        break;
      case ContextProvider:
        popProvider(failedUnitOfWork);
        break;
    }
    // Replay the begin phase.
    isReplayingFailedUnitOfWork = true;
    originalReplayError = thrownValue;
    invokeGuardedCallback(null, workLoop, null, isYieldy);
    isReplayingFailedUnitOfWork = false;
    originalReplayError = null;
    if (hasCaughtError()) {
      const replayError = clearCaughtError();
      if (replayError != null && thrownValue != null) {
        try {
          // Reading the expando property is intentionally
          // inside `try` because it might be a getter or Proxy.
          if (replayError._suppressLogging) {
            // Also suppress logging for the original error.
            (thrownValue: any)._suppressLogging = true;
          }
        } catch (inner) {
          // Ignore.
        }
      }
    } else {
      // If the begin phase did not fail the second time, set this pointer
      // back to the original value.
      nextUnitOfWork = failedUnitOfWork;
    }
  };
  rethrowOriginalError = () => {
    throw originalReplayError;
  };
}

//用于记录render阶段Fiber树遍历过程中下一个需要执行的节点。
//指向workInProgress
function resetStack() {
  if (nextUnitOfWork !== null) {
    let interruptedWork = nextUnitOfWork.return;
    while (interruptedWork !== null) {
      unwindInterruptedWork(interruptedWork);
      interruptedWork = interruptedWork.return;
    }
  }

  if (__DEV__) {
    ReactStrictModeWarnings.discardPendingWarnings();
    checkThatStackIsEmpty();
  }

  nextRoot = null;
  nextRenderExpirationTime = NoWork;
  nextLatestAbsoluteTimeoutMs = -1;
  nextRenderDidError = false;
  nextUnitOfWork = null;
}

function commitAllHostEffects() {
  while (nextEffect !== null) {
    // 跳过
    if (__DEV__) {
      ReactCurrentFiber.setCurrentFiber(nextEffect);
    }
    // 跳过
    recordEffect();

    const effectTag = nextEffect.effectTag;

    // 处理content
    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }

    // 处理ref
    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }

    // The following switch statement is only concerned about placement,
    // updates, and deletions. To avoid needing to add a case for every
    // possible bitmap value, we remove the secondary effects from the
    // effect tag and switch on that value.
    // 处理移动更新删除
    let primaryEffectTag = effectTag & (Placement | Update | Deletion);
    switch (primaryEffectTag) {
      case Placement: {
        commitPlacement(nextEffect);
        // Clear the "placement" from effect tag so that we know that this is inserted, before
        // any life-cycles like componentDidMount gets called.
        // TODO: findDOMNode doesn't rely on this any more but isMounted
        // does and isMounted is deprecated anyway so we should be able
        // to kill this.
        nextEffect.effectTag &= ~Placement;
        break;
      }
      case PlacementAndUpdate: {
        // Placement
        commitPlacement(nextEffect);
        // Clear the "placement" from effect tag so that we know that this is inserted, before
        // any life-cycles like componentDidMount gets called.
        nextEffect.effectTag &= ~Placement;

        // Update
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      case Update: {
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      case Deletion: {
        commitDeletion(nextEffect);
        break;
      }
    }
    nextEffect = nextEffect.nextEffect;
  }

  // 跳过
  if (__DEV__) {
    ReactCurrentFiber.resetCurrentFiber();
  }
}

function commitBeforeMutationLifecycles() {
  // 
  while (nextEffect !== null) {
    // 跳过
    if (__DEV__) {
      ReactCurrentFiber.setCurrentFiber(nextEffect);
    }
    // 获取effectTag，表示如何操作fiber
    const effectTag = nextEffect.effectTag;
    // 如果有生命周期函数getSnapshotBeforeUpdate()，则执行
    if (effectTag & Snapshot) {
      // 跳过
      recordEffect();
      // 获取为workinprogressfiber的effect对应的fiber
      const current = nextEffect.alternate;
      // 
      commitBeforeMutationLifeCycles(current, nextEffect);
    }
    // 获取下一个effect，以便于执行指向的fiber上的getSnapshotBeforeUpdate()
    nextEffect = nextEffect.nextEffect;
  }

  // 跳过
  if (__DEV__) {
    ReactCurrentFiber.resetCurrentFiber();
  }
}

function commitAllLifeCycles(
  finishedRoot: FiberRoot,
  committedExpirationTime: ExpirationTime,
) {
  // 跳过
  if (__DEV__) {
    ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings();
    ReactStrictModeWarnings.flushLegacyContextWarning();

    if (warnAboutDeprecatedLifecycles) {
      ReactStrictModeWarnings.flushPendingDeprecationWarnings();
    }
  }
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;

    if (effectTag & (Update | Callback)) {
      // 跳过
      recordEffect();
      const current = nextEffect.alternate;
      commitLifeCycles(
        finishedRoot,
        current,
        nextEffect,
        committedExpirationTime,
      );
    }

    if (effectTag & Ref) {
      recordEffect();
      commitAttachRef(nextEffect);
    }

    if (enableHooks && effectTag & Passive) {
      rootWithPendingPassiveEffects = finishedRoot;
    }

    nextEffect = nextEffect.nextEffect;
  }
}

function commitPassiveEffects(root: FiberRoot, firstEffect: Fiber): void {
  rootWithPendingPassiveEffects = null;
  passiveEffectCallbackHandle = null;
  passiveEffectCallback = null;

  // Set this to true to prevent re-entrancy
  const previousIsRendering = isRendering;
  isRendering = true;

  let effect = firstEffect;
  do {
    if (effect.effectTag & Passive) {
      let didError = false;
      let error;
      if (__DEV__) {
        invokeGuardedCallback(null, commitPassiveHookEffects, null, effect);
        if (hasCaughtError()) {
          didError = true;
          error = clearCaughtError();
        }
      } else {
        try {
          commitPassiveHookEffects(effect);
        } catch (e) {
          didError = true;
          error = e;
        }
      }
      if (didError) {
        captureCommitPhaseError(effect, error);
      }
    }
    effect = effect.nextEffect;
  } while (effect !== null);

  isRendering = previousIsRendering;

  // Check if work was scheduled by one of the effects
  const rootExpirationTime = root.expirationTime;
  if (rootExpirationTime !== NoWork) {
    requestWork(root, rootExpirationTime);
  }
}

function isAlreadyFailedLegacyErrorBoundary(instance: mixed): boolean {
  return (
    legacyErrorBoundariesThatAlreadyFailed !== null &&
    legacyErrorBoundariesThatAlreadyFailed.has(instance)
  );
}

function markLegacyErrorBoundaryAsFailed(instance: mixed) {
  if (legacyErrorBoundariesThatAlreadyFailed === null) {
    legacyErrorBoundariesThatAlreadyFailed = new Set([instance]);
  } else {
    legacyErrorBoundariesThatAlreadyFailed.add(instance);
  }
}

// ◔ ‸◔?
function flushPassiveEffects() {
  if (passiveEffectCallback !== null) {
    Schedule_cancelCallback(passiveEffectCallbackHandle);
    // We call the scheduled callback instead of commitPassiveEffects directly
    // to ensure tracing works correctly.
    passiveEffectCallback();
  }
}

function commitRoot(root: FiberRoot, finishedWork: Fiber): void {
  isWorking = true;  // 设置标记
  isCommitting = true; // 标记在提交阶段

  // 跳过
  startCommitTimer();

  invariant(
    root.current !== finishedWork,
    'Cannot commit the same tree as before. This is probably a bug ' +
      'related to the return field. This error is likely caused by a bug ' +
      'in React. Please file an issue.',
  );

  // 获取pendingCommitExpirationTime，也就是同步调度与异步调度的时候设定的root上的到期时间
  const committedExpirationTime = root.pendingCommitExpirationTime;
  invariant(
    committedExpirationTime !== NoWork,
    'Cannot commit an incomplete root. This error is likely caused by a ' +
      'bug in React. Please file an issue.',
  );
  // 由于更新任务已经执行完成，到提交阶段，因此需要重置root.pendingCommitExpirationTime
  root.pendingCommitExpirationTime = NoWork;

  // Update the pending priority levels to account for the work that we are
  // about to commit. This needs to happen before calling the lifecycles, since
  // they may schedule additional updates.
  // 在正式提交之前，保存root上最高优先级的到期时间以及子树上最高优先级任务的到期时间
  const updateExpirationTimeBeforeCommit = finishedWork.expirationTime;
  const childExpirationTimeBeforeCommit = finishedWork.childExpirationTime;
  // 获取上面两者最高优先级任务的到期时间
  const earliestRemainingTimeBeforeCommit =
    childExpirationTimeBeforeCommit > updateExpirationTimeBeforeCommit
      ? childExpirationTimeBeforeCommit
      : updateExpirationTimeBeforeCommit;
  // 
  markCommittedPriorityLevels(root, earliestRemainingTimeBeforeCommit);

  let prevInteractions: Set<Interaction> = (null: any);

  // 跳过
  if (enableSchedulerTracing) {
    // Restore any pending interactions at this point,
    // So that cascading work triggered during the render phase will be accounted for.
    prevInteractions = __interactionsRef.current;
    __interactionsRef.current = root.memoizedInteractions;
  }

  // Reset this to null before calling lifecycles
  ReactCurrentOwner.current = null;

  // 处理root的effect，如果rootfiber有更新，则需要将rootFiber添加到finishedWork的effect队列的末尾。
  // 设置变量firstEffect指向finishedWork的第一个effect。
  let firstEffect;
  if (finishedWork.effectTag > PerformedWork) {
    // A fiber's effect list consists only of its children, not itself. So if
    // the root has an effect, we need to add it to the end of the list. The
    // resulting list is the set that would belong to the root's parent, if
    // it had one; that is, all the effects in the tree including the root.
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    // There is no effect on the root.
    firstEffect = finishedWork.firstEffect;
  }

  // 在提交之前，处理事件系统以及一些浏览器api的问题，比较有意思
  prepareForCommit(root.containerInfo);

  // Invoke instances of getSnapshotBeforeUpdate before mutation
  // 开始处理effect，初始化nextEffect为第一个effect
  nextEffect = firstEffect;
  // 跳过
  startCommitSnapshotEffectsTimer();
  // 
  while (nextEffect !== null) {
    // 发生错误的标记设置为false
    let didError = false;
    let error;
    if (__DEV__) {
      // 跳过
      invokeGuardedCallback(null, commitBeforeMutationLifecycles, null);
      if (hasCaughtError()) {
        didError = true;
        error = clearCaughtError();
      }
    } else {
      try {
        // 循环执行effect上的getSnapshotBeforeUpdate函数，并且nextEffect遍历到最后一个
        commitBeforeMutationLifecycles();
      } catch (e) {
        didError = true;
        error = e;
      }
    }
    // 错误处理
    if (didError) {
      invariant(
        nextEffect !== null,
        'Should have next effect. This error is likely caused by a bug ' +
          'in React. Please file an issue.',
      );
      captureCommitPhaseError(nextEffect, error);
      // Clean-up
      if (nextEffect !== null) {
        nextEffect = nextEffect.nextEffect;
      }
    }
  }
  stopCommitSnapshotEffectsTimer();

  // 跳过
  if (enableProfilerTimer) {
    // Mark the current commit time to be shared by all Profilers in this batch.
    // This enables them to be grouped later.
    recordCommitTime();
  }

  // Commit all the side-effects within a tree. We'll do this in two passes.
  // The first pass performs all the host insertions, updates, deletions and
  // ref unmounts.
  nextEffect = firstEffect;
  startCommitHostEffectsTimer();
  while (nextEffect !== null) {
    let didError = false;
    let error;
    if (__DEV__) {
      // 跳过
      invokeGuardedCallback(null, commitAllHostEffects, null);
      if (hasCaughtError()) {
        didError = true;
        error = clearCaughtError();
      }
    } else {
      try {
        commitAllHostEffects();
      } catch (e) {
        didError = true;
        error = e;
      }
    }
    if (didError) {
      invariant(
        nextEffect !== null,
        'Should have next effect. This error is likely caused by a bug ' +
          'in React. Please file an issue.',
      );
      captureCommitPhaseError(nextEffect, error);
      // Clean-up
      if (nextEffect !== null) {
        nextEffect = nextEffect.nextEffect;
      }
    }
  }
  // 跳过
  stopCommitHostEffectsTimer();

  resetAfterCommit(root.containerInfo);

  // The work-in-progress tree is now the current tree. This must come after
  // the first pass of the commit phase, so that the previous tree is still
  // current during componentWillUnmount, but before the second pass, so that
  // the finished work is current during componentDidMount/Update.
  root.current = finishedWork;

  // In the second pass we'll perform all life-cycles and ref callbacks.
  // Life-cycles happen as a separate pass so that all placements, updates,
  // and deletions in the entire tree have already been invoked.
  // This pass also triggers any renderer-specific initial effects.
  nextEffect = firstEffect;
  startCommitLifeCyclesTimer();
  while (nextEffect !== null) {
    let didError = false;
    let error;
    if (__DEV__) {
      // 跳过
      invokeGuardedCallback(
        null,
        commitAllLifeCycles,
        null,
        root,
        committedExpirationTime,
      );
      if (hasCaughtError()) {
        didError = true;
        error = clearCaughtError();
      }
    } else {
      try {
        commitAllLifeCycles(root, committedExpirationTime);
      } catch (e) {
        didError = true;
        error = e;
      }
    }
    if (didError) {
      invariant(
        nextEffect !== null,
        'Should have next effect. This error is likely caused by a bug ' +
          'in React. Please file an issue.',
      );
      captureCommitPhaseError(nextEffect, error);
      if (nextEffect !== null) {
        nextEffect = nextEffect.nextEffect;
      }
    }
  }

  if (
    enableHooks &&
    firstEffect !== null &&
    rootWithPendingPassiveEffects !== null
  ) {
    // This commit included a passive effect. These do not need to fire until
    // after the next paint. Schedule an callback to fire them in an async
    // event. To ensure serial execution, the callback will be flushed early if
    // we enter rootWithPendingPassiveEffects commit phase before then.
    let callback = commitPassiveEffects.bind(null, root, firstEffect);
    // 跳过
    if (enableSchedulerTracing) {
      // TODO: Avoid this extra callback by mutating the tracing ref directly,
      // like we do at the beginning of commitRoot. I've opted not to do that
      // here because that code is still in flux.
      callback = Schedule_tracing_wrap(callback);
    }
    passiveEffectCallbackHandle = Schedule_scheduleCallback(callback);
    passiveEffectCallback = callback;
  }

  isCommitting = false;
  isWorking = false;
  stopCommitLifeCyclesTimer();
  stopCommitTimer();
  onCommitRoot(finishedWork.stateNode);
  // 跳过
  if (__DEV__ && ReactFiberInstrumentation.debugTool) {
    ReactFiberInstrumentation.debugTool.onCommitWork(finishedWork);
  }

  const updateExpirationTimeAfterCommit = finishedWork.expirationTime;
  const childExpirationTimeAfterCommit = finishedWork.childExpirationTime;
  const earliestRemainingTimeAfterCommit =
    childExpirationTimeAfterCommit > updateExpirationTimeAfterCommit
      ? childExpirationTimeAfterCommit
      : updateExpirationTimeAfterCommit;
  if (earliestRemainingTimeAfterCommit === NoWork) {
    // If there's no remaining work, we can clear the set of already failed
    // error boundaries.
    legacyErrorBoundariesThatAlreadyFailed = null;
  }
  onCommit(root, earliestRemainingTimeAfterCommit);

  // 跳过
  if (enableSchedulerTracing) {
    __interactionsRef.current = prevInteractions;

    let subscriber;

    try {
      subscriber = __subscriberRef.current;
      if (subscriber !== null && root.memoizedInteractions.size > 0) {
        const threadID = computeThreadID(
          committedExpirationTime,
          root.interactionThreadID,
        );
        subscriber.onWorkStopped(root.memoizedInteractions, threadID);
      }
    } catch (error) {
      // It's not safe for commitRoot() to throw.
      // Store the error for now and we'll re-throw in finishRendering().
      if (!hasUnhandledError) {
        hasUnhandledError = true;
        unhandledError = error;
      }
    } finally {
      // Clear completed interactions from the pending Map.
      // Unless the render was suspended or cascading work was scheduled,
      // In which case– leave pending interactions until the subsequent render.
      const pendingInteractionMap = root.pendingInteractionMap;
      pendingInteractionMap.forEach(
        (scheduledInteractions, scheduledExpirationTime) => {
          // Only decrement the pending interaction count if we're done.
          // If there's still work at the current priority,
          // That indicates that we are waiting for suspense data.
          if (scheduledExpirationTime > earliestRemainingTimeAfterCommit) {
            pendingInteractionMap.delete(scheduledExpirationTime);

            scheduledInteractions.forEach(interaction => {
              interaction.__count--;

              if (subscriber !== null && interaction.__count === 0) {
                try {
                  subscriber.onInteractionScheduledWorkCompleted(interaction);
                } catch (error) {
                  // It's not safe for commitRoot() to throw.
                  // Store the error for now and we'll re-throw in finishRendering().
                  if (!hasUnhandledError) {
                    hasUnhandledError = true;
                    unhandledError = error;
                  }
                }
              }
            });
          }
        },
      );
    }
  }
}

/**
 * 设置workInProgress的childExpirationTime。遍历workInProgress下的第一层所有子节点，选出所有子节点以及子树中优先级最高的更新任务的到期时间作为workInProgress的childExpirationTime
 */
function resetChildExpirationTime(
  workInProgress: Fiber,
  renderTime: ExpirationTime,
) {
  if (renderTime !== Never && workInProgress.childExpirationTime === Never) {
    // The children of this component are hidden. Don't bubble their
    // expiration times.
    return;
  }

  let newChildExpirationTime = NoWork;

  // Bubble up the earliest expiration time.
  // 跳过
  if (enableProfilerTimer && workInProgress.mode & ProfileMode) {
    // We're in profiling mode.
    // Let's use this same traversal to update the render durations.
    let actualDuration = workInProgress.actualDuration;
    let treeBaseDuration = workInProgress.selfBaseDuration;

    // When a fiber is cloned, its actualDuration is reset to 0.
    // This value will only be updated if work is done on the fiber (i.e. it doesn't bailout).
    // When work is done, it should bubble to the parent's actualDuration.
    // If the fiber has not been cloned though, (meaning no work was done),
    // Then this value will reflect the amount of time spent working on a previous render.
    // In that case it should not bubble.
    // We determine whether it was cloned by comparing the child pointer.
    const shouldBubbleActualDurations =
      workInProgress.alternate === null ||
      workInProgress.child !== workInProgress.alternate.child;

    let child = workInProgress.child;
    while (child !== null) {
      const childUpdateExpirationTime = child.expirationTime;
      const childChildExpirationTime = child.childExpirationTime;
      if (childUpdateExpirationTime > newChildExpirationTime) {
        newChildExpirationTime = childUpdateExpirationTime;
      }
      if (childChildExpirationTime > newChildExpirationTime) {
        newChildExpirationTime = childChildExpirationTime;
      }
      if (shouldBubbleActualDurations) {
        actualDuration += child.actualDuration;
      }
      treeBaseDuration += child.treeBaseDuration;
      child = child.sibling;
    }
    workInProgress.actualDuration = actualDuration;
    workInProgress.treeBaseDuration = treeBaseDuration;
  } else {
    let child = workInProgress.child;
    while (child !== null) {
      const childUpdateExpirationTime = child.expirationTime;
      const childChildExpirationTime = child.childExpirationTime;
      if (childUpdateExpirationTime > newChildExpirationTime) {
        newChildExpirationTime = childUpdateExpirationTime;
      }
      if (childChildExpirationTime > newChildExpirationTime) {
        newChildExpirationTime = childChildExpirationTime;
      }
      child = child.sibling;
    }
  }

  workInProgress.childExpirationTime = newChildExpirationTime;
}

function completeUnitOfWork(workInProgress: Fiber): Fiber | null {
  // Attempt to complete the current unit of work, then move to the
  // next sibling. If there are no more siblings, return to the
  // parent fiber.
  while (true) {
    // The current, flushed, state of this fiber is the alternate.
    // Ideally nothing should rely on this, but relying on it here
    // means that we don't need an additional field on the work in
    // progress.
    const current = workInProgress.alternate;
    // 跳过
    if (__DEV__) {
      ReactCurrentFiber.setCurrentFiber(workInProgress);
    }

    const returnFiber = workInProgress.return;
    const siblingFiber = workInProgress.sibling;

    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      // 跳过
      if (__DEV__ && replayFailedUnitOfWorkWithInvokeGuardedCallback) {
        // Don't replay if it fails during completion phase.
        mayReplayFailedUnitOfWork = false;
      }
      // This fiber completed.
      // Remember we're completing this unit so we can find a boundary if it fails.
      nextUnitOfWork = workInProgress;
      if (enableProfilerTimer) {
        // debug跳过
        if (workInProgress.mode & ProfileMode) {
          startProfilerTimer(workInProgress);
        }
        nextUnitOfWork = completeWork(
          current,
          workInProgress,
          nextRenderExpirationTime,
        );
        if (workInProgress.mode & ProfileMode) {
          // Update render duration assuming we didn't error.
          stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);
        }
      } else {
        nextUnitOfWork = completeWork(
          current,
          workInProgress,
          nextRenderExpirationTime,
        );
      }
      // 跳过
      if (__DEV__ && replayFailedUnitOfWorkWithInvokeGuardedCallback) {
        // We're out of completion phase so replaying is fine now.
        mayReplayFailedUnitOfWork = true;
      }
      // 跳过
      stopWorkTimer(workInProgress);
      resetChildExpirationTime(workInProgress, nextRenderExpirationTime);
      // 跳过
      if (__DEV__) {
        ReactCurrentFiber.resetCurrentFiber();
      }

      if (nextUnitOfWork !== null) {
        // Completing this fiber spawned new work. Work on that next.
        return nextUnitOfWork;
      }

      if (
        returnFiber !== null &&
        // Do not append effects to parents if a sibling failed to complete
        (returnFiber.effectTag & Incomplete) === NoEffect
      ) {
        // Append all the effects of the subtree and this fiber onto the effect
        // list of the parent. The completion order of the children affects the
        // side-effect order.
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEffect = workInProgress.firstEffect;
        }
        if (workInProgress.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
          }
          returnFiber.lastEffect = workInProgress.lastEffect;
        }

        // If this fiber had side-effects, we append it AFTER the children's
        // side-effects. We can perform certain side-effects earlier if
        // needed, by doing multiple passes over the effect list. We don't want
        // to schedule our own side-effect on our own list because if end up
        // reusing children we'll schedule this effect onto itself since we're
        // at the end.
        const effectTag = workInProgress.effectTag;
        // Skip both NoWork and PerformedWork tags when creating the effect list.
        // PerformedWork effect is read by React DevTools but shouldn't be committed.
        if (effectTag > PerformedWork) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress;
          } else {
            returnFiber.firstEffect = workInProgress;
          }
          returnFiber.lastEffect = workInProgress;
        }
      }

      // 跳过
      if (__DEV__ && ReactFiberInstrumentation.debugTool) {
        ReactFiberInstrumentation.debugTool.onCompleteWork(workInProgress);
      }

      if (siblingFiber !== null) {
        // If there is more work to do in this returnFiber, do that next.
        return siblingFiber;
      } else if (returnFiber !== null) {
        // If there's no more work in this returnFiber. Complete the returnFiber.
        workInProgress = returnFiber;
        continue;
      } else {
        // We've reached the root.
        return null;
      }
    } else {
      // 跳过
      if (enableProfilerTimer && workInProgress.mode & ProfileMode) {
        // Record the render duration for the fiber that errored.
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);

        // Include the time spent working on failed children before continuing.
        let actualDuration = workInProgress.actualDuration;
        let child = workInProgress.child;
        while (child !== null) {
          actualDuration += child.actualDuration;
          child = child.sibling;
        }
        workInProgress.actualDuration = actualDuration;
      }

      // This fiber did not complete because something threw. Pop values off
      // the stack without entering the complete phase. If this is a boundary,
      // capture values if possible.
      const next = unwindWork(workInProgress, nextRenderExpirationTime);
      // Because this fiber did not complete, don't reset its expiration time.
      if (workInProgress.effectTag & DidCapture) {
        // Restarting an error boundary
        stopFailedWorkTimer(workInProgress);
      } else {
        stopWorkTimer(workInProgress);
      }

      // 跳过
      if (__DEV__) {
        ReactCurrentFiber.resetCurrentFiber();
      }

      if (next !== null) {
        // 跳过
        stopWorkTimer(workInProgress);
        // 跳过
        if (__DEV__ && ReactFiberInstrumentation.debugTool) {
          ReactFiberInstrumentation.debugTool.onCompleteWork(workInProgress);
        }

        // If completing this work spawned new work, do that next. We'll come
        // back here again.
        // Since we're restarting, remove anything that is not a host effect
        // from the effect tag.
        next.effectTag &= HostEffectMask;
        return next;
      }

      if (returnFiber !== null) {
        // Mark the parent fiber as incomplete and clear its effect list.
        returnFiber.firstEffect = returnFiber.lastEffect = null;
        returnFiber.effectTag |= Incomplete;
      }
      // 跳过
      if (__DEV__ && ReactFiberInstrumentation.debugTool) {
        ReactFiberInstrumentation.debugTool.onCompleteWork(workInProgress);
      }

      if (siblingFiber !== null) {
        // If there is more work to do in this returnFiber, do that next.
        return siblingFiber;
      } else if (returnFiber !== null) {
        // If there's no more work in this returnFiber. Complete the returnFiber.
        workInProgress = returnFiber;
        continue;
      } else {
        return null;
      }
    }
  }

  // Without this explicit null return Flow complains of invalid return type
  // TODO Remove the above while(true) loop
  // eslint-disable-next-line no-unreachable
  return null;
}

function performUnitOfWork(workInProgress: Fiber): Fiber | null {
  // The current, flushed, state of this fiber is the alternate.
  // Ideally nothing should rely on this, but relying on it here
  // means that we don't need an additional field on the work in
  // progress.
  const current = workInProgress.alternate;

  // See if beginning this work spawns more work.
  // 该函数跳过
  startWorkTimer(workInProgress);
  if (__DEV__) {
    ReactCurrentFiber.setCurrentFiber(workInProgress);
  }

  // 跳过
  if (__DEV__ && replayFailedUnitOfWorkWithInvokeGuardedCallback) {
    stashedWorkInProgressProperties = assignFiberPropertiesInDEV(
      stashedWorkInProgressProperties,
      workInProgress,
    );
  }

  let next;
  if (enableProfilerTimer) {
    // 此处跳过
    if (workInProgress.mode & ProfileMode) {
      startProfilerTimer(workInProgress);
    }

    next = beginWork(current, workInProgress, nextRenderExpirationTime);
    workInProgress.memoizedProps = workInProgress.pendingProps;

    if (workInProgress.mode & ProfileMode) {
      // Record the render duration assuming we didn't bailout (or error).
      stopProfilerTimerIfRunningAndRecordDelta(workInProgress, true);
    }
  } else {
    next = beginWork(current, workInProgress, nextRenderExpirationTime);
    workInProgress.memoizedProps = workInProgress.pendingProps;
  }

  // 跳过
  if (__DEV__) {
    ReactCurrentFiber.resetCurrentFiber();
    if (isReplayingFailedUnitOfWork) {
      // Currently replaying a failed unit of work. This should be unreachable,
      // because the render phase is meant to be idempotent, and it should
      // have thrown again. Since it didn't, rethrow the original error, so
      // React's internal stack is not misaligned.
      rethrowOriginalError();
    }
  }
  // 跳过
  if (__DEV__ && ReactFiberInstrumentation.debugTool) {
    ReactFiberInstrumentation.debugTool.onBeginWork(workInProgress);
  }

  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    next = completeUnitOfWork(workInProgress);
  }

  ReactCurrentOwner.current = null;

  return next;
}

//同步的情况下performUnitOfWork不允许被中断
//异步情况下performUnitOfWork允许被高优先级的事件中断
function workLoop(isYieldy) {
  if (!isYieldy) {
    // Flush work without yielding
    while (nextUnitOfWork !== null) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  } else {
    // Flush asynchronous work until there's a higher priority event
    while (nextUnitOfWork !== null && !shouldYieldToRenderer()) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  }
}

/**
 * 1. 处理副作用(❓❓❓)
 * 2. 获取节点上记录的上次执行performAsyncWork的时间
 * 3. 判断是开始新的renderroot还是恢复到之前被打断的任务中：
 *    调度开始的过期时间与上次调度开始的到期时间不等则开始新的renderroot，如果在某次renderroot的过程中产生了更新并且被打断，则这个两个到期时间是一样的，因此恢复到之前被打断的任务中
 *    本次调度的root与上一次的root不一样，那么将调度相关的栈清空，开始新的renderRoot
 *    上次调度由于打断或者空余时间不足，导致还有任务没有执行则恢复到被打断的任务中，否则开始新的renderRoot
 * 4. 
 * @param {*} root 子树具有更新任务的root
 * @param {*} isYieldy 同步或者异步，异步可被打断
 */
function renderRoot(root: FiberRoot, isYieldy: boolean): void {
  invariant(
    !isWorking,
    'renderRoot was called recursively. This error is likely caused ' +
      'by a bug in React. Please file an issue.',
  );

  // ❓❓❓处理副作用，与commitRoot有关
  // 1
  flushPassiveEffects();

  isWorking = true;
  if (enableHooks) {
    //如果允许使用hooks，则将react提供的hook api设置到ReactCurrentOwner.currentDispatcher
    //  ReactCurrentOwner： packages\react\src\ReactCurrentOwner.js
    ReactCurrentOwner.currentDispatcher = Dispatcher;
  } else {
    ReactCurrentOwner.currentDispatcher = DispatcherWithoutHooks;
  }

  // 2
  // 获取root上的nextExpirationTimeToWorkOn，这个到期时间初始设置是在调用performAsyncWork的时候，
  // 回顾一下： 调用performAsyncWork的当前时间会被保存在currentRendererTime，然后利用这个时间root.expirationTime比较判断root的更新任务是否到期了，如果到期了，那么将currentRendererTime设置到root.nextExpirationTimeToWorkOn
  const expirationTime = root.nextExpirationTimeToWorkOn;

  // 3
  // Check if we're starting from a fresh stack, or if we're resuming from
  // previously yielded work.
  //  判断是否是开始新的一次渲染阶段，还是返回到之前被中断的工作中。任意一个条件成立表示开始新的一次渲染阶段。
  //  nextRenderExpirationTime : 上次调用performAsyncWork的时间，该函数会将performWork推入调度器
  //  root !== nextRoot ：在只有一个root情况下fiber树有更新，nextRoot会在发生致命错误或者渲染阶段结束的时候将其设置为null。所以只要有更新都会进入到if中
  //  expirationTime !== nextRenderExpirationTime ：初次执行reactDOM.render的时候成立，当本次renderRoot的过程中产生更新，那么这里不会成立。
  //  nextUnitOfWork === null ： 表示之前空闲时间将所有的任务够执行完了，因此nextUnitOfWork === null。如果不为null，表明之前还有没有完成的任务。
  if (
    // 在renderRoot的时候发生的更新任务的到期时间会与当前renderRoot的时候最高优先级任务到期时间保持一致
    expirationTime !== nextRenderExpirationTime || //这个条件成立的情况： 见computeExpirationForFiber
    root !== nextRoot ||
    nextUnitOfWork === null
  ) {
    // Reset the stack and start working from the root.
    resetStack();
    nextRoot = root;
    nextRenderExpirationTime = expirationTime;
    nextUnitOfWork = createWorkInProgress(
      nextRoot.current,
      null,
      nextRenderExpirationTime,
    );
    // 在renderRoot结束的时候会调用onFatal, onComplete, onSuspend, onYield这四个函数中的一个
    // 其中onFatal(发生错误了)与onYield(被中断了)不会改变pendingCommitExpirationTime，而是将finishedWork设置为null，后续会进入第二阶段(提交阶段)
    // 其中onComplete会将一个时间设置到pendingCommitExpirationTime，在返回performWork并进入第二阶段的时候，会根据这个时间来决定是否提交
    // ❓❓❓：其中onSuspend会根据msUntilTimeout是否不为0以及是否有空闲时间来将pendingCommitExpirationTime设置为一个时间，并且会在第二阶段立即提交。否则不会设置pendingCommitExpirationTime
    root.pendingCommitExpirationTime = NoWork;

    // 跳过
    if (enableSchedulerTracing) {
      // Determine which interactions this batch of work currently includes,
      // So that we can accurately attribute time spent working on it,
      // And so that cascading work triggered during the render phase will be associated with it.
      const interactions: Set<Interaction> = new Set();
      root.pendingInteractionMap.forEach(
        (scheduledInteractions, scheduledExpirationTime) => {
          if (scheduledExpirationTime >= expirationTime) {
            scheduledInteractions.forEach(interaction =>
              interactions.add(interaction),
            );
          }
        },
      );

      // Store the current set of interactions on the FiberRoot for a few reasons:
      // We can re-use it in hot functions like renderRoot() without having to recalculate it.
      // We will also use it in commitWork() to pass to any Profiler onRender() hooks.
      // This also provides DevTools with a way to access it when the onCommitRoot() hook is called.
      root.memoizedInteractions = interactions;

      if (interactions.size > 0) {
        const subscriber = __subscriberRef.current;
        if (subscriber !== null) {
          const threadID = computeThreadID(
            expirationTime,
            root.interactionThreadID,
          );
          try {
            subscriber.onWorkStarted(interactions, threadID);
          } catch (error) {
            // Work thrown by an interaction tracing subscriber should be rethrown,
            // But only once it's safe (to avoid leaveing the scheduler in an invalid state).
            // Store the error for now and we'll re-throw in finishRendering().
            if (!hasUnhandledError) {
              hasUnhandledError = true;
              unhandledError = error;
            }
          }
        }
      }
    }
  }

  // debug部分跳过
  let prevInteractions: Set<Interaction> = (null: any);
  // debug部分跳过
  if (enableSchedulerTracing) {
    // We're about to start new traced work.
    // Restore pending interactions so cascading work triggered during the render phase will be accounted for.
    prevInteractions = __interactionsRef.current;
    __interactionsRef.current = root.memoizedInteractions;
  }

  // 初始化是否发生错误的标记
  let didFatal = false;
  // debug部分跳过 
  startWorkLoopTimer(nextUnitOfWork);

  do {
    try {
      workLoop(isYieldy);
    } catch (thrownValue) {
      resetContextDependences();
      resetHooks();

      // Reset in case completion throws.
      // This is only used in DEV and when replaying is on.
      let mayReplay;
      if (__DEV__ && replayFailedUnitOfWorkWithInvokeGuardedCallback) {
        mayReplay = mayReplayFailedUnitOfWork;
        mayReplayFailedUnitOfWork = true;
      }

      if (nextUnitOfWork === null) {
        // This is a fatal error.
        didFatal = true;
        onUncaughtError(thrownValue);
      } else {
        // 跳过
        if (enableProfilerTimer && nextUnitOfWork.mode & ProfileMode) {
          // Record the time spent rendering before an error was thrown.
          // This avoids inaccurate Profiler durations in the case of a suspended render.
          stopProfilerTimerIfRunningAndRecordDelta(nextUnitOfWork, true);
        }
        // 跳过
        if (__DEV__) {
          // Reset global debug state
          // We assume this is defined in DEV
          (resetCurrentlyProcessingQueue: any)();
        }
        // 跳过
        if (__DEV__ && replayFailedUnitOfWorkWithInvokeGuardedCallback) {
          if (mayReplay) {
            const failedUnitOfWork: Fiber = nextUnitOfWork;
            replayUnitOfWork(failedUnitOfWork, thrownValue, isYieldy);
          }
        }

        // TODO: we already know this isn't true in some cases.
        // At least this shows a nicer error message until we figure out the cause.
        // https://github.com/facebook/react/issues/12449#issuecomment-386727431
        invariant(
          nextUnitOfWork !== null,
          'Failed to replay rendering after an error. This ' +
            'is likely caused by a bug in React. Please file an issue ' +
            'with a reproducing case to help us find it.',
        );

        const sourceFiber: Fiber = nextUnitOfWork;
        let returnFiber = sourceFiber.return;
        if (returnFiber === null) {
          // This is the root. The root could capture its own errors. However,
          // we don't know if it errors before or after we pushed the host
          // context. This information is needed to avoid a stack mismatch.
          // Because we're not sure, treat this as a fatal error. We could track
          // which phase it fails in, but doesn't seem worth it. At least
          // for now.
          didFatal = true;
          onUncaughtError(thrownValue);
        } else {
          throwException(
            root,
            returnFiber,
            sourceFiber,
            thrownValue,
            nextRenderExpirationTime,
          );
          nextUnitOfWork = completeUnitOfWork(sourceFiber);
          continue;
        }
      }
    }
    break;
  } while (true);
  // debug部分跳过 
  if (enableSchedulerTracing) {
    // Traced work is done for now; restore the previous interactions.
    __interactionsRef.current = prevInteractions;
  }

  // We're done performing work. Time to clean up.
  isWorking = false;
  ReactCurrentOwner.currentDispatcher = null;
  resetContextDependences();
  resetHooks();

  // Yield back to main thread.
  if (didFatal) {
    const didCompleteRoot = false;
    stopWorkLoopTimer(interruptedBy, didCompleteRoot);
    interruptedBy = null;
    // There was a fatal error.
    if (__DEV__) {
      resetStackAfterFatalErrorInDev();
    }
    // `nextRoot` points to the in-progress root. A non-null value indicates
    // that we're in the middle of an async render. Set it to null to indicate
    // there's no more work to be done in the current batch.
    nextRoot = null;
    onFatal(root);
    return;
  }

  if (nextUnitOfWork !== null) {
    // There's still remaining async work in this tree, but we ran out of time
    // in the current frame. Yield back to the renderer. Unless we're
    // interrupted by a higher priority update, we'll continue later from where
    // we left off.
    const didCompleteRoot = false;
    stopWorkLoopTimer(interruptedBy, didCompleteRoot);
    interruptedBy = null;
    onYield(root);
    return;
  }

  // We completed the whole tree.
  const didCompleteRoot = true;
  stopWorkLoopTimer(interruptedBy, didCompleteRoot);
  const rootWorkInProgress = root.current.alternate;
  invariant(
    rootWorkInProgress !== null,
    'Finished root should have a work-in-progress. This error is likely ' +
      'caused by a bug in React. Please file an issue.',
  );

  // `nextRoot` points to the in-progress root. A non-null value indicates
  // that we're in the middle of an async render. Set it to null to indicate
  // there's no more work to be done in the current batch.
  nextRoot = null;
  interruptedBy = null;

  if (nextRenderDidError) {
    // There was an error
    if (hasLowerPriorityWork(root, expirationTime)) {
      // There's lower priority work. If so, it may have the effect of fixing
      // the exception that was just thrown. Exit without committing. This is
      // similar to a suspend, but without a timeout because we're not waiting
      // for a promise to resolve. React will restart at the lower
      // priority level.
      markSuspendedPriorityLevel(root, expirationTime);
      const suspendedExpirationTime = expirationTime;
      const rootExpirationTime = root.expirationTime;
      onSuspend(
        root,
        rootWorkInProgress,
        suspendedExpirationTime,
        rootExpirationTime,
        -1, // Indicates no timeout
      );
      return;
    } else if (
      // There's no lower priority work, but we're rendering asynchronously.
      // Synchronsouly attempt to render the same level one more time. This is
      // similar to a suspend, but without a timeout because we're not waiting
      // for a promise to resolve.
      !root.didError &&
      isYieldy
    ) {
      root.didError = true;
      const suspendedExpirationTime = (root.nextExpirationTimeToWorkOn = expirationTime);
      const rootExpirationTime = (root.expirationTime = Sync);
      onSuspend(
        root,
        rootWorkInProgress,
        suspendedExpirationTime,
        rootExpirationTime,
        -1, // Indicates no timeout
      );
      return;
    }
  }

  if (isYieldy && nextLatestAbsoluteTimeoutMs !== -1) {
    // The tree was suspended.
    const suspendedExpirationTime = expirationTime;
    markSuspendedPriorityLevel(root, suspendedExpirationTime);

    // Find the earliest uncommitted expiration time in the tree, including
    // work that is suspended. The timeout threshold cannot be longer than
    // the overall expiration.
    const earliestExpirationTime = findEarliestOutstandingPriorityLevel(
      root,
      expirationTime,
    );
    const earliestExpirationTimeMs = expirationTimeToMs(earliestExpirationTime);
    if (earliestExpirationTimeMs < nextLatestAbsoluteTimeoutMs) {
      nextLatestAbsoluteTimeoutMs = earliestExpirationTimeMs;
    }

    // Subtract the current time from the absolute timeout to get the number
    // of milliseconds until the timeout. In other words, convert an absolute
    // timestamp to a relative time. This is the value that is passed
    // to `setTimeout`.
    const currentTimeMs = expirationTimeToMs(requestCurrentTime());
    let msUntilTimeout = nextLatestAbsoluteTimeoutMs - currentTimeMs;
    msUntilTimeout = msUntilTimeout < 0 ? 0 : msUntilTimeout;

    // TODO: Account for the Just Noticeable Difference

    const rootExpirationTime = root.expirationTime;
    onSuspend(
      root,
      rootWorkInProgress,
      suspendedExpirationTime,
      rootExpirationTime,
      msUntilTimeout,
    );
    return;
  }

  // Ready to commit.
  onComplete(root, rootWorkInProgress, expirationTime);
}

function captureCommitPhaseError(sourceFiber: Fiber, value: mixed) {
  const expirationTime = Sync;
  let fiber = sourceFiber.return;
  while (fiber !== null) {
    switch (fiber.tag) {
      case ClassComponent:
        const ctor = fiber.type;
        const instance = fiber.stateNode;
        if (
          typeof ctor.getDerivedStateFromError === 'function' ||
          (typeof instance.componentDidCatch === 'function' &&
            !isAlreadyFailedLegacyErrorBoundary(instance))
        ) {
          const errorInfo = createCapturedValue(value, sourceFiber);
          const update = createClassErrorUpdate(
            fiber,
            errorInfo,
            expirationTime,
          );
          enqueueUpdate(fiber, update);
          scheduleWork(fiber, expirationTime);
          return;
        }
        break;
      case HostRoot: {
        const errorInfo = createCapturedValue(value, sourceFiber);
        const update = createRootErrorUpdate(fiber, errorInfo, expirationTime);
        enqueueUpdate(fiber, update);
        scheduleWork(fiber, expirationTime);
        return;
      }
    }
    fiber = fiber.return;
  }

  if (sourceFiber.tag === HostRoot) {
    // Error was thrown at the root. There is no parent, so the root
    // itself should capture it.
    const rootFiber = sourceFiber;
    const errorInfo = createCapturedValue(value, rootFiber);
    const update = createRootErrorUpdate(rootFiber, errorInfo, expirationTime);
    enqueueUpdate(rootFiber, update);
    scheduleWork(rootFiber, expirationTime);
  }
}

function computeThreadID(
  expirationTime: ExpirationTime,
  interactionThreadID: number,
): number {
  // Interaction threads are unique per root and expiration time.
  return expirationTime * 1000 + interactionThreadID;
}

// Creates a unique async expiration time.
function computeUniqueAsyncExpiration(): ExpirationTime {
  const currentTime = requestCurrentTime();
  let result = computeAsyncExpiration(currentTime);
  if (result >= lastUniqueAsyncExpiration) {
    // Since we assume the current time monotonically increases, we only hit
    // this branch when computeUniqueAsyncExpiration is fired multiple times
    // within a 200ms window (or whatever the async bucket size is).
    result = lastUniqueAsyncExpiration - 1;
  }
  lastUniqueAsyncExpiration = result;
  return lastUniqueAsyncExpiration;
}

//一些更新策略：初始化根节点的render阶段，expirationTime = Sync
//🙋🙋🙋
function computeExpirationForFiber(currentTime: ExpirationTime, fiber: Fiber) {
  let expirationTime;
  if (expirationContext !== NoWork) {
    // An explicit expiration context was set;
    //   已设置显式过期上下文
    expirationTime = expirationContext;
  } else if (isWorking) {
    //在renderRoot与commitRoot阶段isWorking = true，结束之后都会是false
    //  下面就判断是哪个阶段
    if (isCommitting) {
      // Updates that occur during the commit phase should have sync priority
      // by default.
      //   默认情况下，在提交阶段发生的更新应该具有同步优先级。
      expirationTime = Sync;
    } else {
      // Updates during the render phase should expire at the same time as
      // the work that is being rendered.
      // render阶段的更新应与正在render的任务同时过期
      expirationTime = nextRenderExpirationTime;
    }
  } else {
    // No explicit expiration context was set, and we're not currently
    // performing work. Calculate a new expiration time.
    //  没有设置显示过期上下文，并且没有任务在执行，则重新计算到期时间
    if (fiber.mode & ConcurrentMode) {
      if (isBatchingInteractiveUpdates) {
        // This is an interactive update
        //  如果是交互动作的更新，则执行computeInteractiveExpiration根据当前到期时间计算交互任务的到期时间
        expirationTime = computeInteractiveExpiration(currentTime);
      } else {
        // This is an async update
        //  如果是异步更新，则调用computeAsyncExpiration根据当前到期时间计算出对应的异步到期时间
        expirationTime = computeAsyncExpiration(currentTime);
      }
      // If we're in the middle of rendering a tree, do not update at the same
      // expiration time that is already rendering.
      //  如果处于正在render一个树的阶段，则不要在当前同一个到期时间更新
      if (nextRoot !== null && expirationTime === nextRenderExpirationTime) {
        expirationTime -= 1;
      }
    } else {
      // This is a sync update
      //  同步渲染
      expirationTime = Sync;
    }
  }
  if (isBatchingInteractiveUpdates){
    // This is an interactive update. Keep track of the lowest pending
    // interactive expiration time. This allows us to synchronously flush
    // all interactive updates when needed.
    // 这是一个交互式更新。跟踪最低交互过期时间。这允许我们在需要时同步刷新所有交互式更新。
    if (
      lowestPriorityPendingInteractiveExpirationTime === NoWork ||
      expirationTime < lowestPriorityPendingInteractiveExpirationTime
    ) {
      lowestPriorityPendingInteractiveExpirationTime = expirationTime;
    }
  }
  return expirationTime;
}

function renderDidSuspend(
  root: FiberRoot,
  absoluteTimeoutMs: number,
  suspendedTime: ExpirationTime,
) {
  // Schedule the timeout.
  if (
    absoluteTimeoutMs >= 0 &&
    nextLatestAbsoluteTimeoutMs < absoluteTimeoutMs
  ) {
    nextLatestAbsoluteTimeoutMs = absoluteTimeoutMs;
  }
}

function renderDidError() {
  nextRenderDidError = true;
}

function retrySuspendedRoot(
  root: FiberRoot,
  boundaryFiber: Fiber,
  sourceFiber: Fiber,
  suspendedTime: ExpirationTime,
) {
  let retryTime;

  if (isPriorityLevelSuspended(root, suspendedTime)) {
    // Ping at the original level
    retryTime = suspendedTime;

    markPingedPriorityLevel(root, retryTime);
  } else {
    // Suspense already timed out. Compute a new expiration time
    const currentTime = requestCurrentTime();
    retryTime = computeExpirationForFiber(currentTime, boundaryFiber);
    markPendingPriorityLevel(root, retryTime);
  }

  // TODO: If the suspense fiber has already rendered the primary children
  // without suspending (that is, all of the promises have already resolved),
  // we should not trigger another update here. One case this happens is when
  // we are in sync mode and a single promise is thrown both on initial render
  // and on update; we attach two .then(retrySuspendedRoot) callbacks and each
  // one performs Sync work, rerendering the Suspense.

  if ((boundaryFiber.mode & ConcurrentMode) !== NoContext) {
    if (root === nextRoot && nextRenderExpirationTime === suspendedTime) {
      // Received a ping at the same priority level at which we're currently
      // rendering. Restart from the root.
      nextRoot = null;
    }
  }

  scheduleWorkToRoot(boundaryFiber, retryTime);
  if ((boundaryFiber.mode & ConcurrentMode) === NoContext) {
    // Outside of concurrent mode, we must schedule an update on the source
    // fiber, too, since it already committed in an inconsistent state and
    // therefore does not have any pending work.
    scheduleWorkToRoot(sourceFiber, retryTime);
    const sourceTag = sourceFiber.tag;
    if (sourceTag === ClassComponent && sourceFiber.stateNode !== null) {
      // When we try rendering again, we should not reuse the current fiber,
      // since it's known to be in an inconsistent state. Use a force updte to
      // prevent a bail out.
      const update = createUpdate(retryTime);
      update.tag = ForceUpdate;
      enqueueUpdate(sourceFiber, update);
    }
  }

  const rootExpirationTime = root.expirationTime;
  if (rootExpirationTime !== NoWork) {
    requestWork(root, rootExpirationTime);
  }
}

/**
 * 将发生的更新事件的到期时间更新到整个fiber树上，返回FiberRoot
 * @param {*} fiber 发生更新的当前fiber节点 ：具体？
 * @param {*} expirationTime 发生更新的到期时间
 */
function scheduleWorkToRoot(fiber: Fiber, expirationTime): FiberRoot | null {
  // 跳过，与debug相关
  recordScheduleUpdate();

  // 跳过
  if (__DEV__) {
    if (fiber.tag === ClassComponent) {
      const instance = fiber.stateNode;
      warnAboutInvalidUpdates(instance);
    }
  }

  // Update the source fiber's expiration time
  //  如果传入的expirationTime比原来fiber上的大，则更新原fiber的到期时间
  //  expirationTime越大，优先级越高
  if (fiber.expirationTime < expirationTime) {
    fiber.expirationTime = expirationTime;
  }
  //如上逻辑,更新fiber.alternate上的expirationTime
  let alternate = fiber.alternate;
  if (alternate !== null && alternate.expirationTime < expirationTime) {
    alternate.expirationTime = expirationTime;
  }
  // Walk the parent path to the root and update the child expiration time.
  //
  let node = fiber.return; //父节点fiber node
  let root = null;
  if (node === null && fiber.tag === HostRoot) {
      // 如果传入的fiber没有父fiber并且当前fiber是hostroot，则返回的root为当前fiber.stateNode
      // 也就是当前的fiber为rootFiber，而在调用reactDOM.render的时候rootFiber.stateNode保存的就是fiberRoot。
    root = fiber.stateNode;
  } else {
      // expirationTime为当前传入的fiber��到期时间，即发生更新的子节点的到期时间
      // 如果传入的fiber是fiber树中的非根节点，则用子节点的到期时间更新
      // 这里需要注意： 到期时间大的优先级会更高，fiber.childExpirationTime存储的是整个root树中优先级最高的更新事件对应的到期时间
    while (node !== null) {
      alternate = node.alternate;
      if (node.childExpirationTime < expirationTime) {
        // 如果当前发生的更新事件优先级高于整个root树中最高优先级的更新，那么将遍历到的fiber.childExpirationTime更新为当前更新的到期时间
        node.childExpirationTime = expirationTime;
        if (
          alternate !== null &&
          alternate.childExpirationTime < expirationTime
        ) {
          //以同样的逻辑处理当前遍的节点的副本alternate，在workinprogress世界中的副本
          alternate.childExpirationTime = expirationTime;
        }
      } else if (
        alternate !== null &&
        alternate.childExpirationTime < expirationTime
      ) {
          //保存着当前状态的fiber树的节点的更新时间不需要更新，但是workinprogress-fiber需要更新最高优先级更新事件的到期时间
        alternate.childExpirationTime = expirationTime;
      }
      if (node.return === null && node.tag === HostRoot) {
        //循环直到遍历到的父节点为根节点，不再有父节点了，就将当前遍历到的节点的fiberRoor作为root，并退出循环
        root = node.stateNode;
        break;
      }
      // 向上遍历父fiber
      node = node.return;
    }
  }

  // 跳过，如果允许跟踪，则执行
  if (enableSchedulerTracing) {
    if (root !== null) {
      const interactions = __interactionsRef.current;
      if (interactions.size > 0) {
        const pendingInteractionMap = root.pendingInteractionMap;
        const pendingInteractions = pendingInteractionMap.get(expirationTime);
        if (pendingInteractions != null) {
          interactions.forEach(interaction => {
            if (!pendingInteractions.has(interaction)) {
              // Update the pending async work count for previously unscheduled interaction.
              interaction.__count++;
            }

            pendingInteractions.add(interaction);
          });
        } else {
          pendingInteractionMap.set(expirationTime, new Set(interactions));

          // Update the pending async work count for the current interactions.
          interactions.forEach(interaction => {
            interaction.__count++;
          });
        }

        const subscriber = __subscriberRef.current;
        if (subscriber !== null) {
          const threadID = computeThreadID(
            expirationTime,
            root.interactionThreadID,
          );
          subscriber.onWorkScheduled(interactions, threadID);
        }
      }
    }
  }
  //返回hostroot对应的root
  return root;
}

function scheduleWork(fiber: Fiber, expirationTime: ExpirationTime) {
  //  用于更新fiber的到期时间...
  const root = scheduleWorkToRoot(fiber, expirationTime);
  if (root === null) {
    if (__DEV__) {
      switch (fiber.tag) {
        case ClassComponent:
          warnAboutUpdateOnUnmounted(fiber, true);
          break;
        case FunctionComponent:
        case ForwardRef:
        case MemoComponent:
        case SimpleMemoComponent:
          warnAboutUpdateOnUnmounted(fiber, false);
          break;
      }
    }
    return;
  }
  //isWorking：代表是否正在工作，在开始renderRoot和commitRoot的时候会设置为 true，也就是在render和commit两个阶段都会为true
  //nextRenderExpirationTime：下一个要渲染的任务的到期时间
  //  expirationTime：当前更新的到期时间
  if (
    !isWorking &&
    nextRenderExpirationTime !== NoWork &&
    expirationTime > nextRenderExpirationTime
  ) {
    // This is an interruption. (Used for performance tracking.)
    // 如果当前更新的优先级比下一个要渲染的任务的优先级高，并且之前执行过任务(下一个要渲染的任务优先级不是0)，并且不处于render以及commit阶段（当前没有任务正在执行）
    // 则打断之前的任务，并且执行resetStack()将被中断的任务队列清空
    // 每一次更新都会有一个任务队列，当一个时间片有时间的时候才会执行，否则交给浏览器渲染页面
    // 在这个任务队列中，如果优先级更高的更新发生了，那么这个更新任务会打断当前的任务队列的执行，所以会调用resetStack清空这个任务队列
    interruptedBy = fiber;
    resetStack();
  }
  // 利用expirationTime来更新fiberRoot上记录的所有子节点更新任务到期时间的区间[earliestPendingTime,latestPendingTime]
  markPendingPriorityLevel(root, expirationTime);
  if (
    // If we're in the render phase, we don't need to schedule this root
    // for an update, because we'll do it before we exit...
    !isWorking ||
    isCommitting ||
    // ...unless this is a different root than the one we're rendering.
    nextRoot !== root
  ) {
    const rootExpirationTime = root.expirationTime;
    requestWork(root, rootExpirationTime);
  }
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    // Reset this back to zero so subsequent updates don't throw.
    nestedUpdateCount = 0;
    invariant(
      false,
      'Maximum update depth exceeded. This can happen when a ' +
        'component repeatedly calls setState inside ' +
        'componentWillUpdate or componentDidUpdate. React limits ' +
        'the number of nested updates to prevent infinite loops.',
    );
  }
}

function deferredUpdates<A>(fn: () => A): A {
  const currentTime = requestCurrentTime();
  const previousExpirationContext = expirationContext;
  const previousIsBatchingInteractiveUpdates = isBatchingInteractiveUpdates;
  expirationContext = computeAsyncExpiration(currentTime);
  isBatchingInteractiveUpdates = false;
  try {
    return fn();
  } finally {
    expirationContext = previousExpirationContext;
    isBatchingInteractiveUpdates = previousIsBatchingInteractiveUpdates;
  }
}

// 这里的fn通常是setState函数，syncUpdates会将expirationContext设置为sync，然后调用setState
function syncUpdates<A, B, C0, D, R>(
  fn: (A, B, C0, D) => R,
  a: A,
  b: B,
  c: C0,
  d: D,
): R {
  const previousExpirationContext = expirationContext;
  expirationContext = Sync;
  try {
    return fn(a, b, c, d);
  } finally {
    expirationContext = previousExpirationContext;
  }
}

// TODO: Everything below this is written as if it has been lifted to the
// renderers. I'll do this in a follow-up.

// Linked-list of roots
let firstScheduledRoot: FiberRoot | null = null;
let lastScheduledRoot: FiberRoot | null = null;

let callbackExpirationTime: ExpirationTime = NoWork;
let callbackID: *;
let isRendering: boolean = false;
let nextFlushedRoot: FiberRoot | null = null;
let nextFlushedExpirationTime: ExpirationTime = NoWork;
let lowestPriorityPendingInteractiveExpirationTime: ExpirationTime = NoWork;
let hasUnhandledError: boolean = false;
let unhandledError: mixed | null = null;

let isBatchingUpdates: boolean = false;
let isUnbatchingUpdates: boolean = false;
let isBatchingInteractiveUpdates: boolean = false;

let completedBatches: Array<Batch> | null = null;

let originalStartTimeMs: number = now();
let currentRendererTime: ExpirationTime = msToExpirationTime(
  originalStartTimeMs,
);
let currentSchedulerTime: ExpirationTime = currentRendererTime;

// Use these to prevent an infinite loop of nested updates
const NESTED_UPDATE_LIMIT = 50;
let nestedUpdateCount: number = 0;
let lastCommittedRootDuringThisBatch: FiberRoot | null = null;

// now在不同的渲染环境下不同，
// 在react-dom\src\client\ReactDOMHostConfig.js中可见now为unstable_now
function recomputeCurrentRendererTime() {
  // 当前时间为当前document已经存在的时长-最初执行该js模块document存在的时长
  // 因此该当前时间表示为现在执行该函数到最初执行该js模块的时长
  const currentTimeMs = now() - originalStartTimeMs;
  // 将ms单位的当前时间转换成到期时间
  currentRendererTime = msToExpirationTime(currentTimeMs);
}

//异步进行root任务调度就是通过这个方法来做的，这里最主要的就是调用了scheduler的scheduleDeferredCallback方法
// 传入的的是回调函数performAsyncWork，以及一个包含timeout超时事件的对象
function scheduleCallbackWithExpirationTime(
  root: FiberRoot,
  expirationTime: ExpirationTime,
) {
  if (callbackExpirationTime !== NoWork) {
    // A callback is already scheduled. Check its expiration time (timeout).
    if (expirationTime < callbackExpirationTime) {
      // Existing callback has sufficient timeout. Exit.
      return;
    } else {
      if (callbackID !== null) {
        // Existing callback has insufficient timeout. Cancel and schedule a
        // new one.
        cancelDeferredCallback(callbackID);
      }
    }
    // The request callback timer is already running. Don't start a new one.
  } else {
    // 跳过，debug相关
    startRequestCallbackTimer();
  }

  callbackExpirationTime = expirationTime;// 记录本次异步调度的最高优先级的到期时间
  const currentMs = now() - originalStartTimeMs;// 计算从react应用启动到现在的绝对间隔时间
  const expirationTimeMs = expirationTimeToMs(expirationTime); // 将本次异步调度的最高优先级的到期时间换算成ms单位
  const timeout = expirationTimeMs - currentMs; // 计算出还剩余多少ms，本次异步调度中的更新队列中最高优先级任务就会过期，scheduler会根据这个时间来判断本次异步调度函数的是否过期
  callbackID = scheduleDeferredCallback(performAsyncWork, {timeout}); // 将本次异步调度函数以及对应的到期时间传递给scheduler，并获得一个callbackID，用于在有高优先级任务打断本次调度的时候从scheduler中删除这个调度函数
}

// For every call to renderRoot, one of onFatal, onComplete, onSuspend, and
// onYield is called upon exiting. We use these in lieu of returning a tuple.
// I've also chosen not to inline them into renderRoot because these will
// eventually be lifted into the renderer.
function onFatal(root) {
  root.finishedWork = null;
}

function onComplete(
  root: FiberRoot,
  finishedWork: Fiber,
  expirationTime: ExpirationTime,
) {
  // 在rnderRoot完成之后，会将expirationTime设置到root.pendingCommitExpirationTime
  root.pendingCommitExpirationTime = expirationTime;
  root.finishedWork = finishedWork;
}

function onSuspend(
  root: FiberRoot,
  finishedWork: Fiber,
  suspendedExpirationTime: ExpirationTime,
  rootExpirationTime: ExpirationTime,
  msUntilTimeout: number,
): void {
  root.expirationTime = rootExpirationTime;
  if (msUntilTimeout === 0 && !shouldYieldToRenderer()) {
    // Don't wait an additional tick. Commit the tree immediately.
    root.pendingCommitExpirationTime = suspendedExpirationTime;
    root.finishedWork = finishedWork;
  } else if (msUntilTimeout > 0) {
    // Wait `msUntilTimeout` milliseconds before committing.
    root.timeoutHandle = scheduleTimeout(
      onTimeout.bind(null, root, finishedWork, suspendedExpirationTime),
      msUntilTimeout,
    );
  }
}

function onYield(root) {
  root.finishedWork = null;
}

function onTimeout(root, finishedWork, suspendedExpirationTime) {
  // The root timed out. Commit it.
  root.pendingCommitExpirationTime = suspendedExpirationTime;
  root.finishedWork = finishedWork;
  // Read the current time before entering the commit phase. We can be
  // certain this won't cause tearing related to batching of event updates
  // because we're at the top of a timer event.
  recomputeCurrentRendererTime();
  currentSchedulerTime = currentRendererTime;
  flushRoot(root, suspendedExpirationTime);
}

function onCommit(root, expirationTime) {
  root.expirationTime = expirationTime;
  root.finishedWork = null;
}

//计算当前时间，
function requestCurrentTime() {
  // requestCurrentTime is called by the scheduler to compute an expiration
  // time.

  // Expiration times are computed by adding to the current time (the start
  // time). However, if two updates are scheduled within the same event, we
  // should treat their start times as simultaneous, even if the actual clock
  // time has advanced between the first and second call.
  //
  //  到期时间决定了更新是如何被分批处理的，react希望在同一个事件中所有的更新都是相同
  //  的到期时间
  // In other words, because expiration times determine how updates are batched,
  // we want all updates of like priority that occur within the same event to
  // receive the same expiration time. Otherwise we get tearing.
  //  react会跟踪两个时间，渲染器的时间以及调度器的时间
  //  任何时候都可以更新渲染器的时间，其存在的原因是减少performance.now的调用次数
  // We keep track of two separate times: the current "renderer" time and the
  // current "scheduler" time. The renderer time can be updated whenever; it
  // only exists to minimize the calls performance.now.
  //  调度器的时间只有在没有任务挂起的时候被更新或者我们确切的知道不在事件触发的过程中
  // But the scheduler time can only be updated if there's no pending work, or
  // if we know for certain that we're not in the middle of an event.

  if (isRendering) {
    //如果正在render，则返回最近获取的时间
    //如果在render那么这个时候来的更新时间是最近获取的时间，这个时间已经到期了，因此会在当前render阶段执行，不会等到下轮更新执行？
    // 简单的说就是在当前render过程中产生的更新会在当前render阶段被执行
    // We're already rendering. Return the most recently read time.
    return currentSchedulerTime;
  }
  // Check if there's pending work.
  //  找到最高优先级root
  findHighestPriorityRoot();
  if (
    nextFlushedExpirationTime === NoWork ||
    nextFlushedExpirationTime === Never
  ) {
    //  nextFlushedExpirationTime === NoWork表示没有任务挂起等待执行，则重新计算当前时间。
    //  即当前到最初执行该react-dom的时长
    // If there's no pending work, or if the pending work is offscreen, we can
    // read the current time without risk of tearing.
    recomputeCurrentRendererTime();
    currentSchedulerTime = currentRendererTime;
    return currentSchedulerTime;
  }
  // There's already pending work. We might be in the middle of a browser
  // event. If we were to read the current time, it could cause multiple updates
  // within the same event to receive different expiration times, leading to
  // tearing. Return the last read time. During the next idle callback, the
  // time will be updated.
  //  如果有任务被挂起等待执行，说明浏览器处于事件触发期间，所以返回上一次获取的时间
  //  在调用idle回调函数的时候，会更新这个时间。
  return currentSchedulerTime;
}

// requestWork is called by the scheduler whenever a root receives an update.
// It's up to the renderer to call renderRoot at some point in the future.
function requestWork(root: FiberRoot, expirationTime: ExpirationTime) {
  addRootToSchedule(root, expirationTime);
  if (isRendering) {
    // Prevent reentrancy. Remaining work will be scheduled at the end of
    // the currently rendering batch.
    return;
  }

  if (isBatchingUpdates) {
    // Flush work at the end of the batch.
    if (isUnbatchingUpdates) {
      // ...unless we're inside unbatchedUpdates, in which case we should
      // flush it now.
      nextFlushedRoot = root;
      nextFlushedExpirationTime = Sync;
      performWorkOnRoot(root, Sync, false);
    }
    return;
  }

  // TODO: Get rid of Sync and use current time?
  if (expirationTime === Sync) {
    performSyncWork();
  } else {
    scheduleCallbackWithExpirationTime(root, expirationTime);
  }
}

/**
 * 将传入的到期时间设置到root.expirationTime上，然后将root添加到双向循环链表上。
 * 所有经过调度的root会被组织成双向循环链表，firstScheduledRoot与lastScheduledRoot分别指向第一个和最后一个root，
 * root.nextScheduledRoot指向下一个被调度过的root，lastScheduledRoot指向的root的nextScheduledRoot指向链表的第一个root
 * @param {*} root 
 * @param {*} expirationTime 
 */
function addRootToSchedule(root: FiberRoot, expirationTime: ExpirationTime) {
  // Add the root to the schedule.
  // Check if this root is already part of the schedule.
  if (root.nextScheduledRoot === null) {
    // This root is not already scheduled. Add it.
    root.expirationTime = expirationTime;
    if (lastScheduledRoot === null) {
      firstScheduledRoot = lastScheduledRoot = root;
      root.nextScheduledRoot = root;
    } else {
      lastScheduledRoot.nextScheduledRoot = root;
      lastScheduledRoot = root;
      lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
    }
  } else {
    // This root is already scheduled, but its priority may have increased.
    const remainingExpirationTime = root.expirationTime;
    if (expirationTime > remainingExpirationTime) {
      // Update the priority.
      root.expirationTime = expirationTime;
    }
  }
}

//获取调度队列中最高优先级的root节点，同时从双向循环调度队列中删除优先级最低也就是没有任务需要执行的节点。
function findHighestPriorityRoot() {
  let highestPriorityWork = NoWork;
  let highestPriorityRoot = null;
  if (lastScheduledRoot !== null) {
    //lastScheduledRoot说明存在调度队列，是需要对队列进行重新判断，重新调度的
    let previousScheduledRoot = lastScheduledRoot;
    let root = firstScheduledRoot;
    while (root !== null) {
      const remainingExpirationTime = root.expirationTime;
      if (remainingExpirationTime === NoWork) {
        // This root no longer has work. Remove it from the scheduler.
        // 该root已经没有任务需要执行，因此需要将其从调度器中删除，也就是双向循环链表中删除
        // TODO: This check is redudant, but Flow is confused by the branch
        // below where we set lastScheduledRoot to null, even though we break
        // from the loop right after.
        invariant(
          previousScheduledRoot !== null && lastScheduledRoot !== null,
          'Should have a previous and last root. This error is likely ' +
            'caused by a bug in React. Please file an issue.',
        );
        if (root === root.nextScheduledRoot) {
          // This is the only root in the list.
          //  如果循环双向链表只有一个节点root，则将链表以及节点清空为null
          root.nextScheduledRoot = null;
          firstScheduledRoot = lastScheduledRoot = null;
          break;
        } else if (root === firstScheduledRoot) {
          // This is the first root in the list.
          // 将双向循环链表中删除第一个节点。
          const next = root.nextScheduledRoot;
          firstScheduledRoot = next;
          lastScheduledRoot.nextScheduledRoot = next;
          root.nextScheduledRoot = null;
        } else if (root === lastScheduledRoot) {
          // This is the last root in the list.
          // 确保lastScheduledRoot以及lastScheduledRoot.nextScheduledRoot与之前一样
          //  并将root.nextScheduledRoot = null
          lastScheduledRoot = previousScheduledRoot;
          lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
          root.nextScheduledRoot = null;
          break;
        } else {
          //如果root是中间的节点，则将first到root的所有节点从链表中断开。
          previousScheduledRoot.nextScheduledRoot = root.nextScheduledRoot;
          root.nextScheduledRoot = null;
        }
        //最后更改root为previousScheduledRoot.nextScheduledRoot，继续while循环
        root = previousScheduledRoot.nextScheduledRoot;
      } else {
        //如果该root还存在任务需要执行
        if (remainingExpirationTime > highestPriorityWork) {
          // Update the priority, if it's higher
          // 存在更高优先级，则更新highestPriorityWork为最高优先级对应的过期时间
          //  更新最高优先级的root
          highestPriorityWork = remainingExpirationTime;
          highestPriorityRoot = root;
        }
        if (root === lastScheduledRoot) {
          //如果root优先级不是最低，并且是链表最后一个节点，除了上一个if的更新之外，此处会退出循环，
          break;
        }
        if (highestPriorityWork === Sync) {
          // Sync is highest priority by definition so
          // we can stop searching.
          //  同步是最高优先级，直接退出循环
          break;
        }
        // 如果不是最低优先级，并且不是是链表最后一个节点，或者不是同步这种最高优先级，
        // 则将root保存到previousScheduledRoot，
        // 并且更新root为root的下一个节点。
        previousScheduledRoot = root;
        root = root.nextScheduledRoot;
      }
    }
  }
  //将获取到的最高优先级root(一个fiber节点)以及最高优先级work（一个到期时间）
    // 分别保存到nextFlushedRoot以及nextFlushedExpirationTime。
  nextFlushedRoot = highestPriorityRoot;
  nextFlushedExpirationTime = highestPriorityWork;
}

// TODO: This wrapper exists because many of the older tests (the ones that use
// flushDeferredPri) rely on the number of times `shouldYield` is called. We
// should get rid of it.
// didYield表示当前animation frame 是否有空闲时间，true表示有空闲时间，false表示没有空余时间
let didYield: boolean = false;
// 返回false表示scheduler返回的异步任务的过期了，需要立即执行，而不是将js线程yield给(让给)浏览器renderer。
function shouldYieldToRenderer() {
  if (didYield) {
    return true;
  }
  if (shouldYield()) {
    didYield = true;
    return true;
  }
  return false;
}

// performAsyncWork 异步方式
function performAsyncWork() {
  try {
    if (!shouldYieldToRenderer()) {
      // 过期的任务需要立即执行
      // The callback timed out. That means at least one update has expired.
      // Iterate through the root schedule. If they contain expired work, set
      // the next render expiration time to the current time. This has the effect
      // of flushing all expired work in a single batch, instead of flushing each
      // level one at a time.
      if (firstScheduledRoot !== null) {
        // 计算出当前调度的异步任务的时间，这个时间保存在currentRendererTime变量中，表示现在执行该函数到最初执行该js模块的时长
        recomputeCurrentRendererTime();
        let root: FiberRoot = firstScheduledRoot;
        do {
          // 判断root双向链表中每个root的更新任务是否到期，如果到期，则将当前时间设置为root的nextExpirationTimeToWorkOn
          // 该时间决定哪些节点的更新要在当前周期中被执行
          didExpireAtExpirationTime(root, currentRendererTime);
          // The root schedule is circular, so this is never null.
          root = (root.nextScheduledRoot: any);
        } while (root !== firstScheduledRoot);
      }
    }
    // 无论什么情况都会执行performWork
    performWork(NoWork, true);
  } finally {
    didYield = false;
  }
}

// performSyncWork 同步方式
// 直接执行performWork
function performSyncWork() {
  performWork(Sync, false);
}

//performWork通过两种方式调用:performAsyncWork异步方式,performSyncWork 同步方式
//performWork 首先要通过findHighestPriorityRoot找到下一个需要操作的root，会设置两个全局变量
//传入的参数isYieldy：true表示是异步的，false表示是同步的。
function performWork(minExpirationTime: ExpirationTime, isYieldy: boolean) {
  // Keep working on roots until there's no more work, or until there's a higher
  // priority event.
    //在一个页面调用多次ReactDOM.render的时候会存在多个root，这些root会被编成一个双向循环队列
    // 获取调度队列中最高优先级的root节点，同时从双向循环调度队列中删除没有任务需要执行的节点。
  findHighestPriorityRoot();

  //isYieldy为true表示异步的performwork，可以被中断
  // 循环执行root链表中优先级最高的root的更新任务，直到所有的具有更新任务root的最高优先级任务没有过期或者时间片没有空余时间
  // 执行某个root更新任务的函数为performWorkOnRoot
  if (isYieldy) {
    // 重新计算当前渲染的时间，保存在currentRendererTime中，然后将currentRendererTime赋值给currentSchedulerTime
    recomputeCurrentRendererTime();
    currentSchedulerTime = currentRendererTime;

    // 开发环境下，跳过
    if (enableUserTimingAPI) {
      const didExpire = nextFlushedExpirationTime > currentRendererTime;
      const timeout = expirationTimeToMs(nextFlushedExpirationTime);
      stopRequestCallbackTimer(didExpire, timeout);
    }

    //循环停止的条件是：所有root都perform完成，或者没有空闲时间并且下一个任务没有过期。
    while (
      // 有需要更新任务的root
      nextFlushedRoot !== null &&
      nextFlushedExpirationTime !== NoWork &&
      // 可以被中断的异步更新任务在这里处理，因为传入的minExpirationTime为NoWork，为0
      minExpirationTime <= nextFlushedExpirationTime &&
      // 当前的时间片有空闲时间即didYield为false，或者该root已经过期了，即nextFlushedExpirationTime大于等于currentRendererTime
      !(didYield && currentRendererTime > nextFlushedExpirationTime)
    ) {
      //  下一个需要执行任务的root存在，并且其过期时间不是NoWork（说明当前节点有任务需要执行）
      //  同时下一个需要执行任务的root的到期时间（优先级）大于（高于）传入的到期时间（优先级），
      //  另外!(didYield && currentRendererTime > nextFlushedExpirationTime)表示有空闲时间或者下一个节点的任务已经过期
      //  上述三个条件满足则继续while循环，执行performWorkOnRoot。
        // currentRendererTime > nextFlushedExpirationTime表示当前渲染时间大于下一个节点的任务的到期时间，说明下一个节点的任务还没有过期了
        // didYield表示当前animation frame 是否有空闲时间，true表示有空闲时间，false表示没有空余时间
      performWorkOnRoot(
        nextFlushedRoot,
        nextFlushedExpirationTime,
        currentRendererTime > nextFlushedExpirationTime,//为true表示还没有过期，说明是异步的。即performWorkOnRoot(root,expirationTime,isYieldy)中isYieldy为true
      );
      // 由于通过performWorkOnRoot的调度之后会执行一些生命周期函数，导致root上的更新任务由变化，即最高的优先级会变化
      // 因此需要调用findHighestPriorityRoot来更新nextFlushedExpirationTime
      // 在root存在新的更新任务之后，自然就需要重新获取当前渲染时间，在while中通过比较优先级最高的到期时间与当前时间来判断是否过期，也就是是否需要再次调用performWorkOnRoot来执行更新任务
      findHighestPriorityRoot();
      recomputeCurrentRendererTime();
      currentSchedulerTime = currentRendererTime;
    }
  } else {
    // isYieldy为false表示是同步的，不可以被中断
    // 这里不需要判断任务过期，因为是一个同步的任务，无法被打断，在同步更新任务执行完的过程中，有可能会产生异步的更新，因此后续会将异步的更新推入调度器中
    while (
      // 有需要更新任务的root，不需要判断任务是否过期
      nextFlushedRoot !== null &&
      nextFlushedExpirationTime !== NoWork &&
      // 不可被中断的同步调度任务，因为传入的minExpirationTime为Sync，为最大number值。
      // 下面的判断在同步的情况下会成立的原因是，对于最高优先级的同步任务的过期时间会是Sync，因此下面判断成立只能是相等
      minExpirationTime <= nextFlushedExpirationTime
    ) {
      // 开始调度渲染，并且标记了这个root上的任务不可以被中断
      performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, false);
      findHighestPriorityRoot();
    }
  }

  // We're done flushing work. Either we ran out of time in this callback,
  // or there's no more work left with sufficient priority.
  // 执行完更新任务之后，有可能时间片没有空闲或者没有足够优先级的任务需要处理了。

  // If we're inside a callback, set this to false since we just completed it.
  //  如果是异步的，则将异步任务调度的callbackID设置为null
  if (isYieldy) {
    callbackExpirationTime = NoWork;
    callbackID = null;
  }
  // If there's work left over, schedule a new callback.
  // 通过上述的while循环执行完同步的更新任务以及过期的异步更新任务之后，可能还会存在一些没有过期的异步任务，因此需要将这些任务存到新的一轮调度中。
  // nextFlushedExpirationTime会在requestWork以及findHighestPriorityRoot以及flushRoot的时候会被赋值
  if (nextFlushedExpirationTime !== NoWork) {
    //scheduleCallbackWithExpirationTime为scheduler中的unstable-scheduleCallback
    scheduleCallbackWithExpirationTime(
      ((nextFlushedRoot: any): FiberRoot),
      nextFlushedExpirationTime,
    );
  }

  // Clean-up.
  finishRendering();
}

function flushRoot(root: FiberRoot, expirationTime: ExpirationTime) {
  invariant(
    !isRendering,
    'work.commit(): Cannot commit while already rendering. This likely ' +
      'means you attempted to commit from inside a lifecycle method.',
  );
  // Perform work on root as if the given expiration time is the current time.
  // This has the effect of synchronously flushing all work up to and
  // including the given time.
  nextFlushedRoot = root;
  nextFlushedExpirationTime = expirationTime;
  performWorkOnRoot(root, expirationTime, false);
  // Flush any sync work that was scheduled by lifecycles
  performSyncWork();
}

function finishRendering() {
  nestedUpdateCount = 0;
  lastCommittedRootDuringThisBatch = null;

  if (completedBatches !== null) {
    const batches = completedBatches;
    completedBatches = null;
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      try {
        batch._onComplete();
      } catch (error) {
        if (!hasUnhandledError) {
          hasUnhandledError = true;
          unhandledError = error;
        }
      }
    }
  }

  if (hasUnhandledError) {
    const error = unhandledError;
    unhandledError = null;
    hasUnhandledError = false;
    throw error;
  }
}

function performWorkOnRoot(
  root: FiberRoot,
  expirationTime: ExpirationTime,
  isYieldy: boolean,
) {
  invariant(
    !isRendering,
    'performWorkOnRoot was called recursively. This error is likely caused ' +
      'by a bug in React. Please file an issue.',
  );
  //处于正在渲染的标记，由渲染阶段和提交阶段构成，这期间会经历挂载或者更新或者卸载的生命周期
  isRendering = true;

  // Check if this is async work or sync/expired work.
  if (!isYieldy) {
    // Flush work without yielding.
    // TODO: Non-yieldy work does not necessarily imply expired work. A renderer
    // may want to perform some work without yielding, but also without
    // requiring the root to complete (by triggering placeholders).
    // 该root上的任务是同步的，不允许被中断
    // root.finishedWork：已经完成的任务的FiberRoot对象，如果你只有一个Root，那他永远只可能是这个Root对应的Fiber，或者是null，在commit阶段只会处理这个值对应的任务
    let finishedWork = root.finishedWork;
    if (finishedWork !== null) {
      // This root is already complete. We can commit it.
      //  如果该root上的finishedWork不是null，说明该root的任务已经完成了，可以直接commit这个root
      completeRoot(root, finishedWork, expirationTime);
    } else {
      //如果等于null，确保root.finishedWork = null;
      root.finishedWork = null;
      // If this root previously suspended, clear its existing timeout, since
      // we're about to try rendering again.
      //  如果这个root之前被挂起了，清除现有的timout标记，因为将会再次尝试渲染。
      // ❓❓❓
      const timeoutHandle = root.timeoutHandle;
      if (timeoutHandle !== noTimeout) {
        root.timeoutHandle = noTimeout;
        // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
        cancelTimeout(timeoutHandle);
      }
      //再次渲染
      renderRoot(root, isYieldy);
      //判断是否完成，如果渲染阶段该节点任务完成了，进入提交阶段
      finishedWork = root.finishedWork;
      if (finishedWork !== null) {
        // We've completed the root. Commit it.
        completeRoot(root, finishedWork, expirationTime);
      }
    }
  } else {
    // Flush async work.
    let finishedWork = root.finishedWork;
    if (finishedWork !== null) {
      // This root is already complete. We can commit it.
      completeRoot(root, finishedWork, expirationTime);
    } else {
      //该root为异步任务
      //与上面if的逻辑基本一致，不同的是在任务完成之后，需要判断animation frame是否还有空闲时间，
        // 如果还有就提交，没有就中断，并标记这个root已经完成了任务，等下一次animation frame提交。
      root.finishedWork = null;
      // If this root previously suspended, clear its existing timeout, since
      // we're about to try rendering again.
      const timeoutHandle = root.timeoutHandle;
      if (timeoutHandle !== noTimeout) {
        root.timeoutHandle = noTimeout;
        // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
        cancelTimeout(timeoutHandle);
      }
      renderRoot(root, isYieldy);
      finishedWork = root.finishedWork;
      if (finishedWork !== null) {
        // We've completed the root. Check the if we should yield one more time
        // before committing.
        if (!shouldYieldToRenderer()) {
          // Still time left. Commit the root.
          completeRoot(root, finishedWork, expirationTime);
        } else {
          // There's no time left. Mark this root as complete. We'll come
          // back and commit it later.
          root.finishedWork = finishedWork;
        }
      }
    }
  }

  isRendering = false;
}

function completeRoot(
  root: FiberRoot,
  finishedWork: Fiber,
  expirationTime: ExpirationTime,
): void {
  // Check if there's a batch that matches this expiration time.
  const firstBatch = root.firstBatch;
  if (firstBatch !== null && firstBatch._expirationTime >= expirationTime) {
    if (completedBatches === null) {
      completedBatches = [firstBatch];
    } else {
      completedBatches.push(firstBatch);
    }
    if (firstBatch._defer) {
      // This root is blocked from committing by a batch. Unschedule it until
      // we receive another update.
      root.finishedWork = finishedWork;
      root.expirationTime = NoWork;
      return;
    }
  }

  // 提交root之前将其设置为null
  // Commit the root.
  root.finishedWork = null;

  // Check if this is a nested update (a sync update scheduled during the
  // commit phase).
  // 判断是否是级联的更新
  if (root === lastCommittedRootDuringThisBatch) {
    // If the next root is the same as the previous root, this is a nested
    // update. To prevent an infinite loop, increment the nested update count.
    nestedUpdateCount++;
  } else {
    // Reset whenever we switch roots.
    lastCommittedRootDuringThisBatch = root;
    nestedUpdateCount = 0;
  }
  // 开始进入提交阶段，不允许被打断
  commitRoot(root, finishedWork);
}

function onUncaughtError(error: mixed) {
  invariant(
    nextFlushedRoot !== null,
    'Should be working on a root. This error is likely caused by a bug in ' +
      'React. Please file an issue.',
  );
  // Unschedule this root so we don't work on it again until there's
  // another update.
  nextFlushedRoot.expirationTime = NoWork;
  if (!hasUnhandledError) {
    hasUnhandledError = true;
    unhandledError = error;
  }
}

// TODO: Batching should be implemented at the renderer level, not inside
// the reconciler.
function batchedUpdates<A, R>(fn: (a: A) => R, a: A): R {
  const previousIsBatchingUpdates = isBatchingUpdates;
  isBatchingUpdates = true;
  try {
    return fn(a);
  } finally {
    isBatchingUpdates = previousIsBatchingUpdates;
    if (!isBatchingUpdates && !isRendering) {
      performSyncWork();
    }
  }
}

// TODO: Batching should be implemented at the renderer level, not inside
// the reconciler.
//isBatchingUpdates: 正在批处理更新任务
//isUnbatchingUpdates: 正在解除批处理更新任务
function unbatchedUpdates<A, R>(fn: (a: A) => R, a: A): R {
  if (isBatchingUpdates && !isUnbatchingUpdates) {
    isUnbatchingUpdates = true;
    try {
      return fn(a);
    } finally {
      isUnbatchingUpdates = false;
    }
  }
  return fn(a);
}

// TODO: Batching should be implemented at the renderer level, not within
// the reconciler.
function flushSync<A, R>(fn: (a: A) => R, a: A): R {
  invariant(
    !isRendering,
    'flushSync was called from inside a lifecycle method. It cannot be ' +
      'called when React is already rendering.',
  );
  const previousIsBatchingUpdates = isBatchingUpdates;
  isBatchingUpdates = true;
  try {
    return syncUpdates(fn, a);
  } finally {
    isBatchingUpdates = previousIsBatchingUpdates;
    performSyncWork();
  }
}

function interactiveUpdates<A, B, R>(fn: (A, B) => R, a: A, b: B): R {
  if (isBatchingInteractiveUpdates) {
    return fn(a, b);
  }
  // If there are any pending interactive updates, synchronously flush them.
  // This needs to happen before we read any handlers, because the effect of
  // the previous event may influence which handlers are called during
  // this event.
  if (
    !isBatchingUpdates && // 批量更新，比如事件触发多次的批处理
    !isRendering && // 不处于performWorkOnRoot函数执行过程中，renderRoot与提交阶段结束之后performWorkOnRoot结束执行
    lowestPriorityPendingInteractiveExpirationTime !== NoWork // 有挂起的交互事件
  ) {
    // Synchronously flush pending interactive updates.
    performWork(lowestPriorityPendingInteractiveExpirationTime, false);
    lowestPriorityPendingInteractiveExpirationTime = NoWork;
  }
  const previousIsBatchingInteractiveUpdates = isBatchingInteractiveUpdates;
  const previousIsBatchingUpdates = isBatchingUpdates;
  isBatchingInteractiveUpdates = true;
  isBatchingUpdates = true;
  try {
    return fn(a, b);
  } finally {
    isBatchingInteractiveUpdates = previousIsBatchingInteractiveUpdates;
    isBatchingUpdates = previousIsBatchingUpdates;
    if (!isBatchingUpdates && !isRendering) {
      performSyncWork();
    }
  }
}

function flushInteractiveUpdates() {
  if (
    !isRendering &&
    lowestPriorityPendingInteractiveExpirationTime !== NoWork
  ) {
    // Synchronously flush pending interactive updates.
    performWork(lowestPriorityPendingInteractiveExpirationTime, false);
    lowestPriorityPendingInteractiveExpirationTime = NoWork;
  }
}

function flushControlled(fn: () => mixed): void {
  const previousIsBatchingUpdates = isBatchingUpdates;
  isBatchingUpdates = true;
  try {
    syncUpdates(fn);
  } finally {
    isBatchingUpdates = previousIsBatchingUpdates;
    if (!isBatchingUpdates && !isRendering) {
      performSyncWork();
    }
  }
}

export {
  requestCurrentTime,
  computeExpirationForFiber,
  captureCommitPhaseError,
  onUncaughtError,
  renderDidSuspend,
  renderDidError,
  retrySuspendedRoot,
  markLegacyErrorBoundaryAsFailed,
  isAlreadyFailedLegacyErrorBoundary,
  scheduleWork,
  requestWork,
  flushRoot,
  batchedUpdates,
  unbatchedUpdates,
  flushSync,
  flushControlled,
  deferredUpdates,
  syncUpdates,
  interactiveUpdates,
  flushInteractiveUpdates,
  computeUniqueAsyncExpiration,
  flushPassiveEffects,
};
