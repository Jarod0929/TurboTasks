import React, {useState} from 'react';
import {
  Text,
  View,
} from 'react-native';

import { TopBar } from './utilityComponents/TopBar.js';
import { ButtonBox } from  './utilityComponents/ButtonBox.js';
import { TextInputBox } from  './utilityComponents/TextInputBox.js';
import { HidePasswordButton } from './utilityComponents/HidePasswordButton.js';
import { encryptPassword } from './utils/encryptPassword.js';

import database from '@react-native-firebase/database';
import LinearGradient from 'react-native-linear-gradient';

import * as styles from './styles/styles.js';
import * as basicStyles from './styles/basicStyles.js';

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
  const [failedMessage, changeFailedMessage] = useState(false);
  const [hidePassword, changeHidePassword] = useState(true);


  const isUsername = () => { 
    database().ref("/Database/Users").orderByChild("Username").equalTo(username).on("child_added", isPassword);
    if(username != "" && password != ""){
      changeFailedMessage(true); 
      changePassword("");
    }
  };  

  const isPassword = snapshot => { 
    let encryptPassword = require('./utils/encryptPassword.js');
    if(snapshot.val() != null && snapshot.val().Password === encryptPassword.encryptPassword(password)){
      resetAllStates();
      navigation.navigate("Main",{screen: 'ProjectList', params: { user: snapshot.val().ID }});
    } 
    database().ref("/Database/Users").orderByChild("Username").equalTo(username).off("child_added", isPassword); 
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
    <TopBar 
      navigation = { navigation }
      userInfo = { null }
      listNavigation = {[ "CreateAccount" ]}  
    > 
      <Text style = {styles.topBarTitle}>Log In</Text>
      <LinearGradient
        colors = {["#F6F6F6", "#CCCCCC"]}
        style = {{ width: "100%", height: "100%" }}
      >
        <View style = { basicStyles.flexAlignContainer }>
          <TextInputBox
            changeValue = { changeUsername }
            text = { "Username" }
            value = { username }
            outerViewStyle = { basicStyles.textAreaContainer }
            textStyle = { basicStyles.defaultText }
            innerViewStyle = { basicStyles.textInputContainer }
            secureTextEntry = { false }
          />
          <TextInputBox
            changeValue = { changePassword }
            text = { "Password" }
            value = { password }
            outerViewStyle = { basicStyles.textAreaContainer }
            textStyle = { basicStyles.defaultText }
            innerViewStyle = { basicStyles.textInputContainer }
            secureTextEntry = { hidePassword }
          />
          <HidePasswordButton
            changeHidePassword = { changeHidePassword }
            hidePassword = { hidePassword }
          />
          <ButtonBox
            onClick = { isUsername }
            text = "Sign In"
            containerStyle = { basicStyles.buttonContainer }
            buttonStyle = { basicStyles.button }
            textStyle = { basicStyles.buttonText }
          />
          {failedMessage &&
            <View style = { basicStyles.failedContainer }>
              <Text style = { basicStyles.failedText }>Username does not exist or Password is false</Text>
            </View>
          }
          <ButtonBox
            onClick = { goToCreateAccount }
            text = "Sign Up"
            containerStyle = { basicStyles.buttonContainer }
            buttonStyle = { basicStyles.button }
            textStyle = { basicStyles.buttonText }
          />
        </View>
      </LinearGradient>
    </TopBar>
  );
}