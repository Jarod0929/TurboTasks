import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  TextInput,
} from 'react-native';

import database from '@react-native-firebase/database';

import * as styles from './styles/styles.js';
import Moment from 'moment';

const TopBar = (props) => {
  return (
    <View style = {styles.container}>
      <View style = {styles.topBarContainer}>
        <TouchableHighlight 
          onPress = {()=>{
            props.navigation.goBack();
          }}
        >
          <View>
            <Text>
            Go Back
            </Text>
          </View>
        </TouchableHighlight>
      </View>
      {props.children}
    </View>
  )
};

export function EditTask ({ navigation, route }){
  const [title, changeTitle] = useState(null); //title of the task
  const [description, changeDescription] = useState(null); // description of the task
  const [date, changeDate] = useState(Moment.locale('en')); //due date of the task
  useEffect(() => {
    database().ref(`/Database/Tasks/${route.params.taskID}`).once('value', snapshot => {
      changeTitle(snapshot.val().title);
      changeDescription(snapshot.val().text);
      if(snapshot.val().due != null && snapshot.val().due != ""){
        changeDate(Date(snapshot.val().due + "T00:00:00.000Z").toISOString());
      }
    });
  }, [route.params.taskID]);


  //deletes delTaskId task and subtasks, and removes it from the project's task list
  const deleteTasks = (delTaskID, projectID) => {
    database().ref("/Database/Tasks/" + delTaskID).once("value", snapshot => {
      if(snapshot.val().subTasks != undefined){
        for(let i = 0; i < snapshot.val().subTasks.length; i++){
          deleteTasks(snapshot.val().subTasks[i], projectID);
        }
      }
      if(snapshot.val().parentTask != 'none'){
        database().ref("/Database/Tasks/" + snapshot.val().parentTask).once("value", snap => {
          const array = snap.val().subTasks.filter(ID => ID != delTaskID);
          database().ref("/Database/Tasks/" + snapshot.val().parentTask).update({
            subTasks: array,
          });
        });
        database().ref("/Database/Tasks/" + delTaskID).remove();
      }
      else{
        database().ref("/Database/Projects/" + projectID).once("value", snap => {
          console.log(snap.val());
          const array = snap.val().tasks.filter(ID => ID != delTaskID);
          database().ref("/Database/Projects/" + projectID).update({
            tasks: array,
          });
          database().ref("/Database/Tasks/" + delTaskID).remove();
        });
      }
    });   
  };
  
  //updates the information of the task in the database
  const handleText = () => {
    database().ref(`/Database/Tasks/${route.params.taskID}`).update({
      title: title,
      text: description,
      // due: date.getTime()
    });
  }

  return(
    <TopBar  
      userInfo={route.params.user} 
      navigation={navigation}
    >
      {/* Editable Options */}
      <View style={styles.editTaskMainView}>
        {/* Edit task title */}
        <Text style={{fontSize: 20}}>
          Task Title:
        </Text>
        <TextInput 
          style={styles.editTaskInputs}
          onChangeText = {text => changeTitle(text)}
          value = {title}
        />
        {/* Edit task description */}
        <Text style={{fontSize: 20}}>
          Task Description:
        </Text>
        <TextInput         
          multiline
          numberOfLines={4}
          style={styles.editTaskInputs}
          onChangeText = {text => changeDescription(text)}
          value = {description}
        />
      </View>
      {/* Save changes button */}
      <TouchableHighlight
        style={[styles.editTaskBottomBar, {right: 0}]}
        onPress = {() => {
          handleText();
          changeTitle(null);
          changeDescription(null);
          changeDate(new Date());
          navigation.navigate('Project');
        }}
      >
        <Text style={styles.editTaskBottomBarButtons}>Save Changes</Text>
      </TouchableHighlight>
      {/* Delete task button */}
      <TouchableHighlight
        style={styles.editTaskBottomBar}
        onPress = {() => {
          deleteTasks(route.params.taskID, route.params.projectID);
          navigation.navigate('Project');
        }}
      >
        <Text style={styles.editTaskBottomBarButtons}>
          Delete Task
        </Text>
      </TouchableHighlight> 
    </TopBar>
  );
}