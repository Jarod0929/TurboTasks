import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  FlatList,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import * as styles from './styles.js';


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
        <TouchableHighlight 
          onPress={()=> 
            changeDrawer(!drawer)
          } 
          style={styles.navigationButtons}
        >
          <Text>
            Close
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress = {()=>{
            props.navigation.goBack();
          }}
          style={styles.navigationButtons}
        >
          <Text>
            Go Back
          </Text>
        
        </TouchableHighlight>
        <TouchableHighlight 
          onPress={()=>
            props.navigation.navigate("ProjectCreation", {user:props.userInfo})
              
          }
          style={styles.navigationButtons}
        >
          <Text>
            Project Creation
          </Text>
        </TouchableHighlight>
        <TouchableHighlight 
          onPress={()=>
            props.navigation.navigate("ProjectList", {user:props.userInfo})
          }
          style={styles.navigationButtons}
        >
          <Text>
            ProjectList
          </Text>
        </TouchableHighlight>
          
      </View>
      {props.children}
    </View>
  )
};

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
    if(Accepted=='True'){
      if(userEnteredPassword != ''){
        database().ref("/Database/Users/" + route.params.user).update({Password: userEnteredPassword});
      
        changePassword(userEnteredPassword);
        changeUserEnteredPassword('');
        changeAccepted('False');
        changeinputTextForPassword('Enter your password');
        
      } else {
        changeAccepted('False');
        changeinputTextForPassword("Something Went Wrong");
      }    

    // If it its the correct password then the user will enter in their new desired password
    } else if(userEnteredPassword==password){
      
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
    if(userEnteredPasswordForUsername==password){
      changeUserEnteredPasswordForUsername('');
      changeUsernameValidity('True');
      changeinputTextForUsername("Enter New Username");
    }
    //if the user entered the correct password and a new username update their username
    else if(usernameChangeValid=='True'){
      // if they did not try to enter an empty username
      if(userEnteredPasswordForUsername != ''){
        database().ref("/Database/Users/" + route.params.user).update({Username: userEnteredPasswordForUsername});
        changeUser(userEnteredPasswordForUsername);
        changeUserEnteredPasswordForUsername('');
        changeUsernameValidity('False');
        changeinputTextForUsername('Enter your password');
       
      } else {
        changeUserEnteredPassword('');
        changeinputTextForUsername("Something Went Wrong");
      }   
    }
    else{
      console.log("wrong password try again");
    }
  }
  
  // finds username of current logged in user
  if(username==''){
    database().ref("/Database/Users/" + route.params.user).once("value", handleUsername);
  }
  //finds password of current logged in user
  if(password==''){
      database().ref("/Database/Users/" + route.params.user+"/Password").once("value", handlePassword);
  }

  return(
    <TopBar navigation = {navigation} userInfo={route.params.user}>
      
      <View style={styles.settingsPage}>
        <View style={styles.innerSettingsPage}>
          <View style = {styles.flexAlignContainer}>
            <Text>Hello {username} Welcome to your Settings</Text> 
            <Text>Enter your password to Change Your Username</Text>
            <View style={styles.textInputContainer}>
              <TextInput 
                onChangeText = {text => changeUserEnteredPasswordForUsername(text)}
                placeholder = {inputTextForUsername}
                value = {userEnteredPasswordForUsername}
              />
            </View>
            <TouchableHighlight 
              style={styles.buttonContainer} 
              onPress={()=>
                changeUsername()
              }
            >
              <Text style={styles.buttonText}>Enter</Text>
            </TouchableHighlight>
            <Text>Enter your password to Change Your password</Text>
            <View style={styles.textInputContainer}>
              <TextInput 
                onChangeText = {text => changeUserEnteredPassword(text)}
                placeholder = {inputTextForPassword}
                value = {userEnteredPassword}
              />
            </View>
            <TouchableHighlight 
              style={styles.buttonContainer} 
              onPress={()=>
                isPassword()
              }
            >
              <Text style={styles.buttonText}>Enter</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </TopBar>
  );
}
    