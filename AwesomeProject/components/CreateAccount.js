import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import database from '@react-native-firebase/database';
import * as styles from './styles.js';


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
const TopBar = ({children}) => {
    return (
      <View style = {styles.container}>
        <View style = {styles.topBarContainer}>
  
        </View>
        {children}
      </View>
    )
};


export function CreateAccount ({navigation}) {
    const [textUserName, changeTextUserName] = useState('');//For the Username Field
    const [textPassword, changeTextPassword] = useState('');//For the Password Field
    const [failed, changefailed] = useState(false);//Only sets to true when they failed once on account and sets feedback message
  
    const anyPreviousUsernames = snapshot => {
      if(snapshot.val() !== null || textUserName === '' || textPassword === ''){
        changefailed(true);
      }
      else{
        changefailed(false);
        const newData = database().ref("/Database/Users").push({
          Username: textUserName,
          Password: textPassword,
          Reference: {
            theme: "light",
          },
        });
        const newDataKey = newData.key;
        newData.update({ID: newDataKey});
        changeTextUserName(""); //Resets all changes made
        changeTextPassword("");
        changefailed(false);
        navigation.navigate("LogIn");
      }
      database().ref("/Database/Users").orderByChild("Username").equalTo(textUserName).off("value", anyPreviousUsernames); 
    };
    
    const createNewAccount = () => {
      database().ref("/Database/Users").orderByChild("Username").equalTo(textUserName).on("value", anyPreviousUsernames);
    };
  
    const goToLogIn = () => { //Goes to CreateAccount Screen
      changeTextUserName(""); //Resets all changes made
      changeTextPassword("");
      changefailed(false);
      navigation.navigate("LogIn");
    };
  
    return (
      <TopBar>
        <Drawer navigation={navigation}></Drawer>
      <View style = {styles.logInContainer}>
        <View style = {styles.logInSignInTitleContainer}>
          <Text style = {styles.logInSignInTitleText}>Sign Up</Text>
        </View>
        {failed &&
        <View style = {styles.logInRedFailedContainer}>
          <Text style = {styles.logInRedFailedText}>Username Already Exists</Text>
        </View>
        }
        <View style = {styles.logInTextAreaContainer}>
          <Text style = {styles.logInTextAbove}>Username</Text>
          <View style = {styles.logInTextInputContainer}>
            <TextInput
              onChangeText = {text => changeTextUserName(text)}
              placeholder = "UserName"
              value = {textUserName}
            />
          </View>
        </View>
        <View style = {styles.logInTextAreaContainer}>
          <Text style = {styles.logInTextAbove}>Password</Text>
          <View style = {styles.logInTextInputContainer}>
            <TextInput
              onChangeText = {text => changeTextPassword(text)}
              placeholder = "Password"
              value = {textPassword}
            />
          </View>
        </View>
        <View style = {styles.logInButtonContainer}>
          <TouchableHighlight 
            style = {styles.logInButton}
            onPress = {createNewAccount}
          >
            <Text style = {styles.logInButtonText}>Sign Up</Text>
          </TouchableHighlight>
        </View>
        <View style = {styles.logInButtonContainer}>
          <TouchableHighlight 
            style = {styles.logInButton}
            onPress = {goToLogIn}
          >
            <Text style = {styles.logInButtonText}>Sign In</Text>
          </TouchableHighlight>
        </View>
      </View>
    </TopBar>
    );
  }