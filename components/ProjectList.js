import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Modal,
  LayoutAnimation,
  TextInput,
  Platform,
  UIManager,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

import { TopBar } from './utilityComponents/TopBar.js';

import { useFocusEffect } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import Icon from "react-native-vector-icons/AntDesign";

import * as styles from './styles/styles.js';
import * as basicStyles from './styles/basicStyles.js';
import * as topBarStyles from './styles/topBarStyles.js';
  
export function ProjectList({ route, navigation }) {
  const [projects, changeProjects] = useState(null);//List of project ID's for user
  const [user, changeUser] = useState(null);//user's ID
  const [currentProj, changeCurrentProj] = useState(null);//ID of the current project showing in the delete modal
  const [validUser, changeValidUser] = useState(true); // validates the user checks if the user already is in the list
  const [visibility, changeVisibility] = useState(false);//visibility of the delete project modal

  useEffect(() => {
    getUserProjects();
  }, [route.params.user]);

  const getUserProjects = () => {
    if (user != null){
      database().ref("/Database/Users/" + user).off("value", updateProjectList);
    }
    changeUser(route.params.user);
    database().ref("/Database/Users/" + route.params.user).on("value", updateProjectList);
  }

  const updateProjectList = snapshot => {
    changeProjects(snapshot.val().projects);
  }

  /**
  * Shows the Edit/Delete modal for a project
  * @params projID {string} project ID of the project we want to pull modal for
  */
  const deletionPage = projID => {
    changeCurrentProj(projID);    
    changeVisibility(true);
  }
  return (
    <TopBar 
      navigation = { navigation } 
      userInfo={ route.params.user }
      listNavigation = {[ "ProjectCreation", "Settings" ]}
      >
      {/* Description and Delete modal for Project */}
      <ProjectModal
        changeVisibility = { changeVisibility }
        visibility = { visibility }
        user = { user }
        changeValidUser = { changeValidUser }
        currentProj = { currentProj }
      />
      {/* Plus button that takes you to creating a new project */}
      <TouchableHighlight 
        style={ styles.projectCreationPlusPosition }
        onPress={() => {
          navigation.navigate("ProjectCreation", { user: route.params.user });
        }}
      >
        <View>
          <Text style={ styles.projectCreationPlusDesign }>+</Text>
        </View> 
      </TouchableHighlight>
      <UserProjectsFlatlist
        projects = { projects }
        deletionPage = { deletionPage }
        navigation = { navigation }
        route = { route }
      />
    </TopBar>
  );
}

const UserProjectsFlatlist = props => {
  return (
    <View 
      style={ styles.projectListMainView }
    >
      {/* Displays if user is not in any projects */}
      {(props.projects == null) &&
        <View>
          <Text>
            No Projects
          </Text> 
        </View>
      }
      <FlatList
        style = {{ width: "100%" }}
        data = { props.projects }
        renderItem = {({ item }) => 
          <React.StrictMode>
            <ProjectPanel
              project = { item }
              navigation = { props.navigation }
              user = { props.route.params.user }
              deletionPage = { props.deletionPage }
            />
          </React.StrictMode>
        }
        keyExtractor={item => item.ID}
      />
    </View>
  );
}
  
