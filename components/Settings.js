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
  const [userEnteredPassword,changeUserEnteredPassword] = useState('');//password the user nters into the change password box
  const [userEnteredPasswordForUsername,changeUserEnteredPasswordForUsername] = useState('');//password the user enters into the change username box
  const [password,changePassword] = useState('');//pulled database password
  const [username,changeUser] = useState('');//pulled databse username
  const [inputTextForPassword,changeInputTextForPassword] = useState('Password');//background text for change password box
  const [inputTextForUsername,changeInputTextForUsername] = useState('Password');//background text for change username box
  const [Accepted,changeAccepted] = useState("False");//variable for password validation it is a string: true/false
  const [usernameChangeValid,changeUsernameValidity] = useState("False");//variable for username validation it is a string: true/false

  //finds the username of the current logged in user
  const handleUsername = snapshot => {
    changeUser(snapshot.val().Username);
  }

  //finds the password of the current logged in user
  const handlePassword = snapshot => {
    changePassword(snapshot.val());
  }
  // For Password Change updates password to new password
  const acceptedPasswordEqualTrue = encryptedPasswordText => {
    if (userEnteredPassword != ''){
      database().ref("/Database/Users/" + route.params.user).update({
        Password: encryptedPasswordText
      });
      changePassword(encryptedPasswordText);
      changeUserEnteredPassword('');
      changeAccepted('False');
      changeInputTextForPassword('Enter your password');
    } else {
      changeAccepted('False');
      changeInputTextForPassword("Something Went Wrong");
    }    
  }

  //For Password Change lets the user enter their desired password
  const encryptedEqualPassword = () => {
    changeUserEnteredPassword('');
    changeAccepted('True');
    changeInputTextForPassword("Enter New Password");
  }

  

  
  //test to see if the typed in password is the correct one
  const isPassword = () => {
    //if the user entered the correct password and they have typed in a new password and hit enter
    //then their password will be changed
    let encryptPassword = require('./utils/encryptPassword.js');
    let encryptedPasswordText = encryptPassword.encryptPassword(userEnteredPassword);
    if (Accepted == 'True'){
      acceptedPasswordEqualTrue(encryptedPasswordText);
    } else if (encryptedPasswordText == password){
      encryptedEqualPassword();
    } else {
      changeInputTextForPassword("wrong Password Try again");
    }
  }


  const encrpytedEqualPasswordForUsername = () => {
    changeUserEnteredPasswordForUsername('');
    changeUsernameValidity('True');
    changeInputTextForUsername("Enter New Username");
  }
  
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
      changeInputTextForUsername("Something Went Wrong");
    }   
   
  }

  //changes the users username
  const changeUsername = () =>{
    //if the user entered the valid password then empty the text field and ask for their desired username
    let encryptPassword = require('./utils/encryptPassword.js');
    let encryptedPasswordText = encryptPassword.encryptPassword(userEnteredPasswordForUsername);
    if (encryptedPasswordText == password){
      encrpytedEqualPasswordForUsername();
    } else if (usernameChangeValid == 'True'){
      acceptedPasswordEqualTrueForUsername();
    } else {
      changeInputTextForUsername("wrong password try again");
    }
  }
  
  // finds username of current logged in user
  if(username == ''){
    database().ref("/Database/Users/" + route.params.user).once("value", handleUsername);
    
  //finds password of current logged in user
  }
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
              onClick = { () => isPassword() }
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

    