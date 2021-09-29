"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[9276],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return f}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),u=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(p.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),m=u(n),f=a,g=m["".concat(p,".").concat(f)]||m[f]||s[f]||o;return n?r.createElement(g,i(i({ref:t},c),{},{components:n})):r.createElement(g,i({ref:t},c))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var u=2;u<o;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},4611:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return p},metadata:function(){return u},assets:function(){return c},toc:function(){return s},default:function(){return f}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],l={slug:"blog-post",title:"AOP design-pattern in javascript",authors:"lhuanyu",tags:["design-pattern"]},p=void 0,u={permalink:"/ReactNote/blog/blog-post",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/blog/2021-09-29-blog-post.md",source:"@site/blog/2021-09-29-blog-post.md",title:"AOP design-pattern in javascript",description:"- x] [\u7b80\u4ecb",date:"2021-09-29T00:00:00.000Z",formattedDate:"September 29, 2021",tags:[{label:"design-pattern",permalink:"/ReactNote/blog/tags/design-pattern"}],readingTime:3.545,truncated:!1,authors:[{name:"liaohuanyu",title:"Maintainer of ReactNote",url:"https://github.com/BUPTlhuanyu",imageURL:"https://github.com/BUPTlhuanyu.png",key:"lhuanyu"}],nextItem:{title:"First Blog Post",permalink:"/ReactNote/blog/first-blog-post"}},c={authorsImageUrls:[void 0]},s=[{value:"\u9762\u5411\u5207\u9762\u7f16\u7a0b\uff08AOP\uff09\u7b80\u4ecb",id:"\u9762\u5411\u5207\u9762\u7f16\u7a0baop\u7b80\u4ecb",children:[]},{value:"\u7528AOP\u6539\u5584javascript\u4ee3\u7801",id:"\u7528aop\u6539\u5584javascript\u4ee3\u7801",children:[{value:"\u5c0f\u7ed3",id:"\u5c0f\u7ed3",children:[]}]}],m={toc:s};function f(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("ul",{className:"contains-task-list"},(0,o.kt)("li",{parentName:"ul",className:"task-list-item"},(0,o.kt)("input",{parentName:"li",type:"checkbox",checked:!0,disabled:!0})," ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/chenshenhai/koajs-design-note/blob/master/note/chapter02/01.md"},"\u7b80\u4ecb")),(0,o.kt)("li",{parentName:"ul",className:"task-list-item"},(0,o.kt)("input",{parentName:"li",type:"checkbox",checked:!0,disabled:!0})," ",(0,o.kt)("a",{parentName:"li",href:"http://www.alloyteam.com/2013/08/yong-aop-gai-shan-javascript-dai-ma/"},"\u7528AOP\u6539\u5584javascript\u4ee3\u7801"))),(0,o.kt)("h2",{id:"\u9762\u5411\u5207\u9762\u7f16\u7a0baop\u7b80\u4ecb"},"\u9762\u5411\u5207\u9762\u7f16\u7a0b\uff08AOP\uff09\u7b80\u4ecb"),(0,o.kt)("p",null,"\u8be5\u6587\u4e2d\u4e00\u4e2a\u91cd\u8981\u7684\u542f\u53d1\u662f\u5229\u7528\u51fd\u6570\u66ff\u6362\u7684\u65b9\u5f0f\u6765\u5b9e\u73b0AOP(\u5f53\u7136\u8fd9\u6837\u5e76\u4e0d\u662f\u6700\u597d\u7684\uff0c\u4e0b\u9762\u6587\u7ae0\u4f1a\u8bf4\u5230)\uff0c\u4f8b\u5b50\uff1a"),(0,o.kt)("p",null,"\u66ff\u6362\u65b9\u6cd5"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"var origDoSomething = thing.doSomething;\n// Method replacement is a simple form of AOP\nthing.doSomething = function() {\n    doSomethingElseFirst();\n    return origDoSomething.apply(this, arguments);\n}\n")),(0,o.kt)("p",null,"\u66ff\u6362\u539f\u578b"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"var origDoSomething = Thing.prototype.doSomething;\nThing.prototype.doSomething = function() {\n    var start = Date.now();\n    var result = origDoSomething.apply(this, arguments);\n    console.log((Date.now() - start) + 'ms', x, y, result);\n    return result;\n}\n")),(0,o.kt)("p",null,"\u4e0a\u9762\u7684\u65b9\u5f0f\u4e5f\u88ab\u79f0\u4e3a ",(0,o.kt)("a",{parentName:"p",href:"https://www.audero.it/blog/2016/12/05/monkey-patching-javascript/"},"Monkey patching"),"\uff0c\u8fd9\u79cd\u65b9\u5f0f\u901a\u5e38\u7528\u4e8e polyfill \u6d4f\u89c8\u5668\u5df2\u6709\u7684\u65b9\u6cd5\u3002"),(0,o.kt)("h2",{id:"\u7528aop\u6539\u5584javascript\u4ee3\u7801"},"\u7528AOP\u6539\u5584javascript\u4ee3\u7801"),(0,o.kt)("p",null,"\u5b9e\u73b0AOP\u53ef\u4ee5\u7528\u4e0a\u6587\u4e2d\u7684\u66ff\u6362\u65b9\u5f0f\uff0c\u4f46\u662f\u8fd9\u6837\u4f1a\u51fa\u73b0\u4e00\u4e9b\u95ee\u9898\uff1a"),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"\u591a\u4e86\u4e00\u4e2a\u8ba8\u538c\u7684\u4e2d\u95f4\u53d8\u91cf\u6bd4\u5982",(0,o.kt)("inlineCode",{parentName:"p"},"origDoSomething"),", \u6765\u7ba1\u7406\u5b83\u4e5f\u8981\u82b1\u8d39\u4e00\u4e9b\u989d\u5916\u7684\u6210\u672c.")),(0,o.kt)("p",null,"\u8be5\u6587\u7ed9\u51fa\u4e86\u4e24\u4e2a\u5178\u578b\u7684\u5207\u9762\u51fd\u6570\uff0c\u5229\u7528\u8fd9\u4e9b\u5207\u9762\u51fd\u6570\u7ed3\u5408\u5404\u79cd\u8bbe\u8ba1\u6a21\u5f0f\u53ef\u4ee5\u5b9e\u73b0\u65e0\u4fb5\u5165\u5f0f\u7f16\u7a0b\u3002"),(0,o.kt)("h4",{id:"\u5207\u9762\u51fd\u6570before"},"\u5207\u9762\u51fd\u6570before"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"Function.prototype.before = function( func ){\n    var __self = this;\n    return function(){\n        if( func.apply( this, arguments ) === false ){\n            return false;\n        }\n        return __self.apply( this, arguments );\n    }\n}\n")),(0,o.kt)("p",null,"\u8fd9\u6837\u7684\u51fd\u6570\u8c03\u7528\u7684\u65b9\u6cd5\u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"var a = function(){\n    console.log('1')\n}\n\na.before( function(){\n    return false\n} )()\n")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"\u539f\u7406\u5206\u6790"),"\uff1a\u5c06\u9700\u8981\u589e\u52a0\u529f\u80fd\u7684\u51fd\u6570\u79f0\u4e3a\u539f\u51fd\u6570\uff0c\u539f\u51fd\u6570\u8fd9\u4e2a\u5bf9\u8c61\u8c03\u7528\u539f\u578b\u94fe\u4e0a\u7684",(0,o.kt)("inlineCode",{parentName:"p"},"before"),"\u65b9\u6cd5\uff0c\u8be5\u65b9\u6cd5\u63a5\u6536\u4e00\u4e2a\u51fd\u6570\u4f5c\u4e3a\u53c2\u6570",(0,o.kt)("inlineCode",{parentName:"p"},"func"),"\uff0c\u8fd9\u4e2a\u51fd\u6570\u4f1a\u5728\u539f\u51fd\u6570\u4e4b\u524d\u8c03\u7528\u3002",(0,o.kt)("inlineCode",{parentName:"p"},"before"),"\u65b9\u6cd5\u7684\u539f\u7406\u662f\uff1a\u5c06\u6307\u5411\u539f\u51fd\u6570\u5bf9\u8c61\u7684",(0,o.kt)("inlineCode",{parentName:"p"},"this"),"\u4fdd\u5b58\u5230\u5185\u90e8\u53d8\u91cf",(0,o.kt)("inlineCode",{parentName:"p"},"__self"),"\u4e2d\uff0c\u7136\u540e\u8fd4\u56de\u4e00\u4e2a\u95ed\u5305\u51fd\u6570\uff0c\u8fd9\u4e2a\u51fd\u6570\u4f1a\u5148\u8c03\u7528",(0,o.kt)("inlineCode",{parentName:"p"},"func"),",\u5982\u679c",(0,o.kt)("inlineCode",{parentName:"p"},"func"),"\u8fd4\u56de\u7684\u7ed3\u679c\u4e0d\u6ee1\u8db3\u67d0\u4e9b\u6761\u4ef6\u5c31\u4e0d\u518d\u6267\u884c\u539f\u51fd\u6570,\u5982\u679c\u6ee1\u8db3\u5219\u5728\u95ed\u5305\u6240\u5728\u4e0a\u4e0b\u6587\u4e2d\u6267\u884c\u539f\u51fd\u6570\u4e5f\u5c31\u662f",(0,o.kt)("inlineCode",{parentName:"p"},"__self"),"\u6307\u5411\u7684\u51fd\u6570\u3002"),(0,o.kt)("h4",{id:"\u5207\u9762\u51fd\u6570after"},"\u5207\u9762\u51fd\u6570after"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"Function.prototype.after = function( func ){\n    var __self = this;\n    return function(){\n        var ret = __self.apply( this, arguments );\n        if( ret === false ){\n            return false;\n        }\n        func.apply( this, arguments )\n        return ret;\n    }\n}\n")),(0,o.kt)("p",null,"\u8fd9\u91cc\u548cbefore\u539f\u7406\u4e00\u6837\uff0c\u53ea\u662f\u4f1a\u5bf9\u539f\u51fd\u6570\u7684\u6267\u884c\u7ed3\u679c\u8fdb\u884c\u62e6\u622a\uff0c\u901a\u8fc7\u67d0\u4e9b\u5224\u65ad\u903b\u8f91\u6765\u51b3\u5b9a\u662f\u5426\u6267\u884cafter\u6ce8\u5165\u7684\u51fd\u6570\u4ee5\u53ca\u8fd4\u56de\u539f\u51fd\u6570\u7ed3\u679c\u3002"),(0,o.kt)("h3",{id:"\u5c0f\u7ed3"},"\u5c0f\u7ed3"),(0,o.kt)("p",null,"\u4e0a\u9762\u63d0\u5230\u4e86\u4e24\u79cd\u5b9e\u73b0 AOP \u7684\u65b9\u5f0f\uff0c\u6211\u4eec\u7a0d\u5fae\u603b\u7ed3\u4e00\u4e0b\u9002\u7528\u573a\u666f\uff1a"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u7b2c\u4e00\u79cd\u65b9\u6cd5\u9002\u7528\u4e8e\u4f60\u786e\u5b9e\u60f3\u4fee\u6539\u7b2c\u4e09\u65b9\u5e93\u67d0\u4e2a\u51fd\u6570\u7684\u884c\u4e3a\uff0c\u65e0\u8bba\u662f\u4f60\u4e3b\u52a8\u8c03\u7528\u8be5\u65b9\u6cd5\u8fd8\u662f\u5e93\u672c\u8eab\u6216\u8005\u5176\u4ed6\u7684\u4f9d\u8d56\u4e5f\u8c03\u7528\u4e86\u8be5\u65b9\u6cd5\uff0c\u4f60\u6dfb\u52a0\u7684\u989d\u5916\u64cd\u4f5c\u90fd\u751f\u6548\u3002\u6bd4\u5982 san-devtools \u4e2d\u5b9e\u73b0\u65f6\u95f4\u65c5\u884c\u7684\u65b9\u5f0f\u3002"),(0,o.kt)("li",{parentName:"ol"},"\u7b2c\u4e8c\u79cd\u65b9\u6cd5\u53ea\u4f1a\u5728\u4f60\u4e3b\u52a8\u8c03\u7528 \u7c7b\u4f3c before \u7684 AOP \u51fd\u6570\u7684\u65f6\u5019\u4f1a\u751f\u6548\u3002")))}f.isMDXComponent=!0}}]);