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
import { useFocusEffect } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import Icon from "react-native-vector-icons/AntDesign";
import * as styles from './styles/styles.js';
import * as basicStyles from './styles/basicStyles.js';
import * as topBarStyles from './styles/topBarStyles.js';
import { on } from 'npm';
  
export function ProjectList({ route, navigation }) {
  const [projects, changeProjects] = useState(null);//List of project ID's for user
  const [user, changeUser] = useState(null);//user's ID
  const [currentProj, changeCurrentProj] = useState(null);//ID of the current project showing in the delete modal
  const [validUser, changeValidUser] = useState(true); // validates the user checks if the user already is in the list
  const [visibility, changeVisibility] = useState(false);//visibility of the delete project modal

  useEffect(() => {
    if(user != null){
      database().ref("/Database/Users/" + user).off("value", handleProject);
    }
    changeUser(route.params.user);
    database().ref("/Database/Users/" + route.params.user).on("value", handleProject);
  }, [route.params.user]);

  /* Takes the users info looking for the users projects */  
  //Updates projects state variable to be list of ID's of projects the user is in
  const handleProject = snapshot => {
    changeProjects(snapshot.val().projects);
  }

  //Shows the modal for the description and delete page for a project
  function deletionPage(projID){
    changeCurrentProj(projID);    
    changeVisibility(true);
  }

  return (
    <TopBar navigation = {navigation} userInfo={route.params.user}>
      {/* Description and Delete modal for Project */}
      <ProjectModal
        changeVisibility = {changeVisibility}
        visibility = {visibility}
        user = {user}
        changeValidUser = {changeValidUser}
        currentProj = {currentProj}
      />
      {/* Plus button that takes you to creating a new project */}
      <TouchableHighlight 
        style={styles.projectCreationPlusPosition}
        onPress={() => {
          navigation.navigate("ProjectCreation", { user: route.params.user});
        }}
      >
        <View>
          <Text style={styles.projectCreationPlusDesign}>+</Text>
        </View> 
      </TouchableHighlight>
      <UserProjectsFlatlist
        projects = {projects}
        deletionPage = {deletionPage}
        navigation = {navigation}
        route = {route}
      />
    </TopBar>
  );
}

const UserProjectsFlatlist = (props) => {
  return (
    <View 
      style={styles.projectListMainView}
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
        style={{width: "100%"}}
        data={props.projects}
        renderItem={({item}) => 
          <React.StrictMode>
            <ProjectPanel
              project = {item}
              navigation = {props.navigation}
              user = {props.route.params.user}
              deletionPage = {props.deletionPage}
            />
          </React.StrictMode>
        }
        keyExtractor={item => item.ID}
      />
    </View>
  );
}
  
