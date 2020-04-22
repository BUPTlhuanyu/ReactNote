# Router使用方法
```
<BrowserRouter>
    <div className="header"></div>
    <div className="content">
        <Switch>
            <Route path="/" exact component={A}/>
            <Route path="/b" exact component={B}/>
        </Switch>
    </div>
    <div className="footer"></div>
</BrowserRouter>
```

## BrowserRouter创建history实例

```
class BrowserRouter extends React.Component {
  history = createHistory(this.props);
  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}
```
在BrowserRouter中会调用history包下的createBrowserHistory来创建一个history实例，然后将组件的children以及这个history实例传递给Router组件。

## Router组件通过history监听location的变化
1. 一般而言props.staticContext是不会被暴露出去的，因此props.staticContext一般为undefined，所以Router组件首先在构造函数中会调用history.listener来添加一个回调函数，这个函数的执行与否的情况比较多，后续分析Link组件的时候会详细说明。这里请牢记：Router中会添加一个回调函数，用于监听history.push以及history.replace的执行。这两个方法的执行会在Link组件中调用。
2. 一旦上面的回调函数执行后，会通过setState改变Router的location，从而RouterContext.Provider的value也就随着改变了，最终导致触发RouterContext.consumer的更新。



```
class Router extends React.Component {
  static computeRootMatch(pathname) {
    return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
  }
  constructor(props) {
    super(props);

    this.state = {
      location: props.history.location
    };

    this._isMounted = false;
    this._pendingLocation = null;

    if (!props.staticContext) {
      //监听location的变化，设置回调函数
      this.unlisten = props.history.listen(location => {
        if (this._isMounted) {
          this.setState({ location });
        } else {
          this._pendingLocation = location;
        }
      });
    }
  }
  render() {
    return (
      <RouterContext.Provider
        children={this.props.children || null}
        value={{
          history: this.props.history,
          location: this.state.location,
          match: Router.computeRootMatch(this.state.location.pathname),
          staticContext: this.props.staticContext
        }}
      />
    );
  }
}
```

#### 1. Link组件触发history.push或者history.replace改变url调用Router通过history.listen设置的回调函数或者直接改变window.location.href

可以看到这个Link实际上就是一个a标签，特别需要注意的是a标签的点击事件的回调函数handleClick，对于原生的a标签来说，点击a标签，会将a标签上的href以及当前url生成一个新的url，然后跳转。此时页面会发生跳转。因此为了阻止点击a标签修改地址栏以及跳转，需要调用event.preventDefault()阻止默认的跳转动作，然后调用history.push或者history.replace，传入的都是Link上的props.to指定的路径。

```
class Link extends React.Component {
  handleClick(event, history) {
    if (this.props.onClick) this.props.onClick(event);
    if (
      !event.defaultPrevented && 
      event.button === 0 && 
      (!this.props.target || this.props.target === "_self") && 
      !isModifiedEvent(event) 
    ) {
      event.preventDefault();
      const method = this.props.replace ? history.replace : history.push;
      method(this.props.to);
    }
  }

  render() {
    const { innerRef, replace, to, ...rest } = this.props; 
    return (
      <RouterContext.Consumer>
        {context => {
          const location =
            typeof to === "string"
              ? createLocation(to, null, null, context.location)
              : to;
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
```
history.push与history.replace在浏览器具备history这个api的时候，会调用history.pushState或者replaceState。这两个api会改变地址栏的url，但是不会触发刷新，也不会触发popState事件。现在来看history.push关键代码以及setState代码：

```history.push
if (canUseHistory) {
  globalHistory.pushState({ key, state }, null, href);
  if (forceRefresh) {
    window.location.href = href;
  } else {
    setState({ action, location });
  }
} else {
  window.location.href = href;
}
```

```setState
  function setState(nextState) {
    Object.assign(history, nextState);
    history.length = globalHistory.length;
    // 这里的transitionManager.notifyListeners触发的就是history.listen注册的监听器，Router组件构造函数就调用了history.listen添加了一个
    transitionManager.notifyListeners(history.location, history.action);
  }
```

这里会检测是否支持原生history，如果支持则pushState，然后判断是否是forceRefresh，如果是则改变window.location.href，这个赋值操作会触发浏览器的刷新。如果不需要forceRefresh，则调用setState调用Router设置的监听函数，该函数会改变Router的state.location从而来展示不同的组件。如果不支持原生history，那么直接改变window.location.href。

