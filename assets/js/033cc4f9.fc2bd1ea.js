"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[4993],{3905:function(e,n,t){t.d(n,{Zo:function(){return s},kt:function(){return d}});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var p=r.createContext({}),i=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):c(c({},n),e)),t},s=function(e){var n=i(e.components);return r.createElement(p.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),m=i(t),d=o,y=m["".concat(p,".").concat(d)]||m[d]||u[d]||a;return t?r.createElement(y,c(c({ref:n},s),{},{components:t})):r.createElement(y,c({ref:n},s))}));function d(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,c=new Array(a);c[0]=m;var l={};for(var p in n)hasOwnProperty.call(n,p)&&(l[p]=n[p]);l.originalType=e,l.mdxType="string"==typeof e?e:o,c[1]=l;for(var i=2;i<a;i++)c[i]=t[i];return r.createElement.apply(null,c)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},56:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return l},contentTitle:function(){return p},metadata:function(){return i},toc:function(){return s},default:function(){return m}});var r=t(7462),o=t(3366),a=(t(7294),t(3905)),c=["components"],l={id:"react-fiber-lazy-component",sidebar_label:"ReactFiberLazyComponent",slug:"/react/react/reconciler/react-fiber-lazy-component",sidebar_position:9,title:""},p="ReactFiberLazyComponent",i={unversionedId:"react/react/reconciler/react-fiber-lazy-component",id:"react/react/reconciler/react-fiber-lazy-component",isDocsHomePage:!1,title:"",description:"\u6267\u884cReact.lazy()\u8fd4\u56de\u4e00\u4e2aLazyComponent\u4e4b\u540e\uff0c\u5bf9LazyComponent\u6267\u884c\u52a8\u6001\u5bfc\u5165\u7ec4\u4ef6\u7684\u903b\u8f91\u3002",source:"@site/docs/react/react/reconciler/ReactFiberLazyComponent.md",sourceDirName:"react/react/reconciler",slug:"/react/react/reconciler/react-fiber-lazy-component",permalink:"/docs/react/react/reconciler/react-fiber-lazy-component",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react/reconciler/ReactFiberLazyComponent.md",tags:[],version:"current",sidebarPosition:9,frontMatter:{id:"react-fiber-lazy-component",sidebar_label:"ReactFiberLazyComponent",slug:"/react/react/reconciler/react-fiber-lazy-component",sidebar_position:9,title:""},sidebar:"react",previous:{title:"\u591a\u6b21\u6267\u884csetState\u7684\u66f4\u65b0\u673a\u5236",permalink:"/docs/react/react/reconciler/multi-setstate"},next:{title:"\u5f85\u6574\u7406\u6d41\u7a0b",permalink:"/docs/react/react/reconciler/todo-list"}},s=[{value:"\u6e90\u7801",id:"\u6e90\u7801",children:[]}],u={toc:s};function m(e){var n=e.components,t=(0,o.Z)(e,c);return(0,a.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"reactfiberlazycomponent"},"ReactFiberLazyComponent"),(0,a.kt)("p",null,"\u6267\u884cReact.lazy()\u8fd4\u56de\u4e00\u4e2aLazyComponent\u4e4b\u540e\uff0c\u5bf9LazyComponent\u6267\u884c\u52a8\u6001\u5bfc\u5165\u7ec4\u4ef6\u7684\u903b\u8f91\u3002"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"readLazyComponentType\u51fd\u6570\u7528\u4e8e\u5728\u7ec4\u4ef6\u6e32\u67d3\u7684\u65f6\u5019\uff0c\u83b7\u53d6LazyComponent\u5e94\u8be5\u5448\u73b0\u4ec0\u4e48\u7ec4\u4ef6"),(0,a.kt)("li",{parentName:"ul"},"resolveDefaultProps\u51fd\u6570\u7528\u4e8e\u5904\u7406\u4f20\u5165\u7ec4\u4ef6\u7684defaultProps")),(0,a.kt)("h3",{id:"\u6e90\u7801"},"\u6e90\u7801"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"import type {LazyComponent, Thenable} from 'shared/ReactLazyComponent';\n\n//LazyComponent\u7684\u4e09\u4e2a\u72b6\u6001\uff0cnumber\u7c7b\u578b\uff0c\u5206\u522b\u4e3aPending = 0;Resolved = 1;Rejected = 2;\nimport {Resolved, Rejected, Pending} from 'shared/ReactLazyComponent';\nimport warning from 'shared/warning';\n\n//\u4f20\u5165\u53c2\u6570\uff1aComponent\uff0c baseProps\n//\u6d45\u590d\u5236baseProps\u4e3aprops\uff0c\u5e76\u5c06\u7ec4\u4ef6\u9ed8\u8ba4\u7684defaultProps\u8d4b\u503c\u7ed9props\u4e2d\u4e3aundefined\u7684\u5c5e\u6027\u4e0a\nexport function resolveDefaultProps(Component: any, baseProps: Object): Object {\n  if (Component && Component.defaultProps) {\n    // Resolve default props. Taken from ReactElement\n    const props = Object.assign({}, baseProps);\n    const defaultProps = Component.defaultProps;\n    for (let propName in defaultProps) {\n      if (props[propName] === undefined) {\n        props[propName] = defaultProps[propName];\n      }\n    }\n    return props;\n  }\n  return baseProps;\n}\n\n//\u6839\u636elazyComponent\u7684\u72b6\u6001\u8fd4\u56de\u5b9a\u4e49\u7684\u7ec4\u4ef6\n//lazyComponent\u4e3a\u7ecf\u8fc7React.lazy()\u8fd4\u56de\u7684\u7ec4\u4ef6\n//lazyComponent._status\u8868\u793alazyComponent\u5f53\u524d\u7684\u72b6\u6001\n//lazyComponent._result\u6839\u636elazyComponent\u5f53\u524d\u7684\u72b6\u6001\u4f1a\u5f97\u5230\u4e0d\u540c\u7684\u503c\uff1a\n// Rejected\u8868\u793a\u52a8\u6001\u5bfc\u5165\u5931\u8d25\uff0c_result\u4e3aerror\n// Resolved\u8868\u793a\u52a8\u6001\u5bfc\u5165\u6210\u529f,_result\u4e3a\u52a8\u6001import\u5f97\u5230\u7684\u7ec4\u4ef6\n// Pending\u8868\u793a\u52a8\u6001\u5bfc\u5165\u6b63\u5728\u8fdb\u884c\u4e2d\uff0c_result\u4e3a\u4e00\u4e2apromise\nexport function readLazyComponentType<T>(lazyComponent: LazyComponent<T>): T {\n  const status = lazyComponent._status;\n  const result = lazyComponent._result;\n  switch (status) {\n    case Resolved: {\n      const Component: T = result;\n      return Component;\n    }\n    case Rejected: {\n      const error: mixed = result;\n      throw error;\n    }\n    case Pending: {\n      const thenable: Thenable<T, mixed> = result;\n      throw thenable;\n    }\n    //\u5728\u521d\u59cb\u72b6\u6001\u4e0bstatus=-1\n    default: {\n      // \u8bbe\u7f6elazyComponent\u72b6\u6001\u4e3a\u6b63\u5728\u83b7\u53d6\u52a8\u6001\u5bfc\u5165\u7ec4\u4ef6\n      lazyComponent._status = Pending;\n      // lazyComponent._ctor\u8868\u793a\u83b7\u53d6lazyComponent\u52a8\u6001\u5bfc\u5165\u903b\u8f91\u51fd\u6570\uff0c\u5982() => import('./SomeComponent')\n      const ctor = lazyComponent._ctor;\n      // \u6267\u884c\u52a8\u6001\u5bfc\u5165\u903b\u8f91\u51fd\u6570\uff0c\u8fd4\u56de\u4e00\u4e2apromise\uff0cthenable\u76f8\u5f53\u4e8eimport('./SomeComponent')\n      const thenable = ctor();\n      //\u5f02\u6b65\u83b7\u53d6\n      thenable.then(\n        //  moduleObject\u4e3aresolve\u8fd4\u56de\u7684\u503c\uff0c\u4e00\u4e2a\u7ec4\u4ef6\n        moduleObject => {\n          if (lazyComponent._status === Pending) {\n            const defaultExport = moduleObject.default;\n            if (__DEV__) {\n              if (defaultExport === undefined) {\n                warning(\n                  false,\n                  'lazy: Expected the result of a dynamic import() call. ' +\n                    'Instead received: %s\\n\\nYour code should look like: \\n  ' +\n                    \"const MyComponent = lazy(() => import('./MyComponent'))\",\n                  moduleObject,\n                );\n              }\n            }\n            lazyComponent._status = Resolved;\n            lazyComponent._result = defaultExport;\n          }\n        },\n        error => {\n          if (lazyComponent._status === Pending) {\n            lazyComponent._status = Rejected;\n            lazyComponent._result = error;\n          }\n        },\n      );\n      //\u5728\u5f02\u6b65\u8fd4\u56de\u4e4b\u524dlazyComponent._result = thenable\u662f\u4e00\u4e2apromise\n      lazyComponent._result = thenable;\n      throw thenable;\n    }\n  }\n}\n")))}m.isMDXComponent=!0}}]);