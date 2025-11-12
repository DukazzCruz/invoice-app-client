import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const Logo: React.FC = () => (
  <View style={styles.container}>
    <Image
      style={styles.image}
      source={require('../assets/images/react-logo.png')}
    />
    <Text style={styles.title}>Invoice App</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default Logo;

