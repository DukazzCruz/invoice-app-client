import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, Text } from 'react-native-paper';
import { Field } from 'redux-form';

import TextField from './TextField';
import SelectField from './SelectField';
import {
  formatCurrency,
  integer,
  normalizeCurrency,
  number,
  required,
} from '../../utils/redux.form.utils';

const ItemsFieldArray = ({
  fields,
  change,
  optionsArray = [],
  meta: { error, touched },
  currency,
}) => {
  const computeSubtotal = (itemId, quantity) => {
    const selectedItem = optionsArray.find((option) => option._id === itemId);
    if (!selectedItem) {
      return null;
    }
    const parsedQuantity = Number(quantity || 0);
    return parsedQuantity * Number(selectedItem.price || 0);
  };

  const handleItemChange = (fieldName, index, value) => {
    change(`${fieldName}.item`, value);
    const selectedQuantity = fields.get(index)?.quantity || 0;
    const subtotal = computeSubtotal(value, selectedQuantity);
    if (subtotal !== null) {
      change(`${fieldName}.subtotal`, String(subtotal));
    }
  };

  const handleQuantityChange = (fieldName, index, quantity) => {
    change(`${fieldName}.quantity`, quantity);
    const selectedItem = fields.get(index)?.item;
    const subtotal = computeSubtotal(selectedItem, quantity);
    if (subtotal !== null) {
      change(`${fieldName}.subtotal`, String(subtotal));
    }
  };

  return (
    <View>
      {fields.map((name, index) => (
        <Card key={name} style={styles.card}>
          <Card.Title
            title={`Item ${index + 1}`}
            right={() => (
              <IconButton icon="delete" onPress={() => fields.remove(index)} />
            )}
          />
          <Card.Content>
            <Field
              name={`${name}.item`}
              component={SelectField}
              label="Producto"
              placeHolder="Selecciona un item..."
              optionsArray={optionsArray}
              validate={[required]}
              onValueChange={(value) => handleItemChange(name, index, value)}
            />
            <Field
              name={`${name}.quantity`}
              component={TextField}
              label="Cantidad"
              keyboardType="numeric"
              validate={[required, integer]}
              onValueChange={(value) => handleQuantityChange(name, index, value)}
            />
            <Field
              name={`${name}.subtotal`}
              component={TextField}
              label="Subtotal"
              keyboardType="numeric"
              editable={false}
              valueExtractor={(val) => val}
              format={(value) => formatCurrency(value, currency)}
              normalize={(value) => normalizeCurrency(value)}
              validate={[required, number]}
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
        Agregar Item
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
