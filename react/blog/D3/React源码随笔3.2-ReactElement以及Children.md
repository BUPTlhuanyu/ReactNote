[TOC]		  

上篇介绍了`React` 对象中与组件相关的 `API` 的实现以及各种组件种类与`ReactElement`的关系。本篇将会介绍如何创建一个 `ReactElement`，以及 `Children` 各个方法的实现原理。

```

const React = {
  // 组件
	...
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
	...
};
```



# ReactElement

先简单的回顾一下`ReactElement`与组件的关系，组件分为很多种类型，在编译时经过`babel`处理过后，最终在运行时都会通过`createELment`函数创建成为一个`ReactELement`，那么接下来首先介绍一下`ReactELement`的数据结构，然后介绍如何创建。

## 数据结构

```javascript
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
```

`$$typeof`：之前的文章提到过`$$typeof`属性表示组件的【类型】，并且其值是一个`symbol`或者是一个十六进制的数，`JSON.parse`与`JSON.stringify` 无法对这样的值进行互转，牵强的说也能够预防存储型（`xss`）攻击，比如`<div> {parsedData} </div>`。

`type`：表示组件行为，上一篇已经为绕过这个属性说明了不同类型组件与`type`的关系，组件这里不再赘述。

`key`、`ref`、`props`：常用属性，不赘述。

`_owner`：组件定义的时候所在组件对应的`ReactElement`。

## 如何创建

> creatElement函数中阻止ref、key等属性赋值给props，所以react元素的key和ref不会在props上

```javascript
function createElement(type, config, children) {
  const props = {};
  let key = null, ref = null, self = null, source = null;

  if (config != null) {
		ref = config.ref !== undefined && config.ref;
    key = config.key !== undefined && '' + config.key
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 将config上其余的属性值赋值到props相同属性上
		...
  }
	// 第三个参数或者后面参数会被处理成props.children上
    ...
  if (type && type.defaultProps) {
  	// 1. state中的值优先级大于type.defaultProps的值
    // 2. defaultProps中存在但是state中不存在的属性是无效的
    	...
  }
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current, // owner
    props,
  );
}
```

在创建`ReactElement`的过程中，会组装`props`。

**克隆一个ReactELement与之类似**：克隆给定的`element`并返回一个新的`ReactElement`元素。 所产生的元素的`props`由原始元素的` props`被新的 `props` 浅层合并而来，并且如果最终合并后的`props`的属性为`undefined`，就用`element.type.defaultProps`的值进行设置。

```
React.cloneElement(
  element,
  [props],
  [...children]
)
```

上面例子相当于：

```
<element.type {...element.props} {...props}>{children}</element.type>
```

注意这里`JSX`会借用`createElement`隐式处理`defaultProps`，因此上面表达式没有直接体现出来。

# Children

递归实现的深度优先遍历，由于需要计算树的节点个数，因此也无法使用尾递归优化，会出现爆栈的问题。简单的实现如下，也算是一个常见的算法题：

```javascript
let result = [];
function traverseChildren(children, result, callback) {
  let num = 0;
  callback(children);
  result.push(children);
	if (typeof children === 'string' | typeof children === 'number') {
      return ++num;
  } else if (Array.isArray(children)) {
      children.forEach(child = > {
        num += traverseChildren(child, result, callback)
      });
  }
  return num;
}
```

## 总结

到此`React`目录下的所有内容都介绍完毕，上篇介绍了`React` 对象中与组件相关的 `API` 的实现以及各种组件种类与`ReactElement`的关系；如何创建一个 `ReactElement`，以及 `Children` 各个方法的实现原理。

我们需要牢记一个概念， `ReactElement.$$typeof`表示组件的【类型】与``ReactElement.type`表示组件的【行为】。

后续的文章的主题将会深入`fiber`架构与时间分片。

