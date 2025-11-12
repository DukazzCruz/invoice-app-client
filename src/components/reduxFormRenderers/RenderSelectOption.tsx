import React from 'react';
import { Icon, Item, Label, Picker, Text } from 'native-base';
import { WrappedFieldProps } from 'redux-form';

interface Option {
  _id: string;
  name: string;
  [key: string]: any;
}

interface RenderSelectOptionProps extends WrappedFieldProps {
  placeHolder?: string;
  label?: string;
  optionsArray?: Option[];
  iosHeader?: string;
  placeholder?: string;
  onChange?: (value: any) => void;
}

/**
 * Renders a native-base Picker component with options retrieved from a specified array of [{_id,_name,...}].
 */
const RenderSelectOption: React.FC<RenderSelectOptionProps> = ({
  meta: { touched, error },
  input: { onChange, value, ...inputProps },
  placeHolder,
  label,
  optionsArray = [],
  onChange: customOnChange,
  ...pickerProps
}) => {
  const handleChange = (val: any) => {
    onChange(val);
    if (typeof customOnChange === 'function') {
      customOnChange(val);
    }
  };

  return (
    <Item picker>
      {label && <Label>{label}</Label>}
      <Picker
        selectedValue={value}
        iosIcon={<Icon name="arrow-down" />}
        onValueChange={handleChange}
        {...inputProps}
        {...pickerProps}
      >
        <Picker.Item label={placeHolder || 'Selecciona una opción'} value={null} />
        {optionsArray.map((option, i) => (
          <Picker.Item key={i} value={option._id} label={option.name} />
        ))}
      </Picker>
      {touched && error && <Text style={{ color: '#f32013' }}>{error}</Text>}
    </Item>
  );
};

export default RenderSelectOption;

