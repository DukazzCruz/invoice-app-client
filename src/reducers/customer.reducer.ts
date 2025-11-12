import { combineReducers } from 'redux';
import { CustomerState, CustomerAction, Customer } from '../types';

const getCustomers = (state: CustomerState['getCustomers'] = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  customersList: [],
}, action: CustomerAction): CustomerState['getCustomers'] => {
  switch (action.type) {
    case 'GET_CUSTOMERS_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        customersList: [],
      };
    case 'GET_CUSTOMERS_SUCCESS':
      {
        const list = Array.isArray(action.payload)
          ? action.payload
          : (action.payload as any)?.results ?? [];
        return {
          isLoading: false,
          isError: false,
          isSuccess: true,
          customersList: list as Customer[],
        };
      }
    case 'GET_CUSTOMERS_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        customersList: (action.payload as any) || [],
      };
    default:
      return state;
  }
};

const editCustomer = (
  state: CustomerState['editCustomer'] = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    customer: undefined,
  },
  action: CustomerAction,
): CustomerState['editCustomer'] => {
  switch (action.type) {
    case 'EDIT_CUSTOMER_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        customer: undefined,
      };
    case 'EDIT_CUSTOMER_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        customer: action.payload,
      };
    case 'EDIT_CUSTOMER_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        customer: action.payload,
      };
    default:
      return state;
  }
};

export default combineReducers({
  getCustomers,
  editCustomer,
});

