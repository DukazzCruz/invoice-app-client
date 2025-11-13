import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { L10nConfig, DEFAULT_L10N_CONFIGS } from '../utils/l10n.utils';

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

  useEffect(() => {
    loadConfig();
  }, []);

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
      await AsyncStorage.setItem(L10N_CONFIG_KEY, JSON.stringify(updatedConfig));
    } catch (error) {
      console.error('Error saving l10n config:', error);
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
