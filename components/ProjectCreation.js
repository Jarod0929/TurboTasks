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
  Dimensions,
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import database from '@react-native-firebase/database';
import Icon from "react-native-vector-icons/AntDesign";
import LinearGradient from 'react-native-linear-gradient'
import * as styles from './styles/styles.js';
import * as basicStyles from './styles/basicStyles.js';
import * as topBarStyles from './styles/topBarStyles.js';
import { baseProps } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';

/**
 * Establishes the entire container with all the children under the bar
 * 
 * @param {tag} {children} The rest of the tags of LogIn
 * @returns Top blue bar with all its children below it
 */



/*Project creation Page*/
export function ProjectCreation ({ route, navigation }) { 
  const user = route.params.user;//Current User
  const [projectName, changeProjectName] = useState('');//For the projectName field
  const [invUsers, changeInvUsers] = useState('');//For the inviteUsers field
  const [invUsersList, addUsersList] = useState([user]);//For the inviteUsers button
  const [date, setDate] = useState(new Date());//Date selector
  const [checkUser, changeCheckUser] = useState(null);//Used to check if user exists
  
  
  const addProjectIds = (userId, projectId) => {
    console.log(userId);
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
      <View style={{flex: 1, backgroundColor: "white", width: "100%", height: "100%"}}>
        <TopGradient
          colors= {["#187bcd", '#2a9df4', '#1167b1']}
          start= {{ x: 1, y: 1 }}
          end= {{ x: 0, y: 0 }}
          text = "Create a Project"
        >
          <TopIcon
            iconName = "addfolder"
            iconColor = "blue"
            iconSize = {100}
          />
        </TopGradient>
        <ContainerGradient
              style = {{width: "100%", height: "65%",  paddingTop: "5%"}}
              colors={['white', "lightgray"]}
              start={{ x: 1, y: 1 }}
              end={{ x: 1, y: 0 }}
        >
          <View style={{width: "100%"}}>
            <CreationBox>
              <TextInputBox 
                titleStyle = {{alignSelf: "center"}}
                titleText = "Project Name"
                inputStyle = {{borderBottomColor: 'gray', color: 'black', borderBottomWidth: 1, width: "90%", height: "90%", alignSelf: "center", textAlign: "center"}}
                placeholder = "Office Function"
                state = {projectName}
                changeState = {changeProjectName}
              />
            
              <Text  style = {{marginBottom: 10, alignSelf: "center"}} >Due Date</Text>
              <DatePicker
                date={date}
                mode = "date"
                onDateChange={setDate}
                style = {{marginBottom: 20, alignSelf: "center", left: "7%"}}
                customStyles={{
                dateInput: {
                  backgroundColor: "white", 
                }
                }}
              />
              <TextInputBox 
                titleStyle = {{alignSelf: "center"}}
                titleText = "Invite Users"
                inputStyle = {{borderBottomColor: 'gray', color: 'black', borderBottomWidth: 1, width: "75%", height: "90%", alignSelf: "center", textAlign: "center"}}
                placeholder = "Username"
                state = {invUsers}
                changeState = {changeInvUsers}
              />
              <InviteUsersTH 
                onPress = {addUsersToList}
                style = {{position: "absolute", marginLeft: "85%", top: "70%"}}
                activeOpacity={0.6}
                underlayColor="#00181"
              >
                <Icon
                  name="addusergroup" 
                  size = {35} 
                />
              </InviteUsersTH>
              {checkUser == true &&
              <Text style = {{alignSelf: "center"}}>User Successfully Added!</Text>
              }
              {checkUser == false &&
                <Text style = {{alignSelf: "center"}}>User Not Found</Text>
              }              
            </CreationBox> 
            <ButtonIconBox 
              onPress = {createNewProject}
              style = {{backgroundColor: "#2a9df4", width: "60%", height:"100%",  borderRadius: 10, alignSelf: "center"}}
              colors={["#187bcd", '#2a9df4']}
              start={{ x: 1, y: 1 }}
              end={{ x: 1, y: 0 }}
              activeOpacity={0.1}
              underlayColor="#00181"
              name="pluscircleo"
              color = "white"
            />
          </View>
        </ContainerGradient>
      </View>
    </TopBar>
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
            props.navigation.navigate("ProjectList", {user:props.userInfo})
          } 
          text={"ProjectList"}
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
const TopGradient = props =>{
  return(
    <LinearGradient
        style = {{width: "100%", height: "30%", padding: "3%"}}
        colors={props.colors}
        start={props.start}
        end={props.end}
    >
      <Text
        style = {{alignSelf: "center", fontSize: 35 * (Dimensions.get("screen").height/780), fontFamily: "Courier New", color: "white"}}
      >
        {props.text}
      </Text>
      {props.children}
    </LinearGradient>
  );
}
const TopIcon = props =>{
  return(
    <Icon name = {props.iconName} size={props.iconSize * (Dimensions.get("screen").height/780)} color={props.iconColor}  style={{alignSelf: "center", top: "5%"}} />
  );
}
const ContainerGradient = props =>{
  return(
    <LinearGradient
      style = {props.style}
      colors={props.colors}
      start={props.start}
      end={props.end}
    >
      {props.children}
    </LinearGradient>
  );
}
const CreationBox = props => {
  return(
    <View style = {{backgroundColor: "white", paddingTop: "5%", bottom: "10%", borderRadius: 10, height: "85%", width: "90%", alignSelf: "center"}}>
      {props.children}
    </View>
  );
}
const TextInputBox = props => {
  return(
    <View style = {{height: "18%", marginBottom: "8%",}}>
      <Text style = {props.titleStyle}>{props.titleText}</Text>
      <TextInput
        style = {props.inputStyle}
        placeholder = {props.placeholder}
        onChangeText = {text => props.changeState(text)}
        value={props.state}
      />
    </View>
  );
}
const InviteUsersTH = props =>{
  return(
    <TouchableHighlight 
      onPress = {props.onPress}
      style = {props.style}
      activeOpacity={props.activeOpacity}
      underlayColor= {props.underlayColor}
    >
      {props.children}  
    </TouchableHighlight>
  );
}
const ButtonIconBox = props =>{
  return(
    <View style = {{height: "15%", bottom: "5%"}}>
      <ContainerGradient
        style = {props.style}
        colors={props.colors}
        start={props.start}
        end={props.end}
      >
          <TouchableHighlight 
            onPress = {props.onPress}
            activeOpacity= {props.activeOpacity}
            underlayColor= {props.underlayColor}
            style = {{borderRadius: 10, height: "100%"}}
          >
            <Icon
              name= {props.name}
              color = {props.color}
              style={{alignSelf: "center", paddingTop: 17, color: "white", fontSize: 20}}
            >
              {'  '}Create Project
            </Icon>
          </TouchableHighlight>
      </ContainerGradient>
    </View>
  );
}