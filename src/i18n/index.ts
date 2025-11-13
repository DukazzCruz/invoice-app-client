import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { languageDetector } from '../utils/languageDetector';
import { initializeValidationTranslations } from '../utils/redux.form.utils';
import en from './en.json';
import es from './es.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Initialize validation translations when i18n is ready
i18n.on('initialized', () => {
  initializeValidationTranslations(i18n.t);
});

i18n.on('languageChanged', () => {
  initializeValidationTranslations(i18n.t);
});

export default i18n;
