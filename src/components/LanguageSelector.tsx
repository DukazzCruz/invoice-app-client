import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { editUser } from '../actions/auth.actions';
import { useL10n } from '../contexts/L10nContext';
import { L10nConfig } from '../utils/l10n.utils';
import type { EditUserPayload } from '../actions/auth.actions';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const { updateConfig } = useL10n();
  const dispatch = useDispatch();

  // Supported languages
  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'es', name: 'ES' },
    // Add more languages here
  ];

  const handleLanguageChange = async (languageCode: string) => {
    try {
      console.log('🌍 LanguageSelector: Changing language to', languageCode);

      // Change i18n language
      await i18n.changeLanguage(languageCode);
      console.log('✅ LanguageSelector: i18n language changed to', languageCode);

      // Update L10n configuration based on language
      const isSpanish = languageCode === 'es';
      const regionalSettings: Partial<L10nConfig> = {
        numberFormat: isSpanish ? 'es' : 'en',
        currencyFormat: isSpanish ? 'es' : 'en',
        dateFormat: isSpanish ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
        locale: isSpanish ? 'es-ES' : 'en-US',
        temperatureUnit: isSpanish ? 'celsius' : 'fahrenheit',
        distanceUnit: isSpanish ? 'km' : 'miles',
      };

      console.log('🔄 LanguageSelector: Updating L10n configuration', regionalSettings);
      updateConfig(regionalSettings);

      // Update user preferences in backend if logged in
      const userUpdate: EditUserPayload = {
        numberFormat: isSpanish ? 'es' : 'en',
        currencyFormat: isSpanish ? 'es' : 'en',
        dateFormat: isSpanish ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
        locale: isSpanish ? 'es-ES' : 'en-US',
        temperatureUnit: isSpanish ? 'celsius' : 'fahrenheit',
        distanceUnit: isSpanish ? 'km' : 'miles',
      };

      console.log('📡 LanguageSelector: Updating user preferences in backend', userUpdate);
      await dispatch(editUser(userUpdate) as any);
      console.log('✅ LanguageSelector: User preferences updated successfully');

    } catch (error) {
      console.error('❌ LanguageSelector: Error changing language:', error);
    }
  };

  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <Button
          key={lang.code}
          mode={i18n.language === lang.code ? 'contained' : 'outlined'}
          onPress={() => handleLanguageChange(lang.code)}
          style={styles.button}
        >
          {lang.name}
        </Button>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  button: {
    marginHorizontal: 4,
  },
});