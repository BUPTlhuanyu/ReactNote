"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[4405],{3905:function(t,e,n){n.d(e,{Zo:function(){return u},kt:function(){return m}});var r=n(7294);function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function a(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?a(Object(n),!0).forEach((function(e){o(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function c(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},a=Object.keys(t);for(r=0;r<a.length;r++)n=a[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);for(r=0;r<a.length;r++)n=a[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var s=r.createContext({}),l=function(t){var e=r.useContext(s),n=e;return t&&(n="function"==typeof t?t(e):i(i({},e),t)),n},u=function(t){var e=l(t.components);return r.createElement(s.Provider,{value:e},t.children)},p={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},h=r.forwardRef((function(t,e){var n=t.components,o=t.mdxType,a=t.originalType,s=t.parentName,u=c(t,["components","mdxType","originalType","parentName"]),h=l(n),m=o,d=h["".concat(s,".").concat(m)]||h[m]||p[m]||a;return n?r.createElement(d,i(i({ref:e},u),{},{components:n})):r.createElement(d,i({ref:e},u))}));function m(t,e){var n=arguments,o=e&&e.mdxType;if("string"==typeof t||o){var a=n.length,i=new Array(a);i[0]=h;var c={};for(var s in e)hasOwnProperty.call(e,s)&&(c[s]=e[s]);c.originalType=t,c.mdxType="string"==typeof t?t:o,i[1]=c;for(var l=2;l<a;l++)i[l]=n[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"},3769:function(t,e,n){n.r(e),n.d(e,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return l},toc:function(){return u},default:function(){return h}});var r=n(7462),o=n(3366),a=(n(7294),n(3905)),i=["components"],c={id:"react-router-summary",sidebar_label:"react-router4\u6e90\u7801\u603b\u7ed3",slug:"/react/react-router/react-router-summary"},s="Router\u4f7f\u7528\u65b9\u6cd5",l={unversionedId:"react/react-router/react-router-summary",id:"react/react-router/react-router-summary",isDocsHomePage:!1,title:"Router\u4f7f\u7528\u65b9\u6cd5",description:"`",source:"@site/docs/react/react-router/react-router4\u6e90\u7801\u6d45\u6790\u603b\u7ed3 .md",sourceDirName:"react/react-router",slug:"/react/react-router/react-router-summary",permalink:"/docs/react/react-router/react-router-summary",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react-router/react-router4\u6e90\u7801\u6d45\u6790\u603b\u7ed3 .md",tags:[],version:"current",frontMatter:{id:"react-router-summary",sidebar_label:"react-router4\u6e90\u7801\u603b\u7ed3",slug:"/react/react-router/react-router-summary"},sidebar:"react",previous:{title:"utils",permalink:"/docs/react/react-hook-form/react-hook-form-utils"},next:{title:"matchPath",permalink:"/docs/react/react-router/others/react-router-matchpath"}},u=[{value:"BrowserRouter\u521b\u5efahistory\u5b9e\u4f8b",id:"browserrouter\u521b\u5efahistory\u5b9e\u4f8b",children:[]},{value:"Router\u7ec4\u4ef6\u901a\u8fc7history\u76d1\u542clocation\u7684\u53d8\u5316",id:"router\u7ec4\u4ef6\u901a\u8fc7history\u76d1\u542clocation\u7684\u53d8\u5316",children:[]},{value:"browserhistory\u7684\u4e00\u4e9b\u7ec6\u8282",id:"browserhistory\u7684\u4e00\u4e9b\u7ec6\u8282",children:[]}],p={toc:u};function h(t){var e=t.components,n=(0,o.Z)(t,i);return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:e,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"router\u4f7f\u7528\u65b9\u6cd5"},"Router\u4f7f\u7528\u65b9\u6cd5"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'<BrowserRouter>\n    <div className="header"></div>\n    <div className="content">\n        <Switch>\n            <Route path="/" exact component={A}/>\n            <Route path="/b" exact component={B}/>\n        </Switch>\n    </div>\n    <div className="footer"></div>\n</BrowserRouter>\n')),(0,a.kt)("h2",{id:"browserrouter\u521b\u5efahistory\u5b9e\u4f8b"},"BrowserRouter\u521b\u5efahistory\u5b9e\u4f8b"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"class BrowserRouter extends React.Component {\n  history = createHistory(this.props);\n  render() {\n    return <Router history={this.history} children={this.props.children} />;\n  }\n}\n")),(0,a.kt)("p",null,"\u5728BrowserRouter\u4e2d\u4f1a\u8c03\u7528history\u5305\u4e0b\u7684createBrowserHistory\u6765\u521b\u5efa\u4e00\u4e2ahistory\u5b9e\u4f8b\uff0c\u7136\u540e\u5c06\u7ec4\u4ef6\u7684children\u4ee5\u53ca\u8fd9\u4e2ahistory\u5b9e\u4f8b\u4f20\u9012\u7ed9Router\u7ec4\u4ef6\u3002"),(0,a.kt)("h2",{id:"router\u7ec4\u4ef6\u901a\u8fc7history\u76d1\u542clocation\u7684\u53d8\u5316"},"Router\u7ec4\u4ef6\u901a\u8fc7history\u76d1\u542clocation\u7684\u53d8\u5316"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"\u4e00\u822c\u800c\u8a00props.staticContext\u662f\u4e0d\u4f1a\u88ab\u66b4\u9732\u51fa\u53bb\u7684\uff0c\u56e0\u6b64props.staticContext\u4e00\u822c\u4e3aundefined\uff0c\u6240\u4ee5Router\u7ec4\u4ef6\u9996\u5148\u5728\u6784\u9020\u51fd\u6570\u4e2d\u4f1a\u8c03\u7528history.listener\u6765\u6dfb\u52a0\u4e00\u4e2a\u56de\u8c03\u51fd\u6570\uff0c\u8fd9\u4e2a\u51fd\u6570\u7684\u6267\u884c\u4e0e\u5426\u7684\u60c5\u51b5\u6bd4\u8f83\u591a\uff0c\u540e\u7eed\u5206\u6790Link\u7ec4\u4ef6\u7684\u65f6\u5019\u4f1a\u8be6\u7ec6\u8bf4\u660e\u3002\u8fd9\u91cc\u8bf7\u7262\u8bb0\uff1aRouter\u4e2d\u4f1a\u6dfb\u52a0\u4e00\u4e2a\u56de\u8c03\u51fd\u6570\uff0c\u7528\u4e8e\u76d1\u542chistory.push\u4ee5\u53cahistory.replace\u7684\u6267\u884c\u3002\u8fd9\u4e24\u4e2a\u65b9\u6cd5\u7684\u6267\u884c\u4f1a\u5728Link\u7ec4\u4ef6\u4e2d\u8c03\u7528\u3002"),(0,a.kt)("li",{parentName:"ol"},"\u4e00\u65e6\u4e0a\u9762\u7684\u56de\u8c03\u51fd\u6570\u6267\u884c\u540e\uff0c\u4f1a\u901a\u8fc7setState\u6539\u53d8Router\u7684location\uff0c\u4ece\u800cRouterContext.Provider\u7684value\u4e5f\u5c31\u968f\u7740\u6539\u53d8\u4e86\uff0c\u6700\u7ec8\u5bfc\u81f4\u89e6\u53d1RouterContext.consumer\u7684\u66f4\u65b0\u3002")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'class Router extends React.Component {\n  static computeRootMatch(pathname) {\n    return { path: "/", url: "/", params: {}, isExact: pathname === "/" };\n  }\n  constructor(props) {\n    super(props);\n\n    this.state = {\n      location: props.history.location\n    };\n\n    this._isMounted = false;\n    this._pendingLocation = null;\n\n    if (!props.staticContext) {\n      //\u76d1\u542clocation\u7684\u53d8\u5316\uff0c\u8bbe\u7f6e\u56de\u8c03\u51fd\u6570\n      this.unlisten = props.history.listen(location => {\n        if (this._isMounted) {\n          this.setState({ location });\n        } else {\n          this._pendingLocation = location;\n        }\n      });\n    }\n  }\n  render() {\n    return (\n      <RouterContext.Provider\n        children={this.props.children || null}\n        value={{\n          history: this.props.history,\n          location: this.state.location,\n          match: Router.computeRootMatch(this.state.location.pathname),\n          staticContext: this.props.staticContext\n        }}\n      />\n    );\n  }\n}\n')),(0,a.kt)("h4",{id:"1-link\u7ec4\u4ef6\u89e6\u53d1historypush\u6216\u8005historyreplace\u6539\u53d8url\u8c03\u7528router\u901a\u8fc7historylisten\u8bbe\u7f6e\u7684\u56de\u8c03\u51fd\u6570\u6216\u8005\u76f4\u63a5\u6539\u53d8windowlocationhref"},"1. Link\u7ec4\u4ef6\u89e6\u53d1history.push\u6216\u8005history.replace\u6539\u53d8url\u8c03\u7528Router\u901a\u8fc7history.listen\u8bbe\u7f6e\u7684\u56de\u8c03\u51fd\u6570\u6216\u8005\u76f4\u63a5\u6539\u53d8window.location.href"),(0,a.kt)("p",null,"\u53ef\u4ee5\u770b\u5230\u8fd9\u4e2aLink\u5b9e\u9645\u4e0a\u5c31\u662f\u4e00\u4e2aa\u6807\u7b7e\uff0c\u7279\u522b\u9700\u8981\u6ce8\u610f\u7684\u662fa\u6807\u7b7e\u7684\u70b9\u51fb\u4e8b\u4ef6\u7684\u56de\u8c03\u51fd\u6570handleClick\uff0c\u5bf9\u4e8e\u539f\u751f\u7684a\u6807\u7b7e\u6765\u8bf4\uff0c\u70b9\u51fba\u6807\u7b7e\uff0c\u4f1a\u5c06a\u6807\u7b7e\u4e0a\u7684href\u4ee5\u53ca\u5f53\u524durl\u751f\u6210\u4e00\u4e2a\u65b0\u7684url\uff0c\u7136\u540e\u8df3\u8f6c\u3002\u6b64\u65f6\u9875\u9762\u4f1a\u53d1\u751f\u8df3\u8f6c\u3002\u56e0\u6b64\u4e3a\u4e86\u963b\u6b62\u70b9\u51fba\u6807\u7b7e\u4fee\u6539\u5730\u5740\u680f\u4ee5\u53ca\u8df3\u8f6c\uff0c\u9700\u8981\u8c03\u7528event.preventDefault()\u963b\u6b62\u9ed8\u8ba4\u7684\u8df3\u8f6c\u52a8\u4f5c\uff0c\u7136\u540e\u8c03\u7528history.push\u6216\u8005history.replace\uff0c\u4f20\u5165\u7684\u90fd\u662fLink\u4e0a\u7684props.to\u6307\u5b9a\u7684\u8def\u5f84\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'class Link extends React.Component {\n  handleClick(event, history) {\n    if (this.props.onClick) this.props.onClick(event);\n    if (\n      !event.defaultPrevented && \n      event.button === 0 && \n      (!this.props.target || this.props.target === "_self") && \n      !isModifiedEvent(event) \n    ) {\n      event.preventDefault();\n      const method = this.props.replace ? history.replace : history.push;\n      method(this.props.to);\n    }\n  }\n\n  render() {\n    const { innerRef, replace, to, ...rest } = this.props; \n    return (\n      <RouterContext.Consumer>\n        {context => {\n          const location =\n            typeof to === "string"\n              ? createLocation(to, null, null, context.location)\n              : to;\n          const href = location ? context.history.createHref(location) : "";\n          return (\n            <a\n              {...rest}\n              onClick={event => this.handleClick(event, context.history)}\n              href={href}\n              ref={innerRef}\n            />\n          );\n        }}\n      </RouterContext.Consumer>\n    );\n  }\n}\n')),(0,a.kt)("p",null,"history.push\u4e0ehistory.replace\u5728\u6d4f\u89c8\u5668\u5177\u5907history\u8fd9\u4e2aapi\u7684\u65f6\u5019\uff0c\u4f1a\u8c03\u7528history.pushState\u6216\u8005replaceState\u3002\u8fd9\u4e24\u4e2aapi\u4f1a\u6539\u53d8\u5730\u5740\u680f\u7684url\uff0c\u4f46\u662f\u4e0d\u4f1a\u89e6\u53d1\u5237\u65b0\uff0c\u4e5f\u4e0d\u4f1a\u89e6\u53d1popState\u4e8b\u4ef6\u3002\u73b0\u5728\u6765\u770bhistory.push\u5173\u952e\u4ee3\u7801\u4ee5\u53casetState\u4ee3\u7801\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-history.push"},"if (canUseHistory) {\n  globalHistory.pushState({ key, state }, null, href);\n  if (forceRefresh) {\n    window.location.href = href;\n  } else {\n    setState({ action, location });\n  }\n} else {\n  window.location.href = href;\n}\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-setState"},"  function setState(nextState) {\n    Object.assign(history, nextState);\n    history.length = globalHistory.length;\n    // \u8fd9\u91cc\u7684transitionManager.notifyListeners\u89e6\u53d1\u7684\u5c31\u662fhistory.listen\u6ce8\u518c\u7684\u76d1\u542c\u5668\uff0cRouter\u7ec4\u4ef6\u6784\u9020\u51fd\u6570\u5c31\u8c03\u7528\u4e86history.listen\u6dfb\u52a0\u4e86\u4e00\u4e2a\n    transitionManager.notifyListeners(history.location, history.action);\n  }\n")),(0,a.kt)("p",null,"\u8fd9\u91cc\u4f1a\u68c0\u6d4b\u662f\u5426\u652f\u6301\u539f\u751fhistory\uff0c\u5982\u679c\u652f\u6301\u5219pushState\uff0c\u7136\u540e\u5224\u65ad\u662f\u5426\u662fforceRefresh\uff0c\u5982\u679c\u662f\u5219\u6539\u53d8window.location.href\uff0c\u8fd9\u4e2a\u8d4b\u503c\u64cd\u4f5c\u4f1a\u89e6\u53d1\u6d4f\u89c8\u5668\u7684\u5237\u65b0\u3002\u5982\u679c\u4e0d\u9700\u8981forceRefresh\uff0c\u5219\u8c03\u7528setState\u8c03\u7528Router\u8bbe\u7f6e\u7684\u76d1\u542c\u51fd\u6570\uff0c\u8be5\u51fd\u6570\u4f1a\u6539\u53d8Router\u7684state.location\u4ece\u800c\u6765\u5c55\u793a\u4e0d\u540c\u7684\u7ec4\u4ef6\u3002\u5982\u679c\u4e0d\u652f\u6301\u539f\u751fhistory\uff0c\u90a3\u4e48\u76f4\u63a5\u6539\u53d8window.location.href\u3002"),(0,a.kt)("p",null,"\u5bf9\u4e8ehistory.replace\u5bf9\u5e94\u7684\u4f1a\u8c03\u7528replaceState\u6216\u8005window.location.replace(href)\u3002"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"==history\u8def\u7531\u4f1a\u51fa\u73b0\u4e00\u4e2a\u95ee\u9898=="),"\uff1a\u901a\u8fc7window.location.href\u6539\u53d8\u4ee5\u53ca\u624b\u52a8\u5237\u65b0\u9875\u9762\u53ef\u80fd\u4f1a\u51fa\u73b0\u627e\u4e0d\u5230\u9875\u9762\u7684\u9519\u8bef\u53d1\u751f\u3002\u8fd9\u65f6\u5019\u9700\u8981\u5728nginx\u4e0a\u914d\u7f6etry files\u6765\u6307\u5b9a\u627e\u4e0d\u5230\u8def\u5f84\u7684\u65f6\u5019\u9700\u8981\u8fd4\u56de\u9ed8\u8ba4\u7684html\u6587\u4ef6\uff0c\u8fd4\u56de\u4e4b\u540e\u524d\u7aef\u8def\u7531\u624d\u4f1a\u6839\u636e\u5f53\u524d\u7684url\u6765\u6e32\u67d3\u6307\u5b9a\u7684\u7ec4\u4ef6\u3002"),(0,a.kt)("h4",{id:"21-location\u53d8\u5316\u5bfc\u81f4switch\u66f4\u65b0switch\u6839\u636elocationpathname\u9009\u62e9\u4e00\u4e2aroute\u6765\u6e32\u67d3"},"2.1 location\u53d8\u5316\u5bfc\u81f4Switch\u66f4\u65b0\uff0cSwitch\u6839\u636elocation.pathname\u9009\u62e9\u4e00\u4e2aRoute\u6765\u6e32\u67d3"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'class Switch extends React.Component {\n  render() {\n    return (\n      <RouterContext.Consumer>\n        {context => {\n          invariant(context, "You should not use <Switch> outside a <Router>");\n          const location = this.props.location || context.location;\n          let element, match;\n          React.Children.forEach(this.props.children, child => {\n            if (match == null && React.isValidElement(child)) {\n              element = child;\n              const path = child.props.path || child.props.from;\n              match = path\n                ? matchPath(location.pathname, { ...child.props, path })\n                : context.match;\n            }\n          });\n          return match\n            ? React.cloneElement(element, { location, computedMatch: match })\n            : null;\n        }}\n      </RouterContext.Consumer>\n    );\n  }\n}\n')),(0,a.kt)("p",null,"Switch\u7ec4\u4ef6\u662f\u4e00\u4e2aRouterContext.Consumer\u3002\u5176value\u7684\u63d0\u4f9b\u65b9\u5c31\u662fRouter\u7684RouterContext.provider\u7684value\u3002\u5f53provider\u7684value\u53d1\u751f\u53d8\u5316\u7684\u65f6\u5019\uff0c\u4e5f\u5c31\u662flocation\u53d1\u751f\u53d8\u5316\u7684\u65f6\u5019\uff0c\u8fd9\u4e2aSwitch\u7ec4\u4ef6\u5c31\u4f1a\u66f4\u65b0\uff0c\u6240\u4ee5\u4e3a\u4ec0\u4e48\u8def\u7531\u5207\u6362\u7684\u65f6\u5019\u7ec4\u4ef6\u53ef\u4ee5\u53d8\u5316\uff0c\u539f\u56e0\u5c31\u662f\u8fd9\u91cc\u3002location\u53d8\u5316\u5bfc\u81f4Switch\u66f4\u65b0\uff0c\u90a3\u4e48Switch\u66f4\u65b0\u662f\u5982\u4f55\u6e32\u67d3\u4e0d\u540c\u7684\u7ec4\u4ef6\u5462\uff1f"),(0,a.kt)("p",null,"\u4eceSwitch\u7684\u6e90\u7801\u53ef\u4ee5\u770b\u5230\uff0c\u6bcf\u6b21\u66f4\u65b0\u7684\u65f6\u5019\u8fd4\u56de\u7684\u662felement\uff0c\u8fd9\u4e2aelement\u5219\u662f\u901a\u8fc7\u4eceSwitch\u7684children\u5373\u591a\u4e2a==Route==\u7ec4\u4ef6\u4e2d\u7684\u4e00\u4e2a\u3002\u5982\u4f55\u6311\u9009\u5462\uff1f\u5229\u7528React.Children.forEach\u6311\u9009\u51fa\u7b2c\u4e00\u4e2a\u8def\u5f84\u4e0elocation.pathname\u5339\u914d\u7684\u90a3\u4e2aRoute\u3002\u5982\u679c\u4f60\u6df1\u5165\u5339\u914d\u89c4\u5219\uff0c\u53ef\u4ee5\u770b\u5230\u53d1\u73b0Route\u4e0a\u4e0d\u6dfb\u52a0exact\u53c2\u6570\uff0c\u53ef\u80fd\u5bfc\u81f4\u524d\u9762\u7684\u8def\u7531\u5f71\u54cd\u5230\u540e\u9762Route\u7684\u5339\u914d\u7684\u539f\u56e0\u3002"),(0,a.kt)("p",null,"\u5c0f\u7ed3\uff1a==location\u53d8\u5316\u5bfc\u81f4Switch\u66f4\u65b0\uff0cSwitch\u66f4\u65b0\u4f1a\u901a\u8fc7props.lcation.pathname\u4eceprops.children\u4e2d\u6311\u9009\u7b2c\u4e00\u4e2a\u5339\u914d\u5230\u7684Route\uff0c\u6e32\u67d3\u8fd9\u4e2aRoute\u7ec4\u4ef6\u5c31\u80fd\u6e32\u67d3\u4e0d\u540c\u7684\u89c6\u56fe\u7ec4\u4ef6\u4e86==\u3002"),(0,a.kt)("h4",{id:"22-route\u6e32\u67d3\u5bf9\u5e94\u7684\u7ec4\u4ef6\u4ee5\u53ca\u5355\u72ec\u4f7f\u7528\u7684\u65f6\u5019location\u53d8\u5316\u4e5f\u4f1a\u5f15\u8d77route\u7684\u66f4\u65b0"},"2.2 Route\u6e32\u67d3\u5bf9\u5e94\u7684\u7ec4\u4ef6\u4ee5\u53ca\u5355\u72ec\u4f7f\u7528\u7684\u65f6\u5019\uff0clocation\u53d8\u5316\u4e5f\u4f1a\u5f15\u8d77Route\u7684\u66f4\u65b0"),(0,a.kt)("p",null,"\u5982\u679cRoute\u5728Switch\u4e2d\u4f7f\u7528\uff0c\u90a3\u4e48Switch\u4f1a\u5c06location.pathname\u548cRoute\u7684porps.path\u8fdb\u884cmatch\uff0cRoute\u4f1a\u6839\u636e\u8fd9\u4e2amath\u662f\u5426\u5b58\u5728\u6765\u5224\u65ad\u662f\u5426\u5339\u914d\u6210\u529f\uff0c\u5982\u679cRoute\u5355\u72ec\u4f7f\u7528\uff0c\u5219Route\u81ea\u5df1\u4f1a\u5c06location.pathname\u548cRoute\u7684porps.path\u8fdb\u884cmatch\u3002\u6e32\u67d3\u7684\u65f6\u5019\uff0c\u4f18\u5148\u7ea7\u4ece\u9ad8\u5230\u4f4echildren/component/render\u3002"),(0,a.kt)("p",null,"\u6ce8\u610f\uff1a\u4ed3\u5e93\u4e2d\u7684\u4ee3\u7801\u662f2018\u5e74\u7684react-router\uff0c\u4e4b\u524dRoute\u8fd9\u5757\u903b\u8f91\u662f\u9519\u8bef\u7684\uff0c\u76ee\u524d\u65b0\u7248\u5df2\u7ecf\u4fee\u6b63\u4e86\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'class Route extends React.Component {\n  render() {\n    return (\n      <RouterContext.Consumer>\n        {context => {\n          const location = this.props.location || context.location;\n          const match = this.props.computedMatch\n            ? this.props.computedMatch // <Switch> already computed the match for us\n            : this.props.path\n              ? matchPath(location.pathname, this.props)\n              : context.match;          \n          const props = { ...context, location, match };\n          let { children, component, render } = this.props;\n          return (\n            <RouterContext.Provider value={props}>\n              {props.match?  // \u5982\u679c\u8def\u5f84\u5339\u914d\u6210\u529f\u4e86\n                children?  // children\u5b58\u5728\n                    typeof children === "function"?  // \u5982\u679cchildren\u662f\u4e2a\u51fd\u6570\n                      children(props)\n                      : \n                      children\n                    : \n                    component? //\u5f53component\u5b58\u5728\u7684\u65f6\u5019\uff0c\u540e\u7eed\u6267\u884c\u7ed3\u679c\u4e3aReact.createElement(component, props)\uff0cprops\u5408\u5e76\u5230component\u4e0a\n                      React.createElement(component, props)\n                        : \n                      render?  // render\u5b58\u5728\n                        render(props)\n                        : \n                        null\n                  : \n                null\n              }\n            </RouterContext.Provider>\n          );\n        }}\n      </RouterContext.Consumer>\n    );\n  }\n}\n')),(0,a.kt)("p",null,"\u95ee\u9898\u6765\u4e86\uff0cRoute\u4f5c\u4e3aSwitch\u7684\u5b50\u7ec4\u4ef6\uff0c\u5f53location\u53d8\u5316\u7684\u65f6\u5019\uff0c\u7531\u4e8eRoute\u4ee5\u53caSwitch\u90fd\u662fConsumer\uff0c\u5e76\u4e14\u6700\u8fd1\u7684provider\u90fd\u662fRouter\uff0c\u90a3\u4e48Route\u4f1a\u66f4\u65b0\u4e24\u904d\u5417\uff1f\u7b54\u6848\u662f\u4e0d\u4f1a\uff0c\u56e0\u4e3aRouter\u63d0\u4f9b\u7684provider\u53d8\u5316\u7684\u65f6\u5019\uff0c\u5df2\u7ecf\u5bfc\u81f4\u4e86Switch\u7684\u66f4\u65b0\uff0c\u4ece\u800c\u5bf9\u5e94\u7684Route\u4e5f\u66f4\u65b0\u4e86\uff0c\u800cRoute\u7684Consumer\u53d1\u73b0provider\u53d8\u5316\u7684\u65f6\u5019\uff0c\u81ea\u5df1\u7684context\u5df2\u7ecf\u66f4\u65b0\u8fc7\u4e86\uff0c\u6240\u4ee5\u4e0d\u4f1a\u518drender\u4e00\u904d\u3002"),(0,a.kt)("h2",{id:"browserhistory\u7684\u4e00\u4e9b\u7ec6\u8282"},"browserhistory\u7684\u4e00\u4e9b\u7ec6\u8282"),(0,a.kt)("p",null,"browserhistory\u53ef\u4ee5\u76d1\u542c\u5230url\u7684\u53d8\u5316\u5e76\u66f4\u65b0\u6bcf\u4e2aconsumer\u7684\u7ec4\u4ef6\uff0c\u5e76\u4e14\u76f4\u63a5\u8c03\u7528history.go\u6216\u8005history.back()\u6216\u8005history.forward()\u6765\u6539\u53d8url\u4f1a\u89e6\u53d1popState\u4e8b\u4ef6\uff0c\u5e76\u5728\u5bf9\u5e94\u7684\u4e8b\u4ef6\u56de\u8c03\u51fd\u6570\u4e2d\u6539\u53d8Router\u7ec4\u4ef6\u7684state\uff0c\u4ece\u800c\u66f4\u65b0\u6bcf\u4e2aconsumer\u7684\u7ec4\u4ef6\u3002history.go\u540c\u65f6\u8fd8\u80fd\u591f\u5728\u5404\u4e2a\u9875\u9762\u4e4b\u524d\u65f6\u5149\u7a7f\u68ad\u3002"),(0,a.kt)("p",null,"\u5728\u4f60\u6d4f\u89c8\u4e00\u4e2a\u9875\u9762\u5f53history.length\u8bb0\u5f55\u6709n\u6761\u7684\u65f6\u5019\uff0c\u70b9\u51fb\u6d4f\u89c8\u5668\u7684\u56de\u9000\u6309\u94ae\uff0c\u56de\u9000\u5230n-3\u6761\u8bb0\u5f55\uff0c\u7136\u540e\u70b9\u51fb\u9875\u9762\u7684\u6309\u94ae\u8df3\u8f6c\uff0c\u4f60\u4f1a\u53d1\u73b0\u6b64\u65f6history.length\u4e3an-2\u3002\u56e0\u4e3a\u7ed9\u6d4f\u89c8\u5668\u7684history\u6dfb\u52a0\u5386\u53f2\u8bb0\u5f55\u7684\u65f6\u5019\uff0c\u4f1a\u5220\u9664\u5f53\u524d\u6240\u5728history\u7684\u4f4d\u7f6e\u540e\u9762\u7684\u6240\u6709\u5386\u53f2\u8bb0\u5f55\uff0c\u7136\u540e\u518d\u6dfb\u52a0\u4e00\u6761\u65b0\u7684\u3002"))}h.isMDXComponent=!0}}]);