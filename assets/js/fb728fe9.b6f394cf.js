"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[1447],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return s}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=r.createContext({}),m=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},d=function(e){var t=m(e.components);return r.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,i=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),u=m(n),s=a,h=u["".concat(i,".").concat(s)]||u[s]||p[s]||l;return n?r.createElement(h,c(c({ref:t},d),{},{components:n})):r.createElement(h,c({ref:t},d))}));function s(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,c=new Array(l);c[0]=u;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:a,c[1]=o;for(var m=2;m<l;m++)c[m]=n[m];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},3325:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return o},contentTitle:function(){return i},metadata:function(){return m},toc:function(){return d},default:function(){return u}});var r=n(7462),a=n(3366),l=(n(7294),n(3905)),c=["components"],o={id:"react-element-validator",sidebar_label:"ReactElementValidator",slug:"/react/react/ReactElement/others/react-element-validator",sidebar_position:6,title:""},i=void 0,m={unversionedId:"react/react/ReactElement/others/react-element-validator",id:"react/react/ReactElement/others/react-element-validator",isDocsHomePage:!1,title:"",description:"1. react\u9047\u5230React.Fragment\u6807\u7b7e\uff0c\u5148\u9a8c\u8bc1\u5668\u68c0\u6d4b\u662f\u5426\u7b26\u5408\u89c4\u8303\uff0c\u518d\u8c03\u7528createElement\u521b\u5efareactElement\u3002",source:"@site/docs/react/react/ReactElement/others/ReactElementValidator.md",sourceDirName:"react/react/ReactElement/others",slug:"/react/react/ReactElement/others/react-element-validator",permalink:"/ReactNote/docs/react/react/ReactElement/others/react-element-validator",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react/ReactElement/others/ReactElementValidator.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{id:"react-element-validator",sidebar_label:"ReactElementValidator",slug:"/react/react/ReactElement/others/react-element-validator",sidebar_position:6,title:""},sidebar:"react",previous:{title:"ReactElement",permalink:"/ReactNote/docs/react/react/ReactElement/others/react-element"},next:{title:"ReactNoopUpdateQueue",permalink:"/ReactNote/docs/react/react/ReactElement/others/react-node-update-queue"}},d=[{value:"\u90e8\u5206\u51fd\u6570\u5217\u8868",id:"\u90e8\u5206\u51fd\u6570\u5217\u8868",children:[]},{value:"validateFragmentProps",id:"validatefragmentprops",children:[]},{value:"createElementWithValidation",id:"createelementwithvalidation",children:[]},{value:"createFactoryWithValidation",id:"createfactorywithvalidation",children:[]},{value:"cloneElementWithValidation",id:"cloneelementwithvalidation",children:[]}],p={toc:d};function u(e){var t=e.components,n=(0,a.Z)(e,c);return(0,l.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"react\u9047\u5230React.Fragment\u6807\u7b7e\uff0c\u5148\u9a8c\u8bc1\u5668\u68c0\u6d4b\u662f\u5426\u7b26\u5408\u89c4\u8303\uff0c\u518d\u8c03\u7528createElement\u521b\u5efareactElement\u3002"),(0,l.kt)("li",{parentName:"ol"},"React.Fragment\u5141\u8bb8\u4f20\u5165\u7684\u5c5e\u6027\u6709key,children\uff0c\u4e0d\u80fd\u4f20\u5165ref\u4ee5\u53ca\u5176\u4ed6\u5c5e\u6027\uff0c\u56e0\u4e3aReact.Fragment\u6700\u7ec8\u4e0d\u4f1a\u6e32\u67d3\u6210\u4e00\u4e2a\u771f\u5b9eDOM\uff0c\u6240\u4ee5ref\u5f15\u7528\u5230\u7684\u662fnull\uff0c\u56e0\u6b64\u4e0d\u80fd\u4f20\u5165ref\u4f5c\u4e3a\u5c5e\u6027\u3002")),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"\u90e8\u5206\u51fd\u6570\u5217\u8868"},"\u90e8\u5206\u51fd\u6570\u5217\u8868"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"getDeclarationErrorAddendum ------ \u8fd4\u56de\u5b57\u7b26\u4e32\uff0c\u5185\u5bb9\u4e3a\uff1a\u68c0\u67e5ReactCurrentOwner.current.type\u4e0a\u7684render\u65b9\u6cd5\ngetSourceInfoErrorAddendum ------- \u8fd4\u56de\u5b57\u7b26\u4e32\uff0c\u5185\u5bb9\u4e3a\uff1a\u68c0\u67e5\u67d0\u4e2a\u6587\u4ef6\u4e0b\u7684\u67d0\u4e00\u884c\u4ee3\u7801\ngetCurrentComponentErrorInfo ----- \u9519\u8bef\u63d0\u793a\uff0c\u5728ReactCurrentOwner.current\u4e0d\u5b58\u5728\u7684\u65f6\u5019\uff0c\u63d0\u793a\u68c0\u67e5parentType\u4e0a\u7684render\nvalidateExplicitKey -------------- \u5bf9\u4f20\u5165\u7684\u7ec4\u4ef6\u662f\u5426\u5177\u6709key\u8fdb\u884c\u9519\u8bef\u5904\u7406\nvalidateChildKeys ---------------- \u5bf9\u4f20\u5165\u7684node\u4e2d\u7684\u6bcf\u4e2aelement\u5224\u65ad\u662f\u5426\u5b58\u5728key\nvalidatePropTypes ---------------- \u68c0\u67e5propTypes\u7684\u5426\u5927\u5c0f\u5199\u6b63\u786e\uff0c\u7c7b\u7ec4\u4ef6\u6216\u8005\u51fd\u6570\u7ec4\u4ef6\u8bbe\u7f6e\u9ed8\u8ba4prop\u53ea\u80fd\u7528defaultProps\uff0cgetDefaultProps\u53ea\u80fd\u7528\u4e8eReact.createClass\u4e2d\n")),(0,l.kt)("h3",{id:"validatefragmentprops"},"validateFragmentProps"),(0,l.kt)("p",null,"React.Fragment \u4e5f\u662f\u901a\u8fc7createElement\u521b\u5efa\u7684\u3002\nReact.Fragment \u53ea\u80fd\u6709key\u548cchildren\u4f5c\u4e3a\u5176\u5c5e\u6027\u3002\nReact.Fragment \u7279\u522b\u6ce8\u610f\u4e0d\u80fd\u4f20\u5165ref\u4f5c\u4e3a\u5176\u5c5e\u6027\uff0c\u56e0\u4e3aReact.Fragment\u4e0d\u4f1a\u6e32\u67d3\u6210\u4e00\u4e2a\u771f\u5b9e\u7684DOM\uff0c\u81ea\u7136\u4e0d\u4f1a\u5141\u8bb8\u6709ref\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'<React.Fragment key111="Fragment \u53ea\u80fd\u6709key\u548cchildren\u4f5c\u4e3a\u5176\u5c5e\u6027"\n\nchildren111="Fragment \u53ea\u80fd\u6709key\u548cchildren\u4f5c\u4e3a\u5176\u5c5e\u6027"\nref={{"some":"Fragment \u4e5f\u4e0d\u80fd\u4f7f\u7528ref\u83b7\u53d6\u5f15\u7528"}}\nkey="\u5141\u8bb8\u7684"\nchildren="\u5141\u8bb8\u7684,\u8c8c\u4f3c\u6ca1\u4ec0\u4e48\u7528\uff0c\u771f\u5b9e\u7684children\u5c31\u662fReact.Fragment\u5305\u88f9\u7684\u5185\u5bb9"\n    >\n    Some text.\n<h2>A heading</h2>\n</React.Fragment>\n')),(0,l.kt)("h3",{id:"createelementwithvalidation"},"createElementWithValidation"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u5148\u68c0\u67e5\u4f20\u5165\u7684type\u662f\u5426\u662f\u5408\u6cd5\u7684element\u7c7b\u578b\uff0c\u89c1isValidElementType\uff0c\u5982\u679c\u4e0d\u662f\u629b\u51fa\u9519\u8bef"),(0,l.kt)("li",{parentName:"ol"},"\u5982\u679c\u662f\u5219\u5c06type, props, children\u7b49\u53c2\u6570\u4f20\u5165createElement\u751f\u6210\u5bf9\u5e94\u7684react\u5143\u7d20"),(0,l.kt)("li",{parentName:"ol"},"\u7136\u540e\u8c03\u7528validateChildKeys\u5bf9\u53c2\u6570children\u7684\u6bcf\u4e2aelement\u5224\u65ad\u662f\u5426\u5b58\u5728key"),(0,l.kt)("li",{parentName:"ol"},"\u63a5\u7740\uff0c\u5982\u679ctype\u7c7b\u578b\u662fREACT_FRAGMENT_TYPE\uff0c\u8c03\u7528validateFragmentProps\u68c0\u67e5Fragment\u4e0a\u7684\u5c5e\u6027\uff08\u8fd9\u91cc\u51fd\u6570\u540d\u4e3aprops\u4e0d\u59a5\uff0ckey\u4e0eref\u4e0d\u7b97\u662fprops\u4e2d\u7684\uff0cattributes\u6bd4\u8f83\u597d\uff09\uff0c\u5176\u4ed6type\u7c7b\u578b\u7684\u5143\u7d20\u7684props\u7684\u89c4\u5219\u4e00\u81f4\u3002"),(0,l.kt)("li",{parentName:"ol"},"\u6700\u540e\u5982\u679c\u9a8c\u8bc1\u6210\u529f\uff0c\u8fd4\u56de\u521b\u5efa\u7684element\u3002")),(0,l.kt)("h3",{id:"createfactorywithvalidation"},"createFactoryWithValidation"),(0,l.kt)("p",null,"\u5de5\u5382\u51fd\u6570\uff0c\u5bf9createElementWithValidation\u7684\u5c01\u88c5\uff0c\u8fd4\u56de\u4e00\u4e2a\u51fd\u6570\uff0c\u8be5\u51fd\u6570\u7528\u4e8e\u521b\u5efa\u4e00\u4e2aelement"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"export function createFactoryWithValidation(type) {\n  const validatedFactory = createElementWithValidation.bind(null, type);\n  validatedFactory.type = type;\n  return validatedFactory;\n}\n")),(0,l.kt)("h3",{id:"cloneelementwithvalidation"},"cloneElementWithValidation"),(0,l.kt)("p",null,"\u8fd4\u56de\u4e00\u4e2aREACT","_","ELEMENT","_","TYPE\u7c7b\u578b\u7684\u5143\u7d20\uff0c\u5176type\u5c5e\u6027\u503c\u4e3a\u4f20\u5165\u7684element\uff0c"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"export function cloneElementWithValidation(element, props, children) {\n  const newElement = cloneElement.apply(this, arguments);\n  for (let i = 2; i < arguments.length; i++) {\n    validateChildKeys(arguments[i], newElement.type);\n  }\n  //newElement\u4e3aREACT_ELEMENT_TYPE\u7c7b\u578b\uff0c\u6240\u4ee5\u4e0d\u8bb8\u8981\u5224\u65ad\u662f\u5426\u662fREACT_FRAGMENT_TYPE\u7c7b\u578b\n  validatePropTypes(newElement);\n  return newElement;\n}\n")),(0,l.kt)("p",null,"\u8fd9\u4e2a\u51fd\u6570\u5728\u5f00\u53d1\u73af\u5883\u4e0b\u4f1a\u4f5c\u4e3aReact.cloneElement\u65b9\u6cd5\u3002\u800c\u5728\u751f\u4ea7\u73af\u5883\u4e0bReactElement.js\u4e2d\u7684cloneElement\u4f1a\u4f5c\u4e3aReact.cloneElement\u65b9\u6cd5\u3002"),(0,l.kt)("p",null,"\u4f8b1\uff1achildren\u4f5c\u4e3a\u5c5e\u6027"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'ReactDOM.render(\n    <React.Fragment children={["child","child","child"]}/>,\n    document.getElementById(\'app\')\n);\n')),(0,l.kt)("p",null,"\u4f8b2\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'let ReactFragment1 = React.cloneElement(<React.Fragment children={["child","child","child"]}/>,{xxx:"\u8fd9\u4f1a\u88ab\u6dfb\u52a0\u5230\u65b0\u7ec4\u4ef6\u7684props\u4e0a"})\nconsole.log("ReactFragment1",ReactFragment1)\nconsole.log("ReactFragment1",React.Fragment)\n\nReactDOM.render(\n    ReactFragment1,\n    document.getElementById(\'app\')\n);\n')))}u.isMDXComponent=!0}}]);