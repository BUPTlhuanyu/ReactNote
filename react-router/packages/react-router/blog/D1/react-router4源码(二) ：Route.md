## Route ##
### 使用 ###

##### 用Route渲染组件的三种方式： #####

	<Route component>
	<Route render>
	<Route children>

优先级从高到低，其他的将被忽略。

##### Route自动传入的Porps： #####

	match
	location
	history

##### Route自定义Porps #####

	sensitive： 对path大小写敏感
	strict   ： 对path中的"/"敏感
	exact    ： 对path精确匹配
    path     ： 路径匹配
    location ： 可用于route切换的过渡动画

### 源码分析 ###

	class Route extends React.Component {
	  render() {
	    return (
	      <RouterContext.Consumer>
	        {context => {
	          invariant(context, "You should not use <Route> outside a <Router>");
	
	          const location = this.props.location || context.location;
	          const match = this.props.computedMatch
	            ? this.props.computedMatch // <Switch> already computed the match for us
	            : this.props.path
	              ? matchPath(location.pathname, this.props)
	              : context.match;
	
	          const props = { ...context, location, match };
	
	          let { children, component, render } = this.props;
	
	          // Preact uses an empty array as children by
	          // default, so use null if that's the case.
	          if (Array.isArray(children) && children.length === 0) {
	            children = null;
	          }
	
	          if (typeof children === "function") {
	            children = children(props);
	
	            if (children === undefined) {
	              if (__DEV__) {
	                const { path } = this.props;
	
	                warning(
	                  false,
	                  "You returned `undefined` from the `children` function of " +
	                    `<Route${path ? ` path="${path}"` : ""}>, but you ` +
	                    "should have returned a React element or `null`"
	                );
	              }
	
	              children = null;
	            }
	          }
	
	          return (
	              // Route可以通过children,component,render来渲染路径对应的组件，优先级从高到低。
	            <RouterContext.Provider value={props}>
	              {children && !isEmptyChildren(children) //如果children存在并且非空则返回children
	                ? children
	                : props.match //不存在children时，并且路径匹配的时候返回后续执行结果
	                  ? component //当component存在的时候，后续执行结果为React.createElement(component, props)，props合并到component上
	                    ? React.createElement(component, props)
	                    : render  //当component不存在，返回后续结果
	                      ? render(props)//route上props中存在render的时候，后续结果为render(props)
	                      : null //当render不存在，返回null
	                  : null}
	            </RouterContext.Provider>
	          );
	        }}
	      </RouterContext.Consumer>
	    );
	  }
	}