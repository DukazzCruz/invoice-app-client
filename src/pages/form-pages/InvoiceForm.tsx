import React, { Component } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, FAB } from 'react-native-paper';
import { change, Field, FieldArray, formValueSelector, reduxForm, InjectedFormProps } from 'redux-form';
import { bindActionCreators, compose } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import {
  formatCurrency,
  normalizeCurrency,
  number,
  required,
  validatePositiveTimeDifference,
} from '../../utils/redux.form.utils';
import { ErrorUtils } from '../../utils/error.utils';
import { editInvoice, getInvoicesList, sendInvoiceByEmail } from '../../actions/invoice.actions';
import Loader from '../../components/Loader';
import renderTextInput from '../../components/reduxFormRenderers/RenderTextInput';
import renderItemsTextInputArray from '../../components/reduxFormRenderers/RenderItemsInputArray';
import renderSelectOption from '../../components/reduxFormRenderers/RenderSelectOption';
import renderDatePicker from '../../components/reduxFormRenderers/RenderDatePicker';
import { getCurrency } from '../../utils/currencies.utils';
import InnerPageHeader from '../../components/InnerPageHeader';
import { RootStackParamList, RootState, Invoice, InvoiceItem } from '../../types';

type InvoiceFormRouteProp = RouteProp<RootStackParamList, 'InvoiceForm'>;

interface InvoiceFormValues {
  number: string;
  customer: string | null;
  issued: Date;
  due: Date;
  items: Array<{ item: string | null; quantity: string; subtotal: string }>;
  subtotal: string;
  discount: string;
  total: string;
}

interface InvoiceFormProps extends InjectedFormProps<InvoiceFormValues> {
  editInvoice: RootState['invoiceReducer']['editInvoice'];
  getItems: RootState['itemReducer']['getItems'];
  getCustomers: RootState['customerReducer']['getCustomers'];
  getUser: RootState['userReducer']['getUser'];
  subtotalValue: string;
  change: typeof change;
  route: InvoiceFormRouteProp;
}

/**
 * Form component for adding editing, or sending an invoice.
 */
class InvoiceForm extends Component<InvoiceFormProps> {
  /**
   * Dispatches an action to edit or add invoice
   * alerts on error and refreshes list on success
   */
  sendInvoiceData = async (values: InvoiceFormValues) => {
    try {
      const payload = {
        number: values.number,
        customer: values.customer!,
        issued: values.issued.toISOString(),
        due: values.due.toISOString(),
        items: values.items.map((item) => ({
          item: item.item!,
          quantity: Number(item.quantity),
          subtotal: Number(item.subtotal),
        })),
        subtotal: Number(values.subtotal),
        discount: Number(values.discount),
        total: Number(values.total),
      };
      const response = await (this.props as any).dispatch(editInvoice(payload));
      if (!response || !response.success) {
        throw response;
      } else {
        await this.refreshInvoicesList();
        return response;
      }
    } catch (e) {
      const newError = new ErrorUtils(e);
      newError.showAlert();
    }
  };

  /**
   * Called after modifying invoice data by editing or adding.
   * dispatches action to load invoice list with changes
   */
  refreshInvoicesList = async () => {
    try {
      const response = await (this.props as any).dispatch(getInvoicesList());
      if (!response || !response.success) {
        throw response;
      } else {
        Alert.alert('Facturas', 'Lista de facturas actualizada correctamente.');
        return response;
      }
    } catch (e) {
      const newError = new ErrorUtils(e);
      newError.showAlert();
    }
  };

  /**
   * After saving the invoice this method  sets up and sends a payment session by emails
   */
  sendInvoiceByEmail = async (values: InvoiceFormValues) => {
    try {
      let response = await this.sendInvoiceData(values);
      if (!response || !response.success) {
        throw response;
      } else {
        const paymentParams = {
          invoice: (response as any).responseBody.value._id,
          status: false,
          paid_on: null,
          amount_paid: 0,
          amount_due: (response as any).responseBody.value.total,
        };
        response = await (this.props as any).dispatch(sendInvoiceByEmail(paymentParams));
        if (!response || !response.success) {
          throw response;
        } else {
          Alert.alert('Facturas', 'Factura enviada por email correctamente.');
          return response;
        }
      }
    } catch (e) {
      const newError = new ErrorUtils(e);
      newError.showAlert();
    }
  };

  onSendInvoice = (values: InvoiceFormValues) => {
    this.sendInvoiceByEmail(values);
  };

  onSubmit = (values: InvoiceFormValues) => {
    this.sendInvoiceData(values);
  };

  /**
   * After submitting field values this method retrieves items data to compute subtotal.
   * The method is called on submit because the fields' state or the item field array
   * will always appear one step behind real state when called or retrieved by a selector.
   * By submitting data, redux updates all fields with correct values.
   */
  calculateSubTotal = (values: InvoiceFormValues) => {
    if (values.items) {
      const allItemsSubtotal = values.items.reduce((a, b) => {
        return a + Number(b.subtotal);
      }, 0);
      values.subtotal = String(allItemsSubtotal);
      values.total = String(allItemsSubtotal - Number(values.discount || 0));
    }
  };

