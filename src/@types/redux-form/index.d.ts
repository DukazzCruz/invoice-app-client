declare module 'redux-form' {
  export const Field: any;
  export const FieldArray: any;
  export interface WrappedFieldProps {
    input: any;
    meta: any;
  }
  export interface WrappedFieldArrayProps<T = any> {
    fields: any;
    meta: any;
  }
  export type InjectedFormProps<T = any> = any;
  export function reduxForm<FormData = any>(config: any): <P = any>(component: any) => any;
  export function formValueSelector<FormData = any>(form: string): any;
  export const change: any;
  export const reducer: any;
}
