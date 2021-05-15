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
  const [allProjectTasks, changeAllProjectTasks] = useState([]); //ID's of all tasks for this project
  const [currentTask, changeCurrentTask] = useState(null); //ID of task being displayed in modal
  const isFocused = navigation.isFocused();//Is true whenever the user is on the screen, but it isn't as efficient as it can be
  const [visibility, changeVisibility] = useState(false); //visibility toggle for modal

  useEffect(() => {
    findTasks();
  }, [isFocused]);

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
    database().ref(`/Database/Projects/${route.params.projectID}`).once('value', snapshot => {
      if(snapshot.val().tasks !== undefined){
        changeAllProjectTasks(snapshot.val().tasks);
      }
    });
  };

  const findTasksInTasks = () => {
    database().ref(`/Database/Tasks/${route.params.taskID}`).once('value', snapshot => {
      if(snapshot.val().subTasks !== undefined){
        changeAllProjectTasks(snapshot.val().subTasks);
      }
    });
  };

  const changeTaskDescriptor = taskID => {
    changeVisibility(true);
    changeCurrentTask(taskID);
  }

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
  }

  const addNewTaskInProjects = (newTask, newTaskID, listOfTasks) => {
    database().ref(`/Database/Projects/${route.params.projectID}`).update({
      tasks: listOfTasks
    });
    newTask.set({
      ID: newTaskID,
      title: "Task",
      text: "Description",
      status: "INCOMPLETE",
      parentTask: "none",
    });
  };

  const addNewTaskInTasks = (newTask, newTaskID, listOfTasks) => {
    database().ref(`/Database/Tasks/${route.params.taskID}`).update({
      subTasks: listOfTasks,
    });
    newTask.set({
      ID: newTaskID,
      title: "Task",
      text: "Description",
      status: "INCOMPLETE",
      parentTask: route.params.taskID,
    });
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
        {/* <FullModal
          visibility = { visibility }
          onClick = {() => {
            changeVisibility(false);
          }}
          currentTask = { currentTask }
        /> */}
        <TaskModal
          currentTask = { currentTask }
          currentProj = { route.params.projectID }
          visibility = { visibility }
          changeVisibility = { changeVisibility }
          changeAllProjectTasks = { changeAllProjectTasks }
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
          />        
        </View>
      </View>       
    </TopBar> 
  );
}

const TaskPanel = (props) => {
  const [task, changeTask] = useState(null);//all task information from database

  useFocusEffect(() => {
    database().ref("/Database/Tasks/" + props.taskID).once("value", handleTask);
  });

  const handleTask = snapshot => {
    changeTask(snapshot.val());
  };

  const goToEditTask = () => {
    props.navigation.navigate("EditTask", {
      taskID: props.taskID, 
      projectID: props.projectID,
      user: props.userId, 
      changeAllProjectTasks: props.changeAllProjectTasks
    });
  };
  
  const goToSubTask = () => {
    props.navigation.push("Project", {
      taskID: props.taskID, 
      projectID: props.projectID, 
      user: props.userId,
      projectTitle: props.projectTitle
    });
  };

  const noTasks = () => {
    return task != null;
  }

  if(noTasks()){
    return (
      <View style = { styles.taskPanel }>
        {/* Task Title and click to open description modal */}
        <TouchableHighlight 
          style = { styles.taskPanelLeft }
          onPress = {() =>{
            props.changeTaskDescriptor(task.ID);
          }}
        >
          <Text style = { styles.defaultText }>
            { task.title }   
          </Text>
        </TouchableHighlight>
        {/* Right side of task with edit and subtasks buttons */}
        <View style = { { width: '50%' } }>
          {/* Edit Button */}
          <TouchableHighlight 
            style = { styles.taskPanelEdit }
            onPress = { goToEditTask }
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
  } else {
    return(
      <View style = { styles.taskPanelEmpty }>
        <Text>nothing</Text>
      </View>
    );
  }
}

const TaskDescriptor = props => {
  const[task, changeTask] = useState(null);

  useFocusEffect(() => {
    database().ref("/Database/Tasks/" + props.taskID + "/").once("value", handleTask);
  });

  const handleTask = snapshot => {
    changeTask(snapshot.val());
  }
    
  return(
    <View style = { styles.taskModal }>
      <Text
        style = {[ styles.centerSelf, styles.headerText ]}
      >
        { task?.title }
      </Text>
      <Text
        style = { styles.centerSelf }
      >
        { task?.text }
      </Text>
    </View>
  );
}

const FullModal = props => {
  return(
    <View>
      <Modal
        animationType = "slide"
        transparent = {true}
        visible = { props.visibility }
      >
        <TouchableHighlight onPress = { props.onClick }
        >
          <View style = { styles.projectModal }>
            <TaskDescriptor taskID = { props.currentTask } />
          </View>
        </TouchableHighlight>
      </Modal>

    </View>
  );
};

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
  )
}