  render() {
    const { handleSubmit, editInvoice, getItems, getCustomers, subtotalValue, change, getUser: { userDetails } } = this.props;
    const currency = getCurrency(userDetails.base_currency);

    return (
      <View style={styles.container}>
        {editInvoice.isLoading && <Loader />}
        <InnerPageHeader title={'Factura'} />
        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Field
                name={'number'}
                keyboardType={'default'}
                placeholder={'INV0000'}
                validate={[required]}
                component={renderTextInput}
              />
              <Field
                component={renderDatePicker}
                keyboardType="default"
                name={'issued'}
                label={'Issued: '}
                placeholder="YYYY/MM/DD"
                validate={[required]}
              />
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <Field
                name={`customer`}
                component={renderSelectOption}
                iosHeader="Select Customer"
                placeHolder={'Select a customer...'}
                optionsArray={(getCustomers.customersList || [])}
                label={'To: '}
                validate={[required]}
                placeholder={'Customer'}
              />
              <Field
                component={renderDatePicker}
                keyboardType="default"
                name={'due'}
                label={'Due: '}
                placeholder="YYYY/MM/DD"
                validate={[required]}
              />
            </Card.Content>
          </Card>
          <FieldArray
            name="items"
            optionsArray={getItems.itemsList || []}
            change={change}
            currency={currency}
            component={renderItemsTextInputArray}
          />
          <Card style={styles.card}>
            <Card.Content>
              <Button
                mode="outlined"
                icon="calculator"
                onPress={handleSubmit(this.calculateSubTotal)}
                style={styles.button}
              >
                Calcular Total
              </Button>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <Field
                name={'subtotal'}
                keyboardType={'numeric'}
                placeholder={'0'}
                label={'Subtotal'}
                textAlign={'right'}
                defaultValue={'0'}
                editable={false}
                format={(value: any) => formatCurrency(value, currency)}
                normalize={(value: any) => normalizeCurrency(value)}
                validate={[required, number]}
                component={renderTextInput}
              />
              <Field
                name={'discount'}
                keyboardType={'numeric'}
                placeholder={'0'}
                label={'Discount'}
                textAlign={'right'}
                onChange={(value: any) => {
                  const normalized = normalizeCurrency(value);
                  change('total', String(Number(subtotalValue) - Number(normalized)));
                }}
                format={(value: any) => formatCurrency(value, currency)}
                normalize={(value: any) => normalizeCurrency(value)}
                validate={[required, number]}
                component={renderTextInput}
              />
              <Field
                name={'total'}
                keyboardType={'numeric'}
                placeholder={'0'}
                label={'Total'}
                textAlign={'right'}
                editable={false}
                format={(value: any) => formatCurrency(value, currency)}
                normalize={(value: any) => normalizeCurrency(value)}
                validate={[required, number]}
                component={renderTextInput}
              />
            </Card.Content>
          </Card>
        </ScrollView>
        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleSubmit(this.onSubmit)}
            style={styles.saveButton}
          >
            Guardar
          </Button>
          <FAB
            icon="send"
            style={styles.fab}
            onPress={handleSubmit(this.onSendInvoice)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
  },
});

/**
 * Selects redux-form fields to get their values
 */
const selector = formValueSelector('invoiceForm');

/**
 * Retrieves initial field values in case of editing
 * maps props to different data reducers since most of the data is used by the invoice component
 */
const mapStateToProps = (state: RootState, props: any) => {
  const invoice = props?.route?.params?.invoice;
  const newNumber = props?.route?.params?.newNumber;
  let initialValues: InvoiceFormValues;
  const subtotalValue = selector(state, 'subtotal') as string;
  
  if (invoice) {
    const invoiceItems = invoice.items.map((item: InvoiceItem) => ({
      item: typeof item.item === 'string' ? item.item : item.item._id,
      quantity: String(item.quantity),
      subtotal: String(item.subtotal),
    }));
    initialValues = {
      number: invoice.number,
      customer: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer._id,
      issued: new Date(invoice.issued),
      due: new Date(invoice.due),
      items: invoiceItems,
      subtotal: invoice.subtotal.toString(),
      discount: invoice.discount.toString(),
      total: invoice.total.toString(),
    };
  } else {
    initialValues = {
      number: `INV${newNumber || '00000001'}`,
      customer: null,
      issued: new Date(),
      due: new Date(),
      items: [{ item: null, quantity: '0', subtotal: '0' }],
      subtotal: '0',
      discount: '0',
      total: '0',
    };
  }

  return {
    initialValues,
    getUser: state.userReducer.getUser,
    editInvoice: state.invoiceReducer.editInvoice,
    getInvoices: state.invoiceReducer.getInvoices,
    getCustomers: state.customerReducer.getCustomers,
    getItems: state.itemReducer.getItems,
    subtotalValue,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ change }, dispatch);
};

const validate = (values: InvoiceFormValues) => ({
  due: validatePositiveTimeDifference(values.issued, values.due),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  connector,
  reduxForm<InvoiceFormValues>({
    form: 'invoiceForm',
    validate,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: true,
  }),
)(InvoiceForm) as React.ComponentType;

