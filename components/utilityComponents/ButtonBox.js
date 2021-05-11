import React from 'react';
import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

//We have to split this up because in EditTask.js
//the absolute position does not work with an outside View
export function ButtonBox( props ){
  const insideView = (
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
  );

  if( props.containerStyle == null ) {
    return insideView;
  } else {
    return(
      <View 
        style = { props.containerStyle }
      >
        { insideView }
      </View>
    );
  }
};