import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { HelperText, Text } from 'react-native-paper';
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
  input: { onChange, value },
  placeHolder,
  label,
  optionsArray = [],
  onChange: customOnChange,
  ...pickerProps
}) => {
  const hasError = touched && Boolean(error);
  const selectedValue = value ?? '';

  const pickerItems = useMemo(() => {
    const items = optionsArray.map((option) => (
      <Picker.Item key={option._id} value={option._id} label={option.name} />
    ));
    return [
      <Picker.Item
        key="__placeholder"
        value=""
        label={placeHolder || 'Selecciona una opción'}
      />,
      ...items,
    ];
  }, [optionsArray, placeHolder]);

  const handleChange = (val: string) => {
    const nextValue = val === '' ? null : val;
    onChange(nextValue);
    if (typeof customOnChange === 'function') {
      customOnChange(nextValue);
    }
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.pickerWrapper, hasError && styles.pickerError]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={handleChange}
          dropdownIconColor="#555"
          {...pickerProps}
        >
          {pickerItems}
        </Picker>
      </View>
      <HelperText type="error" visible={hasError}>
        {error}
      </HelperText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  pickerError: {
    borderColor: '#f32013',
  },
});

export default RenderSelectOption;
