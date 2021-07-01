import React, { Component } from 'react'
import { 
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native'

export default class CustomButton extends Component {
    render() {
        const { ButtonStyle,textValue, onPress} = this.props;
        return (
            <TouchableOpacity onPress={onPress} style={[styles.Button, ButtonStyle ]}>
                <Text style={styles.textStyle}>{textValue}</Text>    
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    Button: {
        height: 55,
        borderRadius: 55,
        justifyContent: 'center',
        backgroundColor: '#ACE4E4',
        marginHorizontal: 28
    },
    textStyle: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        letterSpacing: 1
    },
})
