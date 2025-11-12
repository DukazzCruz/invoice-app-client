import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View, ListRenderItem } from 'react-native';
import { FAB } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootState, Employee } from '../../types';

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

  useEffect(() => {
    dispatch(getEmployeesList() as any);
  }, [dispatch]);

  const renderItem: ListRenderItem<Employee> = ({ item }) => (
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

const mapStateToProps = (state: RootState) => ({
  getEmployees: state.employeeReducer.getEmployees,
});

const connector = connect(mapStateToProps);

export default connector(Employees);

