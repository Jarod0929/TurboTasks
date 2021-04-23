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

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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
        <TouchableHighlight onPress={()=>props.navigation.navigate("CreateAccount")} style={styles.navigationButtons}><Text>Create an Account</Text></TouchableHighlight>
        

      </View>
      }
    </View>
  
  );
}

const TopBar = ({children}) => {
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
          >
            <Text style = {styles.textAbove}>Open</Text>
          </TouchableHighlight>
        </View>
      </View>
      <View style = {[styles.drawerContainer, drawer? undefined: {width: 1}]}>

      </View>
      {children}
    </View>
  )
};


export function LogIn({ navigation }){
    const [textUserName, changeTextUserName] = useState('');//For the Username Field
    const [textPassword, changeTextPassword] = useState('');//For the Password Field
    const [failed, changefailed] = useState(false);//Only sets to true when they failed once on account and sets feedback message
    //const FirstUsers = database().ref("/Database/Users").push(); //First Account and is structure of how it should look
    //FirstUsers.set({ 
    //  Username: "Fruit",
    //  Password: "Apple",
    //  Projects: [""],
    //});
    //This should work as intended, only one press is needed
    const samePassword = snapshot => { 
      console.log(snapshot.val());
      if(snapshot.val() != null && snapshot.val().Password === textPassword){//Checks if the Password is the same
        changeTextUserName(""); //Resets Username if goes onto next screen
        changefailed(false); //Resets failed message
        //GLOBALUSERID=snapshot.val().ID;
        navigation.navigate("Main",{screen: 'ProjectList', params: {user: snapshot.val().ID }});
  
      }
      database().ref("/Database/Users").orderByChild("Username").equalTo(textUserName).off("child_added", samePassword); 
    };
  
    const isAccount = () => { //Checks if there is an account
      changefailed(true); //Outside because the function above does not go, unless there is a username in the database
      changeTextPassword("");
      database().ref("/Database/Users").orderByChild("Username").equalTo(textUserName).on("child_added", samePassword);//Only works with on, not once
    };  
    
    const goToCreateAccount = () => { //Goes to CreateAccount Screen
      changeTextUserName(""); //Resets all changes made
      changeTextPassword("");
      changefailed(false);
      navigation.navigate("CreateAccount");
    };
    
    return(
      <TopBar>
        <Drawer navigation={navigation}></Drawer>
        <View style = {styles.flexAlignContainer}>
          <View style = {styles.titleContainer}>
            <Text style = {styles.titleText}>Sign In</Text>
          </View>
          <View style = {styles.textAreaContainer}>
            <Text style = {styles.textAbove}>Username</Text>
            <View style = {styles.textInputContainer}>
              <TextInput
                onChangeText = {text => changeTextUserName(text)}
                placeholder = "UserName"
                value = {textUserName}
              />
            </View>
          </View>
          <View style = {styles.textAreaContainer}>
            <Text style = {styles.textAbove}>Password</Text>
            <View style = {styles.textInputContainer}>
              <TextInput
                onChangeText = {text => changeTextPassword(text)}
                placeholder = "Password"
                value = {textPassword}
              />
            </View>
          </View>
          <View style = {styles.buttonContainer}>
            <TouchableHighlight 
              style = {styles.button}
              onPress = {isAccount}
            >
              <Text style = {styles.buttonText}>Log In</Text>
            </TouchableHighlight>
          </View>
          {failed &&
          <View style = {styles.failedContainer}>
            <Text style = {styles.failedText}>Username does not exist or Password is false</Text>
          </View>
          }
          <View style = {styles.buttonContainer}>
            <TouchableHighlight 
              style = {styles.button}
              onPress = {goToCreateAccount}
            >
              <Text style = {styles.buttonText}>Sign Up</Text>
            </TouchableHighlight>
          </View>
        </View>
      </TopBar>
    );
}


