// 返回options中被选中的option标签对应的value
export default (
  options: HTMLOptionElement[] | HTMLOptionsCollection,
): string[] =>
  [...options]
    .filter(({ selected }): boolean => selected)
    .map(({ value }): string => value);
