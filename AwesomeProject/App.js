/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableHighlight,
  TextInput,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import database from '@react-native-firebase/database';

const Users = database().ref("/Database/Users");

function LogIn({ navigation }) {
  const [textUserName, changeTextUserName] = useState('');
  const [textPassword, changeTextPassword] = useState('');
  const [failed, changefailed] = useState(false);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight
        onPress = {() => navigation.navigate("CreateAccount")}
      >
        <View
          style = {styles.buttonLogIn}
        >
          <Text>Create Account</Text>
        </View>
      </TouchableHighlight>
      <TextInput
        style = {styles.textInputLogIn}
        onChangeText = {text => changeTextUserName(text)}
        placeholder = "UserName"
        value = {textUserName}
      />
      <TextInput
        style = {styles.textInputLogIn}
        onChangeText = {text => changeTextPassword(text)}
        placeholder = "Password"
        value = {textPassword}
      />
      <TouchableHighlight
        onPress = {() => console.log("Hello World")}
      >
        <View
          style = {styles.buttonLogIn}
        >
          <Text>Press to LogIn</Text>
        </View>
      </TouchableHighlight>
      {failed &&
        <View>
          <Text>You Have Failed</Text>
        </View>
      }
    </View>
  );
}

function CreateAccount({ navigation }) {
  const [textUserName, changeTextUserName] = useState('');
  const [textPassword, changeTextPassword] = useState('');
  const [failed, changefailed] = useState(false);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight
        onPress = {() => navigation.navigate("LogIn")}
      >
        <View
          style = {styles.buttonLogIn}
        >
          <Text>Go Back</Text>
        </View>
      </TouchableHighlight>
      <TextInput
        style = {styles.textInputLogIn}
        onChangeText = {text => changeTextUserName(text)}
        placeholder = "UserName"
        value = {textUserName}
      />
      <TextInput
        style = {styles.textInputLogIn}
        onChangeText = {text => changeTextPassword(text)}
        placeholder = "Password"
        value = {textPassword}
      />
      <TouchableHighlight
        onPress = {() => console.log("Hello World")}
      >
        <View
          style = {styles.buttonLogIn}
        >
          <Text>Create Account</Text>
        </View>
      </TouchableHighlight>
      {failed &&
        <View>
          <Text>You Have Failed</Text>
        </View>
      }
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="LogIn">
        <Drawer.Screen name="LogIn" component={LogIn} />
        <Drawer.Screen name="CreateAccount" component={CreateAccount} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  buttonLogIn: {
    alignItems: "center",
    backgroundColor: "green",
    marginTop: 50,
    marginBottom: 50,
  },
  textInputLogIn: {
    marginTop: 50,
    marginBottom: 50,
  }
});