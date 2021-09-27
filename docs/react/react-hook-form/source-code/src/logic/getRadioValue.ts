import isArray from '../utils/isArray';
import { Ref, MutationWatcher } from '../types';

interface RadioFieldResult {
  isValid: boolean;
  value: number | string;
}

const defaultReturn: RadioFieldResult = {
  isValid: false,
  value: '',
};

// 处理radio的字段
// 如果传入radio的options不是一个数组，则说明没有radio选项，所以是无效的，值为空，返回defaultReturn
// 如果是一个数组，那么开始遍历每个radio选项{ref，mutationWatcher}，当选项的ref上的checked为true则表示被选中了，
// 这个函数有些问题，可以优化一下，函数实际的效果是遇到第一个checked为true，那么结果就是{isValid: true,value,}
// 如果radio都没有被选中,那么就是defaultReturn
export default (
  options?: {
    ref?: Ref;
    mutationWatcher?: MutationWatcher;
  }[],
): RadioFieldResult =>
  isArray(options)
    ? options.reduce(
      (previous, { ref: { checked, value } }: Ref): RadioFieldResult =>
        checked
          ? {
            isValid: true,
            value,
          }
          : previous,
      defaultReturn,
    )
    : defaultReturn;
