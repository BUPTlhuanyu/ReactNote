/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

type ValueTracker = {
  getValue(): string,
  setValue(value: string): void,
  stopTracking(): void,
};
type WrapperState = {_valueTracker?: ?ValueTracker};
type ElementWithValueTracker = HTMLInputElement & WrapperState;

function isCheckable(elem: HTMLInputElement) {
  const type = elem.type;
  const nodeName = elem.nodeName;
  return (
    nodeName &&
    nodeName.toLowerCase() === 'input' &&
    (type === 'checkbox' || type === 'radio')
  );
}

function getTracker(node: ElementWithValueTracker) {
  return node._valueTracker;
}

function detachTracker(node: ElementWithValueTracker) {
  node._valueTracker = null;
}

function getValueFromNode(node: HTMLInputElement): string {
  let value = '';
  if (!node) {
    return value;
  }

  if (isCheckable(node)) {
    value = node.checked ? 'true' : 'false';
  } else {
    value = node.value;
  }

  return value;
}

// 注意 input 节点的 dom 的引用对象上本省是不存在 value 这个属性的，但是这对象能通过原型链搜索到 node.constructor.prototype 上的 value
// 这个函数的作用就是将 value 直接注入到 node 对象上，因此你可以使用 ref.current.value 或者 event.target.value 来修改或者访问 value
function trackValueOnNode(node: any): ?ValueTracker {
  const valueField = isCheckable(node) ? 'checked' : 'value';
  const descriptor = Object.getOwnPropertyDescriptor(
    node.constructor.prototype,
    valueField,
  );

  let currentValue = '' + node[valueField];

  // if someone has already defined a value or Safari, then bail
  // and don't track value will cause over reporting of changes,
  // but it's better then a hard failure
  // (needed for certain tests that spyOn input values and Safari)
  if (
    node.hasOwnProperty(valueField) ||
    typeof descriptor === 'undefined' ||
    typeof descriptor.get !== 'function' ||
    typeof descriptor.set !== 'function'
  ) {
    return;
  }
  const {get, set} = descriptor;
  Object.defineProperty(node, valueField, {
    configurable: true,
    get: function() {
      return get.call(this);
    },
    set: function(value) {
      currentValue = '' + value;
      set.call(this, value);
    },
  });
  // We could've passed this the first time
  // but it triggers a bug in IE11 and Edge 14/15.
  // Calling defineProperty() again should be equivalent.
  // https://github.com/facebook/react/issues/11768
  Object.defineProperty(node, valueField, {
    enumerable: descriptor.enumerable,
  });

  const tracker = {
    getValue() {
      return currentValue;
    },
    setValue(value) {
      currentValue = '' + value;
    },
    stopTracking() {
      detachTracker(node);
      delete node[valueField];
    },
  };
  return tracker;
}

export function track(node: ElementWithValueTracker) {
  if (getTracker(node)) {
    return;
  }

  // TODO: Once it's just Fiber we can move this to node._wrapperState
  node._valueTracker = trackValueOnNode(node);
}

export function updateValueIfChanged(node: ElementWithValueTracker) {
  if (!node) {
    return false;
  }

  const tracker = getTracker(node);
  // if there is no tracker at this point it's unlikely
  // that trying again will succeed
  if (!tracker) {
    return true;
  }

  const lastValue = tracker.getValue();
  const nextValue = getValueFromNode(node);
  if (nextValue !== lastValue) {
    tracker.setValue(nextValue);
    return true;
  }
  return false;
}

export function stopTracking(node: ElementWithValueTracker) {
  const tracker = getTracker(node);
  if (tracker) {
    tracker.stopTracking();
  }
}
