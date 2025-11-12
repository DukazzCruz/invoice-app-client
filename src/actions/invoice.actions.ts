import { Dispatch } from 'redux';
import { fetchApi, FetchApiResult } from '../service/api';
import { RootState, InvoiceAction, Invoice, InvoiceItem } from '../types';

interface EditInvoicePayload {
  number: string;
  customer: string;
  issued?: string | Date;
  due?: string | Date;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency?: string;
}

interface SendInvoicePayload {
  invoice: string;
  status: boolean;
  paid_on?: Date | string | null;
  amount_paid: number;
  amount_due: number;
}

type AppDispatch = Dispatch<InvoiceAction>;

export const getInvoicesList = () => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<FetchApiResult> => {
    const state = getState();
    try {
      const { authReducer: { authData: { token } } } = state;
      dispatch({
        type: 'GET_INVOICES_LOADING',
      });
      const response = await fetchApi('/invoice/all', 'GET', null, 200, token);

      if (response.success) {
        dispatch({
          type: 'GET_INVOICES_SUCCESS',
          payload: response.responseBody as { results?: Invoice[]; [key: string]: any },
        });
        return response;
      } else {
        throw response;
      }
    } catch (error: any) {
      dispatch({
        type: 'GET_INVOICES_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const editInvoice = (payload: EditInvoicePayload) => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<FetchApiResult> => {
    const state = getState();
    try {
      const { authReducer: { authData: { token } } } = state;
      dispatch({
        type: 'EDIT_INVOICE_LOADING',
      });
      const response = await fetchApi('/invoice/edit', 'POST', payload, 200, token);

      if (response.success) {
        dispatch({
          type: 'EDIT_INVOICE_SUCCESS',
          payload: response.responseBody,
        });
        return response;
      } else {
        throw response;
      }
    } catch (error: any) {
      dispatch({
        type: 'EDIT_INVOICE_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const sendInvoiceByEmail = (payload: SendInvoicePayload) => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<FetchApiResult> => {
    const state = getState();
    try {
      const { authReducer: { authData: { token } } } = state;
      dispatch({
        type: 'SEND_INVOICE_EMAIL_LOADING',
      });
      const paymentSessionResponse = await fetchApi('/payment/new', 'POST', payload, 200, token);
      if (paymentSessionResponse.success) {
        const emailResponse = await fetchApi(
          '/invoice/send',
          'POST',
          (paymentSessionResponse.responseBody as any)?.value,
          200,
          token
        );
        if (emailResponse.success) {
          dispatch({
            type: 'SEND_INVOICE_EMAIL_SUCCESS',
            payload: emailResponse.responseBody,
          });
          return emailResponse;
        } else {
          throw emailResponse;
        }
      } else {
        throw paymentSessionResponse;
      }
    } catch (error: any) {
      dispatch({
        type: 'SEND_INVOICE_EMAIL_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

