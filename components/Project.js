import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from 'react-native';

import { TopBar } from './utilityComponents/TopBar.js';

import * as styles from './styles/styles.js';

import database from '@react-native-firebase/database';
import {  useFocusEffect } from '@react-navigation/native';
import Icon from "react-native-vector-icons/AntDesign";
 
export function Project ({ navigation, route }) { 
  const [currentTask, changeCurrentTask] = useState(null); //ID of task being displayed in modal
  const [visibility, changeVisibility] = useState(false); //visibility toggle for modal

  const [allProjectTasks, changeAllProjectTasks] = useState([]); //ID's of all tasks for this project
  const [allTaskObjects, changeTaskObjects] = useState(null);

  const [forceRerender, changeForceRerender] = useState(true);

  let isFocused = navigation.isFocused();//Is true whenever the user is on the screen, but it isn't as efficient as it can be

  useEffect(() => {
    findTasks();
  }, [isFocused, route.params.taskID, route.params.projectID]);

  const findTasks = () => {
    if(noParentTask()){
      findTasksInProjects();
    } else {
      findTasksInTasks();
    }
  };

  const noParentTask = () => {
    return route.params.taskID == null;
  };

  const findTasksInProjects = () => {
    database().ref(`/Database/Projects/${route.params.projectID}`).on('value', snapshot => {
      if(snapshot?.val()?.tasks != undefined){
        changeAllProjectTasks(snapshot?.val()?.tasks);
        getAllTasksObjects(snapshot?.val()?.tasks);
      }
    });
  };

  const findTasksInTasks = () => {
    database().ref(`/Database/Tasks/${route.params.taskID}`).on('value', snapshot => {
      if(snapshot?.val()?.subTasks != undefined){
        changeAllProjectTasks(snapshot?.val()?.subTasks);
        getAllTasksObjects(snapshot?.val()?.subTasks);
      }
    });
  };

  const getAllTasksObjects = tasksList => {
    database().ref("/Database/Tasks").once("value", snapshot => {
      let array = [];
      for(let i = 0; i < tasksList.length; i++){
        let obj = snapshot.val()[tasksList[i]];
        array.push(obj);
      }
      changeTaskObjects(array);
    });
  };

  const addNewTask = () => {
    const newTask = database().ref(`/Database/Tasks`).push();
    const newTaskID = newTask.key;
    let listOfTasks = [];

    if(allProjectTasks != null){
      listOfTasks = allProjectTasks.slice();
    }
    listOfTasks.push(newTaskID);

    if(noParentTask()){
      addNewTaskInProjects(newTask, newTaskID, listOfTasks);
    }
    else{
      addNewTaskInTasks(newTask, newTaskID, listOfTasks);
    }
    changeAllProjectTasks(listOfTasks);
  };

  const addNewTaskInProjects = (newTask, newTaskID, listOfTasks) => {
    database().ref(`/Database/Projects/${route.params.projectID}`).update({
      tasks: listOfTasks
    });
    newTask.set({
      ID: newTaskID,
      title: "Task",
      text: "Description",
      parentTask: route.params.taskID == undefined ? "none" : route.params.taskID,
    });
    addNewTaskToObject(newTaskID);
  };

  const addNewTaskInTasks = (newTask, newTaskID, listOfTasks) => {
    database().ref(`/Database/Tasks/${route.params.taskID}`).update({
      subTasks: listOfTasks,
    });
    newTask.set({
      ID: newTaskID,
      title: "Task",
      text: "Description",
      parentTask: route.params.taskID == undefined ? "none" : route.params.taskID,
    });
    addNewTaskToObject(newTaskID);
  };

  const addNewTaskToObject = newTaskID => {
    let array = [];
    if(allTaskObjects != null){
      array = allTaskObjects.slice();
    }
    let obj = {
      ID: newTaskID,
      title: "Task",
      text: "Description",
      parentTask: route.params.taskID == undefined ? "none" : route.params.taskID,
    };
    array.push(obj);
    changeTaskObjects(array);
  };

  const changeTaskDescriptor = taskID => {
    changeVisibility(true);
    changeCurrentTask(taskID);
  };

  const deleteAllTasks = () => {
    deleteTasks(currentTask);
    changeVisibility(false);
    deleteTaskToObject(currentTask);
    deleteTaskToListID(currentTask);
  };

  const deleteTasks = delTaskID => {
    database().ref("/Database/Tasks/" + delTaskID).once("value", snapshot => {
      //Recursively calls on each of subtasks
      if (snapshot?.val()?.subTasks != undefined){
        let subTasks = snapshot?.val()?.subTasks;
        for(let i = 0; i < subTasks.length; i++){
          deleteShallowTasks(subTasks[i]);
        }
      }
      //Then deletes delTaskID task from database, as well as from its parent's list of subtasks
      if (snapshot.val().parentTask != "none"){
        deleteTaskInTasks(delTaskID, snapshot);
      } else {
        deleteTaskInProjects(delTaskID);
      }
    });    
  };

  const deleteShallowTasks = delTaskID => {
    database().ref("/Database/Tasks/" + delTaskID).once("value", snapshot => {
      if (snapshot?.val()?.subTasks != undefined){
        let subTasks = snapshot?.val()?.subTasks;
        for(let i = 0; i < subTasks.length; i++){
          deleteShallowTasks(subTasks[i]);
        }
      }
      database().ref("/Database/Tasks/"+ delTaskID).remove();
    });
  };

  const deleteTaskInTasks = (delTaskID, snapshot) => {
    database().ref("/Database/Tasks/" + snapshot.val().parentTask).once("value", snap => {
      const array = snap.val().subTasks.filter(ID => ID != delTaskID);
      database().ref("/Database/Tasks/" + snapshot.val().parentTask).update({
        subTasks: array,
      });
      database().ref("/Database/Tasks/" + delTaskID).remove();
    });
  };

  const deleteTaskInProjects = delTaskID => {
    database().ref("/Database/Projects/" + route.params.projectID).once("value", snap => {
      const array = snap.val().tasks.filter(ID => ID != delTaskID);
      database().ref("/Database/Projects/" + route.params.projectID).update({
        tasks: array,
      });
      database().ref("/Database/Tasks/" + delTaskID).remove();
    });
  };

  const deleteTaskToObject = delTaskID => {
    let array = allTaskObjects.filter(obj => obj.ID != delTaskID);
    changeTaskObjects(array);
    changeForceRerender(!forceRerender);
  };

  const deleteTaskToListID = delTaskID => {
    const array = allProjectTasks.filter(ID => ID != delTaskID);
    changeAllProjectTasks(array);
  };

  const updatedTaskObjectTitle = (taskID, newTitle) => {
    let array = allTaskObjects.slice();
    for(let i = 0; i < array.length;i++){
      if(array[i].ID == taskID){
        array[i].title = newTitle;
        changeTaskObjects(array);
        changeForceRerender(!forceRerender);
        return;
      }
    }
  };

  const updatedTaskObjectDescription = (taskID, newDescription) => {
    let array = allTaskObjects.slice();
    for(let i = 0; i < array.length;i++){
      if(array[i].ID == taskID){
        array[i].text = newDescription;
        changeTaskObjects(array);
        changeForceRerender(!forceRerender);
        return;
      }
    }
  };

  return (
    <TopBar 
      navigation = { navigation }
      userInfo = { route.params.user }
      listNavigation = {[ "ProjectList", "ProjectCreation", "Settings" ]}
    >
      <Text style = {styles.topBarTitle}>{route.params.projectTitle}</Text>
      {/* Main Container */}
      <View style = { styles.projectTaskListConatiner }>
        {/* Modal for showing task information */}
        <TaskModal
          currentTask = { currentTask }
          currentProj = { route.params.projectID }
          visibility = { visibility }
          changeVisibility = { changeVisibility }
          deleteAllTasks = { deleteAllTasks }
          updatedTaskObjectTitle = { updatedTaskObjectTitle }
          updatedTaskObjectDescription = { updatedTaskObjectDescription } 
        />
        <View style = { styles.projectListMainView }>
          {/* Add task button */}
          <AddTaskButton
            onClick = { addNewTask }
            text = "Add Task"  
          />
          <TaskList
            user = { route.params.user }
            navigation = { navigation }
            projectID = { route.params.projectID }
            changeTaskDescriptor = { changeTaskDescriptor }
            allProjectTasks = { allProjectTasks }
            changeAllProjectTasks = { changeAllProjectTasks }
            allTaskObjects ={ allTaskObjects }
            projectTitle = { route.params.projectTitle }
            forceRerender = { forceRerender }
          />        
        </View>
      </View>       
    </TopBar> 
  );
}

