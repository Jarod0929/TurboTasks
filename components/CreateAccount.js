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
import * as styles from './styles/styles.js';
import * as basicStyles from './styles/basicStyles.js';
import * as topBarStyles from './styles/topBarStyles.js';
import { create } from 'eslint/lib/rules/*';

/**
 * Establishes the entire container with all the children under the bar
 * 
 * @param {tag} {children} The rest of the tags of CreateAccount
 * @returns Top blue bar with all its children below it
 */
 

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
  const [failedMessage, changeFailedMessage] = useState(false);//Only sets to true when they failed once on account and sets feedback message

  const createNewAccount = () => {
    const newUser = database().ref("/Database/Users").push({
      Username: username,
      Password: password,
      Reference: {
        theme: "light",
      },
    });
    const newUserKey = newUser.key;
    newUser.update({ID: newUserKey});

    goToLogIn();
  };

  const isUniqueUsername = snapshot => {
    if(snapshot.val() !== null || username === "" || password === ""){
      changeFailedMessage(true);
    } else {
      createNewAccount();
    }
    database().ref("/Database/Users").orderByChild("Username").equalTo(username).off("value", isUniqueUsername); 
  };

  const attemptCreateAccount = () => {
    database().ref("/Database/Users").orderByChild("Username").equalTo(username).on("value", isUniqueUsername);
  };
  
  const goToLogIn = () => { 
    resetAllStates();
    navigation.navigate("LogIn");
  };

  const resetAllStates = () => {
    changeUsername(""); 
    changePassword("");
    changeFailedMessage(false);
  };
  
  return (
    <TopBar navigation={navigation}>
      
      <View style = {styles.flexAlignContainer}>
        <View style = {styles.titleContainer}>
          <Text style = {styles.titleText}>Sign Up</Text>
        </View>
        {failedMessage &&
          <View style = {styles.redFailedContainer}>
            <Text style = {styles.redFailedText}>Username Already Exists</Text>
          </View>
        }
      <TextInputBox
          changeValue = {changeUsername}
          text = {"Username"}
          value = {username}
      />
      <TextInputBox
          changeValue = {changePassword}
          text = {"Password"}
          value = {password}
      />
      <ButtonBox
        onClick = {attemptCreateAccount}
        text = "Sign Up"
      />
      <ButtonBox
        onClick = {goToLogIn}
        text = "Sign In"
      />
    </View>
  </TopBar>
  );
}

const TopBar = (props) => {
  const [drawer, changeDrawer] = useState(false);
  return (
    <View style = {basicStyles.container}>
      <View style = {topBarStyles.topBarContainer}>
        <View style = {topBarStyles.openContainer}>
          <ButtonBoxForNavigation
           onClick = {() => {
            changeDrawer(!drawer);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
           }}
           text="Open"
           style={topBarStyles.openAndDrawerButton}
          />
        </View>
      </View>
      <View style = {[topBarStyles.drawerContainer, drawer? undefined: {width: 0}]}>
        <ButtonBoxForNavigation
          onClick={() => {
            changeDrawer(!drawer);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          }}
          text={"Close"}
          style={topBarStyles.navigationButtons}
        />
        <ButtonBoxForNavigation
          onClick={()=>
            props.navigation.navigate("LogIn")
          }
          text={"LogIn"}
          style={topBarStyles.navigationButtons}
        />
      </View>
      {props.children}
    </View>
  )
};


const TextInputBox = props => {
  return (
  <View style = {basicStyles.textAreaContainer}>
    <Text style = {basicStyles.defaultText}>{props.text}</Text>
      <View style = {basicStyles.textInputContainer}>
        <TextInput
          onChangeText = {text => props.changeValue(text)}
          placeholder = {props.text}
          value = {props.value}
        />
    </View>
  </View>
  );
};

const ButtonBox = props => {
  return(
  <View style = {basicStyles.buttonContainer}>
    <TouchableHighlight 
      style = {basicStyles.button}
      onPress = {props.onClick}
    >
      <Text style = {basicStyles.buttonText}>{props.text}</Text>
    </TouchableHighlight>
  </View>
  );
};

const ButtonBoxForNavigation = props => {
  return(
    <TouchableHighlight 
      style = {props.style}
      onPress = {props.onClick}
    >
      <Text style = {topBarStyles.buttonText}>{props.text}</Text>
    </TouchableHighlight>
  );
};