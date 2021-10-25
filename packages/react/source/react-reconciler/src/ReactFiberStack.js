/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
//维护两个栈：valueStack  fiberStack

import type {Fiber} from './ReactFiber';

import warningWithoutStack from 'shared/warningWithoutStack';

export type StackCursor<T> = {
  current: T,
};

// 用于存储 value 的栈
const valueStack: Array<any> = [];

// 用于存储 fiber 的栈
let fiberStack: Array<Fiber | null>;

if (__DEV__) {
  fiberStack = [];
}
//index用于指示栈中元素的数量
let index = -1;

// 创建一个指针，该指针的 current 指向当前的值
function createCursor<T>(defaultValue: T): StackCursor<T> {
  return {
    current: defaultValue,
  };
}
//判断栈是否为空
function isEmpty(): boolean {
  return index === -1;
}
//将valueStack栈顶的值弹出到cursor.current
//开发环境下如果fiberStack栈顶的fiber与需要pop出来的fiber不同，则报错。否则弹出。
//index--
function pop<T>(cursor: StackCursor<T>, fiber: Fiber): void {
  if (index < 0) {
    if (__DEV__) {
      warningWithoutStack(false, 'Unexpected pop.');
    }
    return;
  }

  if (__DEV__) {
    if (fiber !== fiberStack[index]) {
      warningWithoutStack(false, 'Unexpected Fiber popped.');
    }
  }

  cursor.current = valueStack[index];

  valueStack[index] = null;

  if (__DEV__) {
    fiberStack[index] = null;
  }

  index--;
}
//增加index
//将cursor.current的值push到valueStack中
//开发环境下将传入的fiber push到fiberStack
//传入的value赋值给cursor.current
function push<T>(cursor: StackCursor<T>, value: T, fiber: Fiber): void {
  index++;

  valueStack[index] = cursor.current;

  if (__DEV__) {
    fiberStack[index] = fiber;
  }

  cursor.current = value;
}

// 开发环境下判断stack是否是空
function checkThatStackIsEmpty() {
  if (__DEV__) {
    if (index !== -1) {
      warningWithoutStack(
        false,
        'Expected an empty stack. Something was not reset properly.',
      );
    }
  }
}

// 开发环境下将valueStack与fiberStack置空
function resetStackAfterFatalErrorInDev() {
  if (__DEV__) {
    index = -1;
    valueStack.length = 0;
    fiberStack.length = 0;
  }
}

export {
  createCursor,
  isEmpty,
  pop,
  push,
  // DEV only:
  checkThatStackIsEmpty,
  resetStackAfterFatalErrorInDev,
};
