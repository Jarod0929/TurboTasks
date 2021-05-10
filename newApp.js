import React, { useState } from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

export default function App() {
  const [cnt, setCnt] = useState(0);
  return (
    <View>
      <TouchableHighlight
        title = 'default'
        accessibilityLabel="Press Me!"
        onPress={() => {
          setCnt(cnt + 1);
        }}>
        <Text>Press Me!</Text>
      </TouchableHighlight>
      <Text
        accessibilityLabel="Press Count">
        {`${cnt}`}
      </Text>
    </View>
  );
}