/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Fiber} from './ReactFiber';

import ReactSharedInternals from 'shared/ReactSharedInternals';
import {
  IndeterminateComponent,
  FunctionComponent,
  ClassComponent,
  HostComponent,
  Mode,
  LazyComponent,
  SuspenseComponent,
} from 'shared/ReactWorkTags';
import describeComponentFrame from 'shared/describeComponentFrame';
import getComponentName from 'shared/getComponentName';

const ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

type LifeCyclePhase = 'render' | 'getChildContext';

//根据传入fiber的tag属性表示的组件类型，输出fiber对应组件所在位置以及log信息在文件中的位置。
function describeFiber(fiber: Fiber): string {
  switch (fiber.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case FunctionComponent:
    case ClassComponent:
    case HostComponent:
    case Mode:
    case SuspenseComponent:
      const owner = fiber._debugOwner;
      const source = fiber._debugSource;
      const name = getComponentName(fiber.type);
      let ownerName = null;
      if (owner) {
        ownerName = getComponentName(owner.type);
      }
      return describeComponentFrame(name, source, ownerName);
    default:
      return '';
  }
}

//传入的参数：workInProgress为当前正在处理的fiber对象
//workInProgress.return为workInProgress对应组件的父组件对应的fiber
//返回workInProgress以及其所有祖先fiber的信息
export function getStackByFiberInDevAndProd(workInProgress: Fiber): string {
  let info = '';
  let node = workInProgress;
  //从workInProgress开始向上遍历fiber树，并将每个祖先fiber的信息组合到info变量上，并返回该信息
  do {
    info += describeFiber(node);
    node = node.return;
  } while (node);
  return info;
}

export let current: Fiber | null = null;
export let phase: LifeCyclePhase | null = null;

// 🙋
//在开发环境下获取当前fiber._debugOwner的组件名
export function getCurrentFiberOwnerNameInDevOrNull(): string | null {
  if (__DEV__) {
    if (current === null) {
      return null;
    }
    const owner = current._debugOwner;
    if (owner !== null && typeof owner !== 'undefined') {
      return getComponentName(owner.type);
    }
  }
  return null;
}

//
export function getCurrentFiberStackInDev(): string {
  if (__DEV__) {
    if (current === null) {
      return '';
    }
    // Safe because if current fiber exists, we are reconciling,
    // and it is guaranteed to be the work-in-progress version.
    return getStackByFiberInDevAndProd(current);
  }
  return '';
}

export function resetCurrentFiber() {
  if (__DEV__) {
    ReactDebugCurrentFrame.getCurrentStack = null;
    current = null;
    phase = null;
  }
}

export function setCurrentFiber(fiber: Fiber) {
  if (__DEV__) {
    ReactDebugCurrentFrame.getCurrentStack = getCurrentFiberStackInDev;
    current = fiber;
    phase = null;
  }
}

export function setCurrentPhase(lifeCyclePhase: LifeCyclePhase | null) {
  if (__DEV__) {
    phase = lifeCyclePhase;
  }
}
