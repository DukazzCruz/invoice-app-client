import React from 'react';
import { View } from 'react-native';
import { HelperText } from 'react-native-paper';
import { DatePickerInput, registerTranslation } from 'react-native-paper-dates';
import { WrappedFieldProps } from 'redux-form';
import { useTranslation } from 'react-i18next';

// Register the locale
registerTranslation('en', {
  save: 'Save',
  selectSingle: 'Select date',
  selectMultiple: 'Select dates',
  selectRange: 'Select period',
  notAccordingToDateFormat: (inputFormat) => `Date format must be ${inputFormat}`,
  mustBeHigherThan: (date) => `Must be later than ${date}`,
  mustBeLowerThan: (date) => `Must be earlier than ${date}`,
  mustBeBetween: (startDate, endDate) => `Must be between ${startDate} - ${endDate}`,
  dateIsDisabled: 'Day is not allowed',
  previous: 'Previous',
  next: 'Next',
  typeInDate: 'Type in date',
  pickDateFromCalendar: 'Pick date from calendar',
  close: 'Close',
  hour: 'Hour',
  minute: 'Minute',
});

interface RenderDatePickerProps extends WrappedFieldProps {
  label?: string;
  placeholder?: string;
}

const RenderDatePicker: React.FC<RenderDatePickerProps> = ({
  input: { onChange, value, ...restInput },
  meta: { touched, error },
  label,
  placeholder,
  ...rest
}) => {
  const { t } = useTranslation();
  const date = value ? new Date(value) : undefined;

  return (
    <View>
      <DatePickerInput
        mode="outlined"
        label={label ? t(label) : undefined}
        placeholder={placeholder ? t(placeholder) : undefined}
        value={date}
        onChange={(d) => onChange(d?.toISOString())}
        inputMode="start"
        locale="en"
        error={touched && !!error}
        {...restInput}
        {...rest}
      />
      <HelperText type="error" visible={touched && !!error}>
        {error && t(error)}
      </HelperText>
    </View>
  );
};

export default RenderDatePicker;
