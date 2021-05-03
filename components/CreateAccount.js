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
import * as styles from './styles.js';
import { create } from 'eslint/lib/rules/*';

/**
 * Establishes the entire container with all the children under the bar
 * 
 * @param {tag} {children} The rest of the tags of CreateAccount
 * @returns Top blue bar with all its children below it
 */
 const TopBar = (props) => {
  const [drawer, changeDrawer] = useState(false);
  return (
    <View style = {styles.container}>
      <View style = {styles.topBarContainer}>
        <View style = {styles.openContainer}>
          <TouchableHighlight
            onPress = {() => {
              changeDrawer(!drawer);
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            }}
            style={styles.openDrawerButton}
          >
            <Text style = {styles.textAbove}>Open</Text>
          </TouchableHighlight>
        </View>
      </View>
      <View style = {[styles.drawerContainer, drawer? undefined: {width: 0}]}>
        <TouchableHighlight onPress={()=> changeDrawer(!drawer)} style={styles.navigationButtons}>
          <Text>Close</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={()=>props.navigation.navigate("LogIn")} style={styles.navigationButtons}>
          <Text>LogIn</Text>
        </TouchableHighlight>
       
      </View>
      {props.children}
    </View>
  )
};

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
    if(snapshot.val() !== null || username === '' || password === ''){
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
      {/* Title Box */}
        <View style = {styles.titleContainer}>
          <Text style = {styles.titleText}>Sign Up</Text>
        </View>
      {/* Feedback Failed Box */}
        {failedMessage &&
          <View style = {styles.redFailedContainer}>
            <Text style = {styles.redFailedText}>Username Already Exists</Text>
          </View>
        }
      {/* Username Input Box */}
      <TextInputBox
          changeValue = {changeUsername}
          text = {"Username"}
          value = {username}
      />
      {/* Password Input Box */}
      <TextInputBox
          changeValue = {changePassword}
          text = {"Password"}
          value = {password}
      />
      {/* Create new account Button */}
      <ButtonBox
        onClick = {attemptCreateAccount}
        text = "Sign Up"
      />
      {/* Goto Login Button */}
      <ButtonBox
        onClick = {goToLogIn}
        text = "Sign In"
      />
    </View>
  </TopBar>
  );
}

const TextInputBox = props => {
  return (
  <View style = {styles.textAreaContainer}>
    <Text style = {styles.defaultText}>{props.text}</Text>
      <View style = {styles.textInputContainer}>
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
  <View style = {styles.buttonContainer}>
    <TouchableHighlight 
      style = {styles.button}
      onPress = {props.onClick}
    >
      <Text style = {styles.buttonText}>{props.text}</Text>
    </TouchableHighlight>
  </View>
  );
};