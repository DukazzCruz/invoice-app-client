import { combineReducers } from 'redux';
import { InvoiceState, InvoiceAction, Invoice } from '../types';

const getInvoices = (state: InvoiceState['getInvoices'] = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  invoicesList: [],
}, action: InvoiceAction): InvoiceState['getInvoices'] => {
  switch (action.type) {
    case 'GET_INVOICES_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        invoicesList: [],
      };
    case 'GET_INVOICES_SUCCESS':
      {
        const list = Array.isArray(action.payload)
          ? action.payload
          : (action.payload as any)?.results ?? [];
        return {
          isLoading: false,
          isError: false,
          isSuccess: true,
          invoicesList: list as Invoice[],
        };
      }
    case 'GET_INVOICES_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        invoicesList: (action.payload as any) || [],
      };
    default:
      return state;
  }
};

const editInvoice = (
  state: InvoiceState['editInvoice'] = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    invoice: undefined,
  },
  action: InvoiceAction,
): InvoiceState['editInvoice'] => {
  switch (action.type) {
    case 'EDIT_INVOICE_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        invoice: undefined,
      };
    case 'EDIT_INVOICE_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        invoice: action.payload,
      };
    case 'EDIT_INVOICE_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        invoice: action.payload,
      };
    default:
      return state;
  }
};

const sendInvoiceEmail = (
  state: InvoiceState['sendInvoiceEmail'] = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    emailResponse: undefined,
  },
  action: InvoiceAction,
): InvoiceState['sendInvoiceEmail'] => {
  switch (action.type) {
    case 'SEND_INVOICE_EMAIL_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        emailResponse: null,
      };
    case 'SEND_INVOICE_EMAIL_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        emailResponse: action.payload,
      };
    case 'SEND_INVOICE_EMAIL_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        emailResponse: action.payload,
      };
    default:
      return state;
  }
};

export default combineReducers({
  editInvoice,
  getInvoices,
  sendInvoiceEmail,
});

