import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { connect, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MainPageHeader from '../../components/MainPageHeader';
import ListView from '../../components/ListView';
import EmptyListPlaceHolder from '../../components/EmptyListPlaceHolder';
import Loader from '../../components/Loader';
import { getEmployeesList } from '../../actions/employee.actions';

const Employees = ({ getEmployees }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const employees = getEmployees.employeesList || [];

  useEffect(() => {
    dispatch(getEmployeesList());
  }, [dispatch]);

  const renderItem = ({ item }) => (
    <ListView
      title={item.name}
      subtitle={item.role}
      right={item.email}
      rightSub={item.active ? 'Activo' : 'Inactivo'}
      handleClickEvent={() =>
        navigation.navigate('EmployeeForm', { employee: item })
      }
    />
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {getEmployees.isLoading && <Loader />}
      <MainPageHeader title="Empleados" />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={employees}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => (
          <EmptyListPlaceHolder message="No hay empleados registrados." />
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
  listContent: {
    paddingBottom: 120,
  },
  fab: {
    position: 'absolute',
    right: 16,
  },
});

const mapStateToProps = (state) => ({
  getEmployees: state.employeeReducer.getEmployees,
});

export default connect(mapStateToProps)(Employees);

