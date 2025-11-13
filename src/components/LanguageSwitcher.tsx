import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <View>
      <Picker
        selectedValue={i18n.language}
        onValueChange={(itemValue) => i18n.changeLanguage(itemValue)}>
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Español" value="es" />
        {/* Add more languages as needed */}
      </Picker>
    </View>
  );
}
