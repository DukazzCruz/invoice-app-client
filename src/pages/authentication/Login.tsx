import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { compose } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { AuthStackParamList, RootState } from '../../types';

import Logo from '../../components/Logo';
import Loader from '../../components/Loader';
import { loginUser } from '../../actions/auth.actions';
import { ErrorUtils } from '../../utils/error.utils';
import { email, required } from '../../utils/redux.form.utils';
import TextField from '../../components/form/TextField';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

interface LoginFormValues {
  email: string;
  password: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = InjectedFormProps<LoginFormValues> & PropsFromRedux;

const Login: React.FC<Props> = ({ handleSubmit, loginUser: loginState, dispatch }) => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await dispatch(loginUser(values) as any);
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
      {loginState.isLoading && <Loader />}
      <Logo />
      <Card mode="contained" style={styles.card}>
        <Card.Content>
          <Field
            name="email"
            component={TextField}
            label={t('auth.login.email')}
            keyboardType="email-address"
            autoCapitalize="none"
            validate={[email, required]}
          />
          <Field
            name="password"
            component={TextField}
            label={t('auth.login.password')}
            secureTextEntry
            validate={[required]}
          />
          <Button
            mode="contained"
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          >
            {t('auth.login.loginButton')}
          </Button>
          <Button onPress={() => navigation.navigate('SignUp')}>
            <Text>{t('auth.login.noAccount')}</Text>
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
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  card: {
    marginTop: 24,
  },
  button: {
    marginTop: 16,
  },
});

const mapStateToProps = (state: RootState) => ({
  loginUser: state.authReducer.loginUser || {
    isLoading: false,
    isError: false,
    isSuccess: false,
    errors: null,
  },
});

const connector = connect(mapStateToProps);

export default compose(
  connector,
  reduxForm<LoginFormValues>({
    form: 'login',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: true,
  }),
)(Login) as React.ComponentType;

