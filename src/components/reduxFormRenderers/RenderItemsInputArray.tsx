import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text, Button } from 'react-native-paper';
import { Field, WrappedFieldArrayProps } from 'redux-form';
import renderTextInput from './RenderTextInput';
import renderSelectOption from './RenderSelectOption';
import { formatCurrency, integer, normalizeCurrency, number, required } from '../../utils/redux.form.utils';
import { Item as ItemType } from '../../types';
import { useTranslation } from 'react-i18next';

interface RenderItemsInputArrayProps extends WrappedFieldArrayProps<any> {
  optionsArray?: ItemType[];
  currency: string;
  change: (field: string, value: any) => void;
  onAddNewItem?: () => void;
}

/**
 * Renders an array of field tuples for redux-form. Each tuple has an item selector and a quantity input field
 */
const renderItemsInputArray: React.FC<RenderItemsInputArrayProps> = ({
  fields,
  change,
  optionsArray = [],
  meta: { error, touched },
  currency,
  onAddNewItem,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      {fields.map((item: any, index: number) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <Field
              name={`${item}.item`}
              component={renderSelectOption}
              optionsArray={optionsArray}
              modalTitle={t('modals.products')}
              addButtonLabel={t('modals.addProduct')}
              onAddNew={onAddNewItem}
              placeHolder={t('actions.selectItem')}
              placeholder={t('fields.item')}
              validate={[required]}
              onChange={(value: any) => {
                const quantity = Number((fields.get(index) as any)?.quantity || 0);
                const itemValue = optionsArray.find((e) => e._id === value);
                if (quantity && itemValue) {
                  change(`${item}.subtotal`, String(quantity * itemValue.price));
                }
              }}
            />
          </Card.Content>
          <Card.Content style={styles.row}>
            <View style={styles.quantity}>
              <Field
                name={`${item}.quantity`}
                keyboardType={'decimal-pad'}
                placeholder={'0'}
                textAlign={'right'}
                label={t('fields.quantity')}
                component={renderTextInput}
                validate={[required, integer]}
                onChange={(value: any) => {
                  const currentItem = (fields.get(index) as any)?.item;
                  const itemValue = optionsArray.find((e) => e._id === currentItem);
                  if (itemValue) {
                    change(`${item}.subtotal`, String(Number(value) * itemValue.price));
                  }
                }}
              />
            </View>
            <View style={styles.subtotal}>
              <Field
                name={`${item}.subtotal`}
                keyboardType={'decimal-pad'}
                placeholder={'0'}
                textAlign={'right'}
                editable={false}
                validate={[required, number]}
                format={(value: any) => formatCurrency(value, currency)}
                normalize={(value: any) => normalizeCurrency(value)}
                component={renderTextInput}
              />
              {(touched && error) && <Text style={styles.error}>{error}</Text>}
            </View>
          </Card.Content>
          <Card.Actions>
            <IconButton icon="trash-can" onPress={() => fields.remove(index)} accessibilityLabel="Remove item" />
            <Text>{t('actions.removeItem')}</Text>
          </Card.Actions>
        </Card>
      ))}
      <Card style={styles.addCard}>
        <Card.Actions>
          <Button icon="plus" onPress={() => fields.push({})}>
            {t('actions.addLine')}
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default renderItemsInputArray;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  quantity: {
    flex: 1,
  },
  subtotal: {
    flex: 1,
  },
  error: {
    color: '#f32013',
    marginTop: 4,
    textAlign: 'right',
  },
  addCard: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#bbb',
  },
});
