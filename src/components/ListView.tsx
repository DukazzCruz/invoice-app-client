import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Text } from 'react-native-paper';

interface ListViewProps {
  title: string;
  subtitle?: string;
  right?: string;
  rightSub?: string;
  handleClickEvent?: () => void;
}

const ListView: React.FC<ListViewProps> = ({ title, subtitle, right, rightSub, handleClickEvent }) => (
  <List.Item
    style={styles.item}
    title={title}
    description={subtitle}
    onPress={handleClickEvent}
    right={() => (
      <View style={styles.right}>
        {right ? <Text style={styles.rightValue}>{right}</Text> : null}
        {rightSub ? <Text style={styles.rightSub}>{rightSub}</Text> : null}
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 8,
  },
  right: {
    minWidth: 72,
    alignItems: 'flex-end',
  },
  rightValue: {
    fontWeight: '600',
  },
  rightSub: {
    color: 'rgba(0,0,0,0.6)',
  },
});

export default ListView;

