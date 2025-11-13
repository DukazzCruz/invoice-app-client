import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageDetectorAsyncModule } from 'i18next';
import { getDeviceLocale } from './regional.utils';

const LANGUAGE_KEY = 'app_language';

export const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async () => {
    try {
      // First check if user has manually selected a language
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        console.log('💾 LanguageDetector: Found saved language in AsyncStorage:', savedLanguage);
        return savedLanguage;
      }

      // If no saved language, detect device language
      const deviceLocale = getDeviceLocale();
      const language = deviceLocale.startsWith('es') ? 'es' : 'en';
      console.log('🔍 LanguageDetector: Detected device language:', deviceLocale, '→ using:', language);

      // Save detected language for future use
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
      console.log('💾 LanguageDetector: Saved detected language to AsyncStorage:', language);
      return language;
    } catch (error) {
      console.error('❌ LanguageDetector: Error detecting language:', error);
      // Fallback to Spanish if detection fails
      return 'es';
    }
  },
  cacheUserLanguage: async (language: string) => {
    try {
      console.log('💾 LanguageDetector: Caching user language:', language);
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
      console.log('✅ LanguageDetector: Language cached successfully');
    } catch (error) {
      console.error('❌ LanguageDetector: Error caching language:', error);
    }
  }
};
