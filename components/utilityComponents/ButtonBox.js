import React from 'react';
import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

export function ButtonBox( props ){
  return(
    <View 
      style = { props.containerStyle }
    >
      <TouchableHighlight 
        style = { props.buttonStyle }
        onPress = { props.onClick }
      >
        <Text 
          style = { props.textStyle }
        >
          { props.text }
        </Text>
      </TouchableHighlight>
    </View>
  );
};