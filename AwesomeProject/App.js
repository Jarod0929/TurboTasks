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
import { NavigationContainer } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import DatePicker from 'react-native-date-picker'
import { add } from 'react-native-reanimated';

import {LogIn} from './components/LogIn.js';
import {CreateAccount} from './components/CreateAccount.js';
import {ProjectList} from './components/ProjectList.js';
import {ProjectCreation} from './components/ProjectCreation.js';
import * as styles from './components/styles.js';

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
  if(task == null) {
    //CHANGE PROPS.PROJECT => PROPS.TASKID
    database().ref("/Database/Tasks/" + props.taskID).once("value", handleTask);
  }
  if(task != null){
   return (
     //COME BACK
     <View>
     <TouchableHighlight onPress = {() => {
       //CHANGE PROPS.PROJECT => PROPS.TASKID
       props.navigation.navigate("EditTask", {taskID: props.taskID, projectID: props.projectID,user: props.userId});
     }}>
      <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}>
        <Text style={{fontSize: 20}}>
           {task.text}
        </Text>
        <Text style={{fontSize: 20}}>
          Go to Edit Task
        </Text>
      </View>
      </TouchableHighlight>
      <TouchableHighlight onPress = {() => {
        //CHANGE PROPS.PROJECT => PROPS.TASKID
       props.navigation.push("Project", {taskID: props.taskID, projectID: props.projectID, user: props.userId});
     }}>
      <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "blue", alignItems: 'center'}}>
        <Text style={{fontSize: 20}}>
           {task.text}
        </Text>
        <Text style={{fontSize: 20}}>
          Go To Subtasks
        </Text>
      </View>
      </TouchableHighlight>
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

// const SubTaskPanel = (props) => {
  
//   const [task, changeTask] = useState(null);

//   const handleTask = snapshot => {
//     changeTask(snapshot.val());
//   }
//   if(task == null) {
//     database().ref("/Database/Tasks/" + props.project).once("value", handleTask);
//   }
//   if(task != null){
    
//    return (
     
//     <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}>

//       <Text style={{fontSize: 20}}>
//            {task.text}
//       </Text>
//     </View>
      
//     );
//   }
//   else{
//     return(
//     <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}>
//         <Text style={{fontSize: 20}}>
//            No Current Tasks
//         </Text>
//     </View>
//     );
//   }
// }
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
  },[route.params.taskID, route.params.projectID]);


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
            text: "Task",
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
            text: "Task",
            parentTask: "none",
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
  
  const [newText, changeText] = useState(null);
  const [subTask,changeSubTask]=useState(null);
  const [flashlight, changeFlashlight] = useState(false); //not needed

  useEffect(() => {
    database().ref(`/Database/Tasks/${route.params.taskID}`).once('value', snapshot => {
      changeText(snapshot.val().text);
    });
    let something = database().ref("/Database/Tasks").orderByChild("parentTask").equalTo(route.params.taskID).on("value", snapshot => {
      let list = [];
        
      for(let key in snapshot.val()){
    
        // takes the keyID of the subtask
        list.push(key);
      }
      changeSubTask(list);
      database().ref("/Database/Tasks").orderByChild("parentTask").equalTo(route.params.taskID).off("value", something);
    });
  }, [route.params.taskID]);
  /*
  if(newText == null){
    database().ref(`/Database/Tasks/${route.params.taskID}`).once('value', snapshot => {
      changeText(snapshot.val().text);
    });
  }
  */
  
  const handleText = () => {
    database().ref(`/Database/Tasks/${route.params.taskID}`).update({
      text: newText
    });
  }
  if(subTask==null){
    return(
      <TopBar>
      <TextInput 
        onChangeText = {text => changeText(text)}
        value = {newText}
      />
      <TouchableHighlight
        onPress = {() => {
          handleText();
          changeSubTask(null);
          changeText(null);

          navigation.navigate('Project');
        }}
      >
        <Text>Save Changes?</Text>
      </TouchableHighlight>
      <TouchableHighlight  
      onPress = {() => {
          const newSubTask = database().ref(`/Database/Tasks`).push();
          const newSubTaskID = newSubTask.key;
          let newArray =[];
          newArray.push(newSubTaskID);
          changeSubTask(newArray);//This updates the list
          //changeFlashlight(!flashlight);

          // database().ref(`/Database/Projects/${route.params.project}`).update({
          //   tasks: newArray
          // });

          newSubTask.set({
            ID: newSubTaskID,
            text: "SubTask",
            parentTask: route.params.taskID,
            projectID: route.params.projectID,
            //order: 1,
            //subTaskArray: [],
          });
      }}><Text>Add Sub Task</Text>
      </TouchableHighlight>
      </TopBar>
    );
  }else{  // if flat list and subTask are not null
      return (
        <TopBar userInfo={route.params.user} navigation={navigation}>
          <Drawer userInfo={route.params.user} navigation={navigation}></Drawer>
          <TextInput 
            onChangeText = {text => changeText(text)}
            value = {newText}
          />
          <TouchableHighlight
            onPress = {() => {
              handleText();
              navigation.navigate('Project');
              changeSubTask(null);
              changeText(null);
              
            }}
          >
            <Text>Save Changes?</Text>
          </TouchableHighlight>
          <TouchableHighlight  
          onPress = {() => {
              const newSubTask = database().ref(`/Database/Tasks`).push();
              const newSubTaskID = newSubTask.key;
              let newArray = subTask.slice();
              newArray.push(newSubTaskID);
              changeSubTask(newArray);

              // database().ref(`/Database/Projects/${route.params.project}`).update({
              //   tasks: newArray
              // });

              newSubTask.set({
                ID: newSubTaskID,
                text: "SubTask",
                parentTask: route.params.taskID,
                projectID: route.params.projectID,
                //order: 1,
                //subTaskArray: [],
              });
          }}><Text>Add Sub Task</Text>
          </TouchableHighlight>
          <FlatList
            data={subTask}
            renderItem={({item})=>(
              <SubTaskPanel 
              project = {item}
              navigation = {navigation}
              projectID ={route.params.projectID} />


            )}
            keyExtractor={item=>item}
          />
        </TopBar>
      
  

  );}
}


function SubTaskPage({route, navigation}){
  const[text,changeText]=useState(null);
  

  return(
    <TopBar>
      <View>
        <Text>{text}</Text>
      </View>
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
