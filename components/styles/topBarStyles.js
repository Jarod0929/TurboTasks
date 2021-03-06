import {
  StyleSheet
} from 'react-native';

const topBarStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    zIndex: 0,
  },
  topBarContainer: {
    backgroundColor: "#69C1F0",
    height: "9%",
    width: '100%',
    zIndex: 200,
    borderTopWidth: 2,
  },
  openContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    height: '80%',
    width: 40,
  },  
  drawerContainer: {
    width: '70%',
    height: '100%',
    backgroundColor: "#69C1F0",
    position: 'absolute',
    zIndex: 300,
    borderRightWidth: 2,
    borderTopWidth: 2,
  },
  navigationButtons:{
    paddingLeft: "5%",
    marginBottom: 20,
    height: 50,
    justifyContent: "center",
  }, 
  buttonText: {
    color: '#F4FCFF',
    fontSize: 22,
    zIndex: 30,
    fontWeight: "700"
  },
  buttonIconText:{
    color: '#F4FCFF',
    fontSize: 22,
    zIndex: 30,
    fontWeight: "700",
  },
  goBackButton:{
    paddingLeft: "5%",
    borderWidth: 0,
    marginBottom: 20,
    height: 50,
    justifyContent: "center",
    borderTopWidth: 1,
    borderColor: "#356178"
  },
  logoContainer:{
    width: "100%", 
    flexDirection: "row", 
    backgroundColor: "#5CA9D2",
    height: "15%", 
    paddingTop: "4%",
  },
  logoText:{
    fontSize:30, 
    fontWeight: "bold", 
    left: "5%", 
    color: "#F4FCFF"
  },
});

module.exports = topBarStyles;