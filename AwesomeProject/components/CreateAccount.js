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
  const [username, changeUsername] = useState('');//For the Username Field
  const [password, changePassword] = useState('');//For the Password Field
  const [failed, changeFailed] = useState(false);//Only sets to true when they failed once on account and sets feedback message
  
  const anyPreviousUsernames = snapshot => {
    if(snapshot.val() !== null || username === '' || password === ''){
      changeFailed(true);
    } else {
      changeFailed(false);
      const newData = database().ref("/Database/Users").push({
        Username: username,
        Password: password,
        Reference: {
          theme: "light",
        },
      });
      const newDataKey = newData.key;
      newData.update({ID: newDataKey});
      changeUsername(""); //Resets all changes made
      changePassword("");
      changeFailed(false);
      navigation.navigate("LogIn");
    }
    database().ref("/Database/Users").orderByChild("Username").equalTo(username).off("value", anyPreviousUsernames); 
  };
    
  const createNewAccount = () => {
    database().ref("/Database/Users").orderByChild("Username").equalTo(username).on("value", anyPreviousUsernames);
  };
  
  const goToLogIn = () => { //Goes to CreateAccount Screen
    changeUsername(""); //Resets all changes made
    changePassword("");
    changeFailed(false);
    navigation.navigate("LogIn");
  };
  
  return (
    <TopBar>
      <Drawer navigation={navigation}></Drawer>
      <View style = {styles.container}>
        <View style = {styles.signInTitleContainer}>
          <Text style = {styles.signInTitleText}>Sign Up</Text>
        </View>
        {failed &&
          <View style = {styles.redFailedContainer}>
            <Text style = {styles.redFailedText}>Username Already Exists</Text>
          </View>
        }
        <View style = {styles.textAreaContainer}>
          <Text style = {styles.textAbove}>Username</Text>
          <View style = {styles.textInputContainer}>
            <TextInput
              onChangeText = {text => changeUsername(text)}
              placeholder = "UserName"
                alue = {username}
            />
          </View>
        </View>
        <View style = {styles.textAreaContainer}>
          <Text style = {styles.textAbove}>Password</Text>
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