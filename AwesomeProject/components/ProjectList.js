import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  FlatList,
} from 'react-native';

import database from '@react-native-firebase/database';
import * as styles from './styles.js';

const TopBar = ({children}) => {
    return (
      <View style = {styles.container}>
        <View style = {styles.topBarContainer}>
  
        </View>
        {children}
      </View>
    )
  };
  
export function ProjectList ({ route, navigation }) {
    
    const [projects, changeProjects] = useState(null);
  
    /* Takes the users info looking for the users projects */
  
    const handleProject = snapshot => {
      changeProjects(snapshot.val().projects);
    }
  
    /* if the user is null find the user using route params*/
    if(projects == null){
      //database().ref("/Database/Users/" + GLOBALUSERID).once("value", handleProject);
      database().ref("/Database/Users/" + route.params.user).once("value", handleProject);
    }
    return (
    <TopBar>
      <TouchableHighlight 
        style={{width: "15%", height: "15%", padding: 10, backgroundColor: "blue", left: "85%", top: 0}}
        onPress={() => {
          //navigation.navigate("ProjectCreation", { user: GLOBALUSERID});
          navigation.navigate("ProjectCreation", { user: route.params.user});
      }}
      >
        <View>
          <Text style={{color: "white", fontSize: 50}}>+</Text>
        </View> 
      </TouchableHighlight>
  
      <View style={{ top: "0%", height: "85%", backgroundColor: "white", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
            />
          </React.StrictMode>
  
          }
          keyExtractor={item => item.ID}
        />
      </View>
    </TopBar>
  );
    
}
  
  /* Each project Box the user has*/
const ProjectPanel = (props) => {
    const [project, changeProject] = useState(null);
  
    const handleProject = snapshot => {
      changeProject(snapshot.val());
    }
  
    if(project == null) {
      database().ref("/Database/Projects/" + props.project).once("value", handleProject);
    }
  
    if(project != null) {
      return (
        <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}>
          <TouchableHighlight
            onPress = {() => {
              props.navigation.navigate('Project', {project: project.ID});}}
          >
            <View>
              <Text style={{fontSize: 20}}>
                {project.title}
              </Text>
              <Text>{project.tasks.length} Task(s)</Text>
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
          onPress = {() => {props.navigation.navigate('Project', {project: props.project.ID});}}
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

/*
export function ProjectList ({ route, navigation }) {
    
  const [projects, changeProjects] = useState(null);

  // Takes the users info looking for the users projects 

  const handleProject = snapshot => {
    changeProjects(snapshot.val().projects);
  }

  // if the user is null find the user using route params
  if(projects == null){
    //database().ref("/Database/Users/" + GLOBALUSERID).once("value", handleProject);
    database().ref("/Database/Users/" + route.params.user).once("value", handleProject);
  }

  // if no projects are present output this
  if(projects != null && projects.length == 0){
    return (// TopBar is supposed to handle the Drawer and don't forget about it
    <TopBar>
      <TouchableHighlight 
        style={{width: "15%", height: "15%", padding: 10, 
                backgroundColor: "blue", left: "85%", top: 0}}
        onPress={() => {
         //navigation.navigate("ProjectCreation",{user: GLOBALUSERID});
         navigation.navigate("ProjectCreation",{user: route.params.user});
        }}
      >
        <View>
          <Text style={{color: "white", fontSize: 50}}>+</Text>
        </View> 
      </TouchableHighlight>
      <View style={{ top: "0%", height: "85%", backgroundColor: "white", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>No Projects</Text> 
      </View>
    </TopBar>
    );
  } 
  //If the user has at least one project output this
  else {
    return (// TopBar is supposed to handle the Drawer and don't forget about it
      
      <TopBar>
        <TouchableHighlight 
          style={{width: "15%", height: "15%", padding: 10, 
                  backgroundColor: "blue", left: "85%", top: 0}}
          
          onPress={() => {
            //navigation.navigate("ProjectCreation", { user: GLOBALUSERID});
            navigation.navigate("ProjectCreation", { user: route.params.user});
        }}
        >
          <View>
            <Text style={{color: "white", fontSize: 50}}>+</Text>
          </View> 
        </TouchableHighlight>

        <View style={{ top: "0%", height: "85%", backgroundColor: "white", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <FlatList
            style={{width: "100%"}}
            data={projects}
            renderItem={({item}) => 
            <React.StrictMode>
              <ProjectPanel
                project = {item}
                navigation ={navigation}
              />
            </React.StrictMode>

            }
            keyExtractor={item => item.ID}
          />
        </View>
      </TopBar>
    );
  }
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

  if(project != null) {
    return (
      <View style={{margin: "5%", width: "90%", padding: "5%", backgroundColor: "orange", alignItems: 'center'}}>
        <TouchableHighlight
          onPress = {() => {
            props.navigation.navigate('Project', {project: project.ID});}}
        >
          <View>
            <Text style={{fontSize: 20}}>
              {project.title}
            </Text>
            <Text>{project.tasks.length} Task(s)</Text>
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
        onPress = {() => {props.navigation.navigate('Project', {project: props.project.ID});}}
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
*/