import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { L10nConfig, DEFAULT_L10N_CONFIGS } from '../utils/l10n.utils';
import { RootState } from '../types';

interface L10nContextType {
  config: L10nConfig;
  updateConfig: (newConfig: Partial<L10nConfig>) => void;
  formatNumber: (value: number) => string;
  formatCurrency: (value: number, currency: string) => string;
  formatDate: (date: Date | string) => string;
}

const L10nContext = createContext<L10nContextType | undefined>(undefined);

const L10N_CONFIG_KEY = 'l10n_config';

export const L10nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<L10nConfig>(DEFAULT_L10N_CONFIGS.en);
  const user = useSelector((state: RootState) => state.userReducer.getUser.userDetails);
  const { i18n } = useTranslation();

  useEffect(() => {
    loadConfig();
  }, []);

  // Sync with user data when user loads
  useEffect(() => {
    if (user) {
      console.log('👤 L10nContext: User data loaded, syncing configuration', user);
      const userConfig: Partial<L10nConfig> = {
        locale: user.locale || 'en-US',
        dateFormat: user.dateFormat || 'MM/DD/YYYY',
        numberFormat: user.numberFormat || 'en',
        currencyFormat: user.currencyFormat || 'en',
        temperatureUnit: user.temperatureUnit || 'fahrenheit',
        distanceUnit: user.distanceUnit || 'miles',
      };
      console.log('🔄 L10nContext: Applying user configuration', userConfig);
      // Directly update state for user data sync
      const updatedConfig = { ...config, ...userConfig };
      setConfig(updatedConfig);
      // Also save to AsyncStorage
      AsyncStorage.setItem(L10N_CONFIG_KEY, JSON.stringify(updatedConfig)).catch(error => {
        console.error('Error saving user l10n config:', error);
      });
    }
  }, [user]);

  // Sync with i18n language changes
  useEffect(() => {
    console.log('🌍 L10nContext: i18n language changed to', i18n.language);
    const isSpanish = i18n.language === 'es';
    const languageConfig: Partial<L10nConfig> = {
      numberFormat: isSpanish ? 'es' : 'en',
      currencyFormat: isSpanish ? 'es' : 'en',
      dateFormat: isSpanish ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
      locale: isSpanish ? 'es-ES' : 'en-US',
      temperatureUnit: isSpanish ? 'celsius' : 'fahrenheit',
      distanceUnit: isSpanish ? 'km' : 'miles',
    };

    console.log('🔄 L10nContext: Applying language configuration', languageConfig);
    const updatedConfig = { ...config, ...languageConfig };
    setConfig(updatedConfig);

    // Save to AsyncStorage
    AsyncStorage.setItem(L10N_CONFIG_KEY, JSON.stringify(updatedConfig)).catch(error => {
      console.error('❌ L10nContext: Error saving language config:', error);
    });
  }, [i18n.language]);

  const loadConfig = async () => {
    try {
      const stored = await AsyncStorage.getItem(L10N_CONFIG_KEY);
      if (stored) {
        const parsedConfig = JSON.parse(stored);
        setConfig(parsedConfig);
      }
    } catch (error) {
      console.error('Error loading l10n config:', error);
    }
  };

  const updateConfig = async (newConfig: Partial<L10nConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    try {
      console.log('💾 L10nContext: Saving configuration to AsyncStorage', updatedConfig);
      await AsyncStorage.setItem(L10N_CONFIG_KEY, JSON.stringify(updatedConfig));
      console.log('✅ L10nContext: Configuration saved successfully');
    } catch (error) {
      console.error('❌ L10nContext: Error saving configuration:', error);
    }
  };

  const formatNumber = (value: number): string => {
    if (config.numberFormat === 'es') {
      return value.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatCurrency = (value: number, currency: string): string => {
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency;

    if (config.currencyFormat === 'es') {
      return `${value.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ${currencySymbol}`;
    }
    return `${currencySymbol}${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date: Date | string): string => {
    const momentDate = require('moment')(date);
    return momentDate.format(config.dateFormat);
  };

  const value: L10nContextType = {
    config,
    updateConfig,
    formatNumber,
    formatCurrency,
    formatDate,
  };

  return <L10nContext.Provider value={value}>{children}</L10nContext.Provider>;
};

export const useL10n = () => {
  const context = useContext(L10nContext);
  if (context === undefined) {
    throw new Error('useL10n must be used within a L10nProvider');
  }
  return context;
};
