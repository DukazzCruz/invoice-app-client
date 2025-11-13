import React, { useEffect } from 'react';
import { View } from 'react-native';
import { HelperText } from 'react-native-paper';
import { DatePickerInput, registerTranslation } from 'react-native-paper-dates';
import { WrappedFieldProps } from 'redux-form';
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();

  // Register translations dynamically based on current language
  useEffect(() => {
    const isSpanish = i18n.language === 'es';
    
    registerTranslation(i18n.language, {
      save: isSpanish ? 'Guardar' : 'Save',
      selectSingle: isSpanish ? 'Seleccionar fecha' : 'Select date',
      selectMultiple: isSpanish ? 'Seleccionar fechas' : 'Select dates',
      selectRange: isSpanish ? 'Seleccionar período' : 'Select period',
      notAccordingToDateFormat: (inputFormat) => 
        isSpanish ? `El formato de fecha debe ser ${inputFormat}` : `Date format must be ${inputFormat}`,
      mustBeHigherThan: (date) => 
        isSpanish ? `Debe ser posterior a ${date}` : `Must be later than ${date}`,
      mustBeLowerThan: (date) => 
        isSpanish ? `Debe ser anterior a ${date}` : `Must be earlier than ${date}`,
      mustBeBetween: (startDate, endDate) => 
        isSpanish ? `Debe estar entre ${startDate} - ${endDate}` : `Must be between ${startDate} - ${endDate}`,
      dateIsDisabled: isSpanish ? 'El día no está permitido' : 'Day is not allowed',
      previous: isSpanish ? 'Anterior' : 'Previous',
      next: isSpanish ? 'Siguiente' : 'Next',
      typeInDate: isSpanish ? 'Escribir fecha' : 'Type in date',
      pickDateFromCalendar: isSpanish ? 'Seleccionar fecha del calendario' : 'Pick date from calendar',
      close: isSpanish ? 'Cerrar' : 'Close',
      hour: isSpanish ? 'Hora' : 'Hour',
      minute: isSpanish ? 'Minuto' : 'Minute',
    });
  }, [i18n.language]);

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
        locale={i18n.language}
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
