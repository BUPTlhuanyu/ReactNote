### 总览： ###
你将会明白：
如何做到props.key以及props.ref获取不到值？
如何通过hasValidRef以及defineRefPropWarningGetter在createElement中切断ref在props中的传递？
...

----------

**内部方法**

	│   ├── hasValidRef ------------------------------------ 检测是否含有合法的Ref
	│   ├── hasValidKey ------------------------------------ 检测是否含有合法的key
	│   ├── defineKeyPropWarningGetter ----- 锁定props.key的值使得无法获取props.key
	│   ├── defineRefPropWarningGetter ----- 锁定props.ref的值使得无法获取props.ref
	│   ├── ReactElement ------------ 被createElement函数调用，根据环境设置对应的属性
	
**向外暴露的函数**

	│   ├── createElement ---------------------------- 生成react元素，对其props改造
	│   ├── createFactory -------------------------------------- react元素工厂函数
	│   ├── cloneAndReplaceKey ---------------------------- 克隆react元素，替换key
	│   ├── cloneElement ----------------------------- 克隆react元素，对其props改造
	│   ├── isValidElement ---------------------------------判断元素是否是react元素 


----------

### hasValidRef ###
通过Ref属性的取值器对象的isReactWarning属性检测是否含有合法的Ref，也就是如果这个props是react元素的props那么上面的ref就是不合法的，因为在creatElement的时候已经调用了defineRefPropWarningGetter。

	function hasValidRef(config) {
	  //在开发模式下
	  if (__DEV__) {
	    //config调用Object.prototype.hasOwnProperty方法查看其对象自身是否含有'ref'属性
	    if (hasOwnProperty.call(config, 'ref')) {
	      //获取‘ref’属性的描述对象的取值器
	      const getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
	      //如果取值器存在，并且取值器上的isReactWarning为true，就说明有错误，返回false，ref不合法
	      if (getter && getter.isReactWarning) {
	        return false;
	      }
	    }
	  }
	  //在生产环境下如果config.ref !== undefined，说明合法;
	  return config.ref !== undefined;
	}

### hasValidKey ###
通过key属性的取值器对象的isReactWarning属性检测是否含有合法的key，也就是如果这个props是react元素的props那么上面的key就是不合法的，因为在creatElement的时候已经调用了defineKeyPropWarningGetter。逻辑与上同

	function hasValidKey(config) {
	  if (__DEV__) {
	    if (hasOwnProperty.call(config, 'key')) {
	      const getter = Object.getOwnPropertyDescriptor(config, 'key').get;
	      if (getter && getter.isReactWarning) {
	        return false;
	      }
	    }
	  }
	  return config.key !== undefined;
	}

### defineKeyPropWarningGetter ###
锁定props.key的值使得无法获取props.key,标记获取props中的key值是不合法的，当使用props.key的时候，会执行warnAboutAccessingKey函数，进行报错，从而获取不到key属性的值。

**key属性不能存在于props中，否则为undefined**,即如下调用始终返回undefined:

	props.key

给props对象定义key属性，以及key属性的取值器为warnAboutAccessingKey对象
该对象上存在一个isReactWarning为true的标志，在hasValidKey上就是通过isReactWarning来判断key是否合法
specialPropKeyWarningShown用于标记key不合法的错误信息是否已经显示，初始值为undefined。

	function defineKeyPropWarningGetter(props, displayName) {
	  const warnAboutAccessingKey = function() {
	    if (!specialPropKeyWarningShown) {
	      specialPropKeyWarningShown = true;
	      warningWithoutStack(
	        false,
	        '%s: `key` is not a prop. Trying to access it will result ' +
	          'in `undefined` being returned. If you need to access the same ' +
	          'value within the child component, you should pass it as a different ' +
	          'prop. (https://fb.me/react-special-props)',
	        displayName,
	      );
	    }
	  };
	  warnAboutAccessingKey.isReactWarning = true;
	  Object.defineProperty(props, 'key', {
	    get: warnAboutAccessingKey,
	    configurable: true,
	  });
	}

### defineRefPropWarningGetter ###
逻辑与defineKeyPropWarningGetter一致，锁定props.ref的值使得无法获取props.ref,标记获取props中的ref值是不合法的，当使用props.ref的时候，会执行warnAboutAccessingKey函数，进行报错，从而获取不到ref属性的值。

**ref属性不能存在于props中，否则为undefined**，即如下调用始终返回undefined:

	props.ref

### ReactElement ###
被createElement函数调用，根据环境设置对应的属性。

