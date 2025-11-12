/**
 * Validates that issued date is before due date
 */
export function validatePositiveTimeDifference(issued: Date, due: Date): string | undefined {
  return due < issued ? 'Due date should be after issuing' : undefined;
}

/**
 * validates a required field
 */
export const required = (value: any): string | undefined => (value ? undefined : 'Required');

/**
 * validates an email field
 */
export const email = (value: string | undefined): string | undefined =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;

/**
 * validates a number field
 */
export const number = (value: any): string | undefined =>
  value && isNaN(Number(value)) ? 'Should be a number' : undefined;

/**
 * validates an integer field
 */
export const integer = (value: any): string | undefined =>
  value && !Number.isInteger(Number(value)) ? 'Should be an integer' : undefined;

/**
 * validates a phone field
 */
export const phone = (value: string | undefined): string | undefined =>
  value && !/^[a-zA-Z0-9]{8,16}$/i.test(value)
    ? 'Invalid phone number'
    : undefined;

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

