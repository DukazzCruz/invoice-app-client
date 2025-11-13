import 'react-native-gesture-handler';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';

import persist from './src/config/store';
import Main from './src/Main';
import { L10nProvider } from './src/contexts/L10nContext';

const { store, persistor } = persist();

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#1c313a',
        secondary: '#5067FF',
    },
};

const App: React.FC = () => (
    <I18nextProvider i18n={i18n}>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <PaperProvider theme={theme}>
                    <ReduxProvider store={store}>
                        <PersistGate loading={null} persistor={persistor}>
                            <L10nProvider>
                                <StatusBar style="dark" />
                                <Main />
                            </L10nProvider>
                        </PersistGate>
                    </ReduxProvider>
                </PaperProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    </I18nextProvider>
);

export default App;
