import React, { useState } from 'react';
import {
  View,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableHighlight,
  Text,
} from 'react-native';
import AntIcon from "react-native-vector-icons/AntDesign";
import EntIcon from "react-native-vector-icons/Entypo";

import { ButtonBox } from './ButtonBox.js';

import * as topBarStyles from '../styles/topBarStyles.js';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export function TopBar( props ){
  const [ drawer, changeDrawer ] = useState(false);
  return (
    <View style = { topBarStyles.container }>
      <View style = { topBarStyles.topBarContainer }>
        <View style = { topBarStyles.openContainer }>
          <TouchableHighlight
            onPress={() => {
              changeDrawer(!drawer);
              LayoutAnimation.configureNext( LayoutAnimation.Presets.easeInEaseOut );
            }}
          >
            <EntIcon
              name= "menu"
              size = {45}
              color = "#F4FCFF"
            />
          </TouchableHighlight>
        </View>
      </View>

      <View style = {[ topBarStyles.drawerContainer, drawer? undefined: {width: 0} ]}>
        <View style = {{width: "100%", flexDirection: "row", backgroundColor: "#5CA9D2",height: "15%", paddingTop: "4%",}}>
          <View style = {{width: "50%"}}>
            <Text style = {{fontSize:30, fontWeight: "bold", left: "5%", color: "#F4FCFF"}}>Turbo Task</Text>
          </View>
          <EntIcon
            style = {{top: "7%", right: "65%"}}
            name = "pencil"
            size = {50}
            color = "#356178"
          />
        </View>
        <FlatList
          data = { props.listNavigation }
          renderItem = {({ item }) => 
            <ButtonBox
              onClick = {() =>
                props.navigation.navigate( item, { user: props.userInfo })
              }
              text={ item }
              containerStyle = { null }
              buttonStyle ={ topBarStyles.navigationButtons }
              textStyle = { topBarStyles.buttonText }
              activeOpacity = {0.6}
              underlayColor = "#427996"
              iconSize = {35}
              iconColor = "#F4FCFF"
            />
          }
          keyExtractor = { item => item }
        />
        <ButtonBox
          onClick={() => {
            props.navigation.goBack();
          }}
          text={"Go Back"}
          containerStyle = { null }
          buttonStyle ={ topBarStyles.navigationButtons }
          textStyle = { topBarStyles.buttonIconText }
          activeOpacity = {0.6}
          underlayColor = "#427996"
          iconName = "back"
          iconSize = {35}
          iconColor = "#F4FCFF"
        />
        <ButtonBox
          onClick={()=> {
            changeDrawer(!drawer);
            LayoutAnimation.configureNext( LayoutAnimation.Presets.easeInEaseOut );
          }}
          text = { "Close" }
          containerStyle = { null }
          buttonStyle = { topBarStyles.navigationButtons }
          textStyle = { topBarStyles.buttonText }
          activeOpacity = {0.6}
          underlayColor = "#427996"
          iconName = "chevron-with-circle-left"
          iconSize = {35}
          iconColor = "#F4FCFF"
        />
      </View>
      { props.children }
    </View>
  )
};
