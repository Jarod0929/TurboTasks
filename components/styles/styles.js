import {
    StyleSheet
  } from 'react-native';
  

let spiroDiscoBall = '#19d9ff';

const styles = StyleSheet.create({
  settingsPage:{
    backgroundColor:'white',
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
    height: "80%", 
    width: "80%", 
    margin:"10%", 
    alignItems: "center",
    zIndex: 1,
    backgroundColor:'#66ccff',
    borderWidth: 5,
    borderRadius:15,
  },
  projectCreationPlusPosition:{
    width: "15%",
    left: "88%", 
    top: "-1%", 
    position: 'absolute', 
    zIndex: 200
  },
  projectCreationPlusDesign:{
    color: "blue",
    fontSize: 50
  },
  projectListMainView:{
    backgroundColor: "white",
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  projectListPanel:{
    margin: "5%",
    width: "90%", 
    padding: "5%", 
    backgroundColor: "#1167b1", 
    borderRadius: 15,
    alignItems: 'center'
  },
  taskPanel: {
    width: '100%',
    flexDirection: "row",
    marginBottom: "2%"
  },
  taskPanelLeft: {
    padding: '5%',
    width: "50%", 
    backgroundColor: '#1167b1'
  },
  taskPanelEdit: {
    width: "100%", 
    padding: "5%", 
    backgroundColor: "#187bcd", 
    alignItems: 'center'
  },
  taskPanelSubtasks: {
    width: "100%", 
    padding: "5%", 
    backgroundColor: "#2a9df4", 
    alignItems: 'center'
  },
  taskPanelEmpty: {
    margin: "5%", 
    width: "90%", 
    height: "0%"
  },
  projectTaskListConatiner: {
    top: 0, 
    height: "100%", 
    width: "100%", 
    backgroundColor: "white"
  },
  editTaskMainView:{
    padding: 5, 
    backgroundColor: 'white', 
    height: '90%', 
    alignItems: 'center'
  },
  editTaskInputs:{
    width: '75%', 
    borderWidth: 2, 
    borderColor: 'blue', 
    borderRadius: 4
  },
  editTaskBottomBar:{
    width: '50%', 
    height: '10%', 
    backgroundColor: 'cyan',
    position: 'absolute', 
    bottom: 0, 
    alignItems: 'center',
    borderWidth:1,
    fontSize: 18
  },
  editTaskBottomBarButtons:{
    padding: "7%", 
    fontSize: 20
  },
  addTaskButton:{
    backgroundColor: spiroDiscoBall,
    padding: 5,
    margin: "2%",
    width: "45%",
    alignItems: 'center'
  },

});

module.exports = styles;