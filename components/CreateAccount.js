import React, {useState} from 'react';
import {
  Text,
  View,
} from 'react-native';

import { TopBar } from './utilityComponents/TopBar.js';
import { ButtonBox } from  './utilityComponents/ButtonBox.js';
import { TextInputBox } from  './utilityComponents/TextInputBox.js';

import database from '@react-native-firebase/database';

import * as styles from './styles/styles.js';
import * as basicStyles from './styles/basicStyles.js';

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
    <TopBar 
      navigation = { navigation }
      userInfo = { null }
      listNavigation = {[ "LogIn" ]}
    >
      <Text style = {styles.topBarTitle}>Create Account</Text>
      <View style = { styles.flexAlignContainer }>
        <View style = {styles.titleContainer }>
          <Text style = { styles.titleText }>Sign Up</Text>
        </View>
        {failedMessage &&
          <View style = { styles.redFailedContainer }>
            <Text style = { styles.redFailedText }>Username Already Exists</Text>
          </View>
        }
      <TextInputBox
        changeValue = { changeUsername }
        text = { "Username" }
        value = { username }
        outerViewStyle = { basicStyles.textAreaContainer }
        textStyle = { basicStyles.defaultText }
        innerViewStyle = { basicStyles.textInputContainer }
      />
      <TextInputBox
        changeValue = { changePassword }
        text = { "Password" }
        value = { password }
        outerViewStyle = { basicStyles.textAreaContainer }
        textStyle = { basicStyles.defaultText }
        innerViewStyle = { basicStyles.textInputContainer }
      />
      <ButtonBox
        onClick = { attemptCreateAccount }
        text = "Sign Up"
        containerStyle = { basicStyles.buttonContainer }
        buttonStyle = { basicStyles.button }
        textStyle = { basicStyles.buttonText }
      />
      <ButtonBox
        onClick = { goToLogIn }
        text = "Sign In"
        containerStyle = { basicStyles.buttonContainer }
        buttonStyle = { basicStyles.button }
        textStyle = { basicStyles.buttonText }
      />
    </View>
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