import { Dispatch } from 'redux';
import { fetchApi, FetchApiResult } from '../service/api';
import { RootState, CustomerAction, Customer } from '../types';

interface EditCustomerPayload {
  name: string;
  email: string;
  company?: string;
  phone: string;
  mobile?: string;
  addresses: string[];
}

type AppDispatch = Dispatch<CustomerAction>;

export const getCustomersList = () => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<FetchApiResult> => {
    const state = getState();
    try {
      const { authReducer: { authData: { token } } } = state;
      dispatch({
        type: 'GET_CUSTOMERS_LOADING',
      });
      const response = await fetchApi('/customer/all', 'GET', null, 200, token);

      if (response.success) {
        dispatch({
          type: 'GET_CUSTOMERS_SUCCESS',
          payload: response.responseBody as { results?: Customer[]; [key: string]: any },
        });
        return response;
      } else {
        throw response;
      }
    } catch (error: any) {
      dispatch({
        type: 'GET_CUSTOMERS_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const editCustomer = (payload: EditCustomerPayload) => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<FetchApiResult> => {
    const state = getState();
    try {
      const { authReducer: { authData: { token } } } = state;
      dispatch({
        type: 'EDIT_CUSTOMER_LOADING',
      });
      const response = await fetchApi('/customer/edit', 'POST', payload, 200, token);

      if (response.success) {
        dispatch({
          type: 'EDIT_CUSTOMER_SUCCESS',
          payload: response.responseBody,
        });
        return response;
      } else {
        throw response;
      }
    } catch (error: any) {
      dispatch({
        type: 'EDIT_CUSTOMER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

