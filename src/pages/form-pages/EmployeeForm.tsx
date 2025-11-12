import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Switch, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootState, Employee } from '../../types';

import InnerPageHeader from '../../components/InnerPageHeader';
import Loader from '../../components/Loader';
import TextField from '../../components/form/TextFieldHook';
import { editEmployee, getEmployeesList, updateEmployee } from '../../actions/employee.actions';
import { ErrorUtils } from '../../utils/error.utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type EmployeeFormRouteProp = RouteProp<RootStackParamList, 'EmployeeForm'>;

interface EmployeeFormValues {
  name: string;
  email: string;
  role: string;
  phone?: string;
  active?: boolean;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

const EmployeeForm: React.FC<Props> = ({ editEmployee: editEmployeeState, updateEmployee: updateEmployeeState }) => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EmployeeFormRouteProp>();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const employee = route?.params?.employee;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormValues>({
    defaultValues: employee
      ? {
          name: employee.name || '',
          email: employee.email || '',
          role: employee.role || '',
          phone: employee.phone || '',
          active: employee.active !== undefined ? employee.active : true,
        }
      : {
          name: '',
          email: '',
          role: '',
          phone: '',
          active: true,
        },
  });

  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name || '',
        email: employee.email || '',
        role: employee.role || '',
        phone: employee.phone || '',
        active: employee.active !== undefined ? employee.active : true,
      });
    }
  }, [employee, reset]);

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      let response;
      if (employee && employee._id) {
        // Update existing employee
        response = await dispatch(updateEmployee(employee._id, values) as any);
      } else {
        // Create new employee
        response = await dispatch(editEmployee(values) as any);
      }

      if (!response?.success) {
        throw response;
      }

      const refresh = await dispatch(getEmployeesList() as any);
      if (!refresh?.success) {
        throw refresh;
      }

      Alert.alert('Empleados', 'Empleado guardado correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const err = new ErrorUtils(error);
      err.showAlert();
    }
  };

  const isLoading = editEmployeeState.isLoading || updateEmployeeState.isLoading;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {isLoading && <Loader />}
      <InnerPageHeader title="Empleado" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Card.Content>
            <Controller
              control={control}
              name="name"
              rules={{ required: 'El nombre es requerido', minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' } }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Nombre"
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message || ''}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{
                required: 'El email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message || ''}
                  editable={!employee} // Email cannot be changed for existing employees
                />
              )}
            />

            <Controller
              control={control}
              name="role"
              rules={{ required: 'El rol es requerido', minLength: { value: 2, message: 'El rol debe tener al menos 2 caracteres' } }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Rol"
                  value={value}
                  onChangeText={onChange}
                  error={errors.role?.message || ''}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              rules={{ minLength: { value: 6, message: 'El teléfono debe tener al menos 6 caracteres' } }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Teléfono"
                  value={value || ''}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  error={errors.phone?.message || ''}
                />
              )}
            />

            {employee && (
              <View style={styles.switchContainer}>
                <Text>Activo</Text>
                <Controller
                  control={control}
                  name="active"
                  render={({ field: { onChange, value } }) => (
                    <Switch value={value} onValueChange={onChange} />
                  )}
                />
              </View>
            )}

            <Button
              mode="contained"
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              Guardar
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingVertical: 8,
  },
});

const mapStateToProps = (state: RootState) => ({
  editEmployee: state.employeeReducer.editEmployee || {
    isLoading: false,
    isError: false,
    isSuccess: false,
    employee: undefined,
  },
  updateEmployee: state.employeeReducer.updateEmployee || {
    isLoading: false,
    isError: false,
    isSuccess: false,
    employee: undefined,
  },
});

const connector = connect(mapStateToProps);

export default connector(EmployeeForm);

