import React from 'react';
import {
  TouchableHighlight,
} from 'react-native';

import Icon from "react-native-vector-icons/Entypo";

import * as basicStyles from '../styles/basicStyles.js';

export function HidePasswordButton ( props ) {
  return(
    <TouchableHighlight
      onPress = {() => {
        props.changeHidePassword(!props.hidePassword);
      }}
      style = { [basicStyles.button, {position: "absolute", right: "12%", top: "30%", zIndex: 100}] }
    >
      <Icon
        name = {props.hidePassword? "eye-with-line" : "eye"}
        size = { 35 }
      />
    </TouchableHighlight> 
  );
};