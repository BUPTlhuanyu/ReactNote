import React, { useRef, useState, useCallback, useEffect } from 'react';
import * as ReactNative from 'react-native';
import attachEventListeners from './logic/attachEventListeners';
import combineFieldValues from './logic/combineFieldValues';
import findRemovedFieldAndRemoveListener from './logic/findRemovedFieldAndRemoveListener';
import getFieldsValues from './logic/getFieldValues';
import getFieldValue from './logic/getFieldValue';
import shouldUpdateWithError from './logic/shouldUpdateWithError';
import validateField from './logic/validateField';
import validateWithSchema from './logic/validateWithSchema';
import attachNativeValidation from './logic/attachNativeValidation';
import getDefaultValue from './logic/getDefaultValue';
import assignWatchFields from './logic/assignWatchFields';
import omitValidFields from './logic/omitValidFields';
import isCheckBoxInput from './utils/isCheckBoxInput';
import isEmptyObject from './utils/isEmptyObject';
import isRadioInput from './utils/isRadioInput';
import isObject from './utils/isObject';
import isArray from './utils/isArray';
import isString from './utils/isString';
import isSameError from './utils/isSameError';
import isUndefined from './utils/isUndefined';
import onDomRemove from './utils/onDomRemove';
import isMultipleSelect from './utils/isMultipleSelect';
import modeChecker from './utils/validationModeChecker';
import pickErrors from './logic/pickErrors';
import { EVENTS, RADIO_INPUT, UNDEFINED, VALIDATION_MODE } from './constants';
import isNullOrUndefined from './utils/isNullOrUndefined';
import {
  FieldValues,
  FieldName,
  FieldValue,
  FieldErrors,
  Field,
  FieldsRefs,
  Options,
  Ref,
  ValidationOptions,
  SubmitPromiseResult,
  OnSubmit,
  ValidationPayload,
  ElementLike,
  Inputs,
} from './types';

