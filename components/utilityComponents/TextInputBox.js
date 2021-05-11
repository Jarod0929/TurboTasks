import React from 'react';
import {
  Text,
  View,
  TextInput,
} from 'react-native';

export function TextInputBox( props ){
  return (
  <View 
    style = { props.innerViewStyle }
  >
    <Text 
      style = { props.textStyle }
    >
      { props.text }
    </Text>
      <View 
        style = { props.outerViewStyle }
      >
        <TextInput
          onChangeText = {text => props.changeValue(text)}
          placeholder = { props.text }
          value = { props.value }
        />
    </View>
  </View>
  );
};