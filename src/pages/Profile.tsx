import React from 'react';
import { Alert, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { compose } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import InnerPageHeader from '../components/InnerPageHeader';
import Loader from '../components/Loader';
import TextField from '../components/form/TextField';
import RenderSelectOption from '../components/reduxFormRenderers/RenderSelectOption';
import { editUser, getUser, logoutUser } from '../actions/auth.actions';
import { ErrorUtils } from '../utils/error.utils';
import { currencies } from '../utils/currencies.utils';
import { phone, required } from '../utils/redux.form.utils';
import LanguageSelector from '../components/LanguageSelector';
import { RootState } from '../types';

interface User {
  _id?: string;
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  address?: string;
  base_currency?: string;
  language?: string;
}

interface ProfileFormValues {
  company?: string;
  phone: string;
  address: string;
  base_currency: string;
  language: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = InjectedFormProps<ProfileFormValues> & PropsFromRedux;

const Profile: React.FC<Props> = ({ handleSubmit, dispatch, editUser: editUserState }) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const response = await dispatch(editUser(values) as any);
      if (!response.success) {
        throw response;
      }
      await dispatch(getUser() as any);
      Alert.alert(t('screens.profile'), t('messages.profileUpdated'));
    } catch (error) {
      const err = new ErrorUtils(error);
      err.showAlert();
    }
  };

  const onLogout = () => {
    dispatch(logoutUser() as any);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <InnerPageHeader title={t('screens.profile')} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Field
              name="company"
              label={t('fields.company')}
              component={TextField}
              placeholder={t('fields.companyPlaceholder')}
            />
            <Field
              name="phone"
              label={t('fields.phone')}
              component={TextField}
              placeholder={t('fields.phonePlaceholder')}
              validate={[required, phone]}
              keyboardType="phone-pad"
            />
            <Field
              name="address"
              label={t('fields.address')}
              component={TextField}
              placeholder={t('fields.addressPlaceholder')}
              multiline
              numberOfLines={2}
            />
            <Field
              name="base_currency"
              label={t('fields.base_currency')}
              component={RenderSelectOption}
              optionsArray={currencies}
              placeholder={t('fields.currencyPlaceholder')}
              validate={[required]}
            />
            <View style={styles.languageFieldContainer}>
              <Text style={styles.languageLabel}>{t('fields.language')}</Text>
              <LanguageSelector />
            </View>
          </Card.Content>
        </Card>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          loading={editUserState.isLoading}
          disabled={editUserState.isLoading}
        >
          {t('actions.update')}
        </Button>
        <Button
          mode="outlined"
          onPress={onLogout}
          style={styles.button}
        >
          {t('actions.logout')}
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  languageFieldContainer: {
    // Add styles for languageFieldContainer here
  },
  languageLabel: {
    // Add styles for languageLabel here
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
    language: state.userReducer.getUser.userDetails.language,
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
