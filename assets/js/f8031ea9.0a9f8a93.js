"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[5516],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return m}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),l=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},p=function(e){var t=l(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),d=l(r),m=a,f=d["".concat(s,".").concat(m)]||d[m]||u[m]||o;return r?n.createElement(f,c(c({ref:t},p),{},{components:r})):n.createElement(f,c({ref:t},p))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,c=new Array(o);c[0]=d;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,c[1]=i;for(var l=2;l<o;l++)c[l]=r[l];return n.createElement.apply(null,c)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},988:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return i},contentTitle:function(){return s},metadata:function(){return l},toc:function(){return p},default:function(){return d}});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),c=["components"],i={},s="react-reconciler",l={unversionedId:"react/react/source-code/react@16.6/react-reconciler/README",id:"react/react/source-code/react@16.6/react-reconciler/README",isDocsHomePage:!1,title:"react-reconciler",description:"This is an experimental package for creating custom React renderers.",source:"@site/docs/react/react/source-code/react@16.6/react-reconciler/README.md",sourceDirName:"react/react/source-code/react@16.6/react-reconciler",slug:"/react/react/source-code/react@16.6/react-reconciler/README",permalink:"/ReactNote/docs/react/react/source-code/react@16.6/react-reconciler/README",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react/source-code/react@16.6/react-reconciler/README.md",tags:[],version:"current",frontMatter:{}},p=[{value:"API",id:"api",children:[]},{value:"Practical Examples",id:"practical-examples",children:[]}],u={toc:p};function d(e){var t=e.components,r=(0,a.Z)(e,c);return(0,o.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"react-reconciler"},"react-reconciler"),(0,o.kt)("p",null,"This is an experimental package for creating custom React renderers."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Its API is not as stable as that of React, React Native, or React DOM, and does not follow the common versioning scheme.")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Use it at your own risk.")),(0,o.kt)("h2",{id:"api"},"API"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"const Reconciler = require('react-reconciler');\n\nconst HostConfig = {\n  // You'll need to implement some methods here.\n  // See below for more information and examples.\n};\n\nconst MyRenderer = Reconciler(HostConfig);\n\nconst RendererPublicAPI = {\n  render(element, container, callback) {\n    // Call MyRenderer.updateContainer() to schedule changes on the roots.\n    // See ReactDOM, React Native, or React ART for practical examples.\n  }\n};\n\nmodule.exports = RendererPublicAPI;\n")),(0,o.kt)("h2",{id:"practical-examples"},"Practical Examples"),(0,o.kt)("p",null,'A "host config" is an object that you need to provide, and that describes how to make something happen in the "host" environment (e.g. DOM, canvas, console, or whatever your rendering target is). It looks like this:'),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"const HostConfig = {\n  createInstance(type, props) {\n    // e.g. DOM renderer returns a DOM node\n  },\n  // ...\n  supportsMutation: true, // it works by mutating nodes\n  appendChild(parent, child) {\n    // e.g. DOM renderer would call .appendChild() here\n  },\n  // ...\n};\n")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"For an introduction to writing a very simple custom renderer, check out this article series:")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},(0,o.kt)("a",{parentName:"strong",href:"https://medium.com/@agent_hunt/hello-world-custom-react-renderer-9a95b7cd04bc"},"Building a simple custom renderer to DOM"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},(0,o.kt)("a",{parentName:"strong",href:"https://medium.com/@agent_hunt/introduction-to-react-native-renderers-aka-react-native-is-the-java-and-react-native-renderers-are-828a0022f433"},"Building a simple custom renderer to native")))),(0,o.kt)("p",null,"The full list of supported methods ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js"},"can be found here"),". For their signatures, we recommend looking at specific examples below."),(0,o.kt)("p",null,"The React repository includes several renderers. Each of them has its own host config."),(0,o.kt)("p",null,"The examples in the React repository are declared a bit differently than a third-party renderer would be. In particular, the ",(0,o.kt)("inlineCode",{parentName:"p"},"HostConfig")," object mentioned above is never explicitly declared, and instead is a ",(0,o.kt)("em",{parentName:"p"},"module")," in our code. However, its exports correspond directly to properties on a ",(0,o.kt)("inlineCode",{parentName:"p"},"HostConfig")," object you'd need to declare in your code:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/facebook/react/blob/master/packages/react-art/src/ReactART.js"},"React ART")," and its ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/facebook/react/blob/master/packages/react-art/src/ReactARTHostConfig.js"},"host config")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOM.js"},"React DOM")," and its ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMHostConfig.js"},"host config")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/facebook/react/blob/master/packages/react-native-renderer/src/ReactNativeRenderer.js"},"React Native")," and its ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/facebook/react/blob/master/packages/react-native-renderer/src/ReactNativeHostConfig.js"},"host config"))),(0,o.kt)("p",null,"If these links break please file an issue and we\u2019ll fix them. They intentionally link to the latest versions since the API is still evolving. If you have more questions please file an issue and we\u2019ll try to help!"))}d.isMDXComponent=!0}}]);