const TaskList = props =>{
  return(
    <View>
    <FlatList
    style = { { width: "75%" } }
    data = { props.allProjectTasks }
    renderItem = { ({item}) => 
    <React.StrictMode>
      <TaskPanel
        taskID = { item }
        navigation = { props.navigation }
        projectID = { props.projectID }
        userId = { props.user }
        changeTaskDescriptor = { props.changeTaskDescriptor }
        changeAllProjectTasks = { props.changeAllProjectTasks }
      />
    </React.StrictMode>
    }
    keyExtractor = { item => item }
  />
    { (props.allProjectTasks == null) &&
      <Text>No Tasks</Text>
    }
  </View>
  );
}

//props.currentTask
const TaskModal = props => {
  const [title, changeTitle] = useState("");
  const [description, changeDescription] = useState("hello");
 
  useEffect(() => {
    database().ref(`/Database/Tasks/${props.currentTask}`).once("value", updateTaskInfo);
  }, [props.currentTask]);

  const updateTaskInfo = snapshot => {
    changeTitle(snapshot.val().title);
    changeDescription(snapshot.val().text);
  }

  const deleteAllTasks = () => {
    deleteTasks(props.currentTask);
    props.changeVisibility(false);
  };

  /** 
  * Deletes deltaskID and its subtasks for the current project
  * @param delTaskID is string representing id of task to delete along with its subtasks
  */
  const deleteTasks = delTaskID => {
    database().ref("/Database/Tasks/" + delTaskID).once("value", snapshot => {
      //Recursively calls on each of subtasks
      if (snapshot.val().subTasks != undefined){
        for(let i = 0; i < snapshot.val().subTasks.length; i++){
          deleteTasks(snapshot.val().subTasks[i]);
        }
      }
      //Then deletes delTaskID task from database, as well as from its parent's list of subtasks
      if (snapshot.val().parentTask != "none"){
        database().ref("/Database/Tasks/" + snapshot.val().parentTask).once("value", snap => {
          const array = snap.val().subTasks.filter(ID => ID != delTaskID);
          database().ref("/Database/Tasks/" + snapshot.val().parentTask).update({
            subTasks: array,
          });
          props.changeAllProjectTasks(array);
        });
        database().ref("/Database/Tasks/" + delTaskID).remove();
      } else {
        database().ref("/Database/Projects/" + props.currentProj).once("value", snap => {
          const array = snap.val().tasks.filter(ID => ID != delTaskID);
          database().ref("/Database/Projects/" + props.currentProj).update({
            tasks: array,
          });
          database().ref("/Database/Tasks/" + delTaskID).remove();
          props.changeAllProjectTasks(array);;
        });
      }
    });    
  };

  const isTitle = () => {
    if (title != ""){
      database().ref("/Database/Tasks/" + props.currentTask).update({
        title: title
      });
    }
  }

  const isDescription = () => {
    if (description != ""){
      database().ref("/Database/Tasks/" + props.currentTask).update({
        text: description
      });
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
                deleteProjectFunction = { deleteAllTasks }
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
        Edit Project Title
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