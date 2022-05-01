"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[9215],{3905:function(e,t,r){r.d(t,{Zo:function(){return l},kt:function(){return h}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},c=Object.keys(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var i=n.createContext({}),p=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},l=function(e){var t=p(e.components);return n.createElement(i.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,c=e.originalType,i=e.parentName,l=u(e,["components","mdxType","originalType","parentName"]),d=p(r),h=o,f=d["".concat(i,".").concat(h)]||d[h]||s[h]||c;return r?n.createElement(f,a(a({ref:t},l),{},{components:r})):n.createElement(f,a({ref:t},l))}));function h(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var c=r.length,a=new Array(c);a[0]=d;var u={};for(var i in t)hasOwnProperty.call(t,i)&&(u[i]=t[i]);u.originalType=e,u.mdxType="string"==typeof e?e:o,a[1]=u;for(var p=2;p<c;p++)a[p]=r[p];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},6215:function(e,t,r){r.r(t),r.d(t,{assets:function(){return l},contentTitle:function(){return i},default:function(){return h},frontMatter:function(){return u},metadata:function(){return p},toc:function(){return s}});var n=r(3117),o=r(102),c=(r(7294),r(3905)),a=["components"],u={id:"react-router-route",sidebar_label:"route",slug:"/react/react-router/others/react-router-route",sidebar_position:2,title:""},i=void 0,p={unversionedId:"react/react-router/others/react-router-route",id:"react/react-router/others/react-router-route",title:"",description:"Route",source:"@site/docs/react/react-router/others/react-router4\u6e90\u7801\u6d45\u6790(\u4e8c) \uff1aRoute.md",sourceDirName:"react/react-router/others",slug:"/react/react-router/others/react-router-route",permalink:"/ReactNote/docs/react/react-router/others/react-router-route",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react-router/others/react-router4\u6e90\u7801\u6d45\u6790(\u4e8c) \uff1aRoute.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{id:"react-router-route",sidebar_label:"route",slug:"/react/react-router/others/react-router-route",sidebar_position:2,title:""},sidebar:"react",previous:{title:"matchPath",permalink:"/ReactNote/docs/react/react-router/others/react-router-matchpath"},next:{title:"BrowserRouter&&HashRouter",permalink:"/ReactNote/docs/react/react-router/others/react-router-browser-hash-router"}},l={},s=[{value:"Route",id:"route",level:2},{value:"\u4f7f\u7528",id:"\u4f7f\u7528",level:3},{value:"\u7528Route\u6e32\u67d3\u7ec4\u4ef6\u7684\u4e09\u79cd\u65b9\u5f0f\uff1a",id:"\u7528route\u6e32\u67d3\u7ec4\u4ef6\u7684\u4e09\u79cd\u65b9\u5f0f",level:5},{value:"Route\u81ea\u52a8\u4f20\u5165\u7684Porps\uff1a",id:"route\u81ea\u52a8\u4f20\u5165\u7684porps",level:5},{value:"Route\u81ea\u5b9a\u4e49Porps",id:"route\u81ea\u5b9a\u4e49porps",level:5},{value:"\u6e90\u7801\u5206\u6790",id:"\u6e90\u7801\u5206\u6790",level:3}],d={toc:s};function h(e){var t=e.components,r=(0,o.Z)(e,a);return(0,c.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,c.kt)("h2",{id:"route"},"Route"),(0,c.kt)("h3",{id:"\u4f7f\u7528"},"\u4f7f\u7528"),(0,c.kt)("h5",{id:"\u7528route\u6e32\u67d3\u7ec4\u4ef6\u7684\u4e09\u79cd\u65b9\u5f0f"},"\u7528Route\u6e32\u67d3\u7ec4\u4ef6\u7684\u4e09\u79cd\u65b9\u5f0f\uff1a"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"<Route component>\n<Route render>\n<Route children>\n")),(0,c.kt)("p",null,"\u4f18\u5148\u7ea7\u4ece\u4f4e\u5230\u9ad8\u3002"),(0,c.kt)("h5",{id:"route\u81ea\u52a8\u4f20\u5165\u7684porps"},"Route\u81ea\u52a8\u4f20\u5165\u7684Porps\uff1a"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},"match\nlocation\nhistory\n")),(0,c.kt)("h5",{id:"route\u81ea\u5b9a\u4e49porps"},"Route\u81ea\u5b9a\u4e49Porps"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},'sensitive\uff1a \u5bf9path\u5927\u5c0f\u5199\u654f\u611f\nstrict   \uff1a \u5bf9path\u4e2d\u7684"/"\u654f\u611f\nexact    \uff1a \u5bf9path\u7cbe\u786e\u5339\u914d\npath     \uff1a \u8def\u5f84\u5339\u914d\nlocation \uff1a \u53ef\u7528\u4e8eroute\u5207\u6362\u7684\u8fc7\u6e21\u52a8\u753b\n')),(0,c.kt)("h3",{id:"\u6e90\u7801\u5206\u6790"},"\u6e90\u7801\u5206\u6790"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre"},'class Route extends React.Component {\n  render() {\n    return (\n      <RouterContext.Consumer>\n        {context => {\n          invariant(context, "You should not use <Route> outside a <Router>");\n\n          const location = this.props.location || context.location;\n          const match = this.props.computedMatch\n            ? this.props.computedMatch // <Switch> already computed the match for us\n            : this.props.path\n              ? matchPath(location.pathname, this.props)\n              : context.match;\n\n          const props = { ...context, location, match };\n\n          let { children, component, render } = this.props;\n\n          // Preact uses an empty array as children by\n          // default, so use null if that\'s the case.\n          if (Array.isArray(children) && children.length === 0) {\n            children = null;\n          }\n\n          if (typeof children === "function") {\n            children = children(props);\n\n            if (children === undefined) {\n              if (__DEV__) {\n                const { path } = this.props;\n\n                warning(\n                  false,\n                  "You returned `undefined` from the `children` function of " +\n                    `<Route${path ? ` path="${path}"` : ""}>, but you ` +\n                    "should have returned a React element or `null`"\n                );\n              }\n\n              children = null;\n            }\n          }\n\n          return (\n              // Route\u53ef\u4ee5\u901a\u8fc7children,component,render\u6765\u6e32\u67d3\u8def\u5f84\u5bf9\u5e94\u7684\u7ec4\u4ef6\uff0c\u4f18\u5148\u7ea7\u4ece\u9ad8\u5230\u4f4e\u3002\n            <RouterContext.Provider value={props}>\n                {props.match?  // \u5982\u679c\u8def\u5f84\u5339\u914d\u6210\u529f\u4e86\n                    children?  // children\u5b58\u5728\n                        typeof children === "function"?  // \u5982\u679cchildren\u662f\u4e2a\u51fd\u6570\n                          children(props)\n                          : \n                          children\n                        : \n                        component? //\u5f53component\u5b58\u5728\u7684\u65f6\u5019\uff0c\u540e\u7eed\u6267\u884c\u7ed3\u679c\u4e3aReact.createElement(component, props)\uff0cprops\u5408\u5e76\u5230component\u4e0a\n                          React.createElement(component, props)\n                            : \n                          render?  // render\u5b58\u5728\n                            render(props)\n                            : \n                            null\n                      : \n                    null\n                  }\n            </RouterContext.Provider>\n          );\n        }}\n      </RouterContext.Consumer>\n    );\n  }\n}\n')))}h.isMDXComponent=!0}}]);