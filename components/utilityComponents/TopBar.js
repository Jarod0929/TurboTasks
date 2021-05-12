import React, { useState } from 'react';
import {
  View,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

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
          <ButtonBox
            onClick={() => {
              changeDrawer(!drawer);
              LayoutAnimation.configureNext( LayoutAnimation.Presets.easeInEaseOut );
            }}
            text = { "Open" }
            containerStyle = { null }
            buttonStyle = { topBarStyles.openAndDrawerButton }
            textStyle = { topBarStyles.buttonText }
          />
        </View>
      </View>
      <View style = {[ topBarStyles.drawerContainer, drawer? undefined: {width: 0} ]}>
        <ButtonBox
          onClick={()=> 
            changeDrawer(!drawer)
          } 
          text = { "Close" }
          containerStyle = { null }
          buttonStyle = { topBarStyles.navigationButtons }
          textStyle = { topBarStyles.buttonText }
        />
        <ButtonBox
          onClick={() => {
            props.navigation.goBack();
          }}
          text={"Go Back"}
          containerStyle = { null }
          buttonStyle ={ topBarStyles.navigationButtons }
          textStyle = { topBarStyles.buttonText }
        />
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
            />
          }
          keyExtractor = { item => item }
        />
      </View>
      { props.children }
    </View>
  )
};
