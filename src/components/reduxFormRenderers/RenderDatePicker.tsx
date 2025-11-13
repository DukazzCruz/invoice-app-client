import React, { useCallback, useMemo, useState } from 'react';
import { Platform, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { HelperText, TextInput } from 'react-native-paper';
import { WrappedFieldProps } from 'redux-form';

interface RenderDatePickerProps extends WrappedFieldProps {
  placeholder?: string;
  label?: string;
  displayFormat?: (value: Date) => string;
  minimumDate?: Date;
  maximumDate?: Date;
  mode?: 'date' | 'time' | 'datetime';
}

const defaultFormatter = (value: Date): string => {
  try {
    return Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(value);
  } catch {
    return value.toISOString();
  }
};

const RenderDatePicker: React.FC<RenderDatePickerProps> = ({
  input: { value, onChange, ...restInput },
  meta: { touched, error },
  placeholder,
  label,
  displayFormat,
  minimumDate,
  maximumDate,
  mode = 'date',
  ...rest
}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  const dateValue = useMemo(() => {
    if (!value) {
      return new Date();
    }
    return value instanceof Date ? value : new Date(value);
  }, [value]);

  const formattedValue = value
    ? (displayFormat ? displayFormat(dateValue) : defaultFormatter(dateValue))
    : '';

  const handleChange = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === 'android') {
        setPickerVisible(false);
      }
      if (selectedDate) {
        onChange(selectedDate);
      }
    },
    [onChange],
  );

  const openPicker = useCallback(() => {
    setPickerVisible(true);
  }, []);

  return (
    <View>
      <TextInput
        mode="outlined"
        label={label}
        placeholder={placeholder}
        value={formattedValue}
        editable={false}
        pointerEvents="none"
        right={<TextInput.Icon icon="calendar" onPress={openPicker} forceTextInputFocus={false} />}
        onPressIn={openPicker}
        showSoftInputOnFocus={false}
        {...restInput}
        {...rest}
      />
      {isPickerVisible && (
        <DateTimePicker
          value={dateValue}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
      <HelperText type="error" visible={Boolean(touched && error)}>
        {error}
      </HelperText>
    </View>
  );
};

export default RenderDatePicker;
