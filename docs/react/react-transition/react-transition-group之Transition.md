---
id: react-transition-group-transition
sidebar_label: react-transition-group-transition
title: ''
sidebar_position: 1
slug: '/react/react-transition/react-transition-group-transition'
---

阅读本文你会获得：

- 一个相应的使用案例请看[项目react-music-lhy](https://github.com/BUPTlhuanyu/react-music-lhy)，文档在blog中[基于react-transition-group的react过渡动画](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D4/react%E5%8A%A8%E7%94%BBCSSTransition.md)找到：组件挂载与卸载动画的可以借助appear以及onExit回调函数实现。案例中onExit回调函数主要用于通过路由跳转卸载组件。

- 一个比较有用的技巧：本文中工具函数一节的safeSetState函数；以及TransitionGroup种dom-helpers工具库的使用以及封装。

react-transition-group[官方指南](https://reactcommunity.org/react-transition-group/transition)，结合react-router的项目使用案例请参照[此文档](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D4/react%E5%8A%A8%E7%94%BBCSSTransition.md)

全文中提到的第一次挂载与挂载的概念是指：Transition单独使用的时候，不区分第一挂载与其他挂载，只有在父组件是TransitionGroup的时候才区分。这可以从constructor中如下代码看出来：

```javascript
//  初始化appear：
//  当单独使用Transition没有被TransitionGroup包裹时，appear = props.appear
//  当被TransitionGroup包裹的时候，TransitionGroup处于正在挂载阶段，子组件Transition是第一次挂载，因此appear = props.appear
//  当被TransitionGroup包裹的时候，TransitionGroup已经挂载完成，说明子组件Transition之前挂载并卸载过，因此appear = props.enter
let parentGroup = context.transitionGroup
let appear = parentGroup && !parentGroup.isMounting ? props.enter : props.appear
```

appear主要用于设置：this.appearStatus = ENTERING，详细分析可以参考后续对constructor的分析。

## Props介绍 ##

### children ###
	type: Function | element
	required

某个状态下需要过渡效果的目标组件，可以是函数

	<Transition timeout={150}>
	  {(status) => (
	    <MyComponent className={`fade fade-${status}`} />
	  )}
	</Transition>

**每个状态'entering', 'entered', 'exiting', 'exited', 'unmounted'的时候执行的回调函数，上面代码实现的是，每一个状态就给某个子组件增加一个过渡样式，可以非常灵活的给任意组件增加样式，实现过渡效果。**

### in ###
	type: boolean
	default: false
用于在enter与exit状态之间翻转，默认为false，表示不挂载组件或者处于exit状态。

### mountOnEnter ###
	type: boolean
	default: false
在第一次in={true}即挂载的时候，设置mountOnEnter={true}表示延迟挂载，懒加载组件。

### unmountOnExit ###
	type: boolean
	default: false
如果为true，在组件处于exited状态的时候，卸载组件。

### appear ###
	type: boolean
	default: false
如果为true，在组件挂载的时候，展示过渡动画。默认为false，第一次挂载过渡动画不生效。


### enter ###
	type: boolean
	default: true
如果为true，表示允许enter状态的过渡动画生效，默认为true

### exit ###
	type: boolean
	default: true
如果为true，表示允许exit状态的过渡动画生效，默认为true

### addEndListener ###
	type: Function
过渡动画结束时执行的毁掉函数

### timeout ###
	type: number | { enter?: number, exit?: number }
addEndListener存在的时候，需要设置timeout，表示过渡动画时间

	timeout={{
	 enter: 300, //enter状态动画时间
	 exit: 500,  //exit状态动画时间
	}}

### onEnter，onEntering，onEntered ###
	type: Function(node: HtmlElement, isAppearing: bool)
	default: function noop() {}

源码内部，status分别为entering前后，entered之后执行的回调函数，CSSTransition组件即是利用这三个回调函数给组件增加不同的样式，利用CSS动画实现过渡效果。

### onExit，onExiting，onExited ###
	type: Function(node: HtmlElement) -> void
	default: function noop() {}

源码内部，status分别为exiting前后，exited之后执行的回调函数，CSSTransition组件即是利用这三个回调函数给组件增加不同的样式，利用CSS动画实现过渡效果。


## 源码工具函数 ##

### getTimeouts函数 ###

	// 通过设置props.timeout，获取各个组件不同状态下的timeout
	  getTimeouts() {
	    const { timeout } = this.props
	    let exit, enter, appear
	
	    exit = enter = appear = timeout
	
	    if (timeout != null && typeof timeout !== 'number') {
	      exit = timeout.exit
	      enter = timeout.enter
	      appear = timeout.appear
	    }
	    return { exit, enter, appear }
	  }

### setNextCallback函数：将函数封装为只可执行一次的自毁回调函数 ###
	//setNextCallback为一个闭包
	    // 传入一个回调函数,返回一个只能执行一次回调函数的函数,可以手动取消回调函数的执行
		//执行一次之后自毁
	  setNextCallback(callback) {
	    //标志位active用于保证只执行一次callback
	    let active = true
	
	    this.nextCallback = event => {
	      if (active) {
	        active = false
	        //  垃圾回收
	        this.nextCallback = null
	
	        callback(event)
	      }
	    }
	
	    //用于手动取消回调函数的执行
	    this.nextCallback.cancel = () => {
	      active = false
	    }
	
	    return this.nextCallback
	  }

### safeSetState函数：确保setState回调函数只执行一次 ###

	  safeSetState(nextState, callback) {
	    // This shouldn't be necessary, but there are weird race conditions with
	    // setState callbacks and unmounting in testing, so always make sure that
	    // we can cancel any pending setState callbacks after we unmount.
	    callback = this.setNextCallback(callback)
	    //  callback执行一次之后不再允许执行
	    this.setState(nextState, callback)
	  }

### onTransitionEnd函数 ###
入场或者退场过渡动画结束之后，根据addEndListener以及timeout执行自毁回调函数handler

	 // handler为入场或者退场过渡动画结束之后的处理函数
	  onTransitionEnd(node, timeout, handler) {
	    //给this.nextCallback重新设置回调函数
	    this.setNextCallback(handler)
	
	    //  无论是否设置了addEndListener还是timeout，this.nextCallback都只执行一次
	    //  执行时机并不确定，这里经常会存在一些与预期不符的现象
	    if (node) {
	      //如果设置了addEndListener，并且监听了事件，则事件触发变执行this.nextCallback
	      if (this.props.addEndListener) {
	        // 执行自定义的过渡动画结束后的回调函数
	        this.props.addEndListener(node, this.nextCallback)
	      }
	      //如果设置了timeout，则timeout之后执行this.nextCallback
	      if (timeout != null) {
	        setTimeout(this.nextCallback, timeout)
	      }
	    } else {
	      setTimeout(this.nextCallback, 0)
	    }
	  }

### updateStatus ###

	 //在挂载阶段与更新阶段根据nextStatus的状态执行入场或者退场动画
	  updateStatus(mounting = false, nextStatus){...}

----------
# 源码分析 #
## 挂载阶段 ##
### constructor ###
根据是否是第一次挂载，是否被TransitionGroup包裹，来设置组件的初始state。涉及到的props有:
enter，appear，in


		// 组件Transition挂载阶段
	  constructor(props, context) {
	    super(props, context)
	
	    //  初始化appear：
	    //  当单独使用Transition没有被TransitionGroup包裹时，appear = props.appear
	    //  当被TransitionGroup包裹的时候，TransitionGroup处于正在挂载阶段，子组件Transition是第一次挂载，因此appear = props.appear
	    //  当被TransitionGroup包裹的时候，TransitionGroup已经挂载完成，说明子组件Transition之前挂载并卸载过，因此appear = props.enter
	    let parentGroup = context.transitionGroup
	    let appear =
	      parentGroup && !parentGroup.isMounting ? props.enter : props.appear
	
	    let initialStatus
	
	    this.appearStatus = null
	      
	    //  初始化this.appearStatus以及this.state.status
	    //  挂载的时候:
	    //  in = true && appear = true : this.state.status = EXITED , this.appearStatus = ENTERING
	    //  in = true && appear = false : this.state.status = ENTERED
	    //  in = false && ( unmountOnExit = true || mountOnEnter = true ) : this.state.status = UNMOUNTED
	    //  in = false && unmountOnExit = false && mountOnEnter = fasle : this.state.status = EXITED
	    if (props.in) {
	      if (appear) {
	        initialStatus = EXITED
	        this.appearStatus = ENTERING
	      } else {
	        initialStatus = ENTERED
	      }
	    } else {
	      if (props.unmountOnExit || props.mountOnEnter) {
	        initialStatus = UNMOUNTED
	      } else {
	        initialStatus = EXITED
	      }
	    }
	
	    this.state = { status: initialStatus }
	
	    this.nextCallback = null
	  }

### getDerivedStateFromProps ###
挂载阶段该函数返回null，不需要对state修改

	static getDerivedStateFromProps({ in: nextIn }, prevState) {
	    // 挂载阶段if条件为false，返回null，不需要对state修改
	    // 更新阶段，在执行退场动画的时候，可能会返回{ status: EXITED }
	    if (nextIn && prevState.status === UNMOUNTED) {
	      return { status: EXITED }
	    }
	    return null
	  }

### render ###
	render() {
	    const status = this.state.status
	
	    //挂载阶段：
	      // in = false && ( unmountOnExit = true || mountOnEnter = true )，Transition不会渲染任何组件
	    if (status === UNMOUNTED) {
	      return null
	    }
	
	    //挂载阶段：
	      //  in = true && appear = true : this.state.status = EXITED , this.appearStatus = ENTERING
	      //  in = true && appear = false : this.state.status = ENTERED
	      //  in = false && unmountOnExit = false && mountOnEnter = fasle : this.state.status = EXITED
	    const { children, ...childProps } = this.props
	    // filter props for Transtition
	    //  滤除与Transtition组件功能相关的props，其他的props依旧可以正常传入需要过渡效果的业务组件
	    delete childProps.in
	    delete childProps.mountOnEnter
	    delete childProps.unmountOnExit
	    delete childProps.appear
	    delete childProps.enter
	    delete childProps.exit
	    delete childProps.timeout
	    delete childProps.addEndListener
	    delete childProps.onEnter
	    delete childProps.onEntering
	    delete childProps.onEntered
	    delete childProps.onExit
	    delete childProps.onExiting
	    delete childProps.onExited
	
	    //  当children === 'function'，children函数可以根据组件状态执行相应逻辑
	    // (status) => (
	    //     <MyComponent className={`fade fade-${status}`} />
	    //   )
	    if (typeof children === 'function') {
	      return children(status, childProps)
	    }
	
	    //React.Children.only判断是否只有一个子组件，如果是则返回这个子组件，如果不是则抛出一个错误
	    const child = React.Children.only(children)
	    return React.cloneElement(child, childProps)
	  }

### componentDidMount ###
开始执行

	  componentDidMount() {
	    // 第一次挂载的时候，如果in = true && appear = true，则appearStatus=ENTERING，否则为null。
	    this.updateStatus(true, this.appearStatus)
	  }

其中updateStatus函数为：appearStatus = ENTERING的时候执行performEnter

	updateStatus(mounting = false, nextStatus) {
	    if (nextStatus !== null) {
	      // 挂载阶段：如果nextStatus !== null，则只会出现 nextStatus = ENTERING
	        // in = true && appear = true：nextStatus = ENTERING
	        
	      // nextStatus will always be ENTERING or EXITING.
	      this.cancelNextCallback()  // 挂载阶段无操作
	      const node = ReactDOM.findDOMNode(this) // 挂载阶段找到真实DOM
	
	      //  挂载阶段：如果in = true && appear = true，则执行performEnter
	      if (nextStatus === ENTERING) {
	        this.performEnter(node, mounting)
	      } else {
	        this.performExit(node)
	      }
	    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
	      this.setState({ status: UNMOUNTED })
	    }
	  }

其中performEnter函数为：执行onEnter回调函数 --> 设置{ status: ENTERING } --> 执行onEntering回调函数 --> 监听onTransitionEnd过渡动画是否完成  --> 设置{ status: ENTERED } --> 执行onEntered回调函数

	performEnter(node, mounting) {
	    const { enter } = this.props
	    //  挂载阶段：如果in = true && appear = true，则appearing = true
	    const appearing = this.context.transitionGroup
	      ? this.context.transitionGroup.isMounting
	      : mounting
	
	    //  获取timeouts
	    const timeouts = this.getTimeouts()
	
	    //  挂载阶段以下if代码不执行
	    // no enter animation skip right to ENTERED
	    // if we are mounting and running this it means appear _must_ be set
	    if (!mounting && !enter) {
	      this.safeSetState({ status: ENTERED }, () => {
	        this.props.onEntered(node)
	      })
	      return
	    }
	
	    //执行props.onEnter函数
	    //挂载阶段，如果in = true && appear = true，则appearing始终为true
	    // 如果在Transition组件上设置onEnter函数，可以通过获取该函数第二参数来获取第一次挂载的时候是否是enter
	    this.props.onEnter(node, appearing)
	
	    //  改变{ status: ENTERING }，改变之后执行一次回调函数
	    this.safeSetState({ status: ENTERING }, () => {
	      // 将状态设置为ENTERING之后，开始执行过渡动画
	      this.props.onEntering(node, appearing)
	
	      // FIXME: appear timeout?
	      //  timeouts.enter为入场enter的持续时间
	      // 过渡动画结束，设置{ status: ENTERED }，执行onEntered回调函数
	      this.onTransitionEnd(node, timeouts.enter, () => {
	        //将状态设置为ENTERED，然后再执行onEntered回调函数
	        this.safeSetState({ status: ENTERED }, () => {
	          this.props.onEntered(node, appearing)
	        })
	      })
	    })
  }


## 更新阶段 ##
### getDerivedStateFromProps ###
	 static getDerivedStateFromProps({ in: nextIn }, prevState) {
	    // 更新阶段：
	      // 如果挂载阶段in=true,那么第一次更新if条件中prevState.status!== UNMOUNTED
	      // 如果挂载阶段in=false,并且(props.mountOnEnter=true||props.mountOnEnter=true)
	      // 那么第一次更新if条件中prevState.status === UNMOUNTED，可以通过in的翻转改变
	      // 如果(props.mountOnEnter=true||props.mountOnEnter=true)的时候,设置状态status的状态为EXITED
	    if (nextIn && prevState.status === UNMOUNTED) {
	      return { status: EXITED }
	    }
	    return null
	  }

### render ###
与挂载阶段分析类似，组件保持原来状态。

### componentDidUpdate ###

	componentDidUpdate(prevProps) {
	    let nextStatus = null
	    if (prevProps !== this.props) {
	      const { status } = this.state
	
	      if (this.props.in) {
	        //根据in=true判断此时需要进行入场动画
	        if (status !== ENTERING && status !== ENTERED) {
	          //如果当前状态既不是正在入场也不是已经入场，则将下一个状态置为正在入场
	          nextStatus = ENTERING
	        }
	      } else {
	          //根据in=false判断此时需要进行退场动画
	        if (status === ENTERING || status === ENTERED) {
	            //如果当前状态是正在入场或者已经入场，则将下一个状态置为退场
	          nextStatus = EXITING
	        }
	      }
	    }
	    //更新状态，执行过渡动画，第一参数表示是否正在挂载
		//如果Transition组件更新但是prevProps没有变化，有可能是多余的重新。因此将nextStatus为null
	    this.updateStatus(false, nextStatus)
	  }
其中updateStatus函数为：

		updateStatus(mounting = false, nextStatus) {
		    if (nextStatus !== null) {
		      // nextStatus will always be ENTERING or EXITING.
		      this.cancelNextCallback()  // 挂载阶段无操作
		      const node = ReactDOM.findDOMNode(this) // 挂载阶段找到真实DOM
		
		      	//  更新阶段nextStatus只有两种状态ENTERING与EXITING：
        		// 如果为ENTERING执行入场，EXITING执行退场
		      if (nextStatus === ENTERING) {
		        this.performEnter(node, mounting)
		      } else {
		        this.performExit(node)
		      }
		    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
		      this.setState({ status: UNMOUNTED })
		    }
	  }

其中退场动画performExit函数为

	//与performEnter逻辑相似
	  performExit(node) {
	    const { exit } = this.props
	    const timeouts = this.getTimeouts()
	
	    // no exit animation skip right to EXITED
	    if (!exit) {
	      this.safeSetState({ status: EXITED }, () => {
	        this.props.onExited(node)
	      })
	      return
	    }
	    this.props.onExit(node)
	
	    this.safeSetState({ status: EXITING }, () => {
	      this.props.onExiting(node)
	
	      this.onTransitionEnd(node, timeouts.exit, () => {
	        this.safeSetState({ status: EXITED }, () => {
	          this.props.onExited(node)
	        })
	      })
	    })
	  }

## 总结 ##
本文根据组件生命周期详细的分析了react-transition-group中关键组件Transition的源码，工作流程。CSSTransition组件就是对Transition组件的封装，在其props.onEnter等等组件上添加对应的class实现css的动画。该组件库还有一个比较重要的地方就是TransitionGroup组件如何管理子组件动画，弄清这个是实现复杂动画逻辑的关键。

