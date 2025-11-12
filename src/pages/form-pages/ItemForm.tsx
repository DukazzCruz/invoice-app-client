import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { compose } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList, RootState, Item } from '../../types';

import InnerPageHeader from '../../components/InnerPageHeader';
import Loader from '../../components/Loader';
import TextField from '../../components/form/TextField';
import { editItem, getItemsList } from '../../actions/item.actions';
import { ErrorUtils } from '../../utils/error.utils';
import { formatCurrency, normalizeCurrency, number, required } from '../../utils/redux.form.utils';
import { getCurrency } from '../../utils/currencies.utils';

type ItemFormRouteProp = RouteProp<RootStackParamList, 'ItemForm'>;

interface ItemFormValues {
  name: string;
  price: string;
  description?: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = InjectedFormProps<ItemFormValues> & PropsFromRedux;

const ItemForm: React.FC<Props> = ({ handleSubmit, dispatch, editItem: editItemState, getUser }) => {
  const insets = useSafeAreaInsets();
  const route = useRoute<ItemFormRouteProp>();
  const item = route.params?.item;
  const currency = getCurrency(getUser.userDetails.base_currency);
  
  const onSubmit = async (values: ItemFormValues) => {
    try {
      const payload = {
        ...values,
        price: parseFloat(values.price),
      };
      const response = await dispatch(editItem(payload) as any);
      if (!response?.success) {
        throw response;
      }
      const refresh = await dispatch(getItemsList() as any);
      if (!refresh?.success) {
        throw refresh;
      }
      Alert.alert('Items', 'Producto guardado correctamente.');
    } catch (error) {
      const err = new ErrorUtils(error);
      err.showAlert();
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {editItemState.isLoading && <Loader />}
      <InnerPageHeader title="Item" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Card.Content>
            <Field
              name="name"
              component={TextField}
              label="Nombre"
              validate={[required]}
            />
            <Field
              name="price"
              component={TextField}
              label={`Precio (${currency})`}
              keyboardType="numeric"
              validate={[required, number]}
              format={(value: any) => formatCurrency(value, currency)}
              normalize={(value: any) => normalizeCurrency(value)}
            />
            <Field
              name="description"
              component={TextField}
              label="Descripción"
              multiline
            />
            <Button
              mode="contained"
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
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
});

const mapStateToProps = (state: RootState, ownProps: any) => {
  const item = ownProps?.route?.params?.item;
  return {
    editItem: state.itemReducer.editItem || {
      isLoading: false,
      isError: false,
      isSuccess: false,
      item: undefined,
    },
    getUser: state.userReducer.getUser,
    initialValues: item
      ? {
          name: item.name,
          price: item.price?.toString() || '0',
          description: item.description || '',
        }
      : undefined,
  };
};

const connector = connect(mapStateToProps);

export default compose(
  connector,
  reduxForm<ItemFormValues>({
    form: 'itemForm',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: true,
  }),
)(ItemForm) as React.ComponentType;

