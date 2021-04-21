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
import * as styles from './components/styles.js';
import Moment from 'moment';

//let GLOBALUSERID;
 

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
        <TouchableHighlight onPress={()=>props.navigation.navigate("ProjectList",{user:props.userInfo})} style={styles.navigationButtons}><Text>ProjectList</Text></TouchableHighlight>
        <TouchableHighlight onPress={()=>props.navigation.navigate("ProjectCreation",{user:props.userInfo})} style={styles.navigationButtons}><Text>ProjectCreation</Text></TouchableHighlight>
        

      </View>
      }
    </View>
  
  );
}
const TopBar = (props) => {
  return (
    <View style = {styles.container}>
      <View style = {styles.topBarContainer}>
        <TouchableHighlight onPress = {()=>{
          props.navigation.goBack();
        }}>
          <View>
            <Text>
             GO BACK 
            </Text>
          </View>
        </TouchableHighlight>
      </View>
      {props.children}
    </View>
  )
};

//let allProjectTasks = []; //We use this because Flat list doesn't allow for good dynamic changes. Maybe should be unique IDs
const TaskPanel = (props) => {
  const [task, changeTask] = useState(null);

  const handleTask = snapshot => {
    changeTask(snapshot.val());
  }

  useFocusEffect(() => {
    database().ref("/Database/Tasks/" + props.taskID).once("value", handleTask);
  });

  if(task != null){
   return (
     //COME BACK
    <View style={{width: '100%', flexDirection: "row", marginBottom: "2%"}}>
      <Text style={{fontSize: 20, padding: '5%', width: "50%", backgroundColor: 'cyan', color: 'black'}}>
        {task.title}
        
      </Text>
      <View style={{width: '50%'}}>
        <TouchableHighlight 
          style={{width: "100%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}
          onPress = {() => {
            //CHANGE PROPS.PROJECT => PROPS.TASKID
            props.navigation.navigate("EditTask", {taskID: props.taskID, projectID: props.projectID,user: props.userId});
          }}
        >
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 20}}>
              Edit
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight 
          style={{width: "100%", padding: "5%", backgroundColor: "orange", alignItems: 'center',}}
          onPress = {() => {
            //CHANGE PROPS.PROJECT => PROPS.TASKID
          props.navigation.push("Project", {taskID: props.taskID, projectID: props.projectID, user: props.userId});
          }}
        >
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 20}}>
              Subtasks
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
    );
  }else{
    return(
      
    <View style={{margin: "5%", width: "90%", height: "0%"}}>
    <Text>nothing</Text>
    </View>
    
    );
  }
}