const ProjectModal = props => {
  const [invUsers, changeInvUsers] = useState('');//For the inviteUsers field
  const [checkUser, changeCheckUser] = useState(null);//Used to check if user exists 
  const [title, changeTitle] = useState("");
  const [description, changeDescription] = useState("");
  let addedUserID;
 
  useEffect(() => {
    database().ref(`/Database/Projects/${props.currentProj}`).once("value", updateProjectInfo);
  }, [props.currentProj]);

  const updateProjectInfo = snapshot => {
    changeTitle(snapshot.val().title);
    changeDescription(snapshot.val().description);
  }

  const addUsersToList = () =>{
    database().ref("/Database/Users").orderByChild("Username").equalTo(invUsers).once("value",findAddedUserID);
  };

  const findAddedUserID = snapshot => {
    for(let key in snapshot.val()){
      addedUserID = key;
    }
    database().ref(`/Database/Projects/${props.currentProj}`).once("value",validateUser);        
  }

  const validateUser = snapshot => {
    let valid=true;
    let userList=snapshot.val().users;
    for(let i = 0; i < userList.length; i++){
      if (addedUserID == userList[i]){
        valid = false;
      }
    }
    props.changeValidUser(valid);
    changeInvUsers('');
    if (valid){
      database().ref(`/Database/Projects/${props.currentProj}`).once("value", addUserToProject);
    }
  }

  const addUserToProject = snapshot => {
    if (snapshot.val().users != null && addedUserID != null){
      changeCheckUser(true);
      let userList = snapshot.val().users.slice();
      userList.push(addedUserID);
      database().ref(`/Database/Projects/${props.currentProj}`).update({
        users:userList
      });
      addProjectIds(addedUserID, props.currentProj);
    } else {
      changeCheckUser(false);
    }
  }

  const addProjectIds = (userId, projectId) => {  
    const add = database().ref(`/Database/Users/${userId}/projects`).once("value", snapshot => {
      if (snapshot.val() != null){
        let tempProjectList = snapshot.val();
        tempProjectList.push(projectId);
        database().ref(`/Database/Users/${userId}`).update({
          projects: tempProjectList,
        });
      } else {
        database().ref(`/Database/Users/${userId}`).update({
          projects: [projectId],
        });
      }
    });
  }

  // Deletes the Project from the held Project
  const deleteProj = () => {
    //Deletes project from the users Projects list
    database().ref("/Database/Users/" + props.user).once("value",  snapshot => {
      const array = snapshot.val().projects.filter(item => item != props.currentProj);
      database().ref("/Database/Users/" + props.user).update({
        projects: array
      });  
    });
    
    // Deletes the current project from Projects
    database().ref("/Database/Projects/" + props.currentProj).once("value",  snapshot=>{
      const array = snapshot.val().users.filter(item => item != props.user);
      database().ref("/Database/Projects/" + props.currentProj).update({
        users: array
      });
      
      //iff no users in the project 
      //then delete project and all of its tasks
      if (array.length === 0){
        for(let key in snapshot.val().tasks){
          deleteTasks(snapshot.val().tasks[key]);
        }
        //deletes the project from Projects
        database().ref("/Database/Projects/" + props.currentProj).remove();    
      }
    });

    props.changeVisibility(false);
  }

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
        });
        database().ref("/Database/Tasks/" + delTaskID).remove();
      } else {
        database().ref("/Database/Tasks/" + delTaskID).remove();    
      }
    });    
  };

  const isTitle = () => {
    if (title != ""){
      database().ref("/Database/Projects/" + props.currentProj).update({
        title: title
      });
    }
  }

  const isDescription = () => {
    if (description != ""){
      database().ref("/Database/Projects/" + props.currentProj).update({
        description: description
      });
    }
  }

  return (
    <Modal 
      animationType = "slide"
      transparent = { true }
      visible = { props.visibility }
    > 
      <TouchableHighlight 
        onPress = {() => {
          props.changeVisibility(false);
        }}
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
            style = {{ width: "100%" }}
            contentContainerStyle = {{ alignItems: "center" }}
          >
            <TitleDescriptionDelete
              title = { title }
              description = { description }
            />
            <InviteUsersInput
              changeInvUsers = { changeInvUsers }
              inputValue = { invUsers }
              addUsersToList = { addUsersToList }
              checkUser = { checkUser }
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
              deleteButtonText = { "Delete Project" }
              deleteProjectFunction = { deleteProj }
            />
          </ScrollView>
        </KeyboardAvoidingView>  
      </TouchableHighlight>
    </Modal>
  );
}


// Each project Box the user has
const ProjectPanel = props => {
  const [project, changeProject] = useState(null);//Contains entire project information

  useFocusEffect(
    React.useCallback(() => {
      database().ref("/Database/Projects/" + props.project).once("value", handleProject);
    }, [project])
  );

  const handleProject = snapshot => {
    changeProject(snapshot.val());
  }
  
  return (
    <View>
      {project != null && 
        //Entire panel is touchable, hold for 1 second to pull up decription and delete page, press to view tasks 
        <TouchableHighlight
          onPress = {() => {
            props.navigation.navigate("Project", { taskID: null, projectID: project.ID, user: props.user });
          }}
          onLongPress = {() => { props.deletionPage(project.ID) }}
          delayLongPress = {1000}
          style = { styles.projectListPanel }
        >
          <View>
            <ProjectPanelInfo
              projectTitle = { project?.title }
              projectTaskCount = {( project?.tasks != null ? project.tasks.length : 0 )}
              projectDueDate = { project?.dueDate }
              projectUserCount = { project?.users.length }
            />
          </View>
        </TouchableHighlight>
      }
    </View>
  );
}

