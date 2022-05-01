"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[1831],{3905:function(t,e,n){n.d(e,{Zo:function(){return l},kt:function(){return m}});var r=n(7294);function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function i(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function s(t,e){if(null==t)return{};var n,r,a=function(t,e){if(null==t)return{};var n,r,a={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(a[n]=t[n]);return a}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(a[n]=t[n])}return a}var p=r.createContext({}),u=function(t){var e=r.useContext(p),n=e;return t&&(n="function"==typeof t?t(e):o(o({},e),t)),n},l=function(t){var e=u(t.components);return r.createElement(p.Provider,{value:e},t.children)},d={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},c=r.forwardRef((function(t,e){var n=t.components,a=t.mdxType,i=t.originalType,p=t.parentName,l=s(t,["components","mdxType","originalType","parentName"]),c=u(n),m=a,E=c["".concat(p,".").concat(m)]||c[m]||d[m]||i;return n?r.createElement(E,o(o({ref:e},l),{},{components:n})):r.createElement(E,o({ref:e},l))}));function m(t,e){var n=arguments,a=e&&e.mdxType;if("string"==typeof t||a){var i=n.length,o=new Array(i);o[0]=c;var s={};for(var p in e)hasOwnProperty.call(e,p)&&(s[p]=e[p]);s.originalType=t,s.mdxType="string"==typeof t?t:a,o[1]=s;for(var u=2;u<i;u++)o[u]=n[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},4270:function(t,e,n){n.r(e),n.d(e,{assets:function(){return l},contentTitle:function(){return p},default:function(){return m},frontMatter:function(){return s},metadata:function(){return u},toc:function(){return d}});var r=n(3117),a=n(102),i=(n(7294),n(3905)),o=["components"],s={id:"react-transition-group-transition",sidebar_label:"react-transition-group-transition",title:"",sidebar_position:1,slug:"/react/react-transition/react-transition-group-transition"},p=void 0,u={unversionedId:"react/react-transition/react-transition-group-transition",id:"react/react-transition/react-transition-group-transition",title:"",description:"\u9605\u8bfb\u672c\u6587\u4f60\u4f1a\u83b7\u5f97\uff1a",source:"@site/docs/react/react-transition/react-transition-group\u4e4bTransition.md",sourceDirName:"react/react-transition",slug:"/react/react-transition/react-transition-group-transition",permalink:"/ReactNote/docs/react/react-transition/react-transition-group-transition",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react-transition/react-transition-group\u4e4bTransition.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{id:"react-transition-group-transition",sidebar_label:"react-transition-group-transition",title:"",sidebar_position:1,slug:"/react/react-transition/react-transition-group-transition"},sidebar:"react",previous:{title:"Link",permalink:"/ReactNote/docs/react/react-router/others/react-router-link"}},l={},d=[{value:"Props\u4ecb\u7ecd",id:"props\u4ecb\u7ecd",level:2},{value:"children",id:"children",level:3},{value:"in",id:"in",level:3},{value:"mountOnEnter",id:"mountonenter",level:3},{value:"unmountOnExit",id:"unmountonexit",level:3},{value:"appear",id:"appear",level:3},{value:"enter",id:"enter",level:3},{value:"exit",id:"exit",level:3},{value:"addEndListener",id:"addendlistener",level:3},{value:"timeout",id:"timeout",level:3},{value:"onEnter\uff0conEntering\uff0conEntered",id:"onenteronenteringonentered",level:3},{value:"onExit\uff0conExiting\uff0conExited",id:"onexitonexitingonexited",level:3},{value:"\u6e90\u7801\u5de5\u5177\u51fd\u6570",id:"\u6e90\u7801\u5de5\u5177\u51fd\u6570",level:2},{value:"getTimeouts\u51fd\u6570",id:"gettimeouts\u51fd\u6570",level:3},{value:"setNextCallback\u51fd\u6570\uff1a\u5c06\u51fd\u6570\u5c01\u88c5\u4e3a\u53ea\u53ef\u6267\u884c\u4e00\u6b21\u7684\u81ea\u6bc1\u56de\u8c03\u51fd\u6570",id:"setnextcallback\u51fd\u6570\u5c06\u51fd\u6570\u5c01\u88c5\u4e3a\u53ea\u53ef\u6267\u884c\u4e00\u6b21\u7684\u81ea\u6bc1\u56de\u8c03\u51fd\u6570",level:3},{value:"safeSetState\u51fd\u6570\uff1a\u786e\u4fddsetState\u56de\u8c03\u51fd\u6570\u53ea\u6267\u884c\u4e00\u6b21",id:"safesetstate\u51fd\u6570\u786e\u4fddsetstate\u56de\u8c03\u51fd\u6570\u53ea\u6267\u884c\u4e00\u6b21",level:3},{value:"onTransitionEnd\u51fd\u6570",id:"ontransitionend\u51fd\u6570",level:3},{value:"updateStatus",id:"updatestatus",level:3},{value:"\u6302\u8f7d\u9636\u6bb5",id:"\u6302\u8f7d\u9636\u6bb5",level:2},{value:"constructor",id:"constructor",level:3},{value:"getDerivedStateFromProps",id:"getderivedstatefromprops",level:3},{value:"render",id:"render",level:3},{value:"componentDidMount",id:"componentdidmount",level:3},{value:"\u66f4\u65b0\u9636\u6bb5",id:"\u66f4\u65b0\u9636\u6bb5",level:2},{value:"getDerivedStateFromProps",id:"getderivedstatefromprops-1",level:3},{value:"render",id:"render-1",level:3},{value:"componentDidUpdate",id:"componentdidupdate",level:3},{value:"\u603b\u7ed3",id:"\u603b\u7ed3",level:2}],c={toc:d};function m(t){var e=t.components,n=(0,a.Z)(t,o);return(0,i.kt)("wrapper",(0,r.Z)({},c,n,{components:e,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"\u9605\u8bfb\u672c\u6587\u4f60\u4f1a\u83b7\u5f97\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"\u4e00\u4e2a\u76f8\u5e94\u7684\u4f7f\u7528\u6848\u4f8b\u8bf7\u770b",(0,i.kt)("a",{parentName:"p",href:"https://github.com/BUPTlhuanyu/react-music-lhy"},"\u9879\u76eereact-music-lhy"),"\uff0c\u6587\u6863\u5728blog\u4e2d",(0,i.kt)("a",{parentName:"p",href:"https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D4/react%E5%8A%A8%E7%94%BBCSSTransition.md"},"\u57fa\u4e8ereact-transition-group\u7684react\u8fc7\u6e21\u52a8\u753b"),"\u627e\u5230\uff1a\u7ec4\u4ef6\u6302\u8f7d\u4e0e\u5378\u8f7d\u52a8\u753b\u7684\u53ef\u4ee5\u501f\u52a9appear\u4ee5\u53caonExit\u56de\u8c03\u51fd\u6570\u5b9e\u73b0\u3002\u6848\u4f8b\u4e2donExit\u56de\u8c03\u51fd\u6570\u4e3b\u8981\u7528\u4e8e\u901a\u8fc7\u8def\u7531\u8df3\u8f6c\u5378\u8f7d\u7ec4\u4ef6\u3002")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"\u4e00\u4e2a\u6bd4\u8f83\u6709\u7528\u7684\u6280\u5de7\uff1a\u672c\u6587\u4e2d\u5de5\u5177\u51fd\u6570\u4e00\u8282\u7684safeSetState\u51fd\u6570\uff1b\u4ee5\u53caTransitionGroup\u79cddom-helpers\u5de5\u5177\u5e93\u7684\u4f7f\u7528\u4ee5\u53ca\u5c01\u88c5\u3002"))),(0,i.kt)("p",null,"react-transition-group",(0,i.kt)("a",{parentName:"p",href:"https://reactcommunity.org/react-transition-group/transition"},"\u5b98\u65b9\u6307\u5357"),"\uff0c\u7ed3\u5408react-router\u7684\u9879\u76ee\u4f7f\u7528\u6848\u4f8b\u8bf7\u53c2\u7167",(0,i.kt)("a",{parentName:"p",href:"https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D4/react%E5%8A%A8%E7%94%BBCSSTransition.md"},"\u6b64\u6587\u6863")),(0,i.kt)("p",null,"\u5168\u6587\u4e2d\u63d0\u5230\u7684\u7b2c\u4e00\u6b21\u6302\u8f7d\u4e0e\u6302\u8f7d\u7684\u6982\u5ff5\u662f\u6307\uff1aTransition\u5355\u72ec\u4f7f\u7528\u7684\u65f6\u5019\uff0c\u4e0d\u533a\u5206\u7b2c\u4e00\u6302\u8f7d\u4e0e\u5176\u4ed6\u6302\u8f7d\uff0c\u53ea\u6709\u5728\u7236\u7ec4\u4ef6\u662fTransitionGroup\u7684\u65f6\u5019\u624d\u533a\u5206\u3002\u8fd9\u53ef\u4ee5\u4ececonstructor\u4e2d\u5982\u4e0b\u4ee3\u7801\u770b\u51fa\u6765\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},"//  \u521d\u59cb\u5316appear\uff1a\n//  \u5f53\u5355\u72ec\u4f7f\u7528Transition\u6ca1\u6709\u88abTransitionGroup\u5305\u88f9\u65f6\uff0cappear = props.appear\n//  \u5f53\u88abTransitionGroup\u5305\u88f9\u7684\u65f6\u5019\uff0cTransitionGroup\u5904\u4e8e\u6b63\u5728\u6302\u8f7d\u9636\u6bb5\uff0c\u5b50\u7ec4\u4ef6Transition\u662f\u7b2c\u4e00\u6b21\u6302\u8f7d\uff0c\u56e0\u6b64appear = props.appear\n//  \u5f53\u88abTransitionGroup\u5305\u88f9\u7684\u65f6\u5019\uff0cTransitionGroup\u5df2\u7ecf\u6302\u8f7d\u5b8c\u6210\uff0c\u8bf4\u660e\u5b50\u7ec4\u4ef6Transition\u4e4b\u524d\u6302\u8f7d\u5e76\u5378\u8f7d\u8fc7\uff0c\u56e0\u6b64appear = props.enter\nlet parentGroup = context.transitionGroup\nlet appear = parentGroup && !parentGroup.isMounting ? props.enter : props.appear\n")),(0,i.kt)("p",null,"appear\u4e3b\u8981\u7528\u4e8e\u8bbe\u7f6e\uff1athis.appearStatus = ENTERING\uff0c\u8be6\u7ec6\u5206\u6790\u53ef\u4ee5\u53c2\u8003\u540e\u7eed\u5bf9constructor\u7684\u5206\u6790\u3002"),(0,i.kt)("h2",{id:"props\u4ecb\u7ecd"},"Props\u4ecb\u7ecd"),(0,i.kt)("h3",{id:"children"},"children"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"type: Function | element\nrequired\n")),(0,i.kt)("p",null,"\u67d0\u4e2a\u72b6\u6001\u4e0b\u9700\u8981\u8fc7\u6e21\u6548\u679c\u7684\u76ee\u6807\u7ec4\u4ef6\uff0c\u53ef\u4ee5\u662f\u51fd\u6570"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"<Transition timeout={150}>\n  {(status) => (\n    <MyComponent className={`fade fade-${status}`} />\n  )}\n</Transition>\n")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"\u6bcf\u4e2a\u72b6\u6001'entering', 'entered', 'exiting', 'exited', 'unmounted'\u7684\u65f6\u5019\u6267\u884c\u7684\u56de\u8c03\u51fd\u6570\uff0c\u4e0a\u9762\u4ee3\u7801\u5b9e\u73b0\u7684\u662f\uff0c\u6bcf\u4e00\u4e2a\u72b6\u6001\u5c31\u7ed9\u67d0\u4e2a\u5b50\u7ec4\u4ef6\u589e\u52a0\u4e00\u4e2a\u8fc7\u6e21\u6837\u5f0f\uff0c\u53ef\u4ee5\u975e\u5e38\u7075\u6d3b\u7684\u7ed9\u4efb\u610f\u7ec4\u4ef6\u589e\u52a0\u6837\u5f0f\uff0c\u5b9e\u73b0\u8fc7\u6e21\u6548\u679c\u3002")),(0,i.kt)("h3",{id:"in"},"in"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"type: boolean\ndefault: false\n")),(0,i.kt)("p",null,"\u7528\u4e8e\u5728enter\u4e0eexit\u72b6\u6001\u4e4b\u95f4\u7ffb\u8f6c\uff0c\u9ed8\u8ba4\u4e3afalse\uff0c\u8868\u793a\u4e0d\u6302\u8f7d\u7ec4\u4ef6\u6216\u8005\u5904\u4e8eexit\u72b6\u6001\u3002"),(0,i.kt)("h3",{id:"mountonenter"},"mountOnEnter"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"type: boolean\ndefault: false\n")),(0,i.kt)("p",null,"\u5728\u7b2c\u4e00\u6b21in={true}\u5373\u6302\u8f7d\u7684\u65f6\u5019\uff0c\u8bbe\u7f6emountOnEnter={true}\u8868\u793a\u5ef6\u8fdf\u6302\u8f7d\uff0c\u61d2\u52a0\u8f7d\u7ec4\u4ef6\u3002"),(0,i.kt)("h3",{id:"unmountonexit"},"unmountOnExit"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"type: boolean\ndefault: false\n")),(0,i.kt)("p",null,"\u5982\u679c\u4e3atrue\uff0c\u5728\u7ec4\u4ef6\u5904\u4e8eexited\u72b6\u6001\u7684\u65f6\u5019\uff0c\u5378\u8f7d\u7ec4\u4ef6\u3002"),(0,i.kt)("h3",{id:"appear"},"appear"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"type: boolean\ndefault: false\n")),(0,i.kt)("p",null,"\u5982\u679c\u4e3atrue\uff0c\u5728\u7ec4\u4ef6\u6302\u8f7d\u7684\u65f6\u5019\uff0c\u5c55\u793a\u8fc7\u6e21\u52a8\u753b\u3002\u9ed8\u8ba4\u4e3afalse\uff0c\u7b2c\u4e00\u6b21\u6302\u8f7d\u8fc7\u6e21\u52a8\u753b\u4e0d\u751f\u6548\u3002"),(0,i.kt)("h3",{id:"enter"},"enter"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"type: boolean\ndefault: true\n")),(0,i.kt)("p",null,"\u5982\u679c\u4e3atrue\uff0c\u8868\u793a\u5141\u8bb8enter\u72b6\u6001\u7684\u8fc7\u6e21\u52a8\u753b\u751f\u6548\uff0c\u9ed8\u8ba4\u4e3atrue"),(0,i.kt)("h3",{id:"exit"},"exit"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"type: boolean\ndefault: true\n")),(0,i.kt)("p",null,"\u5982\u679c\u4e3atrue\uff0c\u8868\u793a\u5141\u8bb8exit\u72b6\u6001\u7684\u8fc7\u6e21\u52a8\u753b\u751f\u6548\uff0c\u9ed8\u8ba4\u4e3atrue"),(0,i.kt)("h3",{id:"addendlistener"},"addEndListener"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"type: Function\n")),(0,i.kt)("p",null,"\u8fc7\u6e21\u52a8\u753b\u7ed3\u675f\u65f6\u6267\u884c\u7684\u6bc1\u6389\u51fd\u6570"),(0,i.kt)("h3",{id:"timeout"},"timeout"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"type: number | { enter?: number, exit?: number }\n")),(0,i.kt)("p",null,"addEndListener\u5b58\u5728\u7684\u65f6\u5019\uff0c\u9700\u8981\u8bbe\u7f6etimeout\uff0c\u8868\u793a\u8fc7\u6e21\u52a8\u753b\u65f6\u95f4"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"timeout={{\n enter: 300, //enter\u72b6\u6001\u52a8\u753b\u65f6\u95f4\n exit: 500,  //exit\u72b6\u6001\u52a8\u753b\u65f6\u95f4\n}}\n")),(0,i.kt)("h3",{id:"onenteronenteringonentered"},"onEnter\uff0conEntering\uff0conEntered"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"type: Function(node: HtmlElement, isAppearing: bool)\ndefault: function noop() {}\n")),(0,i.kt)("p",null,"\u6e90\u7801\u5185\u90e8\uff0cstatus\u5206\u522b\u4e3aentering\u524d\u540e\uff0centered\u4e4b\u540e\u6267\u884c\u7684\u56de\u8c03\u51fd\u6570\uff0cCSSTransition\u7ec4\u4ef6\u5373\u662f\u5229\u7528\u8fd9\u4e09\u4e2a\u56de\u8c03\u51fd\u6570\u7ed9\u7ec4\u4ef6\u589e\u52a0\u4e0d\u540c\u7684\u6837\u5f0f\uff0c\u5229\u7528CSS\u52a8\u753b\u5b9e\u73b0\u8fc7\u6e21\u6548\u679c\u3002"),(0,i.kt)("h3",{id:"onexitonexitingonexited"},"onExit\uff0conExiting\uff0conExited"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"type: Function(node: HtmlElement) -> void\ndefault: function noop() {}\n")),(0,i.kt)("p",null,"\u6e90\u7801\u5185\u90e8\uff0cstatus\u5206\u522b\u4e3aexiting\u524d\u540e\uff0cexited\u4e4b\u540e\u6267\u884c\u7684\u56de\u8c03\u51fd\u6570\uff0cCSSTransition\u7ec4\u4ef6\u5373\u662f\u5229\u7528\u8fd9\u4e09\u4e2a\u56de\u8c03\u51fd\u6570\u7ed9\u7ec4\u4ef6\u589e\u52a0\u4e0d\u540c\u7684\u6837\u5f0f\uff0c\u5229\u7528CSS\u52a8\u753b\u5b9e\u73b0\u8fc7\u6e21\u6548\u679c\u3002"),(0,i.kt)("h2",{id:"\u6e90\u7801\u5de5\u5177\u51fd\u6570"},"\u6e90\u7801\u5de5\u5177\u51fd\u6570"),(0,i.kt)("h3",{id:"gettimeouts\u51fd\u6570"},"getTimeouts\u51fd\u6570"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"// \u901a\u8fc7\u8bbe\u7f6eprops.timeout\uff0c\u83b7\u53d6\u5404\u4e2a\u7ec4\u4ef6\u4e0d\u540c\u72b6\u6001\u4e0b\u7684timeout\n  getTimeouts() {\n    const { timeout } = this.props\n    let exit, enter, appear\n\n    exit = enter = appear = timeout\n\n    if (timeout != null && typeof timeout !== 'number') {\n      exit = timeout.exit\n      enter = timeout.enter\n      appear = timeout.appear\n    }\n    return { exit, enter, appear }\n  }\n")),(0,i.kt)("h3",{id:"setnextcallback\u51fd\u6570\u5c06\u51fd\u6570\u5c01\u88c5\u4e3a\u53ea\u53ef\u6267\u884c\u4e00\u6b21\u7684\u81ea\u6bc1\u56de\u8c03\u51fd\u6570"},"setNextCallback\u51fd\u6570\uff1a\u5c06\u51fd\u6570\u5c01\u88c5\u4e3a\u53ea\u53ef\u6267\u884c\u4e00\u6b21\u7684\u81ea\u6bc1\u56de\u8c03\u51fd\u6570"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"//setNextCallback\u4e3a\u4e00\u4e2a\u95ed\u5305\n    // \u4f20\u5165\u4e00\u4e2a\u56de\u8c03\u51fd\u6570,\u8fd4\u56de\u4e00\u4e2a\u53ea\u80fd\u6267\u884c\u4e00\u6b21\u56de\u8c03\u51fd\u6570\u7684\u51fd\u6570,\u53ef\u4ee5\u624b\u52a8\u53d6\u6d88\u56de\u8c03\u51fd\u6570\u7684\u6267\u884c\n    //\u6267\u884c\u4e00\u6b21\u4e4b\u540e\u81ea\u6bc1\n  setNextCallback(callback) {\n    //\u6807\u5fd7\u4f4dactive\u7528\u4e8e\u4fdd\u8bc1\u53ea\u6267\u884c\u4e00\u6b21callback\n    let active = true\n\n    this.nextCallback = event => {\n      if (active) {\n        active = false\n        //  \u5783\u573e\u56de\u6536\n        this.nextCallback = null\n\n        callback(event)\n      }\n    }\n\n    //\u7528\u4e8e\u624b\u52a8\u53d6\u6d88\u56de\u8c03\u51fd\u6570\u7684\u6267\u884c\n    this.nextCallback.cancel = () => {\n      active = false\n    }\n\n    return this.nextCallback\n  }\n")),(0,i.kt)("h3",{id:"safesetstate\u51fd\u6570\u786e\u4fddsetstate\u56de\u8c03\u51fd\u6570\u53ea\u6267\u884c\u4e00\u6b21"},"safeSetState\u51fd\u6570\uff1a\u786e\u4fddsetState\u56de\u8c03\u51fd\u6570\u53ea\u6267\u884c\u4e00\u6b21"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"  safeSetState(nextState, callback) {\n    // This shouldn't be necessary, but there are weird race conditions with\n    // setState callbacks and unmounting in testing, so always make sure that\n    // we can cancel any pending setState callbacks after we unmount.\n    callback = this.setNextCallback(callback)\n    //  callback\u6267\u884c\u4e00\u6b21\u4e4b\u540e\u4e0d\u518d\u5141\u8bb8\u6267\u884c\n    this.setState(nextState, callback)\n  }\n")),(0,i.kt)("h3",{id:"ontransitionend\u51fd\u6570"},"onTransitionEnd\u51fd\u6570"),(0,i.kt)("p",null,"\u5165\u573a\u6216\u8005\u9000\u573a\u8fc7\u6e21\u52a8\u753b\u7ed3\u675f\u4e4b\u540e\uff0c\u6839\u636eaddEndListener\u4ee5\u53catimeout\u6267\u884c\u81ea\u6bc1\u56de\u8c03\u51fd\u6570handler"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"}," // handler\u4e3a\u5165\u573a\u6216\u8005\u9000\u573a\u8fc7\u6e21\u52a8\u753b\u7ed3\u675f\u4e4b\u540e\u7684\u5904\u7406\u51fd\u6570\n  onTransitionEnd(node, timeout, handler) {\n    //\u7ed9this.nextCallback\u91cd\u65b0\u8bbe\u7f6e\u56de\u8c03\u51fd\u6570\n    this.setNextCallback(handler)\n\n    //  \u65e0\u8bba\u662f\u5426\u8bbe\u7f6e\u4e86addEndListener\u8fd8\u662ftimeout\uff0cthis.nextCallback\u90fd\u53ea\u6267\u884c\u4e00\u6b21\n    //  \u6267\u884c\u65f6\u673a\u5e76\u4e0d\u786e\u5b9a\uff0c\u8fd9\u91cc\u7ecf\u5e38\u4f1a\u5b58\u5728\u4e00\u4e9b\u4e0e\u9884\u671f\u4e0d\u7b26\u7684\u73b0\u8c61\n    if (node) {\n      //\u5982\u679c\u8bbe\u7f6e\u4e86addEndListener\uff0c\u5e76\u4e14\u76d1\u542c\u4e86\u4e8b\u4ef6\uff0c\u5219\u4e8b\u4ef6\u89e6\u53d1\u53d8\u6267\u884cthis.nextCallback\n      if (this.props.addEndListener) {\n        // \u6267\u884c\u81ea\u5b9a\u4e49\u7684\u8fc7\u6e21\u52a8\u753b\u7ed3\u675f\u540e\u7684\u56de\u8c03\u51fd\u6570\n        this.props.addEndListener(node, this.nextCallback)\n      }\n      //\u5982\u679c\u8bbe\u7f6e\u4e86timeout\uff0c\u5219timeout\u4e4b\u540e\u6267\u884cthis.nextCallback\n      if (timeout != null) {\n        setTimeout(this.nextCallback, timeout)\n      }\n    } else {\n      setTimeout(this.nextCallback, 0)\n    }\n  }\n")),(0,i.kt)("h3",{id:"updatestatus"},"updateStatus"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"}," //\u5728\u6302\u8f7d\u9636\u6bb5\u4e0e\u66f4\u65b0\u9636\u6bb5\u6839\u636enextStatus\u7684\u72b6\u6001\u6267\u884c\u5165\u573a\u6216\u8005\u9000\u573a\u52a8\u753b\n  updateStatus(mounting = false, nextStatus){...}\n")),(0,i.kt)("hr",null),(0,i.kt)("h1",{id:"\u6e90\u7801\u5206\u6790"},"\u6e90\u7801\u5206\u6790"),(0,i.kt)("h2",{id:"\u6302\u8f7d\u9636\u6bb5"},"\u6302\u8f7d\u9636\u6bb5"),(0,i.kt)("h3",{id:"constructor"},"constructor"),(0,i.kt)("p",null,"\u6839\u636e\u662f\u5426\u662f\u7b2c\u4e00\u6b21\u6302\u8f7d\uff0c\u662f\u5426\u88abTransitionGroup\u5305\u88f9\uff0c\u6765\u8bbe\u7f6e\u7ec4\u4ef6\u7684\u521d\u59cbstate\u3002\u6d89\u53ca\u5230\u7684props\u6709:\nenter\uff0cappear\uff0cin"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"    // \u7ec4\u4ef6Transition\u6302\u8f7d\u9636\u6bb5\n  constructor(props, context) {\n    super(props, context)\n\n    //  \u521d\u59cb\u5316appear\uff1a\n    //  \u5f53\u5355\u72ec\u4f7f\u7528Transition\u6ca1\u6709\u88abTransitionGroup\u5305\u88f9\u65f6\uff0cappear = props.appear\n    //  \u5f53\u88abTransitionGroup\u5305\u88f9\u7684\u65f6\u5019\uff0cTransitionGroup\u5904\u4e8e\u6b63\u5728\u6302\u8f7d\u9636\u6bb5\uff0c\u5b50\u7ec4\u4ef6Transition\u662f\u7b2c\u4e00\u6b21\u6302\u8f7d\uff0c\u56e0\u6b64appear = props.appear\n    //  \u5f53\u88abTransitionGroup\u5305\u88f9\u7684\u65f6\u5019\uff0cTransitionGroup\u5df2\u7ecf\u6302\u8f7d\u5b8c\u6210\uff0c\u8bf4\u660e\u5b50\u7ec4\u4ef6Transition\u4e4b\u524d\u6302\u8f7d\u5e76\u5378\u8f7d\u8fc7\uff0c\u56e0\u6b64appear = props.enter\n    let parentGroup = context.transitionGroup\n    let appear =\n      parentGroup && !parentGroup.isMounting ? props.enter : props.appear\n\n    let initialStatus\n\n    this.appearStatus = null\n      \n    //  \u521d\u59cb\u5316this.appearStatus\u4ee5\u53cathis.state.status\n    //  \u6302\u8f7d\u7684\u65f6\u5019:\n    //  in = true && appear = true : this.state.status = EXITED , this.appearStatus = ENTERING\n    //  in = true && appear = false : this.state.status = ENTERED\n    //  in = false && ( unmountOnExit = true || mountOnEnter = true ) : this.state.status = UNMOUNTED\n    //  in = false && unmountOnExit = false && mountOnEnter = fasle : this.state.status = EXITED\n    if (props.in) {\n      if (appear) {\n        initialStatus = EXITED\n        this.appearStatus = ENTERING\n      } else {\n        initialStatus = ENTERED\n      }\n    } else {\n      if (props.unmountOnExit || props.mountOnEnter) {\n        initialStatus = UNMOUNTED\n      } else {\n        initialStatus = EXITED\n      }\n    }\n\n    this.state = { status: initialStatus }\n\n    this.nextCallback = null\n  }\n")),(0,i.kt)("h3",{id:"getderivedstatefromprops"},"getDerivedStateFromProps"),(0,i.kt)("p",null,"\u6302\u8f7d\u9636\u6bb5\u8be5\u51fd\u6570\u8fd4\u56denull\uff0c\u4e0d\u9700\u8981\u5bf9state\u4fee\u6539"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"static getDerivedStateFromProps({ in: nextIn }, prevState) {\n    // \u6302\u8f7d\u9636\u6bb5if\u6761\u4ef6\u4e3afalse\uff0c\u8fd4\u56denull\uff0c\u4e0d\u9700\u8981\u5bf9state\u4fee\u6539\n    // \u66f4\u65b0\u9636\u6bb5\uff0c\u5728\u6267\u884c\u9000\u573a\u52a8\u753b\u7684\u65f6\u5019\uff0c\u53ef\u80fd\u4f1a\u8fd4\u56de{ status: EXITED }\n    if (nextIn && prevState.status === UNMOUNTED) {\n      return { status: EXITED }\n    }\n    return null\n  }\n")),(0,i.kt)("h3",{id:"render"},"render"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"render() {\n    const status = this.state.status\n\n    //\u6302\u8f7d\u9636\u6bb5\uff1a\n      // in = false && ( unmountOnExit = true || mountOnEnter = true )\uff0cTransition\u4e0d\u4f1a\u6e32\u67d3\u4efb\u4f55\u7ec4\u4ef6\n    if (status === UNMOUNTED) {\n      return null\n    }\n\n    //\u6302\u8f7d\u9636\u6bb5\uff1a\n      //  in = true && appear = true : this.state.status = EXITED , this.appearStatus = ENTERING\n      //  in = true && appear = false : this.state.status = ENTERED\n      //  in = false && unmountOnExit = false && mountOnEnter = fasle : this.state.status = EXITED\n    const { children, ...childProps } = this.props\n    // filter props for Transtition\n    //  \u6ee4\u9664\u4e0eTranstition\u7ec4\u4ef6\u529f\u80fd\u76f8\u5173\u7684props\uff0c\u5176\u4ed6\u7684props\u4f9d\u65e7\u53ef\u4ee5\u6b63\u5e38\u4f20\u5165\u9700\u8981\u8fc7\u6e21\u6548\u679c\u7684\u4e1a\u52a1\u7ec4\u4ef6\n    delete childProps.in\n    delete childProps.mountOnEnter\n    delete childProps.unmountOnExit\n    delete childProps.appear\n    delete childProps.enter\n    delete childProps.exit\n    delete childProps.timeout\n    delete childProps.addEndListener\n    delete childProps.onEnter\n    delete childProps.onEntering\n    delete childProps.onEntered\n    delete childProps.onExit\n    delete childProps.onExiting\n    delete childProps.onExited\n\n    //  \u5f53children === 'function'\uff0cchildren\u51fd\u6570\u53ef\u4ee5\u6839\u636e\u7ec4\u4ef6\u72b6\u6001\u6267\u884c\u76f8\u5e94\u903b\u8f91\n    // (status) => (\n    //     <MyComponent className={`fade fade-${status}`} />\n    //   )\n    if (typeof children === 'function') {\n      return children(status, childProps)\n    }\n\n    //React.Children.only\u5224\u65ad\u662f\u5426\u53ea\u6709\u4e00\u4e2a\u5b50\u7ec4\u4ef6\uff0c\u5982\u679c\u662f\u5219\u8fd4\u56de\u8fd9\u4e2a\u5b50\u7ec4\u4ef6\uff0c\u5982\u679c\u4e0d\u662f\u5219\u629b\u51fa\u4e00\u4e2a\u9519\u8bef\n    const child = React.Children.only(children)\n    return React.cloneElement(child, childProps)\n  }\n")),(0,i.kt)("h3",{id:"componentdidmount"},"componentDidMount"),(0,i.kt)("p",null,"\u5f00\u59cb\u6267\u884c"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"  componentDidMount() {\n    // \u7b2c\u4e00\u6b21\u6302\u8f7d\u7684\u65f6\u5019\uff0c\u5982\u679cin = true && appear = true\uff0c\u5219appearStatus=ENTERING\uff0c\u5426\u5219\u4e3anull\u3002\n    this.updateStatus(true, this.appearStatus)\n  }\n")),(0,i.kt)("p",null,"\u5176\u4e2dupdateStatus\u51fd\u6570\u4e3a\uff1aappearStatus = ENTERING\u7684\u65f6\u5019\u6267\u884cperformEnter"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"updateStatus(mounting = false, nextStatus) {\n    if (nextStatus !== null) {\n      // \u6302\u8f7d\u9636\u6bb5\uff1a\u5982\u679cnextStatus !== null\uff0c\u5219\u53ea\u4f1a\u51fa\u73b0 nextStatus = ENTERING\n        // in = true && appear = true\uff1anextStatus = ENTERING\n        \n      // nextStatus will always be ENTERING or EXITING.\n      this.cancelNextCallback()  // \u6302\u8f7d\u9636\u6bb5\u65e0\u64cd\u4f5c\n      const node = ReactDOM.findDOMNode(this) // \u6302\u8f7d\u9636\u6bb5\u627e\u5230\u771f\u5b9eDOM\n\n      //  \u6302\u8f7d\u9636\u6bb5\uff1a\u5982\u679cin = true && appear = true\uff0c\u5219\u6267\u884cperformEnter\n      if (nextStatus === ENTERING) {\n        this.performEnter(node, mounting)\n      } else {\n        this.performExit(node)\n      }\n    } else if (this.props.unmountOnExit && this.state.status === EXITED) {\n      this.setState({ status: UNMOUNTED })\n    }\n  }\n")),(0,i.kt)("p",null,"\u5176\u4e2dperformEnter\u51fd\u6570\u4e3a\uff1a\u6267\u884conEnter\u56de\u8c03\u51fd\u6570 --\x3e \u8bbe\u7f6e{ status: ENTERING } --\x3e \u6267\u884conEntering\u56de\u8c03\u51fd\u6570 --\x3e \u76d1\u542conTransitionEnd\u8fc7\u6e21\u52a8\u753b\u662f\u5426\u5b8c\u6210  --\x3e \u8bbe\u7f6e{ status: ENTERED } --\x3e \u6267\u884conEntered\u56de\u8c03\u51fd\u6570"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"performEnter(node, mounting) {\n    const { enter } = this.props\n    //  \u6302\u8f7d\u9636\u6bb5\uff1a\u5982\u679cin = true && appear = true\uff0c\u5219appearing = true\n    const appearing = this.context.transitionGroup\n      ? this.context.transitionGroup.isMounting\n      : mounting\n\n    //  \u83b7\u53d6timeouts\n    const timeouts = this.getTimeouts()\n\n    //  \u6302\u8f7d\u9636\u6bb5\u4ee5\u4e0bif\u4ee3\u7801\u4e0d\u6267\u884c\n    // no enter animation skip right to ENTERED\n    // if we are mounting and running this it means appear _must_ be set\n    if (!mounting && !enter) {\n      this.safeSetState({ status: ENTERED }, () => {\n        this.props.onEntered(node)\n      })\n      return\n    }\n\n    //\u6267\u884cprops.onEnter\u51fd\u6570\n    //\u6302\u8f7d\u9636\u6bb5\uff0c\u5982\u679cin = true && appear = true\uff0c\u5219appearing\u59cb\u7ec8\u4e3atrue\n    // \u5982\u679c\u5728Transition\u7ec4\u4ef6\u4e0a\u8bbe\u7f6eonEnter\u51fd\u6570\uff0c\u53ef\u4ee5\u901a\u8fc7\u83b7\u53d6\u8be5\u51fd\u6570\u7b2c\u4e8c\u53c2\u6570\u6765\u83b7\u53d6\u7b2c\u4e00\u6b21\u6302\u8f7d\u7684\u65f6\u5019\u662f\u5426\u662fenter\n    this.props.onEnter(node, appearing)\n\n    //  \u6539\u53d8{ status: ENTERING }\uff0c\u6539\u53d8\u4e4b\u540e\u6267\u884c\u4e00\u6b21\u56de\u8c03\u51fd\u6570\n    this.safeSetState({ status: ENTERING }, () => {\n      // \u5c06\u72b6\u6001\u8bbe\u7f6e\u4e3aENTERING\u4e4b\u540e\uff0c\u5f00\u59cb\u6267\u884c\u8fc7\u6e21\u52a8\u753b\n      this.props.onEntering(node, appearing)\n\n      // FIXME: appear timeout?\n      //  timeouts.enter\u4e3a\u5165\u573aenter\u7684\u6301\u7eed\u65f6\u95f4\n      // \u8fc7\u6e21\u52a8\u753b\u7ed3\u675f\uff0c\u8bbe\u7f6e{ status: ENTERED }\uff0c\u6267\u884conEntered\u56de\u8c03\u51fd\u6570\n      this.onTransitionEnd(node, timeouts.enter, () => {\n        //\u5c06\u72b6\u6001\u8bbe\u7f6e\u4e3aENTERED\uff0c\u7136\u540e\u518d\u6267\u884conEntered\u56de\u8c03\u51fd\u6570\n        this.safeSetState({ status: ENTERED }, () => {\n          this.props.onEntered(node, appearing)\n        })\n      })\n    })\n")),(0,i.kt)("p",null,"  }"),(0,i.kt)("h2",{id:"\u66f4\u65b0\u9636\u6bb5"},"\u66f4\u65b0\u9636\u6bb5"),(0,i.kt)("h3",{id:"getderivedstatefromprops-1"},"getDerivedStateFromProps"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"}," static getDerivedStateFromProps({ in: nextIn }, prevState) {\n    // \u66f4\u65b0\u9636\u6bb5\uff1a\n      // \u5982\u679c\u6302\u8f7d\u9636\u6bb5in=true,\u90a3\u4e48\u7b2c\u4e00\u6b21\u66f4\u65b0if\u6761\u4ef6\u4e2dprevState.status!== UNMOUNTED\n      // \u5982\u679c\u6302\u8f7d\u9636\u6bb5in=false,\u5e76\u4e14(props.mountOnEnter=true||props.mountOnEnter=true)\n      // \u90a3\u4e48\u7b2c\u4e00\u6b21\u66f4\u65b0if\u6761\u4ef6\u4e2dprevState.status === UNMOUNTED\uff0c\u53ef\u4ee5\u901a\u8fc7in\u7684\u7ffb\u8f6c\u6539\u53d8\n      // \u5982\u679c(props.mountOnEnter=true||props.mountOnEnter=true)\u7684\u65f6\u5019,\u8bbe\u7f6e\u72b6\u6001status\u7684\u72b6\u6001\u4e3aEXITED\n    if (nextIn && prevState.status === UNMOUNTED) {\n      return { status: EXITED }\n    }\n    return null\n  }\n")),(0,i.kt)("h3",{id:"render-1"},"render"),(0,i.kt)("p",null,"\u4e0e\u6302\u8f7d\u9636\u6bb5\u5206\u6790\u7c7b\u4f3c\uff0c\u7ec4\u4ef6\u4fdd\u6301\u539f\u6765\u72b6\u6001\u3002"),(0,i.kt)("h3",{id:"componentdidupdate"},"componentDidUpdate"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"componentDidUpdate(prevProps) {\n    let nextStatus = null\n    if (prevProps !== this.props) {\n      const { status } = this.state\n\n      if (this.props.in) {\n        //\u6839\u636ein=true\u5224\u65ad\u6b64\u65f6\u9700\u8981\u8fdb\u884c\u5165\u573a\u52a8\u753b\n        if (status !== ENTERING && status !== ENTERED) {\n          //\u5982\u679c\u5f53\u524d\u72b6\u6001\u65e2\u4e0d\u662f\u6b63\u5728\u5165\u573a\u4e5f\u4e0d\u662f\u5df2\u7ecf\u5165\u573a\uff0c\u5219\u5c06\u4e0b\u4e00\u4e2a\u72b6\u6001\u7f6e\u4e3a\u6b63\u5728\u5165\u573a\n          nextStatus = ENTERING\n        }\n      } else {\n          //\u6839\u636ein=false\u5224\u65ad\u6b64\u65f6\u9700\u8981\u8fdb\u884c\u9000\u573a\u52a8\u753b\n        if (status === ENTERING || status === ENTERED) {\n            //\u5982\u679c\u5f53\u524d\u72b6\u6001\u662f\u6b63\u5728\u5165\u573a\u6216\u8005\u5df2\u7ecf\u5165\u573a\uff0c\u5219\u5c06\u4e0b\u4e00\u4e2a\u72b6\u6001\u7f6e\u4e3a\u9000\u573a\n          nextStatus = EXITING\n        }\n      }\n    }\n    //\u66f4\u65b0\u72b6\u6001\uff0c\u6267\u884c\u8fc7\u6e21\u52a8\u753b\uff0c\u7b2c\u4e00\u53c2\u6570\u8868\u793a\u662f\u5426\u6b63\u5728\u6302\u8f7d\n    //\u5982\u679cTransition\u7ec4\u4ef6\u66f4\u65b0\u4f46\u662fprevProps\u6ca1\u6709\u53d8\u5316\uff0c\u6709\u53ef\u80fd\u662f\u591a\u4f59\u7684\u91cd\u65b0\u3002\u56e0\u6b64\u5c06nextStatus\u4e3anull\n    this.updateStatus(false, nextStatus)\n  }\n")),(0,i.kt)("p",null,"\u5176\u4e2dupdateStatus\u51fd\u6570\u4e3a\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"    updateStatus(mounting = false, nextStatus) {\n        if (nextStatus !== null) {\n          // nextStatus will always be ENTERING or EXITING.\n          this.cancelNextCallback()  // \u6302\u8f7d\u9636\u6bb5\u65e0\u64cd\u4f5c\n          const node = ReactDOM.findDOMNode(this) // \u6302\u8f7d\u9636\u6bb5\u627e\u5230\u771f\u5b9eDOM\n    \n            //  \u66f4\u65b0\u9636\u6bb5nextStatus\u53ea\u6709\u4e24\u79cd\u72b6\u6001ENTERING\u4e0eEXITING\uff1a\n            // \u5982\u679c\u4e3aENTERING\u6267\u884c\u5165\u573a\uff0cEXITING\u6267\u884c\u9000\u573a\n          if (nextStatus === ENTERING) {\n            this.performEnter(node, mounting)\n          } else {\n            this.performExit(node)\n          }\n        } else if (this.props.unmountOnExit && this.state.status === EXITED) {\n          this.setState({ status: UNMOUNTED })\n        }\n  }\n")),(0,i.kt)("p",null,"\u5176\u4e2d\u9000\u573a\u52a8\u753bperformExit\u51fd\u6570\u4e3a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"//\u4e0eperformEnter\u903b\u8f91\u76f8\u4f3c\n  performExit(node) {\n    const { exit } = this.props\n    const timeouts = this.getTimeouts()\n\n    // no exit animation skip right to EXITED\n    if (!exit) {\n      this.safeSetState({ status: EXITED }, () => {\n        this.props.onExited(node)\n      })\n      return\n    }\n    this.props.onExit(node)\n\n    this.safeSetState({ status: EXITING }, () => {\n      this.props.onExiting(node)\n\n      this.onTransitionEnd(node, timeouts.exit, () => {\n        this.safeSetState({ status: EXITED }, () => {\n          this.props.onExited(node)\n        })\n      })\n    })\n  }\n")),(0,i.kt)("h2",{id:"\u603b\u7ed3"},"\u603b\u7ed3"),(0,i.kt)("p",null,"\u672c\u6587\u6839\u636e\u7ec4\u4ef6\u751f\u547d\u5468\u671f\u8be6\u7ec6\u7684\u5206\u6790\u4e86react-transition-group\u4e2d\u5173\u952e\u7ec4\u4ef6Transition\u7684\u6e90\u7801\uff0c\u5de5\u4f5c\u6d41\u7a0b\u3002CSSTransition\u7ec4\u4ef6\u5c31\u662f\u5bf9Transition\u7ec4\u4ef6\u7684\u5c01\u88c5\uff0c\u5728\u5176props.onEnter\u7b49\u7b49\u7ec4\u4ef6\u4e0a\u6dfb\u52a0\u5bf9\u5e94\u7684class\u5b9e\u73b0css\u7684\u52a8\u753b\u3002\u8be5\u7ec4\u4ef6\u5e93\u8fd8\u6709\u4e00\u4e2a\u6bd4\u8f83\u91cd\u8981\u7684\u5730\u65b9\u5c31\u662fTransitionGroup\u7ec4\u4ef6\u5982\u4f55\u7ba1\u7406\u5b50\u7ec4\u4ef6\u52a8\u753b\uff0c\u5f04\u6e05\u8fd9\u4e2a\u662f\u5b9e\u73b0\u590d\u6742\u52a8\u753b\u903b\u8f91\u7684\u5173\u952e\u3002"))}m.isMDXComponent=!0}}]);