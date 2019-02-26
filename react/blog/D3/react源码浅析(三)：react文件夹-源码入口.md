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

1. ReactNoopUpdateQueue.js
2. ReactBaseClasses.js

----------

----------

1. ReactCreateRef.js
2. ReactContext.js
3. ReactLazy.js
4. forwardRef.js
5. memo.js

----------

----------

1. ReactCurrentOwner.js
2. ReactElement.js

----------
----------

1. ReactDebugCurrentFrame.js
2. ReactChildren.js

----------
----------

1. ReactHooks.js

----------
----------

1. ReactElementValidator.js

----------
----------

1. ReactSharedInternals.js

----------


