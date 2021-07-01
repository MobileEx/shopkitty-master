import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator
} from 'react-native';
import Header from '../../components/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import firestore, { firebase } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import storage from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import EStyleSheet, { setStyleAttributePreprocessor } from 'react-native-extended-stylesheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EmojiBoard from 'react-native-emoji-board'
import Emoji from 'react-native-emoji';
import ImageCompressor from '@nomi9995/react-native-image-compressor'
import { cos } from 'react-native-reanimated';
// import console = require('console');

function Chats(props){
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [content, setContent] = useState('');
  const [chatList, setChatList] = useState([]);
  const [siteURL, setSiteURL] = useState([]);
  const [imageURL, setImageURL] = useState([]);
  const [phoneNum, setPhoneNum] = useState('');
  const [index, setIndex] = useState(0);
  const [members, setMembers] = useState('');
  const [flag, setFlag] = useState('');
  const [clickedItem, setClickedItem] = useState('')
  const [show, setShow] = useState(false);
  const [startedText, setText] = useState('Started today');
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteData,setDeleteMessageData] = useState('');
  
  const scrollViewRef = useRef();
  global.page = 'Chats'
  const groupmembers = props.navigation.getParam('groupmembers', '');
  const colors = ['#F6D4DD', '#C1E9F5', '#B8DEDE', '#F2E1FF', '#C8D4F5', '#BF9B9A', '#EEDAA5', '#D0EF8D', '#EAB1E5', '#C9B1EA']
  EStyleSheet.build({
    $theme: global.theme
  });

  useEffect(() => {
    let groupId = props.navigation.getParam('groupId', '');
    global.lastGroupId = groupId;
    async function getchatlist(){
      const phoneNumber = await AsyncStorage.getItem('phoneNumber') ;
      setPhoneNum(phoneNumber);
      await firestore()
        .collection('chats')
        .where('groupId', '==', groupId)
        .onSnapshot(querySnapshot => {
          let chatlist = [];
          querySnapshot.forEach(doc => {
            // console.log("Chats ",doc);
            if(doc.data().timestamp === undefined || doc.data().timestamp === null) return
            chatlist.push(doc.data());
            setText(moment.unix(doc.data().timestamp.seconds).format('DD MMM YYYY hh:mm'));
          })
          chatlist = chatlist.filter(item=>item.timestamp.seconds!== null && item.timestamp.seconds!== undefined)
          setChatList(chatlist.sort(function(a,b){
            return (a.timestamp.seconds - b.timestamp.seconds)
          }));
          setIndex(1);
        
        });
        await firestore()
        .collection('chatgroups')
        .where('id', '==', global.lastGroupId)
        .get()
        .then(querySnapshot => {
          let chatgroup = [],date;
          querySnapshot.forEach(doc => {
            // console.log("ChatGroups DOC ",doc);
            chatgroup.push(doc.data().groupmembers);
            setText(moment.unix(doc.data().timestamp.seconds).format('DD MMM YYYY hh:mm'));
            // date = moment(doc.data().creationDate).format("DD/MM/YYYY hh:mm");
            //  date =  moment.unix(doc.data().timestamp.seconds.format('hh:mm'));
            // alert(date);
          })
          // setText('Started on '+date);
          setMembers(chatgroup[0].length);
        })
    }
    async function getPhoneNumber() {
      const phoneNumber = await AsyncStorage.getItem('phoneNumber') ;
      setPhoneNum(phoneNumber);
    }
    const unscribe = props.navigation.addListener('didFocus', () => {
      // console.log("calledd!!")
      EStyleSheet.build({
        $theme: global.theme
      });
      setFlag(1);
      let newChat = props.navigation.getParam('newChat', '');
      if (newChat){
        setIndex(1);
        setMembers(1);
        getPhoneNumber();
        getchatlist();
      } else {
        getchatlist();
      }
      if (global.invite){
        setVisible(true);
      }
    })
    const unblur = props.navigation.addListener('didBlur', () => {
      setFlag(0);
      setIndex(0)
    })
    return () => {
      unblur.remove();
      unscribe.remove();
    }
  }, [])
  
  useEffect(() => {
    if (index != 0 && global.postPhotos != ''){
      uploadFile();
    }
  }, [index])

  const onInputText = (text) => {
      setContent(text)
  }

  const onClick = async(emoji) => {
    setShow(false);
    const userDocumentSnapshot = await firestore()
      .collection('chats')
      .doc(clickedItem.id)
      .get();
      let emojiArr = userDocumentSnapshot.data().emoji || [];
      emojiArr.push(emoji.name)
      global.emojiArray = emojiArr
      firestore()
      .collection('chats')
      .doc(clickedItem.id)
      .update({
        emoji: emojiArr
      })
      .then(() => {
        // console.log('User updated!');
      });
    };

  const isShow = () => {
    let groupId = props.navigation.getParam('groupId', '');
    let chatList = global.chatList.filter(filterItem => filterItem.groupId == groupId)
    chatList.map(chatlistItem => {
      if(chatlistItem.isSeen !== undefined && chatlistItem.isSeen.indexOf(global.phone)>-1)
        return 
      else if (chatlistItem.isSeen == undefined){
        firestore()
        .collection('chats')
        .doc(chatlistItem.id)
        .update({
          isSeen: [global.phone]
        })
      }
      else {
        firestore()
        .collection('chats')
        .doc(chatlistItem.id)
        .update({
          isSeen: [...chatlistItem.isSeen, global.phone]
        })
      }
    })
  }

  const uploadFile = async() => {
    let phoneNumber = await AsyncStorage.getItem('phoneNumber');
    let userName = await AsyncStorage.getItem('userName');
    let groupId = props.navigation.getParam('groupId', '');
    let imageURLArr = [];
    let websiteUrl = [];
    imageURLArr = await Promise.all(global.postPhotos.map(async(imageItem) => {
      setSpinner(true);
      await firestore()
      .collection('imageInfo')
      .where('imageName', '==', imageItem)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          websiteUrl.push(doc.data().url)
        })
      })
      const reference = storage().ref(imageItem);
      let dirs = RNFetchBlob.fs.dirs;
      let path = `${dirs.DocumentDir}/shopkitty`;
      const pathToFile = `${path}/${imageItem}`;
      await reference.putFile(pathToFile)
      const url = await reference.getDownloadURL().catch((error) => { throw error });
      return url;
    }));
    setSiteURL(websiteUrl);
    setImageURL(imageURLArr);
    setIndex(0)
    global.postPhotos = ''
   
    await firestore()
      .collection('chats')
      .add({
        type: 'image',
        groupId: groupId,
        userId: phoneNumber,
        name: userName,
        siteURL: websiteUrl,
        url: imageURLArr,
      })
      .then(async(res) => {
        let docref = firestore().collection('chats').doc(res.id);
        await docref.update({
          id: res.id,
          timestamp: firestore.FieldValue.serverTimestamp()
        }).then(() => {
          setSpinner(false)
          docref.
          onSnapshot(snap => {
            setChatList([...chatList, {
              groupId: groupId, 
              type: 'image', 
              userId: phoneNumber, 
              name: userName,
              id: res.id,
              url: imageURLArr,
              spinner: false,
              siteURL: websiteUrl, 
              timestamp: snap.data().timestamp}]);
          })
        })
      });
  }
  
  const sendMessage = async() => {
    if (content == ''){
      return
    }
    if (/\s$/.test(content)){
      return
    }
    let phoneNumber = await AsyncStorage.getItem('phoneNumber');
    let userName = await AsyncStorage.getItem('userName');
    let groupId = props.navigation.getParam('groupId', {});
    let chatref = firestore().collection('chats');
    await chatref.add({
      groupId: groupId,
      userId: phoneNumber,
      content: content,
      name: userName,
      type: 'text',
      isSeen: [],
      deleteOnSender: false,
      deleteBothSide: false
    }). then(async(res) => {
      setContent('')
      let docref = firestore().collection('chats').doc(res.id);
      await docref.update({
        id: res.id,
        timestamp: firestore.FieldValue.serverTimestamp()
      }).then(() => {
        docref
        .onSnapshot(snap => {
          setChatList([...chatList, {
            groupId: groupId, 
            type: 'text', 
            userId: phoneNumber,
            name: userName, 
            content: content, 
            timestamp: snap.data().timestamp}]);
        })
      })
    })
  }

  function isInArray(userArray, name) {
    return userArray.indexOf(name.toLowerCase()) > -1;
  }

  function showMessaageDeletePopup(item){
    console.log("delte message",item);
    setDeleteMessageData(item);
    setDeletePopup(true);
  }

  async function deleteMessage(type)
  {
    console.log("hello", type);
    setDeletePopup(false);
    if(deleteData)
    {
      let data;
      if(type == "Sender")
      {
        data = {
          deleteOnSender: true,
        }
      }
      else
      {
        data = {
          deleteBothSide: true
        }
      }

      console.log("deleteData ",JSON.stringify(deleteData.id));

      let docref = firestore().collection('chats').doc(deleteData.id);

      await docref.update(data).then(res => {
        console.log("Result ",res);
      })

    }
  }

  const showMessage = () => {

    let userArray = [];

    return chatList.map((item, index) => {

      // console.log("Chat List Item ", item);

      let colorItem = 0;
      let time = '';
      let virtualName = [];
      if (item.timestamp != undefined){
        time = moment.unix(item.timestamp.seconds).format('hh:mm');
      }

      if(userArray.length == 0 || !isInArray(userArray, item.name))
      userArray.push(item.name);


      let nameArr = item.name.split(' ');
      // console.log("Nemae ",nameArr);

      for (let i=0;i<nameArr.length;i++){
        virtualName.push(nameArr[i].substr(0,2));
        colorItem = userArray.indexOf(nameArr[i]);

        // console.log("Color itme",colorItem);
      }
      let uniq = [...new Set(item.emoji)];
      if (item.emoji != undefined && item.emoji.length>0){
        const count = item.emoji.filter(item => item === 'grinning').length;
      }

      if(item.deleteOnSender)
      {
        return(
          <View key={index} style={
            item.userId == phoneNum ? styles.messageMe : styles.messageUser
          }>
            {item.userId == phoneNum ?
               <View style={{ maxWidth: '70%'}}>
                  <View style={[styles.textMessageContentMe]}>
                    
                    <Text style={styles.deletedMessage}>
                    This message was deleted by you
                    </Text>
                    
                  </View>
                  <View style={{marginTop: 5, alignSelf:'flex-end'}}>
                    <Text style={{fontSize: 10, fontFamily: 'Roboto-Medium', color:'#B3BDD8'}}>
                      {time}
                    </Text>
                  </View>
                </View>
                :
                <View style={{ flexDirection: 'row', maxWidth: '70%' }}>
                    <View style={[styles.nameViewStyle, {backgroundColor: colors[colorItem]}]}>
                      <Text style={styles.nameTextStyle}>
                        {virtualName.join().replace(',','').toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <View style={styles.textMessageContentUser}>
                        {item.type == 'text' ?
                          <Text style={item.me? styles.textMessageMe : styles.textMessageUser}>
                              {item.content}
                          </Text>
                          :
                          <>
                          {item.url != undefined && item.url.map(imageurlItem => {
                            return <TouchableOpacity onPress={() => {setClickedItem(item); setShow(!show)}}>
                              <Image source={{uri: imageurlItem}} style={{width: 220, height: 180, marginVertical: 5}}/>
                            </TouchableOpacity>
                          })}
                          {item.siteURL != undefined && item.siteURL.map(siteURLItem => {
                            return <Text style={item.me? styles.textMessageMe : styles.textMessageUser}>{siteURLItem}</Text>
                          })}
                          <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
                            {item.emoji != undefined && uniq.map(emojiItem => {
                              const count = item.emoji.filter(item => item === emojiItem).length;
                              return( 
                              <>
                                <Emoji name={emojiItem} style={{fontSize: 20}} />
                                <Text style={{color:'#FBA09E', fontSize: 14, marginLeft:3, marginRight: 10, fontWeight: 'bold'}}>{count}</Text>
                              </>
                              )
                            })
                            }
                          </View>
                          </>
                        }
                        {(item.emoji1 != undefined || item.emoji2 != undefined) && 
                          <View style={{flexDirection: 'row'}}>
                            <Image source={item.emoji1}/>
                            <View style={{justifyContent:'center'}}>
                              <Text style={[styles.emojiCountStyle, {color: '#FBA09E'}]}>2</Text>
                            </View>
                            <Image source={item.emoji2}/>
                            <View style={{justifyContent:'center'}}>
                              <Text style={[styles.emojiCountStyle, {color: '#000'}]}>0</Text>
                            </View>
                          </View>
                        }
                      </View>
                      <View style={{marginLeft:25, marginTop: 5}}>
                        <Text style={{fontSize: 10, fontFamily: 'Roboto-Medium', color:'#B3BDD8'}}>
                          {time}
                        </Text>
                      </View>
                    </View>
                </View>
            }
        </View>
        );
      }

      if(item.deleteBothSide)
      {
        return(
          <View key={index} style={
            item.userId == phoneNum ? styles.messageMe : styles.messageUser
          }>
            {item.userId == phoneNum ?
               <View style={{ maxWidth: '70%'}}>
                  <View style={[styles.textMessageContentMe]}>
                    
                    <Text style={styles.deletedMessage}>
                    This message was deleted
                    </Text>
                    
                  </View>
                  <View style={{marginTop: 5, alignSelf:'flex-end'}}>
                    <Text style={{fontSize: 10, fontFamily: 'Roboto-Medium', color:'#B3BDD8'}}>
                      {time}
                    </Text>
                  </View>
                </View>
                :
                <View style={{ flexDirection: 'row', maxWidth: '70%' }}>
                    <View style={[styles.nameViewStyle, {backgroundColor: colors[colorItem]}]}>
                      <Text style={styles.nameTextStyle}>
                        {virtualName.join().replace(',','').toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <View style={styles.textMessageContentUser}>
                          <Text style={styles.deleteMessage}>
                              This message was deleted
                          </Text>
                      </View>
                      <View style={{marginLeft:25, marginTop: 5}}>
                        <Text style={{fontSize: 10, fontFamily: 'Roboto-Medium', color:'#B3BDD8'}}>
                          {time}
                        </Text>
                      </View>
                    </View>
                </View>
            }
        </View>
        );

      }


        return (
          <View key={index} style={
            item.userId == phoneNum ? styles.messageMe : styles.messageUser
          }>
            {item.userId == phoneNum ?
               <View style={{ maxWidth: '70%'}}>
                  <TouchableOpacity style={[styles.textMessageContentMe]} onLongPress={()=>showMessaageDeletePopup(item)}>
                    {item.type == 'text' ?
                    <Text style={item.me? styles.textMessageMe : styles.textMessageUser}>
                        {item.content}
                    </Text>
                    :
                    <>
                    {item.url != undefined && item.url.map(imageurlItem => {
                     return (
                        <TouchableOpacity onPress={() => {setClickedItem(item); setShow(!show)}}>
                            <Image source={{uri: imageurlItem}} style={{width: 220, height: 180, marginVertical: 5}}/>
                        </TouchableOpacity>
                     )
                    })}
                    {item.siteURL != undefined && item.siteURL.map(siteURLItem => {
                      return <Text style={item.me? [styles.textMessageMe, {textAlign: 'right'}] : [styles.textMessageUser, {textAlign: 'right'}]}>{siteURLItem}</Text>
                    })}
                    <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    {item.emoji != undefined && uniq.map(emojiItem => {
                      const count = item.emoji.filter(item => item === emojiItem).length;
                      return( 
                      <>
                        <Emoji name={emojiItem} style={{fontSize: 20}} />
                        <Text style={{color:'#FBA09E', fontSize: 14, marginLeft:3, marginRight: 10, fontWeight: 'bold'}}>{count}</Text>
                      </>
                      )
                    })
                    }
                    </View>
                    </>
                    }
                  </TouchableOpacity>
                  <View style={{marginTop: 5, alignSelf:'flex-end'}}>
                    <Text style={{fontSize: 10, fontFamily: 'Roboto-Medium', color:'#B3BDD8'}}>
                      {time}
                    </Text>
                  </View>
                </View>
                :
                <View style={{ flexDirection: 'row', maxWidth: '70%' }}>
                    <View style={[styles.nameViewStyle, {backgroundColor: colors[colorItem]}]}>
                      <Text style={styles.nameTextStyle}>
                        {virtualName.join().replace(',','').toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <View style={styles.textMessageContentUser}>
                        {item.type == 'text' ?
                          <Text style={item.me? styles.textMessageMe : styles.textMessageUser}>
                              {item.content}
                          </Text>
                          :
                          <>
                          {item.url != undefined && item.url.map(imageurlItem => {
                            return <TouchableOpacity onPress={() => {setClickedItem(item); setShow(!show)}}>
                              <Image source={{uri: imageurlItem}} style={{width: 220, height: 180, marginVertical: 5}}/>
                            </TouchableOpacity>
                          })}
                          {item.siteURL != undefined && item.siteURL.map(siteURLItem => {
                            return <Text style={item.me? styles.textMessageMe : styles.textMessageUser}>{siteURLItem}</Text>
                          })}
                          <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
                            {item.emoji != undefined && uniq.map(emojiItem => {
                              const count = item.emoji.filter(item => item === emojiItem).length;
                              return( 
                              <>
                                <Emoji name={emojiItem} style={{fontSize: 20}} />
                                <Text style={{color:'#FBA09E', fontSize: 14, marginLeft:3, marginRight: 10, fontWeight: 'bold'}}>{count}</Text>
                              </>
                              )
                            })
                            }
                          </View>
                          </>
                        }
                        {(item.emoji1 != undefined || item.emoji2 != undefined) && 
                          <View style={{flexDirection: 'row'}}>
                            <Image source={item.emoji1}/>
                            <View style={{justifyContent:'center'}}>
                              <Text style={[styles.emojiCountStyle, {color: '#FBA09E'}]}>2</Text>
                            </View>
                            <Image source={item.emoji2}/>
                            <View style={{justifyContent:'center'}}>
                              <Text style={[styles.emojiCountStyle, {color: '#000'}]}>0</Text>
                            </View>
                          </View>
                        }
                      </View>
                      <View style={{marginLeft:25, marginTop: 5}}>
                        <Text style={{fontSize: 10, fontFamily: 'Roboto-Medium', color:'#B3BDD8'}}>
                          {time}
                        </Text>
                      </View>
                    </View>
                </View>
            }
        </View>
        )
    })
  } 
  return (
    <View style={styles.container}>
      <Header title={global.chatTitle} navigation={props.navigation} members={members}/>
        <View style={{marginVertical: 10}}>
          <Text style={styles.startTextStyle}>Started on {startedText}</Text>
        </View>
        <EmojiBoard showBoard={show} onClick={onClick} />  
        <KeyboardAwareScrollView 
          ref={scrollViewRef} style={{flex:1}}
          onContentSizeChange={(contentWidth, contentHeight) => {
              scrollViewRef.current.scrollToEnd({ animated: true });
          }}
        >
          {chatList != undefined && chatList.length>0&&
          <View>            
            {showMessage()}
          </View>
          }
          {spinner == true &&
            <View>
              <ActivityIndicator/>
            </View>
          }
        </KeyboardAwareScrollView>
        <View style={{justifyContent:'center', marginVertical: Platform.OS == 'ios'?30:20}}>
          <View style={[styles.textInputWrapper]}>
            <TextInput 
                style={styles.textInput}
                multiline={true}
                value={content}
                placeholder="Type Message"
                onFocus = {isShow}
                onChangeText={(text) => {
                  onInputText(text)
                }}
                placeholderTextColor="#6C6C6C"
            />
            <View style={{position: 'absolute', flexDirection:'row', right: Platform.OS == 'ios'?15:10}}>
              <TouchableOpacity onPress={()=> props.navigation.navigate('Photos')} style={{justifyContent:'center', marginHorizontal: Platform.OS == 'ios'?15:4}}>
                <MaterialIcons name='photo' color='#B3BDD8' size={26}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> props.navigation.navigate('Camera')} style={{justifyContent:'center', marginHorizontal: Platform.OS == 'ios'?15:6}}>
                <Image source={require('../../assets/ic_camera.png')}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => props.navigation.navigate('Invite')} style={{justifyContent:'center',marginHorizontal: Platform.OS == 'ios'?10:6}}>
                <Image source={require('../../assets/ic_person.png')}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sendMessage()} style={{marginHorizontal: Platform.OS == 'ios'?5:2}}>
                <MaterialCommunityIcons name='send-circle' color='#B3BDD8' size={26}/>
              </TouchableOpacity>
            </View>            
          </View>
        </View>
        <Dialog
          visible={visible}
          onTouchOutside={() => {
            setVisible(false);
            global.invite = false;
          }}
          dialogStyle={{borderTopLeftRadius: 30, borderTopRightRadius: 6, borderBottomRightRadius: 30, borderBottomLeftRadius: 6,}}
        >
          <DialogContent>
            <View style={{width: 288, height: 154,  justifyContent: 'center', alignItems:'center'}}>
              <View style={{backgroundColor: '#F6D4DD', width: 35, height: 35, borderRadius: 10, justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontFamily:'Roboto-Bold', fontSize: 14, color: '#FFF'}}>KB</Text>
              </View>
              <View style={{marginTop: 20}}>
                {global.groupmembersName != undefined && global.groupmembersName.length>0&&
                    global.groupmembersName.map(item => {
                    return (
                      <Text style={{fontSize: 18, fontFamily: 'Roboto-Bold', textAlign: 'center'}}>
                        {item}
                      </Text>
                    )
                    })
                }
                 <Text style={{fontSize: 14, marginTop: 5,fontFamily: 'Roboto-Medium', textAlign: 'center'}}>
                        has been invited
                  </Text>
              </View>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
                    visible={deletePopup}
                    onTouchOutside={() => {
                      setDeletePopup(false);
                      // global.invite = false;
                    }}
                    onHardwareBackPress={() => setDeletePopup(false)}
                    dialogStyle={{borderTopLeftRadius: 30, borderTopRightRadius: 6, borderBottomRightRadius: 30, borderBottomLeftRadius: 6,}}          
        >
          <DialogContent>

            <View style={styles.detailView}>
            <View style={styles.orderByView}>
                <TouchableOpacity style={styles.orderbtn} onPress={()=>deleteMessage("Sender")}>
                    <Text style={styles.btnTxt}>Delete for me</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.orderbtn}  onPress={()=>deleteMessage("Everyone")}>
                    <Text  style={styles.btnTxt}>Delete for everyone</Text>
                </TouchableOpacity>          
            </View> 
            </View>  
          </DialogContent>

        </Dialog>
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
    dashline : {
      borderWidth: 1,
      borderColor: '#ECE8EE',
      marginVertical: 15
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
    nameTextStyle: {
      fontFamily: 'Roboto-Bold', 
      fontSize: 16,
      color: '#FFF'
    },
    nameViewStyle: {
      width: 40, height: 40, 
      borderRadius: 10, 
      justifyContent:'center', 
      alignItems: 'center'
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
    startTextStyle: {
      textAlign: 'center',
      fontFamily: 'Roboto-Medium',
      fontSize: 13,
      color: '#6C6C6C'
    },
    textInputWrapper: {
      height: 55,
      borderRadius: 50,
      backgroundColor: '#F2F2F2',
      marginHorizontal: 18,
      justifyContent: 'center'
    },
    textInput: {
        fontSize: 16,
        paddingHorizontal: 24,
        paddingVertical: 5,
        paddingRight:150,
        color: '#000',
        fontFamily: 'Roboto-LightItalic'
    },
    messageUser: {
      alignSelf: 'flex-start',
      paddingHorizontal: 20,
      paddingVertical: 15
    },
    messageMe: {
        alignSelf: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    textMessageMe: {
      fontFamily: 'Roboto-Medium',
      fontSize: 14
    },
    deletedMessage: {
      color: '#000',
      fontFamily: 'Roboto-LightItalic',
      fontSize: 12
    },
    textMessageUser: {
      fontFamily: 'Roboto-Medium',
      fontSize: 14
    },
    textMessageContentUser: {
      flexDirection: 'column', 
      marginLeft: 25, 
      backgroundColor: '#FAF4F9', 
      paddingHorizontal: 18, 
      paddingVertical: 12,
      borderTopLeftRadius:3,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      alignSelf: 'flex-start'
    },
    textMessageContentMe: {
      flexDirection: 'column', 
      marginLeft: 25, 
      backgroundColor: '#ACE4E4', 
      paddingHorizontal: 10, 
      paddingVertical: 10,
      borderTopLeftRadius:15,
      borderTopRightRadius: 15,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 3,
      alignSelf: 'flex-end'
    },
    emojiCountStyle: {
      marginLeft: 5, 
      marginRight: 25, 
      fontFamily: 'Roboto-Medium', 
      fontSize: 14
    },
    detailView: {justifyContent: 'center', alignItems: 'center'},
  detailContainer: {height: 300,padding: 20,width: '80%',borderRadius: 20,alignItems:'center',justifyContent:'space-between'},
  clsBtnView: {width: 100,backgroundColor:'red',alignItems:'center',height: 30,justifyContent:'center',borderRadius: 10},
  orderByView: {height: 150,backgroundColor:'white',padding: 20,width: '80%',borderRadius: 20,alignItems:'center',justifyContent:'space-between'},
  orderbtn: { height: 50,backgroundColor:'skyblue',width: 200,justifyContent:'center',alignItems:'center',borderRadius: 25},
  btnTxt : {fontSize: 15,color:'white'},
  });
export default Chats;
