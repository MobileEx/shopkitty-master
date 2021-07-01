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
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import firestore from '@react-native-firebase/firestore';
import {connect} from 'react-redux';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import EStyleSheet from 'react-native-extended-stylesheet';
import { conditionalExpression } from '@babel/types';

const Chats = (props) => {

  // console.log("Complete Chats");

  const [data, setData] = useState([]);
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [counter, setCounter] = useState(0);
  const [iscount, setIscount] = useState(0);
  const [selectItem, setSelectItem] = useState([]);
  const [flag, setFlag] = useState(0);
  const [name,setName] = useState('');
  const [badge, showBadge] = useState([]);
  EStyleSheet.build({
    $theme: global.theme
  });
  const user1 =['AM', 'VN', 'DF', 'SD', 'DS', 'LK', 'BN', 'MV', 'QW', 'BV'];
  const user2 = ['LM', 'WE', 'RE', 'TG', 'YU', 'OP', 'SD', 'DF', 'NB', 'CV']
  const color1 = ['#F6D4DD', '#C1E9F5', '#B8DEDE', '#F2E1FF', '#C8D4F5', '#BF9B9A', '#EEDAA5', '#D0EF8D', '#EAB1E5', '#C9B1EA']
  const color2 = ['#BDABD6', '#A0E6E0', '#A0E6C9', '#D8DA92', '#EABDF0', '#D8B2A6', '#AE928E', '#D0EF8D', '#B4DEB8', '#EAA0E0' ]
  global.page = 'Chats'
  
  const udpateName = async () => {
    let name = await AsyncStorage.getItem('userName');
    setName(name);
  }
  
  useEffect(() => {

    udpateName();
    const unscribe = props.navigation.addListener('didFocus',() => {
      
      // firestore()
      //   .collection('chatgroups')    
      //   .onSnapshot((documentSnapshot) => {
      //     let chatgroupData = [];
      //     documentSnapshot.forEach(doc => {
      //       doc.data().checked = false;
      //       chatgroupData.push(doc.data())
      //     })

      // setName(result);
      // AsyncStorage.getItem('userName').then((err,result)=> {
      // });

      //  let userName = props.navigation.getParam('userName');
      //  setName(userName);

        // console.log("Chat Group Data",JSON.stringify(global.chatList));

        let chatgroupData = global.chatgroupData.filter(function(value){return value.groupmembers.indexOf(global.phone) > -1})
        if (chatgroupData.length>0){
          setData(chatgroupData.sort(function(a,b){return b.timestamp.seconds - a.timestamp.seconds}));
          // setName(props.navigation.getParam('name'))
        }
      // })
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
  }, []);

  const moveToChatPage = (item) => {
    // console.log(item);
    updateUnseenMessaage(item);
    global.chatTitle = item.title;
    let postPhotos = props.navigation.getParam('postPhotos', {})
    props.navigation.navigate('ChatDetail', {groupId: item.id, postPhotos:postPhotos});
  }

  const createNewChat = async () => {
    let phoneNumber = await AsyncStorage.getItem('phoneNumber');
    let groupmember = props.navigation.getParam('groupmembers', '');    
    global.chatTitle = value;
    const ref = firestore().collection('chatgroups');
    let groupmembers = [];
    if (groupmember != ''){
      groupmembers.push(...groupmember, phoneNumber)
    } else {
      groupmembers.push(phoneNumber)
    }
    let currentTimeStamp = Math.round(new Date().getTime()/1000);
    let groupId = '';
    if (value != ''){
      await ref.add({
        title: value,
        created_at: phoneNumber,
        creationDate : currentTimeStamp

      })
      .then(async(res) => {
        let docref = firestore().collection('chatgroups').doc(res.id);
        groupId = res.id;
        await docref.update({
          id: res.id,
          groupmembers: groupmembers,
          timestamp: firestore.FieldValue.serverTimestamp()
        }).then(async() => {
          return await ref.onSnapshot(querySnapshot => {
            const list = [];
            querySnapshot.forEach(doc => {
              const {title, timestamp, id, created_at} = doc.data();
              if (created_at == phoneNumber){
                list.push({title, timestamp, id, created_at})
              }
            });
            setValue('');
            setData(list)
          });
        })
        props.navigation.navigate('ChatDetail', {groupId: groupId, newChat:true})
      })
    }
    else{
      setVisible(true)
    }
  }

  async function updateUnseenMessaage(group) 
  {
    let chatlist = global.chatList.filter(chatItem=> chatItem.groupId == group.id && chatItem.userId != global.phone)
    let unSeenMessage = [];
    
    let phoneNumber = await AsyncStorage.getItem('phoneNumber');


    chatlist.map(item=> {
      if(item.isSeen !== undefined && item.isSeen.indexOf(global.phone)>-1)
      return
      unSeenMessage.push(item);
    });
    // console.log("Unseen Message ", unSeenMessage);
   let ref = firestore().collection('chats');
  
   unSeenMessage.forEach( async (item) => {
     console.log("Phone Number", phoneNumber);
     console.log("Unseen Message item ", item)


     await ref.doc(item.id).update({
      isSeen : [ ...item.isSeen, phoneNumber]
    }).then((res) => {
        console.log("result ",res)    
      });
   })
  
  }

  const itemCheckLongPress = (index) => {
    let clonelist = [...data];
    let count = 0;
    let selectedItem = []    
    clonelist[index].checked = !clonelist[index].checked
    for(var i = 0; i < clonelist.length; ++i){
      if(clonelist[i].checked) {
        selectedItem.push(clonelist[i].id)
        count++;
      }
    }
    setCounter(count);
    setSelectItem(selectedItem);
    showBadge(false);
  };

  const deleteItems = async() => {
    await Promise.all(selectItem.map(item => {
      firestore()
      .collection('chatgroups')
      .doc(item)
      .delete()
      .then(() => {
        console.log('User deleted!');
      });
    }))
    setCounter(0);
    setSelectItem([]);
  }

  const unreadCount = (group) => {
    let count = 0;
    let chatlist = global.chatList.filter(chatItem=> chatItem.groupId == group.id && chatItem.userId != global.phone)
    
    // console.log("Chat list in unread ",chatlist);

    chatlist.map(item=> {
      if(item.isSeen !== undefined && item.isSeen.indexOf(global.phone)>-1)
      return 
      count++
    })
    firestore()
    .collection('chats')
    .onSnapshot(querySnapshot => {
      // setIscount(count)
    })
    if (count>0){
      return( 
      <View style={{width: 18, height: 18, borderRadius: 18, backgroundColor:'#FF5845', justifyContent: 'center', alignItems:'center'}}>
        <Text style={{textAlign: 'center', color: '#FFF', fontSize: 12, fontWeight: '600', fontFamily: 'Roboto-Medium'}}>{count}</Text>
      </View>
      )
    }
  }

  const renderItem = ({item, index}) => {

    // console.log("Chat item ", item);
    let time = '';
    if (item.timestamp != undefined){
      time = moment.unix(item.timestamp.seconds).format('hh:mm');
    }
    let colorItem = index % 10;
   
    return (
      <View style={{marginHorizontal: 25}}>
        <TouchableOpacity onLongPress={() => itemCheckLongPress(index)} onPress={() => moveToChatPage(item)} style={{flexDirection: 'row',marginVertical: 20, justifyContent:'center'}}>
          <View style={{flex:1, justifyContent: 'center'}}>
            {item.checked&&
            <View style={styles.checkbuttonStyle}>
              <Image source={require('../../assets/ic_check.png')}/>
            </View>
            }
            <View style={{top: -8, marginHorizontal: 10}}>
            {item.groupmembers != undefined && item.groupmembers.length>1&&<View style={[styles.item1ImageViewStyle, {backgroundColor: color1[colorItem]}]}>
                
                <Text style={{fontSize: 16, color:'#fff'}}>{name.substring(0, 2)}</Text>
                
              </View>}
              {item.groupmembers != undefined && item.groupmembers.length>1&&<View style={[styles.item2ImageViewStyle, {backgroundColor: color2[colorItem]}]}>
                
                <Text style={{fontSize: 15, color:'#fff', fontWeight:'700'}}>{item.groupmembersName[0].substring(0, 2)}</Text>
              
              </View>}

              {
                (item.groupmembers == undefined || item.groupmembers.length == 1 ) && <View style={[styles.item3ImageViewStyle, {backgroundColor: color2[colorItem]}]}>
                
                <Text style={{fontSize: 16, color:'#fff'}}>{name.substring(0, 2)}</Text>
              </View>
              }

            </View>
          </View>
          <View style={{flex:6, marginLeft: 30}}>
            <Text style={styles.nameTextStyle}>{item.title}</Text>
            <Text style={styles.contentTextStyle}>{item.content}</Text>
          </View>
          <View style={styles.badgeViewStyle}>
            <Text style={{fontFamily: 'Roboto-Medium', fontSize: 10, color: '#B3BDD8'}}>{time}</Text>
            {unreadCount(item)}
            {/* {!item.badge?null: */}
            {/* <Text>{unreadCount(item)}</Text> */}
            {/* <Image source={require('../../assets/chat_badge.png')}/> */}
            {/* } */}
          </View>
        </TouchableOpacity>
        <View style={styles.dashline}/>
      </View>
    )
  } 
  return (
    <View style={styles.container}>
      <Header title='Chats' navigation={props.navigation}/>
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
      <ScrollView style={{marginBottom: 5, marginTop:5}}>
        <FlatList
            data={data}
            extraData={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id}
        />
      </ScrollView>
      <CustomInput 
          inputWrapperStyle={{
              marginBottom: 15  
          }}
          placeholder="Title"
          placeholderTextColor="#6C6C6C"
          value={value}
          onChangeText={(text) => setValue(text)}
      />
      <CustomButton 
        ButtonStyle={{marginBottom: Platform.OS == 'ios'?50:30, backgroundColor: value == ''?'lightgray':'#ACE4E4'}}
        textValue='Start New Chat'
        onPress={()=>  value != ''&&createNewChat()}/>
    </View>
);
}
const mapStateToProps = state => {
  return{
  };
};

const mapDispatchToProps = dispatch => {
  return {   
  }
}
const ChatsScreen = connect(mapStateToProps, mapDispatchToProps)(Chats)
export default ChatsScreen;
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
    dashline : {
      borderWidth: 1,
      borderColor: '#ECE8EE',
      marginBottom: 5
    },
    item1ImageViewStyle: {
      width: 38, 
      height:38, 
      borderRadius:20,  
      justifyContent:'center', 
      alignItems: 'center'
    },
    item2ImageViewStyle: {
      position: 'absolute', 
      width: 38, 
      height:38, 
      borderRadius:20, 
      top: 12, 
      left: 10, 
      justifyContent:'center', 
      alignItems: 'center', 
      borderColor: '#FFF', 
      borderWidth: 2
    },
    item3ImageViewStyle: {
      // position: 'absolute', 
      width: 50, 
      height:50, 
      borderRadius:25,  
      // left: 10, 
      justifyContent:'center', 
      alignItems: 'center', 
      borderColor: '#FFF', 
      borderWidth: 2
    },
    nameTextStyle: {
      fontFamily: 'Roboto-Medium', 
      fontSize: 16
    },
    contentTextStyle: {
      fontFamily: 'Roboto-Medium', 
      fontSize: 12, 
      color: '#6C6C6C',
      marginVertical: 3
    },
    badgeViewStyle: {
      flex:1, 
      alignItems: 'flex-end', 
      justifyContent: 'space-between', 
      paddingVertical: 3
    },
    dialogCustomStyle: {
      width: 288, 
      height: 154,
      borderTopLeftRadius: 30, 
      borderTopRightRadius: 6, 
      borderBottomRightRadius: 30, 
      borderBottomLeftRadius: 6, 
      justifyContent: 'center'
    },
    checkbuttonStyle: {
      position: 'absolute', 
      width:22, 
      height:22, 
      top: 12, 
      left:-15, 
      backgroundColor: '#ECE8EE', 
      borderRadius: 4, 
      borderWidth: 2, 
      borderColor: "#fff", 
      alignItems:'center', 
      justifyContent:'center'
    },
    selectedViewStyle: {
      marginTop: 10, 
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
  
