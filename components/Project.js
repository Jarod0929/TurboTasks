import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Modal,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

import * as styles from './styles/styles.js';
import * as basicStyles from './styles/basicStyles.js';
import * as topBarStyles from './styles/topBarStyles.js';

import database from '@react-native-firebase/database';
import {  useFocusEffect, useIsFocused } from '@react-navigation/native';

const TopBar = (props) => {
  const [drawer, changeDrawer] = useState(false);
  return (
    <View style = {basicStyles.container}>
      <View style = {topBarStyles.topBarContainer}>
        <View style = {topBarStyles.openContainer}>
          <TouchableHighlight
            onPress = {() => {
              changeDrawer(!drawer);
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            }}
            style={topBarStyles.openDrawerButton}
          >
            <Text style = {topBarStyles.textAbove}>Open</Text>
          </TouchableHighlight>
        </View>
      </View>
      <View style = {[topBarStyles.drawerContainer, drawer? undefined: {width: 0}]}>
        <TouchableHighlight 
              onPress={()=> 
                changeDrawer(!drawer)
              } 
              style={topBarStyles.navigationButtons}
            >
              <Text>Close</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress = {()=>{
                props.navigation.goBack();
              }}
              style={topBarStyles.navigationButtons}>
              <Text>
              Go Back
              </Text>
            </TouchableHighlight>
            <TouchableHighlight 
              onPress={()=>
                props.navigation.navigate("ProjectList", {user:props.userInfo})
              } 
              style={topBarStyles.navigationButtons}
            >
              <Text>ProjectList</Text>
            </TouchableHighlight>
            <TouchableHighlight 
              onPress={()=>
                props.navigation.navigate("ProjectCreation", {user:props.userInfo})
              } 
              style={topBarStyles.navigationButtons}
            >
              <Text>ProjectCreation</Text>
            </TouchableHighlight>
            <TouchableHighlight 
              onPress={()=>
                props.navigation.navigate("Settings", {user:props.userInfo})
              } 
              style={topBarStyles.navigationButtons}
            >
              <Text>Settings⚙️</Text>
            </TouchableHighlight>
      </View>
      {props.children}
    </View>
  )
};
  
const TaskPanel = (props) => {
  const [task, changeTask] = useState(null);//all task information from database

  //Populates state variable 
  const handleTask = snapshot => {
    changeTask(snapshot.val());
  }
  useFocusEffect(() => {
    database().ref("/Database/Tasks/" + props.taskID).once("value", handleTask);
  });

  if(task != null){
    return (
      <View style={styles.taskPanel}>
        {/* Task Title and click to open description modal */}
        <TouchableHighlight 
          style={styles.taskPanelLeft}
          onPress = {() =>{
            props.changeTaskDescriptor(task.ID);
          }}
        >
          <Text style={styles.defaultText}>
            {task.title}   
          </Text>
        </TouchableHighlight>

        {/* Righte side of task with edit and subtasks buttons */}
        <View style={{width: '50%'}}>
          {/* Edit Button */}
          <TouchableHighlight 
            style={styles.taskPanelEdit}
            onPress = {() => {
            //CHANGE PROPS.PROJECT => PROPS.TASKID
              props.navigation.navigate("EditTask", {taskID: props.taskID, projectID: props.projectID,user: props.userId});
            }}
          >
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.defaultText, {fontSize: 20}]}>Edit</Text>
            </View>
          </TouchableHighlight>
          {/* Subtasks Button */}
          <TouchableHighlight 
            style={styles.taskPanelSubtasks}
            onPress = {() => {
              //CHANGE PROPS.PROJECT => PROPS.TASKID
              props.navigation.push("Project", {taskID: props.taskID, projectID: props.projectID, user: props.userId});
            }}
          >
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.defaultText, {fontSize: 20}]}>Subtasks</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  } else {
    return(
      // Shows if the task has no information
      <View style={styles.taskPanelEmpty}>
        <Text>nothing</Text>
      </View>
    );
  }
}

const TaskDescriptor = (props) => {
  const[task, changeTask] = useState(null); //all task information from database

  const handleTask = snapshot => {
    changeTask(snapshot.val());
  }
    
  useFocusEffect(() => {
    database().ref("/Database/Tasks/" + props.taskID + "/").once("value", handleTask);
  });
    
  return(
    // Modal that shows the description of task
    <View style={{backgroundColor: "green", width:"100%", height: "100%"}}>
      <Text>Title: {task?.title}</Text>
      <Text>Description: {task?.text}</Text>
    </View>
  );
}

export function Project ({ navigation, route }) { 
  const [allProjectTasks, changeAllProjectTasks] = useState([]); //ID's of all tasks for this project
  const [currentTask, changeCurrentTask] = useState(null); //ID of task being displayed in modal
  const isFocused = navigation.isFocused();//Is true whenever the user is on the screen, but it isn't as efficient as it can be
  const [visibility, changeVisibility] = useState(false); //visibility toggle for modal

  useEffect(() => {
    if(route.params.taskID == null){
      database().ref(`/Database/Projects/${route.params.projectID}`).once('value', snapshot => {
        if(snapshot.val().tasks !== undefined){
          changeAllProjectTasks(snapshot.val().tasks);
        }
      });
    } else {
      database().ref(`/Database/Tasks/${route.params.taskID}`).once('value', snapshot => {
        if(snapshot.val().subTasks !== undefined){
          changeAllProjectTasks(snapshot.val().subTasks);
        }
      });
    }
  }, [isFocused]); //[route.params.taskID, route.params.projectID]);

  //changes decription modal task and visibility to be visible
  function changeTaskDescriptor(taskID){
    changeVisibility(true);
    changeCurrentTask(taskID);
  }

  return (// TopBar is supposed to handle the Drawer and don't forget about it
    <TopBar userInfo={route.params.user} navigation={navigation}>
      {/* Main Container */}
      <View style={styles.projectTaskListConatiner}>
        {/* Modal for showing task information */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={visibility}
        >
          <TouchableHighlight onPress = {() => {
            changeVisibility(false);
          }}
          >
            <View style={styles.projectListModal}>
              <TaskDescriptor taskID = {currentTask} />
            </View>
          </TouchableHighlight>
        </Modal>
        
        <View style = {styles.projectListMainView}>
          {/* Add task button */}
          <TouchableHighlight 
            style={styles.addTaskButton}
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
              });
            }
          }}  
        >
          <Text style={{fontSize: 20}}>Add Task</Text>
        </TouchableHighlight>

        {/* Lists out tasks for this form */}
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
        </View>
      </View>       
    </TopBar> 
  );
}