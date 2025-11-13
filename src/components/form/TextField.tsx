import React, { forwardRef } from 'react';
import { HelperText, TextInput } from 'react-native-paper';
import { WrappedFieldProps } from 'redux-form';
import { TextInput as RNTextInput } from 'react-native';

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
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
}

const TextField = forwardRef<RNTextInput, TextFieldProps>(({
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
  returnKeyType,
  onSubmitEditing,
  blurOnSubmit,
  ...rest
}, ref) => {
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
        ref={ref}
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
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit}
        {...restInput}
        {...rest}
      />
      <HelperText type="error" visible={hasError}>
        {error}
      </HelperText>
    </>
  );
});

TextField.displayName = 'TextField';

export default TextField;