// 变量全部用ref
export default function useForm<FormValues extends FieldValues = FieldValues>({
  mode = VALIDATION_MODE.onSubmit, 
  reValidateMode = VALIDATION_MODE.onChange, // 在已经有错误的时候,这个模式会控制什么时候校验,如果是onChnge,在打字的时候都会判断
  validationSchema,
  defaultValues = {},
  validationFields,
  nativeValidation,
  submitFocusError = true,
  validationSchemaOption = { abortEarly: false },
}: Options<FormValues> = {}) {
  // 初始化设置
  const fieldsRef = useRef<FieldsRefs<FormValues>>({}); // fieldsRef这个ref是实时变化的
  const errorsRef = useRef<FieldErrors<FormValues>>({});
  const schemaErrorsRef = useRef<FieldErrors<FormValues>>({});
  const touchedFieldsRef = useRef(new Set<FieldName<FormValues>>());
  const watchFieldsRef = useRef<Partial<Record<keyof FormValues, boolean>>>({});
  const dirtyFieldsRef = useRef(new Set<FieldName<FormValues>>());
  const fieldsWithValidationRef = useRef(new Set<FieldName<FormValues>>());
  const validFieldsRef = useRef(new Set<FieldName<FormValues>>());
  const defaultValuesRef = useRef<
    Record<FieldName<FormValues>, FieldValue<FormValues>> // defaultValuesRef只有在reset以及初次注册的时候会变化
  >({} as Record<FieldName<FormValues>, FieldValue<FormValues>>);
  const isUnMount = useRef(false);
  const isWatchAllRef = useRef(false);
  const isSubmittedRef = useRef(false); // 已经提交过
  const isDirtyRef = useRef(false);
  const submitCountRef = useRef(0);
  const isSubmittingRef = useRef(false);
  const isSchemaValidateTriggeredRef = useRef(false);
  const validationFieldsRef = useRef(validationFields);
  const validateAndUpdateStateRef = useRef<Function>();
  const [, render] = useState();
  // isOnBlur表示是否失焦校验， isOnSubmit是否在提交的时候校验
  const { isOnBlur, isOnSubmit } = useRef(modeChecker(mode)).current;
  // 有错误已经发生后，校验的模式，在失焦才会重新验证，提交的时候才会重新验证，默认是在改变的时候就会重新验证
  const {
    isOnBlur: isReValidateOnBlur,
    isOnSubmit: isReValidateOnSubmit,
  } = useRef(modeChecker(reValidateMode)).current;
  // 校验规则配置
  const validationSchemaOptionRef = useRef(validationSchemaOption);
  validationFieldsRef.current = validationFields; // 多余的

  // 合并错误消息
  const combineErrorsRef = (data: FieldErrors<FormValues>) => ({
    ...errorsRef.current,
    ...data,
  });

  // 依赖校验规则，更具输入的error来设置相应的错误信息,如果没有错误,则从errorsref上删除name字段.最后重新渲染组件
  const renderBaseOnError = useCallback(
    (
      name: FieldName<FormValues>,
      error: FieldErrors<FormValues>,
      shouldRender: boolean = true,
    ) => {
      if (isEmptyObject(error)) {
        delete errorsRef.current[name];
        if (fieldsWithValidationRef.current.has(name) || validationSchema)
          validFieldsRef.current.add(name);
      } else {
        validFieldsRef.current.delete(name);
      }

      if (shouldRender) render({});
    },
    [validationSchema],
  );
  /**
   * 将传入的值rawValue设置到fieldsRef上name对应字段上，没有用callback
   * 对于radio与select需要将值设置到其ref.options中checked与selected属性上
   * 返回ref的type
   */
  const setFieldValue = (
    name: FieldName<FormValues>,
    rawValue: FieldValue<FormValues> | Partial<FormValues>,
  ): boolean => {
    const field = fieldsRef.current[name];

    if (!field) return false;

    const ref = field.ref;
    const { type } = ref;
    const options = field.options;
    const value =
      typeof document !== UNDEFINED &&
      typeof window !== UNDEFINED &&
      !isUndefined(window.HTMLElement) &&
      ref instanceof window.HTMLElement &&
      isNullOrUndefined(rawValue)
        ? ''
        : rawValue;

    if (isRadioInput(type) && options) {
      options.forEach(
        ({ ref: radioRef }) => (radioRef.checked = radioRef.value === value),
      );
    } else if (isMultipleSelect(type)) {
      [...ref.options].forEach(
        selectRef =>
          (selectRef.selected = (value as any).includes(selectRef.value)),
      );
    } else {
      ref[isCheckBoxInput(type) ? 'checked' : 'value'] = value;
    }

    return type;
  };

  /**
   * defaultValuesRef记录着reset以及register触发的时候每个字段的值
   * filedsRef实时记录着所有字段的值
   * dirtyFieldsRef: 记录着defaultValuesRef与filedsRef值不一样的字段
   * 如果filedsRef与defaultValuesRef中有字段的值不一样,就会被推入dirtyFieldsRef
   * isDirtyRef: dirtyFieldsRef是否为空
   * filedsRef与defaultValuesRef字段的值不一样的时候会被推入dirtyFieldsRef中,如果
   */
  const setDirty = (name: FieldName<FormValues>): boolean => {
    if (!fieldsRef.current[name]) return false;

    const isDirty =
      defaultValuesRef.current[name] !==
      getFieldValue(fieldsRef.current, fieldsRef.current[name]!.ref);
    const isDirtyChanged = dirtyFieldsRef.current.has(name) !== isDirty;

    if (isDirty) {
      dirtyFieldsRef.current.add(name);
    } else {
      dirtyFieldsRef.current.delete(name);
    }

    isDirtyRef.current = !!dirtyFieldsRef.current.size;
    return isDirtyChanged;
  };

  /**
   * 将字段添加到touchedFieldsRef,并强制重新渲染
   * 在设置值setValue的时候，因为这些value存储在ref中，因此每次改变都不会重渲染，因此每次setValue都需要手动渲染
   */
  const setValueInternal = useCallback(
    (name: FieldName<FormValues>, value: FieldValue<FormValues>): void => {
      const shouldRender = setFieldValue(name, value);
      if (
        setDirty(name) ||
        shouldRender ||
        !touchedFieldsRef.current.has(name)
      ) {
        touchedFieldsRef.current.add(name);
        render({});
      }
    },
    [],
  );

  /**
   * 利用默认的校验规则validateField进行校验
   * 返回的函数作用:
   * 1. 将value设置到name字段上
   * 2. 开始验证字段上的值
   * 3. 如果有error则将error添加到某些ref上对应字段上并重新渲染,如果没有error则删除对应该ref上的字段.
   * 4. 返回是否发生error
   */
  const executeValidation = useCallback(
    async (
      {
        name,
        value,
      }: {
        name: FieldName<FormValues>;
        value?: FormValues[FieldName<FormValues>];
      },
      shouldRender: boolean = true,
    ): Promise<boolean> => {
      const field = fieldsRef.current[name]!;

      if (!field) return false;
      if (!isUndefined(value)) setValueInternal(name, value);

      const error = await validateField(field, fieldsRef.current);
      errorsRef.current = combineErrorsRef(error);
      renderBaseOnError(name, error, shouldRender);

      return isEmptyObject(error);
    },
    [renderBaseOnError, setValueInternal],
  );

  /**
   * 返回函数的作用:
   * 利用validationSchema来进行校验
   *  {
          result: await validationSchema.validate(data, validationSchemaOption),
          fieldErrors: {},
      }
   */
  const validateWithSchemaCurry = useCallback(
    validateWithSchema.bind(
      null,
      validationSchema,
      validationSchemaOptionRef.current,
    ),
    [validationSchema],
  );

  /**
   * 利用默认的校验规则validationSchema进行校验,找出发生错误并且出现在传入字段中的字段以及错误,并存入errorsRef
   * 返回函数作用:
   * 1. 首先校验所有字段的值,然后获取字段的errors
   * 2. 将传入的参数中的字段解析成数组
   * 3. 找出传入的字段中没有发生错误的字段
   * 4. 将错误存储在schemaErrorsRef,isSchemaValidateTriggeredRef设置为true,表示已经出发了校验
   * 5. 得到传入的字段对应的错误数组{字段:{message,ref,type}}[]
   * 6. 重新渲染,返回是否有错误
   */
  const executeSchemaValidation = useCallback(
    async (
      payload:
        | ValidationPayload<FieldName<FormValues>, FieldValue<FormValues>>
        | ValidationPayload<FieldName<FormValues>, FieldValue<FormValues>>[],
    ): Promise<boolean> => {
      // 1
      const { fieldErrors } = await validateWithSchemaCurry(
        // 获取所有字段的值,并按照fieldsRef中存储的name，比如'a.b'，拼装成复杂数据结构的form数据
        combineFieldValues(getFieldsValues(fieldsRef.current)),
      );
      // 2
      const names = isArray(payload)
        ? payload.map(({ name }) => name)
        : [payload.name];
      // 3
      const validFieldNames = names.filter(
        name => !(fieldErrors as FieldErrors<FormValues>)[name],
      );
      // 4
      schemaErrorsRef.current = fieldErrors;
      isSchemaValidateTriggeredRef.current = true;

      // 5
      errorsRef.current = omitValidFields<FormValues>(
        combineErrorsRef(
          Object.entries(fieldErrors)
            .filter(([key]) => names.includes(key as FieldName<FormValues>))
            .reduce(
              (previous, [name, error]) => ({ ...previous, [name]: error }),
              {},
            ),
        ),
        validFieldNames,
      );

      // 6
      render({});

      return isEmptyObject(errorsRef.current);
    },
    [validateWithSchemaCurry],
  );

  /**
   * 触发校验
   * 1. 获取所有字段,组装成数组{name: string}[]
   * 2. 如果存在yup校验,则进行yup校验
   * 3. 如果不存在yup校验并且字段是一个数组,则开始并行校验,然后触发重新渲染,最后返回数组Boolean[]
   * 4. 如果不存在yup校验并且字段不是一个数组,则直接校验并返回一个Boolean,表示是否有错误
   */
  const triggerValidation = useCallback(
    async (
      payload?:
        | ValidationPayload<FieldName<FormValues>, FieldValue<FormValues>>
        | ValidationPayload<FieldName<FormValues>, FieldValue<FormValues>>[],
      shouldRender?: boolean,
    ): Promise<boolean> => {
      // 1
      const fields: any =
        payload || Object.keys(fieldsRef.current).map(name => ({ name }));
      // 2
      if (validationSchema) return executeSchemaValidation(fields);
      // 3
      if (isArray(fields)) {
        const result = await Promise.all(
          fields.map(async data => await executeValidation(data, false)),
        );
        render({});
        return result.every(Boolean);
      }

      return await executeValidation(fields, shouldRender);
    },
    [executeSchemaValidation, executeValidation, validationSchema],
  );

  /**
   * 传入字段名称/字段值/是否需要校验
   * 1. setValueInternal设置值并重新渲染
   * 2. 根据有字段被监听来判断是否需要渲染,因为有时候,会用到这些字段进行条件渲染,二这些字段又是在ref中的,为了更新UI需要额外的手动触发重新渲染
   * 3. 如果需要校验,则触发校验,并返回是否有错误
   * 4. 如果需要重新渲染,则调用render触发重新渲染
   */
  const setValue = useCallback(
    (
      name: FieldName<FormValues>,
      value: FieldValue<FormValues>,
      shouldValidate: boolean = false,
    ): void | Promise<boolean> => {
      // 1
      setValueInternal(name, value);
      // 2
      const shouldRender =
        isWatchAllRef.current || watchFieldsRef.current[name];
      // 3
      if (shouldValidate) {
        return triggerValidation({ name }, shouldRender);
      }
      // 4
      if (shouldRender) render({});
    },
    [setValueInternal, triggerValidation],
  );

  /**
   * async函数是绑定在DOM事件上的回调函数
   * 当这些事件触发时如果需要校验,那么会调用这个async函数,进行校验与重新渲染
   * 1. useForm传入的validationFields表示需要验证的字段,当事件发生的时候对应的字段不在validationFields中,则直接跳过校验,函数结束
   * 2. 保证有该字段,否则结束函数
   * 3. ...
   */
  validateAndUpdateStateRef.current = validateAndUpdateStateRef.current
    ? validateAndUpdateStateRef.current
    : async (event: MouseEvent): Promise<void> => {
        const { type, target } = event;
        const name = target ? (target as Inputs).name : '';
        // 1
        if (
          isArray(validationFieldsRef.current) &&
          !validationFieldsRef.current.includes(name)
        )
          return;
        // 2
        const fields = fieldsRef.current;
        const errors = errorsRef.current;
        const ref = fields[name];
        let error;

        if (!ref) return;  
        const isBlurEvent = type === EVENTS.BLUR;
        const shouldSkipValidation = // 需要跳过校验
          (isOnSubmit && !isSubmittedRef.current) || // 提交的时候校验并且还没有提交过
          (isOnBlur && !isBlurEvent && !errors[name]) || // 失焦的时候验证,并且该字段没有错误
          (isReValidateOnBlur && !isBlurEvent && errors[name]) || // 在已经有错误的时候, 失焦的时候验证
          (isReValidateOnSubmit && errors[name]);//在已经有错误的时候, 提交的时候验证
          // 是否有字段的值改变了
        const shouldUpdateDirty = setDirty(name);
        // 是否需要更新状态
        let shouldUpdateState =
          isWatchAllRef.current ||
          watchFieldsRef.current[name as FieldName<FormValues>] ||
          shouldUpdateDirty;
        // touchedFieldsRef中存储的是值改变的那些字段名称
        if (!touchedFieldsRef.current.has(name)) {
          touchedFieldsRef.current.add(name);
          shouldUpdateState = true;
        }
        // 如果跳过校验,则重新渲染
        if (shouldSkipValidation)
          return shouldUpdateState ? render({}) : undefined;
        // 开始validationSchema校验
        if (validationSchema) {
          const { fieldErrors } = await validateWithSchemaCurry(
            combineFieldValues(getFieldsValues(fields)),
          );
          schemaErrorsRef.current = fieldErrors;
          isSchemaValidateTriggeredRef.current = true;
          error = (fieldErrors as FieldErrors<FormValues>)[name]
            ? { [name]: (fieldErrors as FieldErrors<FormValues>)[name] }
            : {};
        } else {
          // 开始默认校验
          error = await validateField(ref, fields, nativeValidation);
        }
        // 判断验证是否失败
        const shouldUpdate = shouldUpdateWithError<FormValues>({
          errors,
          error,
          name,
          validFields: validFieldsRef.current,
          fieldsWithValidation: fieldsWithValidationRef.current,//具有校验规则ValidationOptions 的字段，这个在注册的时候会添加到fieldsWithValidationRef
        });
        // 将error添加到ErrorsRef上
        if (shouldUpdate) {
          errorsRef.current = combineErrorsRef(error as FieldErrors<
            FormValues
          >);
          renderBaseOnError(name, error as FieldErrors<FormValues>);
          return;
        }

        if (shouldUpdateState) render({});
      };

  /**
   * 
   * @param name 字段名称
   * 重置存储在ref中对应字段的值
   */
  const resetFieldRef = (name: FieldName<FormValues>) => {
    delete watchFieldsRef.current[name];
    delete errorsRef.current[name];
    delete fieldsRef.current[name];
    delete defaultValuesRef.current[name];
    [
      touchedFieldsRef,
      dirtyFieldsRef,
      fieldsWithValidationRef,
      validFieldsRef,
    ].forEach(data => data.current.delete(name));
  };

  
  /**
   * 删除ref中的字段,以及删除监听器
   */
  const removeEventListenerAndRef = useCallback(
    (field: Field | undefined, forceDelete?: boolean) => {
      if (!field) return;

      findRemovedFieldAndRemoveListener(
        fieldsRef.current,
        validateAndUpdateStateRef.current,
        field,
        forceDelete,
      );
      resetFieldRef(field.ref.name);
    },
    [],
  );

  /**
   * 函数重载
   * 清除指定字段的错误,并重新渲染,去掉UI上的错误提示
   */
  function clearError(): void;
  function clearError(name: FieldName<FormValues>): void;
  function clearError(names: FieldName<FormValues>[]): void;
  function clearError(
    name?: FieldName<FormValues> | FieldName<FormValues>[],
  ): void {
    if (isUndefined(name)) {
      errorsRef.current = {};
    } else {
      (isArray(name) ? name : [name]).forEach(
        fieldName => delete errorsRef.current[fieldName],
      );
    }

    render({});
  }

  /**
   * 
   * @param name 
   * @param type 
   * @param message 
   * @param ref 
   * 将错误设置到errorsRef上,并重新渲染,更新视图
   */
  const setError = (
    name: FieldName<FormValues>,
    type: string,
    message?: string,
    ref?: Ref,
  ): void => {
    const errors = errorsRef.current;

    if (!isSameError(errors[name], type, message)) {
      errors[name] = {
        type,
        message,
        ref,
        isManual: true,
      };
      render({});
    }
  };

  /**
   * 将需要监听的某些字段添加到watchFieldsRef，并返回这些字段的值
   */
  function watch(): FormValues;
  function watch(
    field: FieldName<FormValues>,
    defaultValue?: string,
  ): FieldValue<FormValues>;
  function watch(
    fields: FieldName<FormValues>[],
    defaultValues?: Partial<FormValues>,
  ): Partial<FormValues>;
  function watch(
    fieldNames?: FieldName<FormValues> | FieldName<FormValues>[],
    defaultValue?: string | Partial<FormValues>,
  ): FieldValue<FormValues> | Partial<FormValues> | string | undefined {
    const fieldValues = getFieldsValues<FormValues>(fieldsRef.current);
    const watchFields = watchFieldsRef.current;

    if (isString(fieldNames)) {
      // assignWatchFields返回fieldNames对应的值，并将watchFields的值设置为true
      const value = assignWatchFields<FormValues>(
        fieldValues,
        fieldNames,
        watchFields,
      );
      // 返回watch的字段对应的值，如果为undefined则返回默认值 
      return isUndefined(value)
        ? isUndefined(defaultValue)
          ? getDefaultValue(defaultValues, fieldNames)
          : defaultValue
        : value;
    }

    // 如果watch的是一堆字段，则返回这些字段对应的值
    if (isArray(fieldNames)) {
      return fieldNames.reduce((previous, name) => {
        let value = getDefaultValue(defaultValues, name);

        if (isEmptyObject(fieldsRef.current) && isObject(defaultValue)) {
          value = defaultValue[name];
        } else {
          const tempValue = assignWatchFields<FormValues>(
            fieldValues,
            name,
            watchFields,
          );

          if (!isUndefined(tempValue)) value = tempValue;
        }

        return {
          ...previous,
          [name]: value,
        };
      }, {});
    }
    // watch所有的字段
    isWatchAllRef.current = true;

    return (
      (!isEmptyObject(fieldValues) && fieldValues) ||
      defaultValue ||
      defaultValues
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * 首先会判断字段是否存在
   * 如果不存在: 
   * 1. 将校验规则validateOptions以及ref的监听器设置到字段上
   * 2. 根据初始值defaultValues,设置字段的初始值
   * 3. 根据失焦/值变化/提交来设置校验回调
   * 4. 将默认值备份到defaultValuesRef
   * 5. 利用原生事件绑定校验函数，因此每个DOM标签都有一个事件监听器来处理这个DOM的值，默认绑定的事件是change（checkbox或者radio）或者input（其他DOM标签），如果需要失焦校验则需要额外再绑定blur事件
   */
  function registerIntoFieldsRef<Element extends ElementLike>(
    ref: Element,
    validateOptions: ValidationOptions = {},
  ): void {
    // 注册需要提供一个具备name的ref
    if (!ref.name) return console.warn('Missing name on ref', ref);

    // name 表示dom上用于注册字段的名字
    // type 表示这个dom的类型，比如radio
    // value 表示这个dom的值
    const { name, type, value } = ref;
    const typedName = name as FieldName<FormValues>;
    const fieldAttributes = {
      ref,
      ...validateOptions,
    };
    // 所有字段对应的校验规则对应的ref都会存储在fields中，ref中的name对应的是DOM上的name属性
    const fields: FieldsRefs<FormValues> = fieldsRef.current;
    // 判断是否是radio
    const isRadio = isRadioInput(type);
    // 在fields中获取当前name对应的field,对于radio这个field.option包括了所有的子节点radio
    let currentField = (fields[typedName] || undefined) as Field;
    // 如果不是radio则返回上一步获取的field
    // 如果是radio则根据value找到对应ref
    const isRegistered = isRadio
      ? currentField &&
        isArray(currentField.options) &&
        currentField.options.find(({ ref }: Field) => value === ref.value)
      : currentField;
    // 如果isRegistered存在，说明已经注册过了，直接返回
    if (isRegistered) return;

    // 如果没有类型，则将校验规则设置到字段上
    // 如果有type类型,则创建一个监听mutationWatcher器并将校验规则设置到字段上.
    if (!type) {
      currentField = fieldAttributes;
    } else {
      const mutationWatcher = onDomRemove(ref, () =>
        removeEventListenerAndRef(fieldAttributes),
      );

      if (isRadio) {
        currentField = {
          options: [
            ...(currentField && currentField.options
              ? currentField.options
              : []),
            {
              ref,
              mutationWatcher,
            },
          ],
          ref: { type: RADIO_INPUT, name },
          ...validateOptions,
        };
      } else {
        currentField = {
          ...fieldAttributes,
          mutationWatcher,
        };
      }
    }

    // 将当前的field设置完校验规则之后将其赋值到对应的字段
    fields[typedName] = currentField;

    // 由于是首次注册所以可能会从默认值中取值并初始化ref中的值
    // 默认值不是空，则从中取出对应字段的有效值设置到内部收集的ref对应字段上
    if (!isEmptyObject(defaultValues)) {
      const defaultValue = getDefaultValue(defaultValues, name);

      if (!isUndefined(defaultValue)) setFieldValue(name, defaultValue);
    }

    // 处理校验规则，每个字段对应一个校验规则
    if (validateOptions && !isEmptyObject(validateOptions)) {
      fieldsWithValidationRef.current.add(name);

      // 如果是失焦或者值变化的时候需要校验，则将开始监听错误
      if (!isOnSubmit) {
        if (validationSchema) {
          // 开始用yup设置校验回调
          isSchemaValidateTriggeredRef.current = true;
          validateWithSchemaCurry(
            combineFieldValues(getFieldsValues(fields)),
          ).then(({ fieldErrors }) => {
            schemaErrorsRef.current = fieldErrors;
            if (isEmptyObject(schemaErrorsRef.current)) render({});
          });
        } else {
          // 根据校验规则设置自身的校验回调
          validateField(currentField, fields).then(error => {
            if (isEmptyObject(error)) validFieldsRef.current.add(name);

            if (
              validFieldsRef.current.size ===
              fieldsWithValidationRef.current.size
            )
            // 在发生错误的时候会需要强制重新渲染，显示错误
              render({});
          });
        }
      }
    }

    // 将默认值设置到defaultValuesRef对应字段
    if (!defaultValuesRef.current[typedName])
      defaultValuesRef.current[typedName] = getFieldValue(
        fields,
        currentField.ref,
      );

      // 如果没有type，直接返回。否则处理radio
    if (!type) return;

    // 
    const fieldToRegister =
      isRadio && currentField.options
        ? currentField.options[currentField.options.length - 1]
        : currentField;

    if (isOnSubmit && isReValidateOnSubmit) return;

    // 处理是否使用浏览器原生验证
    if (nativeValidation && validateOptions) {
      attachNativeValidation(ref, validateOptions);
    } else {
      attachEventListeners({
        field: fieldToRegister,
        isRadio,
        validateAndStateUpdate: validateAndUpdateStateRef.current,
        isOnBlur,
        isReValidateOnBlur,
      });
    }
  }

  // 在input不需要使用ref来进行跳转或者其他操作的时候，会用到这个register，只需要添加一个校验规则即可
  // 例如：
  // <input name="exampleRequired" ref={register({ required: true })} />
  // register({ required: true })会返回一个函数(ref: Element | null) => void，这里react的ref将会接收到一个函数
  function register<Element extends ElementLike = ElementLike>(
    validateRule: ValidationOptions,
  ): (ref: Element | null) => void;
  // 手动调用方式，或者在ref需要共享的时候
  // 手动调用方式：
  //    useEffect(() => {
  //      register({ name: "antDInput" });
  //    }, []);
  // ref需要共享的时候：
  //    <input name="firstName" ref={(e) => {
  //      register(e)
  //      firstNameRef.current = e // you can still assign to your own ref
  //    }} />
  function register<Element extends ElementLike = ElementLike>(
    ref: Element | null,
    validationOptions?: ValidationOptions,
  ): void;
  // 重载的实现，传入的函数只能是上面定义的两种
  // 对于注册的时候name为'a.b'这种形式的字段，经过register处理，fieldsRef上会存在fieldsRef['a.b']这样的值
  // 在获取值得时候，
  function register<Element extends ElementLike = ElementLike>(
    refOrValidateRule: ValidationOptions | Element | null,
    validationOptions?: ValidationOptions,
  ): ((ref: Element | null) => void) | void {
    if (typeof window === UNDEFINED || !refOrValidateRule) return;

    if (
      // 第一个参数是对象 && 第一个参数具备name属性或者第二个参数存在
      // 也就是匹配到第二个register
      isObject(refOrValidateRule) &&
      (validationOptions || 'name' in refOrValidateRule)
    ) {
      // 那么开始注册，并返回空
      registerIntoFieldsRef(refOrValidateRule as Element, validationOptions);
      return;
    }
    // 对应第一个register，返回一个接收ref的函数
    return (ref: Element | null) =>
      ref && registerIntoFieldsRef(ref, refOrValidateRule);
  }

  /**
   * 移除字段ref以及移出事件监听器
   */
  function unregister(name: FieldName<FormValues>): void;
  function unregister(names: FieldName<FormValues>[]): void;
  function unregister(
    names: FieldName<FormValues> | FieldName<FormValues>[],
  ): void {
    if (isEmptyObject(fieldsRef.current)) return;
    (isArray(names) ? names : [names]).forEach(fieldName =>
      removeEventListenerAndRef(fieldsRef.current[fieldName], true),
    );
  }

  /**
   * 这个函数在提交的时候会处理整个form表单的data，这里涉及到如何将'a.b'这样的注册的字段的值取出来
   * 主要看combineFieldValues(fieldValues)这个关键的函数，这个函数在遇到fieldsRef中包含有.或者[]的健的时候，会调用set来拼接组装出一个具备复杂数据结构的form数据
   * @param callback 
   */
  const handleSubmit = (callback: OnSubmit<FormValues>) => async (
    e: React.SyntheticEvent | ReactNative.GestureResponderEvent,
  ): Promise<void> => {
    if (e) {
      // 阻止默认行为
      e.preventDefault();
      // 允许将event对象传递给其他异步回调函数
      e.persist();
    }
    // 
    let fieldErrors;
    let fieldValues;
    // 获取存储了字段的ref
    const fields = fieldsRef.current;
    // 获取需要提交的时候进行验证的字段，因为有的时候有的字段是事实或者失焦的校验
    const fieldsToValidate: (Field | undefined)[] = validationFields
      ? validationFields.map(name => fieldsRef.current[name])
      : Object.values(fields);
    // 将标志提交的ref的值设置为true
    isSubmittingRef.current = true;
    // 手动强制渲染
    render({}); 
    // 开始校验
    if (validationSchema) {
      // 有自定义的校验规则，获取需要校验字段的值，普通的DOM直接返回DOM对应的ref上的value，其他的则特殊处理
      fieldValues = getFieldsValues(fields);
      // 校验
      const output = await validateWithSchemaCurry(
        combineFieldValues(fieldValues),
      );
      // 将错误存储到自定义存在的schemaErrorsRef以及fieldErrors中
      schemaErrorsRef.current = output.fieldErrors;
      fieldErrors = output.fieldErrors;
      // 将经过校验后的值（一般不会改变，这里作用不太明确，得查阅yup是否会对传入的需要校验的值进行修改）返回给fieldValues
      fieldValues = output.result;
    } else {
      // 原生的校验规则
      const {
        errors,
        values,
      }: SubmitPromiseResult<FormValues> = await fieldsToValidate.reduce(
        async (
          previous: Promise<SubmitPromiseResult<FormValues>>,
          field: Field | undefined,
        ): Promise<SubmitPromiseResult<FormValues>> => {
          if (!field) return previous;

          const resolvedPrevious: any = await previous;
          const {
            ref,
            ref: { name },
          } = field;

          if (!fields[name]) return Promise.resolve(resolvedPrevious);

          const fieldError = await validateField(
            field,
            fields,
            nativeValidation,
          );

          if (fieldError[name]) {
            resolvedPrevious.errors = {
              ...resolvedPrevious.errors,
              ...fieldError,
            };

            validFieldsRef.current.delete(name);

            return Promise.resolve(resolvedPrevious);
          }

          if (fieldsWithValidationRef.current.has(name))
            validFieldsRef.current.add(name);
          resolvedPrevious.values[name] = getFieldValue(fields, ref);
          return Promise.resolve(resolvedPrevious);
        },
        Promise.resolve<SubmitPromiseResult<FormValues>>({
          errors: {},
          values: {} as FormValues,
        }),
      );

      fieldErrors = errors;
      fieldValues = values;
    }
    //  
    if (isEmptyObject(fieldErrors)) {
      // 如果没有错误，将errorsRef置空，然后调用回调函数
      errorsRef.current = {};
      await callback(combineFieldValues(fieldValues), e);
    } else {
      // useForm的时候submitFocusError为true表示在发生错误的时候，自动聚焦到发生错误的DOM，但是这只对那些在DOM上进行注册的DOM有效，手动注册无效。这个是比较严重的缺点。
      if (submitFocusError) {
        // 由于所有DOM的ref都被存储下来了，所以可以直接调用DOM的focus函数
        Object.keys(fieldErrors).reduce((previous, current) => {
          const field = fields[current];
          if (field && field.ref.focus && previous) {
            field.ref.focus();
            return false;
          }
          return previous;
        }, true);
      }
      // 保存错误
      errorsRef.current = fieldErrors;
    }
    // 如果已经卸载了，直接返回 
    if (isUnMount.current) return;

    // 设置相关的标记
    isSubmittedRef.current = true;
    isSubmittingRef.current = false;
    submitCountRef.current = submitCountRef.current + 1;
    // 手动触发render
    render({});
  };

  /**
   * 重置ref
   */
  const resetRefs = () => {
    errorsRef.current = {};
    schemaErrorsRef.current = {};
    touchedFieldsRef.current = new Set();
    watchFieldsRef.current = {};
    dirtyFieldsRef.current = new Set();
    fieldsWithValidationRef.current = new Set();
    validFieldsRef.current = new Set();
    defaultValuesRef.current = {} as Record<
      FieldName<FormValues>,
      FieldValue<FormValues>
    >;
    isWatchAllRef.current = false;
    isSubmittedRef.current = false;
    isDirtyRef.current = false;
    isSchemaValidateTriggeredRef.current = false;
  };

  /**
   * 重置字段的值以及所有ref，然后将传入的values设置到对应的字段上，然后将提交次数计数器重置为0并手动渲染组件
   */
  const reset = useCallback((values?: FormValues): void => {
    const fieldsKeyValue = Object.entries(fieldsRef.current);

    for (let [, value] of fieldsKeyValue) {
      if (value && value.ref && value.ref.closest) {
        try {
          value.ref.closest('form').reset();
          break;
        } catch {}
      }
    }

    resetRefs();

    if (values) {
      fieldsKeyValue.forEach(([key]) =>
        setFieldValue(
          key as FieldName<FormValues>,
          getDefaultValue(values, key),
        ),
      );
      defaultValuesRef.current = { ...values } as Record<
        FieldName<FormValues>,
        FieldValue<FormValues>
      >;
    }

    submitCountRef.current = 0;
    render({});
  }, []);

  /**
   * 返回字段对应的值
   * @param payload 当nest为true的时候，调用combineFieldValues返回一个级联的表单数据；否则返回拍平的数据结构
   */
  const getValues = (payload?: { nest: boolean }): FormValues => {
    const fieldValues = getFieldsValues(fieldsRef.current);
    const output =
      payload && payload.nest ? combineFieldValues(fieldValues) : fieldValues;

    return isEmptyObject(output) ? defaultValues : output;
  };

  /**
   * 返回一个函数，用于组件卸载的时候，将isUnMount设置为true，然后移除事件监听器并清空ref
   */
  useEffect(
    () => () => {
      isUnMount.current = true;
      fieldsRef.current &&
        Object.values(fieldsRef.current).forEach(
          (field: Field | undefined): void =>
            removeEventListenerAndRef(field, true),
        );
    },
    [removeEventListenerAndRef],
  );

  return {
    register: useCallback(register, [registerIntoFieldsRef]),
    unregister: useCallback(unregister, [
      unregister,
      removeEventListenerAndRef,
    ]),
    handleSubmit,
    watch,
    reset,
    clearError,
    setError,
    setValue,
    triggerValidation,
    getValues,
    errors: validationFields
      ? pickErrors<FormValues>(errorsRef.current, validationFields)
      : errorsRef.current,
    formState: {
      dirty: isDirtyRef.current,
      isSubmitted: isSubmittedRef.current,
      submitCount: submitCountRef.current,
      touched: [...touchedFieldsRef.current],
      isSubmitting: isSubmittingRef.current,
      ...(isOnSubmit
        ? {
            isValid: isEmptyObject(errorsRef.current),
          }
        : {
            isValid: validationSchema
              ? isSchemaValidateTriggeredRef.current &&
                isEmptyObject(schemaErrorsRef.current)
              : fieldsWithValidationRef.current.size
              ? !isEmptyObject(fieldsRef.current) &&
                validFieldsRef.current.size >=
                  fieldsWithValidationRef.current.size
              : !isEmptyObject(fieldsRef.current),
          }),
    },
  };
}
