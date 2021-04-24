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
        <TouchableHighlight onPress={()=> changeDrawer(!drawer)} style={styles.navigationButtons}><Text>Close</Text></TouchableHighlight>
        <TouchableHighlight onPress={()=>props.navigation.navigate("ProjectCreation",{user:props.userInfo})} style={styles.navigationButtons}><Text>Project Creation</Text></TouchableHighlight>
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
    const [projects, changeProjects] = useState(null);
    const [user, changeUser] = useState(null);
    const [visibility, changeVisibility] = useState(false);
    /* Takes the users info looking for the users projects */

    const [currentProj,changeCurrentProj]= useState(null);
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

  function deletionPage(projID){
    changeVisibility(true);
    changeCurrentProj(projID);
    
   }
   // Deletes deltaskID and its subtasks for the current project
   const deleteTasks = (delTaskID) => {
    database().ref("/Database/Tasks/" + delTaskID).once("value", snapshot => {
      if(snapshot.val().subTasks != undefined){
        for(let i = 0; i < snapshot.val().subTasks.length; i++){
          deleteTasks(snapshot.val().subTasks[i]);
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
    
    }
    );
  }

   
   
   
    return (
    <TopBar navigation = {navigation}>
      <Drawer userInfo={route.params.user} navigation={navigation}></Drawer>
      <Modal 
        animationType="slide"
        transparent={true}
        visible={visibility}
      > 
        <TouchableHighlight onPress = {() => {changeVisibility(false);}}>
          <View style={{height: "80%", width: "80%", margin:"10%", backgroundColor:'green'}}>
            <TouchableHighlight onPress={()=>{deleteProj()}}>
              <Text>Delete</Text>
            </TouchableHighlight>
            <Text>{currentProj}</Text>
          </View>
        </TouchableHighlight>
      </Modal>
      <TouchableHighlight 
        style={{width: "15%", left: "88%", top: -10, position: 'absolute'}}
        onPress={() => {
          navigation.navigate("ProjectCreation", { user: route.params.user});
        }}
      >
        <View>
          <Text style={{color: "blue", fontSize: 50}}>+</Text>
        </View> 
      </TouchableHighlight>
  
      <View style={{ backgroundColor: "white", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {(projects == null) &&
          <View>
            <Text>No Projects</Text> 
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
  const [project, changeProject] = useState(null);

  const handleProject = snapshot => {
    changeProject(snapshot.val());
  }

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
      {project != null&& 

      <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}>
        <TouchableHighlight
          onPress = {() => {
            //Maybe put task ID to null
            props.navigation.navigate('Project', {taskID: null, projectID: project.ID, user: props.user});}}
          onLongPress={()=>{ props.deletionPage(project.ID)}}
          delayLongPress={1000}
          delayPressIn={100}
          onPressIn={()=>{ console.log("You are going to delete")}} //feedback time please
        >
          <View>
            <Text style={{fontSize: 20}}>
              {project?.title}
            </Text>
            {project?.tasks != null&&
              <Text>{project?.tasks.length} Task(s)</Text>
            }
            {project?.tasks == null&&
              <Text>0 Task(s)</Text>
            }
            <Text>Due Date: {project?.dueDate} </Text>
            <Text>{project?.users.length} User(s)</Text>
          </View>
        </TouchableHighlight>
      </View>
          }
          </View>
    );
  // } else {
  //   return (
  //   <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}>
  //     <TouchableHighlight
  //     //Maybe put TaskID to null
  //       onPress = {() => {props.navigation.navigate('Project', {taskID: null, projectID: props.project.ID, user: props.user});}}
  //       onLongPress={()=>{console.log("hello you long boi")}}
  //       delayLongPress={3000}
  //     >
  //       <View>
  //         <Text style={{fontSize: 20}}>
  //           Title
  //         </Text>
  //         <Text>0 Task(s)</Text>
  //         <Text>Due Date: due </Text>
  //         <Text>0 User(s)</Text>
  //       </View>
  //     </TouchableHighlight>
      
  //   </View>
  //   );
  // }
          }
