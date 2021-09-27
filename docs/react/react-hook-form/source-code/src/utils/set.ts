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