对于history.replace对应的会调用replaceState或者window.location.replace(href)。

**==history路由会出现一个问题==**：通过window.location.href改变以及手动刷新页面可能会出现找不到页面的错误发生。这时候需要在nginx上配置try files来指定找不到路径的时候需要返回默认的html文件，返回之后前端路由才会根据当前的url来渲染指定的组件。


#### 2.1 location变化导致Switch更新，Switch根据location.pathname选择一个Route来渲染

```
class Switch extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          invariant(context, "You should not use <Switch> outside a <Router>");
          const location = this.props.location || context.location;
          let element, match;
          React.Children.forEach(this.props.children, child => {
            if (match == null && React.isValidElement(child)) {
              element = child;
              const path = child.props.path || child.props.from;
              match = path
                ? matchPath(location.pathname, { ...child.props, path })
                : context.match;
            }
          });
          return match
            ? React.cloneElement(element, { location, computedMatch: match })
            : null;
        }}
      </RouterContext.Consumer>
    );
  }
}
```

Switch组件是一个RouterContext.Consumer。其value的提供方就是Router的RouterContext.provider的value。当provider的value发生变化的时候，也就是location发生变化的时候，这个Switch组件就会更新，所以为什么路由切换的时候组件可以变化，原因就是这里。location变化导致Switch更新，那么Switch更新是如何渲染不同的组件呢？

从Switch的源码可以看到，每次更新的时候返回的是element，这个element则是通过从Switch的children即多个==Route==组件中的一个。如何挑选呢？利用React.Children.forEach挑选出第一个路径与location.pathname匹配的那个Route。如果你深入匹配规则，可以看到发现Route上不添加exact参数，可能导致前面的路由影响到后面Route的匹配的原因。

小结：==location变化导致Switch更新，Switch更新会通过props.lcation.pathname从props.children中挑选第一个匹配到的Route，渲染这个Route组件就能渲染不同的视图组件了==。

#### 2.2 Route渲染对应的组件以及单独使用的时候，location变化也会引起Route的更新

如果Route在Switch中使用，那么Switch会将location.pathname和Route的porps.path进行match，Route会根据这个math是否存在来判断是否匹配成功，如果Route单独使用，则Route自己会将location.pathname和Route的porps.path进行match。渲染的时候，优先级从高到低children/component/render。

注意：仓库中的代码是2018年的react-router，之前Route这块逻辑是错误的，目前新版已经修正了。
```
class Route extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          const location = this.props.location || context.location;
          const match = this.props.computedMatch
            ? this.props.computedMatch // <Switch> already computed the match for us
            : this.props.path
              ? matchPath(location.pathname, this.props)
              : context.match;          
          const props = { ...context, location, match };
          let { children, component, render } = this.props;
          return (
            <RouterContext.Provider value={props}>
              {props.match?  // 如果路径匹配成功了
                children?  // children存在
                    typeof children === "function"?  // 如果children是个函数
                      children(props)
                      : 
                      children
                    : 
                    component? //当component存在的时候，后续执行结果为React.createElement(component, props)，props合并到component上
                      React.createElement(component, props)
                        : 
                      render?  // render存在
                        render(props)
                        : 
                        null
                  : 
                null
              }
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
```
问题来了，Route作为Switch的子组件，当location变化的时候，由于Route以及Switch都是Consumer，并且最近的provider都是Router，那么Route会更新两遍吗？答案是不会，因为Router提供的provider变化的时候，已经导致了Switch的更新，从而对应的Route也更新了，而Route的Consumer发现provider变化的时候，自己的context已经更新过了，所以不会再render一遍。


## browserhistory的一些细节
browserhistory可以监听到url的变化并更新每个consumer的组件，并且直接调用history.go或者history.back()或者history.forward()来改变url会触发popState事件，并在对应的事件回调函数中改变Router组件的state，从而更新每个consumer的组件。history.go同时还能够在各个页面之前时光穿梭。

在你浏览一个页面当history.length记录有n条的时候，点击浏览器的回退按钮，回退到n-3条记录，然后点击页面的按钮跳转，你会发现此时history.length为n-2。因为给浏览器的history添加历史记录的时候，会删除当前所在history的位置后面的所有历史记录，然后再添加一条新的。




