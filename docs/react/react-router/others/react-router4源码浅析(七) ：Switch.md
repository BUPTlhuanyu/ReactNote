---
id: react-router-switch
sidebar_label: Switch
slug: '/react/react-router/others/react-router-switch'
sidebar_position: 7
title: ''
---

### 源码 ###

	class Switch extends React.Component {
	  render() {
	    return (
	      <RouterContext.Consumer>
	        {context => {
	          invariant(context, "You should not use <Switch> outside a <Router>");
	
	          const location = this.props.location || context.location;
	
	          let element, match;
	
	          // We use React.Children.forEach instead of React.Children.toArray().find()
	          // here because toArray adds keys to all child elements and we do not want
	          // to trigger an unmount/remount for two <Route>s that render the same
	          // component at different URLs.
	            //将当前location逐个与switch下的route上的path进行匹配，遇到一个route匹配成功，后面的都不会执行if中的逻辑
	          React.Children.forEach(this.props.children, child => {
	             //如果已经匹配成功了match != null，之后if中的逻辑不会执行
	            if (match == null && React.isValidElement(child)) {
	              element = child;
	
	              const path = child.props.path || child.props.from;
	
	              match = path
	                ? matchPath(location.pathname, { ...child.props, path })
	                : context.match;
	            }
	          });
	          //渲染匹配到的route
	          return match
	            ? React.cloneElement(element, { location, computedMatch: match })
	            : null;
	        }}
	      </RouterContext.Consumer>
	    );
	  }
	}