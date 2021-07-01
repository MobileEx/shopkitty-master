import React, {useState, useEffect} from 'react';
import {
  View,
  Text
} from 'react-native';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-community/async-storage';
import EStyleSheet from 'react-native-extended-stylesheet';
const About = (props) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [flag, setFlag] = useState(0);
  EStyleSheet.build({
    $theme: global.theme
  });
  global.page = 'About';
  useEffect(() => {
    const unscribe = props.navigation.addListener('didFocus', () => {
      EStyleSheet.build({
        $theme: global.theme
      });
      setFlag(1);
    })
    const unblur = props.navigation.addListener('didBlur', () => {
      setFlag(0);
    })
    return () => {
      unblur.remove();
      unscribe.remove();
    }
  }, [])
  useEffect(() => {
    async function getNamePhone() {
      let userName = await AsyncStorage.getItem('userName');
      let phoneNumber = await AsyncStorage.getItem('phoneNumber');
      setName(userName);
      setPhone(phoneNumber);
    }
    getNamePhone()
  }, [])

  return (
    <View style={styles.container}>
      <Header title='About' navigation={props.navigation}/>
      <View style ={{flex:1, marginTop: 80}}>
        <View style={styles.infoViewStyle}>
          <Text style={styles.textTitleStyle}>Name:</Text>
          <Text style={styles.textBodyStyle}>{name}</Text>
        </View>
        <View style={styles.infoViewStyle}>
          <Text style={styles.textTitleStyle}>Phone:</Text>
          <Text style={styles.textBodyStyle}>{phone}</Text>
        </View>
        <View style={styles.infoViewStyle}>
          <Text style={styles.textTitleStyle}>Version:</Text>
          <Text style={styles.textBodyStyle}>1.0</Text>
        </View>
      </View>
    </View>
);
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$theme.background'
    },
    infoViewStyle: {
      flexDirection: 'row',
      marginVertical: 10,
      marginHorizontal: 30
    },
    textTitleStyle: {
      fontFamily: 'Roboto-Medium', 
      fontSize: 20, 
      marginBottom: 20, 
      width: 130
    },
    textBodyStyle: {
      fontFamily: 'Roboto-Medium', 
      fontSize: 20, 
      marginBottom: 20
    }
  });
export default About;
