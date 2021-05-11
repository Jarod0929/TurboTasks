import { faBorderNone } from '@fortawesome/free-solid-svg-icons';
import {
    StyleSheet
  } from 'react-native';
  

let spiroDiscoBall = "#19d9ff";

const styles = StyleSheet.create({
  settingsPage:{
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: "center",
  },
  innerSettingsPage:{
    backgroundColor:  "white",
    width: "80%",
    height: "100%",
  
  },
  projectListModal:{
    height: "84%", 
    width: "80%", 
    margin: "10%", 
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "#66ccff",
    borderWidth: 5,
    borderRadius: 15,
  },
  inviteUserTextInput: {
    borderBottomColor: "gray", 
    borderBottomWidth: 1, 
    width: "75%",
    height: 50, 
    textAlign: "center", 
    alignSelf: "center", 
    marginBottom: 10
  },
  projectCreationPlusPosition:{
    width: "15%",
    left: "88%", 
    top: "-1%", 
    position: "absolute", 
    zIndex: 200
  },
  projectCreationPlusDesign:{
    color: "blue",
    fontSize: 50
  },
  projectListMainView:{
    backgroundColor: "white",
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  projectListPanel:{
    margin: "5%",
    width: "90%", 
    padding: "5%", 
    backgroundColor: "#1167b1", 
    borderRadius: 15,
    alignItems: "center"
  },
  projectPanelInfoCentering: {
    alignItems: "center",
  },
  taskPanel: {
    width: "100%",
    flexDirection: "row",
    marginBottom: "2%"
  },
  taskPanelLeft: {
    padding: "5%",
    width: "50%", 
    backgroundColor: "#1167b1"
  },
  taskPanelEdit: {
    width: "100%", 
    padding: "5%", 
    backgroundColor: "#187bcd", 
    alignItems: "center"
  },
  taskPanelSubtasks: {
    width: "100%", 
    padding: "5%", 
    backgroundColor: "#2a9df4", 
    alignItems: "center"
  },
  taskPanelEmpty: {
    margin: "5%", 
    width: "90%", 
    height: "0%"
  },
  projectTaskListConatiner: {
    top: 0, 
    height: "80%", 
    width: "100%", 
    backgroundColor: "white"
  },
  editTaskMainView:{
    padding: 5, 
    backgroundColor: "white", 
    height: "90%", 
    alignItems: "center"
  },
  editTaskInputs:{
    width: "75%", 
    borderWidth: 2, 
    borderColor: "blue", 
    borderRadius: 4
  },

  editProjectDescriptionInputs:{
    width: "65%",
    borderWidth: 2, 
    borderColor: "black", 
    borderRadius: 4,
    backgroundColor: "white",
    maxHeight: 95,
  },

  editTaskBottomBar:{
    width: "50%", 
    height: "10%", 
    backgroundColor: "cyan",
    position: "absolute", 
    bottom: 0, 
    alignItems: "center",
    borderWidth: 1,
    fontSize: 18
  },
  editTaskBottomBarButtons:{
    padding: "7%", 
    fontSize: 20
  },
  editTaskTitleInput:{
    width: "100%",
  },
  addTaskButton:{
    backgroundColor: spiroDiscoBall,
    padding: 5,
    margin: "2%",
    width: "45%",
    top: 10,
    alignItems: "center"
  },
  taskModal:{
    backgroundColor: "#ccffff",
    width: "100%", 
    height: "100%",
    padding: "5%",
    borderRadius: 10,
  },
  centerSelf:{
    alignSelf: "center"
  },
  centerChildren:{
    alignContent: "center"
  },
  deleteProjectButton:{
    backgroundColor: "red",
    borderWidth: 5,
    borderRadius: 10,
    borderColor: "darkred",
    width: "75%",
    marginBottom: 15,
    marginTop: 15,
    zIndex: 30,
  },

});

module.exports = styles;