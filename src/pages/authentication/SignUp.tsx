import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { compose } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList, RootState } from '../../types';

import InnerPageHeader from '../../components/InnerPageHeader';
import Loader from '../../components/Loader';
import TextField from '../../components/form/TextField';
import SelectField from '../../components/form/SelectField';
import { registerNewUser } from '../../actions/auth.actions';
import { ErrorUtils } from '../../utils/error.utils';
import { currencies } from '../../utils/currencies.utils';
import { email, phone, required } from '../../utils/redux.form.utils';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone: string;
  address: string;
  base_currency: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = InjectedFormProps<SignUpFormValues> & PropsFromRedux;

const SignUp: React.FC<Props> = ({ handleSubmit, registerUser, dispatch }) => {
  const navigation = useNavigation<NavigationProp>();

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      const response = await dispatch(registerNewUser(values) as any);
      if (!response.success) {
        throw response;
      }
    } catch (error) {
      const err = new ErrorUtils(error);
      err.showAlert();
    }
  };

  return (
    <View style={styles.container}>
      {registerUser.isLoading && <Loader />}
      <InnerPageHeader title="Crea tu cuenta" />
      <Card style={styles.card}>
        <Card.Content>
          <Field name="name" component={TextField} label="Nombre" validate={[required]} />
          <Field
            name="email"
            component={TextField}
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            validate={[email, required]}
          />
          <Field
            name="password"
            component={TextField}
            label="Contraseña"
            secureTextEntry
            validate={[required]}
          />
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
            Crear cuenta
          </Button>
          <Button onPress={() => navigation.goBack()}>
            <Text>¿Ya tienes cuenta? Inicia sesión</Text>
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  card: {
    marginTop: 16,
    flex: 1,
  },
  button: {
    marginTop: 16,
  },
});

const mapStateToProps = (state: RootState) => ({
  registerUser: state.authReducer.registerUser || {
    isLoading: false,
    isError: false,
    isSuccess: false,
    errors: null,
  },
});

const connector = connect(mapStateToProps);

export default compose(
  connector,
  reduxForm<SignUpFormValues>({
    form: 'register',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: true,
  }),
)(SignUp) as React.ComponentType;

