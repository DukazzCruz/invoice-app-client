import type { ExpoConfig } from 'expo/config';
import os from 'os';

function getLocalIp(): string {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    const addrs = nets[name] || [];
    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) {
        return addr.address;
      }
    }
  }
  return '10.0.0.91';
}

const config: ExpoConfig = {
  name: 'InvoiceAppClient',
  slug: 'invoice-app-client',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/images/react-logo.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './src/assets/images/react-logo.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.invoiceapp.client',
    appleTeamId: '73LNXZ2Q89',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/images/react-logo.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.invoiceapp.client',
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './src/assets/images/react-logo.png',
  },
  extra: {
    eas: {
      projectId: 'local',
    },
    // If .env is not provided, compute your LAN IP and expose it for the app to consume.
    apiUrl: process.env.EXPO_PUBLIC_API_URL?.trim() || `http://${getLocalIp()}:3333`,
  },
};

export default config;
