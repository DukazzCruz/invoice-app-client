import { Dispatch } from 'redux';
import { fetchApi, FetchApiResult } from '../service/api';
import { RootState, ItemAction, Item } from '../types';

interface EditItemPayload {
  name: string;
  description?: string;
  price: number;
}

type AppDispatch = Dispatch<ItemAction>;

export const getItemsList = () => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<FetchApiResult> => {
    const state = getState();
    try {
      const { authReducer: { authData: { token } } } = state;
      dispatch({
        type: 'GET_ITEMS_LOADING',
      });
      const response = await fetchApi('/item/all', 'GET', null, 200, token);
      if (response.success) {
        dispatch({
          type: 'GET_ITEMS_SUCCESS',
          payload: response.responseBody as { results?: Item[]; [key: string]: any },
        });
        return response;
      } else {
        throw response;
      }
    } catch (error: any) {
      dispatch({
        type: 'GET_ITEMS_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const editItem = (payload: EditItemPayload) => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<FetchApiResult> => {
    const state = getState();
    try {
      const { authReducer: { authData: { token } } } = state;
      dispatch({
        type: 'EDIT_ITEM_LOADING',
      });
      const response = await fetchApi('/item/edit', 'POST', payload, 200, token);

      if (response.success) {
        dispatch({
          type: 'EDIT_ITEM_SUCCESS',
          payload: (response.responseBody as any)?.item,
        });
        return response;
      } else {
        throw response;
      }
    } catch (error: any) {
      dispatch({
        type: 'EDIT_ITEM_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

