import * as PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import { polyfill } from 'react-lifecycles-compat'

import { timeoutsShape } from './utils/PropTypes'

export const UNMOUNTED = 'unmounted'
export const EXITED = 'exited'
export const ENTERING = 'entering'
export const ENTERED = 'entered'
export const EXITING = 'exiting'

/**
 * The Transition component lets you describe a transition from one component
 * state to another _over time_ with a simple declarative API. Most commonly
 * it's used to animate the mounting and unmounting of a component, but can also
 * be used to describe in-place transition states as well.
 *
 * By default the `Transition` component does not alter the behavior of the
 * component it renders, it only tracks "enter" and "exit" states for the components.
 * It's up to you to give meaning and effect to those states. For example we can
 * add styles to a component when it enters or exits:
 *
 * ```jsx
 * import Transition from 'react-transition-group/Transition';
 *
 * const duration = 300;
 *
 * const defaultStyle = {
 *   transition: `opacity ${duration}ms ease-in-out`,
 *   opacity: 0,
 * }
 *
 * const transitionStyles = {
 *   entering: { opacity: 0 },
 *   entered:  { opacity: 1 },
 * };
 *
 * const Fade = ({ in: inProp }) => (
 *   <Transition in={inProp} timeout={duration}>
 *     {(state) => (
 *       <div style={{
 *         ...defaultStyle,
 *         ...transitionStyles[state]
 *       }}>
 *         I'm a fade Transition!
 *       </div>
 *     )}
 *   </Transition>
 * );
 * ```
 *
 * As noted the `Transition` component doesn't _do_ anything by itself to its child component.
 * What it does do is track transition states over time so you can update the
 * component (such as by adding styles or classes) when it changes states.
 *
 * There are 4 main states a Transition can be in:
 *  - `'entering'`
 *  - `'entered'`
 *  - `'exiting'`
 *  - `'exited'`
 *
 * Transition state is toggled via the `in` prop. When `true` the component begins the
 * "Enter" stage. During this stage, the component will shift from its current transition state,
 * to `'entering'` for the duration of the transition and then to the `'entered'` stage once
 * it's complete. Let's take the following example:
 *
 * ```jsx
 * state = { in: false };
 *
 * toggleEnterState = () => {
 *   this.setState({ in: true });
 * }
 *
 * render() {
 *   return (
 *     <div>
 *       <Transition in={this.state.in} timeout={500} />
 *       <button onClick={this.toggleEnterState}>Click to Enter</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * When the button is clicked the component will shift to the `'entering'` state and
 * stay there for 500ms (the value of `timeout`) before it finally switches to `'entered'`.
 *
 * When `in` is `false` the same thing happens except the state moves from `'exiting'` to `'exited'`.
 *
 * ## Timing
 *
 * Timing is often the trickiest part of animation, mistakes can result in slight delays
 * that are hard to pin down. A common example is when you want to add an exit transition,
 * you should set the desired final styles when the state is `'exiting'`. That's when the
 * transition to those styles will start and, if you matched the `timeout` prop with the
 * CSS Transition duration, it will end exactly when the state changes to `'exited'`.
 *
 * > **Note**: For simpler transitions the `Transition` component might be enough, but
 * > take into account that it's platform-agnostic, while the `CSSTransition` component
 * > [forces reflows](https://github.com/reactjs/react-transition-group/blob/5007303e729a74be66a21c3e2205e4916821524b/src/CSSTransition.js#L208-L215)
 * > in order to make more complex transitions more predictable. For example, even though
 * > classes `example-enter` and `example-enter-active` are applied immediately one after
 * > another, you can still transition from one to the other because of the forced reflow
 * > (read [this issue](https://github.com/reactjs/react-transition-group/issues/159#issuecomment-322761171)
 * > for more info). Take this into account when choosing between `Transition` and
 * > `CSSTransition`.
 */
class Transition extends React.Component {
  static contextTypes = {
    transitionGroup: PropTypes.object,
  }
  static childContextTypes = {
    transitionGroup: () => {},
  }

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

  getChildContext() {
    return { transitionGroup: null } // allows for nested Transitions
  }

