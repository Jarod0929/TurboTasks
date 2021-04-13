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
  SnapshotViewIOS,
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
    if(snapshot.val().Password === textPassword){//Checks if the Password is the same
      changeTextUserName(""); //Resets Username if goes onto next screen
      changefailed(false); //Resets failed message
      GLOBALUSERID=snapshot.val().ID;
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
      <View style = {styles.logInContainer}>
        <View style = {styles.logInSignInTitleContainer}>
          <Text style = {styles.logInSignInTitleText}>Sign In</Text>
        </View>
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
            onPress = {isAccount}
          >
            <Text style = {styles.logInButtonText}>Log In</Text>
          </TouchableHighlight>
        </View>
        {failed &&
        <View style = {styles.logInRedFailedContainer}>
          <Text style = {styles.logInRedFailedText}>Username does not exist or Password is false</Text>
        </View>
        }
        <View style = {styles.logInButtonContainer}>
          <TouchableHighlight 
            style = {styles.logInButton}
            onPress = {() => navigation.navigate("Main",{screen: 'Project'})}
          >
            <Text style = {styles.logInButtonText}>Goto Test Project</Text>
          </TouchableHighlight>
        </View>
        <View style = {styles.logInButtonContainer}>
          <TouchableHighlight 
            style = {styles.logInButton}
            onPress = {goToCreateAccount}
          >
            <Text style = {styles.logInButtonText}>Sign Up</Text>
          </TouchableHighlight>
        </View>
      </View>
    </TopBar>
  );
}

