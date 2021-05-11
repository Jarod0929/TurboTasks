import {
    StyleSheet
  } from 'react-native';
  

const basicStyles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: 0,
      },
      flexAlignContainer: {
        flex: 1,
        alignItems: "center",
        zIndex: 30,
      }, 
      titleContainer: {
        position: 'relative',
        top: 10,
        paddingBottom: 30,
        zIndex: 30,
      },
      titleText: {
        color: 'black',
        fontSize: 28,
        zIndex: 30,
      },
      textInputContainer: {
        borderWidth: 5,
        height: 50,
        width: 150,
        backgroundColor:'white',
        zIndex: 30,
      },
      textAreaContainer: {
        paddingBottom: 30,
        zIndex: 30,
      },
      defaultText: {
        color: 'black',
        fontSize: 16,
        zIndex: 30,
      },
      buttonContainer: {
        backgroundColor: 'cyan',
        borderWidth: 5,
        borderRadius: 10,
        width: 175,
        height: 60,
        marginBottom: 15,
        marginTop: 15,
        zIndex: 30
      },
      button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 30,
      },
      buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        zIndex: 30,
      },
      failedContainer: {
        zIndex: 30,
      },
      failedText: {
        color: 'red',
        fontSize: 16,
        zIndex: 30,
      },
});

module.exports = basicStyles;