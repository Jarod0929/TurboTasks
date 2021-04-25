import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import database from '@react-native-firebase/database';
import * as styles from './styles.js';

/**
 * Creates the drawer with all the navigation
 * 
 * @param {object} props including navigation and children
 * @returns the bar under the topbar with navigation to LogIn
 */
const Drawer = (props)=>{
  const [drawer, changeDrawer] = useState(false);
  return(
    <View>
      <TouchableHighlight style={styles.navigationButtons}
        onPress = {() => {
          changeDrawer(!drawer);
        }}
      >
        <Text>Open Navigation Drawer</Text>
      </TouchableHighlight>
      {drawer &&
        <View style= {styles.Drawercont}>
          <TouchableHighlight onPress={()=> changeDrawer(!drawer)} style={styles.navigationButtons}><Text>Close</Text></TouchableHighlight>
          <TouchableHighlight onPress={()=>props.navigation.navigate("LogIn")} style={styles.navigationButtons}><Text>LogIn</Text></TouchableHighlight>
        </View>
      }
    </View>  
  );
}

/**
 * Establishes the entire container with all the children under the bar
 * 
 * @param {tag} {children} The rest of the tags of CreateAccount
 * @returns Top blue bar with all its children below it
 */
const TopBar = ({children}) => {
  return (
    <View style = {styles.container}>
      <View style = {styles.topBarContainer}>  
      </View>
      {children}
    </View>
  )
};

/**
 * A page where the user creates their account.
 * 2 input boxes for username and password
 * 2 buttons for going back to previous screen and creating account
 * Once account has been created, user is forced to LogIn screen
 * 
 * @param {object} navigation For the user to move between screens 
 * @returns {tag} The page of CreateAccount
 */
export function CreateAccount ({navigation}) {
  const [username, changeUsername] = useState('');//For the Username Field
  const [password, changePassword] = useState('');//For the Password Field
  const [failed, changeFailed] = useState(false);//Only sets to true when they failed once on account and sets feedback message
  
  /**
   * If no users are found snapshot will be null and the account will be created
   * If a specific user is found, snapshot will be their account and feedback will be given
   * 
   * @param {object} snapshot Is the object of a specific user or is null
   */
  const isUniqueUsername = snapshot => {
    if(snapshot.val() !== null || username === '' || password === ''){
      changeFailed(true);
    } else {
      changeFailed(false);
      const newUser = database().ref("/Database/Users").push({
        Username: username,
        Password: password,
        Reference: {
          theme: "light",
        },
      });
      const newUserKey = newUser.key;
      newUser.update({ID: newUserKey});
      changeUsername(""); //Resets all changes made
      changePassword("");
      changeFailed(false);
      navigation.navigate("LogIn");
    }
    database().ref("/Database/Users").orderByChild("Username").equalTo(username).off("value", isUniqueUsername); 
  };
  
  /**
   * Access the database to find all users that have the same username
   * Will create account if no users are found
   * Always calls isUniqueUsername()
   */
  const createNewAccount = () => {
    database().ref("/Database/Users").orderByChild("Username").equalTo(username).on("value", isUniqueUsername);
  };
  
  /**
   * Clears all inputs of username, passord, and failed.
   * Navigates user to LogIn screen.
   */
  const goToLogIn = () => { 
    changeUsername(""); 
    changePassword("");
    changeFailed(false);
    navigation.navigate("LogIn");
  };
  
  return (
    <TopBar>
      <Drawer navigation={navigation}></Drawer>
      <View style = {styles.flexAlignContainer}>
        <View style = {styles.titleContainer}>
          <Text style = {styles.titleText}>Sign Up</Text>
        </View>
        {failed &&
          <View style = {styles.redFailedContainer}>
            <Text style = {styles.redFailedText}>Username Already Exists</Text>
          </View>
        }
        <View style = {styles.textAreaContainer}>
          <Text style = {styles.defaultText}>Username</Text>
          <View style = {styles.textInputContainer}>
            <TextInput
              onChangeText = {text => changeUsername(text)}
              placeholder = "UserName"
              value = {username}
            />
          </View>
        </View>
        <View style = {styles.textAreaContainer}>
          <Text style = {styles.defaultText}>Password</Text>
          <View style = {styles.textInputContainer}>
            <TextInput
              onChangeText = {text => changePassword(text)}
              placeholder = "Password"
              value = {password}
            />
          </View>
        </View>
        <View style = {styles.buttonContainer}>
          <TouchableHighlight 
            style = {styles.button}
            onPress = {createNewAccount}
          >
            <Text style = {styles.buttonText}>Sign Up</Text>
          </TouchableHighlight>
        </View>
        <View style = {styles.buttonContainer}>
          <TouchableHighlight 
            style = {styles.button}
            onPress = {goToLogIn}
          >
            <Text style = {styles.buttonText}>Sign In</Text>
          </TouchableHighlight>
        </View>
    </View>
  </TopBar>
  );
}