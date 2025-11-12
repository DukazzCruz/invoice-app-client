import { DatePicker, Item, Label, Text } from 'native-base';
import React from 'react';
import { WrappedFieldProps } from 'redux-form';

interface RenderDatePickerProps extends WrappedFieldProps {
  placeholder?: string;
  defaultValue?: Date;
  label?: string;
}

const RenderDatePicker: React.FC<RenderDatePickerProps> = ({
  input,
  placeholder,
  defaultValue,
  meta: { touched, error },
  label,
  ...custom
}) => {
  return (
    <Item style={{ flex: 1 }}>
      {label && <Label>{label}</Label>}
      <DatePicker
        {...input}
        {...custom}
        dateForm="MM/DD/YYYY"
        onDateChange={(value: Date) => input.onChange(value)}
        autoOk={true}
        defaultDate={input.value ? input.value : defaultValue || null}
        style={{ width: '100%' }}
      />
      {touched && error && <Text style={{ color: '#f32013' }}>{error}</Text>}
    </Item>
  );
};

export default RenderDatePicker;

