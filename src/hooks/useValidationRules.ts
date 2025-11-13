import { useTranslation } from 'react-i18next';

/**
 * Custom hook that provides translated validation functions
 */
export const useValidationRules = () => {
  const { t } = useTranslation();

  return {
    required: (value: any): string | undefined =>
      value ? undefined : t('validation.required'),

    email: (value: string | undefined): string | undefined =>
      value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? t('validation.email')
        : undefined,

    number: (value: any): string | undefined =>
      value && isNaN(Number(value)) ? t('validation.number') : undefined,

    integer: (value: any): string | undefined =>
      value && !Number.isInteger(Number(value)) ? t('validation.integer') : undefined,

    phone: (value: string | undefined): string | undefined =>
      value && !/^[a-zA-Z0-9]{8,16}$/i.test(value)
        ? t('validation.phone')
        : undefined,

    minLength: (min: number) => (value: string | undefined): string | undefined =>
      value && value.length < min
        ? t('validation.minLength', { min })
        : undefined,

    passwordMismatch: (value: string | undefined, allValues?: any): string | undefined =>
      value && allValues?.password !== value
        ? t('validation.passwordMismatch')
        : undefined,
  };
};
