import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  FlatList,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
        <View style={styles.Drawercont}>
          <TouchableHighlight onPress={()=> changeDrawer(!drawer)} style={styles.navigationButtons}><Text>Close</Text></TouchableHighlight>
          <TouchableHighlight onPress={()=>props.navigation.navigate("ProjectCreation",{user:props.userInfo})} style={styles.navigationButtons}><Text>Project Creation</Text></TouchableHighlight>
          <TouchableHighlight onPress={()=>props.navigation.navigate("ProjectList",{user:props.userInfo})} style={styles.navigationButtons}><Text>ProjectList</Text></TouchableHighlight>
  
        </View>
        }
      </View>
    
    );
  }
  
  const TopBar = (props) => {
    
      return (
        <View style = {styles.container}>
          <View style = {styles.topBarContainer}>
          <TouchableHighlight
              onPress = {()=>{
                props.navigation.goBack();
              }}
            >
              <View>
                <Text>Go Back</Text>
              </View>
            </TouchableHighlight>
          </View>
          {props.children}
        </View>
      )
    };


    export function Settings({ route, navigation }) {
        const [textPassword,changeTextPassword]=useState(''); // user entered password
        const [password,changePassword]=useState(''); // pulled database password
        const [username,changeUser]=useState(''); // username
        const[inputText,changeinputText]=useState('Password'); // input text for background of box
        const[Accepted,changeAccepted]=useState("False"); // password is true or false 

        
        const handleUsername = snapshot => {
            changeUser(snapshot.val().Username);
        }
        const handlePassword = snapshot => {
            changePassword(snapshot.val());
        }
        const isPassword = () =>{
            if(Accepted=='True'){
                if(textPassword != ''){
                    database().ref("/Database/Users/" + route.params.user).update({Password: textPassword});
                    changeTextPassword('');
                    changeAccepted('False');
                    changeinputText('Enter your password');
                    database().ref("/Database/Users/" + route.params.user+"/Password").once("value", handlePassword);
                }
                else{
                    changeTextPassword('');
                    changeinputText("Something Went Wrong");
                }
                
            }
            else if(textPassword==password){
                console.log("right");
                changeTextPassword('');
                changeAccepted('True');
                changeinputText("Enter New Password");
            }
            else{
                console.log("wrong Password Try again");
            }
        }

        if(username==''){
            database().ref("/Database/Users/" + route.params.user).once("value", handleUsername);
        }
        if(password==''){
            database().ref("/Database/Users/" + route.params.user+"/Password").once("value", handlePassword);
        }

        
        

        return(
        <TopBar navigation = {navigation}>
            <Drawer userInfo={route.params.user} navigation={navigation}></Drawer>
           <Text>Hello {username} Welcome to your Settings</Text> 
           <Text>Enter your password to Change Your password</Text>
           <View style={styles.textInputFPCh}>
           <TextInput 
           onChangeText = {text => changeTextPassword(text)}
           placeholder = {inputText}
           value = {textPassword}></TextInput>
           </View>
           <TouchableHighlight style={styles.enterBt} onPress={()=>isPassword()}><Text>Enter</Text></TouchableHighlight>

            </TopBar>

        );
    }
    