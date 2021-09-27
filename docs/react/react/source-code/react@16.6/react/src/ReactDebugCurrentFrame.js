/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
//生产模式ReactDebugCurrentFrame={}
//开发环境ReactDebugCurrentFrame=｛getCurrentStack:null | (() => string),getStackAddendum:() => string｝

import type {ReactElement} from 'shared/ReactElementType';

import describeComponentFrame from 'shared/describeComponentFrame';
import getComponentName from 'shared/getComponentName';

const ReactDebugCurrentFrame = {};

let currentlyValidatingElement = (null: null | ReactElement);

export function setCurrentlyValidatingElement(element: null | ReactElement) {
  if (__DEV__) {
      //开发模式下将currentlyValidatingElement设置为传入的ReactElement类型的元素
    currentlyValidatingElement = element;
  }
}

if (__DEV__) {
  // Stack implementation injected by the current renderer.
  ReactDebugCurrentFrame.getCurrentStack = (null: null | (() => string));

  ReactDebugCurrentFrame.getStackAddendum = function(): string {
    let stack = '';

    // Add an extra top frame while an element is being validated
    if (currentlyValidatingElement) {
      const name = getComponentName(currentlyValidatingElement.type);
      const owner = currentlyValidatingElement._owner;
      stack += describeComponentFrame(
        name,//组件的名字
        currentlyValidatingElement._source,//包含组件信息（组件路径，错误发生的行数）的对象
        owner && getComponentName(owner.type),//组件的父组件名字
      );
    }

    // Delegate to the injected renderer-specific implementation
    const impl = ReactDebugCurrentFrame.getCurrentStack;
    if (impl) {
      stack += impl() || '';
    }
    //返回组件的一些信息，错误发生在哪个文件的第几行
    return stack;
  };
}

export default ReactDebugCurrentFrame;