  static getDerivedStateFromProps({ in: nextIn }, prevState) {
    // 挂载阶段if条件始终为false，返回null，不需要对state修改
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

  // getSnapshotBeforeUpdate(prevProps) {
  //   let nextStatus = null

  //   if (prevProps !== this.props) {
  //     const { status } = this.state

  //     if (this.props.in) {
  //       if (status !== ENTERING && status !== ENTERED) {
  //         nextStatus = ENTERING
  //       }
  //     } else {
  //       if (status === ENTERING || status === ENTERED) {
  //         nextStatus = EXITING
  //       }
  //     }
  //   }

  //   return { nextStatus }
  // }

  componentDidMount() {
    // 第一次挂载的时候，如果in = true && appear = true，则appearStatus=ENTERING，否则为null
    this.updateStatus(true, this.appearStatus)
  }

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

  componentWillUnmount() {
    this.cancelNextCallback()
  }

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

  //在挂载阶段与更新阶段根据nextStatus的状态执行入场或者退场动画
  updateStatus(mounting = false, nextStatus) {
    if (nextStatus !== null) {
      // 挂载阶段：如果nextStatus !== null，则只会出现 nextStatus = ENTERING
        // in = true && appear = true：nextStatus = ENTERING

      // nextStatus will always be ENTERING or EXITING.
      this.cancelNextCallback()  // 挂载阶段无操作
      const node = ReactDOM.findDOMNode(this) // 挂载阶段找到真实DOM

      //  挂载阶段：如果in = true && appear = true，则执行performEnter
      //  更新阶段nextStatus只有两种状态ENTERING与EXITING：
        // 如果为ENTERING执行入场，EXITING执行退场
      if (nextStatus === ENTERING) {
        this.performEnter(node, mounting)
      } else {
        this.performExit(node)
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      //当组件被强制进行多余的重新渲染，并且组件状态为exited && unmountOnExit=true
      //  那么将组件置为UNMOUNTED状态
      this.setState({ status: UNMOUNTED })
    }
  }

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

  cancelNextCallback() {
    // 挂载阶段无操作
    if (this.nextCallback !== null) {
      this.nextCallback.cancel()
      this.nextCallback = null
    }
  }

  safeSetState(nextState, callback) {
    // This shouldn't be necessary, but there are weird race conditions with
    // setState callbacks and unmounting in testing, so always make sure that
    // we can cancel any pending setState callbacks after we unmount.
    callback = this.setNextCallback(callback)
    //  callback执行一次之后不再允许执行
    this.setState(nextState, callback)
  }

  //setNextCallback为一个闭包
    // 传入一个回调函数,返回一个只能执行一次回调函数的函数,可以手动取消回调函数的执行
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
}

Transition.propTypes = {
  /**
   * A `function` child can be used instead of a React element.
   * This function is called with the current transition status
   * ('entering', 'entered', 'exiting', 'exited', 'unmounted'), which can be used
   * to apply context specific props to a component.
   *
   * ```jsx
   * <Transition timeout={150}>
   *   {(status) => (
   *     <MyComponent className={`fade fade-${status}`} />
   *   )}
   * </Transition>
   * ```
   */
  children: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.element.isRequired,
  ]).isRequired,

  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,

  /**
   * By default the child component is mounted immediately along with
   * the parent `Transition` component. If you want to "lazy mount" the component on the
   * first `in={true}` you can set `mountOnEnter`. After the first enter transition the component will stay
   * mounted, even on "exited", unless you also specify `unmountOnExit`.
   */
  mountOnEnter: PropTypes.bool,

  /**
   * By default the child component stays mounted after it reaches the `'exited'` state.
   * Set `unmountOnExit` if you'd prefer to unmount the component after it finishes exiting.
   */
  unmountOnExit: PropTypes.bool,

  /**
   * Normally a component is not transitioned if it is shown when the `<Transition>` component mounts.
   * If you want to transition on the first mount set `appear` to `true`, and the
   * component will transition in as soon as the `<Transition>` mounts.
   *
   * > Note: there are no specific "appear" states. `appear` only adds an additional `enter` transition.
   */
  appear: PropTypes.bool,

  /**
   * Enable or disable enter transitions.
   */
  enter: PropTypes.bool,

  /**
   * Enable or disable exit transitions.
   */
  exit: PropTypes.bool,

  /**
   * The duration of the transition, in milliseconds.
   * Required unless `addEndListener` is provided
   *
   * You may specify a single timeout for all transitions like: `timeout={500}`,
   * or individually like:
   *
   * ```jsx
   * timeout={{
   *  enter: 300,
   *  exit: 500,
   * }}
   * ```
   *
   * @type {number | { enter?: number, exit?: number }}
   */
  timeout: (props, ...args) => {
    let pt = timeoutsShape
    if (!props.addEndListener) pt = pt.isRequired
    return pt(props, ...args)
  },

  /**
   * Add a custom transition end trigger. Called with the transitioning
   * DOM node and a `done` callback. Allows for more fine grained transition end
   * logic. **Note:** Timeouts are still used as a fallback if provided.
   *
   * ```jsx
   * addEndListener={(node, done) => {
   *   // use the css transitionend event to mark the finish of a transition
   *   node.addEventListener('transitionend', done, false);
   * }}
   * ```
   */
  addEndListener: PropTypes.func,

  /**
   * Callback fired before the "entering" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool) -> void
   */
  onEnter: PropTypes.func,

  /**
   * Callback fired after the "entering" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool)
   */
  onEntering: PropTypes.func,

  /**
   * Callback fired after the "entered" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool) -> void
   */
  onEntered: PropTypes.func,

  /**
   * Callback fired before the "exiting" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExit: PropTypes.func,

  /**
   * Callback fired after the "exiting" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExiting: PropTypes.func,

  /**
   * Callback fired after the "exited" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExited: PropTypes.func,
}

// Name the function so it is clearer in the documentation
function noop() {}

Transition.defaultProps = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  enter: true,
  exit: true,

  onEnter: noop,
  onEntering: noop,
  onEntered: noop,

  onExit: noop,
  onExiting: noop,
  onExited: noop,
}

Transition.UNMOUNTED = 0
Transition.EXITED = 1
Transition.ENTERING = 2
Transition.ENTERED = 3
Transition.EXITING = 4

export default polyfill(Transition)
