import isArray from './isArray';

// 只是拍平数组
export default function flatArray<T>(list: T[]): T[] {
  return list.reduce<T[]>(
    (a, b) => a.concat(isArray(b) ? flatArray(b) : b),
    [],
  );
}
