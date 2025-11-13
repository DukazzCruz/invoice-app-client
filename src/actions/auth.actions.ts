import { Dispatch } from 'redux';
import { fetchApi, FetchApiResult } from '../service/api';
import { RootState, AuthAction, UserAction, User } from '../types';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  base_currency: string;
  company?: string;
  numberFormat?: 'en' | 'es';
  currencyFormat?: 'en' | 'es';
  dateFormat?: string;
  locale?: string;
  temperatureUnit?: 'celsius' | 'fahrenheit';
  distanceUnit?: 'km' | 'miles';
}

interface LoginPayload {
  email: string;
  password: string;
}

export interface EditUserPayload {
  company?: string;
  phone?: string;
  address?: string;
  base_currency?: string;
  numberFormat?: 'en' | 'es';
  currencyFormat?: 'en' | 'es';
  dateFormat?: string;
  locale?: string;
  temperatureUnit?: 'celsius' | 'fahrenheit';
  distanceUnit?: 'km' | 'miles';
}

type AppDispatch = Dispatch<AuthAction | UserAction>;

export const registerNewUser = (payload: RegisterPayload) => {
  return async (dispatch: AppDispatch): Promise<FetchApiResult> => {
    try {
      dispatch({
        type: 'REGISTER_USER_LOADING',
      });
      const response = await fetchApi('/user/register', 'POST', payload, 200);

      if (response.success) {
        dispatch({
          type: 'REGISTER_USER_SUCCESS',
        });
        dispatch({
          type: 'AUTH_USER_SUCCESS',
          token: response.token || '',
        });
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody as unknown as User,
        });

        return response;
      } else {
        throw response;
      }
    } catch (error: any) {
      dispatch({
        type: 'REGISTER_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const loginUser = (payload: LoginPayload) => {
  return async (dispatch: AppDispatch): Promise<FetchApiResult> => {
    try {
      dispatch({
        type: 'LOGIN_USER_LOADING',
      });
      const response = await fetchApi('/user/login', 'POST', payload, 200);

      if (response.success) {
        dispatch({
          type: 'LOGIN_USER_SUCCESS',
        });
        dispatch({
          type: 'AUTH_USER_SUCCESS',
          token: response.token || '',
        });
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody as unknown as User,
        });
        return response;
      } else {
        throw response;
      }
    } catch (error: any) {
      dispatch({
        type: 'LOGIN_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const getUser = () => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<FetchApiResult> => {
    const state = getState();
    try {
      const { authReducer: { authData: { token } } } = state;
      const response = await fetchApi('/user/user', 'GET', null, 200, token);
      if (response.success) {
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody as unknown as User,
        });
        return response;
      } else {
        throw response;
      }
    } catch (error: any) {
      dispatch({
        type: 'GET_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const logoutUser = () => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    try {
      const { authReducer: { authData: { token } } } = state;
      await fetchApi('/user/logout', 'DELETE', null, 200, token);
      dispatch({
        type: 'USER_LOGGED_OUT_SUCCESS',
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export const editUser = (payload: EditUserPayload) => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<FetchApiResult> => {
    const state = getState();
    try {
      dispatch({
        type: 'EDIT_USER_LOADING',
      });
      const { authReducer: { authData: { token } } } = state;
      const response = await fetchApi('/user/edit', 'POST', payload, 200, token);
      if (response.success) {
        dispatch({
          type: 'EDIT_USER_SUCCESS',
          payload: response.responseBody,
        });
        return response;
      } else {
        throw response;
      }
    } catch (error: any) {
      dispatch({
        type: 'EDIT_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

