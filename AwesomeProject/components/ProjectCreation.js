import React, {useState} from 'react';
import {
  Text,
  useColorScheme,
  View,
  TouchableHighlight,
  TextInput,
  FlatList,
  Image,
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
  const [checkUser, changeCheckUser] = useState(null);
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
        changeCheckUser(true)
      }
      else{
        changeCheckUser(false);
      }
      database().ref("/Database/Users").orderByChild("Username").equalTo(invUsers).off("value", something);
    });
    changeInvUsers("");
  };
    
  return (// TopBar is supposed to handle the Drawer and don't forget about it
    <TopBar navigation = {navigation} reset = {resetEverything}>
      <Drawer userInfo={route.params.user} navigation={navigation}></Drawer>
      <View style={{flex: 1, alightItems: "center", backgroundColor: "white", width: "100%", height: "100%", padding: 15}}>
        <View style = {{width: "100%", height: "30%"}}>
          <Image
            style = {{width: "70%", height:"70%", alignSelf: "center"}}
            shadowColor = "gray"
            resizeMode = "contain"
            source = {require("../assets/add-logo.webp")}
          >
          </Image>
          <Text
            style = {{alignSelf: "center", fontSize: 30, fontFamily: "Courier New", color: "darkorange"}}
          >
            Create a Project
          </Text>
        </View>
        <View style={{paddingLeft: 20, top: 10}}>
          <Text>Project Name</Text>
          <TextInput
            style = {{borderBottomColor: 'gray', color: 'black', borderBottomWidth: 1, width: "90%", height: 50, padding: 0, marginBottom: 20}}
            placeholder = "Office Function"
            onChangeText = {text => changeProjectName(text)}
            value={projectName}
          />
          <Text  style = {{marginBottom: 10}} >Due Date</Text>
          <DatePicker
            date={date}
            mode = "date"
            onDateChange={setDate}
            style = {{marginBottom: 20}}
            customStyles={{
            dateInput: {
              backgroundColor: "white",
              
            }
            // ... You can check the source to find the other keys.
            }}
          />
          <Text>Invite Users</Text>
          <View style = {{display: "flex", flexWrap: "wrap", flexDirection: "row",  marginBottom: 30, height: "20%"}}>
            <TextInput
              style = {{borderBottomColor: 'gray', borderBottomWidth: 1, width: "75%",height: 50, marginRight: "5%"}}
              placeholder = "Username"
              onChangeText = {text => changeInvUsers(text)}
              value={invUsers}
            />
            <View
              style = {{backgroundColor: "#1974d3", width: "20%", height: 40, marginTop: 10, alignContent: "center", borderWidth: 1, borderRadius: 10, borderColor: "#197FFF"}}
            >
              <TouchableHighlight onPress = {addUsersToList}
                style = {{borderWidth: 1, borderRadius: 10, borderColor: "#197FFF"}}
                activeOpacity={0.6}
                underlayColor="#00181"
              >
                <Text style = {{alignSelf:"center", color: "#E4FFFF", height: "100%", paddingTop: 10}}>Invite</Text>
              </TouchableHighlight>
            </View>
            {checkUser == true &&
            <Text>User Successfully Added!</Text>
            }
            {checkUser == false &&
              <Text>User Not Found</Text>
            }
          </View>
          <View style = {{height: "20%"}}>
            <View style = {{backgroundColor: "#AEFFFF", width: "60%", height: 60, borderWidth: 1, borderColor:"#82D1D1", borderRadius: 10, alignSelf: "center"}}>
              <TouchableHighlight onPress = {createNewProject}
                style = {{borderRadius: 10, height: "100%"}}
                activeOpacity={0.1}
                underlayColor="#00181"
              >
                <Text style = {{alignSelf: "center", paddingTop: 15, color: "#000181", fontSize: 20}}>Create Project</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
    </TopBar>
  );
}