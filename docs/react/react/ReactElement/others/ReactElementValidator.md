---
id: react-element-validator
sidebar_label: ReactElementValidator
slug: '/react/react/ReactElement/others/react-element-validator'
sidebar_position: 6
title: ''
---

1. react遇到React.Fragment标签，先验证器检测是否符合规范，再调用createElement创建reactElement。
2. React.Fragment允许传入的属性有key,children，不能传入ref以及其他属性，因为React.Fragment最终不会渲染成一个真实DOM，所以ref引用到的是null，因此不能传入ref作为属性。


----------

### 部分函数列表 ###

	getDeclarationErrorAddendum ------ 返回字符串，内容为：检查ReactCurrentOwner.current.type上的render方法
	getSourceInfoErrorAddendum ------- 返回字符串，内容为：检查某个文件下的某一行代码
	getCurrentComponentErrorInfo ----- 错误提示，在ReactCurrentOwner.current不存在的时候，提示检查parentType上的render
	validateExplicitKey -------------- 对传入的组件是否具有key进行错误处理
	validateChildKeys ---------------- 对传入的node中的每个element判断是否存在key
	validatePropTypes ---------------- 检查propTypes的否大小写正确，类组件或者函数组件设置默认prop只能用defaultProps，getDefaultProps只能用于React.createClass中

### validateFragmentProps ###
React.Fragment 也是通过createElement创建的。
React.Fragment 只能有key和children作为其属性。
React.Fragment 特别注意不能传入ref作为其属性，因为React.Fragment不会渲染成一个真实的DOM，自然不会允许有ref。

	<React.Fragment key111="Fragment 只能有key和children作为其属性"
	
	children111="Fragment 只能有key和children作为其属性"
	ref={{"some":"Fragment 也不能使用ref获取引用"}}
	key="允许的"
	children="允许的,貌似没什么用，真实的children就是React.Fragment包裹的内容"
	    >
	    Some text.
	<h2>A heading</h2>
	</React.Fragment>

### createElementWithValidation ###

1. 先检查传入的type是否是合法的element类型，见isValidElementType，如果不是抛出错误
2. 如果是则将type, props, children等参数传入createElement生成对应的react元素
3. 然后调用validateChildKeys对参数children的每个element判断是否存在key
4. 接着，如果type类型是REACT_FRAGMENT_TYPE，调用validateFragmentProps检查Fragment上的属性（这里函数名为props不妥，key与ref不算是props中的，attributes比较好），其他type类型的元素的props的规则一致。
5. 最后如果验证成功，返回创建的element。


### createFactoryWithValidation ###
工厂函数，对createElementWithValidation的封装，返回一个函数，该函数用于创建一个element

	export function createFactoryWithValidation(type) {
	  const validatedFactory = createElementWithValidation.bind(null, type);
	  validatedFactory.type = type;
	  return validatedFactory;
	}

### cloneElementWithValidation ###
返回一个REACT\_ELEMENT\_TYPE类型的元素，其type属性值为传入的element，

	
	export function cloneElementWithValidation(element, props, children) {
	  const newElement = cloneElement.apply(this, arguments);
	  for (let i = 2; i < arguments.length; i++) {
	    validateChildKeys(arguments[i], newElement.type);
	  }
	  //newElement为REACT_ELEMENT_TYPE类型，所以不许要判断是否是REACT_FRAGMENT_TYPE类型
	  validatePropTypes(newElement);
	  return newElement;
	}

这个函数在开发环境下会作为React.cloneElement方法。而在生产环境下ReactElement.js中的cloneElement会作为React.cloneElement方法。

例1：children作为属性

	ReactDOM.render(
	    <React.Fragment children={["child","child","child"]}/>,
	    document.getElementById('app')
	);

例2：

	let ReactFragment1 = React.cloneElement(<React.Fragment children={["child","child","child"]}/>,{xxx:"这会被添加到新组件的props上"})
	console.log("ReactFragment1",ReactFragment1)
	console.log("ReactFragment1",React.Fragment)
	
	ReactDOM.render(
	    ReactFragment1,
	    document.getElementById('app')
	);