**代码性能优化：为提高测试环境下，element比较速度，将element的一些属性配置为不可数，for...in还是Object.keys都无法获取这些属性，提高了速度。**

开发环境比生产环境多了_store，_self，_source属性，并且props以及element被冻结，无法修改配置。

	const ReactElement = function(type, key, ref, self, source, owner, props) {
	  const element = {
	    // This tag allows us to uniquely identify this as a React Element
	    $$typeof: REACT_ELEMENT_TYPE,
	
	    // Built-in properties that belong on the element
	    type: type,
	    key: key,
	    ref: ref,
	    props: props,
	
	    // Record the component responsible for creating this element.
	    _owner: owner,
	  };
	
	  if (__DEV__) {
	    element._store = {};
	
	    // To make comparing ReactElements easier for testing purposes, we make
	    // the validation flag non-enumerable (where possible, which should
	    // include every environment we run tests in), so the test framework
	    // ignores it.
	    Object.defineProperty(element._store, 'validated', {
	      configurable: false,
	      enumerable: false,
	      writable: true,
	      value: false,
	    });
	    // self and source are DEV only properties.
	    Object.defineProperty(element, '_self', {
	      configurable: false,
	      enumerable: false,
	      writable: false,
	      value: self,
	    });
	    // Two elements created in two different places should be considered
	    // equal for testing purposes and therefore we hide it from enumeration.
	    Object.defineProperty(element, '_source', {
	      configurable: false,
	      enumerable: false,
	      writable: false,
	      value: source,
	    });
	    if (Object.freeze) {
	      Object.freeze(element.props);
	      Object.freeze(element);
	    }
	  }
	
	  return element;
	};

### createElement ###
使用 JSX 编写的代码将被转成使用 React.createElement() 

React.createElement API：

	React.createElement(
	  type,
	  [props],
	  [...children]
	)

type(类型) 参数：可以是一个标签名字字符串（例如 'div' 或'span'），或者是一个 React 组件 类型（一个类或者是函数），或者一个 React fragment 类型。

#### 仅在开发模式下props中的ref与key会报错 ####
props：将key，ref，\__self，__source的属性分别复制到新react元素的key，ref，\__self，__source上，其他的属性值，assign到type上的props上。**当这个props是react元素的props，那么其ref与key是无法传入新元素上的ref与key。只有这个props是一个新对象的时候才是有效的。这里就切断了ref与key通过props的传递。**

children：当children存在的时候，createElement返回的组件的props中不会存在children，如果存在的时候，返回的组件的props.children会被传入的children覆盖掉。

#### 参数中的children覆盖顺序 ####
如下：

	//创建Footer
	class Footer extends React.Component{
	    constructor(props){
	        super(props)
	    }
	    render(){
	        return (
	            <div>
	                this is Footer {this.props.children}
	            </div>
	        )
	    }
	}

	//创建FooterEnhance
	const FooterEnhance = React.createElement(Footer, null ,"0000000");

	//使用Footer与FooterEnhance
    <div>
        <Footer>aaaaa</Footer>
        {FooterEnhance}
    </div>

结果：

	this is Footer aaaaa
	this is Footer 0000000

可以看到：

第三个参数children覆盖掉原来的children:aaaaa

----------


由下面源码也可知道：

- 第三个参数children也可以覆盖第二参数中的children，测试很简单。
- 第二个参数props中的children会覆盖掉原来组件中的props.children

#### 返回值的使用：如{FooterEnhance}。不能当做普通组件使用。 ####

----------

