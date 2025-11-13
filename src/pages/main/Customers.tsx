import React, { useState, useMemo } from 'react';
import { FlatList, StyleSheet, View, ListRenderItem } from 'react-native';
import { FAB, Searchbar } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    
    const query = searchQuery.toLowerCase();
    return customers.filter((customer: Customer) => 
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.company?.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  const renderItem: ListRenderItem<Customer> = ({ item }) => (
    <ListView
      title={item.name}
      subtitle={`${item.number_invoices || 0} ${t('screens.invoices').toLowerCase()}`}
      right={formatCurrency(item.total || 0, currency)}
      handleClickEvent={() =>
        navigation.navigate('CustomerForm', { customer: item })
      }
    />
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {getCustomers.isLoading && <Loader />}
      <MainPageHeader title={t('screens.customers')} />
      <Searchbar
        placeholder={t('placeholders.searchCustomers')}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredCustomers}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => (
          <EmptyListPlaceHolder message={t('emptyMessages.noCustomers')} />
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
  searchbar: {
    marginHorizontal: 16,
    marginVertical: 8,
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

