1. ReactCreateRef.js
2. ReactContext.js
3. ReactLazy.js
4. forwardRef.js
5. memo.js

## ReactCreateRef.js ##
使用方法见[Refs 和 DOM](http://react.html.cn/docs/refs-and-the-dom.html)。

定义createRef函数，返回一个具备current属性的refObject对象。

	export function createRef(): RefObject {
	  const refObject = {
	    current: null,
	  };
	  if (__DEV__) {
	    Object.seal(refObject);
	  }
	  return refObject;
	}

## ReactLazy.js ##
使用方法见[React.lazy](http://react.html.cn/docs/react-api.html#reactlazy)
> React.lazy() 允许你定义动态加载的组件。 这有助于减少包大小，以延迟加载在初始渲染期间未使用的组件。
> 
> const SomeComponent = React.lazy(() => import('./SomeComponent'));



定义一个Lazy函数，传入一个函数，返回一个对象，其_ctor中为动态加载逻辑包含需要懒加载组件调的位置，$$typeof: 为REACT_LAZY_TYPE组件类型

	export function lazy<T, R>(ctor: () => Thenable<T, R>): LazyComponent<T> {
	  return {
	    $$typeof: REACT_LAZY_TYPE, //REACT_LAZY_TYPE组件类型
	    _ctor: ctor, //动态加载逻辑
	    // React uses these fields to store the result.
	    _status: -1,
	    _result: null,
	  };
	}

## memo.js ##
什么是[React.memo](https://scotch.io/tutorials/react-166-reactmemo-for-functional-components-rendering-control)

组件仅在它的 props 发生改变的时候进行重新渲染。通常来说，在组件树中 React 组件，只要有变化就会走一遍渲染流程。但是通过 PureComponent 和 React.memo()，我们可以仅仅让某些组件进行渲染。React.memo 是一个高阶组件。 它与 React.PureComponent 类似，但是他用于包裹函数式组件，而不是类组件。

返回一个对象:

	 {
	    $$typeof: REACT_MEMO_TYPE,//组件类型
	    type,//传入的函数组件
	    compare: compare === undefined ? null : compare,//用于控制是否重新渲染的函数
	  }

----------

	export default function memo<Props>(
	  type: React$ElementType,
	  compare?: (oldProps: Props, newProps: Props) => boolean,
	) {
	  if (__DEV__) {
	    if (!isValidElementType(type)) {
	      warningWithoutStack(
	        false,
	        'memo: The first argument must be a component. Instead ' +
	          'received: %s',
	        type === null ? 'null' : typeof type,
	      );
	    }
	  }
	  return {
	    $$typeof: REACT_MEMO_TYPE,
	    type,
	    compare: compare === undefined ? null : compare,
	  };
	}

## forwardRef.js ##
React.forwardRef 接受一个渲染函数(ts中不允许传入一个类组件，其他情况下能传入某些类组件)，该函数接收 props 和 ref 参数并返回一个 React 节点。可以用于解决：添加一个 ref 到 HOC ， 这个 ref 将引用最外面的容器组件，而不是包裹的组件。

----------
返回一个对象：

	  return {
	    $$typeof: REACT_FORWARD_REF_TYPE,
	    render,
	  };

----------
### 传入的渲染函数的参数问题 ###
只有在传入两个参数或者不传参数的时候，不会报错。传一个参数或者传入多于两个参数会报错

----------

### 与memo组合使用 ###

在与memo组合使用的时候，应该是如下方式：

	memo(forwardRef(...))

不能是：

	forwardRef(memo(...))

因为根据memo.js，memo返回的是一个对象而不是一个渲染函数。

### 渲染函数不允许有defaultProps与propTypes ###
defaultProps定义默认的props：

	MyComponent.defaultProps = {
	  color: 'blue'
	};
propTypes规定传入的props的内型：

	MyComponent.propTypes = {optionalArray: PropTypes.array,...}

**特别需要注意的是**：

尽量不要传入类组件，当在ts中的时候，需要对props进行类型规定，因此propTypes不会是null，此时会报错：Did you accidentally pass a React component?


----------
	export default function forwardRef<Props, ElementType: React$ElementType>(
	  render: (props: Props, ref: React$Ref<ElementType>) => React$Node,
	) {
	  if (__DEV__) {
	    if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
	      warningWithoutStack(
	        false,
	        'forwardRef requires a render function but received a `memo` ' +
	          'component. Instead of forwardRef(memo(...)), use ' +
	          'memo(forwardRef(...)).',
	      );
	    } else if (typeof render !== 'function') {
	      warningWithoutStack(
	        false,
	        'forwardRef requires a render function but was given %s.',
	        render === null ? 'null' : typeof render,
	      );
	    } else {
	      warningWithoutStack(
	        // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
	        render.length === 0 || render.length === 2,
	        'forwardRef render functions accept exactly two parameters: props and ref. %s',
	        render.length === 1
	          ? 'Did you forget to use the ref parameter?'
	          : 'Any additional parameter will be undefined.',
	      );
	    }
	
	    if (render != null) {
	      warningWithoutStack(
	        render.defaultProps == null && render.propTypes == null,
	        'forwardRef render functions do not support propTypes or defaultProps. ' +
	          'Did you accidentally pass a React component?',
	      );
	    }
	  }
	
	  return {
	    $$typeof: REACT_FORWARD_REF_TYPE,
	    render,
	  };
	}

## ReactContext.js ##
### 传入的参数为： ###

	defaultValue，provider提供的默认值
	calculateChangedBits，函数

### 定义context： ###

	const context: ReactContext<T> = {
	    $$typeof: REACT_CONTEXT_TYPE,
	    _calculateChangedBits: calculateChangedBits,
	    _currentValue: defaultValue,
	    _currentValue2: defaultValue,
	    // These are circular
		// 循环引用
	    Provider: (null: any),
	    Consumer: (null: any),
	  };

### 定义context.Provider： ###

	context.Provider = {
	    $$typeof: REACT_PROVIDER_TYPE,
	    _context: context,//引用context
	  };

### 生产环境下定义context.Consumer = context ###
### 开发模式下定义context.Consumer = Consumer： ###

	const Consumer = {
	      $$typeof: REACT_CONTEXT_TYPE,
	      _context: context,
	      _calculateChangedBits: context._calculateChangedBits,
	    };
源码如下：

	Object.defineProperties(Consumer, {
	      Provider: {
	        get() {
	          if (!hasWarnedAboutUsingConsumerProvider) {
	            hasWarnedAboutUsingConsumerProvider = true;
	            warning(
	              false,
	              'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' +
	                'a future major release. Did you mean to render <Context.Provider> instead?',
	            );
	          }
	          return context.Provider;
	        },
	        set(_Provider) {
	          context.Provider = _Provider;
	        },
	      },
	      _currentValue: {
	        get() {
	          return context._currentValue;
	        },
	        set(_currentValue) {
	          context._currentValue = _currentValue;
	        },
	      },
	      _currentValue2: {
	        get() {
	          return context._currentValue2;
	        },
	        set(_currentValue2) {
	          context._currentValue2 = _currentValue2;
	        },
	      },
	      Consumer: {
	        get() {
	          if (!hasWarnedAboutUsingNestedContextConsumers) {
	            hasWarnedAboutUsingNestedContextConsumers = true;
	            warning(
	              false,
	              'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' +
	                'a future major release. Did you mean to render <Context.Consumer> instead?',
	            );
	          }
	          return context.Consumer;
	        },
	      },
	    });

#### 在使用Context.Consumer.Provider获取值得时候： ####

Context.Consumer.Provider会被替换成： Context.Provider，这两者等价

			get() {
	          return context.Provider;
	        },

Context.Consumer.Consumer会被替换成：Context.Consumer，这两者等价

		get() {
          return context.Consumer;
        },

#### 对Context.Consumer.Provider重新赋值，可以替换context.Provider： ####

	        set(_Provider) {
	          context.Provider = _Provider;
	        }

#### 对Context.Consumer.Consumer重新赋值，不会替换context.Consumer ####





