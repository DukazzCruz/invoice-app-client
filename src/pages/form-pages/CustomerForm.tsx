import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { compose } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, RootState, Customer } from '../../types';

import InnerPageHeader from '../../components/InnerPageHeader';
import Loader from '../../components/Loader';
import TextField from '../../components/form/TextField';
import { editCustomer, getCustomersList } from '../../actions/customer.actions';
import { ErrorUtils } from '../../utils/error.utils';
import { email, phone, required } from '../../utils/redux.form.utils';

type CustomerFormRouteProp = RouteProp<RootStackParamList, 'CustomerForm'>;

interface CustomerFormValues {
  name: string;
  email: string;
  company?: string;
  phone: string;
  mobile?: string;
  address_1: string;
  address_2?: string;
  address_3?: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = InjectedFormProps<CustomerFormValues> & PropsFromRedux;

const CustomerForm: React.FC<Props> = ({ handleSubmit, dispatch, editCustomer: editCustomerState }) => {
  const insets = useSafeAreaInsets();
  const route = useRoute<CustomerFormRouteProp>();
  const customer = route.params?.customer;
  const { t } = useTranslation();

  const onSubmit = async (values: CustomerFormValues) => {
    const addresses = [values.address_1, values.address_2, values.address_3].filter(
      (address) => address && address.trim().length,
    );
    if (!addresses.length) {
      Alert.alert(t('screens.customers'), t('validation.required'));
      return;
    }
    const payload: any = { ...values, addresses };
    delete payload.address_1;
    delete payload.address_2;
    delete payload.address_3;

    try {
      const response = await dispatch(editCustomer(payload) as any);
      if (!response?.success) {
        throw response;
      }
      const refresh = await dispatch(getCustomersList() as any);
      if (!refresh?.success) {
        throw refresh;
      }
      Alert.alert(t('screens.customers'), t('messages.customerSaved'));
    } catch (error) {
      const err = new ErrorUtils(error);
      err.showAlert();
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {editCustomerState.isLoading && <Loader />}
      <InnerPageHeader title={t('screens.customer')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Card.Content>
            <Field name="name" component={TextField} label={t('fields.name')} validate={[required]} />
            <Field
              name="email"
              component={TextField}
              label={t('fields.email')}
              keyboardType="email-address"
              autoCapitalize="none"
              validate={[email, required]}
            />
            <Field name="company" component={TextField} label={t('fields.company')} />
            <Field
              name="phone"
              component={TextField}
              label={t('fields.phone')}
              keyboardType="phone-pad"
              validate={[required, phone]}
            />
            <Field
              name="mobile"
              component={TextField}
              label={t('fields.mobile')}
              keyboardType="phone-pad"
            />
            <Field
              name="address_1"
              component={TextField}
              label={t('fields.address1')}
              validate={[required]}
            />
            <Field name="address_2" component={TextField} label={t('fields.address2')} />
            <Field name="address_3" component={TextField} label={t('fields.address3')} />
            <Button
              mode="contained"
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
            >
              {t('buttons.save')}
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
});

const mapStateToProps = (state: RootState, ownProps: any) => {
  const customer = ownProps?.route?.params?.customer;
  if (!customer) {
    return {
      editCustomer: state.customerReducer.editCustomer || {
        isLoading: false,
        isError: false,
        isSuccess: false,
        customer: undefined,
      },
    };
  }
  return {
    editCustomer: state.customerReducer.editCustomer || {
      isLoading: false,
      isError: false,
      isSuccess: false,
      customer: undefined,
    },
    initialValues: {
      name: customer.name,
      company: customer.company,
      email: customer.email,
      phone: customer.phone,
      mobile: customer.mobile,
      address_1: customer.addresses?.[0] || '',
      address_2: customer.addresses?.[1] || '',
      address_3: customer.addresses?.[2] || '',
    },
  };
};

const connector = connect(mapStateToProps);

export default compose(
  connector,
  reduxForm<CustomerFormValues>({
    form: 'customerForm',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: true,
  }),
)(CustomerForm) as React.ComponentType;

