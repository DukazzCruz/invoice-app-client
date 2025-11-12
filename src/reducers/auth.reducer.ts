import { combineReducers } from 'redux';
import { AuthState } from '../types';
import { AuthAction } from '../types/redux';

const authData = (
  state: AuthState['authData'] = {
    isLoggedIn: false,
    token: null,
  },
  action: AuthAction,
): AuthState['authData'] => {
  switch (action.type) {
    case 'AUTH_USER_SUCCESS':
      return {
        token: action.token,
        isLoggedIn: true,
      };
    case 'AUTH_USER_FAIL':
    case 'REGISTER_USER_FAIL':
    case 'LOGIN_USER_FAIL':
    case 'USER_LOGGED_OUT_SUCCESS':
      return {
        token: null,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

const registerUser = (
  state: AuthState['registerUser'] = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    errors: null as any,
  },
  action: AuthAction,
): AuthState['registerUser'] => {
  switch (action.type) {
    case 'REGISTER_USER_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        errors: null,
      };
    case 'REGISTER_USER_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        errors: null,
      };
    case 'REGISTER_USER_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        errors: action.payload,
      };
    default:
      return state;
  }
};

const loginUser = (
  state: AuthState['loginUser'] = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    errors: null as any,
  },
  action: AuthAction,
): AuthState['loginUser'] => {
  switch (action.type) {
    case 'LOGIN_USER_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        errors: null,
      };
    case 'LOGIN_USER_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        errors: null,
      };
    case 'LOGIN_USER_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        errors: action.payload,
      };
    default:
      return state;
  }
};

export default combineReducers({
  authData,
  registerUser,
  loginUser,
});

