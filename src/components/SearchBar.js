import React,{Component} from 'react';
import {StyleSheet,View,TextInput,Text,FlatList} from 'react-native';

const SearchBar = (props) => {

    return(
        <View style = {styles.container}>
        {/* <Text style={styles.text}>{props.label}</Text> */}
        <TextInput  maxLength={400}  style = {(props.calledFrom == 'companyAccount')?styles.inputNonEditable:styles.input}
        {...props}/>
        {props.showList && <FlatList
            data = {props.selectList}
            renderItem={props.renderListItem}
        />}
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        // marginLeft:20,
        // marginRight :20,
        marginTop: 5,
        paddingTop: 2,
        paddingBottom :10,
        zIndex: 10
     },
    text:{
        marginLeft:10,
        fontSize:15,
        marginBottom:5,
        color:'#040505',
        fontFamily:'OpenSans-Regular'
    },

    input:{
        marginLeft:10,
        marginRight: 10,
        borderRadius:25,
        borderWidth :0.5, 
        borderColor:'#535353',
        backgroundColor:'white',
        paddingLeft:20,
        padding:10,
        color:'#000',
        fontSize: 16,
        fontFamily: 'Roboto-LightItalic'

    },
    inputNonEditable: {
        color: 'black',
        marginLeft:10,
        marginRight: 10,
        borderRadius:25,
        borderWidth :0.5, 
        borderColor:'#656565',
        backgroundColor:'white',
        paddingLeft:20,
        padding:15
    }
});

export default SearchBar;