
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
export function EditTask ({ navigation, route }){
  
    const [title, changeTitle] = useState(null);
    const [text, changeText] = useState(null);
    const [date, changeDate] = useState(Moment.locale('en'));
    console.log(date);
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
            style={{width: '100%', height: '10%', backgroundColor: 'cyan',
                    position: 'absolute', bottom: 0, alignItems: 'center'}}
              onPress = {() => {
                handleText();
                changeTitle(null);
                changeText(null);
                changeDate(new Date());
                navigation.navigate('Project');
              }}
            >
              <Text style={{fontSize: 30}}>Save Changes</Text>
            </TouchableHighlight>
        </TopBar>
    );
}