这简要分析一下Link的实现原理，面试中经常被问到的一个问题就是：vue-router以及react-router中利用hitstory的api进行路由跳转，为什么会在点击Link的时候页面不跳转？禁止a标签的点击事件的默认行为阻止跳转，利用history.pushState以及replaceState改变url。后一部分在history库中实现。history库的原理分析放在ToDoList吧，这里就不给出了。

直接看源码，很简单就不啰嗦了：

	//Link接受除innerRef, replace, to之外的props有：onClick，target
	class Link extends React.Component {
	  //阻止点击事件跳转页面
	  handleClick(event, history) {
	    //如果Link组件有一个onClick作为props，则会先执行onClick方法。
	    if (this.props.onClick) this.props.onClick(event);
	
	    if (
	      !event.defaultPrevented && // onClick prevented default
	      //    https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/button
	      //    正常情况下event.button === 0代表鼠标左键被按下
	      event.button === 0 && // ignore everything but left clicks
	      (!this.props.target || this.props.target === "_self") && // let browser handle "target=_blank" etc.
	      !isModifiedEvent(event) // ignore clicks with modifier keys
	    ) {
	      //阻止点击a标签的默认行为：不会根据a上的href改变location.href跳转页面
	      event.preventDefault();
	      //  replace，默认为push，
	      //  这在history库中通过调用history.replaceState()或者history.pushState()来改变url
	      //  这两个api不会触发popstate事件
	      const method = this.props.replace ? history.replace : history.push;
	      //replace或者push一个路径到history
	      method(this.props.to);
	    }
	  }
	
	  render() {
	    const { innerRef, replace, to, ...rest } = this.props; // eslint-disable-line no-unused-vars
	
	    return (
	      <RouterContext.Consumer>
	        {context => {
	          invariant(context, "You should not use <Link> outside a <Router>");
	
	          const location =
	            typeof to === "string"
	              ? createLocation(to, null, null, context.location)
	              : to;
	          {/*在阻止了a标签的点击事件的默认行为之后，这个href在这里貌似没有作用了*/}
	          const href = location ? context.history.createHref(location) : "";
	
	          return (
	            <a
	              {...rest}
	              onClick={event => this.handleClick(event, context.history)}
	              href={href}
	              ref={innerRef}
	            />
	          );
	        }}
	      </RouterContext.Consumer>
	    );
	  }
	}