function Project ({ navigation, route }) { 
  //Insert the Project Code here
  //const Tasks = database().ref("/Database/Tasks").push(); //First Account and is structure of how it should look
  //Tasks.set({ 
    // ID: newTaskID,
    // title: "Task",
    // text: "Description",
    // due: "",
    // status: "INCOMPLETE",
    // parentTask: "",
    // order: 1,
    // subTasks: [],
  //});
  //const [flashlight, changeFlashLight] = useState(false); If needed Flashlight for dark areas
  const [allProjectTasks, changeAllProjectTasks] = useState([]);
  const isFocused = navigation.isFocused();

  useEffect(() => {
    if(route.params.taskID == null){
      database().ref(`/Database/Projects/${route.params.projectID}`).once('value', snapshot => {
        if(snapshot.val().tasks !== undefined){
          changeAllProjectTasks(snapshot.val().tasks);
        }
      });
    }
    else{
      database().ref(`/Database/Tasks/${route.params.taskID}`).once('value', snapshot => {
        if(snapshot.val().subTasks !== undefined){
          changeAllProjectTasks(snapshot.val().subTasks);
        }
      });
    }
   }, [isFocused]); //[route.params.taskID, route.params.projectID]);


  return (// TopBar is supposed to handle the Drawer and don't forget about it
  <TopBar  userInfo={route.params.user} navigation={navigation}>
    <Drawer userInfo={route.params.user} navigation={navigation}></Drawer>
  <View style={{ top: "0%", height: "85%", backgroundColor: "white", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <TouchableHighlight 
      onPress = {() => {
        const newTask = database().ref(`/Database/Tasks`).push();
        const newTaskID = newTask.key;
        let newArray = [];
        if(allProjectTasks != null){
          newArray = allProjectTasks.slice();
        }
        newArray.push(newTaskID);
        changeAllProjectTasks(newArray);
        if(route.params.taskID == null){
          database().ref(`/Database/Projects/${route.params.projectID}`).update({
            tasks: newArray
          });
          newTask.set({
            ID: newTaskID,
            title: "Task",
            text: "Description",
            
            status: "INCOMPLETE",
            parentTask: "none",
            //order: 1,
            //subTasks: [],
          });
        }
        else{
          database().ref(`/Database/Tasks/${route.params.taskID}`).update({
            subTasks: newArray,
          });
          newTask.set({
            ID: newTaskID,
            title: "Task",
            text: "Description",

            status: "INCOMPLETE",
            parentTask: route.params.taskID,
            //order: 1,
            //subTasks: [],
          });
        }
      }}  
    >
      <Text>Add Task</Text>
    </TouchableHighlight>
    
      <FlatList
        style = {{width: "75%"}}
        data={allProjectTasks}
        renderItem={({item}) => 
                <React.StrictMode>
                  <TaskPanel
                    taskID = {item}
                    navigation = {navigation}
                    projectID ={route.params.projectID}
                    userId={route.params.user}
                    
                  />
                </React.StrictMode>
                }
        keyExtractor={item => item}
      />
    {(allProjectTasks == null) &&
      <Text>No Tasks</Text>
    }
  </View>     
  </TopBar> 
  );
}

//TO DO ADD UPDATE FUNCTIONALITY TO THE TASK NAMES
function EditTask ({ navigation, route }){
  
  const [title, changeTitle] = useState(null);
  const [text, changeText] = useState(null);
  const [date, changeDate] = useState(Moment.locale('en'));
  console.log(date);
  useEffect(() => {
    database().ref(`/Database/Tasks/${route.params.taskID}`).once('value', snapshot => {
      changeTitle(snapshot.val().title);
      changeText(snapshot.val().text);
      if(snapshot.val().due != null && snapshot.val().due != ""){
        console.log('Due');
        console.log(snapshot.val().due);

        changeDate(Date(snapshot.val().due + "T00:00:00.000Z").toISOString());
      }
    });
  }, [route.params.taskID]);

  
  const handleText = () => {
    //Sets proper month
    // let month = date.getMonth() + 1;
    // if(month < 10){
    //   month = "0" + month;
    // }
    database().ref(`/Database/Tasks/${route.params.taskID}`).update({
      title: title,
      text: text,
      // due: date.getTime()
    });
  }
    return(
      <TopBar  userInfo={route.params.user} navigation={navigation}>
        <View style={{padding: 5, backgroundColor: 'white', height: '90%', alignItems: 'center'}}>
          <Text style={{fontSize: 20}}>Task Title:</Text>
          <TextInput 
            style={{width: '75%', borderWidth: 2, borderColor: 'blue', borderRadius: 4}}
            onChangeText = {text => changeTitle(text)}
            value = {title}
          />

          <Text style={{fontSize: 20}}>Task Description:</Text>
          <TextInput         
            multiline
            numberOfLines={4}
            style={{width: '75%', borderWidth: 2, borderColor: 'blue', borderRadius: 4}}
            onChangeText = {text => changeText(text)}
            value = {text}
          />
{/* 
          <Text style={{fontSize: 20}}>Due Date:</Text>
          <DatePicker
            date = {date} 
            mode = "date"
            onDateChange={changeDate}
          /> */}
        </View>
        <TouchableHighlight
          style={{width: '100%', height: '10%', backgroundColor: 'cyan',
                  position: 'absolute', bottom: 0, alignItems: 'center'}}
            onPress = {() => {
              handleText();
              changeTitle(null);
              changeText(null);
              changeDate(new Date());
              navigation.navigate('Project');
            }}
          >
            <Text style={{fontSize: 30}}>Save Changes</Text>
          </TouchableHighlight>
      </TopBar>
    );

}

const RootScreen = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <RootScreen.Navigator initialRouteName="LogIn" screenOptions = {{ headerShown: false}}>
        <RootScreen.Screen name="Main" component={AfterLogin} options={{
                drawerLabel: () => null,
                title: null,
                drawerIcon: () => null }} />
        <RootScreen.Screen name="LogIn" component={LogIn}/>
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
    <SecondDrawer.Screen name = "Settings⚙️" component={Settings}/>
    <SecondDrawer.Screen name = "Project" component={Project}/>
    <SecondDrawer.Screen name = "EditTask" component={EditTask}/>
  </SecondDrawer.Navigator>
  

  );

}

//Hmmmmmmmmmmmmmmmmmm TODO: Will be button click 

function Settings({route, navigation}){
  const [username, changeUsername] = useState(null);
  const [password,changePassword] = useState(null);
  const [prefrence,changePrefrence]=useState(null);

  const handleUser = snapshot => {
    changeUsername(snapshot.val().Username);
    
    changePassword(snapshot.val().Password);
    
    
  }

  if(username == null){
    //database().ref("/Database/Users/" + GLOBALUSERID).once("value", handleUser);
    database().ref("/Database/Users/" + route.params.user).once("value", handleUser);
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