const ProjectPanelInfo = props => {
  return (
    <View
      style = { styles.projectPanelInfoCentering }
    >
      <Text style={{ fontSize: 20 }}>
        { props.projectTitle }
      </Text>
      {/* Project tasks count iff not 0 */}
      <Text>
        { props.projectTaskCount } Task(s)
      </Text>
      <Text>
        Due Date: { props.projectDueDate } 
      </Text>
      <Text>
        { props.projectUserCount } User(s)
      </Text>
    </View>
  );
}

const TitleDescriptionDelete = props => {
  return (
    <View>
      <Text
        style = { styles.centerSelf }
      >
        { props.title }
      </Text>
      <Text
        style = { styles.centerSelf }
      >      
        { props.description }
      </Text>
    </View>
  );
}

const InviteUsersInput = props => {
  return (
    <View>
      <Text 
        style = {{ alignSelf: "center" }}
      >
        Invite Users
      </Text>
      <TextInput
        autoFocus = { true }
        style = { styles.inviteUserTextInput }
        placeholder = "Username"
        onChangeText = {text => props.changeInvUsers(text)}
        value = { props.invUsers }
      />
      <TouchableHighlight 
        onPress = { props.addUsersToList }
        style = {{ alignItems:"center" }}                
      >
        <Icon
          stlye = {{ margin: 2 }}
          name = "addusergroup" 
          size = { 35 } 
        />
      </TouchableHighlight>
      <ValidUserFeedback
        checkUser = { props.checkUser }
      />
    </View>
  );
}

const ValidUserFeedback = props => {
  return (
    <View>
      {props.checkUser == true &&
        <Text 
          style = {{ alignSelf: "center" }}
        >
          User Successfully Added!
        </Text>
      }
      {props.checkUser == false &&
        <Text 
          style = {{ alignSelf: "center", color: "red" }}
        >
          User Not Found
        </Text>
      }
    </View>
  );
}

const ProjectTitleEdit = props => {
  return (
    <View
      style = { styles.centerChildren }
    >
      <Text
        style = { styles.centerSelf }
      >
        Project Title
      </Text>
      <TextInputBox
        changeValue = { props.changeTitle }
        text = { props.title }
        value = { props.title }
      />
      <ButtonBox
        onClick = {() => props.isTitle()}
        text = { "Change Title" }
        style = { basicStyles.buttonContainer }
      />
    </View>
  );
}

const ProjectDescriptionEdit = props => {
  return (
    <View
      style = { styles.centerChildren }
    >
      <DescriptionTextInputBox
        text = "Project Description"
        style = {[ styles.editProjectDescriptionInputs, styles.centerSelf ]}
        onChangeText = { props.changeDescription }
        value = { props.description }
      />
      <ButtonBox
        onClick = {() => props.isDescription()}
        text = { "Change Description" }
        style = { basicStyles.buttonContainer }
      />
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

const ButtonBox = props => {
  return(
    <View 
      style = { props.style }
    >
      <TouchableHighlight 
        style = { basicStyles.button }
        onPress = { props.onClick }
      >
        <Text 
          style = { topBarStyles.buttonText }
        >
          { props.text }
        </Text>
      </TouchableHighlight>
    </View>
  );
};

const TextInputBox = props => {
  return (
    <View 
      style = {[ basicStyles.textInputContainer, styles.centerSelf ]}
    >
      <TextInput 
        onChangeText = {text => props.changeValue(text)}
        placeholder = { props.text }
        value = { props.value }
        maxLength = { 30 }
        style = { styles.centerSelf }
      />
    </View>
  );
};

const DescriptionTextInputBox = props => {
  return (
    <View>
      <Text 
        style = {[ basicStyles.defaultText, styles.centerSelf ]} 
      >
        { props.text }
      </Text>
      <TextInput
        multiline
        numberOfLines = { 4 }
        maxLength = { 140 }
        onChangeText = {text => props.onChangeText(text)}
        placeholder = { props.text }
        value = { props.value }
        style = { props.style }
      />
    </View>
  );
};
