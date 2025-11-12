import { Body, Card, CardItem, Icon, Item, Left, Right, Text, View } from 'native-base';
import React from 'react';
import { Field, WrappedFieldArrayProps } from 'redux-form';
import renderTextInput from './RenderTextInput';
import renderSelectOption from './RenderSelectOption';
import { formatCurrency, integer, normalizeCurrency, number, required } from '../../utils/redux.form.utils';
import { Item as ItemType } from '../../types';

interface RenderItemsInputArrayProps extends WrappedFieldArrayProps<any> {
  optionsArray?: ItemType[];
  currency: string;
  change: (field: string, value: any) => void;
}

/**
 * Renders an array of field tuples for redux-form. Each tuple has an item selector and a quantity input field
 */
const renderItemsInputArray: React.FC<RenderItemsInputArrayProps> = (field) => {
  const { fields, change, optionsArray = [], meta: { error, touched }, currency } = field;
  return (
    <View style={{ flex: 1 }}>
      {fields.map((item: any, index: number) => (
        <Card key={index}>
          <CardItem>
            <Body>
              <Field
                name={`${item}.item`}
                component={renderSelectOption}
                optionsArray={optionsArray}
                iosHeader="Select Item"
                placeHolder={'Select an item...'}
                placeholder={'Item'}
                validate={[required]}
                onChange={(value: any) => {
                  // Calculate product subtotal based on new product
                  const quantity = Number((fields.get(index) as any)?.quantity || 0);
                  const itemValue = optionsArray.find((e) => e._id === value);
                  if (quantity && itemValue) {
                    change(`${item}.subtotal`, String(quantity * itemValue.price));
                  }
                }}
              />
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Field
                name={`${item}.quantity`}
                keyboardType={'decimal-pad'}
                placeholder={'0'}
                textAlign={'right'}
                label={'Quantity'}
                component={renderTextInput}
                validate={[required, integer]}
                onChange={(value: any) => {
                  // Calculate product subtotal based on new quantity
                  const currentItem = (fields.get(index) as any)?.item;
                  const itemValue = optionsArray.find((e) => e._id === currentItem);
                  if (itemValue) {
                    change(`${item}.subtotal`, String(Number(value) * itemValue.price));
                  }
                }}
              />
            </Left>
            <Body />
            <Right>
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
              {(touched && error) && <Text style={{ color: '#f32013' }}>{error}</Text>}
            </Right>
          </CardItem>
          <CardItem button light onPress={() => fields.remove(index)}>
            <Left>
              <Icon active name="ios-trash" />
              <Body>
                <Text>Remove Item</Text>
              </Body>
            </Left>
          </CardItem>
        </Card>
      ))}
      <Card>
        <CardItem button light onPress={() => fields.push({})}>
          <Left>
            <Icon active name="ios-add" />
            <Body>
              <Text>Add Item</Text>
            </Body>
          </Left>
        </CardItem>
      </Card>
    </View>
  );
};

export default renderItemsInputArray;

