"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[1945],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return m}});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},l=Object.keys(e);for(r=0;r<l.length;r++)t=l[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)t=l[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=r.createContext({}),s=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},p=function(e){var n=s(e.components);return r.createElement(c.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,l=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),d=s(t),m=o,f=d["".concat(c,".").concat(m)]||d[m]||u[m]||l;return t?r.createElement(f,a(a({ref:n},p),{},{components:t})):r.createElement(f,a({ref:n},p))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var l=t.length,a=new Array(l);a[0]=d;var i={};for(var c in n)hasOwnProperty.call(n,c)&&(i[c]=n[c]);i.originalType=e,i.mdxType="string"==typeof e?e:o,a[1]=i;for(var s=2;s<l;s++)a[s]=t[s];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},4100:function(e,n,t){t.r(n),t.d(n,{assets:function(){return p},contentTitle:function(){return c},default:function(){return m},frontMatter:function(){return i},metadata:function(){return s},toc:function(){return u}});var r=t(3117),o=t(102),l=(t(7294),t(3905)),a=["components"],i={slug:"blog-post",title:"koa code analyse",authors:"lhuanyu",tags:["node koa"]},c=void 0,s={permalink:"/ReactNote/blog/blog-post",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/blog/2021-09-30-blog-post.md",source:"@site/blog/2021-09-30-blog-post.md",title:"koa code analyse",description:"Koa2\u5b98\u7f51 \u2014\u2014> github\u5730\u5740",date:"2021-09-30T00:00:00.000Z",formattedDate:"September 30, 2021",tags:[{label:"node koa",permalink:"/ReactNote/blog/tags/node-koa"}],readingTime:12.67,truncated:!1,authors:[{name:"liaohuanyu",title:"Maintainer of ReactNote",url:"https://github.com/BUPTlhuanyu",imageURL:"https://github.com/BUPTlhuanyu.png",key:"lhuanyu"}],frontMatter:{slug:"blog-post",title:"koa code analyse",authors:"lhuanyu",tags:["node koa"]},nextItem:{title:"AOP design-pattern in javascript",permalink:"/ReactNote/blog/blog-post"}},p={authorsImageUrls:[void 0]},u=[{value:"koa\u7c7b\u7684\u7ed3\u6784",id:"koa\u7c7b\u7684\u7ed3\u6784",level:2},{value:"\u7b80\u5355\u793a\u4f8b\u51fa\u53d1",id:"\u7b80\u5355\u793a\u4f8b\u51fa\u53d1",level:2},{value:"\u51c6\u5907\u9636\u6bb5",id:"\u51c6\u5907\u9636\u6bb5",level:3},{value:"1. \u521b\u5efakoa\u5b9e\u4f8b\uff0c\u8c03\u7528constructor\uff0c\u5b9a\u4e49\u5b9e\u4f8b\u5c5e\u6027middleware\u7b49\u7b49",id:"1-\u521b\u5efakoa\u5b9e\u4f8b\u8c03\u7528constructor\u5b9a\u4e49\u5b9e\u4f8b\u5c5e\u6027middleware\u7b49\u7b49",level:4},{value:"2. koa\u5b9e\u4f8b\u7684koa\u7c7b\u7684\u539f\u578b\u5bf9\u8c61\u65b9\u6cd5use\u6dfb\u52a0\u4e2d\u95f4\u4ef6\uff0cuse\u65b9\u6cd5\u53ea\u662f\u7b80\u5355\u7684\u5c06\u4e2d\u95f4\u4ef6\u6dfb\u52a0\u5230\u5b9e\u4f8b\u7684\u5c5e\u6027middleware\u6570\u7ec4\u4e2d\uff0c\u7136\u540e\u8fd4\u56de\u5b9e\u4f8b\u81ea\u8eab\u7684this\u3002",id:"2-koa\u5b9e\u4f8b\u7684koa\u7c7b\u7684\u539f\u578b\u5bf9\u8c61\u65b9\u6cd5use\u6dfb\u52a0\u4e2d\u95f4\u4ef6use\u65b9\u6cd5\u53ea\u662f\u7b80\u5355\u7684\u5c06\u4e2d\u95f4\u4ef6\u6dfb\u52a0\u5230\u5b9e\u4f8b\u7684\u5c5e\u6027middleware\u6570\u7ec4\u4e2d\u7136\u540e\u8fd4\u56de\u5b9e\u4f8b\u81ea\u8eab\u7684this",level:4},{value:"3. \u76d1\u542c\u7aef\u53e33000\uff0c\u8c03\u7528\u539f\u578b\u5bf9\u8c61\u65b9\u6cd5listen\uff0c\u8be5\u65b9\u6cd5\u5185\u90e8\u4f1a\u8c03\u7528node\u7684http\u6a21\u5757\uff0c\u8c03\u7528\u5b9e\u4f8b\u65b9\u6cd5this.callback\uff0c\u7136\u540e\u5c06\u8fd4\u56de\u7ed3\u679c\u4f5c\u4e3ahttp.createServer\u7684\u4f20\u5165\u53c2\u6570\u5373\u4f5c\u4e3a\u7aef\u53e3\u89e6\u53d1\u7684request\u4e8b\u4ef6\u7684\u56de\u8c03\u51fd\u6570\u3002http.createServer\u8fd0\u884c\u540e\u8fd4\u56de\u4e00\u4e2ahttp\u670d\u52a1\u5668\uff0c\u7136\u540e\u5c06\u8be5http\u670d\u52a1\u5668\u76d1\u542c\u7aef\u53e33000\u3002\u57283000\u7aef\u53e3\u6709\u8bf7\u6c42\u7684\u65f6\u5019\uff0c\u89e6\u53d1node\u673a\u5236\u7684request\u4e8b\u4ef6\uff0c\u5e76\u8c03\u7528this.callback()\u8fd4\u56de\u7684\u51fd\u6570\u3002this.callback\u51fd\u6570\u4f1a\u5c06\u4e2d\u95f4\u4ef6\u51fd\u6570\u7ec4\u7ec7\u6210\u6d0b\u8471\u6a21\u578b\uff0c\u5e76\u8fd4\u56de\u4e00\u4e2a\u6267\u884c\u5165\u53e3\u51fd\u6570\uff0c\u7528\u4e8e\u6309\u7167\u7279\u5b9a\u987a\u5e8f\u6267\u884c\u4e2d\u95f4\u4ef6\u3002",id:"3-\u76d1\u542c\u7aef\u53e33000\u8c03\u7528\u539f\u578b\u5bf9\u8c61\u65b9\u6cd5listen\u8be5\u65b9\u6cd5\u5185\u90e8\u4f1a\u8c03\u7528node\u7684http\u6a21\u5757\u8c03\u7528\u5b9e\u4f8b\u65b9\u6cd5thiscallback\u7136\u540e\u5c06\u8fd4\u56de\u7ed3\u679c\u4f5c\u4e3ahttpcreateserver\u7684\u4f20\u5165\u53c2\u6570\u5373\u4f5c\u4e3a\u7aef\u53e3\u89e6\u53d1\u7684request\u4e8b\u4ef6\u7684\u56de\u8c03\u51fd\u6570httpcreateserver\u8fd0\u884c\u540e\u8fd4\u56de\u4e00\u4e2ahttp\u670d\u52a1\u5668\u7136\u540e\u5c06\u8be5http\u670d\u52a1\u5668\u76d1\u542c\u7aef\u53e33000\u57283000\u7aef\u53e3\u6709\u8bf7\u6c42\u7684\u65f6\u5019\u89e6\u53d1node\u673a\u5236\u7684request\u4e8b\u4ef6\u5e76\u8c03\u7528thiscallback\u8fd4\u56de\u7684\u51fd\u6570thiscallback\u51fd\u6570\u4f1a\u5c06\u4e2d\u95f4\u4ef6\u51fd\u6570\u7ec4\u7ec7\u6210\u6d0b\u8471\u6a21\u578b\u5e76\u8fd4\u56de\u4e00\u4e2a\u6267\u884c\u5165\u53e3\u51fd\u6570\u7528\u4e8e\u6309\u7167\u7279\u5b9a\u987a\u5e8f\u6267\u884c\u4e2d\u95f4\u4ef6",level:4},{value:"compose\u5982\u4f55\u7ec4\u7ec7\u4e2d\u95f4\u4ef6\u6570\u7ec4middleware",id:"compose\u5982\u4f55\u7ec4\u7ec7\u4e2d\u95f4\u4ef6\u6570\u7ec4middleware",level:3},{value:"\u4e2d\u95f4\u4ef6\u51fd\u6570\u90fd\u662f\u4e00\u6b65\u5230\u5e95\u5168\u90e8\u6267\u884c\u5b8c\u540e\u518d\u6267\u884c\u4e0b\u4e00\u4e2a\u4e2d\u95f4\u4ef6\uff1a",id:"\u4e2d\u95f4\u4ef6\u51fd\u6570\u90fd\u662f\u4e00\u6b65\u5230\u5e95\u5168\u90e8\u6267\u884c\u5b8c\u540e\u518d\u6267\u884c\u4e0b\u4e00\u4e2a\u4e2d\u95f4\u4ef6",level:4},{value:"\u4e2d\u95f4\u4ef6\u51fd\u6570\u9996\u5148\u6267\u884c\u4e00\u90e8\u5206\u7136\u540e\u6267\u884c\u5176\u4ed6\u4e2d\u95f4\u4ef6\uff0c\u7136\u540e\u518d\u56de\u6765\u6267\u884c\u6267\u884c\u5269\u4e0b\u7684\u90e8\u5206",id:"\u4e2d\u95f4\u4ef6\u51fd\u6570\u9996\u5148\u6267\u884c\u4e00\u90e8\u5206\u7136\u540e\u6267\u884c\u5176\u4ed6\u4e2d\u95f4\u4ef6\u7136\u540e\u518d\u56de\u6765\u6267\u884c\u6267\u884c\u5269\u4e0b\u7684\u90e8\u5206",level:4},{value:"\u4e2d\u95f4\u4ef6\u51fd\u6570\u662f\u5f02\u6b65\u7684\u60c5\u51b5",id:"\u4e2d\u95f4\u4ef6\u51fd\u6570\u662f\u5f02\u6b65\u7684\u60c5\u51b5",level:4},{value:"\u9650\u5236\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u53ea\u80fd\u6267\u884c\u4e00\u6b21",id:"\u9650\u5236\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u53ea\u80fd\u6267\u884c\u4e00\u6b21",level:4},{value:"\u5141\u8bb8\u4e2d\u95f4\u4ef6\u622a\u83b7\u4fe1\u606f\u4ee5\u53ca\u5904\u7406\u9519\u8bef",id:"\u5141\u8bb8\u4e2d\u95f4\u4ef6\u622a\u83b7\u4fe1\u606f\u4ee5\u53ca\u5904\u7406\u9519\u8bef",level:4},{value:"\u5904\u7406reques\u4e8b\u4ef6",id:"\u5904\u7406reques\u4e8b\u4ef6",level:3},{value:"\u603b\u7ed3",id:"\u603b\u7ed3",level:3},{value:"\u5de5\u4f5c\u539f\u7406",id:"\u5de5\u4f5c\u539f\u7406",level:4},{value:"\u6280\u5de7",id:"\u6280\u5de7",level:4}],d={toc:u};function m(e){var n=e.components,t=(0,o.Z)(e,a);return(0,l.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},(0,l.kt)("a",{parentName:"p",href:"https://koa.bootcss.com/"},"Koa2\u5b98\u7f51")," \u2014\u2014> ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/koajs/koa"},"github\u5730\u5740"))),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},(0,l.kt)("a",{parentName:"p",href:"https://chenshenhai.github.io/koa2-note/"},"Koa2\u8fdb\u9636\u5b66\u4e60\u7b14\u8bb0")," \u2014\u2014> ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/chenshenhai/koa2-note"},"github\u5730\u5740"))),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},(0,l.kt)("a",{parentName:"p",href:"https://chenshenhai.github.io/koajs-design-note/"},"Koa.js \u8bbe\u8ba1\u6a21\u5f0f-\u5b66\u4e60\u7b14\u8bb0")," \u2014\u2014> ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/chenshenhai/koajs-design-note"},"github\u5730\u5740"))),(0,l.kt)("h2",{id:"koa\u7c7b\u7684\u7ed3\u6784"},"koa\u7c7b\u7684\u7ed3\u6784"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"module.exports = class Application extends Emitter\uff5b\n    constructor() {\n    super();\n    this.proxy = false;\n    this.middleware = [];\n    this.subdomainOffset = 2;\n    this.context = Object.create(context);\n    this.request = Object.create(request);\n    this.response = Object.create(response);\n  }\n  listen(...args) {...}\n  toJSON() {...}\n  inspect() {...}\n  use(fn) {...}\n  callback() {...}\n  handleRequest(ctx, fnMiddleware) {...}\n  createContext(req, res) {...}\n  onerror(err) {...}\n\uff5d\n")),(0,l.kt)("h2",{id:"\u7b80\u5355\u793a\u4f8b\u51fa\u53d1"},"\u7b80\u5355\u793a\u4f8b\u51fa\u53d1"),(0,l.kt)("p",null,"\u5982\u4e0b\u4e3a\u5b98\u65b9\u7ed9\u51fa\u7684\u7ea7\u8054\u5f62\u5f0f\u7684",(0,l.kt)("inlineCode",{parentName:"p"},"koa"),"\u793a\u4f8b\uff0c"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"const Koa = require('koa');\nconst app = new Koa();\n\n// logger\n\napp.use(async (ctx, next) => {\n  await next();\n  const rt = ctx.response.get('X-Response-Time');\n  console.log(`${ctx.method} ${ctx.url} - ${rt}`);\n});\n\n// x-response-time\n\napp.use(async (ctx, next) => {\n  const start = Date.now();\n  await next();\n  const ms = Date.now() - start;\n  ctx.set('X-Response-Time', `${ms}ms`);\n});\n\n// response\n\napp.use(async ctx => {\n  ctx.body = 'Hello World';\n});\n\napp.listen(3000);\n")),(0,l.kt)("p",null,"\u4e0a\u8ff0\u793a\u4f8b\u7684\u5de5\u4f5c\u8fc7\u7a0b\u53ef\u4ee5\u5206\u4e3a\u51c6\u5907\u9636\u6bb5\u4e0e\u5904\u7406reques\u4e8b\u4ef6\u8fd9\u4e24\u4e2a\u9636\u6bb5\u3002"),(0,l.kt)("h3",{id:"\u51c6\u5907\u9636\u6bb5"},"\u51c6\u5907\u9636\u6bb5"),(0,l.kt)("p",null,"\u51c6\u5907\u9636\u6bb5\u4f1a\u521b\u5efakoa\u5b9e\u4f8b\uff0c\u6ce8\u518c\u4e2d\u95f4\u4ef6\uff0c\u76d1\u542c\u6307\u5b9a\u7aef\u53e3\uff0c\u4e2d\u95f4\u4ef6\u7684\u5904\u7406\u65b9\u5f0f\u4e3a\u6d0b\u8471\u6a21\u578b\u8bbe\u8ba1\u6a21\u5f0f\uff1a"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u521b\u5efa\u4e00\u4e2a",(0,l.kt)("inlineCode",{parentName:"li"},"koa"),"\u5b9e\u4f8b\u4e3a",(0,l.kt)("inlineCode",{parentName:"li"},"app"),";"),(0,l.kt)("li",{parentName:"ol"},"\u6ce8\u518c",(0,l.kt)("inlineCode",{parentName:"li"},"logger"),"\u4e2d\u95f4\u4ef6\uff0c\u4e5f\u5c31\u662f\u5c06\u4e2d\u95f4\u4ef6\u51fd\u6570\u6dfb\u52a0\u5230\u4e00\u4e2a\u540d\u4e3a",(0,l.kt)("inlineCode",{parentName:"li"},"middleware"),"\u7684\u6570\u7ec4\u4e2d\u3002"),(0,l.kt)("li",{parentName:"ol"},"\u6ce8\u518c",(0,l.kt)("inlineCode",{parentName:"li"},"x-response-time"),"\u4e2d\u95f4\u4ef6\u3002"),(0,l.kt)("li",{parentName:"ol"},"\u6ce8\u518c",(0,l.kt)("inlineCode",{parentName:"li"},"response"),"\u4e2d\u95f4\u4ef6\u3002"),(0,l.kt)("li",{parentName:"ol"},"\u76d1\u542c3000\u7aef\u53e3\u3002")),(0,l.kt)("h4",{id:"1-\u521b\u5efakoa\u5b9e\u4f8b\u8c03\u7528constructor\u5b9a\u4e49\u5b9e\u4f8b\u5c5e\u6027middleware\u7b49\u7b49"},"1. \u521b\u5efakoa\u5b9e\u4f8b\uff0c\u8c03\u7528constructor\uff0c\u5b9a\u4e49\u5b9e\u4f8b\u5c5e\u6027middleware\u7b49\u7b49"),(0,l.kt)("h4",{id:"2-koa\u5b9e\u4f8b\u7684koa\u7c7b\u7684\u539f\u578b\u5bf9\u8c61\u65b9\u6cd5use\u6dfb\u52a0\u4e2d\u95f4\u4ef6use\u65b9\u6cd5\u53ea\u662f\u7b80\u5355\u7684\u5c06\u4e2d\u95f4\u4ef6\u6dfb\u52a0\u5230\u5b9e\u4f8b\u7684\u5c5e\u6027middleware\u6570\u7ec4\u4e2d\u7136\u540e\u8fd4\u56de\u5b9e\u4f8b\u81ea\u8eab\u7684this"},"2. koa\u5b9e\u4f8b\u7684koa\u7c7b\u7684\u539f\u578b\u5bf9\u8c61\u65b9\u6cd5use\u6dfb\u52a0\u4e2d\u95f4\u4ef6\uff0cuse\u65b9\u6cd5\u53ea\u662f\u7b80\u5355\u7684\u5c06\u4e2d\u95f4\u4ef6\u6dfb\u52a0\u5230\u5b9e\u4f8b\u7684\u5c5e\u6027middleware\u6570\u7ec4\u4e2d\uff0c\u7136\u540e\u8fd4\u56de\u5b9e\u4f8b\u81ea\u8eab\u7684this\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"  use(fn) {\n    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');\n    debug('use %s', fn._name || fn.name || '-');\n    this.middleware.push(fn);\n    return this;\n  }\n")),(0,l.kt)("h4",{id:"3-\u76d1\u542c\u7aef\u53e33000\u8c03\u7528\u539f\u578b\u5bf9\u8c61\u65b9\u6cd5listen\u8be5\u65b9\u6cd5\u5185\u90e8\u4f1a\u8c03\u7528node\u7684http\u6a21\u5757\u8c03\u7528\u5b9e\u4f8b\u65b9\u6cd5thiscallback\u7136\u540e\u5c06\u8fd4\u56de\u7ed3\u679c\u4f5c\u4e3ahttpcreateserver\u7684\u4f20\u5165\u53c2\u6570\u5373\u4f5c\u4e3a\u7aef\u53e3\u89e6\u53d1\u7684request\u4e8b\u4ef6\u7684\u56de\u8c03\u51fd\u6570httpcreateserver\u8fd0\u884c\u540e\u8fd4\u56de\u4e00\u4e2ahttp\u670d\u52a1\u5668\u7136\u540e\u5c06\u8be5http\u670d\u52a1\u5668\u76d1\u542c\u7aef\u53e33000\u57283000\u7aef\u53e3\u6709\u8bf7\u6c42\u7684\u65f6\u5019\u89e6\u53d1node\u673a\u5236\u7684request\u4e8b\u4ef6\u5e76\u8c03\u7528thiscallback\u8fd4\u56de\u7684\u51fd\u6570thiscallback\u51fd\u6570\u4f1a\u5c06\u4e2d\u95f4\u4ef6\u51fd\u6570\u7ec4\u7ec7\u6210\u6d0b\u8471\u6a21\u578b\u5e76\u8fd4\u56de\u4e00\u4e2a\u6267\u884c\u5165\u53e3\u51fd\u6570\u7528\u4e8e\u6309\u7167\u7279\u5b9a\u987a\u5e8f\u6267\u884c\u4e2d\u95f4\u4ef6"},"3. \u76d1\u542c\u7aef\u53e33000\uff0c\u8c03\u7528\u539f\u578b\u5bf9\u8c61\u65b9\u6cd5listen\uff0c\u8be5\u65b9\u6cd5\u5185\u90e8\u4f1a\u8c03\u7528node\u7684http\u6a21\u5757\uff0c\u8c03\u7528\u5b9e\u4f8b\u65b9\u6cd5this.callback\uff0c\u7136\u540e\u5c06\u8fd4\u56de\u7ed3\u679c\u4f5c\u4e3ahttp.createServer\u7684\u4f20\u5165\u53c2\u6570\u5373\u4f5c\u4e3a\u7aef\u53e3\u89e6\u53d1\u7684request\u4e8b\u4ef6\u7684\u56de\u8c03\u51fd\u6570\u3002http.createServer\u8fd0\u884c\u540e\u8fd4\u56de\u4e00\u4e2ahttp\u670d\u52a1\u5668\uff0c\u7136\u540e\u5c06\u8be5http\u670d\u52a1\u5668\u76d1\u542c\u7aef\u53e33000\u3002\u57283000\u7aef\u53e3\u6709\u8bf7\u6c42\u7684\u65f6\u5019\uff0c\u89e6\u53d1node\u673a\u5236\u7684request\u4e8b\u4ef6\uff0c\u5e76\u8c03\u7528this.callback()\u8fd4\u56de\u7684\u51fd\u6570\u3002this.callback\u51fd\u6570\u4f1a\u5c06\u4e2d\u95f4\u4ef6\u51fd\u6570\u7ec4\u7ec7\u6210\u6d0b\u8471\u6a21\u578b\uff0c\u5e76\u8fd4\u56de\u4e00\u4e2a\u6267\u884c\u5165\u53e3\u51fd\u6570\uff0c\u7528\u4e8e\u6309\u7167\u7279\u5b9a\u987a\u5e8f\u6267\u884c\u4e2d\u95f4\u4ef6\u3002"),(0,l.kt)("p",null,"\u5728\u6267\u884cthis.callback()\u51fd\u6570\u7684\u8fc7\u7a0b\u4e2d\uff0c\u9996\u5148\u4f1a\u8c03\u7528compose\u51fd\u6570\u5904\u7406\u4e2d\u95f4\u4ef6\uff0c\u7136\u540e\u8fd4\u56dehandleRequest\u51fd\u6570\uff0c\u8be5\u51fd\u6570\u662frequest\u4e8b\u4ef6\u7684\u56de\u8c03\u51fd\u6570\uff0c\u7528\u4e8e\u6267\u884c\u4e2d\u95f4\u4ef6\u5bf9req\u4e0eres\u8fdb\u884c\u5904\u7406\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"  listen(...args) {\n    debug('listen');\n    const server = http.createServer(this.callback());\n    return server.listen(...args);\n  }\n  callback() {\n    //compose\u51fd\u6570\u5c06\u4e2d\u95f4\u4ef6\u6570\u7ec4\u8f6c\u6362\u6210\u6267\u884c\u94fe\u51fd\u6570fn\n    const fn = compose(this.middleware);\n\n    if (!this.listenerCount('error')) this.on('error', this.onerror);\n\n    const handleRequest = (req, res) => {\n      const ctx = this.createContext(req, res);\n      return this.handleRequest(ctx, fn);\n    };\n\n    return handleRequest;\n  }\n  handleRequest(ctx, fnMiddleware) {\n    const res = ctx.res;\n    res.statusCode = 404;\n    const onerror = err => ctx.onerror(err);\n    const handleResponse = () => respond(ctx);\n    onFinished(res, onerror);\n    return fnMiddleware(ctx).then(handleResponse).catch(onerror);\n  }\n")),(0,l.kt)("h3",{id:"compose\u5982\u4f55\u7ec4\u7ec7\u4e2d\u95f4\u4ef6\u6570\u7ec4middleware"},"compose\u5982\u4f55\u7ec4\u7ec7\u4e2d\u95f4\u4ef6\u6570\u7ec4middleware"),(0,l.kt)("p",null,"\u5982\u4f55\u5b9e\u73b0\u4e00\u4e2acompose\uff0c\u8be5\u51fd\u6570\u7684\u529f\u80fd\u662f\u6309\u987a\u5e8f\u6267\u884cmiddleware\u4e2d\u7684\u4e2d\u95f4\u4ef6\uff1a"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u5047\u8bbe\u4e2d\u95f4\u4ef6\u51fd\u6570\u90fd\u662f\u4e00\u6b65\u5230\u5e95\u5168\u90e8\u6267\u884c\u5b8c\u540e\u518d\u6267\u884c\u4e0b\u4e00\u4e2a\u4e2d\u95f4\u4ef6"),(0,l.kt)("li",{parentName:"ol"},"\u4e2d\u95f4\u4ef6\u51fd\u6570\u9996\u5148\u6267\u884c\u4e00\u90e8\u5206\u7136\u540e\u6267\u884c\u5176\u4ed6\u4e2d\u95f4\u4ef6\uff0c\u7136\u540e\u518d\u56de\u6765\u6267\u884c\u6267\u884c\u5269\u4e0b\u7684\u90e8\u5206\u3002"),(0,l.kt)("li",{parentName:"ol"},"\u4e2d\u95f4\u4ef6\u51fd\u6570\u662f\u5f02\u6b65\u7684\u60c5\u51b5"),(0,l.kt)("li",{parentName:"ol"},"\u9650\u5236\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u53ea\u80fd\u6267\u884c\u4e00\u6b21"),(0,l.kt)("li",{parentName:"ol"},"\u5141\u8bb8\u4e2d\u95f4\u4ef6\u622a\u83b7\u4fe1\u606f\u4ee5\u53ca\u5904\u7406\u9519\u8bef")),(0,l.kt)("h4",{id:"\u4e2d\u95f4\u4ef6\u51fd\u6570\u90fd\u662f\u4e00\u6b65\u5230\u5e95\u5168\u90e8\u6267\u884c\u5b8c\u540e\u518d\u6267\u884c\u4e0b\u4e00\u4e2a\u4e2d\u95f4\u4ef6"},"\u4e2d\u95f4\u4ef6\u51fd\u6570\u90fd\u662f\u4e00\u6b65\u5230\u5e95\u5168\u90e8\u6267\u884c\u5b8c\u540e\u518d\u6267\u884c\u4e0b\u4e00\u4e2a\u4e2d\u95f4\u4ef6\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"function myCompose(ctx = [],middleware){\n    return dispatch(0)\n    function dispatch(i){\n        let fn = middleware[i];\n        if(!fn) return;\n        return fn(ctx, dispatch.bind(null,i+1));\n    }\n}\n\nlet fn0 = function(ctx,next){\n    console.log(0);\n    ctx.push(0)\n    next()\n}\n\nlet fn1 = function(ctx,next){\n    console.log(1);\n    ctx.push(1)\n    next();\n}\n\nlet fn2 = function(ctx,next){\n    console.log(2);\n    ctx.push(2)\n    next();\n}\n\nlet middleware = [fn0,fn1,fn2]\nlet ctx = []\nmyCompose(ctx,middleware);\nconsole.log(ctx);\n")),(0,l.kt)("h4",{id:"\u4e2d\u95f4\u4ef6\u51fd\u6570\u9996\u5148\u6267\u884c\u4e00\u90e8\u5206\u7136\u540e\u6267\u884c\u5176\u4ed6\u4e2d\u95f4\u4ef6\u7136\u540e\u518d\u56de\u6765\u6267\u884c\u6267\u884c\u5269\u4e0b\u7684\u90e8\u5206"},"\u4e2d\u95f4\u4ef6\u51fd\u6570\u9996\u5148\u6267\u884c\u4e00\u90e8\u5206\u7136\u540e\u6267\u884c\u5176\u4ed6\u4e2d\u95f4\u4ef6\uff0c\u7136\u540e\u518d\u56de\u6765\u6267\u884c\u6267\u884c\u5269\u4e0b\u7684\u90e8\u5206"),(0,l.kt)("p",null,"\u4e0a\u9762\u7684\u4ee3\u7801\u80fd\u5426\u5b9e\u73b0\u8fd9\u6837\u7684\u4e00\u4e2a\u529f\u80fd\u5462\uff1f\u6d4b\u8bd5\u5982\u4e0b\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'let fn0 = function(ctx,next){\n    console.log(0);\n    ctx.push(0)\n    next()\n    console.log("fn0");\n}\n\nlet fn1 = function(ctx,next){\n    console.log(1);\n    ctx.push(1)\n    next();\n    console.log("fn1");\n}\n\nlet fn2 = function(ctx,next){\n    console.log(2);\n    ctx.push(2)\n    next();\n    console.log("fn2");\n}\nlet middleware = [fn0,fn1,fn2]\nlet ctx = []\nmyCompose(ctx,middleware);\nconsole.log(ctx);\n')),(0,l.kt)("p",null,"\u8fd4\u56de\u7684\u7ed3\u679c\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"0\n1\n2\nfn2\nfn1\nfn0\n(3) [0, 1, 2]\n")),(0,l.kt)("p",null,"\u663e\u7136\u4e0a\u9762\u7684myCompose\u51fd\u6570\u662f\u53ef\u4ee5\u5b9e\u73b0\u8fd9\u6837\u7684\u529f\u80fd\u7684\u3002"),(0,l.kt)("h4",{id:"\u4e2d\u95f4\u4ef6\u51fd\u6570\u662f\u5f02\u6b65\u7684\u60c5\u51b5"},"\u4e2d\u95f4\u4ef6\u51fd\u6570\u662f\u5f02\u6b65\u7684\u60c5\u51b5"),(0,l.kt)("p",null,"\u6d4b\u8bd5\u5f02\u6b65\u7684\u60c5\u51b5\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'let fn0 = async function(ctx,next){\n    console.log(0);\n    ctx.push(0)\n    await next()\n    console.log("fn0");\n}\n\nlet fn1 = async function(ctx,next){\n    console.log(1);\n    ctx.push(1)\n    await next();\n    console.log("fn1");\n}\n\nlet fn2 = async function(ctx,next){\n    console.log(2);\n    ctx.push(2)\n    await next();\n    console.log("fn2");\n}\nlet middleware = [fn0,fn1,fn2]\nlet ctx = []\nmyCompose(ctx,middleware);\nconsole.log(ctx);\n')),(0,l.kt)("p",null,"\u8fd4\u56de\u7684\u7ed3\u679c\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"0\n1\n2\n(3) [0, 1, 2]\nfn2\nfn1\nfn0\n")),(0,l.kt)("h4",{id:"\u9650\u5236\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u53ea\u80fd\u6267\u884c\u4e00\u6b21"},"\u9650\u5236\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u53ea\u80fd\u6267\u884c\u4e00\u6b21"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'function myCompose(ctx = [],middleware){\n    return dispatch(0)\n    function dispatch(i){\n        let fn = middleware[i];\n        if(!fn) return;\n        return fn(ctx, dispatch.bind(null,i+1));\n    }\n}\nlet fn0 = async function(ctx,next){\n    console.log(0);\n    ctx.push(0)\n    await next()\n    await next()\n    console.log("fn0");\n}\n\nlet fn1 = async function(ctx,next){\n    console.log(1);\n    ctx.push(1)\n    await next();\n    console.log("fn1");\n}\n\nlet fn2 = async function(ctx,next){\n    console.log(2);\n    ctx.push(2)\n    await next();\n    console.log("fn2");\n}\nlet middleware = [fn0,fn1,fn2]\nlet ctx = []\nmyCompose(ctx,middleware);\nconsole.log(ctx);\n')),(0,l.kt)("p",null,"\u8fd4\u56de\u7684\u7ed3\u679c\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"0\n1\n2\n(3) [0, 1, 2]\nfn2\nfn1\n1\n2\nfn2\nfn1\nfn0\n")),(0,l.kt)("p",null,"\u5728fn0\u51fd\u6570\u4e2d\u8c03\u7528\u4e86\u4e24\u6b21next()\uff0c\u8fd9\u6837\u4f1a\u5bfc\u81f4\u91cd\u65b0\u6267\u884c\u4e86fn0\u540e\u9762\u7684\u6240\u6709\u4e2d\u95f4\u4ef6\u51fd\u6570\u3002\u4e3a\u4e86\u907f\u514d\u8fd9\u6837\u60c5\u51b5\u7684\u53d1\u751f\uff0c\u9700\u8981\u9650\u5236\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u53ea\u80fd\u6267\u884c\u4e00\u6b21\u3002myCompose\u51fd\u6570\u662f\u901a\u8fc7\u8c03\u7528dispatch\u51fd\u6570\u6765\u6267\u884c\u4e2d\u95f4\u4ef6\u51fd\u6570\u7684\uff0c\u56e0\u6b64\u53ef\u4ee5\u901a\u8fc7\u963b\u6b62dispatch\u51fd\u6570\u6765\u963b\u6b62\u4e2d\u95f4\u4ef6\u51fd\u6570\u7684\u6267\u884c\u3002\u4ecemyCompose\u51fd\u6570\u53ef\u77e5\uff0c\u5728\u4e2d\u95f4\u4ef6\u51fd\u6570\u4e2d\u6267\u884c\u5230\u7b2c\u4e8c\u6b21next\u7684\u65f6\u5019\uff0c\u5fc5\u5b9a\u5df2\u7ecf\u8c03\u7528\u4e86middleware.length\u6b21dispatch\uff0c\u5373\u6267\u884c\u8fc7\u4e86\u6240\u6709\u4e2d\u95f4\u4ef6\u51fd\u6570next\u4e4b\u524d\u7684\u903b\u8f91\u3002\u6267\u884cnext()\u51fd\u6570\u5176\u5b9e\u5c31\u662f\u6267\u884c",(0,l.kt)("inlineCode",{parentName:"p"},"dispatch.bind(null, i + 1)")," \uff0c\u7531\u6b64\u53ef\u4ee5\u770b\u51fa\uff0c\u6bcf\u4e2a\u4e2d\u95f4\u4ef6\u51fd\u6570\u6267\u884c\u7b2c\u4e8c\u6b21 next \u7684\u51fd\u6570\u7684\u65f6\u5019\uff0c\u4f20\u5165\u7684\u7b2c\u4e00\u4e2a\u53c2\u6570\u5c31\u662f i+1 \uff0ci+1 \u7684\u8303\u56f4\u662f","[0,3]","\u3002\u56e0\u6b64\u53ef\u4ee5\u8bb0\u5f55\u4e00\u4e0b\u5df2\u7ecf\u6267\u884c\u4e86\u591a\u5c11\u6b21dispatch\u5230index\u4e2d\uff0c\u7136\u540e\u6bcf\u6b21dispatch\u7684\u65f6\u5019\u6bd4\u8f83\u7b2c\u4e00\u4e2a\u53c2\u6570 i+1 \u4e0e index \u7684\u503c\uff0c\u6765\u5224\u65ad\u662f\u5426\u5b58\u5728\u540c\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u51fd\u6570\u88ab\u6267\u884c\u4e86\u591a\u6b21\u7684\u60c5\u51b5\u3002\u56e0\u6b64\u4fee\u6539\u540emyCompose\u5982\u4e0b\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"function myCompose(ctx = [],middleware){\n    let index = -1;\n    return dispatch(0)\n    function dispatch(i){\n        if(i <= index) return;\n        index = i;\n        let fn = middleware[i];\n        if(!fn) return;\n        return fn(ctx, dispatch.bind(null,i+1));\n    }\n}\n\n")),(0,l.kt)("p",null,"\u8fd4\u56de\u7684\u7ed3\u679c\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"0\n1\n2\n(3) [0, 1, 2]\nfn2\nfn1\nfn0\n")),(0,l.kt)("h4",{id:"\u5141\u8bb8\u4e2d\u95f4\u4ef6\u622a\u83b7\u4fe1\u606f\u4ee5\u53ca\u5904\u7406\u9519\u8bef"},"\u5141\u8bb8\u4e2d\u95f4\u4ef6\u622a\u83b7\u4fe1\u606f\u4ee5\u53ca\u5904\u7406\u9519\u8bef"),(0,l.kt)("p",null,"\u5bf9\u4e8e\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u800c\u8a00\uff0c\u6bd4\u5982"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'let fn0 = async function(ctx,next){\n    console.log(0);\n    ctx.push(0)\n    await next()\n    console.log("fn0");\n}\n')),(0,l.kt)("p",null,"\u5982\u679c\u4e0b\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u51fa\u73b0\u4e86\u95ee\u9898\uff0c\u6216\u8005fn0\u4e2d\u95f4\u4ef6\u51fd\u6570\u9700\u8981\u4e0b\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u51fd\u6570\u8fd4\u56de\u4e00\u4e9b\u6570\u636e\u8fdb\u884c\u5904\u7406\uff0c\u90a3\u4e48\u5982\u4f55\u5b9e\u73b0\u5462\uff1f\u5229\u7528promise.resolve\u4ee5\u53careject\u6765\u5904\u7406\u6570\u636e\u4ee5\u53ca\u9519\u8bef\u4fe1\u606f\u3002\u4fee\u6539\u540e\u7684\u4ee3\u7801\u4e3a\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"function myCompose(ctx = [],middleware){\n    let index = -1;\n    return dispatch(0)\n    function dispatch(i){\n        if(i <= index) return Promise.reject(new Error('next() called multiple times in a middleware'));\n        index = i;\n        let fn = middleware[i];\n        if(!fn) return Promise.resolve();\n        return Promise.resolve(fn(ctx, dispatch.bind(null,i+1)));\n    }\n}\n")),(0,l.kt)("p",null,"\u5982\u679creturn Promise.resolve(fn(context, dispatch.bind(null, i + 1)));\u51fa\u73b0\u9519\u8bef\uff0c\u5229\u7528try-catch\u8fdb\u884c\u6355\u83b7\u5e76\u4e14\u5c06\u9519\u8bef\u4fe1\u606freject\u5230\u4e0a\u5c42\u4e2d\u95f4\u4ef6\u3002\u4fee\u6539\u540e\u7684\u4ee3\u7801\u4e3a\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"function myCompose(ctx = [],middleware){\n    let index = -1;\n    return dispatch(0)\n    function dispatch(i){\n        if(i <= index) return Promise.reject(new Error('next() called multiple times in a middleware'));\n        index = i;\n        let fn = middleware[i];\n        if(!fn) return Promise.resolve();\n        try {\n            return Promise.resolve(fn(ctx, dispatch.bind(null,i+1)));\n        } catch(err){\n            return Promise.reject(err)\n        }\n    }\n}\n")),(0,l.kt)("p",null,"\u5b98\u65b9\u7ed9\u51fa\u7684compose\u5b9e\u73b0\u5982\u4e0b\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"function compose (middleware) {\n    if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')\n    for (const fn of middleware) {\n        if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')\n    }\n\n    /**\n     * @param {Object} context\n     * @return {Promise}\n     * @api public\n     */\n\n    return function (context, next) {\n        // last called middleware #\n        let index = -1\n        return dispatch(0)\n        function dispatch (i) {\n            if (i <= index) return Promise.reject(new Error('next() called multiple times'))\n            index = i\n            let fn = middleware[i]\n            if (i === middleware.length) fn = next\n            if (!fn) return Promise.resolve()\n            try {\n                return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));\n            } catch (err) {\n                return Promise.reject(err)\n            }\n        }\n    }\n}\n")),(0,l.kt)("p",null,"\u4e0e\u4e4b\u524d\u7684myCompose\u7248\u672c\u6bd4\u8f83\u591a\u4e86\u4e00\u4e2aif (i === middleware.length) fn = next;\u8fd9\u6837\u5904\u7406\u662f\u4e3a\u4e86\u68c0\u6d4b\u5982\u679c\u6267\u884c\u5230middleware\u6700\u540e\u4e00\u4e2a\u4e2d\u95f4\u4ef6\uff0c\u5219\u5c06compose(this.middleware)(ctx,fnLast);\u4e2d\u7684fnLast\u6700\u4e3a\u6700\u540e\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u3002koa\u6e90\u7801\u4e2d\u8fd9\u4e2anext\u4e3aundefined\u3002"),(0,l.kt)("h3",{id:"\u5904\u7406reques\u4e8b\u4ef6"},"\u5904\u7406reques\u4e8b\u4ef6"),(0,l.kt)("p",null,"\u5f53\u76d1\u542c\u52303000\u7aef\u53e3\u6709\u8bf7\u6c42\u8fc7\u6765\u7684\u65f6\u5019\uff0c\u89e6\u53d1request\u4e8b\u4ef6\uff0c\u7136\u540e\u5f00\u59cb\u6267\u884c\u5404\u4e2a\u4e2d\u95f4\u4ef6\uff0c\u5b9e\u9645\u5728\u4e4b\u524d\u5b9e\u73b0myCompose\u51fd\u6570\u7684\u8fc7\u7a0b\u4e2d\u53ef\u4ee5\u770b\u51fa\u4e2d\u95f4\u4ef6\u6267\u884c\u7684\u987a\u5e8f\u3002"),(0,l.kt)("h3",{id:"\u603b\u7ed3"},"\u603b\u7ed3"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"const Koa = require('koa');\nconst app = new Koa();\n\n// logger\n\napp.use(async (ctx, next) => {\n  await next();\n  const rt = ctx.response.get('X-Response-Time');\n  console.log(`${ctx.method} ${ctx.url} - ${rt}`);\n});\n\n// x-response-time\n\napp.use(async (ctx, next) => {\n  const start = Date.now();\n  await next();\n  const ms = Date.now() - start;\n  ctx.set('X-Response-Time', `${ms}ms`);\n});\n\n// response\n\napp.use(async ctx => {\n  ctx.body = 'Hello World';\n});\n\napp.listen(3000);\n")),(0,l.kt)("p",null,"\u8fd9\u91cc\u4e2d\u95f4\u4ef6\u7ea7\u8054\u7684\u65b9\u5f0f\u5bf9ctx\u8fdb\u884c\u9010\u6b65\u5904\u7406\uff0c\u6839\u636ecompose.js\u53ef\u77e5\u4f20\u5165\u4e2d\u95f4\u4ef6\u7684next\u5176\u5b9e\u5c31\u662f\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"dispatch.bind(null, i + 1)\n")),(0,l.kt)("h4",{id:"\u5de5\u4f5c\u539f\u7406"},"\u5de5\u4f5c\u539f\u7406"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u521b\u5efa\u4e00\u4e2akoa\u5bf9\u8c61\uff0c\u7136\u540e\u8c03\u7528use(fn)\u5c06fn push\u5230\u8be5koa\u5bf9\u8c61\u7684\u4e2d\u95f4\u4ef6\u6570\u7ec4\u4e2d"),(0,l.kt)("li",{parentName:"ol"},"\u63a5\u7740\u8c03\u7528listen\u521b\u5efa\u4e00\u4e2a\u670d\u52a1\u5668\u5bb9\u5668\uff0c\u7136\u540e\u8c03\u7528this.callback()\uff0c\u7136\u540e\u76d1\u542c\u6307\u5b9a\u7aef\u53e3"),(0,l.kt)("li",{parentName:"ol"},"this.callback()\u9996\u5148\u4f1a\u8c03\u7528compose\u5bf9\u4e2d\u95f4\u4ef6\u6570\u7ec4\u8fdb\u884c\u5904\u7406\uff0c\u8fd4\u56de\u4e00\u4e2a\u6d0b\u8471\u6a21\u578b\u7684\u5165\u53e3\u51fd\u6570\u3002\u7136\u540e\u8fd4\u56de\u4e00\u4e2ahandleRequest"),(0,l.kt)("li",{parentName:"ol"},"handleRequest\u51fd\u6570\u4f1a\u5728\u76d1\u542c\u5230\u7aef\u53e3\u6709\u8bf7\u6c42\u7684\u65f6\u5019\u8c03\u7528\uff0c\u8be5\u51fd\u6570\u6700\u7ec8\u4f1a\u8c03\u7528\u6d0b\u8471\u6a21\u578b\u7684\u5165\u53e3\u51fd\u6570\u3002"),(0,l.kt)("li",{parentName:"ol"},"handleRequest\u51fd\u6570\u63a5\u6536\u4e24\u4e2a\u53c2\u6570req, res\uff1b\u8be5\u51fd\u6570\u6267\u884c\u7684\u65f6\u5019\u9996\u5148\u4f1a\u6839\u636e\u4f20\u5165\u7684req, res\u521b\u5efa\u4e00\u4e2actx\uff1b\u7136\u540e\u8c03\u7528koa\u5bf9\u8c61\u7684handleRequest\u51fd\u6570\uff0c\u5c06\u7ed3\u679c\u8fd4\u56de\u3002"),(0,l.kt)("li",{parentName:"ol"},"koa\u5bf9\u8c61\u7684handleRequest\u51fd\u6570\u63a5\u6536\u4e24\u4e2a\u53c2\u6570(ctx, fn)\uff0cctx\u5c31\u662f\u6839\u636ereq, res\u521b\u5efa\u7684ctx\uff0cfn\u5c31\u662f\u8c03\u7528compose\u8fd4\u56de\u7684\u6d0b\u8471\u6a21\u578b\u5165\u53e3\u51fd\u6570\u3002 koa\u5bf9\u8c61\u7684handleRequest\u51fd\u6570\u6700\u7ec8\u4f1a\u8c03\u7528fn(ctx)")),(0,l.kt)("p",null,"\u5728\u4e2d\u95f4\u4ef6\u9700\u8981\u7ea7\u8054\u7684\u65f6\u5019\uff0c\u9700\u8981\u7ed9\u4e2d\u95f4\u4ef6\u4f20\u5165\u7b2c\u4e8c\u4e2a\u53c2\u6570next"),(0,l.kt)("h4",{id:"\u6280\u5de7"},"\u6280\u5de7"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'let fn0 = async function(ctx,next){\n    console.log(0);\n    ctx.push(0)\n    await next()\n    await next().catch(err=>console.log(err))\n    console.log("fn0");\n}\n')),(0,l.kt)("p",null,"\u6ce8\u610f\u8fd9\u91cc\uff0c\u4e2d\u95f4\u4ef6\u7cfb\u7edf\u5e26\u6765\u7684\u95ee\u9898\uff0c\u4e2d\u95f4\u4ef6\u53ef\u4ee5\u968f\u610f\u7ed9ctx\u5b9a\u4e49\u5b9e\u4f8b\u65b9\u6cd5\u4ee5\u53ca\u5c5e\u6027\uff0c\u8fd9\u6837\u4f1a\u5bfc\u81f4\u4e2d\u95f4\u4ef6\u4e4b\u95f4\u7684\u8986\u76d6\u7684\u95ee\u9898\uff0c\u5f88\u96be\u68c0\u67e5\u4e0d\u9519\u8bef\u3002\u901a\u8fc7\u5728\u4e2d\u95f4\u4ef6\u5bf9next\u8fdb\u884ccatch\u6765\u8fdb\u884c\u9519\u8bef\u68c0\u67e5\u3002 "),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"await next().catch(err=>console.log(err))\n")),(0,l.kt)("p",null,"\u4f1a\u6253\u5370\u9519\u8bef\uff0c\u4f46\u662f\u7a0b\u5e8f\u4e0d\u4f1acrash\u6389\u3002"))}m.isMDXComponent=!0}}]);