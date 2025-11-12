import { combineReducers, AnyAction } from 'redux';
import authReducer from './auth.reducer';
import userReducer from './user.reducer';
import itemReducer from './item.reducer';
import customerReducer from './customer.reducer';
import invoiceReducer from './invoice.reducer';
import employeeReducer from './employee.reducer';

const reducers = {
  authReducer,
  userReducer,
  customerReducer,
  itemReducer,
  invoiceReducer,
  employeeReducer,
};

const appReducer = combineReducers(reducers);

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: AnyAction): RootState => {
  if (action.type === 'USER_LOGOUT_SUCCESS') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;

