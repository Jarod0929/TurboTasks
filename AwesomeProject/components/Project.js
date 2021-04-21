import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Modal,
} from 'react-native';
import * as styles from './styles.js';

import database from '@react-native-firebase/database';
import { NavigationContainer, useFocusEffect, useIsFocused } from '@react-navigation/native';

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
          <TouchableHighlight onPress={()=>props.navigation.navigate("Settings",{user:props.userInfo})} style={styles.navigationButtons}><Text>Settings⚙️</Text></TouchableHighlight>
  
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
        <TouchableHighlight style={{ padding: '5%', width: "50%", backgroundColor: 'cyan', color: 'black'}}onPress = {() =>{
          props.changeTaskDescriptor(task.ID);
        }}>
          <Text style={{color: 'black', fontSize: 20}}>
            {task.title}   
          </Text>
        </TouchableHighlight>
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
  const TaskDescriptor = (props) => {
    const [task, changeTask] = useState(null);

    const handleTask = snapshot => {
      changeTask(snapshot.val());
    }
  
    useFocusEffect(() => {
      database().ref("/Database/Tasks/" + props.taskID + "/").once("value", handleTask);
    });
    return(
      <View style={{backgroundColor: "green", width:"100%", height: "100%"}}>
        <Text>Title: {task?.title}</Text>
        <Text>Description: {task?.text}</Text>
      </View>
      
    );
  }
export function Project ({ navigation, route }) { 
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
    const [visibility, changeVisibility] = useState(false);
    const [currentTask, changeCurrentTask] = useState(null);
    const isFocused = navigation.isFocused();//Is true whenever the user is on the screen, but it isn't as efficient as it can be
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
  
     function changeTaskDescriptor(taskID){
      changeVisibility(true);
      changeCurrentTask(taskID);
      
     }
    return (// TopBar is supposed to handle the Drawer and don't forget about it
    <TopBar  userInfo={route.params.user} navigation={navigation}>
      <Drawer userInfo={route.params.user} navigation={navigation}></Drawer>

    <View style={{ top: 0, height: "100%", width: "100%", backgroundColor: "white"}}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visibility}
              >
              <TouchableHighlight onPress = {() => {
                changeVisibility(false);
              }}>
                <View style={{height: "80%", width: "80%", margin:"10%"}}>
                  <TaskDescriptor taskID = {currentTask}>
                  </TaskDescriptor>
                </View>
              </TouchableHighlight>
            </Modal>
      
      <View style = {{flex: 1, alignItems: "center", justifyContent: "center"}}>
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
                      changeTaskDescriptor = {changeTaskDescriptor}
                    />
                  </React.StrictMode>
                  }
          keyExtractor={item => item}
        />
      {(allProjectTasks == null) &&
        <Text>No Tasks</Text>
      }
      {/* {visibility&&
        <TouchableHighlight onPress = {() => {
          changeVisibility(false);
        }}>
          <View style={{backgroundColor: "yellow", height: "100%", width: "100%"}}>
            <TaskDescriptor taskID = {currentTask}>
            </TaskDescriptor>
          </View>
        </TouchableHighlight>
      } */}
      </View>
    </View>       
    </TopBar> 
    );
  }