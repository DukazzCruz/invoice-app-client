import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, Text } from 'react-native-paper';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import TextField from './TextField';
import SelectField from './SelectField';
import {
  formatCurrency,
  normalizeCurrency,
} from '../../utils/redux.form.utils';
import { useValidationRules } from '../../hooks/useValidationRules';

interface ItemsFieldArrayProps {
  fields: any; // You can replace 'any' with actual type if available
  change: any; // You can replace 'any' with actual type if available
  optionsArray?: Array<any>; // Replace 'any' with the item type if defined
  meta: { error?: any; touched?: any };
  currency?: any;
}

const ItemsFieldArray: React.FC<ItemsFieldArrayProps> = ({
  fields,
  change,
  optionsArray = [],
  meta: { error, touched },
  currency,
}) => {
  const { t } = useTranslation();
  const { required: requiredRule, integer: integerRule, number: numberRule } = useValidationRules();
  const computeSubtotal = (itemId: string, quantity: number) => {
    const selectedItem = optionsArray.find((option) => option._id === itemId);
    if (!selectedItem) {
      return null;
    }
    const parsedQuantity = Number(quantity || 0);
    return parsedQuantity * Number(selectedItem.price || 0);
  };

  const handleItemChange = (fieldName: string, index: number, value: string) => {
    change(`${fieldName}.item`, value);
    const selectedQuantity = fields.get(index)?.quantity || 0;
    const subtotal = computeSubtotal(value, selectedQuantity);
    if (subtotal !== null) {
      change(`${fieldName}.subtotal`, String(subtotal));
    }
  };

  const handleQuantityChange = (fieldName: string, index: number, quantity: number) => {
    change(`${fieldName}.quantity`, quantity);
    const selectedItem = fields.get(index)?.item;
    const subtotal = computeSubtotal(selectedItem, quantity);
    if (subtotal !== null) {
      change(`${fieldName}.subtotal`, String(subtotal));
    }
  };

  return (
    <View>
      {fields.map((name: string, index: number) => (
        <Card key={name} style={styles.card}>
          <Card.Title
            title={`${t('item')} ${index + 1}`}
            right={() => (
              <IconButton icon="delete" onPress={() => fields.remove(index)} />
            )}
          />
          <Card.Content>
            <Field
              name={`${name}.item`}
              component={SelectField}
              label={t('product')}
              placeHolder={t('selectItem')}
              optionsArray={optionsArray}
              validate={[requiredRule]}
              onValueChange={(value: string) => handleItemChange(name, index, value)}
            />
            <Field
              name={`${name}.quantity`}
              component={TextField}
              label={t('quantity')}
              keyboardType="numeric"
              validate={[requiredRule, integerRule]}
              onValueChange={(value: number) => handleQuantityChange(name, index, value)}
            />
            <Field
              name={`${name}.subtotal`}
              component={TextField}
              label={t('fields.subtotal')}
              keyboardType="numeric"
              editable={false}
              valueExtractor={(val: any) => val}
              format={(value: string) => formatCurrency(value, currency)}
              normalize={(value: string) => normalizeCurrency(value)}
              validate={[requiredRule, numberRule]}
            />
          </Card.Content>
        </Card>
      ))}
      <Button
        icon="plus"
        mode="outlined"
        onPress={() => fields.push({})}
        style={styles.addButton}
      >
        {t('addItem')}
      </Button>
      {touched && error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  addButton: {
    marginTop: 8,
  },
  error: {
    color: '#f32013',
    marginTop: 4,
  },
});

export default ItemsFieldArray;