const ProjectModal = (props) => {
  const [invUsers, changeInvUsers] = useState('');//For the inviteUsers field
  const [checkUser, changeCheckUser] = useState(null);//Used to check if user exists 
  const [title, changeTitle] = useState("");
  const [description,changeDescription] = useState("");

  let addedUserID;// The user you are trying to adds ID
 
  useEffect(() => {
    database().ref(`/Database/Projects/${props.currentProj}`).once('value', snapshot => {
      changeTitle(snapshot.val().title);
      changeDescription(snapshot.val().description);
    });
  }, [props.currentProj]);

  //adds the username to the project on the databse
  const addProjectIds = (userId, projectId) => {  
    const add = database().ref(`/Database/Users/${userId}/projects`).on('value', snap => {
      if(snap.val() != null){
        let temp = snap.val();
        temp.push(projectId);
        database().ref(`/Database/Users/${userId}`).update({
          projects: temp,
        });
        database().ref(`/Database/Users/${userId}/projects`).off("value", add);
      } else {
        database().ref(`/Database/Users/${userId}`).update({
          projects: [projectId],
        });
        database().ref(`/Database/Users/${userId}/projects`).off("value", add);
      }
    });
  }
  
  //finds the userID for the added user
  const addUsersToList = () =>{
    database().ref("/Database/Users").orderByChild("Username").equalTo(invUsers).once("value",findAddedUserID);
  };

  // Finds the added userID
  const findAddedUserID= snapshot=>{
    for(let key in snapshot.val()){
      addedUserID=key;
    }
    //Validates the user that is being added
    database().ref(`/Database/Projects/${props.currentProj}`).once("value",validateUser);        
  }

  // checks if the user is already in the list
  const validateUser = snapshot => {
    let valid=true;
    let userList=snapshot.val().users;
    for(let i = 0; i < userList.length; i++){
      if(addedUserID == userList[i]){
        valid=false;
      }
    }
    props.changeValidUser(valid);
    changeInvUsers('');
    if(valid){
      database().ref(`/Database/Projects/${props.currentProj}`).once("value",addUserToProject);
    }
  }

  // adds user to the project under the database
  const addUserToProject = snapshot => {
    if(snapshot.val().users!=null && addedUserID != null){
      changeCheckUser(true);
      let userList = snapshot.val().users.slice();
      userList.push(addedUserID);// pushes the new user
      database().ref(`/Database/Projects/${props.currentProj}`).update({users:userList});
      addProjectIds(addedUserID, props.currentProj);
    } else {
      changeCheckUser(false);
    }
  }

  // Deletes the Project from the held Project
  const deleteProj= ()=>{
    //Deletes project from the users Projects list
    database().ref("/Database/Users/" + props.user).once("value",  snapshot=>{
      const array = snapshot.val().projects.filter(item=> item!= props.currentProj);
      database().ref("/Database/Users/" + props.user).update({projects:array});  
    });
    
    // Deletes the current project from Projects
    database().ref("/Database/Projects/" + props.currentProj).once("value",  snapshot=>{
      const array = snapshot.val().users.filter(item => item != props.user);
      database().ref("/Database/Projects/" + props.currentProj).update({users:array});
      
      //iff no users in the project 
      //then delete project and all of its tasks
      if(array.length===0){
        for(let key in snapshot.val().tasks){
          deleteTasks(snapshot.val().tasks[key]);
        }
        //deletes the project from Projects
        database().ref("/Database/Projects/"+ props.currentProj).remove();    
      }
    });
  }

  // Deletes deltaskID and its subtasks for the current project
  //@param delTaskID is string representing id of task to delete along with its subtasks
  const deleteTasks = (delTaskID) => {
    database().ref("/Database/Tasks/" + delTaskID).once("value", snapshot => {
      //Recursively calls on each of subtasks
      if(snapshot.val().subTasks != undefined){
        for(let i = 0; i < snapshot.val().subTasks.length; i++){
          deleteTasks(snapshot.val().subTasks[i]);
        }
      }
      //Then deletes delTaskID task from database, as well as from its parent's list of subtasks
      if(snapshot.val().parentTask != 'none'){
        database().ref("/Database/Tasks/" + snapshot.val().parentTask).once("value", snap => {
          const array = snap.val().subTasks.filter(ID => ID != delTaskID);
          database().ref("/Database/Tasks/" + snapshot.val().parentTask).update({
            subTasks: array,
          });
        });
        database().ref("/Database/Tasks/" + delTaskID).remove();

      //Deletes delTaskID task from database
      } else {
        database().ref("/Database/Tasks/" + delTaskID).remove();    
      }
    });    
  };

  const isTitle = () =>{
    if(title!=''){
      database().ref("/Database/Projects/"+ props.currentProj).update({title: title});
    }
  }

  const isDescription = () =>{
    if(description!=''){
      database().ref("/Database/Projects/"+ props.currentProj).update({description: description});
    }
  }

  return (
    <Modal 
      animationType="slide"
      transparent={true}
      visible={props.visibility}
    > 
      <TouchableHighlight 
        onPress = {() => {
          props.changeVisibility(false);
        }}
      >
        <KeyboardAvoidingView 
          style={styles.projectListModal}
          behavior = "padding"
          keyboardVerticalOffset={
            Platform.select({
              android: () => -1200
            })()
          }
        >
        <ScrollView
         style={{width:"100%"}}
         contentContainerStyle = {{alignItems:"center"}}
        >
          <Text>{title}</Text>
          <Text>{description}</Text>
          <TouchableHighlight 
            onPress={()=>{
              deleteProj()
            }}
          >
            <Text>
              Delete
            </Text>
          </TouchableHighlight>
          <Text 
            style = {{alignSelf: "center"}}
          >
            Invite Users
          </Text>
         
          
            <TextInput
              autoFocus={true}
              style = {{borderBottomColor: 'gray', borderBottomWidth: 1, width: "75%",height: 50, textAlign: "center", alignSelf: "center", marginBottom: 10}}
              placeholder = "Username"
              onChangeText = {text => changeInvUsers(text)}
              value={invUsers}
            />
            <TouchableHighlight onPress = {addUsersToList}
              style={{alignItems:"center"}}                
            >
                <Icon
                stlye={{margin: 2}}
                  name="addusergroup" 
                  size = {35} 
                />
            </TouchableHighlight>
            {checkUser == true &&
              <Text style = {{alignSelf: "center"}}>User Successfully Added!</Text>
            }
            {checkUser == false &&
              <Text style = {{alignSelf: "center"}}>User Not Found</Text>
            }
            <Text>Project Title</Text>
            <TextInputBox
              changeValue={changeTitle}
              text={title}
              value={title}
            />
            <ButtonBox
              onClick={()=>isTitle()}
              text={"Enter to Change Title"}
              style={basicStyles.buttonContainer}
            />
            <DescriptionTextInputBox
              text = "Project Description"
              style = {styles.editProjectDescriptionInputs}
              onChangeText = {changeDescription}
              value = {description}
            />
            <ButtonBox
              onClick={()=>isDescription()}
              text={"Enter to Change Description"}
              style={basicStyles.buttonContainer}
            />
          </ScrollView>
        </KeyboardAvoidingView>  
      </TouchableHighlight>
    </Modal>
  );
}


