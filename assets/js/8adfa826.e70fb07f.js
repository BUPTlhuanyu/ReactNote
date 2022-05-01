"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[7738],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),l=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p=function(e){var t=l(e.components);return a.createElement(i.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,p=u(e,["components","mdxType","originalType","parentName"]),d=l(n),m=r,h=d["".concat(i,".").concat(m)]||d[m]||s[m]||o;return n?a.createElement(h,c(c({ref:t},p),{},{components:n})):a.createElement(h,c({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,c=new Array(o);c[0]=d;var u={};for(var i in t)hasOwnProperty.call(t,i)&&(u[i]=t[i]);u.originalType=e,u.mdxType="string"==typeof e?e:r,c[1]=u;for(var l=2;l<o;l++)c[l]=n[l];return a.createElement.apply(null,c)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},6333:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return i},default:function(){return m},frontMatter:function(){return u},metadata:function(){return l},toc:function(){return s}});var a=n(3117),r=n(102),o=(n(7294),n(3905)),c=["components"],u={id:"react-node-update-queue",sidebar_label:"ReactNoopUpdateQueue",slug:"/react/react/ReactElement/others/react-node-update-queue",sidebar_position:7,title:""},i=void 0,l={unversionedId:"react/react/ReactElement/others/react-node-update-queue",id:"react/react/ReactElement/others/react-node-update-queue",title:"",description:"ReactNoopUpdateQueue.js",source:"@site/docs/react/react/ReactElement/others/ReactNoopUpdateQueue.md",sourceDirName:"react/react/ReactElement/others",slug:"/react/react/ReactElement/others/react-node-update-queue",permalink:"/ReactNote/docs/react/react/ReactElement/others/react-node-update-queue",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react/ReactElement/others/ReactNoopUpdateQueue.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{id:"react-node-update-queue",sidebar_label:"ReactNoopUpdateQueue",slug:"/react/react/ReactElement/others/react-node-update-queue",sidebar_position:7,title:""},sidebar:"react",previous:{title:"ReactElementValidator",permalink:"/ReactNote/docs/react/react/ReactElement/others/react-element-validator"},next:{title:"Ref-Context-Lazy-forwardRef-memo",permalink:"/ReactNote/docs/react/react/ReactElement/others/react-others"}},p={},s=[{value:"ReactNoopUpdateQueue.js",id:"reactnoopupdatequeuejs",level:3},{value:"warnNoop\u51fd\u6570",id:"warnnoop\u51fd\u6570",level:3},{value:"ReactNoopUpdateQueue\u7c7b:\u66f4\u65b0\u961f\u5217\u7684\u62bd\u8c61\u7c7b",id:"reactnoopupdatequeue\u7c7b\u66f4\u65b0\u961f\u5217\u7684\u62bd\u8c61\u7c7b",level:3}],d={toc:s};function m(e){var t=e.components,n=(0,r.Z)(e,c);return(0,o.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h3",{id:"reactnoopupdatequeuejs"},"ReactNoopUpdateQueue.js"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"export  *ReactNoopUpdateQueue\u62bd\u8c61\u7c7b*\n")),(0,o.kt)("hr",null),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"//\u7528\u4e8e\u8f93\u51fa\u62a5\u9519\u4fe1\u606f\nimport warningWithoutStack from 'shared/warningWithoutStack';\n\n//\u5b58\u50a8\u7ec4\u4ef6\u8fd8\u6ca1\u6302\u8f7d\u7684\u65f6\u5019\u72b6\u6001\u66f4\u65b0\u51fa\u73b0\u7684\u9519\u8bef\u662f\u5426\u5df2\u7ecf\u663e\u793a\u9519\u8bef\u7684\u6807\u5fd7\nconst didWarnStateUpdateForUnmountedComponent = {};\n")),(0,o.kt)("h3",{id:"warnnoop\u51fd\u6570"},"warnNoop\u51fd\u6570"),(0,o.kt)("p",null,"\u6839\u636e\u4f20\u5165publicInstance\u4ee5\u53cacallerName\uff0c\u751f\u6210warningKey\u3002\n\u5982\u679cdidWarnStateUpdateForUnmountedComponent","[warningKey]","\u4e3atrue\u8868\u793a\u5df2\u7ecf\u62a5\u9519\uff0c\u76f4\u63a5\u8df3\u8fc7\u3002\n\u4e3afalse\uff0c\u5219\u663e\u793a\u9519\u8bef\u4fe1\u606f\uff0c\u5e76\u6807\u8bb0didWarnStateUpdateForUnmountedComponent","[warningKey]","\u4e3atrue\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"function warnNoop(publicInstance, callerName) {\n  //\u5728\u5f00\u53d1\u6a21\u5f0f\u4e0b\u6267\u884c\n  if (__DEV__) {\n    //\u83b7\u53d6\u7ec4\u4ef6\u540d\uff0c\u901a\u8fc7\u5b9e\u4f8b\u7684\u6784\u9020\u51fd\u6570\u6765\u83b7\u53d6\uff0c\u5982\u679c\u4e0d\u5b58\u5728\uff0c\u90a3\u4e48\u6784\u9020\u51fd\u6570\u5c31\u662fReactClass\u3002\n    const constructor = publicInstance.constructor;\n    const componentName =\n      (constructor && (constructor.displayName || constructor.name)) ||\n      'ReactClass';\n    //\u5173\u952e\u8bcd\u5c31\u662f\u7ec4\u4ef6\u540d.\u56de\u8c03\u51fd\u6570\u540d\uff0c\u4e5f\u5c31\u662f\u4e0b\u9762\u7684\u66f4\u65b0\u961f\u5217\u7684\u62bd\u8c61\u7c7b\u7684\u5c5e\u6027\u65b9\u6cd5\u540d\n    const warningKey = `${componentName}.${callerName}`;\n    //\u5982\u679cdidWarnStateUpdateForUnmountedComponent\u5b58\u50a8\u7ec4\u4ef6\u8fd8\u6ca1\u6302\u8f7d\u7684\u65f6\u5019\u72b6\u6001\u66f4\u65b0\u51fa\u73b0\u7684\u9519\u8bef\n    // \u5982\u679c\u5df2\u7ecf\u5b58\u5728\u4e86\u8fd9\u4e2a\u9519\u8bef\uff0c\u76f4\u63a5\u8fd4\u56de\uff0c\u4e0d\u9700\u8981\u6267\u884c\u4e0b\u9762\u7684\u9519\u8bef\u63d0\u793a\u4ee5\u53ca\u5b58\u50a8\u76f8\u5e94\u7684\u9519\u8bef\u6807\u8bb0\u3002\n    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {\n      return;\n    }\n    //\u8be5\u65b9\u6cd5\u7684\u4f5c\u7528\uff1a\u4e00\u76f4\u62a5\u9519\uff0c\u5e76\u663e\u793a\u9519\u8bef\u4fe1\u606f\n    warningWithoutStack(\n      false,\n      \"Can't call %s on a component that is not yet mounted. \" +\n        'This is a no-op, but it might indicate a bug in your application. ' +\n        'Instead, assign to `this.state` directly or define a `state = {};` ' +\n        'class property with the desired state in the %s component.',\n      callerName,\n      componentName,\n    );\n    //\u5c06\u8be5\u7c7b\u578b\u7684\u9519\u8bef\u6807\u8bb0\u4e3atrue\n    didWarnStateUpdateForUnmountedComponent[warningKey] = true;\n  }\n}\n")),(0,o.kt)("h3",{id:"reactnoopupdatequeue\u7c7b\u66f4\u65b0\u961f\u5217\u7684\u62bd\u8c61\u7c7b"},"ReactNoopUpdateQueue\u7c7b:\u66f4\u65b0\u961f\u5217\u7684\u62bd\u8c61\u7c7b"),(0,o.kt)("p",null,"\u5728\u6ca1\u6709\u91cd\u8f7d\u62bd\u8c61\u7c7b\u7684\u65b9\u6cd5\u65f6\u4e00\u76f4\u62a5\u9519\u3002\n\u8be5\u7c7b\u4e00\u89c8\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"const ReactNoopUpdateQueue = {\n    isMounted\uff1aFunction\uff0c// \u68c0\u67e5\u4f20\u5165\u7ec4\u4ef6\u662f\u5426\u6302\u8f7d\n    enqueueForceUpdate\uff1aFunction\uff0c//\u5f3a\u5236\u66f4\u65b0\n    enqueueReplaceState\uff1aFunction\uff0c//\u66ff\u6362\u6240\u6709\u7684state\n    enqueueSetState\uff1aFunction //\u66f4\u65b0state\n}\n")),(0,o.kt)("p",null,"\u8be6\u7ec6\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"const ReactNoopUpdateQueue = {\n  /**\n   * Checks whether or not this composite component is mounted.\n   * \u68c0\u67e5\u8fd9\u4e2a\u7ec4\u4ef6\u662f\u5426\u6302\u8f7d\uff0c\u5982\u679c\u6ca1\u6709\u6539\u5199isMounted\u5219\u8fd4\u56defalse\n   * @param {ReactClass} publicInstance The instance we want to test.\n   * @return {boolean} True if mounted, false otherwise.\n   * @protected\n   * @final\n   */\n  isMounted: function(publicInstance) {\n    return false;\n  },\n\n  /**\n   * Forces an update. This should only be invoked when it is known with\n   * certainty that we are **not** in a DOM transaction.\n   *\n   * You may want to call this when you know that some deeper aspect of the\n   * component's state has changed but `setState` was not called.\n   * \u5f53\u7ec4\u4ef6\u72b6\u6001\u7684\u67d0\u4e9b\u66f4\u6df1\u5c42\u6b21\u7684\u65b9\u9762\u5df2\u7ecf\u66f4\u6539\uff0c\u4f46\u6ca1\u6709\u8c03\u7528\u201csetState\u201d\u65f6\uff0c\u53ef\u80fd\u9700\u8981\u8c03\u7528\u5b83\u3002\n   *\n   * This will not invoke `shouldComponentUpdate`, but it will invoke\n   * `componentWillUpdate` and `componentDidUpdate`.\n   * \u8fd9\u4e2a\u51fd\u6570\u4e0d\u4f1a\u8c03\u7528shouldComponentUpdate\uff0c\u4f46\u662f\u4f1a\u8c03\u7528componentWillUpdate\u548ccomponentDidUpdate\n   *\n   * @param {ReactClass} publicInstance The instance that should rerender.\n   * @param {?function} callback Called after component is updated.\n   * @param {?string} callerName name of the calling function in the public API.\n   * @internal\n   */\n  enqueueForceUpdate: function(publicInstance, callback, callerName) {\n    warnNoop(publicInstance, 'forceUpdate');\n  },\n\n  /**\n   * Replaces all of the state. Always use this or `setState` to mutate state.\n   * You should treat `this.state` as immutable.\n   * \u66ff\u6362\u6240\u6709\u72b6\u6001\u3002\u603b\u662f\u4f7f\u7528\u8fd9\u4e2a\u6216\u201cSESTATE\u201d\u6765\u6539\u53d8\u72b6\u6001\u3002\u4f60\u5e94\u8be5\u628a\u8fd9\u4e2a\u201c\u72b6\u6001\u201d\u770b\u4f5c\u662f\u4e0d\u53ef\u53d8\u7684\u3002\n   *\n   * There is no guarantee that `this.state` will be immediately updated, so\n   * accessing `this.state` after calling this method may return the old value.\n   * \u8fd9\u91cc\u4e0d\u4f1a\u4fdd\u8bc1this.state\u7acb\u5373\u66f4\u65b0\uff0c\u5728\u8c03\u7528\u8fd9\u4e2a\u65b9\u6cd5\u4e4b\u540e\u7acb\u5373\u83b7\u53d6\u8fd9\u4e2a\u503c\u53ef\u80fd\u4f1a\u662f\u4e4b\u524d\u7684\u503c\n   *\n   * @param {ReactClass} publicInstance The instance that should rerender.\n   * @param {object} completeState Next state.\n   * @param {?function} callback Called after component is updated.\n   * @param {?string} callerName name of the calling function in the public API.\n   * @internal\n   */\n  enqueueReplaceState: function(\n    publicInstance,\n    completeState,\n    callback,\n    callerName,\n  ) {\n    warnNoop(publicInstance, 'replaceState');\n  },\n\n  /**\n   * Sets a subset of the state. This only exists because _pendingState is\n   * internal. This provides a merging strategy that is not available to deep\n   * properties which is confusing. TODO: Expose pendingState or don't use it\n   * during the merge.\n   *\n   * @param {ReactClass} publicInstance The instance that should rerender.\n   * @param {object} partialState Next partial state to be merged with state.\n   * @param {?function} callback Called after component is updated.\n   * @param {?string} Name of the calling function in the public API.\n   * @internal\n   */\n  enqueueSetState: function(\n    publicInstance,\n    partialState,\n    callback,\n    callerName,\n  ) {\n    warnNoop(publicInstance, 'setState');\n  },\n};\n")))}m.isMDXComponent=!0}}]);