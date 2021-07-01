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
import CustomInput from '../../components/CustomInput';
import SearchBar from '../../components/SearchBar';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import EStyleSheet from 'react-native-extended-stylesheet';
import { conditionalExpression } from '@babel/types';
const _ = require('lodash');

const Friends = (props) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [counter, setCounter] = useState(0);
  const [selectItem, setSelectItem] = useState([]);
  const [friendList, setFriendList] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [flag, setFlag] = useState(0);
  const [showBottomView,setBottomView] = useState(true);
  const colors = ['#F6D4DD', '#C1E9F5', '#B8DEDE', '#F2E1FF', '#C8D4F5', '#BF9B9A', '#EEDAA5', '#D0EF8D', '#EAB1E5', '#C9B1EA']
  global.page = 'Friends'
  EStyleSheet.build({
    $theme: global.theme
  });
  useEffect(() => {
    const unscribe = props.navigation.addListener('didFocus', () => {
      getFriendList();
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
      console.log("Friend List ", JSON.stringify(friendlist));
      let array = _.sortBy( friendlist, 'name' );
      console.log("array ", array)
      setFriendList(array);
      setName('');
      setPhone('');
    });
  }

  const itemCheckLongPress = (index) => {
    let clonelist = [...friendList];
    console.log('cloneList', clonelist)
    let count = 0;
    let selectedItem = []    
    clonelist[index].checked = !clonelist[index].checked
    for(var i = 0; i < clonelist.length; ++i){
      if(clonelist[i].checked) {
        selectedItem.push(clonelist[i].id)
        count++;
      }
    }
    console.log(selectedItem)
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
    let phoneNumber = await AsyncStorage.getItem('phoneNumber');
    const ref = firestore().collection('friends');
  
  if(name != '' && phone != '')
  {
      await ref.add({
        name: name,
        phone: '+1 '+phone,
        created_at: phoneNumber
      })
      .then(async(res) => {
        let docref = firestore().collection('friends').doc(res.id);
        await docref.update({
          id:res.id,
          timestamp: firestore.FieldValue.serverTimestamp()
        }).then(async() => {
          getFriendList()
          props.navigation.goBack();
        })
      })
  }
  else
  {
    console.log("hii");
  }
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

  const searchItem = async (text) => {
    console.log("Serch ITEm",text);
    if(text)
    {
    let array = await friendList.filter(function (value) {
      console.log("Text", text);
        return JSON.stringify(value).includes(text) ;
    });
    setFriendList(array);
    console.log("Search Results");  
    }
    else 
    {
      getFriendList()
    }
  }

  const renderItem = ({item, index}) => {
    let nameArray = item.name.split(' ')
    let name = ''
    let colorItem = index % 10;
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
            <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16}}>{item.name}</Text>
            <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14, color: '#6C6C6C'}}>{item.phone}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  } 
  return (
    <View style={styles.container}>
      <Header title='Friends' navigation={props.navigation}  addPhotos={()=> props.navigation.navigate('Contacts')}/>
      <SearchBar placeholder="Search friend" onFocus={() => setBottomView(false)} onEndEditing={() => setBottomView(true)} onChangeText = {searchItem}/>
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
            data={friendList}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id}
        />
      </ScrollView>
      {
       showBottomView && <View>
      <CustomInput 
          inputWrapperStyle={{
              marginBottom: 10,
              paddingLeft: 10
          }}
          value={name}
          placeholder="Name"
          placeholderTextColor="#6C6C6C"
          onChangeText={(text)=>setName(text)}
      />
      <CustomInput 
          inputWrapperStyle={{
              marginBottom: 15,
              paddingLeft: 10
          }}
          phone={true}
          value={phone}
          focusvalue = {isFocus}
          onFocus = {() => onFocus()}
          placeholder="mobile phone(US)"
          keyboardType='numeric'
          placeholderTextColor="#6C6C6C"
          onChangeText={(text)=>{rearrange(text)}}
      />
      <CustomButton 
        ButtonStyle={{marginBottom: Platform.OS == 'ios'?50: 30, backgroundColor: (name == '' || phone == '')?'lightgray':'#ACE4E4'}}
        textValue='Add Friend'
        onPress={addFriend}/>
      </View>}
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
  });
export default Friends;