// Each project Box the user has
const ProjectPanel = (props) => {
  const [project, changeProject] = useState(null);//The entire project information

  //Updates project state variable to have all the project info
  const handleProject = snapshot => {
    changeProject(snapshot.val());
  }

  useFocusEffect(
    React.useCallback(() => {
      database().ref("/Database/Projects/" + props.project).once("value", handleProject);
    }, [project])
  );

  
  return (
    <View>
      {project != null && 
        //Entire panel is touchable, hold for 1 second to pull up decription and delete page, press to view tasks 
        <TouchableHighlight
          onPress = {() => {
            //Maybe put task ID to null
            props.navigation.navigate('Project', {taskID: null, projectID: project.ID, user: props.user});
          }}
          onLongPress={()=>{ props.deletionPage(project.ID)}}
          delayLongPress={1000}
          style={styles.projectListPanel}
        >
          <View >
            <ProjectPanelInfo
              projectTitle = {project?.title}
              projectTaskCount = {(project?.tasks != null ? project.tasks.length : 0)}
              projectDueDate = {project?.dueDate}
              projectUserCount = {project?.users.length}
            />
          </View>
        </TouchableHighlight>
      }
    </View>
  );
}

const ProjectPanelInfo = (props) => {
  return (
    <View
      style = {styles.projectPanelInfoCentering}
    >
      {/* Project Title */}
      <Text style={{fontSize: 20}}>
        {props.projectTitle}
      </Text>
      {/* Project tasks count id not 0 */}
      <Text>
        {props.projectTaskCount} Task(s)
      </Text>
      {/* Display due date of project */}
      <Text>
        Due Date: {props.projectDueDate} 
      </Text>
      {/* Displays number of users in project */}
      <Text>
        {props.projectUserCount} User(s)
      </Text>
    </View>
  );
}

const TopBar = (props) => {
  const [drawer, changeDrawer] = useState(false);
  return (
    <View style = {basicStyles.container}>
      <View style = {topBarStyles.topBarContainer}>
        <View style = {topBarStyles.openContainer}>
            <ButtonBoxForNavigation
              onClick={() => {
                changeDrawer(!drawer);
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              }}
          text={"Open"}
          style={topBarStyles.openAndDrawerButton}
        />
           
        </View>
      </View>
      <View style = {[topBarStyles.drawerContainer, drawer? undefined: {width: 0}]}>
        <ButtonBoxForNavigation
          onClick={()=> 
            changeDrawer(!drawer)
          } 
          text={"Close"}
          style={topBarStyles.navigationButtons}
        />
        <ButtonBoxForNavigation
          onClick={()=>{
            props.navigation.goBack();
          }}
          text={"Go Back"}
          style={topBarStyles.navigationButtons}
        />
        
        <ButtonBoxForNavigation
          onClick={()=>
            props.navigation.navigate("ProjectCreation", {user:props.userInfo})
          } 
          text={"ProjectCreation"}
          style={topBarStyles.navigationButtons}
        />
        <ButtonBoxForNavigation
          onClick={()=>
            props.navigation.navigate("Settings", {user:props.userInfo})
          } 
          text={"Settings⚙️"}
          style={topBarStyles.navigationButtons}
        />
      </View>
      {props.children}
    </View>
  )
};

const ButtonBoxForNavigation = props => {
  return(
    <TouchableHighlight 
      style = {props.style}
      onPress = {props.onClick}
    >
      <Text style = {topBarStyles.buttonText}>{props.text}</Text>
    </TouchableHighlight>
  );
};

const ButtonBox = props => {
  return(
    <View style = {props.style}>
      <TouchableHighlight 
        style = {basicStyles.button}
        onPress = {props.onClick}
      >
        <Text style = {topBarStyles.buttonText}>{props.text}</Text>
      </TouchableHighlight>
    </View>
  );
};

const TextInputBox = props => {
  return (
    <View style = {basicStyles.textInputContainer}>
      <TextInput 
        onChangeText = {text => props.changeValue(text)}
        placeholder = {props.text}
        value = {props.value}
        maxLength = {30}
      />
    </View>
  );
};

const DescriptionTextInputBox = props => {
  return (
    <View style = {styles.editTaskTitleInput}>
      <Text style = {basicStyles.defaultText}>{props.text}</Text>
      <TextInput
        multiline
        numberOfLines={4}
        maxLength = {140}
        onChangeText = {text => props.onChangeText(text)}
        placeholder = {props.text}
        value = {props.value}
        style = {props.style}
      />
    </View>
  );
};
