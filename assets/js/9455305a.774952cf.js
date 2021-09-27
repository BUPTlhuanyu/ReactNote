"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[8685],{3905:function(e,n,t){t.d(n,{Zo:function(){return u},kt:function(){return b}});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function c(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?c(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},c=Object.keys(e);for(r=0;r<c.length;r++)t=c[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)t=c[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=r.createContext({}),s=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=s(e.components);return r.createElement(l.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,c=e.originalType,l=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),d=s(t),b=a,m=d["".concat(l,".").concat(b)]||d[b]||p[b]||c;return t?r.createElement(m,i(i({ref:n},u),{},{components:t})):r.createElement(m,i({ref:n},u))}));function b(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var c=t.length,i=new Array(c);i[0]=d;var o={};for(var l in n)hasOwnProperty.call(n,l)&&(o[l]=n[l]);o.originalType=e,o.mdxType="string"==typeof e?e:a,i[1]=o;for(var s=2;s<c;s++)i[s]=t[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},9234:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return o},contentTitle:function(){return l},metadata:function(){return s},toc:function(){return u},default:function(){return d}});var r=t(7462),a=t(3366),c=(t(7294),t(3905)),i=["components"],o={id:"scheduler-tracing",sidebar_label:"scheduler-tracing",slug:"/react/react/scheduler/others/scheduler-tracing",sidebar_position:2,title:""},l=void 0,s={unversionedId:"react/react/scheduler/others/scheduler-tracing",id:"react/react/scheduler/others/scheduler-tracing",isDocsHomePage:!1,title:"",description:"\u8be5\u6587\u4ef6\u7528\u4e8e\u5b9a\u4e49interactions\uff08\u4ea4\u4e92\u4e8b\u4ef6\u96c6\u5408\uff09\uff0c",source:"@site/docs/react/react/scheduler/others/scheduler\u4e4bTracing.js.md",sourceDirName:"react/react/scheduler/others",slug:"/react/react/scheduler/others/scheduler-tracing",permalink:"/docs/react/react/scheduler/others/scheduler-tracing",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react/scheduler/others/scheduler\u4e4bTracing.js.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{id:"scheduler-tracing",sidebar_label:"scheduler-tracing",slug:"/react/react/scheduler/others/scheduler-tracing",sidebar_position:2,title:""},sidebar:"react",previous:{title:"scheduler-tracing-subscriptions",permalink:"/docs/react/react/scheduler/others/scheduler-tracing-subscriptions"},next:{title:"\u521b\u5efacontainer\u5bf9\u5e94\u7684root",permalink:"/docs/react/react/reconciler/container-root"}},u=[{value:"enableSchedulerTracing\u53d8\u91cf",id:"enableschedulertracing\u53d8\u91cf",children:[]},{value:"\u521d\u59cb\u5316\u53d8\u91cf",id:"\u521d\u59cb\u5316\u53d8\u91cf",children:[]},{value:"unstable_clear",id:"unstable_clear",children:[]},{value:"unstable_getCurrent",id:"unstable_getcurrent",children:[]},{value:"unstable_getThreadID",id:"unstable_getthreadid",children:[]},{value:"unstable_trace",id:"unstable_trace",children:[]},{value:"unstable_wrap",id:"unstable_wrap",children:[]}],p={toc:u};function d(e){var n=e.components,t=(0,a.Z)(e,i);return(0,c.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,c.kt)("p",null,"\u8be5\u6587\u4ef6\u7528\u4e8e\u5b9a\u4e49interactions\uff08\u4ea4\u4e92\u4e8b\u4ef6\u96c6\u5408\uff09\uff0c"),(0,c.kt)("h1",{id:"\u53d8\u91cf"},"\u53d8\u91cf"),(0,c.kt)("h3",{id:"enableschedulertracing\u53d8\u91cf"},"enableSchedulerTracing\u53d8\u91cf"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"// packages\\shared\\ReactFeatureFlags.js\u4e2denableSchedulerTracing = __PROFILE__\n// \u800c\u5728react-master\\scripts\\rollup\\build.js\u4e2d\u627e\u5230\u5982\u4e0b\u4ee3\u7801\uff0c\u8868\u793a\u6784\u5efa\u8fc7\u7a0b\u4e2d\u5168\u5c40__PROFILE__\u7684\u53d6\u503c\n// isProfiling\u8868\u660e\u5904\u4e8eprofile\u72b6\u6001\uff0cisProduction\u8868\u793a\u5728\u751f\u4ea7\u73af\u5883\n// __PROFILE__: isProfiling || !isProduction ? 'true' : 'false'\n// __PROFILE__\u4e3atrue\uff0c\u56e0\u6b64\u8fd9\u91cc\u8ba4\u4e3aenableSchedulerTracing = true\n\nenableSchedulerTracing = true\n")),(0,c.kt)("h3",{id:"\u521d\u59cb\u5316\u53d8\u91cf"},"\u521d\u59cb\u5316\u53d8\u91cf"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"\u9ed8\u8ba4\u7ebf\u7a0bid\uff1aDEFAULT_THREAD_ID\n\u4ea4\u4e92\u4e8b\u4ef6\u6570\u91cf\uff1ainteractionIDCounter\n\u7ebf\u7a0b\u6570\u91cf\uff1athreadIDCounter\n\u5f53\u524d\u4ea4\u4e92\u4e8b\u4ef6\u5f15\u7528\uff1ainteractionsRef\n\u5f53\u524d\u8ba2\u9605\u8005\u5f15\u7528\uff1asubscriberRef\n\nconst DEFAULT_THREAD_ID = 0; \nlet interactionIDCounter = 0;\nlet threadIDCounter = 0;\nlet interactionsRef = {\n        current: new Set()\n    };\nlet subscriberRef = {\n        current: null\n    };\n")),(0,c.kt)("h1",{id:"\u4ea4\u4e92\u4e8b\u4ef6\u96c6\u5408\u65b9\u6cd5"},"\u4ea4\u4e92\u4e8b\u4ef6\u96c6\u5408\u65b9\u6cd5"),(0,c.kt)("h3",{id:"unstable_clear"},"unstable_clear"),(0,c.kt)("p",null,"\u5728\u6267\u884ccallback()\u4e4b\u524d\uff0c\u6e05\u9664interactionsRef.current\u96c6\u5408\uff0c\u6267\u884ccallback()\u4e4b\u540e\uff0c\u8fd8\u539finteractionsRef.current\u7684\u503c"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"export function unstable_clear(callback: Function): any {\n  if (!enableSchedulerTracing) {\n    return callback();\n  }\n\n  const prevInteractions = interactionsRef.current;\n  interactionsRef.current = new Set();\n\n  try {\n    return callback();\n  } finally {\n    interactionsRef.current = prevInteractions;\n  }\n}\n")),(0,c.kt)("h3",{id:"unstable_getcurrent"},"unstable_getCurrent"),(0,c.kt)("p",null,"\u83b7\u53d6interactionsRef.current"),(0,c.kt)("h3",{id:"unstable_getthreadid"},"unstable_getThreadID"),(0,c.kt)("p",null,"\u589e\u52a0\u7ebf\u7a0b\u6570\u91cfthreadIDCounter\uff0c\u5e76\u8fd4\u56de\u9012\u589e\u540e\u7684\u503c"),(0,c.kt)("h3",{id:"unstable_trace"},"unstable_trace"),(0,c.kt)("p",null,"\u8f93\u5165\u53c2\u6570\uff1a"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"  name: string,\n  timestamp: number,\n  callback: Function,\n  threadID: number = DEFAULT_THREAD_ID,\n")),(0,c.kt)("p",null,"\u6d41\u7a0b\uff1a"),(0,c.kt)("ol",null,(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("p",{parentName:"li"},"\u6839\u636e\u4f20\u5165\u7684\u53c2\u6570name\u3001timestamp\uff0c\u4ee5\u53ca\u5f53\u524d\u4ea4\u4e92\u4e8b\u4ef6\u6570\u91cfinteractionIDCounter\u6784\u5efa\u4e00\u4e2ainteraction"),(0,c.kt)("pre",{parentName:"li"},(0,c.kt)("code",{parentName:"pre"},"  const interaction: Interaction = {\n    __count: 1,\n    id: interactionIDCounter++,\n    name,\n    timestamp,\n  };\n"))),(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("p",{parentName:"li"},"\u4fdd\u5b58\u5f53\u524dinteractionsRef.current\u4e3aprevInteractions\uff0c\u5c06\u6784\u5efa\u7684interaction\u6dfb\u52a0\u81f3interactionsRef.current\u96c6\u5408\u4e2d "),(0,c.kt)("pre",{parentName:"li"},(0,c.kt)("code",{parentName:"pre"},"const prevInteractions = interactionsRef.current;\nconst interactions = new Set(prevInteractions);\ninteractions.add(interaction);\ninteractionsRef.current = interactions;\n"))),(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("p",{parentName:"li"},"\u83b7\u53d6\u5f53\u524d\u8ba2\u9605\u8005"),(0,c.kt)("pre",{parentName:"li"},(0,c.kt)("code",{parentName:"pre"},"const subscriber = subscriberRef.current;\n"))),(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("p",{parentName:"li"},"\u7528try...finally\u4fdd\u8bc1\u4f9d\u6b21\u6267\u884c\u5f53\u524d\u8ba2\u9605\u8005\u7684\u4e0b\u5217\u65b9\u6cd5"),(0,c.kt)("p",{parentName:"li"},"scheduler\\src\\TracingSubscriptions.js\u4e2dsubscribers\u8ba2\u9605\u8005\u96c6\u5408\u6240\u6709\u7684subscriber\u90fd\u4f1a\u6267\u884c\u5176subscriber.onInteractionTraced(interaction)"),(0,c.kt)("pre",{parentName:"li"},(0,c.kt)("code",{parentName:"pre"},"subscriber.onInteractionTraced(interaction);\nsubscriber.onWorkStarted(interactions, threadID);\n"))),(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("p",{parentName:"li"},"\u6267\u884c\u4f20\u5165\u7684\u56de\u8c03\u51fd\u6570callback\uff0c\u5f97\u5230\u8fd4\u56de\u503creturnValue"),(0,c.kt)("pre",{parentName:"li"},(0,c.kt)("code",{parentName:"pre"},"returnValue = callback();\n"))),(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("p",{parentName:"li"},"\u6062\u590dinteractionsRef.current"),(0,c.kt)("pre",{parentName:"li"},(0,c.kt)("code",{parentName:"pre"},"interactionsRef.current = prevInteractions;\n"))),(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("p",{parentName:"li"},"\u6267\u884c\u8ba2\u9605\u8005onWorkStopped\u65b9\u6cd5"),(0,c.kt)("pre",{parentName:"li"},(0,c.kt)("code",{parentName:"pre"},"subscriber.onWorkStopped(interactions, threadID);\n"))),(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("p",{parentName:"li"},"\u5c06interaction.__count\u51cf\u5c11\uff0c\u6267\u884csubscriber.onInteractionScheduledWorkCompleted"),(0,c.kt)("pre",{parentName:"li"},(0,c.kt)("code",{parentName:"pre"},"interaction.__count--;\n"))),(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("p",{parentName:"li"},"\u8fd4\u56dereturnValue\n"))),(0,c.kt)("h3",{id:"unstable_wrap"},"unstable_wrap"),(0,c.kt)("p",null,"\u53c2\u6570\uff1a"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"  callback: Function,\n  threadID: number = DEFAULT_THREAD_ID,\n")),(0,c.kt)("p",null,"\u6d41\u7a0b\uff1a"),(0,c.kt)("ol",null,(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("p",{parentName:"li"},"const wrappedInteractions = interactionsRef.current;"),(0,c.kt)("pre",{parentName:"li"},(0,c.kt)("code",{parentName:"pre"},"const wrappedInteractions = interactionsRef.current;\n"))),(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("p",{parentName:"li"},"\u6267\u884csubscriberRef.current\u4e0a\u7684onWorkScheduled\uff0c\u4f7fscheduler\\src\\TracingSubscriptions.js\u4e2dsubscribers\u8ba2\u9605\u8005\u96c6\u5408\u6240\u6709\u7684subscriber\u6267\u884conWorkScheduled\u51fd\u6570 "),(0,c.kt)("pre",{parentName:"li"},(0,c.kt)("code",{parentName:"pre"},"  let subscriber = subscriberRef.current;\n  if (subscriber !== null) {\n    subscriber.onWorkScheduled(wrappedInteractions, threadID);\n  }\n"))),(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("p",{parentName:"li"},"\u6bcf\u4e2ainteraction.__count\u52a0\u4e00"),(0,c.kt)("pre",{parentName:"li"},(0,c.kt)("code",{parentName:"pre"},"  wrappedInteractions.forEach(interaction => {\n    interaction.__count++;\n  });\n"))),(0,c.kt)("li",{parentName:"ol"},(0,c.kt)("p",{parentName:"li"},"\u8fd4\u56de\u4e00\u4e2awrapped\u51fd\u6570\uff0c\u7528\u4e8e\u6267\u884csubscriber\u4e0a\u7684\u51fd\u6570\u3001\u6267\u884c\u4f20\u5165\u7684\u56de\u8c03\u51fd\u6570callback\uff0c\u8fd4\u56dereturnValue\uff0c\u6700\u540e\u6267\u884csubscriber.onInteractionScheduledWorkCompleted\u3002\u5176\u4e2dwrapped.cancel\u7528\u4e8e\u6267\u884csubscriberRef.current.onWorkCanceled\uff0c\u4ee5\u53caonInteractionScheduledWorkCompleted"),(0,c.kt)("pre",{parentName:"li"},(0,c.kt)("code",{parentName:"pre"},"    function wrapped() {\n    const prevInteractions = interactionsRef.current;\n    interactionsRef.current = wrappedInteractions;\n\n    subscriber = subscriberRef.current;\n\n    try {\n      let returnValue;\n\n      try {\n        if (subscriber !== null) {\n          subscriber.onWorkStarted(wrappedInteractions, threadID);\n        }\n      } finally {\n        try {\n          returnValue = callback.apply(undefined, arguments);\n        } finally {\n          interactionsRef.current = prevInteractions;\n\n          if (subscriber !== null) {\n            subscriber.onWorkStopped(wrappedInteractions, threadID);\n          }\n        }\n      }\n\n      return returnValue;\n    } finally {\n      if (!hasRun) {\n        // We only expect a wrapped function to be executed once,\n        // But in the event that it's executed more than once\u2013\n        // Only decrement the outstanding interaction counts once.\n        hasRun = true;\n\n        // Update pending async counts for all wrapped interactions.\n        // If this was the last scheduled async work for any of them,\n        // Mark them as completed.\n        wrappedInteractions.forEach(interaction => {\n          interaction.__count--;\n\n          if (subscriber !== null && interaction.__count === 0) {\n            subscriber.onInteractionScheduledWorkCompleted(interaction);\n          }\n        });\n      }\n    }\n  }\n\n  //  \u7528\u4e8e\u53d6\u6d88subscriber\u4e0a\u8ba2\u9605\u7684wrappedInteractions\n  //  \u6bcf\u4e2ainteraction.__count\u51cf\u4e00\n  wrapped.cancel = function cancel() {\n    subscriber = subscriberRef.current;\n\n    try {\n      if (subscriber !== null) {\n        subscriber.onWorkCanceled(wrappedInteractions, threadID);\n      }\n    } finally {\n      // Update pending async counts for all wrapped interactions.\n      // If this was the last scheduled async work for any of them,\n      // Mark them as completed.\n      wrappedInteractions.forEach(interaction => {\n        interaction.__count--;\n\n        if (subscriber && interaction.__count === 0) {\n          subscriber.onInteractionScheduledWorkCompleted(interaction);\n        }\n      });\n    }\n  };\n")))))}d.isMDXComponent=!0}}]);