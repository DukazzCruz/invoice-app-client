import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { compose } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootState } from '../types';

import InnerPageHeader from '../components/InnerPageHeader';
import Loader from '../components/Loader';
import TextField from '../components/form/TextField';
import SelectField from '../components/form/SelectField';
import { editUser, getUser, logoutUser } from '../actions/auth.actions';
import { ErrorUtils } from '../utils/error.utils';
import { currencies } from '../utils/currencies.utils';
import { phone, required } from '../utils/redux.form.utils';

interface ProfileFormValues {
  company?: string;
  phone: string;
  address: string;
  base_currency: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = InjectedFormProps<ProfileFormValues> & PropsFromRedux;

const Profile: React.FC<Props> = ({ handleSubmit, dispatch, editUser: editUserState }) => {
  const insets = useSafeAreaInsets();
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const response = await dispatch(editUser(values) as any);
      if (!response.success) {
        throw response;
      }
      await dispatch(getUser() as any);
      Alert.alert('Perfil', 'Datos actualizados correctamente.');
    } catch (error) {
      const err = new ErrorUtils(error);
      err.showAlert();
    }
  };

  const onLogout = () => {
    dispatch(logoutUser() as any);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {editUserState.isLoading && <Loader />}
      <InnerPageHeader title="Perfil" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Card.Content>
            <Field name="company" component={TextField} label="Compañía" />
            <Field
              name="phone"
              component={TextField}
              label="Teléfono"
              keyboardType="phone-pad"
              validate={[required, phone]}
            />
            <Field
              name="address"
              component={TextField}
              label="Dirección"
              validate={[required]}
            />
            <Field
              name="base_currency"
              component={SelectField}
              label="Moneda base"
              optionsArray={currencies}
              validate={[required]}
              placeHolder="Selecciona una moneda"
            />
            <Button
              mode="contained"
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
            >
              Guardar cambios
            </Button>
            <Button mode="outlined" onPress={onLogout}>
              Cerrar sesión
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
    marginVertical: 12,
  },
});

const mapStateToProps = (state: RootState) => ({
  editUser: state.userReducer.editUser || {
    isLoading: false,
    isError: false,
    isSuccess: false,
    user: undefined,
  },
  initialValues: {
    company: state.userReducer.getUser.userDetails.company,
    phone: state.userReducer.getUser.userDetails.phone,
    address: state.userReducer.getUser.userDetails.address,
    base_currency: state.userReducer.getUser.userDetails.base_currency,
  },
});

const connector = connect(mapStateToProps);

export default compose(
  connector,
  reduxForm<ProfileFormValues>({
    form: 'editUser',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: true,
  }),
)(Profile) as React.ComponentType;

