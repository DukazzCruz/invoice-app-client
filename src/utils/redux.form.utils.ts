import { TFunction } from 'i18next';

/**
 * Validates that issued date is before due date
 */
export function validatePositiveTimeDifference(issued: Date, due: Date): string | undefined {
  return due < issued ? 'Due date should be after issuing' : undefined;
}

// Store the translation function globally
let tFunction: TFunction | null = null;

/**
 * Initialize the translation function for validations
 * Call this function once when the app starts or when language changes
 */
export const initializeValidationTranslations = (t: TFunction) => {
  tFunction = t;
  console.log('🔧 Validation translations initialized');
};

/**
 * Get the translation function (returns a fallback if not initialized)
 */
const getT = (): TFunction => {
  if (!tFunction) {
    console.warn('⚠️ Validation translations not initialized, using fallback');
    return ((key: string, options?: any) => key) as TFunction; // Fallback: return key as-is
  }
  return tFunction;
};

/**
 * validates a required field
 */
export const required = (value: any): string | undefined => {
  const t = getT();
  return value ? undefined : t('validation.required');
};

/**
 * validates an email field
 */
export const email = (value: string | undefined): string | undefined => {
  const t = getT();
  return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? t('validation.email')
    : undefined;
};

/**
 * validates a number field
 */
export const number = (value: any): string | undefined => {
  const t = getT();
  return value && isNaN(Number(value)) ? t('validation.number') : undefined;
};

/**
 * validates an integer field
 */
export const integer = (value: any): string | undefined => {
  const t = getT();
  return value && !Number.isInteger(Number(value)) ? t('validation.integer') : undefined;
};

/**
 * validates a phone field
 */
export const phone = (value: string | undefined): string | undefined => {
  const t = getT();
  return value && !/^[a-zA-Z0-9]{8,16}$/i.test(value)
    ? t('validation.phone')
    : undefined;
};

/**
 * Adds separators and currency symbol to a number
 */
export const formatCurrency = (input: any, currency: string | undefined): string | undefined => {
  if (!input) {
    return undefined;
  }
  if (!currency) {
    return String(input);
  }
  return currency
    .concat(String(input))
    .replace(/,/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Strips a currency formatted string from symbols
 */
export const normalizeCurrency = (val: any): string | undefined => {
  if (!val) {
    return undefined;
  }
  return String(val)
    .replace(/\b(0(?!\b))+/g, '')
    .replace(/\D/g, '');
};

