## ReactVersion.js ##
	module.exports = '16.6.1';

## describeComponentFrame.js ##
**输出文件的位置，以及log的信息发生在文件中的行数**
	
	//用于匹配路径(linux或者windows路径)：字符串中"\"或者"/"之前的所有字符（除换行\n,\r）部分
	const BEFORE_SLASH_RE = /^(.*)[\\\/]/;
	
	
	export default function(
	  name: null | string, //组件的名字
	  source: any,//包含组件信息（组件路径，错误发生的行数）的对象
	  ownerName: null | string,//组件的父组件名字
	) {
	  let sourceInfo = '';
	  if (source) {
	    let path = source.fileName;
	    //获取路径path中最后文件名字：如获取"./home/index.js"中的index.js
	    let fileName = path.replace(BEFORE_SLASH_RE, '');
	    if (__DEV__) {
	      // In DEV, include code for a common special case:
	      // prefer "folder/index.js" instead of just "index.js".
	      if (/^index\./.test(fileName)) {
	        const match = path.match(BEFORE_SLASH_RE);
	        if (match) {
	          //match[1]被第一个子表达式捕获的字符串及"\"或者"/"之前的字符（除换行\n,\r）部分
	          const pathBeforeSlash = match[1];
	          if (pathBeforeSlash) {
	            //获取文件的父文件夹名称
	            const folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
	            //拼接文件夹与文件名
	            fileName = folderName + '/' + fileName;
	          }
	        }
	      }
	    }
	    // 输出在文件的某个文件某行
	    sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
	  } else if (ownerName) {
	    sourceInfo = ' (created by ' + ownerName + ')';
	  }
	  return '\n    in ' + (name || 'Unknown') + sourceInfo;
	}

## ExecutionEnvironment.js ##
**侦测是否浏览器环境，可操作dom节点**

	export const canUseDOM: boolean = !!(
	  typeof window !== 'undefined' &&
	  window.document &&
	  window.document.createElement
	);



## invariant.js ##
- 开发模式和生产环境下，当 condition 为 false 时显示 invariant
- format : invariant信息

例子：

	invariant(
	  false,
	  'Hi! , %s ! throw a error!',
	  'puppy'
	)

抛出一个错误：

	'Hi! , puppy ! throw a error!'

### 源码 ###

	let validateFormat = () => {};
	
	if (__DEV__) {
	  validateFormat = function(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}
	
	export default function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);
	
	  if (!condition) {
	    let error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	          'for the full error message and additional helpful warnings.',
	      );
	    } else {
	      const args = [a, b, c, d, e, f];
	      let argIndex = 0;
	      error = new Error(
	        //  格式，利用参数代替format中%s占位符
	        format.replace(/%s/g, function() {
	          return args[argIndex++];
	        }),
	      );
	      error.name = 'Invariant Violation';
	    }
	
	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

## isTextInputElement.js ##
判断是否是input元素或者textarea元素

## lowPriorityWarning.js ##
- condition：false时打印warning
- format：warning信息字符串
- args：用于替换format中的%s

## ReactElementType.js ##
定义类型：

Source：

	{  fileName: string,  lineNumber: number}

ReactElement：

		{
		  _source: Source,   
		  type: any,
		  key: any,
		  ref: any,
		  props: any,
			...
		}

## ReactSymbols.js ##
getIteratorFn：获取对象的遍历器方法

