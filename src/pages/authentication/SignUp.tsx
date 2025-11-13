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

import InnerPageHeader from '../../components/InnerPageHeader';
import Loader from '../../components/Loader';
import TextField from '../../components/form/TextField';
import SelectField from '../../components/form/SelectField';
import { registerNewUser } from '../../actions/auth.actions';
import { ErrorUtils } from '../../utils/error.utils';
import { currencies } from '../../utils/currencies.utils';
import { email, phone, required } from '../../utils/redux.form.utils';
import { detectRegionalSettings } from '../../utils/regional.utils';

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
  const { t } = useTranslation();

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      // Detectar configuración regional automáticamente
      const regionalSettings = detectRegionalSettings();
      console.log('🔍 SignUp: Detected regional settings', regionalSettings);

      // Combinar los valores del formulario con la configuración regional
      const registrationData = {
        ...values,
        // Usar la moneda seleccionada por el usuario o la detectada automáticamente
        base_currency: values.base_currency || regionalSettings.baseCurrency,
        // Configuración regional detectada automáticamente
        numberFormat: regionalSettings.numberFormat,
        currencyFormat: regionalSettings.currencyFormat,
        dateFormat: regionalSettings.dateFormat,
        locale: regionalSettings.locale,
        temperatureUnit: regionalSettings.temperatureUnit,
        distanceUnit: regionalSettings.distanceUnit,
      };

      console.log('📝 SignUp: Registration data with regional settings', registrationData);
      const response = await dispatch(registerNewUser(registrationData) as any);
      if (!response.success) {
        throw response;
      }
      console.log('✅ SignUp: User registered successfully with regional settings');
    } catch (error) {
      console.error('❌ SignUp: Error during registration:', error);
      const err = new ErrorUtils(error);
      err.showAlert();
    }
  };

  return (
    <View style={styles.container}>
      {registerUser.isLoading && <Loader />}
      <InnerPageHeader title={t('auth.signup.title')} />
      <Card style={styles.card}>
        <Card.Content>
          <Field name="name" component={TextField} label={t('auth.signup.name')} validate={[required]} />
          <Field
            name="email"
            component={TextField}
            label={t('auth.signup.email')}
            keyboardType="email-address"
            autoCapitalize="none"
            validate={[email, required]}
          />
          <Field
            name="password"
            component={TextField}
            label={t('auth.signup.password')}
            secureTextEntry
            validate={[required]}
          />
          <Field name="company" component={TextField} label={t('auth.signup.company')} />
          <Field
            name="phone"
            component={TextField}
            label={t('auth.signup.phone')}
            keyboardType="phone-pad"
            validate={[required, phone]}
          />
          <Field
            name="address"
            component={TextField}
            label={t('auth.signup.address')}
            validate={[required]}
          />
          <Field
            name="base_currency"
            component={SelectField}
            label={t('auth.signup.baseCurrency')}
            optionsArray={currencies}
            validate={[required]}
            placeholder={t('auth.signup.selectCurrency')}
          />
          <Button
            mode="contained"
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          >
            {t('auth.signup.createAccount')}
          </Button>
          <Button onPress={() => navigation.goBack()}>
            <Text>{t('auth.signup.haveAccount')}</Text>
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

