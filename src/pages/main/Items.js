import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MainPageHeader from '../../components/MainPageHeader';
import ListView from '../../components/ListView';
import EmptyListPlaceHolder from '../../components/EmptyListPlaceHolder';
import Loader from '../../components/Loader';
import { getCurrency } from '../../utils/currencies.utils';
import { formatCurrency } from '../../utils/redux.form.utils';

const Items = ({ getItems, getUser }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const currency = getCurrency(getUser.userDetails.base_currency);
  const items = getItems.itemsList || [];

  const renderItem = ({ item }) => (
    <ListView
      title={item.name}
      subtitle={item.description}
      right={formatCurrency(item.price, currency)}
      handleClickEvent={() => navigation.navigate('ItemForm', { item })}
    />
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {getItems.isLoading && <Loader />}
      <MainPageHeader title="Items" />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => (
          <EmptyListPlaceHolder message="No hay productos registrados." />
        )}
      />
      <FAB
        icon="plus"
        style={[styles.fab, { bottom: 16 + insets.bottom }]}
        onPress={() => navigation.navigate('ItemForm', { item: null })}
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
    bottom: 16,
  },
});

const mapStateToProps = (state) => ({
  getItems: state.itemReducer.getItems,
  getUser: state.userReducer.getUser,
});

export default connect(mapStateToProps)(Items);
