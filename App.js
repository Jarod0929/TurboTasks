/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import {LogIn} from './components/LogIn.js';
import {CreateAccount} from './components/CreateAccount.js';
import {ProjectList} from './components/ProjectList.js';
import {ProjectCreation} from './components/ProjectCreation.js';
import {Settings} from './components/Settings.js';
import {Project} from './components/Project.js';

/**
 * For Testing Purposes
 * @returns Test Page
 */
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

/**
 * Group of screens before LogIn
 */
export default function App(){
  return (
    <NavigationContainer>
      <RootScreen.Navigator initialRouteName = "LogIn" screenOptions = {{ headerShown: false }}>
        <RootScreen.Screen name = "Main" component= { AfterLogin } options = {{
                drawerLabel: () => null,
                title: null,
                drawerIcon: () => null }} />
        <RootScreen.Screen name = "LogIn" component = { LogIn }/>
        <RootScreen.Screen name = "Test" component = { Test }/>
        <RootScreen.Screen name = "CreateAccount" component = { CreateAccount }/>
      </RootScreen.Navigator>
    </NavigationContainer>  
  );
}

/**
 * The group of Screens after LogIn
 */
const SecondDrawer = createStackNavigator();
function AfterLogin({ route, navigation }){
  return(
    <SecondDrawer.Navigator screenOptions = {{ headerShown: false }}>
      <SecondDrawer.Screen name = "LogIn" component = { LogIn } />
      <SecondDrawer.Screen name = "ProjectList" component={ ProjectList }/>
      <SecondDrawer.Screen name = "ProjectCreation" component = { ProjectCreation }/>
      <SecondDrawer.Screen name = "Project" component = { Project }/>
      <SecondDrawer.Screen name = "Settings" component = { Settings }/>
    </SecondDrawer.Navigator>
  );
}

