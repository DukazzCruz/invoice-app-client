import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, StyleSheet, View, ListRenderItem } from 'react-native';
import { FAB, Searchbar } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, RootState, Item } from '../../types';

import MainPageHeader from '../../components/MainPageHeader';
import ListView from '../../components/ListView';
import EmptyListPlaceHolder from '../../components/EmptyListPlaceHolder';
import Loader from '../../components/Loader';
import { getCurrency } from '../../utils/currencies.utils';
import { formatCurrency } from '../../utils/redux.form.utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

const Items: React.FC<Props> = ({ getItems, getUser }) => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const currency = getCurrency(getUser.userDetails.base_currency);
  const items = getItems.itemsList || [];
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter((item: Item) => 
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  const renderItem: ListRenderItem<Item> = ({ item }) => (
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
      <MainPageHeader title={t('screens.items')} />
      <Searchbar
        placeholder={t('placeholders.searchItems')}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => (
          <EmptyListPlaceHolder message={t('emptyMessages.noItems')} />
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
  getItems: state.itemReducer.getItems,
  getUser: state.userReducer.getUser,
});

const connector = connect(mapStateToProps);

export default connector(Items);

