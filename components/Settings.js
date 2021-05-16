import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  TextInput,
} from 'react-native';

import { TopBar } from './utilityComponents/TopBar.js';

import database from '@react-native-firebase/database';

import * as styles from './styles/styles.js';
import * as basicStyles from './styles/basicStyles.js';
import * as topBarStyles from './styles/topBarStyles.js';


//Settings Page for the current logged in User takes:
//route, user- this is the usersID
//navigation
export function Settings({ route, navigation }){
  const [userEnteredPassword, changeUserEnteredPassword] = useState('');//password the user nters into the change password box
  const [userEnteredPasswordForUsername, changeUserEnteredPasswordForUsername] = useState('');//password the user enters into the change username box
 
  const [password, changePass] = useState('');//pulled database password
  const [username, changeUser] = useState('');//pulled databse username
  
  const [inputTextForPassword, changeInputTextForPassword] = useState('Password');//background text for change password box
  const [inputTextForUsername, changeInputTextForUsername] = useState('Password');//background text for change username box
 
  const [accepted, changeAccepted] = useState("False");//variable for password validation it is a string: true/false
  const [usernameChangeValid, changeUsernameValidity] = useState("False");//variable for username validation it is a string: true/false

  //finds the username of the current logged in user
  const handleUsername = snapshot => {
    changeUser(snapshot.val().Username);
  };

  //finds the password of the current logged in user
  const handlePassword = snapshot => {
    changePass(snapshot.val());
  };

  // For Password Change updates password to new password
  const acceptedPasswordEqualTrue = encryptedPasswordText => {
    if (userEnteredPassword != ''){
      database().ref("/Database/Users/" + route.params.user).update({
        Password: encryptedPasswordText
      });
      changePass(encryptedPasswordText);
      changeUserEnteredPassword('');
      changeAccepted('False');
      changeInputTextForPassword('Enter your password');
    } else {
      changeAccepted('False');
      changeInputTextForPassword("None-Empty");
    }    
  };

  //For Password Change lets the user enter their desired password
  const encryptedEqualPassword = () => {
    changeUserEnteredPassword('');
    changeAccepted('True');
    changeInputTextForPassword("Enter New Password");
  };
  
  const changePassword = () => {
    //if the user entered the correct password and they have typed in a new password and hit enter
    //then their password will be changed
    let encryptPassword = require('./utils/encryptPassword.js');
    let encryptedPasswordText = encryptPassword.encryptPassword(userEnteredPassword);
    if (accepted == 'True'){
      acceptedPasswordEqualTrue(encryptedPasswordText);
    } else if (encryptedPasswordText == password){
      encryptedEqualPassword();
    } else {
      changeUserEnteredPassword('');
      changeInputTextForPassword("wrong try again");
    }
  };

  const encrpytedEqualPasswordForUsername = () => {
    changeUserEnteredPasswordForUsername('');
    changeUsernameValidity('True');
    changeInputTextForUsername("Enter New Username");
  };
  
  const acceptedPasswordEqualTrueForUsername = () => {
    if (userEnteredPasswordForUsername != ''){
      database().ref("/Database/Users/" + route.params.user).update({
        Username: userEnteredPasswordForUsername
      });
      changeUser(userEnteredPasswordForUsername);
      changeUserEnteredPasswordForUsername('');
      changeUsernameValidity('False');
      changeInputTextForUsername('Enter your password');
     
    } else {
      changeUserEnteredPassword('');
      changeInputTextForUsername("None-Empty");
    }   
   
  };

  const changeUsername = () =>{
    let encryptPassword = require('./utils/encryptPassword.js');
    let encryptedPasswordText = encryptPassword.encryptPassword(userEnteredPasswordForUsername);
    if (encryptedPasswordText == password){
      encrpytedEqualPasswordForUsername();
    } else if (usernameChangeValid == 'True'){
      acceptedPasswordEqualTrueForUsername();
    } else {
      changeUserEnteredPasswordForUsername('');
      changeInputTextForUsername("wrong try again");
    }
  };
  
  // finds username of current logged in user
  if(username == ''){
    database().ref("/Database/Users/" + route.params.user).once("value", handleUsername);
  }
  //finds password of current logged in user
  if (password == ''){
    database().ref("/Database/Users/" + route.params.user+"/Password").once("value", handlePassword);
  }

  return(
    <TopBar 
      navigation = { navigation } 
      userInfo = { route.params.user }
      listNavigation = {[ "ProjectList", "ProjectCreation" ]}  
    >
      <Text style = { styles.topBarTitle }>Settings</Text>
      <View style = { styles.settingsPage }>
        <View style = { styles.innerSettingsPage }>
          <View style = { basicStyles.flexAlignContainer }>
            <Text>Hello { username }! Welcome to your Settings</Text> 
            <Text>Enter your password to Change Your Username</Text>
            <TextInputBox 
              changeValue = { changeUserEnteredPasswordForUsername }
              text = { inputTextForUsername }
              value = { userEnteredPasswordForUsername }
            />
            <ButtonBox 
              onClick = {()=>changeUsername()}
              text = { "Enter" }
              style = { basicStyles.buttonContainer }
              
            />
            <Text>Enter your password to Change Your password</Text>
            <TextInputBox 
              changeValue = { changeUserEnteredPassword }
              text = { inputTextForPassword }
              value = { userEnteredPassword }
            />
            <ButtonBox
              onClick = { () => changePassword() }
              text = { "Enter" }
              style = { basicStyles.buttonContainer }
            />
          </View>
        </View>
      </View>
    </TopBar>
  );
}

const TextInputBox = props => {
  return (
    <View style = { basicStyles.textInputContainer }>
      <TextInput 
        onChangeText = {text => props.changeValue(text)}
        placeholder = { props.text }
        value = { props.value }
      />
    </View>
  );
};

const ButtonBox = props => {
  return(
    <View style = { props.style }>
      <TouchableHighlight 
        style = { basicStyles.button }
        onPress = { props.onClick }
      >
        <Text style = { topBarStyles.buttonText }>{ props.text }</Text>
      </TouchableHighlight>
    </View>
  );
};

    