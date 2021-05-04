/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  Text,
  useColorScheme,
  View,
  TouchableHighlight,
  TextInput,
  FlatList,
  DatePickerIOSBase,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

//import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useFocusEffect, useIsFocused } from '@react-navigation/native';
import Icon from "react-native-vector-icons/AntDesign";
import DatePicker from 'react-native-datepicker'
import LinearGradient from 'react-native-linear-gradient'


import {LogIn} from './components/LogIn.js';
import {CreateAccount} from './components/CreateAccount.js';
import {ProjectList} from './components/ProjectList.js';
import {ProjectCreation} from './components/ProjectCreation.js';
import {Settings} from './components/Settings.js';
import {EditTask} from './components/EditTask.js';
import {Project} from './components/Project.js';
import * as styles from './components/styles.js';

/**
 * For Testing Purposes
 * @returns Test Page
 */
function Test(){
  return(
    <View style = {{height: "100%", width: "100%", backgroundColor:"blue"}}>
      <View style = {{height: "90%", width: "90%", backgroundColor: "white", position: "absolute", top: "5%", left: "5%"}}>
        <View style = {{position: "absolute", height:"80%", width: "80%", backgroundColor: "black", top: "10%", left: "10%"}}>
        <LinearGradient
              style = {{width: "100%", height: "30%", padding: "3%"}}
              colors={["#187bcd", '#2a9df4', '#1167b1']}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
            >
            <Text
            style = {{alignSelf: "center", fontSize: 35, fontFamily: "Courier New", color: "white"}}
          >
            Create a Project
          </Text>
          <Icon name="addfolder" size={100} color="blue"  style={{alignSelf: "center", top: "5%"}} ></Icon>

          </LinearGradient>
          <LinearGradient
              style = {{width: "100%", height: "65%",  paddingTop: "5%"}}
              colors={['white', "lightgray"]}
              start={{ x: 1, y: 1 }}
              end={{ x: 1, y: 0 }}
        >
          <View style={{padding: 20}}>
            <View style = {{backgroundColor: "white", paddingTop: "10%", bottom: "15%", borderRadius: 10, height: "90%"}}>
              <Text style = {{alignSelf: "center"}}>Project Name</Text>
              <TextInput
                style = {{borderBottomColor: 'gray', color: 'black', borderBottomWidth: 1, width: "90%", height: "18%", marginBottom: "8%", alignSelf: "center", textAlign: "center"}}
                placeholder = "Office Function"
               
              />
            
              <Text  style = {{marginBottom: 10, alignSelf: "center"}} >Due Date</Text>
              <DatePicker                
                mode = "date"
                style = {{marginBottom: 20, alignSelf: "center", left: "7%"}}
                customStyles={{
                dateInput: {
                  backgroundColor: "white",
                  
                }
                // ... You can check the source to find the other keys.
                }}
              />
              <Text style = {{alignSelf: "center"}}>Invite Users</Text>
              {/*INVITE USER VIEW (USED TO PUT BUTTON AND INPUT ON ONE LINE)*/ }
              <View style = {{height: "18%"}}>
                <TextInput
                  autoFocus={true}
                  style = {{borderBottomColor: 'gray', borderBottomWidth: 1, width: "75%",height: "100%", textAlign: "center", alignSelf: "center", marginBottom: 10}}
                  placeholder = "Username"
                />
                <TouchableHighlight 
                    style = {{position: "absolute", marginLeft: "85%", top: "15%"}}
                    activeOpacity={0.6}
                    underlayColor="#00181"
                  >
                    <Icon
                      name="addusergroup" 
                      size = {35} 
                    />
                </TouchableHighlight>
                
              </View>
            </View> 
            {/*CREATE PROJECT BUTTON*/ }
            <View style = {{height: "15%", bottom: "5%"}}>
              <LinearGradient
                style = {{backgroundColor: "#2a9df4", width: "60%", height:"100%",  borderRadius: 10, alignSelf: "center"}}
                colors={["#187bcd", '#2a9df4']}
                start={{ x: 1, y: 1 }}
                end={{ x: 1, y: 0 }}
                >
                  <TouchableHighlight
                    style = {{borderRadius: 10, height: "100%"}}
                    activeOpacity={0.1}
                    underlayColor="#00181"
                  >
                    <Icon
                     name="pluscircleo"
                     color = "white"
                     style={{alignSelf: "center", paddingTop: 17, color: "white", fontSize: 20}}
                    >
                      {'  '}Create Project
                    </Icon>
                  </TouchableHighlight>
              </LinearGradient>
            </View>
          </View>
        </LinearGradient>
        </View>
      </View>
    </View> 
  );
}

const RootScreen = createStackNavigator();

/**
 * Group of screens before LogIn
 */
export default function App() {
  return (
    <NavigationContainer>
      <RootScreen.Navigator initialRouteName="LogIn" screenOptions = {{ headerShown: false}}>
        <RootScreen.Screen name="Main" component={AfterLogin} options={{
                drawerLabel: () => null,
                title: null,
                drawerIcon: () => null }} />
        <RootScreen.Screen name="LogIn" component={LogIn}/>
        <RootScreen.Screen name="Test" component={Test}/>
        <RootScreen.Screen name="CreateAccount" component={CreateAccount}/>
      </RootScreen.Navigator>
    </NavigationContainer>  
  );
}

/**
 * The group of Screens after LogIn
 */
const SecondDrawer = createStackNavigator();
 function AfterLogin({route,navigation}){
  return(
    <SecondDrawer.Navigator screenOptions = {{ headerShown: false }}>
      <SecondDrawer.Screen name="LogIn" component={LogIn} />
      <SecondDrawer.Screen name="ProjectList" component={ProjectList}/>
      <SecondDrawer.Screen name="ProjectCreation" component={ProjectCreation}/>
      <SecondDrawer.Screen name = "Project" component={Project}/>
      <SecondDrawer.Screen name = "EditTask" component={EditTask}/>
      <SecondDrawer.Screen name = "Settings" component={Settings}/>
    </SecondDrawer.Navigator>
  );
}

