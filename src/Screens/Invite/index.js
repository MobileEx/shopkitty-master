import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  ScrollView
} from 'react-native';
import Header from '../../components/Header';
import CustomButton from '../../components/CustomButton';
import Contacts from 'react-native-contacts';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import EStyleSheet from 'react-native-extended-stylesheet';

const Invite = (props) => {
  const [value, setValue] = useState('');
  const [contact, setContact] = useState('');
  const [checkedPhonenumber, setCheckedPhonenumber] = useState('');
  const [checkedName, setCheckedName] = useState('');
  const [flag, setFlag] = useState(0);
  global.page = 'Invite'
  const colors = ['#F6D4DD', '#C1E9F5', '#B8DEDE', '#F2E1FF', '#C8D4F5', '#BF9B9A', '#EEDAA5', '#D0EF8D', '#EAB1E5', '#C9B1EA' ]
  EStyleSheet.build({
    $theme: global.theme
  });
  useEffect(() => {
    const unscribe = props.navigation.addListener('didFocus', async() => {
      EStyleSheet.build({
        $theme: global.theme
      });
      setFlag(1);
      getFriendList();
    })
    const unblur = props.navigation.addListener('didBlur', () => {
      setFlag(0);
    })
    return () => {
      unblur.remove();
      unscribe.remove();
    }
  },[])

  const getFriendList = async() => {
    let phoneNumber = await AsyncStorage.getItem('phoneNumber');
    let friendref = firestore().collection('friends');
    return friendref.onSnapshot(querySnapshot => {
      const friendlist = [];
      querySnapshot.forEach(doc => {
        const {name, phone, id, created_at} = doc.data();
        if (created_at == phoneNumber){
          friendlist.push({name, phone, id, checked: false})
        }
      });
      setContact(friendlist);
    });
  }

  const itemCheckPress = (index) => {
    let clonelist = [...contact]
    let vitualName = clonelist[index].name;
    clonelist[index].checked = !clonelist[index].checked
    if (clonelist[index].checked){
      setCheckedPhonenumber([...checkedPhonenumber, clonelist[index].phone])
      setCheckedName([...checkedName, vitualName])
    } else {
      let filtered = checkedPhonenumber.filter(function(value) {return value != clonelist[index].phone})
      setCheckedPhonenumber(filtered)
      let filteredName = checkedPhonenumber.filter(function(value) {return value != vitualName})
      setCheckedName(filteredName)
    }
    setContact(clonelist);
  }; 

  const inviteNewChat = async() => {
    let phoneNumber = await AsyncStorage.getItem('phoneNumber');
    let userName = await AsyncStorage.getItem('userName');
    await Promise.all(checkedPhonenumber.map(async item => {
      if (item.includes('+')){
         return item.replace(/-/g, '')
      } else {
        return '+'+item.replace(/-/g, '')
      }
    })).then(res => {
      firestore().
      collection('sms')
      .add({
        from: phoneNumber,
        to: res,
        name: userName
      })
      .then(async(res) => {
        let docref = firestore().collection('sms').doc(res.id);
        await docref.update({
          id: res.id,
          timestamp: firestore.FieldValue.serverTimestamp()
        })
      })
    }) 
    global.invite = true
    global.groupmembersName = checkedName;
    props.navigation.navigate('Chats', {groupId:global.lastGroupId, groupmembers: checkedPhonenumber})
  }

  const inviteLastChat = async() => {
    let phoneNumber = await AsyncStorage.getItem('phoneNumber');
    let userName = await AsyncStorage.getItem('userName');
    await Promise.all(checkedPhonenumber.map(async item => {
      if (item.includes('+')){
        return item.replace(/-/g, '')
     } else {
       return '+'+item.replace(/-/g, '')
     }
    })).then(res => {
      firestore().
      collection('sms')
      .add({
        from: phoneNumber,
        to: res,
        name : userName
      })
      .then(async(res) => {
        let docref = firestore().collection('sms').doc(res.id);
        await docref.update({
          id: res.id,
          timestamp: firestore.FieldValue.serverTimestamp()
        })
      })
    })
   
    firestore()
    .collection('chatgroups')
    .doc(global.lastGroupId)
    .get()
    .then(querySnapshot => {
      checkedPhonenumber.map(item => {
        if (querySnapshot.data().groupmembers.includes(item)){
          return
        } else{
          querySnapshot.data().groupmembers.push(item)
        }
      })
      
      console.log('checkphoneNumber====',querySnapshot.data().groupmembers)
      firestore()
        .collection('chatgroups')
        .doc(global.lastGroupId)
        .update({
          groupmembers: querySnapshot.data().groupmembers,
          groupmembersName: [...checkedName]
        })
        .then(() => {
          console.log("updated")
        }
      )
    })
    console.log("checked",checkedName)   
    global.invite = true;
    global.groupmembersName = checkedName;
    props.navigation.navigate('ChatDetail', {groupId:global.lastGroupId, groupmembers: checkedPhonenumber})
  }

  const renderItem = ({item, index}) => {
    let colorItem = index%10;
    let nameArr = [];
    nameArr = item.name.split(' ');
    return (
      <View style={styles.listViewStyle}>
        <TouchableOpacity onPress={() => itemCheckPress(index)} style={{flexDirection: 'row'}}>
          <View style={{flex:1, justifyContent: 'center'}}>
            <View style={[styles.itemImageViewStyle, {backgroundColor: colors[colorItem]}]}>
              <Text style={styles.itemImageTextStyle}>{nameArr[0].substr(0,1).toUpperCase()}{nameArr[1] != undefined && nameArr[1].substr(0,1).toUpperCase()}</Text>
            </View>
          </View>
          <View style={{flex:4, justifyContent: 'space-around', }}>
            <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16}}>{item.name}</Text>
            <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14, color: '#6C6C6C'}}>{item.phone}</Text>
          </View>
          <View style={{justifyContent:"center"}}>
            <View style={styles.checkBoxStyle}>
              {item.checked&&
              <Image source={require('../../assets/ic_check.png')}/>
              }
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  } 
  return (
    <View style={styles.container}>
      <Header title='Invite' navigation={props.navigation}/>
      <ScrollView style={{marginTop: Platform.OS == 'ios'?30:15}}>
        <FlatList
          data={contact}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id}
        />
      </ScrollView>
      <CustomButton 
        ButtonStyle={{marginBottom: Platform.OS == 'ios'?20: 15, backgroundColor: '#E5D9E5'}}
        textValue='Invite To Last Chat'
        onPress={() => inviteLastChat()}/>
      <CustomButton 
        ButtonStyle={{marginBottom: Platform.OS == 'ios'?50:30}}
        textValue='Invite To New Chat'
        onPress={() => inviteNewChat()}/>
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
      marginVertical: 10,
      justifyContent: 'center'
    },
    checkBoxStyle:{
      width:20, 
      height: 20, 
      borderRadius: 4, 
      backgroundColor: '#ECE8EE', 
      justifyContent: 'center', 
      alignItems: 'center'
    }
  });
export default Invite;
