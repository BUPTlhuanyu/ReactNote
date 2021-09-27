import * as React from 'react';
import {
  FieldValues,
  FieldName,
  FieldValue,
  ElementLike,
  FormState,
  FieldErrors,
  OnSubmit,
  Ref,
  ValidationOptions,
  ValidationPayload,
} from './types';

export interface FormProps<FormValues extends FieldValues = FieldValues>
  extends FormContextValues<FormValues> {
  children: JSX.Element[] | JSX.Element;
}

export interface FormContextValues<
  FormValues extends FieldValues = FieldValues
> {
  register<Element extends ElementLike = ElementLike>(
    validateRule: ValidationOptions,
  ): (ref: Element | null) => void;
  register<Element extends ElementLike = ElementLike>(
    ref: Element | null,
    validationOptions?: ValidationOptions,
  ): void;
  unregister(name: FieldName<FormValues>): void;
  unregister(names: (FieldName<FormValues>)[]): void;
  handleSubmit: (
    callback: OnSubmit<FormValues>,
  ) => (e: React.SyntheticEvent) => Promise<void>;
  watch(): FormValues;
  watch(
    field: FieldName<FormValues>,
    defaultValue?: string,
  ): FieldValue<FormValues>;
  watch(
    fields: FieldName<FormValues>[],
    defaultValues?: Partial<FormValues>,
  ): Partial<FormValues>;
  reset: (values?: FieldValues) => void;
  clearError(): void;
  clearError(name: FieldName<FormValues>): void;
  clearError(names: FieldName<FormValues>[]): void;
  setError: (
    name: FieldName<FormValues>,
    type: string,
    message?: string,
    ref?: Ref,
  ) => void;
  setValue: (
    name: FieldName<FormValues>,
    value: FieldValue<FormValues>,
    shouldValidate?: boolean,
  ) => void;
  triggerValidation: (
    payload:
      | ValidationPayload<FieldName<FormValues>, FieldValue<FormValues>>
      | ValidationPayload<FieldName<FormValues>, FieldValue<FormValues>>[],
  ) => Promise<boolean>;
  getValues: (payload?: { nest: boolean }) => FormValues;
  errors: FieldErrors<FormValues>;
  formState: FormState<FormValues>;
}
