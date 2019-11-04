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
