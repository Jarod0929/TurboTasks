import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "white", 
        width: "100%", 
        height: "100%"
    },
    topGradient: {
        width: "100%", 
        height: "30%", 
        padding: "3%"
    },
    bottomLayerGradient:{
        width: "100%", 
        height: "65%",  
        paddingTop: "5%"
    },
    buttonIcon:{
        position: "absolute", 
        marginLeft: "85%", 
        top: "70%"
    },
    createButton:{
        width: "60%",
        height:"100%",  
        borderRadius: 10, 
        alignSelf: "center"
    },
    topText:{
        alignSelf: "center",  
        fontFamily: "Courier New", 
        color: "white"
    },
    topIcon:{
        alignSelf: "center", 
        top: "5%" 
    },
    creationBox:{
        backgroundColor: "white", 
        paddingTop: "5%", 
        bottom: "10%", 
        borderRadius: 10, 
        height: "85%", 
        width: "90%", 
        alignSelf: "center"
    },
    topTextInput:{
        borderBottomColor: 'gray', 
        color: 'black', 
        borderBottomWidth: 1, 
        width: "90%", 
        height: "90%", 
        alignSelf: "center", 
        textAlign: "center"
    },
    bottomTextInput:{
        borderBottomColor: 'gray', 
        color: 'black', 
        borderBottomWidth: 1, 
        width: "75%", 
        height: "90%", 
        alignSelf: "center", 
        textAlign: "center"
    },
    center:{
        alignSelf: "center"
    },
    textInputBoxView:{
        height: "18%", 
        marginBottom: "8%"
    },
    dateTitle: {
        marginBottom: 10,
        alignSelf: "center"
    },
    datePicker:{
        marginBottom: 20, 
        alignSelf: "center", 
        left: "7%"
    },
    buttonIconBoxView:{
        height: "15%", 
        bottom: "5%"
    },
    buttonIconBoxTH:{
        borderRadius: 10, 
        height: "100%"
    },
    buttonIconBoxDetails:{
        alignSelf: "center", 
        paddingTop: 17, 
        color: "white", 
        fontSize: 20
    }
});
  
module.exports = styles;