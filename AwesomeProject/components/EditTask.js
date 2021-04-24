
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  TextInput,
} from 'react-native';

import database from '@react-native-firebase/database';

import * as styles from './styles.js';
import Moment from 'moment';

const TopBar = (props) => {
    return (
      <View style = {styles.container}>
        <View style = {styles.topBarContainer}>
          <TouchableHighlight onPress = {()=>{
            props.navigation.goBack();
          }}>
            <View>
              <Text>
               GO BACK 
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        {props.children}
      </View>
    )
  };

//TO DO ADD UPDATE FUNCTIONALITY TO THE TASK NAMES
//Option 1: Line 189 shows the "isFocused()" can be combined with useEffect to rerender the component whenever the user enters the screen
//          Is not very efficient, but if all else fails, this should work
//          route.params.taskID, route.params.projectID, route.params.user
export function EditTask ({ navigation, route }){
  
    const [title, changeTitle] = useState(null);
    const [text, changeText] = useState(null);
    const [date, changeDate] = useState(Moment.locale('en'));
    useEffect(() => {
      database().ref(`/Database/Tasks/${route.params.taskID}`).once('value', snapshot => {
        changeTitle(snapshot.val().title);
        changeText(snapshot.val().text);
        if(snapshot.val().due != null && snapshot.val().due != ""){
          console.log('Due');
          console.log(snapshot.val().due);
  
          changeDate(Date(snapshot.val().due + "T00:00:00.000Z").toISOString());
        }
      });
    }, [route.params.taskID]);
  
    const deleteTasks = (delTaskID, projectID) => {
      database().ref("/Database/Tasks/" + delTaskID).once("value", snapshot => {
        if(snapshot.val().subTasks != undefined){
          for(let i = 0; i < snapshot.val().subTasks.length; i++){
            deleteTasks(snapshot.val().subTasks[i], projectID);
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
          database().ref("/Database/Projects/" + projectID).once("value", snap => {
            console.log(snap.val());
            const array = snap.val().tasks.filter(ID => ID != delTaskID);
            database().ref("/Database/Projects/" + projectID).update({
              tasks: array,
            });
            database().ref("/Database/Tasks/" + delTaskID).remove();
          });
        }
      });
      
    };
    
    const handleText = () => {
      //Sets proper month
      // let month = date.getMonth() + 1;
      // if(month < 10){
      //   month = "0" + month;
      // }
      database().ref(`/Database/Tasks/${route.params.taskID}`).update({
        title: title,
        text: text,
        // due: date.getTime()
      });
    }
    return(
        <TopBar  userInfo={route.params.user} navigation={navigation}>
          <View style={{padding: 5, backgroundColor: 'white', height: '90%', alignItems: 'center'}}>
            <Text style={{fontSize: 20}}>Task Title:</Text>
            <TextInput 
              style={{width: '75%', borderWidth: 2, borderColor: 'blue', borderRadius: 4}}
              onChangeText = {text => changeTitle(text)}
              value = {title}
            />
  
            <Text style={{fontSize: 20}}>Task Description:</Text>
            <TextInput         
              multiline
              numberOfLines={4}
              style={{width: '75%', borderWidth: 2, borderColor: 'blue', borderRadius: 4}}
              onChangeText = {text => changeText(text)}
              value = {text}
            />
    {/* 
            <Text style={{fontSize: 20}}>Due Date:</Text>
            <DatePicker
              date = {date} 
              mode = "date"
              onDateChange={changeDate}
            /> */}
          </View>
          <TouchableHighlight
            style={{width: '50%', height: '10%', backgroundColor: 'cyan',
                    position: 'absolute', bottom: 0, right: 0, alignItems: 'center',borderWidth:1}}
              onPress = {() => {
                handleText();
                changeTitle(null);
                changeText(null);
                changeDate(new Date());
                navigation.navigate('Project');
               // navigation.goBack();
              }}
            >
              <Text style={{fontSize: 30}}>Save Changes</Text>
            </TouchableHighlight>
             <TouchableHighlight
            style={{width: '50%', height: '10%', backgroundColor: 'cyan',
                    position: 'absolute', bottom: 0, alignItems: 'center',borderWidth:1}}
              onPress = {() => {
                deleteTasks(route.params.taskID, route.params.projectID);
                navigation.navigate('Project');
                //navigation.goBack();
              }}
            >
              <Text style={{fontSize: 30}}>Delete Task</Text>
            </TouchableHighlight> 
        </TopBar>
    );
}