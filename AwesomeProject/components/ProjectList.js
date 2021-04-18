import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  FlatList,
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
     console.log("this is the user"+ route.params.user);
    const [projects, changeProjects] = useState(null);
    const [user, changeUser] = useState(null);
    /* Takes the users info looking for the users projects */
  
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
   
    return (
    <TopBar navigation = {navigation}>
      <Drawer userInfo={route.params.user} navigation={navigation}></Drawer>
      <TouchableHighlight 
        style={{width: "15%", left: "88%", top: -10, position: 'absolute'}}
        onPress={() => {
          //navigation.navigate("ProjectCreation", { user: GLOBALUSERID});
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

  if(project != null) {
    return (
      <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}>
        <TouchableHighlight
          onPress = {() => {
            props.navigation.navigate('Project', {project: project.ID, user: props.user});}}
        >
          <View>
            <Text style={{fontSize: 20}}>
              {project.title}
            </Text>
            <Text>{project.tasks.length - 1} Task(s)</Text>
            <Text>Due Date: {project.dueDate} </Text>
            <Text>{project.users.length} User(s)</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  } else {
    return (
    <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}>
      <TouchableHighlight
        onPress = {() => {props.navigation.navigate('Project', {project: props.project.ID, user: props.user});}}
      >
        <View>
          <Text style={{fontSize: 20}}>
            Title
          </Text>
          <Text>0 Task(s)</Text>
          <Text>Due Date: due </Text>
          <Text>0 User(s)</Text>
        </View>
      </TouchableHighlight>
    </View>
    );
  }
}