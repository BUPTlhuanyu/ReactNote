import getRadioValue from './getRadioValue';
import getMultipleSelectValue from './getMultipleSelectValue';
import isRadioInput from '../utils/isRadioInput';
import isCheckBox from '../utils/isCheckBoxInput';
import isUndefined from '../utils/isUndefined';
import isMultipleSelect from '../utils/isMultipleSelect';
import { FieldsRefs, Ref, FieldValues } from '../types';

export default function getFieldValue<FormValues extends FieldValues>(
  fields: FieldsRefs<FormValues>,
  ref: Ref,
) {
  const { type, name, options, checked, value, files } = ref;

  if (type === 'file') {
    return files;
  }
  // 处理radio,返回被选中的radio的值
  if (isRadioInput(type)) {
    const field = fields[name];
    return field ? getRadioValue(field.options).value : '';
  }
  // 返回被选中的option的值组成的数组
  if (isMultipleSelect(type)) return getMultipleSelectValue(options);
  // 如果是选项框,并且被选中了,则返回checkbox标签上的value属性的值,没有value则返回true.如果没被选中返回false
  if (isCheckBox(type)) {
    if (checked) {
      return ref.attributes && ref.attributes.value
        ? isUndefined(value) || value === ''
          ? true
          : value
        : true;
    }
    return false;
  }

  return value;
}
