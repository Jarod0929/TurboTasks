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
  FlatList,
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
import DatePicker from 'react-native-date-picker'

let GLOBALUSERID;

const TopBar = ({children}) => {
  return (
    <View style = {styles.container}>
      <View style = {styles.topBarContainer}>

      </View>
      {children}
    </View>
  )
};

function LogIn({ navigation }){
  return(
    <TopBar>
      <View style = {styles.logInContainer}>
        <View style = {styles.logInSignInTitleContainer}>
          <Text style = {styles.logInSignInTitleText}>Sign In</Text>
        </View>
        <View style = {styles.logInTextAreaContainer}>
          <Text style = {styles.logInTextAbove}>Username</Text>
          <View style = {styles.logInTextInputContainer}>
            <TextInput></TextInput>
          </View>
        </View>
        <View style = {styles.logInTextAreaContainer}>
          <Text style = {styles.logInTextAbove}>Password</Text>
          <View style = {styles.logInTextInputContainer}>
            <TextInput></TextInput>
          </View>
        </View>
        <View style = {styles.logInButtonContainer}>
          <TouchableHighlight style = {styles.logInButton}>
            <Text style = {styles.logInButtonText}>Log In</Text>
          </TouchableHighlight>
        </View>
        <View style = {styles.logInCreateAccountContainer}>
          <Text style = {styles.AverageWhiteText}>Don't have an Account?</Text>
        </View>
      </View>
    </TopBar>
  );
}

/*
function LogIn({ navigation }) {
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
    changefailed(true);
    changeTextPassword("");
    if(snapshot.val().Password === textPassword){
      changeTextUserName("");
      changefailed(false);
      navigation.navigate("ProjectList", {user: snapshot.val().ID});
      GLOBALUSERID=snapshot.val().ID;

    }
    database().ref("/Database/Users").orderByChild("Username").equalTo(textUserName).off("child_added", samePassword); 
  };

  const isAccount = () => { //Checks if there is an account
    database().ref("/Database/Users").orderByChild("Username").equalTo(textUserName).on("child_added", samePassword);//Only works with on, not once
  };
  //TODO: Create better UI
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
        onPress = {isAccount}
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
*/
function CreateAccount({ navigation }) {
  const [textUserName, changeTextUserName] = useState('');//For the Username Field
  const [textPassword, changeTextPassword] = useState('');//For the Password Field
  const [failed, changefailed] = useState(false);//Only sets to true when they failed once on account and sets feedback message

  const anyPreviousUsernames = snapshot => {
    if(snapshot.val() !== null){
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
      navigation.navigate("LogIn");
    }
    database().ref("/Database/Users").orderByChild("Username").equalTo(textUserName).off("value", anyPreviousUsernames); 
  };
  
  const createNewAccount = () => {
    //TODO: Find out way so Users can not spam and by pass multiple Usernames
    //Tried: Async and Promises shallowly
    //TODO: Also for some Reason you have to press the button twice
    database().ref("/Database/Users").orderByChild("Username").equalTo(textUserName).on("value", anyPreviousUsernames);
  };
  //TODO: Create Better UI
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
        onPress = {createNewAccount}
      >
        <View
          style = {styles.buttonLogIn}
        >
          <Text>Create Account</Text>
        </View>
      </TouchableHighlight>
      {failed && //TODO: Create new better message
        <View>
          <Text>You Have Failed</Text>
        </View>
      }
    </View>
  );
}

