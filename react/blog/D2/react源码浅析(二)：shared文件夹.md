

[TOC]

> GitHub: https://github.com/BUPTlhuanyu/ReactNote  内附【20Mb】 React 原理图

# 目录结构

```
shared
————错误处理———
├─ invariant.js                 // 错误处理：格式化输出错误
├─ reactProdInvariant.js        // 错误处理：封装 invariant
├─ lowPriorityWarning.js        // 错误处理：封装 console.warn
├─ warningWithoutStack.js       // 错误处理：封装 console.error
├─ warning.js                   // 错误处理：输出发生错误的组件层级信息
├─ describeComponentFrame.js    // 错误处理：错误信息来源于babel-transform -react-jsx
├─ invokeGuardedCallbackImpl.js // 错误处理：收集 error
————ReactElement与fiber———
├─ ReactElementType.js          // ReactElement 通用属性类型定义
├─ ReactSymbols.js              // ReactElement $$typeof 属性定义
├─ ReactTypes.js                // 各种ReactElement类型（$$typeof）的属性定义
├─ ReactLazyComponent.js        // ReactLazyComponent 属性定义
├─ ReactPortal.js               // ReactPortal 属性定义
├─ isValidElementType.js        // 判断是否是一个ReactElement
├─ ReactInstanceMap.js          // 提供方法将ReactElement与其fiber关联起来
├─ ReactWorkTags.js             // Fiber.tag 属性值，表示该fiber的类型，即对应哪种react实例
├─ getComponentName.js          // 获取组件名称
————fiber的操作————
├─ getParent.js                 // 获取父fiber
├─ getParentInstance.js         // 同上，就是换了名字
├─ getLowestCommonAncestor.js   // 获取最低公共祖先
├─ isAncestor.js                // 判断A是否是B的祖宗
├─ traverseTwoPhase.js          // 模拟冒泡捕获
├─ traverseEnterLeave.js        // 模拟移除进入事件
————标记需要对fiber执行什么类型的操作————
├─ ReactSideEffectTags.js       // 熟悉的有 Replace，deletion
————比较————
├─ areHookInputsEqual.js        // 比较两数组是一样：比较hook传入的数组是否是一样的
├─ shallowEqual.js              // 浅比较：Object.is，hasOwnProperty
————其他，忽略————
└─ *
```

# 错误处理

​	在使用`react`的过程中，如果报错，经常会看到某个错误发生在哪个组件文件中，详细到组件文件的行数与列数，这些错误信息挂载在`react` 实例(`ReactElement`)的`_source`这样的属性上，错误信息是由`babel`生产的，原理是编译时`babel-transform -react-jsx`在将 `jsx`解析成`createElement`调用形式，而`createElement`接收到的第二个参数则包含了`_source`属性，`createElement`在后面章节会讲到，主要创建一个`react` 实例。`_source`如下：

<img src="https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D2/_source.png" alt="fiber1" />

​	还有一点需要注意，`invokeGuardedCallbackImpl.js`会收集用户外部函数的错误信息(`Error`实例)，在生产环境下主要由`try...catch`实现，在 `try`中会执行涉及用户传入函数(`user-provided function` )的函数，（比如`workLopp`，即用于循环协调组件的函数，在协调过程则会执行组件的生命周期钩子函数）。

```javascript
function invokeGuardedCallbackImpl(name,func,context,a,b,c,d,e,f) {
  const funcArgs = Array.prototype.slice.call(arguments, 3);
  try {
    func.apply(context, funcArgs);
  } catch (error) {
    this.onError(error);
  }
}  
```

在开发环境中，则模拟了一个 `try...catch`代码块，原理是替换掉 `window` 上的 `error` 事件监听函数，然后创建一个`DOM`，接着自定义一个事件并在创建的 `DOM` 上绑定事件处理函数，同步触发自定义事件，事件处理函数中执行包含`user-provided function`的代码，如果报错了，那么` error` 事件监听函数会执行，并收集错误。错误系统在`react`中是非常重要的一块，

```
function invokeGuardedCallbackImpl(name,func,context,a,b,c,d,e,f) {
      const evt = document.createEvent('Event');
      let didError = true;
      function callCallback() {
      	...
        func.apply(context, funcArgs);
        didError = false;
      }
      let error;
      let didSetError = false;
      let isCrossOriginError = false;
      function handleWindowError(event) {
				// 设置一下 error
      }
      const evtType = `react-${name ? name : 'invokeguardedcallback'}`;
      window.addEventListener('error', handleWindowError);
      fakeNode.addEventListener(evtType, callCallback, false);
      evt.initEvent(evtType, false, false);
      fakeNode.dispatchEvent(evt);
      if (didError) {
        if (!didSetError) {error = new Error('...');}
        else if (isCrossOriginError) {error = new Error('...');}
        this.onError(error);
      }
      window.removeEventListener('error', handleWindowError);
}
```

