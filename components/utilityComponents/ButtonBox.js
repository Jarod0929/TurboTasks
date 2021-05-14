import React from 'react';
import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import { baseProps } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';
import AntIcon from "react-native-vector-icons/AntDesign";
import EntIcon from "react-native-vector-icons/Entypo";

//We have to split this up because in EditTask.js
//the absolute position does not work with an outside View
export function ButtonBox( props ){
  let iconName = props.iconName;
  if(props.text == "CreateAccount"){
    iconName = "circle-with-plus";
  }

  const insideView = (
    <TouchableHighlight 
      style = { props.buttonStyle }
      onPress = { props.onClick }
      activeOpacity = {props.activeOpacity}
      underlayColor = {props.underlayColor}
    >
      <Text 
        style = { props.textStyle }
      >
        { props.text }
      </Text>
    </TouchableHighlight>
  );
  const insideViewIcon = (
    <View>
      <TouchableHighlight 
        style = { props.buttonStyle }
        onPress = { props.onClick }
        activeOpacity = {props.activeOpacity}
        underlayColor = {props.underlayColor}
      >
        <EntIcon
          name = {iconName}
          size = {props.iconSize}
          color = {props.iconColor}
          style = {{fontSize: 30}}
        >
          {" "}{props.text}
        </EntIcon>
      </TouchableHighlight>
    </View>
    
  ); 

  if(iconName != null){
    return (
      <View>
        {insideViewIcon}
      </View>
    );
  } else if( props.containerStyle == null ) {
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