#### 源码 ####

	const RESERVED_PROPS = {
	  key: true,
	  ref: true,
	  __self: true,
	  __source: true,
	};

	export function createElement(type, config, children) {
	  let propName;
	
	  // Reserved names are extracted
	  const props = {};
	
	  let key = null;
	  let ref = null;
	  let self = null;
	  let source = null;
	
	  //将config上有但是RESERVED_PROPS上没有的属性，添加到props上
	  //将config上合法的ref与key保存到内部变量ref和key
	  if (config != null) {
	    //判断config是否具有合法的ref与key，有就保存到内部变量ref和key中
	    if (hasValidRef(config)) {
	      ref = config.ref;
	    }
	    if (hasValidKey(config)) {
	      key = '' + config.key;
	    }
	
	    //保存self和source
	    self = config.__self === undefined ? null : config.__self;
	    source = config.__source === undefined ? null : config.__source;
	    // Remaining properties are added to a new props object
	    //将config上的属性值保存到props的propName属性上
	    for (propName in config) {
	      if (
	        hasOwnProperty.call(config, propName) &&
	        !RESERVED_PROPS.hasOwnProperty(propName)
	      ) {
	        props[propName] = config[propName];
	      }
	    }
	  }
	
	  // Children can be more than one argument, and those are transferred onto
	  // the newly allocated props object.
	  //  如果只有三个参数，将第三个参数直接覆盖到props.children上
	  //  如果不止三个参数，将后面的参数组成一个数组，覆盖到props.children上
	  const childrenLength = arguments.length - 2;
	  if (childrenLength === 1) {
	    props.children = children;
	  } else if (childrenLength > 1) {
	    const childArray = Array(childrenLength);
	    for (let i = 0; i < childrenLength; i++) {
	      childArray[i] = arguments[i + 2];
	    }
	    if (__DEV__) {
	      if (Object.freeze) {
	        Object.freeze(childArray);
	      }
	    }
	    props.children = childArray;
	  }
	
	  // Resolve default props
	  //  如果有默认的props值，那么将props上为undefined的属性设置初始值
	  if (type && type.defaultProps) {
	    const defaultProps = type.defaultProps;
	    for (propName in defaultProps) {
	      if (props[propName] === undefined) {
	        props[propName] = defaultProps[propName];
	      }
	    }
	  }
	  //开发环境下
	  if (__DEV__) {
	    //  需要利用defineKeyPropWarningGetter与defineRefPropWarningGetter标记新组件上的props也就是这里的props上的ref与key在获取其值得时候是不合法的。
	    if (key || ref) {
	      //type如果是个函数说明不是原生的dom标签，可能是一个组件，那么可以取
	      const displayName =
	        typeof type === 'function'
	          ? type.displayName || type.name || 'Unknown'
	          : type;
	      if (key) {
	        //在开发环境下给key属性设置错误提示相关函数
	        defineKeyPropWarningGetter(props, displayName);
	      }
	      if (ref) {
	        //在开发环境下给ref属性设置错误提示相关函数
	        defineRefPropWarningGetter(props, displayName);
	      }
	    }
	  }
	  //注意生产环境下的ref和key还是被赋值到组件上
	  return ReactElement(
	    type,
	    key,
	    ref,
	    self,
	    source,
	    ReactCurrentOwner.current,
	    props,
	  );
	}

### createFactory ###
返回一个函数，该函数生成给定类型的 React 元素。
用于将在字符串或者函数或者类转换成一个react元素，该元素的type为字符串或者函数或者类的构造函数

例如：Footer为文章的类组件

	console.log(React.createFactory('div')())
	console.log(React.createFactory(Footer)())

返回的结果分别为：

	$$typeof:Symbol(react.element)
	key:null
	props:{}
	ref:null
	type:"div"
	_owner:null
	_store:{validated: false}
	_self:null
	_source:null

----------

	$$typeof:Symbol(react.element)
	key:null
	props:{}
	ref:null
	type:ƒ Footer(props)
	_owner:null
	_store:{validated: false}
	_self:null
	_source:null

源码：

	export function createFactory(type) {
	  const factory = createElement.bind(null, type);
	  factory.type = type;
	  return factory;
	}

### cloneAndReplaceKey ###
克隆一个旧的react元素，得到的新的react元素被设置了新的key

	export function cloneAndReplaceKey(oldElement, newKey) {
	  const newElement = ReactElement(
	    oldElement.type,
	    newKey,
	    oldElement.ref,
	    oldElement._self,
	    oldElement._source,
	    oldElement._owner,
	    oldElement.props,
	  );
	
	  return newElement;
	}																					
### isValidElement ###	
判断一个对象是否是合法的react元素，即判断其$$typeof属性是否为REACT_ELEMENT_TYPE

	export function isValidElement(object) {
	  return (
	    typeof object === 'object' &&
	    object !== null &&
	    object.$$typeof === REACT_ELEMENT_TYPE
	  );
	}	

### cloneElement ###
[cloneElement官方API介绍](http://react.html.cn/docs/react-api.html#createelement)
			
	React.cloneElement(
	  element,
	  [props],
	  [...children]
	)

使用 element 作为起点，克隆并返回一个新的 React 元素。 所产生的元素的props由原始元素的 props被新的 props 浅层合并而来，并且最终合并后的props的属性为undefined，就用element.type.defaultProps也就是默认props值进行设置。如果props不是react元素的props，呢么props中的key 和 ref 将被存放在返回的新元素的key与ref上。

返回的元素相当于：

	<element.type {...element.props} {...props}>{children}</element.type>

其源码与createElement类似，不同的地方是cloneElement不会对props中的ref与key报错。





