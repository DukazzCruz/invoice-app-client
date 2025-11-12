import 'react-native-gesture-handler';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import persist from './src/config/store';
import Main from './src/Main';

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
    <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <ReduxProvider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <StatusBar style="dark" />
                        <Main />
                    </PersistGate>
                </ReduxProvider>
            </PaperProvider>
        </SafeAreaProvider>
    </GestureHandlerRootView>
);

export default App;

