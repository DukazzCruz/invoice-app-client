import React from 'react';
import { HelperText, TextInput } from 'react-native-paper';

const TextFieldHook = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  maxLength,
  keyboardType,
  textAlign,
  icon,
  editable = true,
  multiline,
  numberOfLines,
  style,
  ...rest
}) => {
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
        onChangeText={onChangeText}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={style}
        textAlign={textAlign}
        right={icon ? <TextInput.Icon icon={icon} /> : undefined}
        error={!!error}
        {...rest}
      />
      {error && <HelperText type="error" visible={!!error}>{String(error)}</HelperText>}
    </>
  );
};

export default TextFieldHook;

