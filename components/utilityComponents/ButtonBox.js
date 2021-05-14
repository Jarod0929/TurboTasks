import React from 'react';
import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import EntIcon from "react-native-vector-icons/Entypo";
import FeatherIcon from "react-native-vector-icons/Feather";

//We have to split this up because in EditTask.js
//the absolute position does not work with an outside View
export function ButtonBox( props ){
  let iconName = props.iconName;
  let text = props.text;
  if (props.text == "CreateAccount"){
    iconName = "circle-with-plus";
    text = "Create Account";
  } else if (props.text == "LogIn"){
    iconName = "login";
    text = "Log In";
  } else if (props.text == "ProjectCreation"){
    iconName = "squared-plus";
    text = "Project Creation";
  } else if (props.text == "Settings") {
    iconName = "settings";
  } else if (props.text == "ProjectList"){
    iconName = "list";
    text = "Project List";
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
      {props.text != "Settings" &&
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
            style = {{fontSize: 24, paddingBottom: 8}}
          >
            {" "}{text}
          </EntIcon>
        </TouchableHighlight>
      }
      {props.text == "Settings"&&
        <TouchableHighlight 
          style = { props.buttonStyle }
          onPress = { props.onClick }
          activeOpacity = {props.activeOpacity}
          underlayColor = {props.underlayColor}
        >
          <FeatherIcon
            name = {iconName}
            size = {props.iconSize}
            color = {props.iconColor}
            style = {{fontSize: 24, paddingBottom: 8}}
          >
            {" "}{props.text}
          </FeatherIcon>
        </TouchableHighlight>
      }
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