对于文中相关的ts知识，请查看官方文档或者[在线撸代码](http://www.typescriptlang.org/play/#)，相关笔记请转到有道云笔记：typescript文件夹中查看。
## 基础判断

```
isArray：---export default <T = any>(value: unknown): value is T[] => Array.isArray(value);
isBoolean：---export default (value: unknown): value is boolean => typeof value === 'boolean';
isCheckBoxInput：---export default (type: string): boolean => type === 'checkbox';
isFunction：---export default (value: unknown): value is Function => typeof value === 'function';
isMultipleSelect：---export default (type: string): boolean => type === 'select-multiple';
isRadioInput：---export default (type?: string): boolean => type === 'radio';
isRegex：---export default (value: unknown): value is RegExp => value instanceof RegExp;
isString：---export default (value: unknown): value is string => typeof value === 'string';
isUndefined：---export default (val: unknown): val is undefined => val === undefined;
```
扩展: 关键字is与unknown
## 复杂判断
###### isDetached：判断传入的元素所在的节点树是否是孤立的，也就是说树的根节点不是document
```
/**
 * 判断传入的元素所在的节点树是否是孤立的，也就是说树的根节点不是document
 * 返回值： true表示元素在document上，false表示元素不再document上
 */
export type Inputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type Ref = Inputs | any;

export default function isDetached(element: Ref): boolean {
  if (!element) return true;

  if (
    !(element instanceof HTMLElement) ||
    element.nodeType === Node.DOCUMENT_NODE
  )
    return false;

  return isDetached(element.parentNode);
}
```
###### isNullOrUndefined：判断是null或者是undefined
```
import isUndefined from './isUndefined';

export default (value: unknown): value is null | undefined =>
  value === null || isUndefined(value);
```
###### isObject：判断是否是Object基类实例，不是null/undefined/Array/function
```
import isNullOrUndefined from './isNullOrUndefined';
import isArray from './isArray';

export default (value: unknown): value is object =>
  !isNullOrUndefined(value) && !isArray(value) && typeof value === 'object';
```
###### isEmptyObject：判断object是否是一个空的Object基类实例
```
import isObject from './isObject';

export default (value: unknown): boolean =>
  isObject(value) && Object.keys(value).length === 0;
```
###### isSameError：根据传入的type以及message判断传入的error是否是与之相同的error
```
export type Inputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type Ref = Inputs | any;
export interface FieldError {
  ref: Ref;
  type: string;
  message?: string;
  isManual?: boolean;
}

import isObject from './isObject';

export default (
  error: FieldError | undefined,
  type: string,
  message: string | undefined,
): boolean =>
  isObject(error) && (error.type === type && error.message === message);
```
## 监听目标DOM是否移除：onDomRemove
利用MutationObserver监听window.document的后代节点以及子节点的改动，如果发生改动则调用传入MutationObserver的回调函数，回调函数中会判断传入onDomRemove的dom是否被移除，如果移除了，则取消监听器的监听，然后执行传入onDomRemove的函数onDetachCallback

返回observer监听器
```
import { Ref, MutationWatcher } from '../types';
import isDetached from './isDetached';

// 监听window.document的后代节点以及子节点，并返回这个observer监听器
export default function onDomRemove(
  element: Ref,
  onDetachCallback: VoidFunction,
): MutationWatcher {
  // 传入一个回调函数，每当被指定的节点或子树以及配置项有Dom变动时会被调用。回调函数拥有两个参数：一个是描述所有被触发改动的MutationRecord对象数组，另一个是调用该函数的MutationObserver 对象。
  const observer = new MutationObserver((): void => {
    // 判断元素是否已经从document上移除
    if (isDetached(element)) {
      // 阻止 MutationObserver 实例继续接收的通知，直到再次调用其observe()方法，该观察者对象包含的回调函数都不会再被调用。
      // 如果元素已经移除则这个observer的回调不再执行
      observer.disconnect();
      // 当被移除的时候执行传入onDomRemove的第二个参数函数
      onDetachCallback();
    }
  });
  // 观察的节点是 window.document
  observer.observe(window.document, {
    childList: true,// 观察目标子节点的变化，添加或者删除
    subtree: true,// 默认为 false，设置为 true 可以观察后代节点
  });

  return observer;
}

```
扩展：MutationObserver

## 获取对象属性：get

```
/**
 * path: 'a.b'
 * obj: {a: {b: 1}}
 * 如果obj.a.b的值为undefined或者是传入的obj，那么返回默认值，否则返回obj.a.b
 */

export default (obj: any, path: string[] | string, defaultValue?: any) => {
  const result = String.prototype.split
    .call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce(
      (res, key) => (res !== null && res !== undefined ? res[key] : res),
      obj,
    );
  return result === undefined || result === obj ? defaultValue : result;
};
```


## getPath
types
```
export type BaseFieldValue = any;


/**
 * type FieldValues = {
 *   [x: string]: any;
 * }
 */
export type FieldValues = Record<string, BaseFieldValue>;

// Extract<T, U> -- 提取T中可以赋值给U的类型。
// 比如：
// type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"
// type T03 = Extract<string | number | (() => void), Function>;  // () => void

// 索引类型查询操作符：keyof FormValues的结果为 T上已知的公共属性名的联合
// 比如：
// interface Person {
//   name: string;
//   age: number;
// }
// let personProps: keyof Person; // 'name' | 'age'

// 因此下面的RawFieldName表示取出所有FormValues健为string类型的联合类型
// 比如：
// interface T1 {
//   0: 'a';
//   b: 0;
//   [key: number]: string
// }

// type T2 = Extract<
// keyof T1,
// number
// >; // T2 = number

// type T3 = Extract<
//   keyof T1,
//   string
// >; // T2 = "b"
export type RawFieldName<FormValues extends FieldValues> = Extract<
  keyof FormValues,
  string
>;

// FieldName类型是string或者FormValues中健名是string类型的健名联合类型
// 比如： type FormValues = {a: 1, b: 2, 0: 3}
//        那么FieldName就是 'a' | 'b' | string，也就是string
export type FieldName<FormValues extends FieldValues> =
  | RawFieldName<FormValues>
  | string;

```

源码
> getPath在value的健值为字符串的时候，才会输出结果
> flatArray用于拍平数组

比如： 

```
getPath('pre', {a: {b: 'next'}}) 返回 [['pre.c']]
flatArray([['pre.c']]) 返回['pre.c']
```
```
getPath('pre', {a: {b: {c: 'next'}}, a0: {b0: {c0: 'next0'}}}) 返回 [[['pre.c']],[['pre.c0']]]
flatArray([['pre.c']]) 返回['pre.next', 'pre.c0']
```


```
import flatArray from './flatArray';
import isString from './isString';
import isObject from './isObject';
import { FieldValues, FieldName } from '../types';
import isArray from './isArray';

const getPath = <FormValues extends FieldValues = FieldValues>(
  path: FieldName<FormValues>,
  values: FormValues | string[] | string,
): any =>
  isArray(values)
    ? values.map((item, index) => {
        const pathWithIndex = `${path}[${index}]`;

        if (isArray(item)) {
          return getPath(pathWithIndex, item);
        } else if (isObject(item)) {
          return Object.entries(item).map(([key, objectValue]: [string, any]) =>
            isString(objectValue)
              ? `${pathWithIndex}.${key}`
              : getPath(`${pathWithIndex}.${key}`, objectValue),
          );
        }

        return pathWithIndex;
      })
    : Object.entries(values).map(([key, objectValue]) =>
        isString(objectValue) ? `${path}.${key}` : getPath(path, objectValue),
      );

export default <FormValues extends FieldValues = FieldValues>(
  parentPath: FieldName<FormValues>,
  value: FormValues,
) => flatArray<FieldName<FormValues>>(getPath<FormValues>(parentPath, value));

```
扩展：typescript的Record

## 将value按照path路径设置到object对应的属性上中: set
如果path与object不对应，会导致传入的对象按照path的健重置为空数组或者空对象

```
import isObject from './isObject';
import isArray from './isArray';
import { FieldValues } from '../types';

const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/; // 获取第一个.或者[]包裹的内容（包括[]）
const reIsPlainProp = /^\w*$/; //匹配字母、数字、下划线
const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g; // 依此匹配出js对象取值的时候健与值，值包括[]
const reEscapeChar = /\\(\\)?/g;
const reIsUint = /^(?:0|[1-9]\d*)$/; // 0 或者 1-9开头的数字

// 判断输入的值是否可以作为index，前提是一个大于-1的数字
function isIndex(value: any) {
  return reIsUint.test(value) && value > -1;
}

// 字符串由字符下划线数字组成或者字符串不包含取值符号：比如.或者[]，那么这个字符串就可以作为一个健
export function isKey(value: [] | string) {
  if (isArray(value)) return false;
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value);
}

// 返回一个数组，包含了所有的健与值，当值是某个对象的某个属性并且被引号包裹的时候，这个值的整体会作为数组的一项
// 比如： "a['b[0]'].c" 返回['a','b[0]', c], "a[b[0]].c" 返回['a','b','0','c'] 
const stringToPath = (string: string): string[] => {
  const result: string[] = [];

  string.replace(
    rePropName,
    // match是rePropName匹配的子串，number，quote，string分别为rePropName第1，2，3个子表达式的字符串
    // 当match是['a[0]']的时候，number为undefined,quote为',string为双quote包裹的字符串
    (match: string, number: string, quote: string, string: string): any => {
      // 当quote与string有值的时候，将string的\\替换成\;如果没有quote则返回number,如果number为undefined则返回match
      result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
    },
  );

  return result;
};

// 将value按照path路径设置到object对应的属性上中，注意这里的value是字符串
// 当path上对应的属性找不到的时候,会导致设置失败
// 比如: 传入对象是a: {b: 0},value是'val',如果path是'a[b]'则会将object设置为{a:{b:'val'},必须传入'b'
export default function set(object: FieldValues, path: string, value: string) {
  let index = -1;
  // 通过path构建数组，数组排列方式是健，值，健，值...
  const tempPath = isKey(path) ? [path] : stringToPath(path);
  const length = tempPath.length;
  const lastIndex = length - 1;
  // 开始遍历object，从0开始
  while (++index < length) {
    // 取出一个健
    const key = tempPath[index];
    // 将newValue设置为传入的value
    let newValue: string | object = value;

    if (index !== lastIndex) {
      // 保存path当前key对应的value
      const objValue = object[key];
      // 如果path当前key对应的value是对象或者数组，则newValue重置为原来的对象或者数组
      newValue =
        isObject(objValue) || isArray(objValue)
          ? objValue
          : isIndex(tempPath[index + 1])
            ? []
            : {};
    }
    // 将新的值作为传入对象当前key属性的值，然后将object指向当前key对应的值，并开始下一轮的循环
    object[key] = newValue;
    object = object[key];
  }
  return object;
}


```

## validationModeChecker

```
import { VALIDATION_MODE } from '../constants';

export default (
  mode?: string,
): {
  isOnSubmit: boolean;
  isOnBlur: boolean;
  isOnChange: boolean;
} => ({
  isOnSubmit: !mode || mode === VALIDATION_MODE.onSubmit,
  isOnBlur: mode === VALIDATION_MODE.onBlur,
  isOnChange: mode === VALIDATION_MODE.onChange,
});

```






