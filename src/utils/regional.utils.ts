import { getLocales } from 'expo-localization';

export interface RegionalSettings {
  locale: string;
  numberFormat: 'en' | 'es';
  currencyFormat: 'en' | 'es';
  dateFormat: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
  distanceUnit: 'km' | 'miles';
  baseCurrency: string;
}

/**
 * Detecta automáticamente la configuración regional del dispositivo
 */
export const detectRegionalSettings = (): RegionalSettings => {
  try {
    const locales = getLocales();
    const primaryLocale = locales[0]?.languageTag || 'en-US';

    // Determinar si es español o inglés
    const isSpanish = primaryLocale.startsWith('es');
    const isLatinAmerica = primaryLocale.includes('419') || ['MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY'].some(country =>
      primaryLocale.includes(country.toLowerCase())
    );

    // Formato de números y moneda
    const numberFormat: 'en' | 'es' = isSpanish ? 'es' : 'en';
    const currencyFormat: 'en' | 'es' = isSpanish ? 'es' : 'en';

    // Formato de fecha basado en locale
    let dateFormat = 'MM/DD/YYYY'; // Default US format
    if (isSpanish) {
      if (isLatinAmerica) {
        dateFormat = 'DD/MM/YYYY'; // Latinoamericano
      } else {
        dateFormat = 'DD/MM/YYYY'; // España
      }
    }

    // Moneda por defecto basada en el país
    let baseCurrency = 'USD'; // Default
    if (primaryLocale.includes('MX')) baseCurrency = 'MXN';
    else if (primaryLocale.includes('AR')) baseCurrency = 'ARS';
    else if (primaryLocale.includes('CO')) baseCurrency = 'COP';
    else if (primaryLocale.includes('CL')) baseCurrency = 'CLP';
    else if (primaryLocale.includes('PE')) baseCurrency = 'PEN';
    else if (primaryLocale.includes('VE')) baseCurrency = 'VES';
    else if (primaryLocale.includes('EC')) baseCurrency = 'USD'; // Ecuador usa USD
    else if (primaryLocale.includes('BO')) baseCurrency = 'BOB';
    else if (primaryLocale.includes('PY')) baseCurrency = 'PYG';
    else if (primaryLocale.includes('UY')) baseCurrency = 'UYU';
    else if (primaryLocale.includes('ES')) baseCurrency = 'EUR';

    // Unidades de temperatura y distancia
    const temperatureUnit: 'celsius' | 'fahrenheit' = isSpanish ? 'celsius' : 'fahrenheit';
    const distanceUnit: 'km' | 'miles' = isSpanish ? 'km' : 'miles';

    return {
      locale: primaryLocale,
      numberFormat,
      currencyFormat,
      dateFormat,
      temperatureUnit,
      distanceUnit,
      baseCurrency,
    };
  } catch (error) {
    console.warn('Error detecting regional settings:', error);
    // Fallback to default settings
    return {
      locale: 'en-US',
      numberFormat: 'en',
      currencyFormat: 'en',
      dateFormat: 'MM/DD/YYYY',
      temperatureUnit: 'fahrenheit',
      distanceUnit: 'miles',
      baseCurrency: 'USD',
    };
  }
};

/**
 * Obtiene la configuración regional actual del dispositivo (síncrono)
 */
export const getDeviceLocale = (): string => {
  try {
    const locales = getLocales();
    return locales[0]?.languageTag || 'en-US';
  } catch {
    return 'en-US';
  }
};

/**
 * Determina si el dispositivo usa configuración española
 */
export const isSpanishLocale = (): boolean => {
  const locale = getDeviceLocale();
  return locale.startsWith('es');
};
