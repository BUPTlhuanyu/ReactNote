import combineFieldValues from './combineFieldValues';
import get from '../utils/get';
import getPath from '../utils/getPath';
import isEmptyObject from '../utils/isEmptyObject';
import isUndefined from '../utils/isUndefined';
import isArray from '../utils/isArray';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import { FieldValue, FieldValues, FieldName } from '../types';

/**
 * 将要被监听的字段fieldName传入watchFields，并设置为true，然后从fieldValues中找出fieldName对应的值
 */
export default <FormValues extends FieldValues>(
  fieldValues: FormValues,
  fieldName: FieldName<FormValues>,
  watchFields: Partial<Record<FieldName<FormValues>, boolean>>,
): FieldValue<FormValues> | Partial<FormValues> | undefined => {
  // 1： 
  if (isNullOrUndefined(fieldValues) || isEmptyObject(fieldValues))
    return undefined;

  if (!isUndefined(fieldValues[fieldName])) {
    watchFields[fieldName] = true;
    return fieldValues[fieldName];
  }

  const values = get(combineFieldValues(fieldValues), fieldName);

  if (!isUndefined(values)) {
    const result = getPath<FormValues>(fieldName, values);

    if (isArray(result)) {
      result.forEach(name => {
        watchFields[name] = true;
      });
    }
  }

  return values;
};
