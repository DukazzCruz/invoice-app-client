import React from 'react';
import { HelperText, TextInput } from 'react-native-paper';
import { WrappedFieldProps } from 'redux-form';

interface TextFieldProps extends WrappedFieldProps {
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  maxLength?: number;
  keyboardType?: string;
  textAlign?: 'left' | 'center' | 'right';
  icon?: string;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
  onValueChange?: (value: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({
  input: { onChange, value, ...restInput },
  meta: { touched, error },
  label,
  placeholder,
  secureTextEntry,
  maxLength,
  keyboardType,
  textAlign,
  icon,
  editable = true,
  multiline,
  numberOfLines,
  style,
  onValueChange,
  ...rest
}) => {
  const hasError = touched && Boolean(error);

  const handleChange = (text: string) => {
    onChange(text);
    if (typeof onValueChange === 'function') {
      onValueChange(text);
    }
  };

  return (
    <>
      <TextInput
        mode="outlined"
        label={label}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        keyboardType={keyboardType as any}
        value={value === undefined || value === null ? '' : String(value)}
        onChangeText={handleChange}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={style}
        textAlign={textAlign}
        right={icon ? <TextInput.Icon icon={icon} /> : undefined}
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

export default TextField;

