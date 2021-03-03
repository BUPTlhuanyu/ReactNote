[TOC]

​		本文会介绍`React` 对象中与组件相关的 `API` 的实现，以及各种类型的组件与`ReactElement`的关系。

# 故事的开始从一行代码说起

```javascript
import React from 'react';
```

我们从`react`这个包中获得了`React`这样一个对象，通过查看[React 顶层 API](https://react.docschina.org/docs/react-api.html)我们可以构建如下`React`对象：

```javascript
const React = {
	// 组件
  createRef,
  Component,
  PureComponent,
  createContext,
  forwardRef,
  lazy,
  memo,
  Fragment: REACT_FRAGMENT_TYPE,
  StrictMode: REACT_STRICT_MODE_TYPE,
  Suspense: REACT_SUSPENSE_TYPE,
  // ReactElement
  createElement: createElement,
  cloneElement: cloneElement,
  createFactory: createFactory,
  isValidElement: isValidElement,
  Children: {
    map,
    forEach,
    count,
    toArray,
    only,
  },
  // hooks
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useDebugValue,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState
};
```

## React 的编译时与运行时

我们首先介绍一下`React`的编译时与运行时。

```javascript
class App extends React.Component {
	render() {
    	return <ClassType />
    }
}
class ClassType extends React.Component {
	render() {
    	return <div>123</div>
    }
}
```

上面一段代码，在利用`babel`将`jsx`编译成`js`之前是无法直接在浏览器中执行的。在经过 `@babel/babel-transform-react-jsx`的编译之后会得到如下结果：

```javascript
class App extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement(ClassType, null);
  }
}
class ClassType extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", null, "123");
  }
}
```

## ReactElement与组件的关系

大家都知道组件分为类组件与函数组件，那么React 中到底有哪些组件呢？

- `React.Component` 的子类组件
- `React.PureComponent` 的子类组件
- 普通的函数组件
- `React.memo`高阶组件
- `React.Fragment` 组件
- `React.lazy`懒加载组件
- `React.forwardRef`组件
- `React.createContext().Provider`以及`React.createContext().Consumer`组件
- `React.Suspense`组件

从上面运行时代码可以看到`jsx`被编译成了`React.createElement`的调用形式。那么`ReactElement`与组件的关系到底是怎样的呢？先看下面的代码：

```javascript
React.createElement(ClassType, null);
```

可以看到`ClassType`这个类(类构造函数)被当作了`createElement`的第一个参数，而`createElement`则是专门用来生成`ReactElement`的函数。在上一篇文章中我们提到：`ReactElement.type`代表了【行为】，`ReactElement.$$typeof`代表了【组件类型】，并且`ReactElement.type`有如下值：

>在调用 `createElement` 创建 `ReactElement` 的时候，传入的第一个参数为 `type` 属性的值，如果是字符串比如`'div'`，则表示该`react`实例对应一个真实的`dom`；如果是一个函数，则表示一个函数/类组件；也可能是一个对象(`typeof  === 'object'`)，比如 `Context.Provider`，`Context.Consumer`，`React.lazy`，`React.forwardRef`，`React.memo`

那么我们可以做如下总结：你所写的组件的构造函数或者说函数都会被挂在`ReactElement.type`属性上，`React`可以在合适的时机通过它来执行特定的函数，从而表现出你想要的行为。

思考：什么时候会执行这些构造函数或者函数呢？这个后续文章会说明，等不及的可以先去图里找`updateClassComponent`函数(GitHub: https://github.com/BUPTlhuanyu/ReactNote  内附【20Mb】 React 原理图)。

## 类组件超类 React.Component 与React.PureComponent

趁热打铁，接着上边罗列出来的组件种类，先来说说类组件，`React.Component`如何实现，

```javascript
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
Component.prototype.isReactComponent = {};
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

`React.PureComponent`通过寄生组合式继承来实现：

```javascript
function ComponentDummy(){};
ComponentDummy.prototype = Component.prototype;
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
const pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent;
Object.assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;
```

此外还有一个地方需要注意，直接将超类`Component`的原型方法复制到了自己的原型对象上，较少查找次数：

```
Object.assign(pureComponentPrototype, Component.prototype);
```

### updater

在类组件的实例属性中有个`updater`有点奇怪，我们在写组件的时候，构造函数只传入了两个参数， `props`与`context`，第三个参数始终是`undefined`，这个地方需要注意了，组件处理`state`的逻辑是由`updater`提供的，React 内部在实例化组件之后，会立即给`updater`赋值为`constructClassInstance`，可以先去图里找`updateClassComponent`函数(GitHub: https://github.com/BUPTlhuanyu/ReactNote  内附【20Mb】 React 原理图)。

`updater` 对象如下：

```
const classComponentUpdater = {
  isMounted,
  enqueueSetState(inst, payload, callback) {},
  enqueueReplaceState(inst, payload, callback) {},
  enqueueForceUpdate(inst, callback) {},
};
```

三个方法的实现基本一致，都会先计算一个【到期时间】，然后生成一个 `update` 更新对象，接着将该对象添加到`fiber`上的`update`单向环形链表中（在`React`中，由于既保存了链表头节点又保存了尾节点，所以没有体现环形单链的优势。如果在只保存一个节点的条件下，显然保存环形链表的尾节点则可实现O(1)的队列），最后开始调度`fiber`树，进行新一轮的更新。



## 实现React自定义标签组件 Fragment,StrictMode,Fragment

这三个`API`的值都是`symbole`类型，都能够直接用做一个 React 标签组件。与原生标签`div`（`HostComponent`）类似，其对应的 `ReactElement.type`都是不是函数，`React` 会根据该值调用不同的方法来创建 `fiber`，比如:

```JavaScript
function createFiberFromFragment(){}
function createFiberFromMode
function createFiberFromSuspense
```

因此这里做好标记即可

```javascript
const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
const REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
const REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
const React = {
	// 组件
  Component,
  PureComponent,
  Fragment: REACT_FRAGMENT_TYPE,
  StrictMode: REACT_STRICT_MODE_TYPE,
  Suspense: REACT_SUSPENSE_TYPE,
  ...
};
```

## ReactElement.type 为对象

当你使用`React.forwardRef`,`React.memo`,`React.lazy`,`React.createContext`这四个高阶函数生成组件的时候，`ReactElement.type`为一个对象，必定包含`$$typeof`属性：

```javascript
// `React.forwardRef` 
return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render, // (props, ref) => React$Node
};
// `React.memo`
return {
    $$typeof: REACT_MEMO_TYPE,
    type,
    compare: compare === undefined ? null : compare, // (oldProps, newProps) => boolean
};
// `React.lazy`, e.g. React.lazy(() => import('path/to/Disc'))
return {
    $$typeof: REACT_LAZY_TYPE, //REACT_LAZY_TYPE组件类型
    _ctor: ctor, //动态加载逻辑
    // React uses these fields to store the result.
    _status: -1,
    _result: null,
};
// `React.createContext`
return const context = {
  $$typeof: REACT_CONTEXT_TYPE,
  Provider: {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context,
  },
  Consumer: context,
};
```

这样我们也可以定制一些自己需要的组件，除了在此处增加不同的`$$typeof`之外，还需增加对应的`createFiber`的方法。

> 注意：memo与forwardRef组合使用的时候，正确的方式为：memo(forwardRef(...))，因为forwardRef需要接收一个render函数，该render函数为(props, ref) => React$Node。

# 总结

​		本文介绍了，`React` 对象中与组件相关的 `API` 的实现，聊了各种组件种类与`ReactElement`的关系。下一篇将会介绍如何创建一个 `ReactElement`，以及 `Children` 各个方法的实现原理。