import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  
  // Supported languages
  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'es', name: 'ES' },
    // Add more languages here
  ];

  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <Button
          key={lang.code}
          mode={i18n.language === lang.code ? 'contained' : 'outlined'}
          onPress={() => i18n.changeLanguage(lang.code)}
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
