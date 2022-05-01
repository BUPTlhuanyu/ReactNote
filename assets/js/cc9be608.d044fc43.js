"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[6166],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return s}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),i=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},m=function(e){var t=i(e.components);return a.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),d=i(n),s=r,k=d["".concat(c,".").concat(s)]||d[s]||u[s]||o;return n?a.createElement(k,p(p({ref:t},m),{},{components:n})):a.createElement(k,p({ref:t},m))}));function s(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,p=new Array(o);p[0]=d;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:r,p[1]=l;for(var i=2;i<o;i++)p[i]=n[i];return a.createElement.apply(null,p)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4443:function(e,t,n){n.r(t),n.d(t,{assets:function(){return m},contentTitle:function(){return c},default:function(){return s},frontMatter:function(){return l},metadata:function(){return i},toc:function(){return u}});var a=n(3117),r=n(102),o=(n(7294),n(3905)),p=["components"],l={id:"component-reactelement",sidebar_label:"\u7ec4\u4ef6\u4e0eReactElement\u7684\u5173\u7cfb",slug:"/react/react/ReactElement/component-reactelement",sidebar_position:1,title:""},c=void 0,i={unversionedId:"react/react/ReactElement/component-reactelement",id:"react/react/ReactElement/component-reactelement",title:"",description:"\u200b\u672c\u6587\u4f1a\u4ecb\u7ecdReact \u5bf9\u8c61\u4e2d\u4e0e\u7ec4\u4ef6\u76f8\u5173\u7684 API \u7684\u5b9e\u73b0\uff0c\u4ee5\u53ca\u5404\u79cd\u7c7b\u578b\u7684\u7ec4\u4ef6\u4e0eReactElement\u7684\u5173\u7cfb\u3002",source:"@site/docs/react/react/ReactElement/component-reactelement.md",sourceDirName:"react/react/ReactElement",slug:"/react/react/ReactElement/component-reactelement",permalink:"/ReactNote/docs/react/react/ReactElement/component-reactelement",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react/ReactElement/component-reactelement.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{id:"component-reactelement",sidebar_label:"\u7ec4\u4ef6\u4e0eReactElement\u7684\u5173\u7cfb",slug:"/react/react/ReactElement/component-reactelement",sidebar_position:1,title:""},sidebar:"react",previous:{title:"ReactElement\u4ee5\u53caChildren",permalink:"/ReactNote/docs/react/react/ReactElement/reactelement-and-children"},next:{title:"react\u6587\u4ef6\u5939-\u6e90\u7801\u5165\u53e3",permalink:"/ReactNote/docs/react/react/ReactElement/others/react-entry"}},m={},u=[{value:"\u6545\u4e8b\u7684\u5f00\u59cb\u4ece\u4e00\u884c\u4ee3\u7801\u8bf4\u8d77",id:"\u6545\u4e8b\u7684\u5f00\u59cb\u4ece\u4e00\u884c\u4ee3\u7801\u8bf4\u8d77",level:2},{value:"React \u7684\u7f16\u8bd1\u65f6\u4e0e\u8fd0\u884c\u65f6",id:"react-\u7684\u7f16\u8bd1\u65f6\u4e0e\u8fd0\u884c\u65f6",level:3},{value:"ReactElement\u4e0e\u7ec4\u4ef6\u7684\u5173\u7cfb",id:"reactelement\u4e0e\u7ec4\u4ef6\u7684\u5173\u7cfb",level:2},{value:"\u7c7b\u7ec4\u4ef6\u8d85\u7c7b React.Component \u4e0eReact.PureComponent",id:"\u7c7b\u7ec4\u4ef6\u8d85\u7c7b-reactcomponent-\u4e0ereactpurecomponent",level:3},{value:"updater",id:"updater",level:4},{value:"\u5b9e\u73b0React\u81ea\u5b9a\u4e49\u6807\u7b7e\u7ec4\u4ef6 Fragment,StrictMode,Fragment",id:"\u5b9e\u73b0react\u81ea\u5b9a\u4e49\u6807\u7b7e\u7ec4\u4ef6-fragmentstrictmodefragment",level:3},{value:"ReactElement.type \u4e3a\u5bf9\u8c61",id:"reactelementtype-\u4e3a\u5bf9\u8c61",level:3},{value:"\u603b\u7ed3",id:"\u603b\u7ed3",level:2}],d={toc:u};function s(e){var t=e.components,n=(0,r.Z)(e,p);return(0,o.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"\u200b\u672c\u6587\u4f1a\u4ecb\u7ecd",(0,o.kt)("inlineCode",{parentName:"p"},"React")," \u5bf9\u8c61\u4e2d\u4e0e\u7ec4\u4ef6\u76f8\u5173\u7684 ",(0,o.kt)("inlineCode",{parentName:"p"},"API")," \u7684\u5b9e\u73b0\uff0c\u4ee5\u53ca\u5404\u79cd\u7c7b\u578b\u7684\u7ec4\u4ef6\u4e0e",(0,o.kt)("inlineCode",{parentName:"p"},"ReactElement"),"\u7684\u5173\u7cfb\u3002"),(0,o.kt)("h2",{id:"\u6545\u4e8b\u7684\u5f00\u59cb\u4ece\u4e00\u884c\u4ee3\u7801\u8bf4\u8d77"},"\u6545\u4e8b\u7684\u5f00\u59cb\u4ece\u4e00\u884c\u4ee3\u7801\u8bf4\u8d77"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"import React from 'react';\n")),(0,o.kt)("p",null,"\u6211\u4eec\u4ece",(0,o.kt)("inlineCode",{parentName:"p"},"react"),"\u8fd9\u4e2a\u5305\u4e2d\u83b7\u5f97\u4e86",(0,o.kt)("inlineCode",{parentName:"p"},"React"),"\u8fd9\u6837\u4e00\u4e2a\u5bf9\u8c61\uff0c\u901a\u8fc7\u67e5\u770b",(0,o.kt)("a",{parentName:"p",href:"https://react.docschina.org/docs/react-api.html"},"React \u9876\u5c42 API"),"\u6211\u4eec\u53ef\u4ee5\u6784\u5efa\u5982\u4e0b",(0,o.kt)("inlineCode",{parentName:"p"},"React"),"\u5bf9\u8c61\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"const React = {\n    // \u7ec4\u4ef6\n  createRef,\n  Component,\n  PureComponent,\n  createContext,\n  forwardRef,\n  lazy,\n  memo,\n  Fragment: REACT_FRAGMENT_TYPE,\n  StrictMode: REACT_STRICT_MODE_TYPE,\n  Suspense: REACT_SUSPENSE_TYPE,\n  // ReactElement\n  createElement: createElement,\n  cloneElement: cloneElement,\n  createFactory: createFactory,\n  isValidElement: isValidElement,\n  Children: {\n    map,\n    forEach,\n    count,\n    toArray,\n    only,\n  },\n  // hooks\n  useCallback,\n  useContext,\n  useEffect,\n  useImperativeHandle,\n  useDebugValue,\n  useLayoutEffect,\n  useMemo,\n  useReducer,\n  useRef,\n  useState\n};\n")),(0,o.kt)("h3",{id:"react-\u7684\u7f16\u8bd1\u65f6\u4e0e\u8fd0\u884c\u65f6"},"React \u7684\u7f16\u8bd1\u65f6\u4e0e\u8fd0\u884c\u65f6"),(0,o.kt)("p",null,"\u6211\u4eec\u9996\u5148\u4ecb\u7ecd\u4e00\u4e0b",(0,o.kt)("inlineCode",{parentName:"p"},"React"),"\u7684\u7f16\u8bd1\u65f6\u4e0e\u8fd0\u884c\u65f6\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"class App extends React.Component {\n    render() {\n        return <ClassType />\n    }\n}\nclass ClassType extends React.Component {\n    render() {\n        return <div>123</div>\n    }\n}\n")),(0,o.kt)("p",null,"\u4e0a\u9762\u4e00\u6bb5\u4ee3\u7801\uff0c\u5728\u5229\u7528",(0,o.kt)("inlineCode",{parentName:"p"},"babel"),"\u5c06",(0,o.kt)("inlineCode",{parentName:"p"},"jsx"),"\u7f16\u8bd1\u6210",(0,o.kt)("inlineCode",{parentName:"p"},"js"),"\u4e4b\u524d\u662f\u65e0\u6cd5\u76f4\u63a5\u5728\u6d4f\u89c8\u5668\u4e2d\u6267\u884c\u7684\u3002\u5728\u7ecf\u8fc7 ",(0,o.kt)("inlineCode",{parentName:"p"},"@babel/babel-transform-react-jsx"),"\u7684\u7f16\u8bd1\u4e4b\u540e\u4f1a\u5f97\u5230\u5982\u4e0b\u7ed3\u679c\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},'class App extends React.Component {\n  render() {\n    return /*#__PURE__*/React.createElement(ClassType, null);\n  }\n}\nclass ClassType extends React.Component {\n  render() {\n    return /*#__PURE__*/React.createElement("div", null, "123");\n  }\n}\n')),(0,o.kt)("h2",{id:"reactelement\u4e0e\u7ec4\u4ef6\u7684\u5173\u7cfb"},"ReactElement\u4e0e\u7ec4\u4ef6\u7684\u5173\u7cfb"),(0,o.kt)("p",null,"\u5927\u5bb6\u90fd\u77e5\u9053\u7ec4\u4ef6\u5206\u4e3a\u7c7b\u7ec4\u4ef6\u4e0e\u51fd\u6570\u7ec4\u4ef6\uff0c\u90a3\u4e48React \u4e2d\u5230\u5e95\u6709\u54ea\u4e9b\u7ec4\u4ef6\u5462\uff1f"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"React.Component")," \u7684\u5b50\u7c7b\u7ec4\u4ef6"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"React.PureComponent")," \u7684\u5b50\u7c7b\u7ec4\u4ef6"),(0,o.kt)("li",{parentName:"ul"},"\u666e\u901a\u7684\u51fd\u6570\u7ec4\u4ef6"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"React.memo"),"\u9ad8\u9636\u7ec4\u4ef6"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"React.Fragment")," \u7ec4\u4ef6"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"React.lazy"),"\u61d2\u52a0\u8f7d\u7ec4\u4ef6"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"React.forwardRef"),"\u7ec4\u4ef6"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"React.createContext().Provider"),"\u4ee5\u53ca",(0,o.kt)("inlineCode",{parentName:"li"},"React.createContext().Consumer"),"\u7ec4\u4ef6"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"React.Suspense"),"\u7ec4\u4ef6")),(0,o.kt)("p",null,"\u4ece\u4e0a\u9762\u8fd0\u884c\u65f6\u4ee3\u7801\u53ef\u4ee5\u770b\u5230",(0,o.kt)("inlineCode",{parentName:"p"},"jsx"),"\u88ab\u7f16\u8bd1\u6210\u4e86",(0,o.kt)("inlineCode",{parentName:"p"},"React.createElement"),"\u7684\u8c03\u7528\u5f62\u5f0f\u3002\u90a3\u4e48",(0,o.kt)("inlineCode",{parentName:"p"},"ReactElement"),"\u4e0e\u7ec4\u4ef6\u7684\u5173\u7cfb\u5230\u5e95\u662f\u600e\u6837\u7684\u5462\uff1f\u5148\u770b\u4e0b\u9762\u7684\u4ee3\u7801\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"React.createElement(ClassType, null);\n")),(0,o.kt)("p",null,"\u53ef\u4ee5\u770b\u5230",(0,o.kt)("inlineCode",{parentName:"p"},"ClassType"),"\u8fd9\u4e2a\u7c7b(\u7c7b\u6784\u9020\u51fd\u6570)\u88ab\u5f53\u4f5c\u4e86",(0,o.kt)("inlineCode",{parentName:"p"},"createElement"),"\u7684\u7b2c\u4e00\u4e2a\u53c2\u6570\uff0c\u800c",(0,o.kt)("inlineCode",{parentName:"p"},"createElement"),"\u5219\u662f\u4e13\u95e8\u7528\u6765\u751f\u6210",(0,o.kt)("inlineCode",{parentName:"p"},"ReactElement"),"\u7684\u51fd\u6570\u3002\u5728\u4e0a\u4e00\u7bc7\u6587\u7ae0\u4e2d\u6211\u4eec\u63d0\u5230\uff1a",(0,o.kt)("inlineCode",{parentName:"p"},"ReactElement.type"),"\u4ee3\u8868\u4e86\u3010\u884c\u4e3a\u3011\uff0c",(0,o.kt)("inlineCode",{parentName:"p"},"ReactElement.$$typeof"),"\u4ee3\u8868\u4e86\u3010\u7ec4\u4ef6\u7c7b\u578b\u3011\uff0c\u5e76\u4e14",(0,o.kt)("inlineCode",{parentName:"p"},"ReactElement.type"),"\u6709\u5982\u4e0b\u503c\uff1a"),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"\u5728\u8c03\u7528 ",(0,o.kt)("inlineCode",{parentName:"p"},"createElement")," \u521b\u5efa ",(0,o.kt)("inlineCode",{parentName:"p"},"ReactElement")," \u7684\u65f6\u5019\uff0c\u4f20\u5165\u7684\u7b2c\u4e00\u4e2a\u53c2\u6570\u4e3a ",(0,o.kt)("inlineCode",{parentName:"p"},"type")," \u5c5e\u6027\u7684\u503c\uff0c\u5982\u679c\u662f\u5b57\u7b26\u4e32\u6bd4\u5982",(0,o.kt)("inlineCode",{parentName:"p"},"'div'"),"\uff0c\u5219\u8868\u793a\u8be5",(0,o.kt)("inlineCode",{parentName:"p"},"react"),"\u5b9e\u4f8b\u5bf9\u5e94\u4e00\u4e2a\u771f\u5b9e\u7684",(0,o.kt)("inlineCode",{parentName:"p"},"dom"),"\uff1b\u5982\u679c\u662f\u4e00\u4e2a\u51fd\u6570\uff0c\u5219\u8868\u793a\u4e00\u4e2a\u51fd\u6570/\u7c7b\u7ec4\u4ef6\uff1b\u4e5f\u53ef\u80fd\u662f\u4e00\u4e2a\u5bf9\u8c61(",(0,o.kt)("inlineCode",{parentName:"p"},"typeof  === 'object'"),")\uff0c\u6bd4\u5982 ",(0,o.kt)("inlineCode",{parentName:"p"},"Context.Provider"),"\uff0c",(0,o.kt)("inlineCode",{parentName:"p"},"Context.Consumer"),"\uff0c",(0,o.kt)("inlineCode",{parentName:"p"},"React.lazy"),"\uff0c",(0,o.kt)("inlineCode",{parentName:"p"},"React.forwardRef"),"\uff0c",(0,o.kt)("inlineCode",{parentName:"p"},"React.memo"))),(0,o.kt)("p",null,"\u90a3\u4e48\u6211\u4eec\u53ef\u4ee5\u505a\u5982\u4e0b\u603b\u7ed3\uff1a\u4f60\u6240\u5199\u7684\u7ec4\u4ef6\u7684\u6784\u9020\u51fd\u6570\u6216\u8005\u8bf4\u51fd\u6570\u90fd\u4f1a\u88ab\u6302\u5728",(0,o.kt)("inlineCode",{parentName:"p"},"ReactElement.type"),"\u5c5e\u6027\u4e0a\uff0c",(0,o.kt)("inlineCode",{parentName:"p"},"React"),"\u53ef\u4ee5\u5728\u5408\u9002\u7684\u65f6\u673a\u901a\u8fc7\u5b83\u6765\u6267\u884c\u7279\u5b9a\u7684\u51fd\u6570\uff0c\u4ece\u800c\u8868\u73b0\u51fa\u4f60\u60f3\u8981\u7684\u884c\u4e3a\u3002"),(0,o.kt)("p",null,"\u601d\u8003\uff1a\u4ec0\u4e48\u65f6\u5019\u4f1a\u6267\u884c\u8fd9\u4e9b\u6784\u9020\u51fd\u6570\u6216\u8005\u51fd\u6570\u5462\uff1f\u8fd9\u4e2a\u540e\u7eed\u6587\u7ae0\u4f1a\u8bf4\u660e\uff0c\u7b49\u4e0d\u53ca\u7684\u53ef\u4ee5\u5148\u53bb",(0,o.kt)("a",{parentName:"p",href:"https://buptlhuanyu.github.io/ReactNote/docs/react/react/intro"},"\u56fe\u91cc"),"\u627e",(0,o.kt)("inlineCode",{parentName:"p"},"updateClassComponent"),"\u51fd\u6570\u3002"),(0,o.kt)("h3",{id:"\u7c7b\u7ec4\u4ef6\u8d85\u7c7b-reactcomponent-\u4e0ereactpurecomponent"},"\u7c7b\u7ec4\u4ef6\u8d85\u7c7b React.Component \u4e0eReact.PureComponent"),(0,o.kt)("p",null,"\u8d81\u70ed\u6253\u94c1\uff0c\u63a5\u7740\u4e0a\u8fb9\u7f57\u5217\u51fa\u6765\u7684\u7ec4\u4ef6\u79cd\u7c7b\uff0c\u5148\u6765\u8bf4\u8bf4\u7c7b\u7ec4\u4ef6\uff0c",(0,o.kt)("inlineCode",{parentName:"p"},"React.Component"),"\u5982\u4f55\u5b9e\u73b0\uff0c"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"function Component(props, context, updater) {\n  this.props = props;\n  this.context = context;\n  this.refs = emptyObject;\n  this.updater = updater || ReactNoopUpdateQueue;\n}\nComponent.prototype.isReactComponent = {};\nComponent.prototype.setState = function(partialState, callback) {\n  this.updater.enqueueSetState(this, partialState, callback, 'setState');\n};\nComponent.prototype.forceUpdate = function(callback) {\n  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');\n};\n")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"React.PureComponent"),"\u901a\u8fc7\u5bc4\u751f\u7ec4\u5408\u5f0f\u7ee7\u627f\u6765\u5b9e\u73b0\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"function ComponentDummy(){};\nComponentDummy.prototype = Component.prototype;\nfunction PureComponent(props, context, updater) {\n  this.props = props;\n  this.context = context;\n  this.refs = emptyObject;\n  this.updater = updater || ReactNoopUpdateQueue;\n}\nconst pureComponentPrototype = PureComponent.prototype = new ComponentDummy();\npureComponentPrototype.constructor = PureComponent;\nObject.assign(pureComponentPrototype, Component.prototype);\npureComponentPrototype.isPureReactComponent = true;\n")),(0,o.kt)("p",null,"\u6b64\u5916\u8fd8\u6709\u4e00\u4e2a\u5730\u65b9\u9700\u8981\u6ce8\u610f\uff0c\u76f4\u63a5\u5c06\u8d85\u7c7b",(0,o.kt)("inlineCode",{parentName:"p"},"Component"),"\u7684\u539f\u578b\u65b9\u6cd5\u590d\u5236\u5230\u4e86\u81ea\u5df1\u7684\u539f\u578b\u5bf9\u8c61\u4e0a\uff0c\u8f83\u5c11\u67e5\u627e\u6b21\u6570\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"Object.assign(pureComponentPrototype, Component.prototype);\n")),(0,o.kt)("h4",{id:"updater"},"updater"),(0,o.kt)("p",null,"\u5728\u7c7b\u7ec4\u4ef6\u7684\u5b9e\u4f8b\u5c5e\u6027\u4e2d\u6709\u4e2a",(0,o.kt)("inlineCode",{parentName:"p"},"updater"),"\u6709\u70b9\u5947\u602a\uff0c\u6211\u4eec\u5728\u5199\u7ec4\u4ef6\u7684\u65f6\u5019\uff0c\u6784\u9020\u51fd\u6570\u53ea\u4f20\u5165\u4e86\u4e24\u4e2a\u53c2\u6570\uff0c ",(0,o.kt)("inlineCode",{parentName:"p"},"props"),"\u4e0e",(0,o.kt)("inlineCode",{parentName:"p"},"context"),"\uff0c\u7b2c\u4e09\u4e2a\u53c2\u6570\u59cb\u7ec8\u662f",(0,o.kt)("inlineCode",{parentName:"p"},"undefined"),"\uff0c\u8fd9\u4e2a\u5730\u65b9\u9700\u8981\u6ce8\u610f\u4e86\uff0c\u7ec4\u4ef6\u5904\u7406",(0,o.kt)("inlineCode",{parentName:"p"},"state"),"\u7684\u903b\u8f91\u662f\u7531",(0,o.kt)("inlineCode",{parentName:"p"},"updater"),"\u63d0\u4f9b\u7684\uff0cReact \u5185\u90e8\u5728\u5b9e\u4f8b\u5316\u7ec4\u4ef6\u4e4b\u540e\uff0c\u4f1a\u7acb\u5373\u7ed9",(0,o.kt)("inlineCode",{parentName:"p"},"updater"),"\u8d4b\u503c\u4e3a",(0,o.kt)("inlineCode",{parentName:"p"},"constructClassInstance"),"\uff0c\u53ef\u4ee5\u5148\u53bb",(0,o.kt)("a",{parentName:"p",href:"https://buptlhuanyu.github.io/ReactNote/docs/react/react/intro"},"\u56fe\u91cc"),"\u627e",(0,o.kt)("inlineCode",{parentName:"p"},"updateClassComponent"),"\u51fd\u6570\u3002\n",(0,o.kt)("inlineCode",{parentName:"p"},"updater")," \u5bf9\u8c61\u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"const classComponentUpdater = {\n  isMounted,\n  enqueueSetState(inst, payload, callback) {},\n  enqueueReplaceState(inst, payload, callback) {},\n  enqueueForceUpdate(inst, callback) {},\n};\n")),(0,o.kt)("p",null,"\u4e09\u4e2a\u65b9\u6cd5\u7684\u5b9e\u73b0\u57fa\u672c\u4e00\u81f4\uff0c\u90fd\u4f1a\u5148\u8ba1\u7b97\u4e00\u4e2a\u3010\u5230\u671f\u65f6\u95f4\u3011\uff0c\u7136\u540e\u751f\u6210\u4e00\u4e2a ",(0,o.kt)("inlineCode",{parentName:"p"},"update")," \u66f4\u65b0\u5bf9\u8c61\uff0c\u63a5\u7740\u5c06\u8be5\u5bf9\u8c61\u6dfb\u52a0\u5230",(0,o.kt)("inlineCode",{parentName:"p"},"fiber"),"\u4e0a\u7684",(0,o.kt)("inlineCode",{parentName:"p"},"update"),"\u5355\u5411\u73af\u5f62\u94fe\u8868\u4e2d\uff08\u5728",(0,o.kt)("inlineCode",{parentName:"p"},"React"),"\u4e2d\uff0c\u7531\u4e8e\u65e2\u4fdd\u5b58\u4e86\u94fe\u8868\u5934\u8282\u70b9\u53c8\u4fdd\u5b58\u4e86\u5c3e\u8282\u70b9\uff0c\u6240\u4ee5\u6ca1\u6709\u4f53\u73b0\u73af\u5f62\u5355\u94fe\u7684\u4f18\u52bf\u3002\u5982\u679c\u5728\u53ea\u4fdd\u5b58\u4e00\u4e2a\u8282\u70b9\u7684\u6761\u4ef6\u4e0b\uff0c\u663e\u7136\u4fdd\u5b58\u73af\u5f62\u94fe\u8868\u7684\u5c3e\u8282\u70b9\u5219\u53ef\u5b9e\u73b0O(1)\u7684\u961f\u5217\uff09\uff0c\u6700\u540e\u5f00\u59cb\u8c03\u5ea6",(0,o.kt)("inlineCode",{parentName:"p"},"fiber"),"\u6811\uff0c\u8fdb\u884c\u65b0\u4e00\u8f6e\u7684\u66f4\u65b0\u3002"),(0,o.kt)("h3",{id:"\u5b9e\u73b0react\u81ea\u5b9a\u4e49\u6807\u7b7e\u7ec4\u4ef6-fragmentstrictmodefragment"},"\u5b9e\u73b0React\u81ea\u5b9a\u4e49\u6807\u7b7e\u7ec4\u4ef6 Fragment,StrictMode,Fragment"),(0,o.kt)("p",null,"\u8fd9\u4e09\u4e2a",(0,o.kt)("inlineCode",{parentName:"p"},"API"),"\u7684\u503c\u90fd\u662f",(0,o.kt)("inlineCode",{parentName:"p"},"symbole"),"\u7c7b\u578b\uff0c\u90fd\u80fd\u591f\u76f4\u63a5\u7528\u505a\u4e00\u4e2a React \u6807\u7b7e\u7ec4\u4ef6\u3002\u4e0e\u539f\u751f\u6807\u7b7e",(0,o.kt)("inlineCode",{parentName:"p"},"div"),"\uff08",(0,o.kt)("inlineCode",{parentName:"p"},"HostComponent"),"\uff09\u7c7b\u4f3c\uff0c\u5176\u5bf9\u5e94\u7684 ",(0,o.kt)("inlineCode",{parentName:"p"},"ReactElement.type"),"\u90fd\u662f\u4e0d\u662f\u51fd\u6570\uff0c",(0,o.kt)("inlineCode",{parentName:"p"},"React")," \u4f1a\u6839\u636e\u8be5\u503c\u8c03\u7528\u4e0d\u540c\u7684\u65b9\u6cd5\u6765\u521b\u5efa ",(0,o.kt)("inlineCode",{parentName:"p"},"fiber"),"\uff0c\u6bd4\u5982:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-JavaScript"},"function createFiberFromFragment(){}\nfunction createFiberFromMode\nfunction createFiberFromSuspense\n")),(0,o.kt)("p",null,"\u56e0\u6b64\u8fd9\u91cc\u505a\u597d\u6807\u8bb0\u5373\u53ef"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');\nconst REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');\nconst REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');\nconst React = {\n    // \u7ec4\u4ef6\n  Component,\n  PureComponent,\n  Fragment: REACT_FRAGMENT_TYPE,\n  StrictMode: REACT_STRICT_MODE_TYPE,\n  Suspense: REACT_SUSPENSE_TYPE,\n  ...\n};\n")),(0,o.kt)("h3",{id:"reactelementtype-\u4e3a\u5bf9\u8c61"},"ReactElement.type \u4e3a\u5bf9\u8c61"),(0,o.kt)("p",null,"\u5f53\u4f60\u4f7f\u7528",(0,o.kt)("inlineCode",{parentName:"p"},"React.forwardRef"),",",(0,o.kt)("inlineCode",{parentName:"p"},"React.memo"),",",(0,o.kt)("inlineCode",{parentName:"p"},"React.lazy"),",",(0,o.kt)("inlineCode",{parentName:"p"},"React.createContext"),"\u8fd9\u56db\u4e2a\u9ad8\u9636\u51fd\u6570\u751f\u6210\u7ec4\u4ef6\u7684\u65f6\u5019\uff0c",(0,o.kt)("inlineCode",{parentName:"p"},"ReactElement.type"),"\u4e3a\u4e00\u4e2a\u5bf9\u8c61\uff0c\u5fc5\u5b9a\u5305\u542b",(0,o.kt)("inlineCode",{parentName:"p"},"$$typeof"),"\u5c5e\u6027\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"// `React.forwardRef` \nreturn {\n    $$typeof: REACT_FORWARD_REF_TYPE,\n    render, // (props, ref) => React$Node\n};\n// `React.memo`\nreturn {\n    $$typeof: REACT_MEMO_TYPE,\n    type,\n    compare: compare === undefined ? null : compare, // (oldProps, newProps) => boolean\n};\n// `React.lazy`, e.g. React.lazy(() => import('path/to/Disc'))\nreturn {\n    $$typeof: REACT_LAZY_TYPE, //REACT_LAZY_TYPE\u7ec4\u4ef6\u7c7b\u578b\n    _ctor: ctor, //\u52a8\u6001\u52a0\u8f7d\u903b\u8f91\n    // React uses these fields to store the result.\n    _status: -1,\n    _result: null,\n};\n// `React.createContext`\nreturn const context = {\n  $$typeof: REACT_CONTEXT_TYPE,\n  Provider: {\n    $$typeof: REACT_PROVIDER_TYPE,\n    _context: context,\n  },\n  Consumer: context,\n};\n")),(0,o.kt)("p",null,"\u8fd9\u6837\u6211\u4eec\u4e5f\u53ef\u4ee5\u5b9a\u5236\u4e00\u4e9b\u81ea\u5df1\u9700\u8981\u7684\u7ec4\u4ef6\uff0c\u9664\u4e86\u5728\u6b64\u5904\u589e\u52a0\u4e0d\u540c\u7684",(0,o.kt)("inlineCode",{parentName:"p"},"$$typeof"),"\u4e4b\u5916\uff0c\u8fd8\u9700\u589e\u52a0\u5bf9\u5e94\u7684",(0,o.kt)("inlineCode",{parentName:"p"},"createFiber"),"\u7684\u65b9\u6cd5\u3002"),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"\u6ce8\u610f\uff1amemo\u4e0eforwardRef\u7ec4\u5408\u4f7f\u7528\u7684\u65f6\u5019\uff0c\u6b63\u786e\u7684\u65b9\u5f0f\u4e3a\uff1amemo(forwardRef(...))\uff0c\u56e0\u4e3aforwardRef\u9700\u8981\u63a5\u6536\u4e00\u4e2arender\u51fd\u6570\uff0c\u8be5render\u51fd\u6570\u4e3a(props, ref) => React$Node\u3002")),(0,o.kt)("h2",{id:"\u603b\u7ed3"},"\u603b\u7ed3"),(0,o.kt)("p",null,"\u200b\t\t\u672c\u6587\u4ecb\u7ecd\u4e86\uff0c",(0,o.kt)("inlineCode",{parentName:"p"},"React")," \u5bf9\u8c61\u4e2d\u4e0e\u7ec4\u4ef6\u76f8\u5173\u7684 ",(0,o.kt)("inlineCode",{parentName:"p"},"API")," \u7684\u5b9e\u73b0\uff0c\u804a\u4e86\u5404\u79cd\u7ec4\u4ef6\u79cd\u7c7b\u4e0e",(0,o.kt)("inlineCode",{parentName:"p"},"ReactElement"),"\u7684\u5173\u7cfb\u3002\u4e0b\u4e00\u7bc7\u5c06\u4f1a\u4ecb\u7ecd\u5982\u4f55\u521b\u5efa\u4e00\u4e2a ",(0,o.kt)("inlineCode",{parentName:"p"},"ReactElement"),"\uff0c\u4ee5\u53ca ",(0,o.kt)("inlineCode",{parentName:"p"},"Children")," \u5404\u4e2a\u65b9\u6cd5\u7684\u5b9e\u73b0\u539f\u7406\u3002"))}s.isMDXComponent=!0}}]);