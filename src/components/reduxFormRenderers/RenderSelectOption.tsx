import React, { useMemo, useState, useCallback } from 'react';
import { FlatList, View, StyleSheet, Dimensions } from 'react-native';
import { HelperText, List, Modal, Portal, Searchbar, TextInput, Button, IconButton, Text } from 'react-native-paper';
import { WrappedFieldProps } from 'redux-form';

interface Option {
  _id: string;
  name: string;
  [key: string]: any;
}

interface RenderSelectOptionProps extends WrappedFieldProps {
  placeHolder?: string;
  label?: string;
  optionsArray?: Option[];
  iosHeader?: string;
  placeholder?: string;
  onChange?: (value: any) => void;
  onAddNew?: () => void; 
}

const { width, height } = Dimensions.get('window');

const RenderSelectOption: React.FC<RenderSelectOptionProps> = ({
  meta: { touched, error },
  input: { onChange, value, ...restInput },
  placeHolder,
  label,
  optionsArray = [],
  onChange: customOnChange,
  onAddNew, 
  ...rest
}) => {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const selected = useMemo(() => optionsArray.find(o => o._id === value) || null, [optionsArray, value]);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return optionsArray;
    return optionsArray.filter(o => o.name.toLowerCase().includes(q));
  }, [optionsArray, query]);

  const handleSelect = useCallback((val: any) => {
    onChange(val);
    if (typeof customOnChange === 'function') customOnChange(val);
    setVisible(false);
  }, [onChange, customOnChange]);

  const displayText = selected?.name ?? '';
  const hasError = touched && Boolean(error);

  return (
    <View>
      <TextInput
        mode="outlined"
        label={label}
        placeholder={placeHolder || 'Selecciona una opción'}
        value={displayText}
        editable={false}
        right={<TextInput.Icon icon="menu-down" onPress={() => setVisible(true)} />}
        onPressIn={() => setVisible(true)}
        error={hasError}
        {...restInput}
        {...rest}
      />
      <HelperText type="error" visible={hasError}>
        {error}
      </HelperText>
      <Portal>
        <Modal 
          visible={visible} 
          onDismiss={() => setVisible(false)} 
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <IconButton icon="close" onPress={() => setVisible(false)} />
            <Text style={styles.modalTitle}>{label || 'Seleccionar'}</Text>
            {onAddNew && (
              <IconButton 
                icon="plus" 
                onPress={() => {
                  setVisible(false);
                  onAddNew();
                }} 
              />
            )}
          </View>
          <Searchbar
            placeholder="Buscar..."
            value={query}
            onChangeText={setQuery}
            style={styles.search}
          />
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <List.Item
                title={item.name}
                onPress={() => handleSelect(item._id)}
                right={() => (item._id === value ? <List.Icon icon="check" /> : null)}
              />
            )}
            style={styles.list}
          />
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    width: width,
    height: height,
    margin: 0,
    padding: 16,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  search: {
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
});

export default RenderSelectOption;
