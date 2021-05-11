import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import database from '@react-native-firebase/database';
import LinearGradient from 'react-native-linear-gradient'
import * as basicStyles from './styles/basicStyles.js';
import * as topBarStyles from './styles/topBarStyles.js';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/**
 * A page where the user logs in to their account.
 * 2 input boxes for username and password
 * 2 buttons for logging in and navigating to sign up
 * Once the user logs in, the user is forced into ProjectList
 * 
 */
export function LogIn({ navigation }){
  const [username, changeUsername] = useState('');
  const [password, changePassword] = useState('');
  //Only sets to true when they failed once on account and sets feedback message
  const [failedMessage, changeFailedMessage] = useState(false);

  const isPassword = snapshot => { 
    if(snapshot.val() != null && snapshot.val().Password === password){
      resetAllStates();
      navigation.navigate("Main",{screen: 'ProjectList', params: {user: snapshot.val().ID }});
    }
    database().ref("/Database/Users").orderByChild("Username").equalTo(username).off("child_added", isPassword); 
  };

  const isUsername = () => { 
    database().ref("/Database/Users").orderByChild("Username").equalTo(username).on("child_added", isPassword);
    if(username != ""){
      changeFailedMessage(true); 
      changePassword("");
    }
  };  

  const goToCreateAccount = () => {
    resetAllStates();
    navigation.navigate("CreateAccount");
  };

  const resetAllStates = () => {
    changeUsername(""); 
    changePassword("");
    changeFailedMessage(false);
  };
    
  return(
    <TopBar navigation = { navigation }> 
      
      <View style = { basicStyles.flexAlignContainer }>
        <View style = { basicStyles.titleContainer }>
          <Text style = { basicStyles.titleText }>Sign In</Text>
        </View>
        <TextInputBox
          changeValue = { changeUsername }
          text = { "Username" }
          value = { username }
        />
        <TextInputBox
            changeValue = { changePassword }
            text = { "Password" }
            value = { password }
        />
        <ButtonBox
          onClick = { isUsername }
          text = "Sign In"
        />
        {failedMessage &&
          <View style = { basicStyles.failedContainer }>
            <Text style = { basicStyles.failedText }>Username does not exist or Password is false</Text>
          </View>
        }
        <ButtonBox
          onClick = { goToCreateAccount }
          text = "Sign Up"
        />
      </View>
    </TopBar>
  );
}

const TopBar = (props) => {
  const [drawer, changeDrawer] = useState(false);
  return (
    <View style = { basicStyles.container }>
      <View style = { topBarStyles.topBarContainer }>
        <View style = { topBarStyles.openContainer }>
        <ButtonBoxForNavigation
          onClick = {() => {
            changeDrawer(!drawer);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          }}
          text = { "Open" }
          style = { topBarStyles.openAndDrawerButton}
        />
          
        </View>
      </View>
      <View style = { [topBarStyles.drawerContainer, drawer? undefined: {width: 0}] }>
        <ButtonBoxForNavigation
          onClick = {()=>
            changeDrawer(!drawer)
          }
          text = { "Close" }
          style = { topBarStyles.navigationButtons }
        />
        <ButtonBoxForNavigation
          onClick = {()=>
            props.navigation.navigate("CreateAccount")
          }
          text = { "Create an Account" }
          style = { topBarStyles.navigationButtons }
        />  
      </View>
      { props.children }
    </View>
  )
};

const TextInputBox = props => {
  return (
  <View style = { basicStyles.textAreaContainer }>
    <Text style = { basicStyles.defaultText }>{ props.text }</Text>
      <View style = { basicStyles.textInputContainer }>
        <TextInput
          onChangeText = {text => props.changeValue(text)}
          placeholder = { props.text }
          value = { props.value }
        />
    </View>
  </View>
  );
};

const ButtonBox = props => {
  return(
  <View style = { basicStyles.buttonContainer }>
    <TouchableHighlight 
      style = { basicStyles.button }
      onPress = { props.onClick }
    >
      <Text style = { basicStyles.buttonText }>{ props.text }</Text>
    </TouchableHighlight>
  </View>
  );
};

const ButtonBoxForNavigation = props => {
  return(
    <TouchableHighlight 
      style = { props.style }
      onPress = { props.onClick }
    >
      <Text style = { topBarStyles.buttonText }>{ props.text }</Text>
    </TouchableHighlight>
  );
};