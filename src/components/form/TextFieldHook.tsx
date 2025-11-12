import React from 'react';
import { HelperText, TextInput } from 'react-native-paper';

interface TextFieldHookProps {
  label?: string;
  placeholder?: string;
  value?: string | number | null;
  onChangeText?: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  maxLength?: number;
  keyboardType?: string;
  textAlign?: 'left' | 'center' | 'right';
  icon?: string;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
  [key: string]: any;
}

const TextFieldHook: React.FC<TextFieldHookProps> = ({
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
        keyboardType={keyboardType as any}
        value={value === undefined || value === null ? '' : String(value)}
        onChangeText={onChangeText}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={style}
        textAlign={textAlign}
        right={icon ? <TextInput.Icon icon={icon as any} /> : undefined}
        error={!!error}
        {...rest}
      />
      {error && <HelperText type="error" visible={!!error}>{String(error)}</HelperText>}
    </>
  );
};

export default TextFieldHook;

