import { Dispatch } from 'redux';
import { fetchApi, FetchApiResult } from '../service/api';
import { RootState, EmployeeAction, Employee } from '../types';

interface EditEmployeePayload {
  name: string;
  email: string;
  role: string;
  phone?: string;
  active?: boolean;
}

interface UpdateEmployeePayload {
  name?: string;
  role?: string;
  phone?: string;
  active?: boolean;
}

type AppDispatch = Dispatch<EmployeeAction>;

export const getEmployeesList = () => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<FetchApiResult> => {
    const state = getState();
    try {
      const { authReducer: { authData: { token } } } = state;
      dispatch({
        type: 'GET_EMPLOYEES_LOADING',
      });
      const response = await fetchApi('/employee/all', 'GET', null, 200, token);
      if (response.success) {
        dispatch({
          type: 'GET_EMPLOYEES_SUCCESS',
          payload: response.responseBody as { results?: Employee[]; [key: string]: any },
        });
        return response;
      } else {
        throw response;
      }
    } catch (error: any) {
      dispatch({
        type: 'GET_EMPLOYEES_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const editEmployee = (payload: EditEmployeePayload) => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<FetchApiResult> => {
    const state = getState();
    try {
      const { authReducer: { authData: { token } } } = state;
      dispatch({
        type: 'EDIT_EMPLOYEE_LOADING',
      });
      const response = await fetchApi('/employee/edit', 'POST', payload, 200, token);

      if (response.success) {
        dispatch({
          type: 'EDIT_EMPLOYEE_SUCCESS',
          payload: response.responseBody as { employee?: Employee; [key: string]: any },
        });
        return response;
      } else {
        throw response;
      }
    } catch (error: any) {
      dispatch({
        type: 'EDIT_EMPLOYEE_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const updateEmployee = (id: string, payload: UpdateEmployeePayload) => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<FetchApiResult> => {
    const state = getState();
    try {
      const { authReducer: { authData: { token } } } = state;
      dispatch({
        type: 'UPDATE_EMPLOYEE_LOADING',
      });
      const response = await fetchApi(`/employee/${id}`, 'PATCH', payload, 200, token);

      if (response.success) {
        dispatch({
          type: 'UPDATE_EMPLOYEE_SUCCESS',
          payload: response.responseBody as { employee?: Employee; [key: string]: any },
        });
        return response;
      } else {
        throw response;
      }
    } catch (error: any) {
      dispatch({
        type: 'UPDATE_EMPLOYEE_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const deleteEmployee = (id: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<FetchApiResult> => {
    const state = getState();
    try {
      const { authReducer: { authData: { token } } } = state;
      dispatch({
        type: 'DELETE_EMPLOYEE_LOADING',
      });
      const response = await fetchApi(`/employee/${id}`, 'DELETE', null, 200, token);

      if (response.success) {
        dispatch({
          type: 'DELETE_EMPLOYEE_SUCCESS',
          payload: id,
        });
        return response;
      } else {
        throw response;
      }
    } catch (error: any) {
      dispatch({
        type: 'DELETE_EMPLOYEE_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

