## 准备 ##
	import invariant from 'shared/invariant';
	import lowPriorityWarning from 'shared/lowPriorityWarning';
	
	import ReactNoopUpdateQueue from './ReactNoopUpdateQueue';
	
	const emptyObject = {};
	//__DEV__为true表示开发环境
	if (__DEV__) {
	  Object.freeze(emptyObject);
	}

## Component ##

### Component构造函数 ###
定义Component构造函数

	function Component(props, context, updater) {
	  this.props = props;
	  this.context = context;
	  this.refs = emptyObject;
	  // 默认为ReactNoopUpdateQueue，在实例化的时候为updater
	  this.updater = updater || ReactNoopUpdateQueue;
	}

### Component原型方法：isReactComponent ###

	Component.prototype.isReactComponent

### Component原型方法：setState ###
参数合法的时候，调用this.updater.enqueueSetState来更新组件的state。

	Component.prototype.setState = function(partialState, callback) {
	  //不变性，保证传入setState的是一个对象或者函数，否则报错。
	  invariant(
	    typeof partialState === 'object' ||
	      typeof partialState === 'function' ||
	      partialState == null,
	    'setState(...): takes an object of state variables to update or a ' +
	      'function which returns an object of state variables.',
	  );
	  this.updater.enqueueSetState(this, partialState, callback, 'setState');
	};	

### Component原型方法：forceUpdate ###		
调用this.updater.enqueueForceUpdate强制更新

	Component.prototype.forceUpdate = function(callback) {
	  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
	};

			

## PureComponent ##

通过组合寄生继承的方式继承Component，PureComponent类具有Component原型对象上的所有方法包括setState，forceUpdate，isReactComponent。另外还具备Component原型对象上没有的isPureReactComponent属性,其值为true，表示为纯函数组件。	

	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;
	
	/**
	 * Convenience component with default shallow equality check for sCU.
	 */
	function PureComponent(props, context, updater) {
	  this.props = props;
	  this.context = context;
	  // If a component has string refs, we will assign a different object later.
	  this.refs = emptyObject;
	  this.updater = updater || ReactNoopUpdateQueue;
	}
	
	const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
	pureComponentPrototype.constructor = PureComponent;
	// Avoid an extra prototype jump for these methods.
	Object.assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = true;	