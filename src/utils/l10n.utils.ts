import moment from 'moment';

export interface L10nConfig {
  locale: string;
  dateFormat: string;
  numberFormat: 'en' | 'es';
  currencyFormat: 'en' | 'es';
  temperatureUnit: 'celsius' | 'fahrenheit';
  distanceUnit: 'km' | 'miles';
}

// Default configurations for different locales
export const DEFAULT_L10N_CONFIGS: Record<string, L10nConfig> = {
  en: {
    locale: 'en-US',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en',
    currencyFormat: 'en',
    temperatureUnit: 'fahrenheit',
    distanceUnit: 'miles',
  },
  es: {
    locale: 'es-ES',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'es',
    currencyFormat: 'es',
    temperatureUnit: 'celsius',
    distanceUnit: 'km',
  },
};

// Format numbers according to locale
export const formatNumber = (value: number, locale: string = 'en'): string => {
  if (locale === 'es') {
    // Spanish format: 1.234,56
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  // English format: 1,234.56
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Format currency according to locale
export const formatCurrency = (value: number, currency: string, locale: string = 'en'): string => {
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency;

  if (locale === 'es') {
    // Spanish format: 1.234,56 €
    return `${value.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currencySymbol}`;
  }
  // English format: $1,234.56
  return `${currencySymbol}${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Format dates according to locale
export const formatDate = (date: Date | string, locale: string = 'en'): string => {
  const momentDate = moment(date);
  if (locale === 'es') {
    return momentDate.format('DD/MM/YYYY');
  }
  return momentDate.format('MM/DD/YYYY');
};

// Get locale-specific date format pattern
export const getDateFormatPattern = (locale: string): string => {
  return locale === 'es' ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
};

// Convert temperature units
export const convertTemperature = (value: number, from: 'celsius' | 'fahrenheit', to: 'celsius' | 'fahrenheit'): number => {
  if (from === to) return value;

  if (from === 'celsius' && to === 'fahrenheit') {
    return (value * 9/5) + 32;
  }

  if (from === 'fahrenheit' && to === 'celsius') {
    return (value - 32) * 5/9;
  }

  return value;
};

// Convert distance units
export const convertDistance = (value: number, from: 'km' | 'miles', to: 'km' | 'miles'): number => {
  if (from === to) return value;

  if (from === 'km' && to === 'miles') {
    return value * 0.621371;
  }

  if (from === 'miles' && to === 'km') {
    return value * 1.60934;
  }

  return value;
};

// Get current l10n config (can be stored in AsyncStorage or Redux)
export const getCurrentL10nConfig = (language: string): L10nConfig => {
  return DEFAULT_L10N_CONFIGS[language] || DEFAULT_L10N_CONFIGS.en;
};
