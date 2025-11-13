import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View, ListRenderItem } from 'react-native';
import { FAB, Searchbar } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { RootStackParamList, RootState, Invoice, Customer } from '../../types';

import MainPageHeader from '../../components/MainPageHeader';
import ListView from '../../components/ListView';
import EmptyListPlaceHolder from '../../components/EmptyListPlaceHolder';
import Loader from '../../components/Loader';
import { getCurrency } from '../../utils/currencies.utils';
import { formatCurrency } from '../../utils/redux.form.utils';
import { zeroPad } from '../../utils/general.utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

const Invoices: React.FC<Props> = ({ getInvoices, getCustomers, getUser }) => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const invoices = getInvoices.invoicesList || [];
  const customers = getCustomers.customersList || [];
  const currency = getCurrency(getUser.userDetails.base_currency);
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const customerMap = useMemo(() => {
    const map: Record<string, string> = {};
    customers.forEach((customer: Customer) => {
      map[customer._id] = customer.name;
    });
    return map;
  }, [customers]);

  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return invoices;
    
    const query = searchQuery.toLowerCase();
    return invoices.filter((invoice: Invoice) => {
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer._id;
      const customerName = customerMap[customerId] || '';
      const invoiceNumber = invoice.number || '';
      
      return customerName.toLowerCase().includes(query) || 
             invoiceNumber.toLowerCase().includes(query);
    });
  }, [invoices, searchQuery, customerMap]);

  const renderItem: ListRenderItem<Invoice> = ({ item }) => {
    const customerId = typeof item.customer === 'string' ? item.customer : item.customer._id;
    return (
      <ListView
        title={customerMap[customerId] || t('screens.customer')}
        subtitle={item.number}
        right={formatCurrency(item.total, currency)}
        rightSub={moment(item.issued).format('DD/MM/YYYY')}
        handleClickEvent={() => navigation.navigate('InvoiceForm', { invoice: item })}
      />
    );
  };

  const handleAddInvoice = () => {
    const newNumber = zeroPad((invoices?.length || 0) + 1, 8);
    navigation.navigate('InvoiceForm', { invoice: null, newNumber });
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {getInvoices.isLoading && <Loader />}
      <MainPageHeader title={t('screens.invoices')} />
      <Searchbar
        placeholder={t('placeholders.searchInvoices')}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredInvoices}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => (
          <EmptyListPlaceHolder message={t('emptyMessages.noInvoices')} />
        )}
      />
      <FAB icon="plus" style={[styles.fab, { bottom: 16 + insets.bottom }]} onPress={handleAddInvoice} />
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
  getInvoices: state.invoiceReducer.getInvoices,
  getCustomers: state.customerReducer.getCustomers,
  getUser: state.userReducer.getUser,
});

const connector = connect(mapStateToProps);

export default connector(Invoices);