对于`react`的错误处理系统，这里暂时忽略，后续会等系列结束之后以一个附录补充，当然如果有好的文章，欢迎在评论贴出，目前先回到主线。



# 组件相关

> 在开始之前需要有一定的概念，JSX --> ReactElement --> Fiber --> 视图，react在将jsx生成对应的ReactElement之后会据此生成一个fiber，ReactElement上的生命周期钩子产生的更新修改的是这个fiber上的数据，因此可以看出fiber其实可以当成一个数据容器，保存了该fiber当前的状态，当某个时间点fiber的数据更新完成之后，react会将该fiber的数据渲染到视图上。从这里可以看到react中数据的分层结构，ReactElement是最贴近开发者这一层的，对外接受生命周期钩子。fiber则是react底层数据容器，fiber直接影响的dom则是页面用户侧。

## ReactElementType.js ##

只列出开发环境存在的属性，可以看到这里有一些非常熟悉的属性`key,ref,props`，`_owner`则是该组件标签所在的组件对应的ReactElement。下面简单介绍一下 `type` 属性以及`$$typeof`，后续专门介绍 `createElement`函数如何构建一个 `ReactElement` 。

```
export type ReactElement = {
  $$typeof: any, // 
  type: any, // 
  key: any,
  ref: any,
  props: any,
  _owner: any, // ReactInstance or ReactFiber
};
```

### type

> `type` 表示的是这个`ReactElement`的行为

在调用 `createElement` 创建 `ReactElement` 的时候，传入的第一个参数为 `type` 属性的值，如果是字符串比如`'div'`，则表示该`react`实例对应一个真实的`dom`；如果是一个函数，则表示一个函数/类组件；

```
function FnType() {
  return React.createElement(
  	"div", 
  	null, 
  	React.createElement(
  		Content, 
  		{
    		f: {
      		a: 1
    		}
  		}
  	),
  	React.createElement(
  		ClassType,
  		null
  	)
  );
}
```

也可能是一个对象(`typeof  === 'object'`)，比如 `Context.Provider`，`Context.Consumer`，`React.lazy`，`React.forwardRef`，`React.memo`

```
// Context.Provider
{
  $$typeof: Symbol(react.provider)
  _context: {
    $$typeof: Symbol(react.context)
  	Consumer: {$$typeof: Symbol(react.context), _context: {…}, _calculateChangedBits: null, …}
  	Provider: {$$typeof: Symbol(react.provider), _context: {…}}
  }
}
```

### $$typeof

> `$$typeof` 表示的是这个`ReactElement`的类型

对于 `$$typeof`，在`ReactSymbols.js`中可以找到其值：

	export const REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element'): 0xeac7;
	export const REACT_PORTAL_TYPE = hasSymbol? Symbol.for('react.portal'): 0xeaca;
	export const REACT_FRAGMENT_TYPE = hasSymbol? Symbol.for('react.fragment'): 0xeacb;
	export const REACT_STRICT_MODE_TYPE = hasSymbol? Symbol.for('react.strict_mode'): 0xeacc;
	export const REACT_PROFILER_TYPE = hasSymbol? Symbol.for('react.profiler'): 0xead2;
	export const REACT_PROVIDER_TYPE = hasSymbol? Symbol.for('react.provider'): 0xeacd;
	export const REACT_CONTEXT_TYPE = hasSymbol? Symbol.for('react.context'): 0xeace;
	export const REACT_ASYNC_MODE_TYPE = hasSymbol? Symbol.for('react.async_mode'): 0xeacf;
	export const REACT_CONCURRENT_MODE_TYPE = hasSymbol? Symbol.for('react.concurrent_mode'): 0xeacf;
	export const REACT_FORWARD_REF_TYPE = hasSymbol? Symbol.for('react.forward_ref'): 0xead0;
	export const REACT_SUSPENSE_TYPE = hasSymbol? Symbol.for('react.suspense'): 0xead1;
	export const REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
	export const REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

## ReactInstanceMap.js ##

提供方法将`ReactElement`与其`fiber`关联起来，比如给组件实例的 `_reactInternalFiber` 属性 `remove/get/has/set` 组件实例对应的 fiber 对象。

## ReactWorkTags.js ##

`Fiber.tag` 属性值，表示该`fiber`的类型，即对应哪种`react`实例，比如` fiber.tag` 为 `0` 表示该 `fiber` 对应的组件是一个函数组件。

# 标记需要对fiber执行什么类型的操作

## ReactSideEffectTags.js ##

对`fiber`需要进行什么操作的标志

