import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useL10n } from '../contexts/L10nContext';

const L10nDemo: React.FC = () => {
  const { t } = useTranslation();
  const { formatNumber, formatCurrency, formatDate, config } = useL10n();

  const sampleValue = 1234.56;
  const sampleDate = new Date();

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={t('screens.profile')} />
        <Card.Content>
          <Text style={styles.title}>L10n Configuration</Text>
          <Text>Language: {config.locale}</Text>
          <Text>Date Format: {config.dateFormat}</Text>
          <Text>Number Format: {config.numberFormat}</Text>
          <Text>Temperature Unit: {config.temperatureUnit}</Text>
          <Text>Distance Unit: {config.distanceUnit}</Text>

          <Text style={styles.title}>Formatted Examples</Text>
          <Text>Number: {formatNumber(sampleValue)}</Text>
          <Text>Currency (USD): {formatCurrency(sampleValue, 'USD')}</Text>
          <Text>Currency (EUR): {formatCurrency(sampleValue, 'EUR')}</Text>
          <Text>Date: {formatDate(sampleDate)}</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
});

export default L10nDemo;
