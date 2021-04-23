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
import database from '@react-native-firebase/database';
import DatePicker from 'react-native-date-picker'
import { add } from 'react-native-reanimated';

import {LogIn} from './components/LogIn.js';
import {CreateAccount} from './components/CreateAccount.js';
import {ProjectList} from './components/ProjectList.js';
import {ProjectCreation} from './components/ProjectCreation.js';
import {Settings} from './components/Settings.js';
import {EditTask} from './components/EditTask.js';
import {Project} from './components/Project.js';
import * as styles from './components/styles.js';
import Moment from 'moment';


function Test(){
  return(
    <View style = {{height: "100%", width: "100%", backgroundColor:"blue"}}>
      <View style = {{height: "90%", width: "90%", backgroundColor: "white", position: "absolute", top: "5%", left: "5%"}}>
        <View style = {{position: "absolute", height:"80%", width: "80%", backgroundColor: "black", top: "10%", left: "10%"}}>

        </View>
      </View>
    </View> 
  );
}

const RootScreen = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <RootScreen.Navigator initialRouteName="Test" screenOptions = {{ headerShown: false}}>
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

//Hmmmmmmmmmmmmmmmmmm TODO: Will be button click 

