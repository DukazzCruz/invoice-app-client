import { legacy_createStore as createStore, applyMiddleware, Store } from 'redux';
import { persistReducer, persistStore, Persistor } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { thunk } from 'redux-thunk';

import reducers from '../reducers';
import { RootState } from '../types';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['authReducer', 'userReducer'],
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, reducers);

interface StoreReturn {
  store: Store<RootState>;
  persistor: Persistor;
}

export default (): StoreReturn => {
  const store = createStore(persistedReducer, applyMiddleware(thunk));
  const persistor = persistStore(store);
  return { store, persistor };
};

