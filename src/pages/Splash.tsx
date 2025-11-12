import React, { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootState } from '../types';

import Logo from '../components/Logo';
import { getInvoicesList } from '../actions/invoice.actions';
import { getCustomersList } from '../actions/customer.actions';
import { getItemsList } from '../actions/item.actions';
import { getEmployeesList } from '../actions/employee.actions';
import { ErrorUtils } from '../utils/error.utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

const Splash: React.FC<Props> = ({ dispatch }) => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const loadData = async () => {
      try {
        const responses = await Promise.all([
          dispatch(getInvoicesList() as any),
          dispatch(getCustomersList() as any),
          dispatch(getItemsList() as any),
          dispatch(getEmployeesList() as any),
        ]);
        const success = responses.every((response: any) => response?.success);
        if (!success) {
          throw responses;
        }
        navigation.replace('HomeTabs');
      } catch (error) {
        const err = new ErrorUtils(error);
        err.showAlert();
        setTimeout(() => BackHandler.exitApp(), 4000);
      }
    };

    loadData();
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <Logo />
      <ActivityIndicator style={styles.loader} size="large" />
      <Text>Cargando datos...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginVertical: 24,
  },
});

const connector = connect();

export default connector(Splash);

