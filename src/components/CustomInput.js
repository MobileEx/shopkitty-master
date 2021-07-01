import React, { Component } from 'react'
import { 
    StyleSheet,
    View,
    TextInput,
    Text,
    TouchableOpacity
} from 'react-native'

export default class CustomInput extends Component {
    constructor(props){
        super(props);
        this.state = {
            isfocus: false
        }
    }
    // focusFuc = () => {
    //     this.setState({isfocus: true})
    // }

    render() {
        const { inputWrapperStyle, inputStyle, phone, focusvalue} = this.props;
        return (
            <View style={[styles.textInputWrapper, inputWrapperStyle ]}>
                {phone != undefined && phone && focusvalue &&
                <View style={{justifyContent:'center', position:'absolute', left: 13, top:0, bottom:0}}>
                    <Text style={{color: '#000',fontSize: 16,fontFamily: 'Roboto-Italic'}}>+1</Text>
                </View>
                }
                <TextInput 
                    // autoFocus = {this.state.isfocus}
                    style={[styles.textInput, inputStyle]}
                    {...this.props}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInputWrapper: {
        flexDirection: 'row',
        height: 55,
        borderRadius: 10,
        backgroundColor: '#F2F2F2',
        marginHorizontal: 28,
        // justifyContent: 'center',
        overflow: 'hidden'
    },
    textInput: {
        fontSize: 16,
        paddingHorizontal: 24,
        paddingVertical: 5,
        color: '#000',
        width: '100%',
        fontFamily: 'Roboto-LightItalic'
    },
})
