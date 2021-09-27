"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[1879],{3905:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return d}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},c=Object.keys(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),s=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},u=function(e){var t=s(e.components);return n.createElement(i.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,c=e.originalType,i=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=s(r),d=a,f=p["".concat(i,".").concat(d)]||p[d]||m[d]||c;return r?n.createElement(f,o(o({ref:t},u),{},{components:r})):n.createElement(f,o({ref:t},u))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var c=r.length,o=new Array(c);o[0]=p;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var s=2;s<c;s++)o[s]=r[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}p.displayName="MDXCreateElement"},1969:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return l},contentTitle:function(){return i},metadata:function(){return s},toc:function(){return u},default:function(){return p}});var n=r(7462),a=r(3366),c=(r(7294),r(3905)),o=["components"],l={id:"react-entry",sidebar_label:"react\u6587\u4ef6\u5939-\u6e90\u7801\u5165\u53e3",title:"",slug:"/react/react/ReactElement/others/react-entry",sidebar_position:1},i=void 0,s={unversionedId:"react/react/ReactElement/others/react-entry",id:"react/react/ReactElement/others/react-entry",isDocsHomePage:!1,title:"",description:"react.js ##",source:"@site/docs/react/react/ReactElement/others/react\u6587\u4ef6\u5939-\u6e90\u7801\u5165\u53e3.md",sourceDirName:"react/react/ReactElement/others",slug:"/react/react/ReactElement/others/react-entry",permalink:"/ReactNote/docs/react/react/ReactElement/others/react-entry",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react/ReactElement/others/react\u6587\u4ef6\u5939-\u6e90\u7801\u5165\u53e3.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{id:"react-entry",sidebar_label:"react\u6587\u4ef6\u5939-\u6e90\u7801\u5165\u53e3",title:"",slug:"/react/react/ReactElement/others/react-entry",sidebar_position:1},sidebar:"react",previous:{title:"\u7ec4\u4ef6\u4e0eReactElement\u7684\u5173\u7cfb",permalink:"/ReactNote/docs/react/react/ReactElement/component-reactelement"},next:{title:"ReactBaseClasses",permalink:"/ReactNote/docs/react/react/ReactElement/others/react-base-class"}},u=[{value:"react.js",id:"reactjs",children:[{value:"\u5206\u6790\u6b65\u9aa4",id:"\u5206\u6790\u6b65\u9aa4",children:[]}]}],m={toc:u};function p(e){var t=e.components,r=(0,a.Z)(e,o);return(0,c.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,c.kt)("h2",{id:"reactjs"},"react.js"),(0,c.kt)("p",null,"\u5b9a\u4e49React\u7c7b\uff1a"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"const React = {\n  Children: {\n    map,\n    forEach,\n    count,\n    toArray,\n    only,\n  },\n\n  createRef,\n  Component,\n  PureComponent,\n\n  createContext,\n  forwardRef,\n  lazy,\n  memo,\n\n  Fragment: REACT_FRAGMENT_TYPE,\n  StrictMode: REACT_STRICT_MODE_TYPE,\n  Suspense: REACT_SUSPENSE_TYPE,\n\n  createElement: __DEV__ ? createElementWithValidation : createElement,\n  cloneElement: __DEV__ ? cloneElementWithValidation : cloneElement,\n  createFactory: __DEV__ ? createFactoryWithValidation : createFactory,\n  isValidElement: isValidElement,\n\n  version: ReactVersion,\n\n  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals,\n};\n")),(0,c.kt)("h3",{id:"\u5206\u6790\u6b65\u9aa4"},"\u5206\u6790\u6b65\u9aa4"),(0,c.kt)("hr",null),(0,c.kt)("ol",null,(0,c.kt)("li",{parentName:"ol"},"ReactNoopUpdateQueue.js - - - - - - - - - - - - - - - - - - - - - - - -  \u5b9a\u4e49\u66f4\u65b0\u961f\u5217\u7684\u62bd\u8c61\u7c7b\u4e2d\u7684\u65b9\u6cd5"),(0,c.kt)("li",{parentName:"ol"},"ReactBaseClasses.js - - - - - - - - - - -- - - - - - - - - - - -  \u5b9a\u4e49Component\u4ee5\u53caPureComponent\u7c7b")),(0,c.kt)("hr",null),(0,c.kt)("hr",null),(0,c.kt)("ol",null,(0,c.kt)("li",{parentName:"ol"},"ReactCreateRef.js - - - - - - - - -  \u5b9a\u4e49createRef\u51fd\u6570\uff0c\u8fd4\u56de\u4e00\u4e2a\u5177\u5907current\u5c5e\u6027\u7684refObject\u5bf9\u8c61"),(0,c.kt)("li",{parentName:"ol"},"ReactContext.js - - - - - - - - - - - \u5b9a\u4e49context\u5bf9\u8c61\u4ee5\u53cacontext.Provider\u4e0econtext.Consumer\u5bf9\u8c61"),(0,c.kt)("li",{parentName:"ol"},"ReactLazy.js - - - - - - - - - - - - - - - - - - --  - - -- - - - - -  - --  - - - -- -  -- - - - - - - - - - \u5b9a\u4e49\u4e00\u4e2aLazy\u51fd\u6570\uff0c\u4f20\u5165\u4e00\u4e2a\u51fd\u6570\uff0c\u8fd4\u56de\u4e00\u4e2a\u5bf9\u8c61\uff0c\u5176_ctor\u4e2d\u4e3a\u52a8\u6001\u52a0\u8f7d\u903b\u8f91\u5305\u542b\u9700\u8981\u61d2\u52a0\u8f7d\u7ec4\u4ef6\u8c03\u7684\u4f4d\u7f6e"),(0,c.kt)("li",{parentName:"ol"},"forwardRef.js - - - - - - - - - - - - -\u5b9a\u4e49React.forwardRef\u51fd\u6570\uff0c\u63a5\u53d7\u4e00\u4e2a\u6e32\u67d3\u51fd\u6570\uff0c\u8fd4\u56de\u4e00\u4e2a\u5bf9\u8c61"),(0,c.kt)("li",{parentName:"ol"},"memo.js - - - - - - - - -  \u5b9a\u4e49React.memo()\u51fd\u6570\uff0c\u8fd4\u56de\u4e00\u4e2a$$typeof: REACT_MEMO_TYPE\u7684\u5bf9\u8c61")),(0,c.kt)("hr",null),(0,c.kt)("hr",null),(0,c.kt)("ol",null,(0,c.kt)("li",{parentName:"ol"},"ReactCurrentOwner.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - \u5b9a\u4e49ReactCurrentOwner\u5bf9\u8c61?"),(0,c.kt)("li",{parentName:"ol"},"ReactElement.js - - - - - - - - - - - - - - \u5b9a\u4e49ReactElement\u5bf9\u8c61\uff08props\u5c5e\u6027\u7b49\uff09\uff0ccreateElement\u51fd\u6570\u4e0ecloneElement\u51fd\u6570\u7b49")),(0,c.kt)("hr",null),(0,c.kt)("hr",null),(0,c.kt)("ol",null,(0,c.kt)("li",{parentName:"ol"},"ReactDebugCurrentFrame.js - - - - - - - - - - - - - - - - - - - -- - -  \u7528\u4e8e\u4fdd\u5b58\u5f53\u524ddebug\u7684\u7ec4\u4ef6\u5143\u7d20"),(0,c.kt)("li",{parentName:"ol"},"ReactChildren.js - - - - - - - - -  - - - \u6784\u5efareactchildren\u7684map\u3001forEach\u7b49API")),(0,c.kt)("hr",null),(0,c.kt)("hr",null),(0,c.kt)("ol",null,(0,c.kt)("li",{parentName:"ol"},"ReactHooks.js - - - - - - -  - - - - - - - - - - react hooks\uff08\u672a\u5206\u6790\uff0c\u6700\u540e\u8f7d\u5206\u6790\u6700\u65b0\u7248\u672c\u7684hooks\uff09")),(0,c.kt)("hr",null),(0,c.kt)("hr",null),(0,c.kt)("ol",null,(0,c.kt)("li",{parentName:"ol"},"ReactElementValidator.js - - - - - - - - - - \u5728react\u7ec4\u4ef6creatElement\u6216cloneElement\u4e4b\u524d\u5bf9\u4f20\u5165\u7684type\u8fdb\u884c\u9a8c\u8bc1\uff0c\u53e6\u5916\u5305\u542b\u5bf9fragement\u7279\u6b8a\u5904\u7406\u3002")),(0,c.kt)("hr",null),(0,c.kt)("hr",null),(0,c.kt)("ol",null,(0,c.kt)("li",{parentName:"ol"},"ReactSharedInternals.js - - - - - - - - - - - - - - - - - - - - - - - - - - - -  \u5185\u90e8\u5bf9\u8c61\uff08\u6682\u65f6\u672a\u7ed9\u51fa\u5206\u6790\uff09")),(0,c.kt)("hr",null))}p.isMDXComponent=!0}}]);