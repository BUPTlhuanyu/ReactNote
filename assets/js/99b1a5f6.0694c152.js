"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[6123],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return f}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=n.createContext({}),i=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):p(p({},t),e)),r},s=function(e){var t=i(e.components);return n.createElement(u.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),m=i(r),f=o,d=m["".concat(u,".").concat(f)]||m[f]||l[f]||a;return r?n.createElement(d,p(p({ref:t},s),{},{components:r})):n.createElement(d,p({ref:t},s))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,p=new Array(a);p[0]=m;var c={};for(var u in t)hasOwnProperty.call(t,u)&&(c[u]=t[u]);c.originalType=e,c.mdxType="string"==typeof e?e:o,p[1]=c;for(var i=2;i<a;i++)p[i]=r[i];return n.createElement.apply(null,p)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},3520:function(e,t,r){r.r(t),r.d(t,{assets:function(){return s},contentTitle:function(){return u},default:function(){return f},frontMatter:function(){return c},metadata:function(){return i},toc:function(){return l}});var n=r(3117),o=r(102),a=(r(7294),r(3905)),p=["components"],c={id:"react-router-withrouter",sidebar_label:"withRouter",slug:"/react/react-router/others/react-router-withrouter",sidebar_position:8,title:""},u=void 0,i={unversionedId:"react/react-router/others/react-router-withrouter",id:"react/react-router/others/react-router-withrouter",title:"",description:"withRouter\u4e2dwrappedComponentRef\u7684\u7528\u6cd5",source:"@site/docs/react/react-router/others/react-router4\u6e90\u7801\u6d45\u6790(\u516b) \uff1awithRouter.md",sourceDirName:"react/react-router/others",slug:"/react/react-router/others/react-router-withrouter",permalink:"/ReactNote/docs/react/react-router/others/react-router-withrouter",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react-router/others/react-router4\u6e90\u7801\u6d45\u6790(\u516b) \uff1awithRouter.md",tags:[],version:"current",sidebarPosition:8,frontMatter:{id:"react-router-withrouter",sidebar_label:"withRouter",slug:"/react/react-router/others/react-router-withrouter",sidebar_position:8,title:""},sidebar:"react",previous:{title:"Switch",permalink:"/ReactNote/docs/react/react-router/others/react-router-switch"},next:{title:"Link",permalink:"/ReactNote/docs/react/react-router/others/react-router-link"}},s={},l=[{value:"withRouter\u4e2dwrappedComponentRef\u7684\u7528\u6cd5",id:"withrouter\u4e2dwrappedcomponentref\u7684\u7528\u6cd5",level:3},{value:"\u6e90\u7801\u5206\u6790",id:"\u6e90\u7801\u5206\u6790",level:3}],m={toc:l};function f(e){var t=e.components,r=(0,o.Z)(e,p);return(0,a.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h3",{id:"withrouter\u4e2dwrappedcomponentref\u7684\u7528\u6cd5"},"withRouter\u4e2dwrappedComponentRef\u7684\u7528\u6cd5"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u4e0eLink\u4e2d\u7684innerRef\u4e00\u6837\u90fd\u662f\u56de\u8c03ref")),(0,a.kt)("p",null,"\u4f7f\u7528withRouter\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"// MyComponent.js\nexport default withRouter(MyComponent)\n")),(0,a.kt)("p",null,"Container.js\u4f7f\u7528MyComponent"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"class Container extends React.Component {\n  componentDidMount() {\n    this.component.doSomething()\n  }\n\n  render() {\n    return (\n      <MyComponent wrappedComponentRef={element => this.component = element}/>\n    )\n  }\n}\n")),(0,a.kt)("p",null,"\u5728MyComponent\u5c06wrappedComponentRef\u4f5c\u4e3aprops\u4f20\u5165\u88ab\u5305\u88f9\u7684\u7ec4\u4ef6\u7684ref\u5c5e\u6027\u4e0a\uff0c\u5728\u88ab\u5305\u88f9\u7684\u7ec4\u4ef6\u6302\u8f7d\u4e4b\u540e\uff0c\u4f1a\u8c03\u7528wrappedComponentRef\u51fd\u6570\uff0c\u5e76\u5c06\u88ab\u5305\u88f9\u7ec4\u4ef6\u7684DOM \u5143\u7d20\u7684ref\u5f15\u7528\u4f20\u5165Container\u7ec4\u4ef6\u7684this.component\u5bf9\u8c61\u4e0a\u3002\u56e0\u6b64\u5728Container\u7ec4\u4ef6\u4e0a\u53ef\u4ee5\u8c03\u7528\u88ab\u5305\u88f9\u7ec4\u4ef6\u5b9e\u4f8b\u4e0a\u5b9a\u4e49\u7684\u6240\u6709\u65b9\u6cd5\u3002"),(0,a.kt)("hr",null),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("em",{parentName:"strong"},"\u6ce8\u610f\uff1a")),"\u5728\u4f7f\u7528typescript\u4ee5\u53careact-redux\u7684connect\uff0c\u4ee5\u53cawithRouter\u5305\u88f9\u7ec4\u4ef6\u7684\u65f6\u5019\uff0c\u9700\u8981\u6dfb\u52a0\u5982\u4e0b\u4ee3\u7801\uff0c\u5c06\u7ec4\u4ef6\u81ea\u8eab\u7684props\u4f20\u5165propType\u4e2d\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"const mapStateToProps((state:any,ownProps:any)=>{\n    ...ownProps,\n    data:state.data\n})\n")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"\u6e90\u7801\u5206\u6790"},"\u6e90\u7801\u5206\u6790"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"function withRouter(Component) {\n  //C\u4e3a\u7531\u9ad8\u9636\u7ec4\u4ef6withRouter\u4ea7\u751f\u7684\u5305\u88f9\u7ec4\u4ef6\uff0c\u8be5\u5305\u88f9\u7ec4\u4ef6C\u4e3a\u7eaf\u51fd\u6570\n  const C = props => {\n    //remainingProps\u4e3a\u9664wrappedComponentRef\u4e4b\u5916\u7684props\u6570\u636e\n    const { wrappedComponentRef, ...remainingProps } = props;\n\n    return (\n      <Route\n          //routeComponentProps:Route\u7ec4\u4ef6\u4e0aprops = { ...context, location, match }\n        children={routeComponentProps => (\n          <Component\n            {...remainingProps}\n            {...routeComponentProps}\n            //\u5229\u7528\u56de\u8c03ref\u5c06\u88ab\u5305\u88f9\u7ec4\u4ef6wrappedComponent\u7684ref\u5f15\u7528\u63d0\u4f9b\u7ed9\u5176\u4ed6\u7ec4\u4ef6\u4f7f\u7528\u3002\n              // React \u5c06\u5728\u7ec4\u4ef6\u6302\u8f7d\u65f6\u5c06 DOM \u5143\u7d20\u4f20\u5165ref \u56de\u8c03\u51fd\u6570\u5e76\u8c03\u7528\uff0c\u5f53\u5378\u8f7d\u65f6\u4f20\u5165 null \u5e76\u8c03\u7528\u5b83\u3002\n              // \u5728componentDidMout \u548c componentDidUpdate \u89e6\u53d1\u4e4b\u524d\uff0cRefs \u4fdd\u8bc1\u662f\u6700\u65b0\u7684\u3002\n            ref={wrappedComponentRef}\n          />\n        )}\n      />\n    );\n  };\n\n  C.displayName = `withRouter(${Component.displayName || Component.name})`;\n  C.WrappedComponent = Component;\n\n  if (__DEV__) {\n    C.propTypes = {\n      wrappedComponentRef: PropTypes.func\n    };\n  }\n\n  return hoistStatics(C, Component);\n}\n")))}f.isMDXComponent=!0}}]);