import getFieldValue from './getFieldValue';
import { FieldValues, Ref } from '../types';

// 输入fields,从fileds中取出字段对应的所有值,并返回一个对象,该对象的健为字段名称,值为getFieldValue获取的值
export default <FormValues extends FieldValues>(fields: FieldValues) =>
  Object.values(fields).reduce<FormValues>(
    (previous, { ref, ref: { name } }: Ref) => ({
      ...previous,
      ...{ [name]: getFieldValue(fields, ref) },
    }),
    {} as FormValues,
  );