```
export const NoEffect = /*              */ 0b000000000000;  // 这个fiber啥都不要干
export const PerformedWork = /*         */ 0b000000000001;  // react devtools相关的，忽略

// You can change the rest (and add more).
export const Placement = /*             */ 0b000000000010;  // 表示dom需要替换
export const Update = /*                */ 0b000000000100;	// 表示dom需要更新属性
export const PlacementAndUpdate = /*    */ 0b000000000110;	// 替换以及更新
export const Deletion = /*              */ 0b000000001000;	// dom需要删除
export const ContentReset = /*          */ 0b000000010000;	// dom的文本内容需要重置
export const Callback = /*              */ 0b000000100000;	// setState有回调要执行
export const DidCapture = /*            */ 0b000001000000;	// 有组件suspended，需要挂在对应的组件
export const Ref = /*                   */ 0b000010000000;	// 需要更新 ref
export const Snapshot = /*              */ 0b000100000000;	// 表示在渲染dom之前需要执行getSnapshotBeforeUpdate
export const Passive = /*               */ 0b001000000000;	// 副作用

// Passive & Update & Callback & Ref & Snapshot
export const LifecycleEffectMask = /*   */ 0b001110100100;

// Union of all host effects
export const HostEffectMask = /*        */ 0b001111111111;

export const Incomplete = /*            */ 0b010000000000;	// 发生错误中断了，组件还没协调完的标记
export const ShouldCapture = /*         */ 0b100000000000;  // 回滚使suspend组件处于初始状态，卸载fallback组件
```



# fiber 的操作

> Fiber.return 表示该节点的父节点
>
> Ifber.alternate 表示当前fiber对应的老的fiber节点，这里设计双缓冲fiber树，暂不介绍

### getParent ###

在`fiber`树中获取当前实例节点的父节点实例（该父节点对应的只能是真实`DOM`，不能是`text`或者类组件或者函数组件等等）。

	//HostComponent组件对应的DOM，比如App的tag=3, 表示为类组件，其child为tag=5对应div元素。
	function getParent(inst) {
	  do {
	    inst = inst.return;
	  } while (inst && inst.tag !== HostComponent);
	  if (inst) {
	    return inst;
	  }
	  return null;
	}

### getLowestCommonAncestor ###

获取节点`A`与`B`的最近的公共祖先节点

简单算法题：找到两个链表的公共节点

	export function getLowestCommonAncestor(instA, instB) {
	  //获取子节点A在树中的深度
	  let depthA = 0;
	  for (let tempA = instA; tempA; tempA = getParent(tempA)) {
	    depthA++;
	  }
	  //获取子节点B在树中的深度
	  let depthB = 0;
	  for (let tempB = instB; tempB; tempB = getParent(tempB)) {
	    depthB++;
	  }
	
	  // If A is deeper, crawl up.
	  // 如果A的深度高，那么A节点先往上走depthA - depthB个节点，最后同时走，直到父节点是同一个
	  while (depthA - depthB > 0) {
	    instA = getParent(instA);
	    depthA--;
	  }
	
	    // 如果B的深度高，那么B节点先往上走depthB - depthB个节点，最后同时走，直到父节点是同一个
	  // If B is deeper, crawl up.
	  while (depthB - depthA > 0) {
	    instB = getParent(instB);
	    depthB--;
	  }
	
	  // Walk in lockstep until we find a match.
	  // 现在，指针所处的位置的高度一致，可以同时往上查找，直到找到公共的节点
	  let depth = depthA;
	  while (depth--) {
	    if (instA === instB || instA === instB.alternate) {
	      return instA;
	    }
	    instA = getParent(instA);
	    instB = getParent(instB);
	  }
	  return null;
	}

### isAncestor ###

判断`A`节点是否是`B`节点的祖先节点

	export function isAncestor(instA, instB) {
	  while (instB) {
	    if (instA === instB || instA === instB.alternate) {
	      return true;
	    }
	    instB = getParent(instB);
	  }
	  return false;
	}

### getParentInstance ###

对`getParent`的`export`封装：

	export function getParentInstance(inst) {
	  return getParent(inst);
	}

### traverseTwoPhase ###

对`fiber`及其以上的树执行冒泡捕获的操作，执行`fn`。类似事件的冒泡捕获

	export function traverseTwoPhase(inst, fn, arg) {
	  const path = [];
	  //将inst的父节点入栈，数组最后的为最远的祖先
	  while (inst) {
	    path.push(inst);
	    inst = getParent(inst);
	  }
	  let i;
	  //从最远的祖先开始向inst节点捕获执行fn
	  for (i = path.length; i-- > 0; ) {
	    fn(path[i], 'captured', arg);
	  }
	    //从inst节点开始向最远的祖先节点冒泡执行fn
	  for (i = 0; i < path.length; i++) {
	    fn(path[i], 'bubbled', arg);
	  }
	}

### traverseEnterLeave ###

