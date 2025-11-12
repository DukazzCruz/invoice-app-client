import React from 'react';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import { getUser } from '../actions/auth.actions';
import { getInvoicesList } from '../actions/invoice.actions';
import { getCustomersList } from '../actions/customer.actions';
import { getItemsList } from '../actions/item.actions';
import { getEmployeesList } from '../actions/employee.actions';
import { ErrorUtils } from '../utils/error.utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MainPageHeaderProps {
  title: string;
}

const MainPageHeader: React.FC<MainPageHeaderProps> = ({ title }) => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();

  const refreshData = async () => {
    try {
      const responses = await Promise.all([
        dispatch(getUser() as any),
        dispatch(getInvoicesList() as any),
        dispatch(getCustomersList() as any),
        dispatch(getItemsList() as any),
        dispatch(getEmployeesList() as any),
      ]);
      const hasSuccess = responses.every((response: any) => response?.success);
      if (!hasSuccess) {
        throw responses;
      }
    } catch (error) {
      const err = new ErrorUtils(error);
      err.showAlert();
    }
  };

  return (
    <Appbar.Header elevated>
      <Appbar.Action
        icon="account-circle-outline"
        onPress={() => navigation.navigate('Profile')}
      />
      <Appbar.Content title={title} />
      <Appbar.Action icon="refresh" onPress={refreshData} />
    </Appbar.Header>
  );
};

export default MainPageHeader;

