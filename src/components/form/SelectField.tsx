import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { WrappedFieldProps } from 'redux-form';
import { useTranslation } from 'react-i18next';

interface Option {
  _id: string;
  name: string;
  [key: string]: any;
}

interface SelectFieldProps extends WrappedFieldProps {
  label?: string;
  placeHolder?: string;
  optionsArray?: Option[];
  onValueChange?: (value: any) => void;
  enabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  input: { value, onChange, ...restInput },
  meta: { touched, error },
  label,
  placeHolder,
  optionsArray = [],
  onValueChange,
  enabled = true,
  ...rest
}) => {
  const { t } = useTranslation();
  const hasError = touched && Boolean(error);

  const handleChange = (val: any) => {
    onChange(val);
    if (typeof onValueChange === 'function') {
      onValueChange(val);
    }
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.pickerWrapper, !enabled && styles.disabled]}>
        <Picker
          selectedValue={value ?? null}
          onValueChange={handleChange}
          enabled={enabled}
          {...restInput}
          {...rest}
        >
          <Picker.Item label={placeHolder || t('actions.selectOption')} value={null} />
          {optionsArray.map((option) => (
            <Picker.Item
              key={option._id}
              value={option._id}
              label={option.name}
            />
          ))}
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
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  disabled: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});

export default SelectField;