当关注点从`from`节点移出然后移入`to`节点的时候,在`from`执行执行类似移入移出的操作

`Fiber` 树如下如下：

<img src="https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D2/reactTreeTraverse.png" alt="fiber1" style="zoom:50%;" />

上述过程，当执行`traverseEnterLeave(E, B, fn, argFrom, argTo)`函数的时候，类似鼠标从节点`from`(即E节点)移入到节点`to`(即B节点)，这个时候会依次调用

    fn(E, 'bubbled', argFrom) --> fn(C, 'bubbled', argFrom) --> fn(B, 'captured', argTo)

这样的一个过程是从节点`E`冒泡到最低公共祖先节点`A`然后向下捕获直到节点`B`。过程中会依次调用`fn`。但是不会对最低公共祖先节点执行`fn`

	export function traverseEnterLeave(from, to, fn, argFrom, argTo) {
	  const common = from && to ? getLowestCommonAncestor(from, to) : null;
	  const pathFrom = [];
	  while (true) {
	    if (!from) {
	      break;
	    }
	    if (from === common) {
	      break;
	    }
	    const alternate = from.alternate;
	    if (alternate !== null && alternate === common) {
	      break;
	    }
	    pathFrom.push(from);
	    from = getParent(from);
	  }
	  const pathTo = [];
	  while (true) {
	    if (!to) {
	      break;
	    }
	    if (to === common) {
	      break;
	    }
	    const alternate = to.alternate;
	    if (alternate !== null && alternate === common) {
	      break;
	    }
	    pathTo.push(to);
	    to = getParent(to);
	  }
	  //以上代码将from节点到from与to节点的最近公共祖先节点（不包括公共祖先节点）push到pathFrom数组
	  //以上代码将to节点到from与to节点的最近公共祖先节点（不包括公共祖先节点）push到pathTo数组
	
	  // 以下代码用于对pathFrom冒泡，执行fn
	  for (let i = 0; i < pathFrom.length; i++) {
	    fn(pathFrom[i], 'bubbled', argFrom);
	  }
	    // 以下代码用于对pathTo捕获，执行fn
	  for (let i = pathTo.length; i-- > 0; ) {
	    fn(pathTo[i], 'captured', argTo);
	  }
	}

# 比较

## shallowEqual.js ##

浅比较

	const hasOwnProperty = Object.prototype.hasOwnProperty;
	function shallowEqual(objA: mixed, objB: mixed): boolean {
	  if (is(objA, objB)) {
	      // 两个值都是 undefined
	      // 两个值都是 null
	      // 两个值都是 true 或者都是 false
	      // 两个值是由相同个数的字符按照相同的顺序组成的字符串
	      // 两个值指向同一个对象
	      // 两个值都是数字并且
	        // 都是正零 +0
	        // 都是负零 -0
	        // 都是 NaN
	        // 都是除零和 NaN 外的其它同一个数字
	    return true;
	  }
	
	  if (
	    typeof objA !== 'object' || objA === null || typeof objB !== 'object' ||objB === null
	  ) {
	    //objA与objB有一个不是对象或者有一个是null，则返回不相等。
	    return false;
	  }
	
		// 处理两个对象的情况
	  const keysA = Object.keys(objA);
	  const keysB = Object.keys(objB);
	
	  if (keysA.length !== keysB.length) {
	    return false;
	  }
	
	  // Test for A's keys different from B.
	  for (let i = 0; i < keysA.length; i++) {
	    if (
	      !hasOwnProperty.call(objB, keysA[i]) ||
	      !is(objA[keysA[i]], objB[keysA[i]])
	    ) {
	      return false;
	    }
	  }
	  return true;
	}

## areHookInputsEqual.js ##

`areHookInputsEqual`判断两个数组是否相等，基于` Object.is`。

# 总结

​	本节简单的介绍了react 中进行错误处理的一些工具函数，这是一个非常值得深究的问题，但是不是作为本章的内容，鉴于目前没找到相关写`react error system` 的文章，这一部分放到系列结束再来讲。其次简单介绍了`ReactElement`的数据结构，并详细的介绍了两个属性`type`以及`$$typeof`，前者为`ReactElement`具体的行为，后者为`ReactElement`的类型。其次介绍了`ReactElement`与`fiber`是如何关联起来的，但是并没有介绍后者的数据结构，以及两者之间是如何的关系，后续章节会说到，这里只需要记住后者的'原料'是前者，前者贴近`react`开发者，后者是前者的状态数据容器，直接影响表现层(`view`)的`dom`。然后还介绍了`fiber`的一些操作，其实这些操作可以看成一个事件系统的必备函数。接着介绍了`react`如何对`fiber`操作的一些标记。最后介绍了一些比较的方法。

# 课后练习

如何实现一个事件系统？