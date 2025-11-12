import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyListPlaceHolderProps {
  message: string;
}

const EmptyListPlaceHolder: React.FC<EmptyListPlaceHolderProps> = ({ message }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
  },
});

export default EmptyListPlaceHolder;

