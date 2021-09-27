---
id: react-is
sidebar_label: react-is
slug: '/react/react/scheduler/others/react-is'
sidebar_position: 1
title: ''
---

通过API：typeOf理解react中各种组件类型的关系。理解portal类型与reactElement类型的构建过程，与使用区别。梳理react中的类型，两大类型的构建过程。

### API ###
	typeOf
	isConcurrentMode  并发模式
	isContextConsumer
	isContextProvider
	isElement
	isForwardRef
	isFragment
	isProfiler  性能分析模式
	isPortal
	isStrictMode 严格模式

----------

### memo组件的构建过程 ###
	function testMemo(){
	    const MyComponent = React.memo(function MyComponent(props) {
	        return (
	            <div>
	                this is memo
	            </div>
	        )
	    });
	    console.log("<MyComponent />",<MyComponent />)
	    console.log("MyComponent",MyComponent)
	    ReactDOM.render(
	        <MyComponent />,
	        document.getElementById('app')
	    );
	}

#### 构建memo类型对象 ####
React.memo函数返回一个react类型对象

	{
	    $$typeof: REACT_MEMO_TYPE,
	    type,
	    compare: compare === undefined ? null : compare,
	  }

打印结果为：

	$$typeof:Symbol(react.memo)
	compare:null
	type:ƒ MyComponent(props)

#### 将memo类型对象构建为reactElement对象 ####
执行<MyComponent />语句的时候，就是调用createElement函数将这个对象创建为一个reactElement：

	$$typeof:Symbol(react.element)
	key:null
	props:{}
	ref:null
	type:{$$typeof: Symbol(react.memo), type: ƒ, compare: null}
	_owner:null
	_store:{validated: false}

----------

### createPortal的构建过程 ###
	
    const app = document.getElementById('app');
    const Portal = ReactDOM.createPortal(<div>"portal"</div>, app);
    console.log("Portal",Portal)
    ReactDOM.render(
        Portal,
        document.getElementById('app')
    );
	

上述代码，react先将`<div>"portal"</div>`部分调用createElement生成ReactElement对象，然后作为参数children传入，createPortal接收两个参数：children和真实的DOM或者组件。然后返回一个portal类型的react对象，与reactElement类型区别开，该portal不能再被创建为reactElement类型，即不能写成<Portal />。因为创建为reactElement类型对象，会调用createElementWithValidation对Portal进行验证，调用isValidElementType(Portal)返回的结果为false，直接报错。具体细节请参看[9、react源码浅析(三)：ReactElementValidator](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D3/react%e6%ba%90%e7%a0%81%e6%b5%85%e6%9e%90(%e4%b8%89)%ef%bc%9aReactElementValidator.md)

isValidElementType源码为：

	export default function isValidElementType(type: mixed) {
	  return (
	    typeof type === 'string' ||
	    typeof type === 'function' ||
	    // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
	    type === REACT_FRAGMENT_TYPE ||
	    type === REACT_CONCURRENT_MODE_TYPE ||
	    type === REACT_PROFILER_TYPE ||
	    type === REACT_STRICT_MODE_TYPE ||
	    type === REACT_SUSPENSE_TYPE ||
	    (typeof type === 'object' &&
	      type !== null &&
	      (type.$$typeof === REACT_LAZY_TYPE ||
	        type.$$typeof === REACT_MEMO_TYPE ||
	        type.$$typeof === REACT_PROVIDER_TYPE ||
	        type.$$typeof === REACT_CONTEXT_TYPE ||
	        type.$$typeof === REACT_FORWARD_REF_TYPE))
	  );
	}
	
报错为：

    warning(
      false,
      'React.createElement: type is invalid -- expected a string (for ' +
        'built-in components) or a class/function (for composite ' +
        'components) but got: %s.%s',
      typeString,
      info,
    );


### typeOf ###
用于判断传入的react的类型，一定是经过ReactElement
react元素类型为两大类：

	reactType1 : {
		$$typeof : REACT_ELEMENT_TYPE,
		type : REACT_ASYNC_MODE_TYPE | 
			   REACT_CONCURRENT_MODE_TYPE |
			   REACT_FRAGMENT_TYPE |
			   REACT_PROFILER_TYPE |
			   REACT_STRICT_MODE_TYPE |
			   REACT_SUSPENSE_TYPE |  //返回REACT_CONTEXT_TYPE，REACT_FORWARD_REF_TYPE，REACT_PROVIDER_TYPE，REACT_ELEMENT_TYPE中的一种
			   {
					$$typeof :  REACT_CONTEXT_TYPE |
              				    REACT_FORWARD_REF_TYPE |
              					REACT_PROVIDER_TYPE |
								REACT_MEMO_TYPE | //typeOf返回REACT_ELEMENT_TYPE
								REACT_LAZY_TYPE   //typeOf返回REACT_ELEMENT_TYPE
				}
	}

	reactType2 : {
		$$typeof : REACT_PORTAL_TYPE
	}

**注意：**

1. 其中type.$$typeof还可以为REACT\_MEMO\_TYPE或者REACT\_LAZY\_TYPE，typeOf在检测到是REACT\_MEMO\_TYPE或者REACT\_LAZY\_TYPE的时候，返回REACT\_ELEMENT\_TYPE。
2. type还可以是REACT\_SUSPENSE\_TYPE，但是typeOf在检测到REACT\_SUSPENSE\_TYPE的时候，会继续检测type.$$typeof的值，可以返回REACT\_CONTEXT_TYPE，REACT\_FORWARD\_REF\_TYPE，REACT\_PROVIDER\_TYPE，REACT\_ELEMENT\_TYPE中的一种。

源码：

	export function typeOf(object: any) {
	  if (typeof object === 'object' && object !== null) {
	    const $$typeof = object.$$typeof;
	    //先判断object.$$typeof，
	    // 如果是REACT_ELEMENT_TYPE，继续判断type
	    // 如果是REACT_PORTAL_TYPE，返回REACT_PORTAL_TYPE
	    switch ($$typeof) {
	      case REACT_ELEMENT_TYPE:
	        const type = object.type;
	        //判断object.type，如果是如下类型则返回该类型：
	        //   REACT_ASYNC_MODE_TYPE
	        //   REACT_CONCURRENT_MODE_TYPE
	        //   REACT_FRAGMENT_TYPE
	        //   REACT_PROFILER_TYPE
	        //   REACT_STRICT_MODE_TYPE
	        //  如果都不是，则判断object.type.$$typeof
	        switch (type) {
	          case REACT_ASYNC_MODE_TYPE:
	          case REACT_CONCURRENT_MODE_TYPE:
	          case REACT_FRAGMENT_TYPE:
	          case REACT_PROFILER_TYPE:
	          case REACT_STRICT_MODE_TYPE:
	            return type;
	          default:
	            const $$typeofType = type && type.$$typeof;
	            // 如果object.type.$$typeof是如下类型，则返回该类型：
	            //   REACT_CONTEXT_TYPE
	            //   REACT_FORWARD_REF_TYPE
	            //   REACT_PROVIDER_TYPE
	            //  如果都不是则返回object.$$typeof，该值不属于react类型
	            switch ($$typeofType) {
	              case REACT_CONTEXT_TYPE:
	              case REACT_FORWARD_REF_TYPE:
	              case REACT_PROVIDER_TYPE:
	                return $$typeofType;
	              default:
					//检测到是REACT_MEMO_TYPE或者REACT_LAZY_TYPE的时候，返回REACT_ELEMENT_TYPE
	                return $$typeof;
	            }
	        }
	      case REACT_PORTAL_TYPE:
	        return $$typeof;
	    }
	  }


