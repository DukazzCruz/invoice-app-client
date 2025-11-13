import { combineReducers, AnyAction } from 'redux';
import authReducer from './auth.reducer';
import userReducer from './user.reducer';
import itemReducer from './item.reducer';
import customerReducer from './customer.reducer';
import invoiceReducer from './invoice.reducer';
import employeeReducer from './employee.reducer';
import { reducer as formReducer } from 'redux-form';

const reducers = {
  authReducer,
  userReducer,
  customerReducer,
  itemReducer,
  invoiceReducer,
  employeeReducer,
  form: formReducer,
};

const appReducer = combineReducers(reducers);

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: AnyAction): RootState => {
  if (action.type === 'USER_LOGGED_OUT_SUCCESS') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;

