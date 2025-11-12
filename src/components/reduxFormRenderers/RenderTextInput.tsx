import React from 'react';
import { HelperText, TextInput } from 'react-native-paper';
import { WrappedFieldProps } from 'redux-form';

interface RenderTextInputProps extends WrappedFieldProps {
  label?: string;
  placeholder?: string;
  keyboardType?: string;
  textAlign?: 'left' | 'center' | 'right';
  editable?: boolean;
  defaultValue?: string;
  format?: (value: any) => string;
  normalize?: (value: any) => string;
  onChange?: (value: any) => void;
}

const RenderTextInput: React.FC<RenderTextInputProps> = ({
  input: { onChange, value, ...restInput },
  meta: { touched, error },
  label,
  placeholder,
  keyboardType,
  textAlign,
  editable = true,
  defaultValue,
  format,
  normalize,
  onChange: customOnChange,
  ...rest
}) => {
  const hasError = touched && Boolean(error);

  const handleChange = (text: string) => {
    const normalized = normalize ? normalize(text) : text;
    onChange(normalized);
    if (typeof customOnChange === 'function') {
      customOnChange(normalized);
    }
  };

  const displayValue = format && value ? format(value) : (value === undefined || value === null ? (defaultValue || '') : String(value));

  return (
    <>
      <TextInput
        mode="outlined"
        label={label}
        placeholder={placeholder}
        keyboardType={keyboardType as any}
        value={displayValue}
        onChangeText={handleChange}
        editable={editable}
        style={textAlign ? { textAlign } : undefined}
        error={hasError}
        {...restInput}
        {...rest}
      />
      <HelperText type="error" visible={hasError}>
        {error}
      </HelperText>
    </>
  );
};

export default RenderTextInput;

