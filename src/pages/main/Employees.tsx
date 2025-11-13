import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, StyleSheet, View, ListRenderItem } from 'react-native';
import { FAB, Searchbar } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootState, Employee } from '../../types';
import { useTranslation } from 'react-i18next';

import MainPageHeader from '../../components/MainPageHeader';
import ListView from '../../components/ListView';
import EmptyListPlaceHolder from '../../components/EmptyListPlaceHolder';
import Loader from '../../components/Loader';
import { getEmployeesList } from '../../actions/employee.actions';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

const Employees: React.FC<Props> = ({ getEmployees, dispatch }) => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const employees = getEmployees.employeesList || [];
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;
    
    const query = searchQuery.toLowerCase();
    return employees.filter((employee: Employee) => 
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.role.toLowerCase().includes(query)
    );
  }, [employees, searchQuery]);

  useEffect(() => {
    dispatch(getEmployeesList() as any);
  }, [dispatch]);

  const renderItem: ListRenderItem<Employee> = ({ item }) => (
    <ListView
      title={item.name}
      subtitle={item.role}
      right={item.email}
      rightSub={item.active ? t('fields.active') : t('fields.inactive')}
      handleClickEvent={() =>
        navigation.navigate('EmployeeForm', { employee: item })
      }
    />
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {getEmployees.isLoading && <Loader />}
      <MainPageHeader title={t('screens.employees')} />
      <Searchbar
        placeholder={t('placeholders.searchEmployees')}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredEmployees}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => (
          <EmptyListPlaceHolder message={t('employees.noEmployees')} />
        )}
      />
      <FAB
        icon="plus"
        style={[styles.fab, { bottom: 16 + insets.bottom }]}
        onPress={() => navigation.navigate('EmployeeForm', { employee: null })}
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
  getEmployees: state.employeeReducer.getEmployees,
});

const connector = connect(mapStateToProps);

export default connector(Employees);
