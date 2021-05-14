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
    height: "85.5%", 
    width: "90%", 
    margin: "5%", 
    zIndex: 1,
    borderWidth: 4,
    borderRadius: 15,
    backgroundColor: "white",
    paddingTop: 15
  },
  inviteUserTextInput: {
    borderBottomColor: "gray", 
    borderBottomWidth: 1, 
    width: "75%",
    height: 45,
    marginLeft: "10%", 
    marginBottom: 10
  },
  projectCreationPlusPosition:{
    width: "15%",
    left: "85%", 
    top: "1%", 
    position: "absolute", 
    zIndex: 200,
    borderRadius: 150
  },
  projectCreationPlusDesign:{
    color: "#F4FCFF",
    fontSize: 50,
    alignSelf: "center"
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
    width: "75%",
    borderWidth: 2, 
    borderColor: "black", 
    borderRadius: 8,
    backgroundColor: "white",
    maxHeight: 95,
    marginLeft: "10%"
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
    marginTop: "8%",
    zIndex: 30,
  },
  editTitleTextInput: {
    borderBottomColor: "gray", 
    borderBottomWidth: 1, 
    width: "75%",
    height: 50,
    marginLeft: "10%", 
    marginBottom: 15
  },
  titleView:{
    maxWidth: "75%", 
    marginBottom: "3%"
  },
  titleText:{
    fontWeight: "bold", 
    fontSize: 20, 
    textAlign: "center",
    alignSelf: "center",
  },
  fullWidth:{
    width: "100%"
  },
  inputHeader:{
    marginLeft: "10%", 
    fontWeight: "bold", 
    fontSize: 18
  },
  inviteUserIcon:{
    position: "absolute", 
    left: "77%", 
    top: "28%", 
    borderRadius: 15
  },
  titleCharCount:{
    color: "gray", 
    left: "12%", 
    bottom: "6%"
  },
  titleCheckIcon:{
    position: "absolute", 
    left: "79%", 
    top:  "32%", 
    borderRadius: 15
  },
  titleXIcon:{
    position: "absolute", 
    left: "79%", 
    top:  "32%", 
    borderRadius: 15
  },
  descriptionCharCount:{
    color: "gray", 
    left: "12%"
  },
  descriptionHeader:{
    marginLeft: "10%", 
    fontWeight: "bold", 
    fontSize: 18, 
    marginBottom: "5%"
  },
  closeIcon:{
    position: "absolute", 
    right: "5%", 
    borderRadius: 20
  },
  saveOrCancelView:{
    width: "100%",  
    borderTopWidth: 1, 
    borderTopColor: "lightgray", 
    height: 85, 
    marginTop:"5%", 
    flexDirection: "row-reverse"
  },
  saveButton:{
    width: "25%", 
    marginLeft: "5%", 
    marginTop: "5%", 
    marginRight: "5%", 
    height: "75%", 
    backgroundColor: "#7AE0FF", 
    justifyContent: 'center', 
    alignItems: 'center', borderRadius: 13
  },
  saveButtonText:{
    color: "#F4FCFF", 
    fontWeight: "bold", 
    fontSize: 17
  },
  cancelButton:{
    width: "30%", 
    marginTop: "5%", 
    height: "75%", 
    backgroundColor: "#E3E3E3", 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 13
  },
  cancelButtonText:{
    color: "black", 
    fontWeight: "bold", 
    fontSize: 17
  },
  topBarTitle: {
    position: "absolute", 
    zIndex: 200, 
    alignSelf: "center", 
    color: '#F4FCFF',
    fontSize: 22, 
    fontWeight: "700", 
    top: "2%"
  },
});

module.exports = styles;