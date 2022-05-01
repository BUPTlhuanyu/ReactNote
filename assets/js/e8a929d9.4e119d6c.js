"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[5815],{3905:function(e,r,t){t.d(r,{Zo:function(){return p},kt:function(){return m}});var o=t(7294);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function c(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function a(e,r){if(null==e)return{};var t,o,n=function(e,r){if(null==e)return{};var t,o,n={},i=Object.keys(e);for(o=0;o<i.length;o++)t=i[o],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)t=i[o],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var l=o.createContext({}),u=function(e){var r=o.useContext(l),t=r;return e&&(t="function"==typeof e?e(r):c(c({},r),e)),t},p=function(e){var r=u(e.components);return o.createElement(l.Provider,{value:r},e.children)},s={inlineCode:"code",wrapper:function(e){var r=e.children;return o.createElement(o.Fragment,{},r)}},d=o.forwardRef((function(e,r){var t=e.components,n=e.mdxType,i=e.originalType,l=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),d=u(t),m=n,f=d["".concat(l,".").concat(m)]||d[m]||s[m]||i;return t?o.createElement(f,c(c({ref:r},p),{},{components:t})):o.createElement(f,c({ref:r},p))}));function m(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var i=t.length,c=new Array(i);c[0]=d;var a={};for(var l in r)hasOwnProperty.call(r,l)&&(a[l]=r[l]);a.originalType=e,a.mdxType="string"==typeof e?e:n,c[1]=a;for(var u=2;u<i;u++)c[u]=t[u];return o.createElement.apply(null,c)}return o.createElement.apply(null,t)}d.displayName="MDXCreateElement"},2224:function(e,r,t){t.r(r),t.d(r,{assets:function(){return p},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return a},metadata:function(){return u},toc:function(){return s}});var o=t(3117),n=t(102),i=(t(7294),t(3905)),c=["components"],a={id:"sync-async-work",sidebar_label:"\u540c\u6b65\u4e0e\u5f02\u6b65\u8c03\u5ea6",slug:"/react/react/reconciler/sync-async-work",sidebar_position:4,title:""},l=void 0,u={unversionedId:"react/react/reconciler/sync-async-work",id:"react/react/reconciler/sync-async-work",title:"",description:"\u7531\u4e8erequestWork\u4e2d\u4f1a\u8c03\u7528performSyncWork\u7acb\u5373\u8fdb\u5165\u8c03\u5ea6\u9636\u6bb5\u6216\u8005\u8c03\u7528scheduleCallbackWithExpirationTime\u5c06performAsyncWork\u63a8\u5165scheduler\u8fdb\u884c\u5f02\u6b65\u8c03\u5ea6\uff0c\u8fd9\u4e2a\u5f02\u6b65\u8c03\u5ea6\u4f1a\u5728\u6d4f\u89c8\u5668\u6709\u7a7a\u4f59\u65f6\u95f4\u6216\u8005\u8fd9\u4e2aperformAsyncWork\u51fd\u6570\u8fc7\u671f\uff08\u8fc7\u671f\u662f\u901a\u8fc7\u8fd9\u4e2a\u51fd\u6570\u5bf9\u5e94\u7684timeout\u6765\u786e\u5b9a\u7684\uff09\u6765\u8fdb\u884c\u81ea\u52a8\u7684\u89e6\u53d1\u3002\u4e0a\u4e00\u8282\u5df2\u7ecf\u5206\u6790\u4e86scheduleCallbackWithExpirationTime\uff0c\u56e0\u6b64\u6765\u770b\u4e00\u4e0bperformAsyncWork\u4e0eperformSyncWork\u8fd9\u4e24\u4e2a\u51fd\u6570\u7684\u4f5c\u7528\u3002",source:"@site/docs/react/react/reconciler/3-2\u3001performAsyncWork\u4e0eperformSyncWork.md",sourceDirName:"react/react/reconciler",slug:"/react/react/reconciler/sync-async-work",permalink:"/ReactNote/docs/react/react/reconciler/sync-async-work",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react/reconciler/3-2\u3001performAsyncWork\u4e0eperformSyncWork.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{id:"sync-async-work",sidebar_label:"\u540c\u6b65\u4e0e\u5f02\u6b65\u8c03\u5ea6",slug:"/react/react/reconciler/sync-async-work",sidebar_position:4,title:""},sidebar:"react",previous:{title:"\u521b\u5efaroot\u4e0b\u7684fiber\u6811\u5e76\u5f00\u59cb\u521d\u59cb\u8c03\u5ea6",permalink:"/ReactNote/docs/react/react/reconciler/schedulework"},next:{title:"\u8c03\u5ea6\u7684\u5165\u53e3\u51fd\u6570",permalink:"/ReactNote/docs/react/react/reconciler/performwork"}},p={},s=[{value:"\ud83c\udf33performSyncWork",id:"performsyncwork",level:2},{value:"\ud83c\udf33performAsyncWork",id:"performasyncwork",level:2},{value:"0\ufe0f\u20e3shouldYieldToRenderer\uff1a\u5224\u65ad\u5f53\u524d\u5e27\u662f\u5426\u6709\u7a7a\u4f59\u65f6\u95f4\u6216\u8005\u5f53\u524d\u4efb\u52a1\u662f\u5426\u8fc7\u671f",id:"0\ufe0f\u20e3shouldyieldtorenderer\u5224\u65ad\u5f53\u524d\u5e27\u662f\u5426\u6709\u7a7a\u4f59\u65f6\u95f4\u6216\u8005\u5f53\u524d\u4efb\u52a1\u662f\u5426\u8fc7\u671f",level:4},{value:"1\ufe0f\u20e3recomputeCurrentRendererTime\uff1a\u5f53\u524d\u65f6\u95f4\u8ddd\u79bb\u91ccreact\u5e94\u7528\u5f00\u59cb\u65f6\u95f4\u7684\u65f6\u957f",id:"1\ufe0f\u20e3recomputecurrentrenderertime\u5f53\u524d\u65f6\u95f4\u8ddd\u79bb\u91ccreact\u5e94\u7528\u5f00\u59cb\u65f6\u95f4\u7684\u65f6\u957f",level:4},{value:"2\ufe0f\u20e3didExpireAtExpirationTime\uff1a\u5728\u5faa\u73af\u904d\u5386root\u53cc\u5411\u94fe\u8868\uff0c\u5e76\u8c03\u7528\u8be5\u51fd\u6570\u5224\u65ad\u904d\u5386\u5230\u7684\u5f53\u524droot\u7684\u66f4\u65b0\u4efb\u52a1\u662f\u5426\u5df2\u7ecf\u8fc7\u671f\uff0c\u5982\u679c\u8fc7\u671f\u5e76\u5c06\u5f53\u524d\u65f6\u95f4\u8d4b\u503c\u7ed9root.nextExpirationTimeToWorkOn\u4f5c\u4e3a\u540e\u7eed\u662f\u5426\u6267\u884c\u66f4\u65b0\u4efb\u52a1\u7684\u5224\u65ad\u4f9d\u636e\u3002",id:"2\ufe0f\u20e3didexpireatexpirationtime\u5728\u5faa\u73af\u904d\u5386root\u53cc\u5411\u94fe\u8868\u5e76\u8c03\u7528\u8be5\u51fd\u6570\u5224\u65ad\u904d\u5386\u5230\u7684\u5f53\u524droot\u7684\u66f4\u65b0\u4efb\u52a1\u662f\u5426\u5df2\u7ecf\u8fc7\u671f\u5982\u679c\u8fc7\u671f\u5e76\u5c06\u5f53\u524d\u65f6\u95f4\u8d4b\u503c\u7ed9rootnextexpirationtimetoworkon\u4f5c\u4e3a\u540e\u7eed\u662f\u5426\u6267\u884c\u66f4\u65b0\u4efb\u52a1\u7684\u5224\u65ad\u4f9d\u636e",level:4},{value:"3\ufe0f\u20e3performWork\uff1a\u5f00\u59cb\u8c03\u5ea6\u6bcf\u4e2aroot\u6811\u4e0a\u7684\u66f4\u65b0\u4efb\u52a1",id:"3\ufe0f\u20e3performwork\u5f00\u59cb\u8c03\u5ea6\u6bcf\u4e2aroot\u6811\u4e0a\u7684\u66f4\u65b0\u4efb\u52a1",level:4}],d={toc:s};function m(e){var r=e.components,t=(0,n.Z)(e,c);return(0,i.kt)("wrapper",(0,o.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"\u7531\u4e8erequestWork\u4e2d\u4f1a\u8c03\u7528performSyncWork\u7acb\u5373\u8fdb\u5165\u8c03\u5ea6\u9636\u6bb5\u6216\u8005\u8c03\u7528scheduleCallbackWithExpirationTime\u5c06performAsyncWork\u63a8\u5165scheduler\u8fdb\u884c\u5f02\u6b65\u8c03\u5ea6\uff0c\u8fd9\u4e2a\u5f02\u6b65\u8c03\u5ea6\u4f1a\u5728\u6d4f\u89c8\u5668\u6709\u7a7a\u4f59\u65f6\u95f4\u6216\u8005\u8fd9\u4e2aperformAsyncWork\u51fd\u6570\u8fc7\u671f\uff08\u8fc7\u671f\u662f\u901a\u8fc7\u8fd9\u4e2a\u51fd\u6570\u5bf9\u5e94\u7684timeout\u6765\u786e\u5b9a\u7684\uff09\u6765\u8fdb\u884c\u81ea\u52a8\u7684\u89e6\u53d1\u3002\u4e0a\u4e00\u8282\u5df2\u7ecf\u5206\u6790\u4e86scheduleCallbackWithExpirationTime\uff0c\u56e0\u6b64\u6765\u770b\u4e00\u4e0bperformAsyncWork\u4e0eperformSyncWork\u8fd9\u4e24\u4e2a\u51fd\u6570\u7684\u4f5c\u7528\u3002")),(0,i.kt)("h2",{id:"performsyncwork"},"\ud83c\udf33performSyncWork"),(0,i.kt)("p",null,"\u5982\u679c\u5f53\u524d\u7684\u66f4\u65b0\u4efb\u52a1\u4f18\u5148\u7ea7\u7279\u522b\u9ad8\u9700\u8981\u7acb\u5373\u540c\u6b65\u66f4\u65b0\uff0c\u90a3\u4e48\u4f1a\u8c03\u7528performSyncWork\u6765\u6267\u884c\u540c\u6b65\u7684performWork"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"// performSyncWork \u540c\u6b65\u65b9\u5f0f\n// \u76f4\u63a5\u6267\u884cperformWork\nfunction performSyncWork() {\n  performWork(Sync, false);\n}\n")),(0,i.kt)("h2",{id:"performasyncwork"},"\ud83c\udf33performAsyncWork"),(0,i.kt)("p",null,"\u5224\u65ad\u5f53\u524d\u5e27\u662f\u5426\u6709\u7a7a\u4f59\u65f6\u95f4\u6216\u8005\u5f53\u524d\u4efb\u52a1\u662f\u5426\u8fc7\u671f\uff0c\u5982\u679c\u6ca1\u6709\u8fc7\u671f\u6216\u8005\u6ca1\u65f6\u95f4\u5219\u5c06didYield\u8bbe\u7f6e\u4e3afalse\uff0c\u5426\u5219\uff1a\u8ba1\u7b97\u5f53\u524d\u65f6\u95f4\u8ddd\u79bb\u91ccreact\u5e94\u7528\u5f00\u59cb\u65f6\u95f4\u7684\u65f6\u957f\uff1b\u7136\u540e\u904d\u5386root\u53cc\u5411\u94fe\u8868\uff0c\u7b5b\u9009\u51fa\u66f4\u65b0\u4efb\u52a1\u8fc7\u671f\u7684root\uff0c\u5e76\u5c06\u5f53\u524d\u65f6\u95f4\u8d4b\u503c\u7ed9root.nextExpirationTimeToWorkOn\u4f5c\u4e3a\u540e\u7eed\u662f\u5426\u6267\u884c\u66f4\u65b0\u4efb\u52a1\u7684\u5224\u65ad\u4f9d\u636e\uff1b\u6700\u540e\u5f00\u59cb\u8c03\u5ea6\u6bcf\u4e2aroot\u6811\u4e0a\u7684\u66f4\u65b0\u4efb\u52a1\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"function performAsyncWork() {\n  try {\n    if (!shouldYieldToRenderer()) {\n      // \u5224\u65ad\u5f53\u524d\u5e27\u662f\u5426\u6709\u7a7a\u4f59\u65f6\u95f4\u6216\u8005\u8fd9\u4e2a\u4efb\u52a1\u662f\u5426\u8fc7\u671f\uff0c\u6709\u7a7a\u4f59\u65f6\u95f4\u6216\u8005\u4efb\u52a1\u8fc7\u671f\u5219\u9700\u8981\u7acb\u5373\u6267\u884c\n      if (firstScheduledRoot !== null) {\n        // \u8ba1\u7b97\u51fa\u5f53\u524d\u8c03\u5ea6\u7684\u5f02\u6b65\u4efb\u52a1\u7684\u65f6\u95f4\uff0c\u8fd9\u4e2a\u65f6\u95f4\u4fdd\u5b58\u5728currentRendererTime\u53d8\u91cf\u4e2d\uff0c\u8868\u793a\u73b0\u5728\u6267\u884c\u8be5\u51fd\u6570\u5230\u6700\u521d\u6267\u884c\u8be5js\u6a21\u5757\u7684\u65f6\u957f\n        recomputeCurrentRendererTime();\n        let root: FiberRoot = firstScheduledRoot;\n        do {\n          // \u5224\u65adroot\u53cc\u5411\u94fe\u8868\u4e2d\u6bcf\u4e2aroot\u7684\u66f4\u65b0\u4efb\u52a1\u662f\u5426\u5230\u671f\uff0c\u5982\u679c\u5230\u671f\uff0c\u5219\u5c06\u5f53\u524d\u65f6\u95f4\u8bbe\u7f6e\u4e3aroot\u7684nextExpirationTimeToWorkOn\n          // \u8be5\u65f6\u95f4\u51b3\u5b9a\u54ea\u4e9b\u8282\u70b9\u7684\u66f4\u65b0\u8981\u5728\u5f53\u524d\u5468\u671f\u4e2d\u88ab\u6267\u884c\n          didExpireAtExpirationTime(root, currentRendererTime);\n          // The root schedule is circular, so this is never null.\n          root = (root.nextScheduledRoot: any);\n        } while (root !== firstScheduledRoot);\n      }\n    }\n    performWork(NoWork, true);\n  } finally {\n    didYield = false;\n  }\n}\n")),(0,i.kt)("h4",{id:"0\ufe0f\u20e3shouldyieldtorenderer\u5224\u65ad\u5f53\u524d\u5e27\u662f\u5426\u6709\u7a7a\u4f59\u65f6\u95f4\u6216\u8005\u5f53\u524d\u4efb\u52a1\u662f\u5426\u8fc7\u671f"},"0\ufe0f\u20e3shouldYieldToRenderer\uff1a\u5224\u65ad\u5f53\u524d\u5e27\u662f\u5426\u6709\u7a7a\u4f59\u65f6\u95f4\u6216\u8005\u5f53\u524d\u4efb\u52a1\u662f\u5426\u8fc7\u671f"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"let didYield: boolean = false;\n// \u8fd4\u56defalse\u8868\u793ascheduler\u8fd4\u56de\u7684\u5f02\u6b65\u4efb\u52a1\u7684\u8fc7\u671f\u4e86\uff0c\u9700\u8981\u7acb\u5373\u6267\u884c\uff0c\u800c\u4e0d\u662f\u5c06js\u7ebf\u7a0byield\u7ed9(\u8ba9\u7ed9)\u6d4f\u89c8\u5668renderer\u3002\nfunction shouldYieldToRenderer() {\n  if (didYield) {\n    return true;\n  }\n  if (shouldYield()) {\n    didYield = true;\n    return true;\n  }\n  return false;\n}\n")),(0,i.kt)("h4",{id:"1\ufe0f\u20e3recomputecurrentrenderertime\u5f53\u524d\u65f6\u95f4\u8ddd\u79bb\u91ccreact\u5e94\u7528\u5f00\u59cb\u65f6\u95f4\u7684\u65f6\u957f"},"1\ufe0f\u20e3recomputeCurrentRendererTime\uff1a\u5f53\u524d\u65f6\u95f4\u8ddd\u79bb\u91ccreact\u5e94\u7528\u5f00\u59cb\u65f6\u95f4\u7684\u65f6\u957f"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"function recomputeCurrentRendererTime() {\n  // \u5f53\u524d\u65f6\u95f4\u4e3a\u5f53\u524ddocument\u5df2\u7ecf\u5b58\u5728\u7684\u65f6\u957f-\u6700\u521d\u6267\u884c\u8be5js\u6a21\u5757document\u5b58\u5728\u7684\u65f6\u957f\n  // \u56e0\u6b64\u8be5\u5f53\u524d\u65f6\u95f4\u8868\u793a\u4e3a\u73b0\u5728\u6267\u884c\u8be5\u51fd\u6570\u5230\u6700\u521d\u6267\u884c\u8be5js\u6a21\u5757\u7684\u65f6\u957f\n  const currentTimeMs = now() - originalStartTimeMs;\n  // \u5c06ms\u5355\u4f4d\u7684\u5f53\u524d\u65f6\u95f4\u8f6c\u6362\u6210\u5230\u671f\u65f6\u95f4\n  currentRendererTime = msToExpirationTime(currentTimeMs);\n}\n")),(0,i.kt)("h4",{id:"2\ufe0f\u20e3didexpireatexpirationtime\u5728\u5faa\u73af\u904d\u5386root\u53cc\u5411\u94fe\u8868\u5e76\u8c03\u7528\u8be5\u51fd\u6570\u5224\u65ad\u904d\u5386\u5230\u7684\u5f53\u524droot\u7684\u66f4\u65b0\u4efb\u52a1\u662f\u5426\u5df2\u7ecf\u8fc7\u671f\u5982\u679c\u8fc7\u671f\u5e76\u5c06\u5f53\u524d\u65f6\u95f4\u8d4b\u503c\u7ed9rootnextexpirationtimetoworkon\u4f5c\u4e3a\u540e\u7eed\u662f\u5426\u6267\u884c\u66f4\u65b0\u4efb\u52a1\u7684\u5224\u65ad\u4f9d\u636e"},"2\ufe0f\u20e3didExpireAtExpirationTime\uff1a\u5728\u5faa\u73af\u904d\u5386root\u53cc\u5411\u94fe\u8868\uff0c\u5e76\u8c03\u7528\u8be5\u51fd\u6570\u5224\u65ad\u904d\u5386\u5230\u7684\u5f53\u524droot\u7684\u66f4\u65b0\u4efb\u52a1\u662f\u5426\u5df2\u7ecf\u8fc7\u671f\uff0c\u5982\u679c\u8fc7\u671f\u5e76\u5c06\u5f53\u524d\u65f6\u95f4\u8d4b\u503c\u7ed9root.nextExpirationTimeToWorkOn\u4f5c\u4e3a\u540e\u7eed\u662f\u5426\u6267\u884c\u66f4\u65b0\u4efb\u52a1\u7684\u5224\u65ad\u4f9d\u636e\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"/**\n * \u5c06\u5f53\u524d\u65f6\u95f4\u4e0eroot\u4e0a\u7684\u5230\u671f\u65f6\u95f4\u8fdb\u884c\u5bf9\u6bd4\uff0c\u5982\u679croot\u4e0a\u7684\u5230\u671f\u65f6\u95f4\u6bd4\u5f53\u524d\u65f6\u95f4\u5927\uff0c\u8bf4\u660e\u8fd9\u4e2aroot\u4e0a\u7684\u66f4\u65b0\u4efb\u52a1\u8fc7\u671f\u4e86\uff0c\u9700\u8981\u7acb\u5373\u6267\u884c\n * \u7136\u540e\u5c06\u5f53\u524d\u65f6\u95f4\u8bbe\u7f6e\u4e3aroot\u4e0a\u7684nextExpirationTimeToWorkOn\uff0c\u8be5\u65f6\u95f4\u51b3\u5b9a\u54ea\u4e9b\u8282\u70b9\u7684\u66f4\u65b0\u8981\u5728\u5f53\u524d\u5468\u671f\u4e2d\u88ab\u6267\u884c\n */\nexport function didExpireAtExpirationTime(\n  root: FiberRoot,\n  currentTime: ExpirationTime,\n): void {\n  const expirationTime = root.expirationTime;\n  if (expirationTime !== NoWork && currentTime <= expirationTime) {\n    // The root has expired. Flush all work up to the current time.\n    root.nextExpirationTimeToWorkOn = currentTime;\n  }\n}\n")),(0,i.kt)("h4",{id:"3\ufe0f\u20e3performwork\u5f00\u59cb\u8c03\u5ea6\u6bcf\u4e2aroot\u6811\u4e0a\u7684\u66f4\u65b0\u4efb\u52a1"},"3\ufe0f\u20e3performWork\uff1a\u5f00\u59cb\u8c03\u5ea6\u6bcf\u4e2aroot\u6811\u4e0a\u7684\u66f4\u65b0\u4efb\u52a1"),(0,i.kt)("p",null,"\u8fd9\u91cc\u4e0b\u4e00\u8282\u4f1a\u5206\u6790"))}m.isMDXComponent=!0}}]);