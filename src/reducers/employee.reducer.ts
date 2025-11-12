import { combineReducers } from 'redux';
import { EmployeeState, EmployeeAction, Employee } from '../types';

const getEmployees = (state: EmployeeState['getEmployees'] = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  employeesList: [],
}, action: EmployeeAction): EmployeeState['getEmployees'] => {
  switch (action.type) {
    case 'GET_EMPLOYEES_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        employeesList: [],
      };
    case 'GET_EMPLOYEES_SUCCESS':
      {
        const list = Array.isArray(action.payload)
          ? action.payload
          : (action.payload as any)?.results ?? [];
        return {
          isLoading: false,
          isError: false,
          isSuccess: true,
          employeesList: list as Employee[],
        };
      }
    case 'GET_EMPLOYEES_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        employeesList: (action.payload as any) || [],
      };
    default:
      return state;
  }
};

const editEmployee = (
  state: EmployeeState['editEmployee'] = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    employee: undefined,
  },
  action: EmployeeAction,
): EmployeeState['editEmployee'] => {
  switch (action.type) {
    case 'EDIT_EMPLOYEE_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        employee: undefined,
      };
    case 'EDIT_EMPLOYEE_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        employee: action.payload?.employee || action.payload,
      };
    case 'EDIT_EMPLOYEE_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        employee: action.payload,
      };
    default:
      return state;
  }
};

const updateEmployee = (
  state: EmployeeState['updateEmployee'] = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    employee: undefined,
  },
  action: EmployeeAction,
): EmployeeState['updateEmployee'] => {
  switch (action.type) {
    case 'UPDATE_EMPLOYEE_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        employee: undefined,
      };
    case 'UPDATE_EMPLOYEE_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        employee: action.payload?.employee || action.payload,
      };
    case 'UPDATE_EMPLOYEE_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        employee: action.payload,
      };
    default:
      return state;
  }
};

const deleteEmployee = (
  state: EmployeeState['deleteEmployee'] = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    deletedId: undefined,
  },
  action: EmployeeAction,
): EmployeeState['deleteEmployee'] => {
  switch (action.type) {
    case 'DELETE_EMPLOYEE_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
      };
    case 'DELETE_EMPLOYEE_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        deletedId: action.payload,
      };
    case 'DELETE_EMPLOYEE_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        deletedId: undefined,
      };
    default:
      return state;
  }
};

export default combineReducers({
  editEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
});

