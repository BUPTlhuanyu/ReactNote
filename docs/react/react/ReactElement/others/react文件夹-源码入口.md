---
id: react-entry
sidebar_label: react文件夹-源码入口
title: ''
slug: '/react/react/ReactElement/others/react-entry'
sidebar_position: 1
---

## react.js ##
定义React类：

	const React = {
	  Children: {
	    map,
	    forEach,
	    count,
	    toArray,
	    only,
	  },
	
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
	
	  createElement: __DEV__ ? createElementWithValidation : createElement,
	  cloneElement: __DEV__ ? cloneElementWithValidation : cloneElement,
	  createFactory: __DEV__ ? createFactoryWithValidation : createFactory,
	  isValidElement: isValidElement,
	
	  version: ReactVersion,
	
	  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals,
	};

### 分析步骤 ###

	

----------

1. ReactNoopUpdateQueue.js - - - - - - - - - - - - - - - - - - - - - - - -  定义更新队列的抽象类中的方法
2. ReactBaseClasses.js - - - - - - - - - - -- - - - - - - - - - - -  定义Component以及PureComponent类

----------

----------

1. ReactCreateRef.js - - - - - - - - -  定义createRef函数，返回一个具备current属性的refObject对象
2. ReactContext.js - - - - - - - - - - - 定义context对象以及context.Provider与context.Consumer对象
3. ReactLazy.js - - - - - - - - - - - - - - - - - - --  - - -- - - - - -  - --  - - - -- -  -- - - - - - - - - - 定义一个Lazy函数，传入一个函数，返回一个对象，其_ctor中为动态加载逻辑包含需要懒加载组件调的位置
4. forwardRef.js - - - - - - - - - - - - -定义React.forwardRef函数，接受一个渲染函数，返回一个对象
5. memo.js - - - - - - - - -  定义React.memo()函数，返回一个$$typeof: REACT_MEMO_TYPE的对象

----------

----------

1. ReactCurrentOwner.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - 定义ReactCurrentOwner对象?
2. ReactElement.js - - - - - - - - - - - - - - 定义ReactElement对象（props属性等），createElement函数与cloneElement函数等

----------
----------

1. ReactDebugCurrentFrame.js - - - - - - - - - - - - - - - - - - - -- - -  用于保存当前debug的组件元素
2. ReactChildren.js - - - - - - - - -  - - - 构建reactchildren的map、forEach等API

----------
----------

1. ReactHooks.js - - - - - - -  - - - - - - - - - - react hooks（未分析，最后载分析最新版本的hooks）

----------
----------

1. ReactElementValidator.js - - - - - - - - - - 在react组件creatElement或cloneElement之前对传入的type进行验证，另外包含对fragement特殊处理。

----------
----------

1. ReactSharedInternals.js - - - - - - - - - - - - - - - - - - - - - - - - - - - -  内部对象（暂时未给出分析）

----------


