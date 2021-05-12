import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  TextInput,
} from 'react-native';

import { TopBar } from './utilityComponents/TopBar.js';
import { ButtonBox } from './utilityComponents/ButtonBox.js';

import database from '@react-native-firebase/database';

import * as styles from './styles/styles.js';
import * as basicStyles from './styles/basicStyles.js';

export function EditTask ({ navigation, route }){
  const [title, changeTitle] = useState(null); //title of the task
  const [description, changeDescription] = useState(null); // description of the task
  
  useEffect(() => {
    database().ref(`/Database/Tasks/${route.params.taskID}`).once('value', snapshot => {
      changeTitle(snapshot.val().title);
      changeDescription(snapshot.val().text);
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
          route.params.changeAllProjectTasks(array);
          database().ref("/Database/Tasks/" + snapshot.val().parentTask).update({
            subTasks: array,
          });
        });
        database().ref("/Database/Tasks/" + delTaskID).remove();
      }else{
        database().ref("/Database/Projects/" + projectID).once("value", snap => {
          const array = snap.val().tasks.filter(ID => ID != delTaskID);
          route.params.changeAllProjectTasks(array);
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
    database().ref(`/Database/Tasks/${ route.params.taskID }`).update({
      title: title,
      text: description,
    });
  }

  const saveChanges = () => {
    handleText();
    changeTitle(null);
    changeDescription(null);
    navigation.navigate('Project');
  }

  const deleteThisTask = () => {
    deleteTasks(route.params.taskID, route.params.projectID);
    navigation.navigate('Project');
  }

  return(
    <TopBar  
      navigation = { navigation }
      userInfo = { route.params.user }
      listNavigation = { null }
    >
      {/* Editable Options */}
      <View style = { styles.editTaskMainView }>
        <TitleTextInputBox
          text = "Task Title"
          style = { styles.editTaskInputs }
          onChangeText = { changeTitle }
          value = { title }
        />
        <DescriptionTextInputBox
          text = "Task Description"
          style = { styles.editTaskInputs }
          onChangeText = { changeDescription }
          value = { description }
        />
      </View>
      <ButtonBox
        onClick = { saveChanges }
        text = "Save Changes"
        containerStyle = { null }
        buttonStyle = {[ styles.editTaskBottomBar, { right: 0 }]}
        textStyle = { styles.editTaskBottomBarButtons }
      />
      <ButtonBox
        onClick = { deleteThisTask }
        text = "Delete Task"
        containerStyle = { null }
        buttonStyle = { styles.editTaskBottomBar }
        textStyle = { styles.editTaskBottomBarButtons }
      />
    </TopBar>
  );
}

const TitleTextInputBox = props => {
  return (
    <View style = { styles.editTaskTitleInput }>
      <Text style = { basicStyles.defaultText }>{ props.text }</Text>
      <TextInput
        onChangeText = {text => props.onChangeText(text)}
        placeholder = { props.text }
        value = { props.value }
        style = { props.style }
      />
    </View>
  );
};


const DescriptionTextInputBox = props => {
  return (
    <View style = { styles.editTaskTitleInput }>
      <Text style = { basicStyles.defaultText }>{ props.text }</Text>
      <TextInput
        multiline
        numberOfLines = { 4 }
        onChangeText = {text => props.onChangeText(text)}
        placeholder = { props.text }
        value = { props.value }
        style = { props.style }
      />
    </View>
  );
};