const TaskList = props =>{
  return(
    <View>
    <FlatList
    style = { { width: "75%" } }
    data = { props.allTaskObjects }
    extraData = { props.forceRerender }
    renderItem = { ({item}) => 
    <React.StrictMode>
      <TaskPanel
        taskID = { item.ID }
        title = { item.title }
        navigation = { props.navigation }
        projectID = { props.projectID }
        userId = { props.user }
        changeTaskDescriptor = { props.changeTaskDescriptor }
        changeAllProjectTasks = { props.changeAllProjectTasks }
        projectTitle = { props.projectTitle }
      />
    </React.StrictMode>
    }
    keyExtractor = { item => item.ID }
  />
    { (props.allProjectTasks == null) &&
      <Text>No Tasks</Text>
    }
  </View>
  );
}

const TaskPanel = props => {

  const goToSubTask = () => {
    props.navigation.push("Project", {
      taskID: props.taskID, 
      projectID: props.projectID, 
      user: props.userId,
      projectTitle: props.projectTitle
    });
  };

  return (
    <View style = { styles.taskPanel }>
      {/* Task Title and click to open description modal */}
      <View 
        style = { styles.taskPanelLeft }
      >
        <Text style = { styles.defaultText }>
          { props.title }   
        </Text>
      </View>
      {/* Right side of task with edit and subtasks buttons */}
      <View style = { { width: '50%' } }>
        {/* Edit Button */}
        <TouchableHighlight 
          style = { styles.taskPanelEdit }
          onPress = { () => {
            props.changeTaskDescriptor(props.taskID);
          }}
        >
          <View style = { { alignItems: 'center' } }>
            <Text style = { [styles.defaultText, { fontSize: 20 }] }>Edit</Text>
          </View>
        </TouchableHighlight>
        {/* Subtasks Button */}
        <TouchableHighlight 
          style = { styles.taskPanelSubtasks }
          onPress = { goToSubTask }
        >
          <View style = { { alignItems: 'center' } }>
            <Text style = { [styles.defaultText, { fontSize: 20 }] }>Subtasks</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const AddTaskButton= props => {
  return(
    <TouchableHighlight 
      style = { styles.addTaskButton }
      onPress = { props.onClick }
    >
      <Text>
        { props.text }
      </Text>
    </TouchableHighlight>
  );
}

//props.currentTask
const TaskModal = props => {
  const [title, changeTitle] = useState("");
  const [description, changeDescription] = useState("");
 
  useEffect(() => {
    database().ref(`/Database/Tasks/${props.currentTask}`).once("value", updateTaskInfo);
  }, [props.currentTask]);

  const updateTaskInfo = snapshot => {
    changeTitle(snapshot.val().title);
    changeDescription(snapshot.val().text);
  }

  const isTitle = () => {
    if (title != ""){
      database().ref("/Database/Tasks/" + props.currentTask).update({
        title: title
      });
      props.updatedTaskObjectTitle(props.currentTask, title);
    }
  }

  const isDescription = () => {
    if (description != ""){
      database().ref("/Database/Tasks/" + props.currentTask).update({
        text: description
      });
      props.updatedTaskObjectDescription(props.currentTask, description);
    }
  }

  return (
    <Modal 
      animationType = "slide"
      transparent = { true }
      visible = { props.visibility }
    > 
        <KeyboardAvoidingView 
          style = { styles.projectListModal }
          behavior = "padding"
          keyboardVerticalOffset = {
            Platform.select({
              android: () => -1200
            })()
          }
        >
          <ScrollView
            style = {{ width: "100%"}}
            contentContainerStyle = {{ alignItems: "center" }}
          >
              <CloseButton
                changeVisibility = {props.changeVisibility}
              />
              <TitleDescriptionDelete
                title = { title }
                description = { description }
              />
              <ProjectTitleEdit
                changeTitle = { changeTitle }
                title = { title }
                isTitle = { isTitle }
              />
              <ProjectDescriptionEdit
                changeDescription = { changeDescription }
                description = { description }
                isDescription = { isDescription }
              />
              <DeleteProjectButton
                deleteButtonText = { "Delete Tasks" }
                deleteProjectFunction = { props.deleteAllTasks }
              />
              <SaveOrCancelButtons
                isTitle = {isTitle}
                isDescription = {isDescription}
                changeVisibility = {props.changeVisibility}
              />
          </ScrollView>
        </KeyboardAvoidingView>  
    </Modal>
  );
}

const TitleDescriptionDelete = props => {
  return (
    <View style = {styles.titleView}>
      <Text
        style = {styles.titleText}
      >
        { props.title } Details
      </Text>
    </View>
  );
}

const ProjectTitleEdit = props => {
  return (
    <View style = { styles.fullWidth }>
      <Text
        style = {styles.inputHeader}
      >
        Edit Task Title
      </Text>
      <TextInput
        autoFocus = { true }
        style = { styles.editTitleTextInput }
        placeholder = "Title"
        onChangeText = {text => props.changeInvUsers(text)}
        value = { props.title }
        onChangeText = { props.changeTitle }
        maxLength = { 30 }
      />
      <Text style = {styles.titleCharCount}>
        {props.title.length}/30
      </Text>
      {props.title.length < 30 &&
        <Icon
          style = {styles.titleCheckIcon}
          name = "check" 
          size = { 30 }
          color = "green" 
        />
      }
      {props.title.length == 30 &&
        <Icon
          style = {styles.titleXIcon}
          name = "close" 
          size = { 30 }
          color = "red" 
        />
      }
    </View>
  );
}

const ProjectDescriptionEdit = props => {
  return (
    <View
      style = { styles.centerChildren, styles.fullWidth }
    >
      <DescriptionTextInputBox
        text = "Edit Description"
        style = { styles.editProjectDescriptionInputs }
        onChangeText = { props.changeDescription }
        value = { props.description }
      />
      <Text style = {styles.descriptionCharCount}>
        {props.description.length}/140
      </Text>
    </View>
  );
}

const DeleteProjectButton = props => {
  return(
    <View
      style = { styles.deleteProjectButton }
    >
      <TouchableHighlight 
        onPress = {() => {
          props.deleteProjectFunction()
        }}
      >
        <Text
          style = { styles.centerSelf }
        >
          { props.deleteButtonText }
        </Text>
      </TouchableHighlight>
    </View>
  );
}

const DescriptionTextInputBox = props => {
  return (
    <View style = { styles.fullWidth }>
      <Text 
        style = {styles.descriptionHeader} 
      >
        { props.text }
      </Text>
      <TextInput
        multiline
        numberOfLines = { 4 }
        maxLength = { 140 }
        onChangeText = { text => props.onChangeText(text) }
        placeholder = { props.text }
        blurOnSubmit = { true }
        value = { props.value }
        style = { props.style }
      /> 
    </View>
  );
};
const CloseButton = props => {
  return(
    <TouchableHighlight
      style = {styles.closeIcon}
      onPress = {() => {
          props.changeVisibility(false);
      }}
    >
      <Icon
        name = "close"
        size = { 25 }
      />
    </TouchableHighlight>
  );
}
const SaveOrCancelButtons = props => {
  return(
    <View style = {styles.saveOrCancelView}>
        <TouchableHighlight
          style = {styles.saveButton}
          onPress = {() => {
            props.isTitle();
            props.isDescription();
          }}
        >
          <Text style = {styles.saveButtonText}>Save</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style = {styles.cancelButton}
          onPress = {props.changeVisibility}
        >
          <Text style = {styles.cancelButtonText}>Cancel</Text>
        </TouchableHighlight>
    </View>
  );
}