function CreateAccount ({navigation}) {
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

function ProjectList ({ route, navigation }) {
  
  const [projects, changeProjects] = useState(null);

  /* Takes the users info looking for the users projects */

  const handleProject = snapshot => {
    console.log(snapshot.val());
    changeProjects(snapshot.val().projects);
  }

  /* if the user is null find the user using route params*/
  if(projects == null){
    database().ref("/Database/Users/" + GLOBALUSERID).once("value", handleProject);
  }
  console.log(GLOBALUSERID);
  console.log(projects);
  /* if no projects are present output this*/
  if(projects != null && projects.length == 0){
    return (// TopBar is supposed to handle the Drawer and don't forget about it
    <TopBar>
      <TouchableHighlight 
        style={{width: "15%", height: "15%", padding: 10, 
                backgroundColor: "blue", left: "85%", top: 0}}
        onPress={() => {
         navigation.navigate("ProjectCreation",{user: GLOBALUSERID});
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
  } 
  /*If the user has at least one project output this*/
  else {
    return (// TopBar is supposed to handle the Drawer and don't forget about it
      
      <TopBar>
        <TouchableHighlight 
          style={{width: "15%", height: "15%", padding: 10, 
                  backgroundColor: "blue", left: "85%", top: 0}}
          
          onPress={() => {
            navigation.navigate("ProjectCreation", { user: GLOBALUSERID});
        }}
        >
          <View>
            <Text style={{color: "white", fontSize: 50}}>+</Text>
          </View> 
        </TouchableHighlight>

        <View style={{ top: "0%", height: "85%", backgroundColor: "white", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <FlatList
            style={{width: "100%"}}
            data={projects}
            renderItem={({item}) => 
            <React.StrictMode>
              <ProjectPanel
                project = {item}
                navigation ={navigation}
              />
            </React.StrictMode>

            }
            keyExtractor={item => item.ID}
          />
        </View>
      </TopBar>
    );
  }
}

/* Each project Box the user has*/
const ProjectPanel = (props) => {
  const [project, changeProject] = useState(null);

  const handleProject = snapshot => {
    changeProject(snapshot.val());
  }

  if(project == null) {
    database().ref("/Database/Projects/" + props.project).once("value", handleProject);
  }

  if(project != null) {
    return (
      <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}>
        <Text style={{fontSize: 20}}>
          {project.title}
        </Text>
        <Text>{project.tasks.length} Task(s)</Text>
        <Text>Due Date: {project.dueDate} </Text>
        <Text>{project.users.length} User(s)</Text>
      </View>
    );
  } else {
    return (
    <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}>
      <Text style={{fontSize: 20}}>
        Title
      </Text>
      <Text>0 Task(s)</Text>
      <Text>Due Date: due </Text>
      <Text>0 User(s)</Text>
    </View>
    );
  }
}

/*Project creation Page*/
function ProjectCreation ({ navigation }) { 
  //Insert the Project Code here
    
  const user = GLOBALUSERID;
  const [projectName, changeProjectName] = useState('');//For the projectName field
  const [invUsers, changeInvUsers] = useState('');//For the inviteUsers field
  const [invUsersList, addUsersList] = useState([user]);//For the inviteUsers button
  const [date, setDate] = useState(new Date())
  const addProjectIds = (userId, projectId) => {
    //Gets projects[] from user
    
    let add = database().ref(`/Database/Users/${userId}/projects`).on('value', snap => {
      if(snap.val() != null){
        let temp = snap.val();
        temp.push(projectId);
        //updates users project[] with newly created project
        database().ref(`/Database/Users/${userId}`).update({
          projects: temp,
        });
        database().ref(`/Database/Users/${userId}/projects`).off("value", add);
      }
      else{
        database().ref(`/Database/Users/${userId}`).update({
          projects: [projectId],
        });
        database().ref(`/Database/Users/${userId}/projects`).off("value", add);
      }
    });

  }
  const createNewProject = () => {
    //Sets proper month
    let month = date.getMonth() + 1;
    if(projectName != ""){
      //Initializes the new project
      const newData = database().ref("/Database/Projects").push({
        title: projectName,
        users: invUsersList,
        tasks: ["PlaceHolder"],
        dueDate: month + " " + date.getDate() + " " + date.getFullYear() 
      });
      //Project ID
      const newDataKey = newData.key;
      //Sets project ID
      newData.update({ID: newDataKey});
      //Loops through users in invUsersList and adds project: id 
      invUsersList.forEach(element => addProjectIds(element, newDataKey));
      changeProjectName("");
      addUsersList([user]);
      
    }
  };
  const addUsersToList = () =>{
    let userID = "";
    let something = database().ref("/Database/Users").orderByChild("Username").equalTo(invUsers).on("value", snapshot => {
      for(let key in snapshot.val()){
        userID = key;
      }
      if(invUsers != "" && userID != ""){
        let list = invUsersList.slice();
        list.push(userID);
        addUsersList(list);
      }
      database().ref("/Database/Users").orderByChild("Username").equalTo(invUsers).off("value", something);
    });
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
          <Text>Create Project</Text>
        </View>
      </TouchableHighlight>
      </View>
    </TopBar>
  );
}

let testUser = "-MXwL_44uOouN9v7CXzh"; //Using minecraft
let testProject = "-MXyDfORu-Q-DPJflmoE"; //Using testProject second one from above
//let allProjectTasks = []; //We use this because Flat list doesn't allow for good dynamic changes. Maybe should be unique IDs
const TaskPanel = (props) => {
  const [task, changeTask] = useState(null);

  const handleTask = snapshot => {
    changeTask(snapshot.val());
  }
  if(task == null) {
    database().ref("/Database/Tasks/" + props.project).once("value", handleTask);
  }
  if(task != null){
   return (
     <TouchableHighlight onPress = {() => {
       props.navigation.navigate("EditTask", {taskID: props.project});
     }}>
    <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}>
        <Text style={{fontSize: 20}}>
           {task.text}
        </Text>
      </View>
      </TouchableHighlight>
    );
  }
  else{
    return(
    <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}>
        <Text style={{fontSize: 20}}>
           N/A
        </Text>
    </View>
    );
  }
}
function Project ({ navigation, route }) { 
  //Insert the Project Code here
  //const Tasks = database().ref("/Database/Tasks").push(); //First Account and is structure of how it should look
  //Tasks.set({ 
  //  Text: "",
  //  ID: "",
  //  ParentTask: "",
  //  SubArray: [],
  //});
  //const [flashlight, changeFlashLight] = useState(false); If needed Flashlight for dark areas
  const [allProjectTasks, changeAllProjectTasks] = useState([]);

  if(allProjectTasks.length === 0){//Which means every time it exits, you must reset the allProjectTasks back to empty REMEMBER
    database().ref(`/Database/Projects/${testProject}`).once('value', snapshot => {
      if(snapshot.val().tasks !== undefined){
        changeAllProjectTasks(snapshot.val().tasks);
      }
    });
  }
  return (// TopBar is supposed to handle the Drawer and don't forget about it
  <View style={{ top: "0%", height: "85%", backgroundColor: "white", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <TouchableHighlight 
      onPress = {() => {
        const newTask = database().ref(`/Database/Tasks`).push();
        const newTaskID = newTask.key;
        let newArray = allProjectTasks.slice();
        newArray.push(newTaskID);
        changeAllProjectTasks(newArray);
        database().ref(`/Database/Projects/${testProject}`).update({
          tasks: newArray
        });
        newTask.set({
          ID: newTaskID,
          text: "Task",
          //parentTask: "",
          //order: 1,
          //subTaskArray: [],
        });
      }}
    >
      <Text>Add Cell</Text>
    </TouchableHighlight>
    <FlatList
      style = {{width: "75%"}}
      data={allProjectTasks}
      renderItem={({item}) => 
              <React.StrictMode>
                <TaskPanel
                  project = {item}
                  navigation = {navigation}
                />
              </React.StrictMode>
              }
      keyExtractor={item => item}
    />
  </View>      
  );
}

function EditTask ({ navigation, route }){
  const [newText, changeText] = useState(null);
  if(newText == null){
    database().ref(`/Database/Tasks/${route.params.taskID}`).once('value', snapshot => {
      changeText(snapshot.val().text);
    });
  }
  const handleText = () => {
    database().ref(`/Database/Tasks/${route.params.taskID}`).update({
      text: newText
    });
  }
  console.log(newText);
  return (
    <View>
      <TextInput 
        onChangeText = {text => changeText(text)}
        value = {newText}
      />
      <TouchableHighlight
        onPress = {() => {
          handleText();
         navigation.navigate('Project');
        }}
      >
        <Text>Save Changes?</Text>
      </TouchableHighlight>
    </View>

  );
}



const RootScreen = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <RootScreen.Navigator initialRouteName="LogIn">
        <RootScreen.Screen name="Main" component={AfterLogin} options={{
                drawerLabel: () => null,
                title: null,
                drawerIcon: () => null }} />
        <RootScreen.Screen name="LogIn" component={LogIn} />
        <RootScreen.Screen name="CreateAccount" component={CreateAccount}/>
        </RootScreen.Navigator>
      </NavigationContainer>
      
  );
}

const SecondDrawer = createDrawerNavigator();
 function AfterLogin({route,navigation}){
  return(
    <SecondDrawer.Navigator>
    <SecondDrawer.Screen name="LogIn" component={LogIn} />
    <SecondDrawer.Screen name="ProjectList" component={ProjectList}/>
    <SecondDrawer.Screen name="ProjectCreation" component={ProjectCreation}/>
    <SecondDrawer.Screen name = "Settings⚙️" component={Settings}/>
    <SecondDrawer.Screen name = "Project" component={Project}/>
    <SecondDrawer.Screen name = "EditTask" component={EditTask}/>
  </SecondDrawer.Navigator>
  

  );

}


function Settings(){
  const [username, changeUsername] = useState(null);
  const [password,changePassword] = useState(null);
  const [prefrence,changePrefrence]=useState(null);

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
    bottom: 10,
    left: 10,
    flexDirection:'row', 
    flexWrap:'wrap',
  },
  AverageWhiteText: {
    color: 'white',
    fontSize: 16,
  },
  AverageWhiteTextBolded: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logInRedFailedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logInRedFailedText: {
    color: 'red',
    fontSize: 16,
  },
});