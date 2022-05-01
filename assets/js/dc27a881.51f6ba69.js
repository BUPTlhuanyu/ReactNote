"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[3806],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return d}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),i=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},s=function(e){var t=i(e.components);return n.createElement(u.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},h=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),h=i(r),d=a,m=h["".concat(u,".").concat(d)]||h[d]||l[d]||o;return r?n.createElement(m,c(c({ref:t},s),{},{components:r})):n.createElement(m,c({ref:t},s))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,c=new Array(o);c[0]=h;var p={};for(var u in t)hasOwnProperty.call(t,u)&&(p[u]=t[u]);p.originalType=e,p.mdxType="string"==typeof e?e:a,c[1]=p;for(var i=2;i<o;i++)c[i]=r[i];return n.createElement.apply(null,c)}return n.createElement.apply(null,r)}h.displayName="MDXCreateElement"},5591:function(e,t,r){r.r(t),r.d(t,{assets:function(){return s},contentTitle:function(){return u},default:function(){return d},frontMatter:function(){return p},metadata:function(){return i},toc:function(){return l}});var n=r(3117),a=r(102),o=(r(7294),r(3905)),c=["components"],p={id:"react-router-generatepath",sidebar_label:"generatePath",slug:"/react/react-router/others/react-router-generatepath",sidebar_position:5,title:""},u=void 0,i={unversionedId:"react/react-router/others/react-router-generatepath",id:"react/react-router/others/react-router-generatepath",title:"",description:"generatePath",source:"@site/docs/react/react-router/others/react-router4\u6e90\u7801\u6d45\u6790(\u4e94) \uff1ageneratePath.md",sourceDirName:"react/react-router/others",slug:"/react/react-router/others/react-router-generatepath",permalink:"/ReactNote/docs/react/react-router/others/react-router-generatepath",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react-router/others/react-router4\u6e90\u7801\u6d45\u6790(\u4e94) \uff1ageneratePath.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{id:"react-router-generatepath",sidebar_label:"generatePath",slug:"/react/react-router/others/react-router-generatepath",sidebar_position:5,title:""},sidebar:"react",previous:{title:"Router",permalink:"/ReactNote/docs/react/react-router/others/react-router-router"},next:{title:"Redirect",permalink:"/ReactNote/docs/react/react-router/others/react-router-redirect"}},s={},l=[{value:"generatePath",id:"generatepath",level:2},{value:"\u6e90\u7801",id:"\u6e90\u7801",level:3}],h={toc:l};function d(e){var t=e.components,r=(0,a.Z)(e,c);return(0,o.kt)("wrapper",(0,n.Z)({},h,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"generatepath"},"generatePath"),(0,o.kt)("p",null,"generatePath\u51fd\u6570\u4e3b\u8981\u8c03\u7528",(0,o.kt)("a",{parentName:"p",href:"https://github.com/pillarjs/path-to-regexp/blob/master/Readme.md"},"path-to-regexp"),"\u4e2d\u7684compile\u5b9e\u73b0\uff0ccompile\u7684\u4f5c\u7528\u662f\u6839\u636e\u8def\u5f84\u5339\u914d\u89c4\u5219\u4ea7\u751f\u4e00\u4e2a\u8def\u5f84\u751f\u6210\u51fd\u6570\uff0c\u5982\u4e0b\u4ee3\u7801\u6240\u793a\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"const toPath = pathToRegexp.compile('/user/:id')\n\ntoPath({ id: 123 }) //=> \"/user/123\"\ntoPath({ id: 'caf\xe9' }) //=> \"/user/caf%C3%A9\"\ntoPath({ id: '/' }) //=> \"/user/%2F\"\n\ntoPath({ id: ':/' }) //=> \"/user/%3A%2F\"\ntoPath({ id: ':/' }, { encode: (value, token) => value }) //=> \"/user/:/\"\n\nconst toPathRepeated = pathToRegexp.compile('/:segment+')\n\ntoPathRepeated({ segment: 'foo' }) //=> \"/foo\"\ntoPathRepeated({ segment: ['a', 'b', 'c'] }) //=> \"/a/b/c\"\n\nconst toPathRegexp = pathToRegexp.compile('/user/:id(\\\\d+)')\n\ntoPathRegexp({ id: 123 }) //=> \"/user/123\"\ntoPathRegexp({ id: '123' }) //=> \"/user/123\"\ntoPathRegexp({ id: 'abc' }) //=> Throws `TypeError`.\n")),(0,o.kt)("p",null,'generatePath(path = "/", params = {}) \u6839\u636e\u4f20\u5165\u7684path\u4ee5\u53caparams\u4ea7\u751f\u4e00\u4e2a\u8def\u5f84\uff0c\u5f53\u4f20\u5165\u7684path\u4e3a\u6839\u76ee\u5f55"/"\u65f6\uff0c\u76f4\u63a5\u8fd4\u56de"/"\u3002\u5982\u4e0b\u4f8b\u6240\u793a\uff1a'),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"console.log(generatePath('/user/:id',{id:123}),)    \n//\u8f93\u51fa\u4e3a\uff1a  \"/user/123\"\n")),(0,o.kt)("h3",{id:"\u6e90\u7801"},"\u6e90\u7801"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},'import pathToRegexp from "path-to-regexp";\n\nconst cache = {};\nconst cacheLimit = 10000;\nlet cacheCount = 0;\n\nfunction compilePath(path) {\n  if (cache[path]) return cache[path];\n\n  const generator = pathToRegexp.compile(path);\n\n  if (cacheCount < cacheLimit) {\n    cache[path] = generator;\n    cacheCount++;\n  }\n\n  return generator;\n}\n\n/**\n * Public API for generating a URL pathname from a path and parameters.\n */\nfunction generatePath(path = "/", params = {}) {\n  return path === "/" ? path : compilePath(path)(params, { pretty: true });\n}\n\nexport default generatePath;\n')))}d.isMDXComponent=!0}}]);