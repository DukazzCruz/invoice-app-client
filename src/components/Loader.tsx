import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Loader: React.FC = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#1c313a" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;

