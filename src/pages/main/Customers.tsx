import React from 'react';
import { FlatList, StyleSheet, View, ListRenderItem } from 'react-native';
import { FAB } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootState, Customer } from '../../types';

import MainPageHeader from '../../components/MainPageHeader';
import ListView from '../../components/ListView';
import EmptyListPlaceHolder from '../../components/EmptyListPlaceHolder';
import Loader from '../../components/Loader';
import { getCurrency } from '../../utils/currencies.utils';
import { formatCurrency } from '../../utils/redux.form.utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

const Customers: React.FC<Props> = ({ getCustomers, getUser }) => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const currency = getCurrency(getUser.userDetails.base_currency);
  const customers = getCustomers.customersList || [];

  const renderItem: ListRenderItem<Customer> = ({ item }) => (
    <ListView
      title={item.name}
      subtitle={`${item.number_invoices || 0} facturas`}
      right={formatCurrency(item.total || 0, currency)}
      handleClickEvent={() =>
        navigation.navigate('CustomerForm', { customer: item })
      }
    />
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {getCustomers.isLoading && <Loader />}
      <MainPageHeader title="Clientes" />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={customers}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => (
          <EmptyListPlaceHolder message="No hay clientes registrados." />
        )}
      />
      <FAB
        icon="plus"
        style={[styles.fab, { bottom: 16 + insets.bottom }]}
        onPress={() => navigation.navigate('CustomerForm', { customer: null })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContent: {
    paddingBottom: 120,
  },
  fab: {
    position: 'absolute',
    right: 16,
  },
});

const mapStateToProps = (state: RootState) => ({
  getCustomers: state.customerReducer.getCustomers,
  getUser: state.userReducer.getUser,
});

const connector = connect(mapStateToProps);

export default connector(Customers);