let count = 0;
function ProjectList ({ route, navigation }) {
  const [user, changeUser] = useState(null);
  const [projects, changeProjects] = useState([]);
  const [projectList, changeProjectList] = useState([]);

  const handleUser = snapshot => {
    console.log(snapshot.val());
    if(snapshot.val().projects.length != 0){
      changeProjects(snapshot.val().projects);
    }
    changeUser(snapshot.val());
  }

  if(user == null){
    database().ref("/Database/Users/" + route.params.user).once("value", handleUser);
  }

  const handleProject = snapshot => {
    let list = projectList.slice()
    list.push(snapshot.val());
    changeProjectList(list);
  }
  
  if(projects.length > projectList.length && user != null){
    database().ref("/Database/Projects/" + projects[projectList.length]).once("value", handleProject);
  }

  if(projectList.length == 0){
    return (// TopBar is supposed to handle the Drawer and don't forget about it
    <TopBar>
      <TouchableHighlight 
        style={{width: "15%", height: "15%", padding: 10, 
                backgroundColor: "blue", left: "85%", top: 0}}
        onPress={() => {
          navigation.navigate("ProjectCreation");
        }}
      >
        <View>
          <Text style={{color: "white", fontSize: 50}}>+</Text>
        </View> 
      </TouchableHighlight>
      <View style={{ top: "0%", height: "85%", backgroundColor: "white", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>No Projects</Text> 
      </View>
    </TopBar>
    );
  } else {
    return (// TopBar is supposed to handle the Drawer and don't forget about it
      
      <TopBar>
        <TouchableHighlight 
          style={{width: "15%", height: "15%", padding: 10, 
                  backgroundColor: "blue", left: "85%", top: 0}}
          onPress={() => {
            navigation.navigate("ProjectCreation");
          }}
        >
          <View>
            <Text style={{color: "white", fontSize: 50}}>+</Text>
          </View> 
        </TouchableHighlight>

        <View style={{ top: "0%", height: "85%", backgroundColor: "white", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <FlatList
            style={{width: "100%"}}
            data={projectList}
            renderItem={({item}) => 
            <React.StrictMode>
              <ProjectPanel
                project = {item}
              />
            </React.StrictMode>

            }
            keyExtractor={item => {
              count++;
              return count;
            }}
          />
        </View>

      </TopBar>

    );
  }
}

const ProjectPanel = (props) => {
  console.log(props.project);
  return (
    <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}>
      <Text style={{fontSize: 20}}>
        {props.project.title}
      </Text>
      <Text>{props.project.tasks.length} Task(s)</Text>
      <Text>Due Date: (would go here) </Text>
      <Text>{props.project.users.length} User(s)</Text>
    </View>
  );
}


function ProjectCreation ({ navigation }) { 
  //Insert the Project Code here
  const [projectName, changeProjectName] = useState('');//For the projectName field
  const [invUsers, changeInvUsers] = useState('');//For the inviteUsers field
  const [invUsersList, addUsersList] = useState(["placeHolder"]);//For the inviteUsers button
  const [date, setDate] = useState(new Date())

  const createNewProject = () => {
    let month = date.getMonth() + 1;
    if(projectName != ""){
      database().ref("/Database/Projects").push({
        title: projectName,
        users: invUsersList,
        tasks: ["PlaceHolder"],
        dueDate: month + " " + date.getDate() + " " + date.getFullYear()
      });
      changeProjectName("");
      addUsersList(["placeHolder"]);
    }
  };
  const addUsersToList = () =>{
    if(invUsers != ""){
      if(invUsersList[0] === "placeHolder" ){
        invUsersList.pop();
      }
      let list = invUsersList.slice();
      list.push(invUsers);
      addUsersList(list);
    }
    changeInvUsers("");
  };
  
  return (// TopBar is supposed to handle the Drawer and don't forget about it
    <TopBar> 
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        style = {styles.textInputLogIn}
        placeholder = "Project Name"
        onChangeText = {text => changeProjectName(text)}
        value={projectName}
      />
      <DatePicker
      date={date}
      mode = "date"
      onDateChange={setDate}
    />
      <Text>Invite Users</Text>
      <TextInput
        style = {styles.textInputLogIn}
        placeholder = "Username"
        onChangeText = {text => changeInvUsers(text)}
        value={invUsers}
      />
      <TouchableHighlight onPress = {addUsersToList}>
        <View
          style = {styles.buttonLogIn}
        >
          <Text>Invite User</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight onPress = {createNewProject}>
        <View
          style = {styles.buttonLogIn}
        >
          <Text>Creat Project</Text>
        </View>
      </TouchableHighlight>
      </View>
    </TopBar>
  );
}

function Project ({ navigation }) { 
  //Insert the Project Code here

  return (// TopBar is supposed to handle the Drawer and don't forget about it
    <TopBar> 
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Hello World</Text>
      </View>
    </TopBar>
  );
}


const Drawer = createDrawerNavigator();

export default function App() {
  return (
  <React.StrictMode>
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="LogIn">
        <Drawer.Screen name="LogIn" component={LogIn} />
        <Drawer.Screen name="CreateAccount" component={CreateAccount} />
        <Drawer.Screen name="ProjectList" component={ProjectList}/>
        <Drawer.Screen name="Project" component={ProjectList}/>
        <Drawer.Screen name="ProjectCreation" component={ProjectCreation}/>
        <Drawer.Screen name = "Settings⚙️" component={Settings}/>
      </Drawer.Navigator>
    </NavigationContainer>
  </React.StrictMode>

  );
}

function Settings(){
  const [username, changeUsername] = useState(null);
  const [password,changePassword] = useState(null);
  const[prefrence,changePrefrence]=useState(null);

  const handleUser = snapshot => {
    changeUsername(snapshot.val().Username);
    
    changePassword(snapshot.val().Password);
    
    
  }

  if(username == null){
    database().ref("/Database/Users/" + GLOBALUSERID).once("value", handleUser);
  }
  return(
  <TopBar>
  <View>
    <Text>Hello {username}</Text>
    <Text>Your Password is: {password}</Text>
  </View>
  </TopBar>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "darkblue",
    
  },
  topBarContainer: {
    backgroundColor: "cyan",
    borderBottomRightRadius: 20,
    borderWidth: 5,
    height: '10%',
    width: '100%',
  },
  logInContainer: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: "center",
  }, 
  logInSignInTitleContainer: {
    position: 'relative',
    top: 10,
    paddingBottom: 30,
  },
  logInSignInTitleText: {
    color: 'white',
    fontSize: 28,
  },
  logInTextInputContainer: {
    borderWidth: 5,
    height: 50,
    width: 150,
    backgroundColor:'white',
  },
  logInTextAreaContainer: {
    paddingBottom: 30,
  },
  logInTextAbove: {
    color: 'white',
    fontSize: 16,
  },
  logInButtonContainer: {
    backgroundColor: 'cyan',
    borderWidth: 5,
    borderRadius: 10,
    width: 175,
    height: 60,
  },
  logInButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logInButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logInCreateAccountContainer: {
    position: 'relative',
    bottom: 10
  },
  AverageWhiteText: {
    color: 'white',
    fontSize: 16,
  },
});