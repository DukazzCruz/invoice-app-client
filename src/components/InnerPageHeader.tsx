import React from 'react';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface InnerPageHeaderProps {
  title: string;
}

const InnerPageHeader: React.FC<InnerPageHeaderProps> = ({ title }) => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <Appbar.Header elevated>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default InnerPageHeader;

