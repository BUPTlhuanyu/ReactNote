"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[4937],{3905:function(e,r,t){t.d(r,{Zo:function(){return l},kt:function(){return p}});var n=t(7294);function c(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function s(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function u(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?s(Object(t),!0).forEach((function(r){c(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,c=function(e,r){if(null==e)return{};var t,n,c={},s=Object.keys(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||(c[t]=e[t]);return c}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(c[t]=e[t])}return c}var o=n.createContext({}),a=function(e){var r=n.useContext(o),t=r;return e&&(t="function"==typeof e?e(r):u(u({},r),e)),t},l=function(e){var r=a(e.components);return n.createElement(o.Provider,{value:r},e.children)},b={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,c=e.mdxType,s=e.originalType,o=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),d=a(t),p=c,f=d["".concat(o,".").concat(p)]||d[p]||b[p]||s;return t?n.createElement(f,u(u({ref:r},l),{},{components:t})):n.createElement(f,u({ref:r},l))}));function p(e,r){var t=arguments,c=r&&r.mdxType;if("string"==typeof e||c){var s=t.length,u=new Array(s);u[0]=d;var i={};for(var o in r)hasOwnProperty.call(r,o)&&(i[o]=r[o]);i.originalType=e,i.mdxType="string"==typeof e?e:c,u[1]=i;for(var a=2;a<s;a++)u[a]=t[a];return n.createElement.apply(null,u)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},3034:function(e,r,t){t.r(r),t.d(r,{assets:function(){return l},contentTitle:function(){return o},default:function(){return p},frontMatter:function(){return i},metadata:function(){return a},toc:function(){return b}});var n=t(3117),c=t(102),s=(t(7294),t(3905)),u=["components"],i={id:"scheduler-tracing-subscriptions",sidebar_label:"scheduler-tracing-subscriptions",slug:"/react/react/scheduler/others/scheduler-tracing-subscriptions",sidebar_position:3,title:""},o=void 0,a={unversionedId:"react/react/scheduler/others/scheduler-tracing-subscriptions",id:"react/react/scheduler/others/scheduler-tracing-subscriptions",title:"",description:"\u8ba2\u9605\u8005\u5bf9\u8c61\u76f8\u5173\u5b9a\u4e49\uff0c\u8be5js\u811a\u672c\u7528\u4e8e\u5b9a\u4e49subscriberRef.current\u4ee5\u53ca\u6dfb\u52a0\u5220\u9664subscribers\u96c6\u5408\u3002",source:"@site/docs/react/react/scheduler/others/scheduler\u4e4bTracingSubscriptions.js.md",sourceDirName:"react/react/scheduler/others",slug:"/react/react/scheduler/others/scheduler-tracing-subscriptions",permalink:"/ReactNote/docs/react/react/scheduler/others/scheduler-tracing-subscriptions",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react/scheduler/others/scheduler\u4e4bTracingSubscriptions.js.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{id:"scheduler-tracing-subscriptions",sidebar_label:"scheduler-tracing-subscriptions",slug:"/react/react/scheduler/others/scheduler-tracing-subscriptions",sidebar_position:3,title:""},sidebar:"react",previous:{title:"scheduler-code-details",permalink:"/ReactNote/docs/react/react/scheduler/others/scheduler-code-details"},next:{title:"scheduler-tracing",permalink:"/ReactNote/docs/react/react/scheduler/others/scheduler-tracing"}},l={},b=[{value:"subscribers\u521d\u59cb\u5316\u4e3a\u7a7a\u96c6\u5408",id:"subscribers\u521d\u59cb\u5316\u4e3a\u7a7a\u96c6\u5408",level:3},{value:"unstable_subscribe",id:"unstable_subscribe",level:3},{value:"unstable_unsubscribe",id:"unstable_unsubscribe",level:3},{value:"__subscriberRef.current\u4e0a\u5b9a\u4e49\u7684\u65b9\u6cd5",id:"__subscriberrefcurrent\u4e0a\u5b9a\u4e49\u7684\u65b9\u6cd5",level:3}],d={toc:b};function p(e){var r=e.components,t=(0,c.Z)(e,u);return(0,s.kt)("wrapper",(0,n.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"\u8ba2\u9605\u8005\u5bf9\u8c61\u76f8\u5173\u5b9a\u4e49\uff0c\u8be5js\u811a\u672c\u7528\u4e8e\u5b9a\u4e49__subscriberRef.current\u4ee5\u53ca\u6dfb\u52a0\u5220\u9664subscribers\u96c6\u5408\u3002"),(0,s.kt)("h3",{id:"subscribers\u521d\u59cb\u5316\u4e3a\u7a7a\u96c6\u5408"},"subscribers\u521d\u59cb\u5316\u4e3a\u7a7a\u96c6\u5408"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre"},"subscribers = new Set();\n")),(0,s.kt)("h3",{id:"unstable_subscribe"},"unstable_subscribe"),(0,s.kt)("p",null,"\u6dfb\u52a0subscriber\u5230subscribers\u96c6\u5408\uff0c\u5982\u679csubscribers\u96c6\u5408\u53ea\u6709\u521a\u6dfb\u52a0\u7684subscriber\uff0c\u5219\u5c06__subscriberRef.current\u6784\u5efa\u6210\u4e00\u4e2a\u5bf9\u8c61\uff0c\u5e76\u6dfb\u52a0\u4e00\u4e9b\u65b9\u6cd5\u3002"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre"},"export function unstable_subscribe(subscriber: Subscriber): void {\n  if (enableSchedulerTracing) {\n    subscribers.add(subscriber);\n\n    if (subscribers.size === 1) {\n      __subscriberRef.current = {\n        onInteractionScheduledWorkCompleted,\n        onInteractionTraced,\n        onWorkCanceled,\n        onWorkScheduled,\n        onWorkStarted,\n        onWorkStopped,\n      };\n    }\n  }\n}\n")),(0,s.kt)("h3",{id:"unstable_unsubscribe"},"unstable_unsubscribe"),(0,s.kt)("p",null,"\u5220\u9664subscribers\u96c6\u5408\u4e2d\u6307\u5b9a\u7684subscriber\uff0c\u5982\u679c\u96c6\u5408\u4e3a\u7a7a\uff0c\u5219__subscriberRef.current = null"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre"},"export function unstable_unsubscribe(subscriber: Subscriber): void {\n  if (enableSchedulerTracing) {\n    subscribers.delete(subscriber);\n\n    if (subscribers.size === 0) {\n      __subscriberRef.current = null;\n    }\n  }\n}\n")),(0,s.kt)("h3",{id:"__subscriberrefcurrent\u4e0a\u5b9a\u4e49\u7684\u65b9\u6cd5"},"__subscriberRef.current\u4e0a\u5b9a\u4e49\u7684\u65b9\u6cd5"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre"},"onInteractionScheduledWorkCompleted,\nonInteractionTraced,\nonWorkCanceled,\nonWorkScheduled,\nonWorkStarted,\nonWorkStopped,\n")),(0,s.kt)("p",null,"\u5f53\u6267\u884c__subscriberRef.current\u67d0\u4e2a\u65b9\u6cd5\u65f6\uff0csubscribers\u96c6\u5408\u4e2d\u6240\u6709\u7684subscriber\u90fd\u4f1a\u6267\u884c\u8fd9\u4e2a\u65b9\u6cd5\u3002\u5982\u4e0b\uff1a"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre"},"function onInteractionTraced(interaction: Interaction): void {\n  let didCatchError = false;\n  let caughtError = null;\n\n  //\u4e3a\u4e86\u4e0d\u6253\u65adforEach\uff0c\u8bbe\u7f6edidCatchError\u4e0ecaughtError\n  subscribers.forEach(subscriber => {\n    try {\n      subscriber.onInteractionTraced(interaction);\n    } catch (error) {\n      //\u8bb0\u5f55\u7b2c\u4e00\u4e2a\u53d1\u751f\u9519\u8bef\u7684\u4fe1\u606f\n      if (!didCatchError) {\n        didCatchError = true;\n        caughtError = error;\n      }\n    }\n  });\n\n  if (didCatchError) {\n    throw caughtError;\n  }\n}\n")),(0,s.kt)("p",null,"\u6ce8\u610f\uff1aforEach\u4e2dtry...catch\u5c06\u7b2c\u4e00\u4e2a\u9519\u8bef\u5b58\u50a8\u4e0b\u6765\u4e4b\u540e\uff0c\u4e0d\u4f1a\u76f4\u63a5throw\uff0c\u4ee5\u514d\u6253\u65adforEach\u5bfc\u81f4\u5176\u4ed6subscriber\u4e0d\u6267\u884c\u5176\u76f8\u5e94\u7684\u65b9\u6cd5\u3002"))}p.isMDXComponent=!0}}]);