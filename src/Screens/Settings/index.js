import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Picker
} from 'react-native';
import Header from '../../components/Header';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EStyleSheet from 'react-native-extended-stylesheet';
import { themes } from '../../Themes';
import Toast from 'react-native-simple-toast';
import Dialog, {DialogContent, DialogFooter, DialogButton} from 'react-native-popup-dialog';

export let theme = themes.light;
const Settings = (props) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [change, setChange] = useState('');
  const [flag, setFlag] = useState(0);
  const [selectedValue, setSelectedValue] = useState("light"); 
  global.page = 'Settings'
  EStyleSheet.build({
    $theme: global.theme
  });

  useEffect(() => {
    const unscribe = props.navigation.addListener('didFocus', () => {
      EStyleSheet.build({
        $theme: global.theme
      });
      setFlag(1);
    });
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
      const userName = await AsyncStorage.getItem('userName');
      const phoneNumber = await AsyncStorage.getItem('phoneNumber');
      setName(userName);
      setPhone(phoneNumber);
    }
    getNamePhone();
  }, [])

  useEffect(() => {
    theme = selectedValue === 'light' ? themes.light : themes.dark;
    global.theme = theme;
    EStyleSheet.build({
      $theme: global.theme
    });
    AsyncStorage.setItem('theme', theme)
    setChange(theme)
  }, [selectedValue])

  const saveData = async() => {
    const userName = await AsyncStorage.getItem('userName');
    const phoneNumber = await AsyncStorage.getItem('phoneNumber');
    firestore()
    .collection('users')
    .where('phone', '==', phoneNumber)
    .get()
    .then(querysnapshot => {
      console.log(querysnapshot)
      let docId = ''
      querysnapshot.forEach(doc => {
        docId = doc.id
      })
      firestore()
        .collection('users')
        .doc(docId)
        .update({
          name: name,
          phone: phone
        })
        .then(() => {
          AsyncStorage.setItem('userName', name)
          AsyncStorage.setItem('phoneNumber', phone)
          global.number = phone
          setVisible(true);
          Toast.show("Changed Successfully.")
        })
    })
  }

  return (
    <View style={styles.container}>
      <Header title='Settings' navigation={props.navigation}/>
      <KeyboardAwareScrollView style={{marginTop: Platform.OS == 'ios'?30:20}}>
        <Text style={styles.textStyle}>Change Your name</Text>
        <CustomInput 
            inputWrapperStyle={{
                marginBottom: 20
            }}
            value={name}
            placeholder="Name"
            placeholderTextColor="#6C6C6C"
            onChangeText={(text)=>setName(text)}
        />
        <Text style={styles.textStyle}>Change Your Phone</Text>
        <CustomInput 
            inputWrapperStyle={{
                marginBottom: 20
            }}
            value={phone}
            placeholder="Phone"
            keyboardType='numeric'
            placeholderTextColor="#6C6C6C"
            onChangeText={(text)=>setPhone(text)}
        />
        <CustomButton 
          ButtonStyle={{marginVertical: 20}}
          textValue='Save'
          onPress={saveData}
        />      
        <Text style={styles.textStyle}>Change Theme</Text>
        <View style={styles.pickerViewStyle}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          >
            <Picker.Item label="Summer" value="light" />
            <Picker.Item label="Winter" value="dark" />
          </Picker>
        </View>
      </KeyboardAwareScrollView>
    </View>
);
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$theme.background'
    },
    background: {
      height:135,
      backgroundColor: '#E5D9E5',
      borderBottomLeftRadius: 30, 
      borderBottomRightRadius: 6,
    },
    itemImageViewStyle: {
      width: 55, 
      height:55, 
      borderRadius:10, 
      justifyContent:'center', 
      alignItems: 'center'
    },
    dashline : {
      borderWidth: 1,
      borderColor: '#ECE8EE',
      marginVertical: 15
    },
    itemImageTextStyle: {
      color: '#FFF', 
      fontSize: 18, 
      fontWeight: '800'
    },
    listViewStyle: {
      marginHorizontal: 20, 
      marginVertical: 10
    },
    textStyle: {
      fontFamily: 'Roboto-Medium', 
      fontSize: 14, 
      color: '#6C6C6C',
      marginHorizontal: 30,
      marginBottom: 10
    },
    pickerViewStyle: {
      borderColor: "#000",
      borderRadius: 10,
      borderWidth: 1,
      marginHorizontal: 28
    },
    dialogStyle: {
      paddingHorizontal: 50,
      paddingVertical: 25
    }
  });

export default Settings;
