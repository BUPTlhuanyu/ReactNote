### withRouter中wrappedComponentRef的用法 ###
**与Link中的innerRef一样都是回调ref**

使用withRouter：

	// MyComponent.js
	export default withRouter(MyComponent)

Container.js使用MyComponent

	class Container extends React.Component {
	  componentDidMount() {
	    this.component.doSomething()
	  }
	
	  render() {
	    return (
	      <MyComponent wrappedComponentRef={element => this.component = element}/>
	    )
	  }
	}
在MyComponent将wrappedComponentRef作为props传入被包裹的组件的ref属性上，在被包裹的组件挂载之后，会调用wrappedComponentRef函数，并将被包裹组件的DOM 元素的ref引用传入Container组件的this.component对象上。因此在Container组件上可以调用被包裹组件实例上定义的所有方法。


----------

***注意：***在使用typescript以及react-redux的connect，以及withRouter包裹组件的时候，需要添加如下代码，将组件自身的props传入propType中。

	const mapStateToProps((state:any,ownProps:any)=>{
		...ownProps,
		data:state.data
	})

----------

### 源码分析 ###

	function withRouter(Component) {
	  //C为由高阶组件withRouter产生的包裹组件，该包裹组件C为纯函数
	  const C = props => {
	    //remainingProps为除wrappedComponentRef之外的props数据
	    const { wrappedComponentRef, ...remainingProps } = props;
	
	    return (
	      <Route
	          //routeComponentProps:Route组件上props = { ...context, location, match }
	        children={routeComponentProps => (
	          <Component
	            {...remainingProps}
	            {...routeComponentProps}
	            //利用回调ref将被包裹组件wrappedComponent的ref引用提供给其他组件使用。
	              // React 将在组件挂载时将 DOM 元素传入ref 回调函数并调用，当卸载时传入 null 并调用它。
	              // 在componentDidMout 和 componentDidUpdate 触发之前，Refs 保证是最新的。
	            ref={wrappedComponentRef}
	          />
	        )}
	      />
	    );
	  };
	
	  C.displayName = `withRouter(${Component.displayName || Component.name})`;
	  C.WrappedComponent = Component;
	
	  if (__DEV__) {
	    C.propTypes = {
	      wrappedComponentRef: PropTypes.func
	    };
	  }
	
	  return hoistStatics(C, Component);
	}