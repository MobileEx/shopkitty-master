import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  ScrollView,
  PermissionsAndroid
} from 'react-native';
import Header from '../../components/Header';
import CustomButton from '../../components/CustomButton';
import Contacts from 'react-native-contacts';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import EStyleSheet from 'react-native-extended-stylesheet';
// import { constants } from 'http2';
// import console = require('console');
const _ = require('lodash');

const ContactList = (props) => {
  const [value, setValue] = useState('');
  const [contactData, setContactData] = useState('');
  const [checkedPhonenumber, setCheckedPhonenumber] = useState('');
  const [checkedName, setCheckedName] = useState('');
  const [flag, setFlag] = useState(0);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [counter, setCounter] = useState(0);
  const [selectItem, setSelectItem] = useState([]);
  const [friendList, setFriendList] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const colors = ['#F6D4DD', '#C1E9F5', '#B8DEDE', '#F2E1FF', '#C8D4F5', '#BF9B9A', '#EEDAA5', '#D0EF8D', '#EAB1E5', '#C9B1EA']
  global.page = 'Contacts'
  EStyleSheet.build({
    $theme: global.theme
  });


  useEffect(()=>{
    PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Contacts',
          'message': 'This app would like to view your contacts.',
          'buttonPositive': 'Please accept bare mortal'
        }
      ).then(() => {
        Contacts.getAll((err, contacts) => {
          if (err === 'denied'){
            // error
          } else {
              console.log("contancts",contacts);
              let array = _.sortBy( contacts, 'displayName' );
              setContactData(array);
              setFriendList(array);
              EStyleSheet.build({
                $theme: global.theme
              });
              setFlag(1);
            // contacts returned in Array
          }
        })
      })
  },[]);

  useEffect(() => {
    const unscribe = props.navigation.addListener('didFocus', () => {
    //   getFriendList();
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
      setFriendList(friendlist);
      setName('');
      setPhone('');
    });
  }

  const itemCheckLongPress = async (index) => {
    let clonelist = [...friendList];
    let count = 0;
    let selectedItem = [];
    
    
    clonelist[index].checked = ((clonelist[index].checked == undefined || clonelist[index].checked == null) || (clonelist[index].checked == false)) ? true :!clonelist[index].checked;
    console.log('cloneList', JSON.stringify(clonelist[index]));
    
     for(var i = 0; i < clonelist.length; ++i){
      if(clonelist[i].checked) {
        selectedItem.push(clonelist[i])
        count++;
      }
    }

    console.log("selected on click ",selectedItem)
    setCounter(count);
    setSelectItem(selectedItem);
  };

  const deleteItems = async() => {
    console.log(selectItem)
    await Promise.all(selectItem.map(item => {
      firestore()
      .collection('friends')
      .doc(item)
      .delete()
      .then(() => {
        console.log('User deleted!');
      });
    }))
    setCounter(0);
    setSelectItem([]);
  }

  const addFriend = async() => {

    let phoneNum = await AsyncStorage.getItem('phoneNumber');

    console.log("selectItem ", JSON.stringify(selectItem));

    let dataToBePosted = [];

    await selectItem.map(item =>{
        console.log("ITEM ",item)
        let name = item.displayName;
        let phone = item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : "";

        dataToBePosted.push({
            name : name,
            phone: phone,
            created_at: phoneNum
        })
    });

    var db = firestore();
    var batch = db.batch();

    dataToBePosted.forEach((doc) => {

        console.log("Adding ", JSON.stringify(doc));
        var docRef = db.collection("friends").doc(); //automatically generate unique id
        batch.set(docRef, doc);
      });
    
      batch.commit().then(res => {
        console.log("Res", res);
    });

    // // let phoneNumber = await AsyncStorage.getItem('phoneNumber');
    // const ref = firestore().collection('friends');
    // if (!selectedItem){
    //   await ref.add({
    //     name: name,
    //     phone: '+1 '+phone,
    //     created_at: phoneNum
    //   })
    //   .then(async(res) => {
    //     let docref = firestore().collection('friends').doc(res.id);
    //     await docref.update({
    //       id:res.id,
    //       timestamp: firestore.FieldValue.serverTimestamp()
    //     }).then(async() => {
    //       getFriendList()
    //       props.navigation.goBack();
    //     })
    //   })
    // }
    // else{
    //   setVisible(true)
    // }
  }

  const onFocus = () => {
    setIsFocus(true);
  }


  const rearrange = (text) => {
    let reg = /\+?1?\s*\(?-*\.*(\d{3})\)?\.*-*\s*(\d{3})\.*-*\s*(\d{4})$/
    let format = text.replace(reg, '$1-$2-$3');
    setPhone(format)
  }

  const addToInvite = async(item) => {
    let phoneNumber = await AsyncStorage.getItem('phoneNumber');
    const inviteref = firestore().collection('invites');
    await inviteref.add({
      name: item.name,
      phone: item.phone,
      created_at: phoneNumber
    })
    .then(async(res) => {
      let docref = firestore().collection('invites').doc(res.id);
      await docref.update({
        timestamp: firestore.FieldValue.serverTimestamp()
      }).then(async() => {
        props.navigation.navigate('Invite', {friendItem: item})
      })
    })
  }


  const renderItem = ({item, index}) => {
    let nameArray = item.displayName.split(' ')
    let name = ''
    let colorItem = index % 10;
    let phoneNumber = "";

    // console.log("Phone Number", item.phoneNumbers)

    if(item.phoneNumbers.length >0 && item.phoneNumbers[0].number)
    {
        phoneNumber = item.phoneNumbers[0].number;
    }
    for (let i=0; i<nameArray.length;i++){
      name = name+nameArray[i].substr(0,1).toUpperCase()
    }
    return (
      <View style={styles.listViewStyle}>
        <TouchableOpacity onLongPress={() => itemCheckLongPress(index)} style={{flexDirection: 'row', justifyContent:'center'}}>
          {item.checked&&
            <View style={styles.checkbuttonStyle}>
              <Image source={require('../../assets/ic_check.png')}/>
            </View>
          }
          <View style={{flex:1, justifyContent: 'center'}}>
            <View style={[styles.itemImageViewStyle, {backgroundColor: colors[colorItem]}]}>
              <Text style={styles.itemImageTextStyle}>{name}</Text>
            </View>
          </View>
          <View style={{flex:3, justifyContent: 'space-around', }}>
            <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16}}>{item.displayName}</Text>
            {/* <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14, color: '#6C6C6C'}}>{item.phone}</Text> */}
            <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14, color: '#6C6C6C'}}>{phoneNumber}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  } 

  
  return (
    <View style={styles.container}>
      <Header title='Contacts' navigation={props.navigation}/>
      {counter != 0 &&
      <View style={styles.selectedViewStyle}>
        <View style={{flex:1}}>
          <Text style={styles.selectTextStyle}>
            Selected: {counter}
          </Text>
        </View>
        <TouchableOpacity onPress={() => deleteItems()} style={{flex:1, alignItems:'flex-end'}}>
          <Image source={require('../../assets/ic_delete.png')}/>
        </TouchableOpacity>
      </View>
      }
      <ScrollView style={{marginTop: Platform.OS == 'ios'?30:15}}>
        <FlatList
          data={contactData}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id}
        />
      </ScrollView>
      <CustomButton 
        ButtonStyle={{marginBottom: Platform.OS == 'ios'?50: 30, backgroundColor: (name == '' || phone == '')?'lightgray':'#ACE4E4'}}
        textValue='Add Friend'
        onPress={(selectItem)&&addFriend}/>
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
    },
    checkbuttonStyle: {
        position: 'absolute', 
        width:22, 
        height:22, 
        top: 12, 
        right:2, 
        backgroundColor: '#ECE8EE', 
        borderRadius: 4, 
        borderWidth: 2, 
        borderColor: "#fff", 
        alignItems:'center', 
        justifyContent:'center'
      },
      selectedViewStyle: {
        marginTop: Platform.OS=='ios'?20:10, 
        flexDirection: 'row', 
        alignContent: 'space-between', 
        marginHorizontal: 20
      },
      selectTextStyle: {
        fontFamily: 'Roboto-Medium', 
        fontSize: 16, 
        color: '#6C6C6C'
      },  
  });
export default ContactList;
