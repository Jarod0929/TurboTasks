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
export function Settings({ route, navigation }) {
  const [userEnteredPassword,changeUserEnteredPassword]=useState('');//password the user nters into the change password box
  const [userEnteredPasswordForUsername,changeUserEnteredPasswordForUsername]=useState('');//password the user enters into the change username box
  const [password,changePassword]=useState('');//pulled database password
  const [username,changeUser]=useState('');//pulled databse username
  const [inputTextForPassword,changeinputTextForPassword]=useState('Password');//background text for change password box
  const [inputTextForUsername,changeinputTextForUsername]=useState('Password');//background text for change username box
  const [Accepted,changeAccepted]=useState("False");//variable for password validation it is a string: true/false
  const [usernameChangeValid,changeUsernameValidity]=useState("False");//variable for username validation it is a string: true/false

  //finds the username of the current logged in user
  const handleUsername = snapshot => {
      changeUser(snapshot.val().Username);
  }
  //finds the password of the current logged in user
  const handlePassword = snapshot => {
      changePassword(snapshot.val());
  }
  
  //test to see if the typed in password is the correct one
  const isPassword = () =>{
    //if the user entered the correct password and they have typed in a new password and hit enter
    //then their password will be changed
    let encryptPassword = require('./utils/encryptPassword.js');
    let encryptedPasswordText = encryptPassword.encryptPassword(userEnteredPassword);
    if (Accepted=='True'){
      if (userEnteredPassword != ''){
        database().ref("/Database/Users/" + route.params.user).update({Password: encryptedPasswordText});
      
        changePassword(encryptedPasswordText);
        changeUserEnteredPassword('');
        changeAccepted('False');
        changeinputTextForPassword('Enter your password');
        
      } else {
        changeAccepted('False');
        changeinputTextForPassword("Something Went Wrong");
      }    

    // If it its the correct password then the user will enter in their new desired password
    } else if (encryptedPasswordText==password){
      changeUserEnteredPassword('');
      changeAccepted('True');
      changeinputTextForPassword("Enter New Password");
    } else {
      console.log("wrong Password Try again");
      
      
    }
  }
  //changes the users username
  const changeUsername=()=>{
    //if the user entered the valid password then empty the text field and ask for their desired username
    let encryptPassword = require('./utils/encryptPassword.js');
    let encryptedPasswordText = encryptPassword.encryptPassword(userEnteredPasswordForUsername);
    if (encryptedPasswordText==password){
      changeUserEnteredPasswordForUsername('');
      changeUsernameValidity('True');
      changeinputTextForUsername("Enter New Username");
    
    //if the user entered the correct password and a new username update their username
    } else if (usernameChangeValid=='True'){
      // if they did not try to enter an empty username
      if (userEnteredPasswordForUsername != ''){
        database().ref("/Database/Users/" + route.params.user).update({
          Username: userEnteredPasswordForUsername
        });
        changeUser(userEnteredPasswordForUsername);
        changeUserEnteredPasswordForUsername('');
        changeUsernameValidity('False');
        changeinputTextForUsername('Enter your password');
       
      } else {
        changeUserEnteredPassword('');
        changeinputTextForUsername("Something Went Wrong");
      }   
    } else {
      console.log("wrong password try again");
    }
  }
  
  // finds username of current logged in user
  if(username==''){
    database().ref("/Database/Users/" + route.params.user).once("value", handleUsername);
    
  //finds password of current logged in user
  }if(password==''){
    database().ref("/Database/Users/" + route.params.user+"/Password").once("value", handlePassword);
  }

  return(
    <TopBar 
      navigation = { navigation } 
      userInfo = { route.params.user }
      listNavigation = {[ "ProjectList", "ProjectCreation" ]}  
    >
      <Text style = {styles.topBarTitle}>Settings</Text>
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

    