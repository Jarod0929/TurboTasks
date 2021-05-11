import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Modal,
  LayoutAnimation,
} from 'react-native';

import * as styles from './styles/styles.js';
import * as basicStyles from './styles/basicStyles.js';
import * as topBarStyles from './styles/topBarStyles.js';

import database from '@react-native-firebase/database';
import {  useFocusEffect, useIsFocused } from '@react-navigation/native';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
 
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
    <TopBar userInfo = { route.params.user } navigation = { navigation }>
      {/* Main Container */}
      <View style = { styles.projectTaskListConatiner }>
        {/* Modal for showing task information */}
        <FullModal
          visibility = { visibility }
          onClick = {() => {
            changeVisibility(false);
          }}
          currentTask = { currentTask }
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

const TopBar = props => {
  const [drawer, changeDrawer] = useState(false);

  return (
    <View style = { basicStyles.container }>
      <View style = { topBarStyles.topBarContainer }>
        <View style = { topBarStyles.openContainer }>
            <ButtonBoxForNavigation
              onClick = {() => {
                changeDrawer(!drawer);
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              }}
          text = { "Open" }
          style = { topBarStyles.openAndDrawerButton }
        />
           
        </View>
      </View>
      <View style = { [topBarStyles.drawerContainer, drawer? undefined: { width: 0 }] }>
        <ButtonBoxForNavigation
          onClick = {()=> 
            changeDrawer(!drawer)
          } 
          text = { "Close" }
          style = { topBarStyles.navigationButtons }
        />
        <ButtonBoxForNavigation
          onClick = {()=>{
            props.navigation.goBack();
          }}
          text = { "Go Back" }
          style = { topBarStyles.navigationButtons }
        />
        <ButtonBoxForNavigation
          onClick = {()=>
            props.navigation.navigate("ProjectList", { user:props.userInfo })
          } 
          text = { "ProjectList" }
          style = { topBarStyles.navigationButtons }
        />
        <ButtonBoxForNavigation
          onClick = {()=>
            props.navigation.navigate("ProjectCreation", { user:props.userInfo })
          } 
          text = { "ProjectCreation" }
          style = { topBarStyles.navigationButtons }
        />
        <ButtonBoxForNavigation
          onClick = {()=>
            props.navigation.navigate("Settings", { user:props.userInfo })
          } 
          text = { "Settings⚙️" }
          style = { topBarStyles.navigationButtons }
        />
      </View>
      { props.children }
    </View>
  )
};

const ButtonBoxForNavigation = props => {
  return(
    <TouchableHighlight 
      style = { props.style }
      onPress = { props.onClick }
    >
      <Text style = { topBarStyles.buttonText }>{ props.text }</Text>
    </TouchableHighlight>
  );
};

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
      user: props.userId
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
      <Text>Title: { task?.title }</Text>
      <Text>Description: { task?.text }</Text>
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
          <View style = { styles.projectListModal }>
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

