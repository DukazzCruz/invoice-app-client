import React from 'react';
import { HelperText, TextInput } from 'react-native-paper';

const TextField = ({
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

  const handleChange = (text) => {
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
        keyboardType={keyboardType}
        value={value === undefined || value === null ? '' : String(value)}
        onChangeText={handleChange}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={style}
        textAlign={textAlign}
        right={icon ? <TextInput.Icon icon={icon} /> : undefined}
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
