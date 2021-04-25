import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import * as styles from './styles.js';

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
          <TouchableHighlight 
            onPress={()=> 
              changeDrawer(!drawer)
            } 
            style={styles.navigationButtons}
          >
            <Text>
              Close
            </Text>
          </TouchableHighlight>
          <TouchableHighlight 
            onPress={()=>
              props.navigation.navigate("ProjectCreation",{user:props.userInfo})
            } 
            style={styles.navigationButtons}
          >
            <Text>
              Project Creation
            </Text>
          </TouchableHighlight>
          <TouchableHighlight 
            onPress={()=>
              props.navigation.navigate("Settings",{user:props.userInfo})
            } 
            style={styles.navigationButtons}
          >
            <Text>
              Settings⚙️
            </Text>
          </TouchableHighlight>
        </View>
      }
    </View>
  );
}

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
            <Text>Go Back</Text>
          </View>
        </TouchableHighlight>
      </View>
      {props.children}
    </View>
  )
};
  
export function ProjectList ({ route, navigation }) {
  const [projects, changeProjects] = useState(null);//List of project ID's for user
  const [user, changeUser] = useState(null);//user's ID
  const [visibility, changeVisibility] = useState(false);//visibility of the delete project modal
  const [currentProj,changeCurrentProj]= useState(null);//ID of the current project showing in the delete modal
  /* Takes the users info looking for the users projects */  
  
  //Updates projects state variable to be list of ID's of projects the user is in
  const handleProject = snapshot => {
    changeProjects(snapshot.val().projects);
  }

  useEffect(() => {
    if(user != null){
      database().ref("/Database/Users/" + user).off("value", handleProject);
    }
    changeUser(route.params.user);
    database().ref("/Database/Users/" + route.params.user).on("value", handleProject);
  }, [route.params.user]);

  //Shows the modal for the description and delete page for a project
  function deletionPage(projID){
    changeVisibility(true);
    changeCurrentProj(projID);    
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

  // Deletes the Project from the held Project
  const deleteProj= ()=>{
    //Deletes project from the users Projects list
    database().ref("/Database/Users/" + user).once("value",  snapshot=>{
      const array = snapshot.val().projects.filter(item=> item!=currentProj);
      database().ref("/Database/Users/" + user).update({projects:array});  
    });
    
    // Deletes the current project from Projects
    database().ref("/Database/Projects/" + currentProj).once("value",  snapshot=>{
      const array = snapshot.val().users.filter(item=> item!=user);
      database().ref("/Database/Projects/" + currentProj).update({users:array});
      
      //iff no users in the project 
      //then delete project and all of its tasks
      if(array.length===0){
        for(let key in snapshot.val().tasks){
          deleteTasks(snapshot.val().tasks[key]);
        }
        //deletes the project from Projects
        database().ref("/Database/Projects/"+currentProj).remove();    
      }
    });
  }
 
  return (
    <TopBar navigation = {navigation}>
      <Drawer 
        userInfo={route.params.user} 
        navigation={navigation}
      >        
      </Drawer>

      {/* Description and Delete modal for Project */}
      <Modal 
        animationType="slide"
        transparent={true}
        visible={visibility}
      > 
        <TouchableHighlight 
          onPress = {() => {
            changeVisibility(false);
          }}
        >
          <View style={styles.projectListModal}>
            <TouchableHighlight onPress={()=>{deleteProj()}}>
              <Text>
                Delete
              </Text>
            </TouchableHighlight>
            <Text>
              {currentProj}
            </Text>
          </View>
        </TouchableHighlight>
      </Modal>

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

      {/* List of the projects for the user */}
      <View style={styles.projectListMainView}>
        {/* Displays if user is not in any projects */}
        {(projects == null) &&
          <View>
            <Text>
              No Projects
            </Text> 
          </View>
        }
        <FlatList
          style={{width: "100%"}}
          data={projects}
          renderItem={({item}) => 
            <React.StrictMode>
              <ProjectPanel
                project = {item}
                navigation ={navigation}
                user={route.params.user}
                deletionPage = {deletionPage}
              />
            </React.StrictMode>
          }
          keyExtractor={item => item.ID}
        />
      </View>
    </TopBar>
  );
}
  
// Each project Box the user has
const ProjectPanel = (props) => {
  const [project, changeProject] = useState(null);//The entire project information

  //Updates project state variable to have all the project info
  const handleProject = snapshot => {
    changeProject(snapshot.val());
  }

  //If project not yet retrieved (project == null) then pulls it from the database
  if(project == null) {
    database().ref("/Database/Projects/" + props.project).once("value", handleProject);
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
            <View>
              {/* Project Title */}
              <Text style={{fontSize: 20}}>
                {project?.title}
              </Text>
              {/* Project tasks count id not 0 */}
              {project?.tasks != null &&
                <Text>
                  {project?.tasks.length} Task(s)
                </Text>
              }
              {/* Project tasks as 0 if no tasks*/}
              {project?.tasks == null &&
                <Text>
                  0 Task(s)
                </Text>
              }
              {/* Display due date of project */}
              <Text>
                Due Date: {project?.dueDate} 
              </Text>
              {/* Displays number of users in project */}
              <Text>
                {project?.users.length} User(s)
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      }
    </View>
  );
  
}
