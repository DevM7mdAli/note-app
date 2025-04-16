import { TextInput , TextInputProps, View } from 'react-native';
import TextFont from './text';

interface InputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  editable?: boolean;
  hasError?: string;
  extraClassName?: string
}


const Input = ({
  value,
  onChangeText,
  placeholder = '',
  keyboardType = 'default',
  editable = true,
  extraClassName,
  hasError,
  ...rest
} : InputProps) => {
  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={'white'}
        keyboardType={keyboardType}
        editable={editable}
        className={`h-16 border border-secondary bg-accent p-4 rounded-lg text-secondary text-xl ${extraClassName}`}
        {...rest}
      />
      {
        hasError ? (<TextFont className={`text-sm ${hasError ? "text-error" : ""}`}>{hasError}</TextFont>)
        : null
      }

    </View>
  );
};

export default Input;