import React, { useState } from 'react';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { HelperText, TextInput } from 'react-native-paper';

interface DateFieldProps {
  input: {
    value?: string | Date;
    onChange: (date: string) => void;
    [key: string]: any;
  };
  meta: {
    touched?: boolean;
    error?: string;
  };
  label?: string;
  placeholder?: string;
  minimumDate?: Date;
  [key: string]: any;
}

const DateField: React.FC<DateFieldProps> = ({
  input: { value, onChange, ...restInput },
  meta: { touched, error },
  label,
  placeholder = 'YYYY/MM/DD',
  minimumDate,
  maximumDate,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);
  const parsedValue = value ? new Date(value) : new Date();
  const displayValue = value ? moment(value).format('YYYY/MM/DD') : '';
  const hasError: boolean = Boolean(touched) && Boolean(error);

  const handleChange = (_: unknown, selectedDate?: Date | undefined) => {
    if (Platform.OS !== 'ios') {
      setVisible(false);
    }
    if (selectedDate) {
      onChange(selectedDate.toISOString());
    }
  };

  return (
    <>
      <TextInput
        mode="outlined"
        label={label}
        placeholder={placeholder}
        value={displayValue}
        editable={false}
        right={<TextInput.Icon icon="calendar" onPress={() => setVisible(true)} />}
        onPressIn={() => setVisible(true)}
        {...restInput}
        {...rest}
      />
      {visible && (
        <DateTimePicker
          value={parsedValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={handleChange}
        />
      )}
      <HelperText type="error" visible={hasError}>
        {error}
      </HelperText>
    </>
  );
};

export default DateField;
