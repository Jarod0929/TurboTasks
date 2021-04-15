import {
    StyleSheet
  } from 'react-native';
  
const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      backgroundColor: "darkblue",
      
    },
    topBarContainer: {
      backgroundColor: "cyan",
      borderBottomRightRadius: 20,
      borderWidth: 5,
      height: '10%',
      width: '100%',
    },
    logInContainer: {
      flex: 1,
      //justifyContent: 'center',
      alignItems: "center",
    }, 
    logInSignInTitleContainer: {
      position: 'relative',
      top: 10,
      paddingBottom: 30,
    },
    logInSignInTitleText: {
      color: 'white',
      fontSize: 28,
    },
    logInTextInputContainer: {
      borderWidth: 5,
      height: 50,
      width: 150,
      backgroundColor:'white',
    },
    logInTextAreaContainer: {
      paddingBottom: 30,
    },
    logInTextAbove: {
      color: 'white',
      fontSize: 16,
    },
    logInButtonContainer: {
      backgroundColor: 'cyan',
      borderWidth: 5,
      borderRadius: 10,
      width: 175,
      height: 60,
      
    },
    logInButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logInButtonText: {
      color: 'black',
      fontSize: 18,
      fontWeight: 'bold',
    },
    logInCreateAccountContainer: {
      position: 'relative',
      bottom: 10,
      left: 10,
      flexDirection:'row', 
      flexWrap:'wrap',
    },
    AverageWhiteText: {
      color: 'white',
      fontSize: 16,
    },
    AverageWhiteTextBolded: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    logInRedFailedContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logInRedFailedText: {
      color: 'red',
      fontSize: 16,
    },
    drawerContainer: {
      width: '30%',
      height: '100%',
      backgroundColor: 'green',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 100,
    },
    drawerContainerOther: {
      width: '70%',
      height: '100%',
      backgroundColor: 'green',
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 100,
    },
});

module.exports = styles;