import React, {useState} from 'react';
import {
  Text,
  View,
} from 'react-native';

import { TopBar } from './utilityComponents/TopBar.js';
import { ButtonBox } from  './utilityComponents/ButtonBox.js';
import { TextInputBox } from  './utilityComponents/TextInputBox.js';
import { HidePasswordButton } from './utilityComponents/HidePasswordButton.js';

import database from '@react-native-firebase/database';
import LinearGradient from 'react-native-linear-gradient';

import * as styles from './styles/styles.js';
import * as basicStyles from './styles/basicStyles.js';

/**
 * A page where the user creates their account.
 * 2 input boxes for username and password
 * 2 buttons for going back to previous screen and creating account
 * Once account has been created, user is forced to LogIn screen
 * 
 */
export function CreateAccount ({navigation}) {
  const [username, changeUsername] = useState('');
  const [password, changePassword] = useState('');
  const [failedMessage, changeFailedMessage] = useState(false);
  const [hidePassword, changeHidePassword] = useState(true);

  const attemptCreateAccount = () => {
    database().ref("/Database/Users").orderByChild("Username").equalTo(username).on("value", isUniqueUsername);
  };

  const isUniqueUsername = snapshot => {
    if(snapshot.val() !== null || username === "" || password === ""){
      changeFailedMessage(true);
    } else {
      createNewAccount();
    }
    database().ref("/Database/Users").orderByChild("Username").equalTo(username).off("value", isUniqueUsername); 
  };

  const createNewAccount = () => {
    let encryptPassword = require('./utils/encryptPassword.js');
    const newUser = database().ref("/Database/Users").push({
      Username: username,
      Password: encryptPassword.encryptPassword(password),
      Reference: {
        theme: "light",
      },
    });
    const newUserKey = newUser.key;
    newUser.update({ID: newUserKey});
    goToLogIn();
  };

  const goToLogIn = () => { 
    resetAllStates();
    navigation.navigate("LogIn");
  };

  const resetAllStates = () => {
    changeUsername(""); 
    changePassword("");
    changeFailedMessage(false);
    changeHidePassword(true);
  };
  
  return (
    <TopBar 
      navigation = { navigation }
      userInfo = { null }
      listNavigation = {[ "LogIn" ]}
    >
      <Text style = {styles.topBarTitle}>Create Account</Text>
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
          >
          </TextInputBox>
          <HidePasswordButton
            changeHidePassword = { changeHidePassword }
            hidePassword = { hidePassword }
          />
          <ButtonBox
            onClick = { attemptCreateAccount }
            text = "Sign Up"
            containerStyle = { [basicStyles.buttonContainer, {backgroundColor: "lightblue"}] }
            buttonStyle = { basicStyles.button }
            textStyle = { basicStyles.buttonText }
          />
          {failedMessage &&
            <View style = { basicStyles.failedContainer }>
              <Text style = { basicStyles.failedText }>Username Already Exists</Text>
            </View>
          }
          <ButtonBox
            onClick = { goToLogIn }
            text = "Sign In"
            containerStyle = { [basicStyles.buttonContainer, {backgroundColor: "lightblue"}] }
            buttonStyle = { basicStyles.button }
            textStyle = { basicStyles.buttonText }
          />
        </View>
      </LinearGradient>
    </TopBar>
  );
}


// const TextInputBox = props => {
//   return (
//   <View style = { basicStyles.textAreaContainer }>
//     <Text style = { basicStyles.defaultText }>{ props.text }</Text>
//       <View style = { basicStyles.textInputContainer }>
//         <TextInput
//           onChangeText = {text => props.changeValue(text)}
//           placeholder = { props.text }
//           value = { props.value }
//         />
//     </View>
//   </View>
//   );
// };