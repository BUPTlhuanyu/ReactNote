/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {LazyComponent, Thenable} from 'shared/ReactLazyComponent';

//LazyComponent的三个状态，number类型，分别为Pending = 0;Resolved = 1;Rejected = 2;
import {Resolved, Rejected, Pending} from 'shared/ReactLazyComponent';
import warning from 'shared/warning';

//传入参数：Component， baseProps
//浅复制baseProps为props，并将组件默认的defaultProps赋值给props中为undefined的属性上
export function resolveDefaultProps(Component: any, baseProps: Object): Object {
  if (Component && Component.defaultProps) {
    // Resolve default props. Taken from ReactElement
    const props = Object.assign({}, baseProps);
    const defaultProps = Component.defaultProps;
    for (let propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
    return props;
  }
  return baseProps;
}

//根据lazyComponent的状态返回定义的组件
//lazyComponent为经过React.lazy()返回的组件
//lazyComponent._status表示lazyComponent当前的状态
//lazyComponent._result根据lazyComponent当前的状态会得到不同的值：
// Rejected表示动态导入失败，_result为error
// Resolved表示动态导入成功,_result为动态import得到的组件
// Pending表示动态导入正在进行中，_result为一个promise
export function readLazyComponentType<T>(lazyComponent: LazyComponent<T>): T {
  const status = lazyComponent._status;
  const result = lazyComponent._result;
  switch (status) {
    case Resolved: {
      const Component: T = result;
      return Component;
    }
    case Rejected: {
      const error: mixed = result;
      throw error;
    }
    case Pending: {
      const thenable: Thenable<T, mixed> = result;
      throw thenable;
    }
    //在初始状态下status=-1
    default: {
      // 设置lazyComponent状态为正在获取动态导入组件
      lazyComponent._status = Pending;
      // lazyComponent._ctor表示获取lazyComponent动态导入逻辑函数，如() => import('./SomeComponent')
      const ctor = lazyComponent._ctor;
      // 执行动态导入逻辑函数，返回一个promise，thenable相当于import('./SomeComponent')
      const thenable = ctor();
      //异步获取
      thenable.then(
        //  moduleObject为resolve返回的值，一个组件
        moduleObject => {
          if (lazyComponent._status === Pending) {
            const defaultExport = moduleObject.default;
            if (__DEV__) {
              if (defaultExport === undefined) {
                warning(
                  false,
                  'lazy: Expected the result of a dynamic import() call. ' +
                    'Instead received: %s\n\nYour code should look like: \n  ' +
                    "const MyComponent = lazy(() => import('./MyComponent'))",
                  moduleObject,
                );
              }
            }
            lazyComponent._status = Resolved;
            lazyComponent._result = defaultExport;
          }
        },
        error => {
          if (lazyComponent._status === Pending) {
            lazyComponent._status = Rejected;
            lazyComponent._result = error;
          }
        },
      );
      //在异步返回之前lazyComponent._result = thenable是一个promise
      lazyComponent._result = thenable;
      throw thenable;
    }
  }
}
