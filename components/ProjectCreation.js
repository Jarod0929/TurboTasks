import React, {useState} from 'react';
import {
  Text,
  useColorScheme,
  View,
  TouchableHighlight,
  TextInput,
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import database from '@react-native-firebase/database';
import Icon from "react-native-vector-icons/AntDesign";
import LinearGradient from 'react-native-linear-gradient'
import * as styles from './styles.js';

/**
 * Establishes the entire container with all the children under the bar
 * 
 * @param {tag} {children} The rest of the tags of LogIn
 * @returns Top blue bar with all its children below it
 */

const TopBar = (props) => {
  const [drawer, changeDrawer] = useState(false);
  return (
    <View style = {styles.container}>
      <View style = {styles.topBarContainer}>
        <View style = {styles.openContainer}>
          <TouchableHighlight
            onPress = {() => {
              changeDrawer(!drawer);
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            }}
            style={styles.openDrawerButton}
          >
            <Text style = {styles.textAbove}>Open</Text>
          </TouchableHighlight>
        </View>
      </View>
      <View style = {[styles.drawerContainer, drawer? undefined: {width: 0}]}>
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
          onPress = {()=>{
            props.reset();
            props.navigation.goBack();
          }}
          style={styles.navigationButtons}
        >
          <Text>
            Go Back
          </Text>
        </TouchableHighlight>
        <TouchableHighlight 
          onPress={()=>props.navigation.navigate("ProjectList",{user:props.userInfo})}
          style={styles.navigationButtons}
        >
          <Text>
            ProjectList
            </Text>
        </TouchableHighlight>
      </View>
      {props.children}
    </View>
  )
};

/*Project creation Page*/
export function ProjectCreation ({ route, navigation }) { 
  const user = route.params.user;//Current User
  const [projectName, changeProjectName] = useState('');//For the projectName field
  const [invUsers, changeInvUsers] = useState('');//For the inviteUsers field
  const [invUsersList, addUsersList] = useState([user]);//For the inviteUsers button
  const [date, setDate] = useState(new Date());//Date selector
  const [checkUser, changeCheckUser] = useState(null);//Used to check if user exists
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

  //Resets all relevant states
  const resetEverything = () => {
    changeProjectName("");
    changeInvUsers("");
    addUsersList([user]);
  };

  //Creates the new Project using the previous states
  const createNewProject = () => {
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
  //Adds users to list state to be used in createNewProject()
  const addUsersToList = () =>{
    let userID = "";
    //Checks if users exist
    let something = database().ref("/Database/Users").orderByChild("Username").equalTo(invUsers).on("value", snapshot => {
      for(let key in snapshot.val()){
        userID = key;
      }
      //IFF user exists adds them to list
      if(invUsers != "" && userID != ""){
        let list = invUsersList.slice();
        list.push(userID);
        addUsersList(list);
        changeCheckUser(true)
      }
      //Displays user does not exist
      else{
        changeCheckUser(false);
      }
      database().ref("/Database/Users").orderByChild("Username").equalTo(invUsers).off("value", something);
    });
    //Resets field for invUsers
    changeInvUsers("");
  };
    
  return (// TopBar is supposed to handle the Drawer and don't forget about it
    <TopBar navigation = {navigation} reset = {resetEverything} userInfo={route.params.user}>
      {/* {<Drawer userInfo={route.params.user} navigation={navigation}></Drawer>} */}
      {/*PARENT VIEW*/ }
      <View style={{flex: 1, backgroundColor: "white", width: "100%", height: "100%"}}>
        {/*LOGO AND TEXT VIEW*/ }
        <LinearGradient
              style = {{width: "100%", height: "30%", padding: 10}}
              colors={["#187bcd", '#2a9df4', '#1167b1']}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
            >
            <Text
            style = {{alignSelf: "center", fontSize: 35, fontFamily: "Courier New", color: "white"}}
          >
            Create a Project
          </Text>
          <Icon name="addfolder" size={100} color="blue"  style={{alignSelf: "center", top: 10}} ></Icon>

          </LinearGradient>
        {/* INPUT VIEW */ }
        <LinearGradient
              style = {{width: "100%", height: "78%",  paddingTop: 20}}
              colors={['white', "lightgray"]}
              start={{ x: 1, y: 1 }}
              end={{ x: 1, y: 0 }}
        >
          <View style={{padding: 20}}>
            <View style = {{backgroundColor: "white", padding: 10, bottom: 50, borderRadius: 10, height: "80%"}}>
              <Text style = {{alignSelf: "center"}}>Project Name</Text>
              <TextInput
                style = {{borderBottomColor: 'gray', color: 'black', borderBottomWidth: 1, width: "90%", height: 50, padding: 0, marginBottom: 30, alignSelf: "center", textAlign: "center"}}
                placeholder = "Office Function"
                onChangeText = {text => changeProjectName(text)}
                value={projectName}
              />
            
              <Text  style = {{marginBottom: 10, alignSelf: "center"}} >Due Date</Text>
              <DatePicker
                date={date}
                mode = "date"
                onDateChange={setDate}
                style = {{marginBottom: 20, alignSelf: "center", left: 20}}
                customStyles={{
                dateInput: {
                  backgroundColor: "white",
                  
                }
                // ... You can check the source to find the other keys.
                }}
              />
            <Text style = {{alignSelf: "center"}}>Invite Users</Text>
            {/*INVITE USER VIEW (USED TO PUT BUTTON AND INPUT ON ONE LINE)*/ }
            <View style = {{marginBottom: 0, height: "20%"}}>
              <TextInput
                autoFocus={true}
                style = {{borderBottomColor: 'gray', borderBottomWidth: 1, width: "75%",height: 50, textAlign: "center", alignSelf: "center", marginBottom: 10}}
                placeholder = "Username"
                onChangeText = {text => changeInvUsers(text)}
                value={invUsers}
              />
               <TouchableHighlight onPress = {addUsersToList}
                  style = {{position: "absolute", marginLeft: 295, top: 10}}
                  activeOpacity={0.6}
                  underlayColor="#00181"
                >
                  <Icon
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
            </View>
            </View> 
            {/*CREATE PROJECT BUTTON*/ }
            <View style = {{height: "5%"}}>
              <LinearGradient
                style = {{backgroundColor: "#2a9df4", width: "60%", height: 60,  borderRadius: 10, alignSelf: "center"}}
                colors={["#187bcd", '#2a9df4']}
                start={{ x: 1, y: 1 }}
                end={{ x: 1, y: 0 }}
                >
                  <TouchableHighlight onPress = {createNewProject}
                    style = {{borderRadius: 10, height: "100%"}}
                    activeOpacity={0.1}
                    underlayColor="#00181"
                  >
                    <Icon
                     name="pluscircleo"
                     color = "white"
                     style={{alignSelf: "center", paddingTop: 17, color: "white", fontSize: 20}}
                    >
                      {'  '}Create Project
                    </Icon>
                  </TouchableHighlight>
              </LinearGradient>
            </View>
          </View>
        </LinearGradient>
      </View>
    </TopBar>
  );
}