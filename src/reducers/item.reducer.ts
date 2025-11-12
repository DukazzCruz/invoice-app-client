import { combineReducers } from 'redux';
import { ItemState, ItemAction, Item } from '../types';

const getItems = (state: ItemState['getItems'] = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  itemsList: [],
}, action: ItemAction): ItemState['getItems'] => {
  switch (action.type) {
    case 'GET_ITEMS_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        itemsList: [],
      };
    case 'GET_ITEMS_SUCCESS':
      {
        const list = Array.isArray(action.payload)
          ? action.payload
          : (action.payload as any)?.results ?? [];
        return {
          isLoading: false,
          isError: false,
          isSuccess: true,
          itemsList: list as Item[],
        };
      }
    case 'GET_ITEMS_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        itemsList: (action.payload as any) || [],
      };
    default:
      return state;
  }
};

const editItem = (
  state: ItemState['editItem'] = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    item: undefined,
  },
  action: ItemAction,
): ItemState['editItem'] => {
  switch (action.type) {
    case 'EDIT_ITEM_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        item: undefined,
      };
    case 'EDIT_ITEM_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        item: action.payload,
      };
    case 'EDIT_ITEM_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        item: action.payload,
      };
    default:
      return state;
  }
};

export default combineReducers({
  editItem,
  getItems,
});

