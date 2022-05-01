"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[4911],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return s}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},m=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),d=p(n),s=a,k=d["".concat(c,".").concat(s)]||d[s]||u[s]||i;return n?r.createElement(k,l(l({ref:t},m),{},{components:n})):r.createElement(k,l({ref:t},m))}));function s(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,l=new Array(i);l[0]=d;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var p=2;p<i;p++)l[p]=n[p];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9183:function(e,t,n){n.r(t),n.d(t,{assets:function(){return m},contentTitle:function(){return c},default:function(){return s},frontMatter:function(){return o},metadata:function(){return p},toc:function(){return u}});var r=n(3117),a=n(102),i=(n(7294),n(3905)),l=["components"],o={id:"old-scheduler",sidebar_label:"\u5bf9\u9f50frame\u7248\u672c\u7684scheduler",slug:"/react/react/scheduler/old-scheduler",sidebar_position:3,title:""},c=void 0,p={unversionedId:"react/react/scheduler/old-scheduler",id:"react/react/scheduler/old-scheduler",title:"",description:"\u5e27\u5bf9\u9f50\u65b9\u6848scheduler",source:"@site/docs/react/react/scheduler/\u5bf9\u9f50frame\u7248\u672c\u7684scheduler.mdx",sourceDirName:"react/react/scheduler",slug:"/react/react/scheduler/old-scheduler",permalink:"/ReactNote/docs/react/react/scheduler/old-scheduler",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react/scheduler/\u5bf9\u9f50frame\u7248\u672c\u7684scheduler.mdx",tags:[],version:"current",sidebarPosition:3,frontMatter:{id:"old-scheduler",sidebar_label:"\u5bf9\u9f50frame\u7248\u672c\u7684scheduler",slug:"/react/react/scheduler/old-scheduler",sidebar_position:3,title:""},sidebar:"react",previous:{title:"\u65b0\u7248scheduler",permalink:"/ReactNote/docs/react/react/scheduler/new-scheduler"},next:{title:"react-is",permalink:"/ReactNote/docs/react/react/scheduler/others/react-is"}},m={},u=[{value:"\u5e27\u5bf9\u9f50\u65b9\u6848scheduler",id:"\u5e27\u5bf9\u9f50\u65b9\u6848scheduler",level:2},{value:"\u5fc5\u8981\u7684\u56de\u987e",id:"\u5fc5\u8981\u7684\u56de\u987e",level:4},{value:"\u65b0\u8001scheduler\u7684\u5bf9\u6bd4",id:"\u65b0\u8001scheduler\u7684\u5bf9\u6bd4",level:4},{value:"\u52a8\u6001\u83b7\u53d6\u5c4f\u5e55\u7684\u5e27\u7387",id:"\u52a8\u6001\u83b7\u53d6\u5c4f\u5e55\u7684\u5e27\u7387",level:4},{value:"\u603b\u7ed3",id:"\u603b\u7ed3",level:4}],d={toc:u};function s(e){var t=e.components,o=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,r.Z)({},d,o,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"\u5e27\u5bf9\u9f50\u65b9\u6848scheduler"},"\u5e27\u5bf9\u9f50\u65b9\u6848scheduler"),(0,i.kt)("p",null,"\u8fd9\u4e00\u90e8\u5206\u4e3b\u8981\u8ba8\u8bba\u7684\u662f\u5982\u4f55\u5b9e\u73b0\u5e27\u5bf9\u9f50\uff0c\u800c\u4e0d\u4f1a\u8fc7\u591a\u7684\u53bb\u63a2\u7a76\u65e7\u7248\u65b9\u6848\u7684\u8c03\u5ea6\u6d41\u7a0b\u3002\u5982\u679c\u60f3\u4e86\u89e3\u53ef\u4ee5\u76f4\u63a5\u770b\u6e90\u7801\uff0c\u6216\u8005\u53bb\u5230\u8fd9\u91cc",(0,i.kt)("a",{parentName:"p",href:"https://juejin.cn/post/6844903792110993421"},"scheduler")),(0,i.kt)("h4",{id:"\u5fc5\u8981\u7684\u56de\u987e"},"\u5fc5\u8981\u7684\u56de\u987e"),(0,i.kt)("p",null,"\u65e9\u5728\u4e4b\u524d\u7684\u6587\u7ae0\u4e2d\u4ecb\u7ecd\u4e86",(0,i.kt)("inlineCode",{parentName:"p"},"requestAnimation"),"\u7684\u51e0\u4e2a\u91cd\u8981\u7684\u7279\u6027\uff1a"),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("inlineCode",{parentName:"strong"},"window.requestAnimationFrame()"))," "),(0,i.kt)("ol",{parentName:"blockquote"},(0,i.kt)("li",{parentName:"ol"},"\u8be5\u65b9\u6cd5\u9700\u8981\u4f20\u5165\u4e00\u4e2a\u56de\u8c03\u51fd\u6570\u4f5c\u4e3a\u53c2\u6570\uff0c\u8be5\u56de\u8c03\u51fd\u6570\u4f1a\u5728\u6d4f\u89c8\u5668\u4e0b\u4e00\u6b21\u91cd\u7ed8\u4e4b\u524d\u6267\u884c"),(0,i.kt)("li",{parentName:"ol"},"\u5728\u540c\u4e00\u4e2a\u5e27\u4e2d\u7684\u591a\u4e2a\u56de\u8c03\u51fd\u6570\uff0c\u5b83\u4eec\u6bcf\u4e00\u4e2a\u90fd\u4f1a\u63a5\u53d7\u5230\u4e00\u4e2a\u76f8\u540c\u7684\u65f6\u95f4\u6233\uff0c\u5373\u4f7f\u5728\u8ba1\u7b97\u4e0a\u4e00\u4e2a\u56de\u8c03\u51fd\u6570\u5df2\u7ecf\u6d88\u8017\u4e86\u4e00\u4e9b\u65f6\u95f4\u3002"),(0,i.kt)("li",{parentName:"ol"},"\u5728\u5927\u591a\u6570\u9075\u5faaW3C\u5efa\u8bae\u7684\u6d4f\u89c8\u5668\u4e2d\uff0c\u56de\u8c03\u51fd\u6570\u6267\u884c\u6b21\u6570\u901a\u5e38\u4e0e\u6d4f\u89c8\u5668\u5c4f\u5e55\u5237\u65b0\u6b21\u6570\u76f8\u5339\u914d"))),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"frame",src:n(2008).Z,width:"1890",height:"258"})),(0,i.kt)("p",null,"\u4e0a\u56fe\u4e3a",(0,i.kt)("inlineCode",{parentName:"p"},"chrome performance"),"\u9762\u677f\u4e2d\u83b7\u53d6\u5230\u7684\u5404\u4e2a\u5e27\u7684\u622a\u56fe\uff0c\u7ea2\u6846\u7684\u957f\u5ea6\u8868\u793a\u4e00\u5e27\u95f4\u9694\uff0c\u540c\u4e00\u4e2a\u7ea2\u6846\u5f53\u4e2d\u6267\u884c\u7684",(0,i.kt)("inlineCode",{parentName:"p"},"requestAnimation"),"\u56de\u8c03\u51fd\u6570\u63a5\u6536\u5230\u7684\u65f6\u95f4\u6233\u90fd\u662f\u76f8\u540c\u7684\u503c\u3002\u4e00\u822c\u800c\u8a00\uff0c\u5bf9\u4e8e\u4e00\u4e2a\u5237\u65b0\u9891\u7387\u4e3a",(0,i.kt)("inlineCode",{parentName:"p"},"60hz"),"\u7684\u5c4f\u5e55\u6765\u8bf4\uff0c\u56de\u8c03\u51fd\u6570\u4f1a\u5728",(0,i.kt)("inlineCode",{parentName:"p"},"16.7ms"),"\u4e4b\u540e\u6267\u884c\u3002\u90a3\u4e48",(0,i.kt)("inlineCode",{parentName:"p"},"react-scheduler"),"\u5219\u9700\u8981\u52a8\u6001\u7684\u8bc6\u522b\u6d4f\u89c8\u5668\u7684\u5237\u65b0\u9891\u7387\u3002"),(0,i.kt)("h4",{id:"\u65b0\u8001scheduler\u7684\u5bf9\u6bd4"},"\u65b0\u8001scheduler\u7684\u5bf9\u6bd4"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"scheduler",src:n(3337).Z,width:"936",height:"364"})),(0,i.kt)("p",null,"\u5148\u7b80\u5355\u4ecb\u7ecd",(0,i.kt)("inlineCode",{parentName:"p"},"frame"),"\u5bf9\u9f50\u65b9\u6848\u7684\u57fa\u672c\u6d41\u7a0b\uff0c\u5982\u4e0b\u56fe\u6240\u793a\uff0c\u6211\u4eec\u5728\u901a\u8fc7",(0,i.kt)("inlineCode",{parentName:"p"},"scheduleCallback"),"\u6dfb\u52a0\u4efb\u52a1\u7684\u65f6\u5019\u4f1a\u8c03\u7528",(0,i.kt)("inlineCode",{parentName:"p"},"requestCallback"),"\uff0c\u8fd9\u4e2a\u51fd\u6570\u4f1a\u901a\u8fc7\u5224\u65ad\u6700\u9ad8\u4f18\u5148\u7ea7\u7684\u4efb\u52a1\u662f\u5426\u5df2\u7ecf\u5230\u671f\u4e86\uff0c\u5982\u679c\u5230\u671f\u4e86\u4f1a\u5728\u4e0b\u4e00\u4e2a\u4e8b\u4ef6\u5faa\u73af\u4e2d\u901a\u8fc7",(0,i.kt)("inlineCode",{parentName:"p"},"idleTick"),"\u8c03\u7528",(0,i.kt)("inlineCode",{parentName:"p"},"flushWork"),"\u53bb\u5237\u65b0\u94fe\u8868\u4e2d\uff08\u65b0\u7248\u7684\u4f18\u5148\u961f\u5217\u4f7f\u7528\u6700\u5c0f\u5806\u6765\u5b9e\u73b0\u65f6\u95f4\u590d\u6742\u5ea6\u4ece",(0,i.kt)("inlineCode",{parentName:"p"},"n"),"\u63d0\u5347\u5230",(0,i.kt)("inlineCode",{parentName:"p"},"logn"),"\uff09\u4e2d\u5df2\u5230\u671f\u7684\u4efb\u52a1\u3002\u5e76\u4e14\u5982\u679c\u8fd8\u6709\u4efb\u52a1\u5b58\u7559\u5219\u4f1a\u8c03\u7528",(0,i.kt)("inlineCode",{parentName:"p"},"requestAnimation"),"\uff0c\u76ee\u7684\u662f\u5728\u4e0b\u4e00\u6b21\u91cd\u7ed8\u4e4b\u524d\u628a\u5269\u4f59\u7684\u4efb\u52a1\u68c0\u67e5\u4e00\u4e0b\uff0c\u770b\u6709\u6ca1\u6709\u4efb\u52a1\u9700\u8981\u901a\u8fc7",(0,i.kt)("inlineCode",{parentName:"p"},"idleTick"),"\u6267\u884c\u3002"),(0,i.kt)("p",null,"\u6b64\u5916\u9700\u8981\u6ce8\u610f\u4e00\u70b9\uff0c\u5728",(0,i.kt)("inlineCode",{parentName:"p"},"flushWork"),"\u4e0d\u65ad\u6267\u884c\u8fc7\u671f\u4efb\u52a1\u7684\u8fc7\u7a0b\u4e2d\uff0c\u662f\u4e0d\u662f\u53ef\u4ee5\u5c06\u6240\u6709\u5230\u671f\u7684\u4efb\u52a1\u90fd\u6267\u884c\u5b8c\u6210\u5462\uff1f\u5e76\u975e\u5982\u6b64\uff0c\u5728\u4efb\u52a1\u6267\u884c\u65f6\u95f4\u6bd4\u8f83\u77ed\u7684\u524d\u63d0\u4e0b\uff08\u4ee3\u7801\u8d28\u91cf\u9ad8\uff09\uff0c\u5982\u679c\u4efb\u52a1\u975e\u5e38\u591a\uff0c\u90a3\u4e48\u4e5f\u53ef\u80fd\u4f1a\u963b\u585e\u5f53\u524d\u5e27\u7684\u6e32\u67d3\uff0c\u5bfc\u81f4\u6389\u5e27\u800c\u5361\u987f\u3002\u56e0\u6b64\u5728",(0,i.kt)("inlineCode",{parentName:"p"},"flushWork"),"\u7684\u8fc7\u7a0b\u4e2d\uff0c\u6bcf\u6b21\u4efb\u52a1\u6267\u884c\u4e4b\u524d\u90fd\u9700\u8981\u67e5\u770b\u662f\u5426\u5df2\u7ecf\u5230\u4e86\u5c4f\u5e55\u9700\u8981\u5237\u65b0\u4e0b\u4e00\u5e27\u7684\u65f6\u95f4\u70b9\u3002\u5982\u679c\u5230\u4e86\u90a3\u4e2a\u65f6\u95f4\u70b9\uff0c\u90a3\u4e48\u4e0d\u80fd\u518d\u6267\u884c\u4e0b\u4e00\u4e2a\u4efb\u52a1\u4e86\uff0c\u9700\u8981\u901a\u8fc7\u521b\u5efa\u4e00\u4e2a\u5b8f\u4efb\u52a1\uff0c\u5c06\u4e3b\u7ebf\u7a0b\u8ba9\u51fa\u6765\u7ed9\u6e32\u67d3\u8fdb\u7a0b\u6765\u6e32\u67d3\u9875\u9762\u3002\uff08\u8fd9\u91cc\u4e5f\u53ef\u4ee5\u770b\u5230\u65b0\u8001\u7248\u672c\u7684",(0,i.kt)("inlineCode",{parentName:"p"},"scheduler"),"\u7684\u533a\u522b\uff0c\u65b0\u7248\u672c\u4ee5",(0,i.kt)("inlineCode",{parentName:"p"},"5ms"),"\u4e3a\u4e00\u4e2a\u65f6\u95f4\u7247\u6bb5\uff0c\u5c06\u7a7a\u95f2\u65f6\u95f4\u5212\u5206\u51fa\u4e86\u66f4\u591a\u7684\u65f6\u95f4\u7247\u6bb5\uff0c\u8fd9\u6837\u4f7f\u5f97\u6709\u66f4\u591a\u7684\u65f6\u95f4\u95f4\u9694\u6765\u54cd\u5e94\u7528\u6237\u7684\u64cd\u4f5c\uff0c\u53d8\u5f97\u66f4\u52a0",(0,i.kt)("inlineCode",{parentName:"p"},"reactive"),"\uff09\u3002"),(0,i.kt)("p",null,"\u540c\u65f6\u4e3a\u4e86\u4fdd\u8bc1\u4efb\u52a1\u7684\u6709\u5e8f\u8fdb\u884c\uff0c\u5728\u6bcf\u4e00\u5e27\u4e2d",(0,i.kt)("inlineCode",{parentName:"p"},"react-scheduler"),"\u901a\u8fc7",(0,i.kt)("inlineCode",{parentName:"p"},"requestAnimation"),"\u6ce8\u518c\u7684\u56de\u8c03\u51fd\u6570\u53ea\u80fd\u5b58\u5728\u4e00\u4e2a\u3002"),(0,i.kt)("h4",{id:"\u52a8\u6001\u83b7\u53d6\u5c4f\u5e55\u7684\u5e27\u7387"},"\u52a8\u6001\u83b7\u53d6\u5c4f\u5e55\u7684\u5e27\u7387"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},"// var nextFrameTime = activeFrameTime\u2018 + activeFrameTime;\nvar nextFrameTime = rafTime - frameDeadline + activeFrameTime;\nif (\n  nextFrameTime < activeFrameTime && // activeFrameTime\u2018 < 0\n  previousFrameTime < activeFrameTime // \n) {\n  if (nextFrameTime < 8) {\n    nextFrameTime = 8;\n  }\n  activeFrameTime =\n    nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;\n} else {\n  previousFrameTime = nextFrameTime;\n}\nframeDeadline = rafTime + activeFrameTime;\n")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"nextFrameTime"),"\u8fd9\u91cc\u5176\u5b9e\u5c31\u662f\u5f53\u524d\u7684\u5e27\u7387\u8868\u793a\u7684\u5e27\u4e4b\u95f4\u7684\u65f6\u95f4\u95f4\u9694\u3002\u5728",(0,i.kt)("inlineCode",{parentName:"p"},"requestAnimation"),"\u7684\u56de\u8c03\u51fd\u6570\u4e2d\uff0c\u4f1a\u8ba1\u7b97\u51fa\u5c4f\u5e55\u7684\u4e0b\u4e00\u5e27\u65f6\u95f4\u70b9",(0,i.kt)("inlineCode",{parentName:"p"},"frameDealine"),"\uff0c\u5176\u4e2d",(0,i.kt)("inlineCode",{parentName:"p"},"rafTime"),"\u662f\u5f53\u524d\u56de\u8c03\u51fd\u6570\u63a5\u6536\u5230\u7684\u65f6\u95f4\uff0c",(0,i.kt)("inlineCode",{parentName:"p"},"frameDeadline"),"\u4e3a\u4e0a\u4e00\u4e2a",(0,i.kt)("inlineCode",{parentName:"p"},"requestAnimation"),"\u56de\u8c03\u51fd\u6570\u9884\u6d4b\u7684\u65f6\u95f4\u70b9\u3002"),(0,i.kt)("p",null,"\u5728\u8fd9\u4e2a\u6761\u4ef6\u8bed\u53e5\u4e2d\uff0c\u8fd9\u4e00\u5e27\u5f53\u524d\u771f\u5b9e\u7684\u65f6\u95f4\u70b9",(0,i.kt)("inlineCode",{parentName:"p"},"rafTime"),"\u6bd4\u9884\u6d4b\u7684\u65f6\u95f4\u70b9\u5c0f\uff0c\u4e5f\u5c31\u662f\u8bf4\u5e27\u7387\u9884\u6d4b\u8fc7\u4f4e\uff0c\u65f6\u95f4\u4e0e\u9891\u7387\u6210\u53cd\u6bd4\u3002\u90a3\u4e48\u6211\u4eec\u9700\u8981\u63a5\u53d7\u8fd9\u4e2a\u5e27\u7387\uff0c\u5373\u91cd\u65b0\u8bbe\u7f6e\u5e27\u7684\u65f6\u95f4\u95f4\u9694\u4e3a",(0,i.kt)("inlineCode",{parentName:"p"},"previousFrameTime"),"\u4e0e",(0,i.kt)("inlineCode",{parentName:"p"},"nextFrameTime"),"\u7684\u6700\u5927\u503c\u3002"),(0,i.kt)("p",null,"\u5982\u679c\u5e27\u7387\u9884\u6d4b\u8fc7\u9ad8\uff0c\u5373\u65f6\u95f4\u95f4\u9694\u9884\u6d4b\u8fc7\u4f4e\uff0c\u90a3\u4e48\u5c06\u6b64\u6b21\u7684\u65f6\u95f4\u95f4\u9694\u7ed9\u4fdd\u5b58\u5230",(0,i.kt)("inlineCode",{parentName:"p"},"previousFrameTime"),"\u3002"),(0,i.kt)("h4",{id:"\u603b\u7ed3"},"\u603b\u7ed3"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"activeFrameTime"),"\u521d\u59cb\u503c\u4e3a",(0,i.kt)("inlineCode",{parentName:"p"},"33"),"\uff0c\u5e76\u4e14\u5f53\u5b9e\u9645\u7684\u65f6\u95f4\u95f4\u9694\u5728\u8fde\u7eed\u4e24\u6b21\u90fd\u5c0f\u4e8e\u5f53\u524d",(0,i.kt)("inlineCode",{parentName:"p"},"activeFrameTime"),"\u7684\u65f6\u5019\u624d\u4f1a\u66f4\u65b0",(0,i.kt)("inlineCode",{parentName:"p"},"activeFrameTime"),"\u3002\u6240\u4ee5",(0,i.kt)("inlineCode",{parentName:"p"},"activeFrameTime"),"\u7684\u53d6\u503c\u4e3a",(0,i.kt)("inlineCode",{parentName:"p"},"8"),"\u5230",(0,i.kt)("inlineCode",{parentName:"p"},"33ms"),"\uff0c\u5bf9\u5e94\u7684\u9891\u7387\u8303\u56f4\u662f",(0,i.kt)("inlineCode",{parentName:"p"},"30hz"),"\u5230",(0,i.kt)("inlineCode",{parentName:"p"},"120hz"),"\uff0c\u5e76\u4e14",(0,i.kt)("inlineCode",{parentName:"p"},"activeFrameTime"),"\u5728\u51cf\u5c11\u4e4b\u540e\u65e0\u6cd5\u518d\u589e\u52a0\u3002\u56e0\u6b64\u65e7\u7248\u7684",(0,i.kt)("inlineCode",{parentName:"p"},"scheduler"),"\u53ea\u80fd\u591f\u83b7\u53d6\u5230\u5f53\u524d\u7cfb\u7edf\u5c4f\u5e55\u7684\u5e27\u7387\uff0c\u5e76\u4e14\u53ea\u80fd\u591f\u5411\u4e0a\u8c03\u6574\u5e27\u7387\uff08\u5373\u5411\u4e0b\u8c03\u6574\u65f6\u95f4\u95f4\u9694\uff09\u3002"),(0,i.kt)("p",null,"\u8001\u7248\u672c",(0,i.kt)("inlineCode",{parentName:"p"},"scheduler"),"\u7684\u7f3a\u70b9\uff1a"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"\u65f6\u95f4\u7247\u5207\u5206\u4e0d\u591f\u7ec6\uff1a\u4e00\u65e6\u5904\u4e8e\u5237\u65b0\u4efb\u52a1\u7684\u5faa\u73af\u4e2d\uff0c\u5728\u4efb\u52a1\u8db3\u591f\u591a\u7684\u60c5\u51b5\u4e0b\uff0c\u76f4\u5230\u6ca1\u6709\u7a7a\u95f2\u65f6\u95f4\u624d\u4f1a\u505c\u6b62\u5237\u65b0\u4efb\u52a1\uff0c\u8fd9\u6837\u5bfc\u81f4\u4e86\u4e00\u6574\u6bb5\u7a7a\u95f2\u65f6\u95f4\u90fd\u963b\u585e\u4e86\u6e32\u67d3\u8fdb\u7a0b\u3002"),(0,i.kt)("li",{parentName:"ol"},"\u4f9d\u8d56\u5e27\u7387\uff1a\u4e00\u65e6\u51fa\u73b0\u5e27\u7387\u8bbe\u7f6e\u7684\u5c0f\u4e8e\u5b9e\u9645\u7684\u5e27\u7387\uff0c\u800c\u65e0\u6cd5\u5411\u4e0a\u8c03\u6574\uff0c\u56e0\u6b64\u4f1a\u51fa\u73b0\u8fc7\u671f\u65f6\u95f4\u6bd4\u5b9e\u9645\u7684\u5c0f\uff0c\u4ece\u800c",(0,i.kt)("inlineCode",{parentName:"li"},"\u7a7a\u95f2\u65f6\u95f4"),"\u65f6\u95f4\u53d8\u5c0f\uff0c\u65e0\u6cd5\u5145\u5206\u5229\u7528\u6240\u6709\u7684\u7a7a\u95f2\u65f6\u95f4\u6765\u6267\u884c\u4efb\u52a1\u3002")),(0,i.kt)("p",null,"\u4e3a\u4e86\u89e3\u51b3\u4e0a\u8ff0\u95ee\u9898\uff0c\u65b0\u7248\u7684",(0,i.kt)("inlineCode",{parentName:"p"},"scheduler"),"\u91c7\u7528",(0,i.kt)("inlineCode",{parentName:"p"},"5ms"),"\u7684\u65f6\u95f4\u5207\u7247\uff0c\u6bcf",(0,i.kt)("inlineCode",{parentName:"p"},"5ms"),"\u91ca\u653e\u4e00\u4e0b\u4e3b\u7ebf\u7a0b\u63a7\u5236\u6743\uff0c\u5bf9\u7528\u6237\u7684\u64cd\u4f5c\u66f4\u52a0\u7075\u654f\uff0c\u89e3\u51b3\u4e86\u7b2c\u4e00\u4e2a\u95ee\u9898\u3002\u5e76\u4e14\u4e0d\u518d\u91c7\u7528\u5e27\u5bf9\u9f50\u65b9\u6848\uff0c\u5728\u6709\u4efb\u52a1\u7684\u65f6\u5019\uff0c\u5229\u7528\u5b8f\u4efb\u52a1\u7d27\u51d1\u7684\u5237\u65b0\u4efb\u52a1\u961f\u5217\uff0c\u5145\u5206\u7684\u5229\u7528\u4e86\u7a7a\u95f2\u65f6\u95f4\uff0c\u89e3\u51b3\u4e86\u7b2c\u4e8c\u4e2a\u95ee\u9898\u3002"),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"\u65b0\u7248\u672cscheduler\u7684\u65b9\u6848\u53ef\u4ee5\u770b\u516c\u4f17\u53f7\u7684\u524d\u4e00\u7bc7\u6587\u7ae0\u3002")))}s.isMDXComponent=!0},2008:function(e,t,n){t.Z=n.p+"assets/images/frame-96b6a55da4b66d7488ff7b6e09bcec91.png"},3337:function(e,t,n){t.Z=n.p+"assets/images/scheduler-80604025d71ad1c8c8d907a7ae2c6de8.png"}}]);