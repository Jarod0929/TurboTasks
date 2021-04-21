import React, {useState} from 'react';
import {
  Text,
  useColorScheme,
  View,
  TouchableHighlight,
  TextInput,
  FlatList,
} from 'react-native';
import DatePicker from 'react-native-datepicker'
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
        <TouchableHighlight onPress={()=>props.navigation.navigate("ProjectList",{user:props.userInfo})} style={styles.navigationButtons}><Text>ProjectList</Text></TouchableHighlight>
        

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
              props.reset();
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

/*Project creation Page*/
export function ProjectCreation ({ route, navigation }) { 
    //Insert the Project Code here
      
    //const user = GLOBALUSERID;
    const user = route.params.user;
    const [projectName, changeProjectName] = useState('');//For the projectName field
    const [invUsers, changeInvUsers] = useState('');//For the inviteUsers field
    const [invUsersList, addUsersList] = useState([user]);//For the inviteUsers button
    const [date, setDate] = useState(new Date());
    const addProjectIds = (userId, projectId) => {
      //Gets projects[] from user
      
      let add = database().ref(`/Database/Users/${userId}/projects`).on('value', snap => {
        if(snap.val() != null){
          let temp = snap.val();
          temp.push(projectId);
          //updates users project[] with newly created project
          database().ref(`/Database/Users/${userId}`).update({
            projects: temp,
          });
          database().ref(`/Database/Users/${userId}/projects`).off("value", add);
        }
        else{
          database().ref(`/Database/Users/${userId}`).update({
            projects: [projectId],
          });
          database().ref(`/Database/Users/${userId}/projects`).off("value", add);
        }
      });
  
    }
    const resetEverything = () => {
      changeProjectName("");
      changeInvUsers("");
      addUsersList([user]);
    };

    const createNewProject = () => {
        //Sets proper month
        //Creates Base Task
        const baseTask = database().ref("/Database/Tasks").push({
          parentTask: "none",
          title: "Click Me to Edit!",
          text: "Add a description..."
        });
        //baseTask ID
        const taskKey = baseTask.key;
        //Sets base Task ID
        baseTask.update({ID: taskKey});
      if(projectName != ""){
        //Initializes the new project
        const newData = database().ref("/Database/Projects").push({
          title: projectName,
          users: invUsersList,
          tasks: [taskKey],
          dueDate: date 
        });
        //Project ID
        const newDataKey = newData.key;
        //Sets project ID
        newData.update({ID: newDataKey});
        //Loops through users in invUsersList and adds project: id 
        invUsersList.forEach(element => addProjectIds(element, newDataKey));
        changeProjectName("");
        addUsersList([user]);
        navigation.navigate("ProjectList", {user: route.params.user, changed: newDataKey});
      }
    };
    const addUsersToList = () =>{
      let userID = "";
      let something = database().ref("/Database/Users").orderByChild("Username").equalTo(invUsers).on("value", snapshot => {
        for(let key in snapshot.val()){
          userID = key;
        }
        if(invUsers != "" && userID != ""){
          let list = invUsersList.slice();
          list.push(userID);
          addUsersList(list);
        }
        database().ref("/Database/Users").orderByChild("Username").equalTo(invUsers).off("value", something);
      });
      changeInvUsers("");
    };
    
    return (// TopBar is supposed to handle the Drawer and don't forget about it
      <TopBar navigation = {navigation} reset = {resetEverything}>
        <Drawer userInfo={route.params.user} navigation={navigation}></Drawer>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TextInput
          style = {styles.textInputLogIn}
          placeholder = "Project Name"
          onChangeText = {text => changeProjectName(text)}
          value={projectName}
        />
        <DatePicker
          date={date}
          mode = "date"
          onDateChange={setDate}
          customStyles={{
          dateInput: {
            backgroundColor: "white",
          }
          // ... You can check the source to find the other keys.
        }}
        />
        <Text>Invite Users</Text>
        <TextInput
          style = {styles.textInputLogIn}
          placeholder = "Username"
          onChangeText = {text => changeInvUsers(text)}
          value={invUsers}
        />
        <TouchableHighlight onPress = {addUsersToList}>
          <View
            style = {styles.buttonLogIn}
          >
            <Text>Invite User</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress = {createNewProject}>
          <View
            style = {styles.buttonLogIn}
          >
            <Text>Create Project</Text>
          </View>
        </TouchableHighlight>
        </View>
      </TopBar>
    );
  }