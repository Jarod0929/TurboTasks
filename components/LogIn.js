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
import * as styles from './styles/styles.js';

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
    <TopBar navigation={navigation}> 
      
      <View style = {styles.flexAlignContainer}>
        <View style = {styles.titleContainer}>
          <Text style = {styles.titleText}>Sign In</Text>
        </View>
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
          onClick = {isUsername}
          text = "Sign In"
        />
        {failedMessage &&
          <View style = {styles.failedContainer}>
            <Text style = {styles.failedText}>Username does not exist or Password is false</Text>
          </View>
        }
        <ButtonBox
          onClick = {goToCreateAccount}
          text = "Sign Up"
        />
      </View>
    </TopBar>
  );
}

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
            <Text>Open</Text>
          </TouchableHighlight>
        </View>
      </View>
      <View style = {[styles.drawerContainer, drawer? undefined: {width: 0}]}>
        <TouchableHighlight onPress={()=> changeDrawer(!drawer)} style={styles.navigationButtons}>
          <Text>Close</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={()=>props.navigation.navigate("CreateAccount")} style={styles.navigationButtons}>
          <Text>Create an Account</Text>
        </TouchableHighlight>
       
      </View>
      {props.children}
    </View>
  )
};

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