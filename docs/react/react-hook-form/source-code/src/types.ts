import * as React from 'react';
import * as ReactNative from 'react-native';

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
// 那么FieldName就是 'a' | 'b' | string，也就是string
export type FieldName<FormValues extends FieldValues> =
  | RawFieldName<FormValues>
  | string;

export type FieldValue<FormValues extends FieldValues> = FormValues[FieldName<
  FormValues
>];

export type Inputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export type Ref = Inputs | any;

type Mode = keyof ValidationMode;

export type OnSubmit<FormValues extends FieldValues> = (
  data: FormValues,
  e: React.SyntheticEvent | ReactNative.GestureResponderEvent,
) => void | Promise<void>;

export interface ValidationMode {
  onBlur: 'onBlur';
  onChange: 'onChange';
  onSubmit: 'onSubmit';
}

export type SchemaValidateOptions = Partial<{
  strict: boolean;
  abortEarly: boolean;
  stripUnknown: boolean;
  recursive: boolean;
  context: object;
}>;

export interface Schema<Data> {
  validate(value: FieldValues, options?: SchemaValidateOptions): Promise<Data>;
}

export type Options<FormValues extends FieldValues = FieldValues> = Partial<{
  mode: Mode;
  reValidateMode: Mode;
  defaultValues: Partial<FormValues>;
  validationSchemaOption: SchemaValidateOptions;
  validationFields: FieldName<FormValues>[];
  validationSchema: any;
  nativeValidation: boolean;
  submitFocusError: boolean;
}>;

export interface MutationWatcher {
  disconnect: VoidFunction;
  observe?: any;
}

type ValidationOptionObject<Value> = Value | { value: Value; message: string };

export type ValidationTypes = number | string | RegExp;

export type ValidateResult =
  | string
  | boolean
  | void
  | Promise<string>
  | Promise<boolean>;

export type Validate = (data: BaseFieldValue) => ValidateResult;

export type ValidationOptions = Partial<{
  required: boolean | string;
  min: ValidationOptionObject<number | string>;
  max: ValidationOptionObject<number | string>;
  maxLength: ValidationOptionObject<number | string>;
  minLength: ValidationOptionObject<number | string>;
  pattern: ValidationOptionObject<RegExp>;
  validate:
  | Validate
  | Record<string, Validate>
  | { value: Validate | Record<string, Validate>; message: string };
}>;

export interface FieldError {
  ref: Ref;
  type: string;
  message?: string;
  isManual?: boolean;
}

export type ValidatePromiseResult = {} | void | FieldError;

export interface Field extends ValidationOptions {
  ref: Ref;
  mutationWatcher?: MutationWatcher;
  options?: {
    ref: Ref;
    mutationWatcher?: MutationWatcher;
  }[];
}

export type FieldsRefs<FormValues extends FieldValues> = Partial<
  Record<FieldName<FormValues>, Field>
>;

export type FieldErrors<FormValues extends FieldValues> = Partial<
  Record<FieldName<FormValues>, FieldError>
>;

export interface SubmitPromiseResult<FormValues extends FieldValues> {
  errors: FieldErrors<FormValues>;
  values: FormValues;
}

export interface SchemaValidationResult<FormValues> {
  fieldErrors: FieldErrors<FormValues>;
  result: FieldValues;
}

export interface ValidationPayload<Name, Value> {
  name: Name;
  value?: Value;
}

export interface FormState<FormValues extends FieldValues = FieldValues> {
  dirty: boolean;
  isSubmitted: boolean;
  submitCount: number;
  touched: FieldName<FormValues>[];
  isSubmitting: boolean;
  isValid: boolean;
}

export interface ElementLike {
  name: string;
  type?: string;
  value?: string;
  checked?: boolean;
  options?: any;
}