***_TYPE：以字符串作为名称的Symbol值或者十六进制数字

	const hasSymbol = typeof Symbol === 'function' && Symbol.for;
	
	//返回以字符串作为名称的Symbol值
	export const REACT_ELEMENT_TYPE = hasSymbol
	  ? Symbol.for('react.element')
	  : 0xeac7;
	export const REACT_PORTAL_TYPE = hasSymbol
	  ? Symbol.for('react.portal')
	  : 0xeaca;
	export const REACT_FRAGMENT_TYPE = hasSymbol
	  ? Symbol.for('react.fragment')
	  : 0xeacb;
	export const REACT_STRICT_MODE_TYPE = hasSymbol
	  ? Symbol.for('react.strict_mode')
	  : 0xeacc;
	export const REACT_PROFILER_TYPE = hasSymbol
	  ? Symbol.for('react.profiler')
	  : 0xead2;
	export const REACT_PROVIDER_TYPE = hasSymbol
	  ? Symbol.for('react.provider')
	  : 0xeacd;
	export const REACT_CONTEXT_TYPE = hasSymbol
	  ? Symbol.for('react.context')
	  : 0xeace;
	export const REACT_ASYNC_MODE_TYPE = hasSymbol
	  ? Symbol.for('react.async_mode')
	  : 0xeacf;
	export const REACT_CONCURRENT_MODE_TYPE = hasSymbol
	  ? Symbol.for('react.concurrent_mode')
	  : 0xeacf;
	export const REACT_FORWARD_REF_TYPE = hasSymbol
	  ? Symbol.for('react.forward_ref')
	  : 0xead0;
	export const REACT_SUSPENSE_TYPE = hasSymbol
	  ? Symbol.for('react.suspense')
	  : 0xead1;
	export const REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
	export const REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
	
	const MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	
	//Map数据结构：@@iterator 属性的初始值与 entries 属性的初始值是同一个函数对象。
	//Array数据结构：@@iterator 属性的初始值与 values 属性的初始值是同一个函数对象。
	const FAUX_ITERATOR_SYMBOL = '@@iterator';
	
	//返回对象的遍历器方法
	export function getIteratorFn(maybeIterable: ?any): ?() => ?Iterator<*> {
	  if (maybeIterable === null || typeof maybeIterable !== 'object') {
	    return null;
	  }
	  const maybeIterator =
	    (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
	    maybeIterable[FAUX_ITERATOR_SYMBOL];
	  if (typeof maybeIterator === 'function') {
	    return maybeIterator;
	  }
	  return null;
	}

## ReactFeatureFlags.js ##
定义react属性标志与默认值

## ReactInstanceMap.js ##
为传入参数remove或者get或者has或者set其属性_reactInternalFiber值

## ReactLazyComponent.js ##
用于组件懒加载的类型定义，状态常量，以及用于获取lazyComponent._result

## ReactSideEffectTags.js ##
副作用标志，关于副作用给出的定义是：和真实的世界进行交互的方式，比如操作浏览器缓存，异步数据获取。用于说明副作用的[例子](https://jaysoo.ca/2016/01/03/managing-processes-in-redux-using-sagas/)

## ReactTypes.js ##
react类型定义

## ReactWorkTags.js ##
React组件等相关标记

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
	    typeof objA !== 'object' ||
	    objA === null ||
	    typeof objB !== 'object' ||
	    objB === null
	  ) {
	      //objA与objB有一个不是对象或者有一个是null，则返回不相等。比如objA = 3
	    return false;
	  }
	
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

## warningWithoutStack.js ##
condition为false的情况下，根据错误信息格式format与参数，抛出一个错误。并在具备console的环境下打印错误信息，不包括错误发生的位置与组件相关信息。








----------
## ReactSharedInternals.js ##

	import React from 'react';
	
	const ReactSharedInternals =
	  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
	
	export default ReactSharedInternals;


## warning.js ##
构造错误发生的组件相关信息的stack（string类型，stack的构造请看packages\react\src\ReactDebugCurrentFrame.js，其中调用了packages\shared\describeComponentFrame.js），传入并调用warningWithoutStack函数。


## isValidElementType.js ##
判断组件类型是否合法

## invokeGuardedCallbackImpl.js ##
invokeGuardedCallbackImpl函数传入的参数name,func,context,a,b,c,d,e,f
生产环境下：用try...catch捕获错误，不会构建详细的错误信息。
开发环境下该函数的功能：对func封装，当执行func的时候，如果发生错误，但是window的error事件没有捕获这个错误，重新构建Error，并输出错误信息

	import invariant from 'shared/invariant';
	
	let invokeGuardedCallbackImpl = function<A, B, C, D, E, F, Context>(
	  name: string | null,
	  func: (a: A, b: B, c: C, d: D, e: E, f: F) => mixed,
	  context: Context,
	  a: A,
	  b: B,
	  c: C,
	  d: D,
	  e: E,
	  f: F,
	) {
	  const funcArgs = Array.prototype.slice.call(arguments, 3);
	  try {
	    func.apply(context, funcArgs);
	  } catch (error) {
	    this.onError(error);
	  }
	};
	
	if (__DEV__) {
	  if (
	    typeof window !== 'undefined' &&
	    typeof window.dispatchEvent === 'function' &&
	    typeof document !== 'undefined' &&
	    typeof document.createEvent === 'function'
	  ) {
	    const fakeNode = document.createElement('react');
	
	    const invokeGuardedCallbackDev = function<A, B, C, D, E, F, Context>(
	      name: string | null,
	      func: (a: A, b: B, c: C, d: D, e: E, f: F) => mixed,
	      context: Context,
	      a: A,
	      b: B,
	      c: C,
	      d: D,
	      e: E,
	      f: F,
	    ) {
	      invariant(
	        typeof document !== 'undefined',
	        'The `document` global was defined when React was initialized, but is not ' +
	          'defined anymore. This can happen in a test environment if a component ' +
	          'schedules an update from an asynchronous callback, but the test has already ' +
	          'finished running. To solve this, you can either unmount the component at ' +
	          'the end of your test (and ensure that any asynchronous operations get ' +
	          'canceled in `componentWillUnmount`), or you can change the test itself ' +
	          'to be asynchronous.',
	      );
	      //创建事件
	      const evt = document.createEvent('Event');
	      //  用于标记传入的func是否发生错误，如果为true则表示发生错误，为false表示没有发生
	      //  由callback函数可知，当func执行返回的时候，将didError置为false说明func执行没有error
	      let didError = true;
                      
	      let windowEvent = window.event;

	      const windowEventDescriptor = Object.getOwnPropertyDescriptor(
	        window,
	        'event',
	      );
	
	      const funcArgs = Array.prototype.slice.call(arguments, 3);
	      // 对传入的func包装，将didError标志位为false，表示错误没有发生，
	      // 当func函数执行的时候发生错误，window.error事件触发，
	      // 调用回调函数handleWindowError将didError置为true标志错误已经处理
	      function callCallback() {
	        fakeNode.removeEventListener(evtType, callCallback, false);
	        if (
	          typeof window.event !== 'undefined' &&
	          window.hasOwnProperty('event')
	        ) {
	          window.event = windowEvent;
	        }
	
	        func.apply(context, funcArgs);
	        didError = false;
	      }
	
	      //  用于标记错误是否处理了，false为没有处理，true为已经处理
	      let didSetError = false;
	      let isCrossOriginError = false;
	
	      function handleWindowError(event) {
	        error = event.error;
	        didSetError = true;
	        if (error === null && event.colno === 0 && event.lineno === 0) {
	          //当加载自不同域的脚本中发生语法错误时，为避免信息泄露，语法错误的细节将不会报告，而代之简单的"Script error."
	          //  event：
	          // message：错误信息（字符串）。可用于HTML onerror=""处理程序中的event。
	          // source：发生错误的脚本URL（字符串）
	          // lineno：发生错误的行号（数字）
	          // colno：发生错误的列号（数字）
	          // error：Error对象（对象）
	          isCrossOriginError = true;
	        }
	        if (event.defaultPrevented) {
	          if (error != null && typeof error === 'object') {
	            try {
	              error._suppressLogging = true;
	            } catch (inner) {
	              // Ignore.
	            }
	          }
	        }
	      }
	
	      // Create a fake event type.
	      const evtType = `react-${name ? name : 'invokeguardedcallback'}`;
	
	      // Attach our event handlers
	      window.addEventListener('error', handleWindowError);
	      fakeNode.addEventListener(evtType, callCallback, false);
	
	      // Synchronously dispatch our fake event. If the user-provided function
	      // errors, it will trigger our global error handler.
	        // 初始化一个evtType事件，不可以冒泡，无法被取消
	      evt.initEvent(evtType, false, false);
	      //触发evtType事件，调用callCallback，执行传入的func函数
	      fakeNode.dispatchEvent(evt);
	
	      if (windowEventDescriptor) {
	        Object.defineProperty(window, 'event', windowEventDescriptor);
	      }
	
	      if (didError) {
	        //回调函数func执行了，并且发生了错误
	        if (!didSetError) {
	          // 回调函数func执行了，并且发生了错误，但是error事件没有触发，handleWindowError没有执行
	          error = new Error(
	            'An error was thrown inside one of your components, but React ' +
	              "doesn't know what it was. This is likely due to browser " +
	              'flakiness. React does its best to preserve the "Pause on ' +
	              'exceptions" behavior of the DevTools, which requires some ' +
	              "DEV-mode only tricks. It's possible that these don't work in " +
	              'your browser. Try triggering the error in production mode, ' +
	              'or switching to a modern browser. If you suspect that this is ' +
	              'actually an issue with React, please file an issue.',
	          );
	        } else if (isCrossOriginError) {
	            // 当加载自不同域的脚本中发生语法错误
	          error = new Error(
	            "A cross-origin error was thrown. React doesn't have access to " +
	              'the actual error object in development. ' +
	              'See https://fb.me/react-crossorigin-error for more information.',
	          );
	        }
	        //输出重新构建的error信息
	        this.onError(error);
	      }
	
	      // Remove our event listeners
	      window.removeEventListener('error', handleWindowError);
	    };
	
	    invokeGuardedCallbackImpl = invokeGuardedCallbackDev;
	  }
	}
	
	export default invokeGuardedCallbackImpl;

## HostConfigWithNoPersistence.js ##
用于提示目前的渲染器不支持Persistence

## HostConfigWithNoMutation.js ##
用于提示目前的渲染器不支持Mutation

## HostConfigWithNoHydration.js ##
客户端激活 (client-side hydration):在浏览器端接管由服务端发送的静态 HTML，使其变为由 react 管理的动态 DOM 的过程。

用于提示目前的渲染器不支持hydration

## getComponentName.js ##
获取组件名

getComponentName：

	//传入的type有多种类型的值：
	// null ： 不是组件
	// function ： 组件，不管是纯函数组件还是类组件都属于这种
	// string ： 字符串文本
	// symbol值 ： 传入的为react特定的组件类型，如Fragment等等
	// object ： 复杂的嵌套的组件类型

getWrappedName：

	// 优先级从高到低为：outerType.displayName || innerType.displayName || innerType.name || wrapperName
	// 对应的返回值为:
	// outerType.displayName ||
	// ${wrapperName}(${innerType.displayName}) ||
	// ${wrapperName}(${innerType.name}) ||
	// wrapperName

## areHookInputsEqual.js ##
areHookInputsEqual判断输入的两个数组是否相等，浅比较

## ReactErrorUtils.js ##
处理错误的工具函数，略

## ReactPortal.js ##
用于产生Portal对象，

	export function createPortal(
	  children: ReactNodeList,
	  containerInfo: any,
	  implementation: any,
	  key: ?string = null,
	): ReactPortal {
	  return {
	    $$typeof: REACT_PORTAL_TYPE,
	    key: key == null ? null : '' + key,
	    children,
	    containerInfo,
	    implementation,
	  };
	}	

## reactProdInvariant.js ##
用于错误代码系统，始终会抛出一个error。


