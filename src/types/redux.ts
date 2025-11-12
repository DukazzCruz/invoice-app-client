import { User, Customer, Item, Employee, Invoice } from './index';

// Action Types
export type AuthAction =
  | { type: 'AUTH_USER_SUCCESS'; token: string }
  | { type: 'AUTH_USER_FAIL' }
  | { type: 'REGISTER_USER_LOADING' }
  | { type: 'REGISTER_USER_SUCCESS' }
  | { type: 'REGISTER_USER_FAIL'; payload?: any }
  | { type: 'LOGIN_USER_LOADING' }
  | { type: 'LOGIN_USER_SUCCESS' }
  | { type: 'LOGIN_USER_FAIL'; payload?: any }
  | { type: 'USER_LOGGED_OUT_SUCCESS' };

export type UserAction =
  | { type: 'GET_USER_LOADING' }
  | { type: 'GET_USER_SUCCESS'; payload: User }
  | { type: 'GET_USER_FAIL'; payload?: any }
  | { type: 'EDIT_USER_LOADING' }
  | { type: 'EDIT_USER_SUCCESS'; payload?: any }
  | { type: 'EDIT_USER_FAIL'; payload?: any };

export type CustomerAction =
  | { type: 'GET_CUSTOMERS_LOADING' }
  | { type: 'GET_CUSTOMERS_SUCCESS'; payload: { results?: Customer[]; [key: string]: any } }
  | { type: 'GET_CUSTOMERS_FAIL'; payload?: any }
  | { type: 'EDIT_CUSTOMER_LOADING' }
  | { type: 'EDIT_CUSTOMER_SUCCESS'; payload?: any }
  | { type: 'EDIT_CUSTOMER_FAIL'; payload?: any };

export type ItemAction =
  | { type: 'GET_ITEMS_LOADING' }
  | { type: 'GET_ITEMS_SUCCESS'; payload: { results?: Item[]; [key: string]: any } }
  | { type: 'GET_ITEMS_FAIL'; payload?: any }
  | { type: 'EDIT_ITEM_LOADING' }
  | { type: 'EDIT_ITEM_SUCCESS'; payload?: any }
  | { type: 'EDIT_ITEM_FAIL'; payload?: any };

export type EmployeeAction =
  | { type: 'GET_EMPLOYEES_LOADING' }
  | { type: 'GET_EMPLOYEES_SUCCESS'; payload: { results?: Employee[]; [key: string]: any } }
  | { type: 'GET_EMPLOYEES_FAIL'; payload?: any }
  | { type: 'EDIT_EMPLOYEE_LOADING' }
  | { type: 'EDIT_EMPLOYEE_SUCCESS'; payload?: { employee?: Employee; [key: string]: any } }
  | { type: 'EDIT_EMPLOYEE_FAIL'; payload?: any }
  | { type: 'UPDATE_EMPLOYEE_LOADING' }
  | { type: 'UPDATE_EMPLOYEE_SUCCESS'; payload?: { employee?: Employee; [key: string]: any } }
  | { type: 'UPDATE_EMPLOYEE_FAIL'; payload?: any }
  | { type: 'DELETE_EMPLOYEE_LOADING' }
  | { type: 'DELETE_EMPLOYEE_SUCCESS'; payload: string }
  | { type: 'DELETE_EMPLOYEE_FAIL'; payload?: any };

export type InvoiceAction =
  | { type: 'GET_INVOICES_LOADING' }
  | { type: 'GET_INVOICES_SUCCESS'; payload: { results?: Invoice[]; [key: string]: any } }
  | { type: 'GET_INVOICES_FAIL'; payload?: any }
  | { type: 'EDIT_INVOICE_LOADING' }
  | { type: 'EDIT_INVOICE_SUCCESS'; payload?: any }
  | { type: 'EDIT_INVOICE_FAIL'; payload?: any }
  | { type: 'SEND_INVOICE_EMAIL_LOADING' }
  | { type: 'SEND_INVOICE_EMAIL_SUCCESS'; payload?: any }
  | { type: 'SEND_INVOICE_EMAIL_FAIL'; payload?: any };

export type RootAction = AuthAction | UserAction | CustomerAction | ItemAction | EmployeeAction | InvoiceAction;

