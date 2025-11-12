import { combineReducers } from 'redux';
import { UserState, UserAction, User } from '../types';

const getUser = (state: UserState['getUser'] = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  userDetails: {} as User,
}, action: UserAction): UserState['getUser'] => {
  switch (action.type) {
    case 'GET_USER_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        userDetails: {} as User,
      };
    case 'GET_USER_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        userDetails: action.payload,
      };
    case 'GET_USER_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        userDetails: (action.payload as any) || ({} as User),
      };
    default:
      return state;
  }
};

const editUser = (
  state: UserState['editUser'] = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    user: undefined,
  },
  action: UserAction,
): UserState['editUser'] => {
  switch (action.type) {
    case 'EDIT_USER_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        user: undefined,
      };
    case 'EDIT_USER_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        user: action.payload,
      };
    case 'EDIT_USER_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default combineReducers({
  getUser,
  editUser,
});

