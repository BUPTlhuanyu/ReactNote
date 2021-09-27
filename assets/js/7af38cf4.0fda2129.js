"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[561],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return m}});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var u=r.createContext({}),s=function(e){var n=r.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},c=function(e){var n=s(e.components);return r.createElement(u.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=s(t),m=a,f=d["".concat(u,".").concat(m)]||d[m]||p[m]||o;return t?r.createElement(f,i(i({ref:n},c),{},{components:t})):r.createElement(f,i({ref:n},c))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=d;var l={};for(var u in n)hasOwnProperty.call(n,u)&&(l[u]=n[u]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var s=2;s<o;s++)i[s]=t[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},6806:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return l},contentTitle:function(){return u},metadata:function(){return s},toc:function(){return c},default:function(){return d}});var r=t(7462),a=t(3366),o=(t(7294),t(3905)),i=["components"],l={id:"react-hook-form-utils",sidebar_label:"utils",title:"",sidebar_position:2,slug:"/react/react-hook-form/react-hook-form-utils"},u=void 0,s={unversionedId:"react/react-hook-form/react-hook-form-utils",id:"react/react-hook-form/react-hook-form-utils",isDocsHomePage:!1,title:"",description:"\u5bf9\u4e8e\u6587\u4e2d\u76f8\u5173\u7684ts\u77e5\u8bc6\uff0c\u8bf7\u67e5\u770b\u5b98\u65b9\u6587\u6863\u6216\u8005\u5728\u7ebf\u64b8\u4ee3\u7801\uff0c\u76f8\u5173\u7b14\u8bb0\u8bf7\u8f6c\u5230\u6709\u9053\u4e91\u7b14\u8bb0\uff1atypescript\u6587\u4ef6\u5939\u4e2d\u67e5\u770b\u3002",source:"@site/docs/react/react-hook-form/utils.md",sourceDirName:"react/react-hook-form",slug:"/react/react-hook-form/react-hook-form-utils",permalink:"/docs/react/react-hook-form/react-hook-form-utils",editUrl:"https://github.com/BUPTlhuanyu/ReactNote/tree/master/docs/react/react-hook-form/utils.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{id:"react-hook-form-utils",sidebar_label:"utils",title:"",sidebar_position:2,slug:"/react/react-hook-form/react-hook-form-utils"},sidebar:"react",previous:{title:"\u6e90\u7801\u89e3\u6790",permalink:"/docs/react/react-hook-form/react-hook-form-summary"},next:{title:"react-router4\u6e90\u7801\u603b\u7ed3",permalink:"/docs/react/react-router/react-router-summary"}},c=[{value:"\u57fa\u7840\u5224\u65ad",id:"\u57fa\u7840\u5224\u65ad",children:[]},{value:"\u590d\u6742\u5224\u65ad",id:"\u590d\u6742\u5224\u65ad",children:[]},{value:"\u76d1\u542c\u76ee\u6807DOM\u662f\u5426\u79fb\u9664\uff1aonDomRemove",id:"\u76d1\u542c\u76ee\u6807dom\u662f\u5426\u79fb\u9664ondomremove",children:[]},{value:"\u83b7\u53d6\u5bf9\u8c61\u5c5e\u6027\uff1aget",id:"\u83b7\u53d6\u5bf9\u8c61\u5c5e\u6027get",children:[]},{value:"getPath",id:"getpath",children:[]},{value:"\u5c06value\u6309\u7167path\u8def\u5f84\u8bbe\u7f6e\u5230object\u5bf9\u5e94\u7684\u5c5e\u6027\u4e0a\u4e2d: set",id:"\u5c06value\u6309\u7167path\u8def\u5f84\u8bbe\u7f6e\u5230object\u5bf9\u5e94\u7684\u5c5e\u6027\u4e0a\u4e2d-set",children:[]},{value:"validationModeChecker",id:"validationmodechecker",children:[]}],p={toc:c};function d(e){var n=e.components,t=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"\u5bf9\u4e8e\u6587\u4e2d\u76f8\u5173\u7684ts\u77e5\u8bc6\uff0c\u8bf7\u67e5\u770b\u5b98\u65b9\u6587\u6863\u6216\u8005",(0,o.kt)("a",{parentName:"p",href:"http://www.typescriptlang.org/play/#"},"\u5728\u7ebf\u64b8\u4ee3\u7801"),"\uff0c\u76f8\u5173\u7b14\u8bb0\u8bf7\u8f6c\u5230\u6709\u9053\u4e91\u7b14\u8bb0\uff1atypescript\u6587\u4ef6\u5939\u4e2d\u67e5\u770b\u3002"),(0,o.kt)("h2",{id:"\u57fa\u7840\u5224\u65ad"},"\u57fa\u7840\u5224\u65ad"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"isArray\uff1a---export default <T = any>(value: unknown): value is T[] => Array.isArray(value);\nisBoolean\uff1a---export default (value: unknown): value is boolean => typeof value === 'boolean';\nisCheckBoxInput\uff1a---export default (type: string): boolean => type === 'checkbox';\nisFunction\uff1a---export default (value: unknown): value is Function => typeof value === 'function';\nisMultipleSelect\uff1a---export default (type: string): boolean => type === 'select-multiple';\nisRadioInput\uff1a---export default (type?: string): boolean => type === 'radio';\nisRegex\uff1a---export default (value: unknown): value is RegExp => value instanceof RegExp;\nisString\uff1a---export default (value: unknown): value is string => typeof value === 'string';\nisUndefined\uff1a---export default (val: unknown): val is undefined => val === undefined;\n")),(0,o.kt)("p",null,"\u6269\u5c55: \u5173\u952e\u5b57is\u4e0eunknown"),(0,o.kt)("h2",{id:"\u590d\u6742\u5224\u65ad"},"\u590d\u6742\u5224\u65ad"),(0,o.kt)("h6",{id:"isdetached\u5224\u65ad\u4f20\u5165\u7684\u5143\u7d20\u6240\u5728\u7684\u8282\u70b9\u6811\u662f\u5426\u662f\u5b64\u7acb\u7684\u4e5f\u5c31\u662f\u8bf4\u6811\u7684\u6839\u8282\u70b9\u4e0d\u662fdocument"},"isDetached\uff1a\u5224\u65ad\u4f20\u5165\u7684\u5143\u7d20\u6240\u5728\u7684\u8282\u70b9\u6811\u662f\u5426\u662f\u5b64\u7acb\u7684\uff0c\u4e5f\u5c31\u662f\u8bf4\u6811\u7684\u6839\u8282\u70b9\u4e0d\u662fdocument"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"/**\n * \u5224\u65ad\u4f20\u5165\u7684\u5143\u7d20\u6240\u5728\u7684\u8282\u70b9\u6811\u662f\u5426\u662f\u5b64\u7acb\u7684\uff0c\u4e5f\u5c31\u662f\u8bf4\u6811\u7684\u6839\u8282\u70b9\u4e0d\u662fdocument\n * \u8fd4\u56de\u503c\uff1a true\u8868\u793a\u5143\u7d20\u5728document\u4e0a\uff0cfalse\u8868\u793a\u5143\u7d20\u4e0d\u518ddocument\u4e0a\n */\nexport type Inputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;\nexport type Ref = Inputs | any;\n\nexport default function isDetached(element: Ref): boolean {\n  if (!element) return true;\n\n  if (\n    !(element instanceof HTMLElement) ||\n    element.nodeType === Node.DOCUMENT_NODE\n  )\n    return false;\n\n  return isDetached(element.parentNode);\n}\n")),(0,o.kt)("h6",{id:"isnullorundefined\u5224\u65ad\u662fnull\u6216\u8005\u662fundefined"},"isNullOrUndefined\uff1a\u5224\u65ad\u662fnull\u6216\u8005\u662fundefined"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"import isUndefined from './isUndefined';\n\nexport default (value: unknown): value is null | undefined =>\n  value === null || isUndefined(value);\n")),(0,o.kt)("h6",{id:"isobject\u5224\u65ad\u662f\u5426\u662fobject\u57fa\u7c7b\u5b9e\u4f8b\u4e0d\u662fnullundefinedarrayfunction"},"isObject\uff1a\u5224\u65ad\u662f\u5426\u662fObject\u57fa\u7c7b\u5b9e\u4f8b\uff0c\u4e0d\u662fnull/undefined/Array/function"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"import isNullOrUndefined from './isNullOrUndefined';\nimport isArray from './isArray';\n\nexport default (value: unknown): value is object =>\n  !isNullOrUndefined(value) && !isArray(value) && typeof value === 'object';\n")),(0,o.kt)("h6",{id:"isemptyobject\u5224\u65adobject\u662f\u5426\u662f\u4e00\u4e2a\u7a7a\u7684object\u57fa\u7c7b\u5b9e\u4f8b"},"isEmptyObject\uff1a\u5224\u65adobject\u662f\u5426\u662f\u4e00\u4e2a\u7a7a\u7684Object\u57fa\u7c7b\u5b9e\u4f8b"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"import isObject from './isObject';\n\nexport default (value: unknown): boolean =>\n  isObject(value) && Object.keys(value).length === 0;\n")),(0,o.kt)("h6",{id:"issameerror\u6839\u636e\u4f20\u5165\u7684type\u4ee5\u53camessage\u5224\u65ad\u4f20\u5165\u7684error\u662f\u5426\u662f\u4e0e\u4e4b\u76f8\u540c\u7684error"},"isSameError\uff1a\u6839\u636e\u4f20\u5165\u7684type\u4ee5\u53camessage\u5224\u65ad\u4f20\u5165\u7684error\u662f\u5426\u662f\u4e0e\u4e4b\u76f8\u540c\u7684error"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"export type Inputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;\nexport type Ref = Inputs | any;\nexport interface FieldError {\n  ref: Ref;\n  type: string;\n  message?: string;\n  isManual?: boolean;\n}\n\nimport isObject from './isObject';\n\nexport default (\n  error: FieldError | undefined,\n  type: string,\n  message: string | undefined,\n): boolean =>\n  isObject(error) && (error.type === type && error.message === message);\n")),(0,o.kt)("h2",{id:"\u76d1\u542c\u76ee\u6807dom\u662f\u5426\u79fb\u9664ondomremove"},"\u76d1\u542c\u76ee\u6807DOM\u662f\u5426\u79fb\u9664\uff1aonDomRemove"),(0,o.kt)("p",null,"\u5229\u7528MutationObserver\u76d1\u542cwindow.document\u7684\u540e\u4ee3\u8282\u70b9\u4ee5\u53ca\u5b50\u8282\u70b9\u7684\u6539\u52a8\uff0c\u5982\u679c\u53d1\u751f\u6539\u52a8\u5219\u8c03\u7528\u4f20\u5165MutationObserver\u7684\u56de\u8c03\u51fd\u6570\uff0c\u56de\u8c03\u51fd\u6570\u4e2d\u4f1a\u5224\u65ad\u4f20\u5165onDomRemove\u7684dom\u662f\u5426\u88ab\u79fb\u9664\uff0c\u5982\u679c\u79fb\u9664\u4e86\uff0c\u5219\u53d6\u6d88\u76d1\u542c\u5668\u7684\u76d1\u542c\uff0c\u7136\u540e\u6267\u884c\u4f20\u5165onDomRemove\u7684\u51fd\u6570onDetachCallback"),(0,o.kt)("p",null,"\u8fd4\u56deobserver\u76d1\u542c\u5668"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"import { Ref, MutationWatcher } from '../types';\nimport isDetached from './isDetached';\n\n// \u76d1\u542cwindow.document\u7684\u540e\u4ee3\u8282\u70b9\u4ee5\u53ca\u5b50\u8282\u70b9\uff0c\u5e76\u8fd4\u56de\u8fd9\u4e2aobserver\u76d1\u542c\u5668\nexport default function onDomRemove(\n  element: Ref,\n  onDetachCallback: VoidFunction,\n): MutationWatcher {\n  // \u4f20\u5165\u4e00\u4e2a\u56de\u8c03\u51fd\u6570\uff0c\u6bcf\u5f53\u88ab\u6307\u5b9a\u7684\u8282\u70b9\u6216\u5b50\u6811\u4ee5\u53ca\u914d\u7f6e\u9879\u6709Dom\u53d8\u52a8\u65f6\u4f1a\u88ab\u8c03\u7528\u3002\u56de\u8c03\u51fd\u6570\u62e5\u6709\u4e24\u4e2a\u53c2\u6570\uff1a\u4e00\u4e2a\u662f\u63cf\u8ff0\u6240\u6709\u88ab\u89e6\u53d1\u6539\u52a8\u7684MutationRecord\u5bf9\u8c61\u6570\u7ec4\uff0c\u53e6\u4e00\u4e2a\u662f\u8c03\u7528\u8be5\u51fd\u6570\u7684MutationObserver \u5bf9\u8c61\u3002\n  const observer = new MutationObserver((): void => {\n    // \u5224\u65ad\u5143\u7d20\u662f\u5426\u5df2\u7ecf\u4ecedocument\u4e0a\u79fb\u9664\n    if (isDetached(element)) {\n      // \u963b\u6b62 MutationObserver \u5b9e\u4f8b\u7ee7\u7eed\u63a5\u6536\u7684\u901a\u77e5\uff0c\u76f4\u5230\u518d\u6b21\u8c03\u7528\u5176observe()\u65b9\u6cd5\uff0c\u8be5\u89c2\u5bdf\u8005\u5bf9\u8c61\u5305\u542b\u7684\u56de\u8c03\u51fd\u6570\u90fd\u4e0d\u4f1a\u518d\u88ab\u8c03\u7528\u3002\n      // \u5982\u679c\u5143\u7d20\u5df2\u7ecf\u79fb\u9664\u5219\u8fd9\u4e2aobserver\u7684\u56de\u8c03\u4e0d\u518d\u6267\u884c\n      observer.disconnect();\n      // \u5f53\u88ab\u79fb\u9664\u7684\u65f6\u5019\u6267\u884c\u4f20\u5165onDomRemove\u7684\u7b2c\u4e8c\u4e2a\u53c2\u6570\u51fd\u6570\n      onDetachCallback();\n    }\n  });\n  // \u89c2\u5bdf\u7684\u8282\u70b9\u662f window.document\n  observer.observe(window.document, {\n    childList: true,// \u89c2\u5bdf\u76ee\u6807\u5b50\u8282\u70b9\u7684\u53d8\u5316\uff0c\u6dfb\u52a0\u6216\u8005\u5220\u9664\n    subtree: true,// \u9ed8\u8ba4\u4e3a false\uff0c\u8bbe\u7f6e\u4e3a true \u53ef\u4ee5\u89c2\u5bdf\u540e\u4ee3\u8282\u70b9\n  });\n\n  return observer;\n}\n\n")),(0,o.kt)("p",null,"\u6269\u5c55\uff1aMutationObserver"),(0,o.kt)("h2",{id:"\u83b7\u53d6\u5bf9\u8c61\u5c5e\u6027get"},"\u83b7\u53d6\u5bf9\u8c61\u5c5e\u6027\uff1aget"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"/**\n * path: 'a.b'\n * obj: {a: {b: 1}}\n * \u5982\u679cobj.a.b\u7684\u503c\u4e3aundefined\u6216\u8005\u662f\u4f20\u5165\u7684obj\uff0c\u90a3\u4e48\u8fd4\u56de\u9ed8\u8ba4\u503c\uff0c\u5426\u5219\u8fd4\u56deobj.a.b\n */\n\nexport default (obj: any, path: string[] | string, defaultValue?: any) => {\n  const result = String.prototype.split\n    .call(path, /[,[\\].]+?/)\n    .filter(Boolean)\n    .reduce(\n      (res, key) => (res !== null && res !== undefined ? res[key] : res),\n      obj,\n    );\n  return result === undefined || result === obj ? defaultValue : result;\n};\n")),(0,o.kt)("h2",{id:"getpath"},"getPath"),(0,o.kt)("p",null,"types"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},'export type BaseFieldValue = any;\n\n\n/**\n * type FieldValues = {\n *   [x: string]: any;\n * }\n */\nexport type FieldValues = Record<string, BaseFieldValue>;\n\n// Extract<T, U> -- \u63d0\u53d6T\u4e2d\u53ef\u4ee5\u8d4b\u503c\u7ed9U\u7684\u7c7b\u578b\u3002\n// \u6bd4\u5982\uff1a\n// type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"\n// type T03 = Extract<string | number | (() => void), Function>;  // () => void\n\n// \u7d22\u5f15\u7c7b\u578b\u67e5\u8be2\u64cd\u4f5c\u7b26\uff1akeyof FormValues\u7684\u7ed3\u679c\u4e3a T\u4e0a\u5df2\u77e5\u7684\u516c\u5171\u5c5e\u6027\u540d\u7684\u8054\u5408\n// \u6bd4\u5982\uff1a\n// interface Person {\n//   name: string;\n//   age: number;\n// }\n// let personProps: keyof Person; // \'name\' | \'age\'\n\n// \u56e0\u6b64\u4e0b\u9762\u7684RawFieldName\u8868\u793a\u53d6\u51fa\u6240\u6709FormValues\u5065\u4e3astring\u7c7b\u578b\u7684\u8054\u5408\u7c7b\u578b\n// \u6bd4\u5982\uff1a\n// interface T1 {\n//   0: \'a\';\n//   b: 0;\n//   [key: number]: string\n// }\n\n// type T2 = Extract<\n// keyof T1,\n// number\n// >; // T2 = number\n\n// type T3 = Extract<\n//   keyof T1,\n//   string\n// >; // T2 = "b"\nexport type RawFieldName<FormValues extends FieldValues> = Extract<\n  keyof FormValues,\n  string\n>;\n\n// FieldName\u7c7b\u578b\u662fstring\u6216\u8005FormValues\u4e2d\u5065\u540d\u662fstring\u7c7b\u578b\u7684\u5065\u540d\u8054\u5408\u7c7b\u578b\n// \u6bd4\u5982\uff1a type FormValues = {a: 1, b: 2, 0: 3}\n//        \u90a3\u4e48FieldName\u5c31\u662f \'a\' | \'b\' | string\uff0c\u4e5f\u5c31\u662fstring\nexport type FieldName<FormValues extends FieldValues> =\n  | RawFieldName<FormValues>\n  | string;\n\n')),(0,o.kt)("p",null,"\u6e90\u7801"),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"getPath\u5728value\u7684\u5065\u503c\u4e3a\u5b57\u7b26\u4e32\u7684\u65f6\u5019\uff0c\u624d\u4f1a\u8f93\u51fa\u7ed3\u679c\nflatArray\u7528\u4e8e\u62cd\u5e73\u6570\u7ec4")),(0,o.kt)("p",null,"\u6bd4\u5982\uff1a "),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"getPath('pre', {a: {b: 'next'}}) \u8fd4\u56de [['pre.c']]\nflatArray([['pre.c']]) \u8fd4\u56de['pre.c']\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"getPath('pre', {a: {b: {c: 'next'}}, a0: {b0: {c0: 'next0'}}}) \u8fd4\u56de [[['pre.c']],[['pre.c0']]]\nflatArray([['pre.c']]) \u8fd4\u56de['pre.next', 'pre.c0']\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"import flatArray from './flatArray';\nimport isString from './isString';\nimport isObject from './isObject';\nimport { FieldValues, FieldName } from '../types';\nimport isArray from './isArray';\n\nconst getPath = <FormValues extends FieldValues = FieldValues>(\n  path: FieldName<FormValues>,\n  values: FormValues | string[] | string,\n): any =>\n  isArray(values)\n    ? values.map((item, index) => {\n        const pathWithIndex = `${path}[${index}]`;\n\n        if (isArray(item)) {\n          return getPath(pathWithIndex, item);\n        } else if (isObject(item)) {\n          return Object.entries(item).map(([key, objectValue]: [string, any]) =>\n            isString(objectValue)\n              ? `${pathWithIndex}.${key}`\n              : getPath(`${pathWithIndex}.${key}`, objectValue),\n          );\n        }\n\n        return pathWithIndex;\n      })\n    : Object.entries(values).map(([key, objectValue]) =>\n        isString(objectValue) ? `${path}.${key}` : getPath(path, objectValue),\n      );\n\nexport default <FormValues extends FieldValues = FieldValues>(\n  parentPath: FieldName<FormValues>,\n  value: FormValues,\n) => flatArray<FieldName<FormValues>>(getPath<FormValues>(parentPath, value));\n\n")),(0,o.kt)("p",null,"\u6269\u5c55\uff1atypescript\u7684Record"),(0,o.kt)("h2",{id:"\u5c06value\u6309\u7167path\u8def\u5f84\u8bbe\u7f6e\u5230object\u5bf9\u5e94\u7684\u5c5e\u6027\u4e0a\u4e2d-set"},"\u5c06value\u6309\u7167path\u8def\u5f84\u8bbe\u7f6e\u5230object\u5bf9\u5e94\u7684\u5c5e\u6027\u4e0a\u4e2d: set"),(0,o.kt)("p",null,"\u5982\u679cpath\u4e0eobject\u4e0d\u5bf9\u5e94\uff0c\u4f1a\u5bfc\u81f4\u4f20\u5165\u7684\u5bf9\u8c61\u6309\u7167path\u7684\u5065\u91cd\u7f6e\u4e3a\u7a7a\u6570\u7ec4\u6216\u8005\u7a7a\u5bf9\u8c61"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"import isObject from './isObject';\nimport isArray from './isArray';\nimport { FieldValues } from '../types';\n\nconst reIsDeepProp = /\\.|\\[(?:[^[\\]]*|([\"'])(?:(?!\\1)[^\\\\]|\\\\.)*?\\1)\\]/; // \u83b7\u53d6\u7b2c\u4e00\u4e2a.\u6216\u8005[]\u5305\u88f9\u7684\u5185\u5bb9\uff08\u5305\u62ec[]\uff09\nconst reIsPlainProp = /^\\w*$/; //\u5339\u914d\u5b57\u6bcd\u3001\u6570\u5b57\u3001\u4e0b\u5212\u7ebf\nconst rePropName = /[^.[\\]]+|\\[(?:(-?\\d+(?:\\.\\d+)?)|([\"'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))/g; // \u4f9d\u6b64\u5339\u914d\u51fajs\u5bf9\u8c61\u53d6\u503c\u7684\u65f6\u5019\u5065\u4e0e\u503c\uff0c\u503c\u5305\u62ec[]\nconst reEscapeChar = /\\\\(\\\\)?/g;\nconst reIsUint = /^(?:0|[1-9]\\d*)$/; // 0 \u6216\u8005 1-9\u5f00\u5934\u7684\u6570\u5b57\n\n// \u5224\u65ad\u8f93\u5165\u7684\u503c\u662f\u5426\u53ef\u4ee5\u4f5c\u4e3aindex\uff0c\u524d\u63d0\u662f\u4e00\u4e2a\u5927\u4e8e-1\u7684\u6570\u5b57\nfunction isIndex(value: any) {\n  return reIsUint.test(value) && value > -1;\n}\n\n// \u5b57\u7b26\u4e32\u7531\u5b57\u7b26\u4e0b\u5212\u7ebf\u6570\u5b57\u7ec4\u6210\u6216\u8005\u5b57\u7b26\u4e32\u4e0d\u5305\u542b\u53d6\u503c\u7b26\u53f7\uff1a\u6bd4\u5982.\u6216\u8005[]\uff0c\u90a3\u4e48\u8fd9\u4e2a\u5b57\u7b26\u4e32\u5c31\u53ef\u4ee5\u4f5c\u4e3a\u4e00\u4e2a\u5065\nexport function isKey(value: [] | string) {\n  if (isArray(value)) return false;\n  return reIsPlainProp.test(value) || !reIsDeepProp.test(value);\n}\n\n// \u8fd4\u56de\u4e00\u4e2a\u6570\u7ec4\uff0c\u5305\u542b\u4e86\u6240\u6709\u7684\u5065\u4e0e\u503c\uff0c\u5f53\u503c\u662f\u67d0\u4e2a\u5bf9\u8c61\u7684\u67d0\u4e2a\u5c5e\u6027\u5e76\u4e14\u88ab\u5f15\u53f7\u5305\u88f9\u7684\u65f6\u5019\uff0c\u8fd9\u4e2a\u503c\u7684\u6574\u4f53\u4f1a\u4f5c\u4e3a\u6570\u7ec4\u7684\u4e00\u9879\n// \u6bd4\u5982\uff1a \"a['b[0]'].c\" \u8fd4\u56de['a','b[0]', c], \"a[b[0]].c\" \u8fd4\u56de['a','b','0','c'] \nconst stringToPath = (string: string): string[] => {\n  const result: string[] = [];\n\n  string.replace(\n    rePropName,\n    // match\u662frePropName\u5339\u914d\u7684\u5b50\u4e32\uff0cnumber\uff0cquote\uff0cstring\u5206\u522b\u4e3arePropName\u7b2c1\uff0c2\uff0c3\u4e2a\u5b50\u8868\u8fbe\u5f0f\u7684\u5b57\u7b26\u4e32\n    // \u5f53match\u662f['a[0]']\u7684\u65f6\u5019\uff0cnumber\u4e3aundefined,quote\u4e3a',string\u4e3a\u53ccquote\u5305\u88f9\u7684\u5b57\u7b26\u4e32\n    (match: string, number: string, quote: string, string: string): any => {\n      // \u5f53quote\u4e0estring\u6709\u503c\u7684\u65f6\u5019\uff0c\u5c06string\u7684\\\\\u66ff\u6362\u6210\\;\u5982\u679c\u6ca1\u6709quote\u5219\u8fd4\u56denumber,\u5982\u679cnumber\u4e3aundefined\u5219\u8fd4\u56dematch\n      result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);\n    },\n  );\n\n  return result;\n};\n\n// \u5c06value\u6309\u7167path\u8def\u5f84\u8bbe\u7f6e\u5230object\u5bf9\u5e94\u7684\u5c5e\u6027\u4e0a\u4e2d\uff0c\u6ce8\u610f\u8fd9\u91cc\u7684value\u662f\u5b57\u7b26\u4e32\n// \u5f53path\u4e0a\u5bf9\u5e94\u7684\u5c5e\u6027\u627e\u4e0d\u5230\u7684\u65f6\u5019,\u4f1a\u5bfc\u81f4\u8bbe\u7f6e\u5931\u8d25\n// \u6bd4\u5982: \u4f20\u5165\u5bf9\u8c61\u662fa: {b: 0},value\u662f'val',\u5982\u679cpath\u662f'a[b]'\u5219\u4f1a\u5c06object\u8bbe\u7f6e\u4e3a{a:{b:'val'},\u5fc5\u987b\u4f20\u5165'b'\nexport default function set(object: FieldValues, path: string, value: string) {\n  let index = -1;\n  // \u901a\u8fc7path\u6784\u5efa\u6570\u7ec4\uff0c\u6570\u7ec4\u6392\u5217\u65b9\u5f0f\u662f\u5065\uff0c\u503c\uff0c\u5065\uff0c\u503c...\n  const tempPath = isKey(path) ? [path] : stringToPath(path);\n  const length = tempPath.length;\n  const lastIndex = length - 1;\n  // \u5f00\u59cb\u904d\u5386object\uff0c\u4ece0\u5f00\u59cb\n  while (++index < length) {\n    // \u53d6\u51fa\u4e00\u4e2a\u5065\n    const key = tempPath[index];\n    // \u5c06newValue\u8bbe\u7f6e\u4e3a\u4f20\u5165\u7684value\n    let newValue: string | object = value;\n\n    if (index !== lastIndex) {\n      // \u4fdd\u5b58path\u5f53\u524dkey\u5bf9\u5e94\u7684value\n      const objValue = object[key];\n      // \u5982\u679cpath\u5f53\u524dkey\u5bf9\u5e94\u7684value\u662f\u5bf9\u8c61\u6216\u8005\u6570\u7ec4\uff0c\u5219newValue\u91cd\u7f6e\u4e3a\u539f\u6765\u7684\u5bf9\u8c61\u6216\u8005\u6570\u7ec4\n      newValue =\n        isObject(objValue) || isArray(objValue)\n          ? objValue\n          : isIndex(tempPath[index + 1])\n            ? []\n            : {};\n    }\n    // \u5c06\u65b0\u7684\u503c\u4f5c\u4e3a\u4f20\u5165\u5bf9\u8c61\u5f53\u524dkey\u5c5e\u6027\u7684\u503c\uff0c\u7136\u540e\u5c06object\u6307\u5411\u5f53\u524dkey\u5bf9\u5e94\u7684\u503c\uff0c\u5e76\u5f00\u59cb\u4e0b\u4e00\u8f6e\u7684\u5faa\u73af\n    object[key] = newValue;\n    object = object[key];\n  }\n  return object;\n}\n\n\n")),(0,o.kt)("h2",{id:"validationmodechecker"},"validationModeChecker"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"import { VALIDATION_MODE } from '../constants';\n\nexport default (\n  mode?: string,\n): {\n  isOnSubmit: boolean;\n  isOnBlur: boolean;\n  isOnChange: boolean;\n} => ({\n  isOnSubmit: !mode || mode === VALIDATION_MODE.onSubmit,\n  isOnBlur: mode === VALIDATION_MODE.onBlur,\n  isOnChange: mode === VALIDATION_MODE.onChange,\n});\n\n")))}d.isMDXComponent=!0}}]);