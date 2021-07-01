/**
 * @format
 */
import React, {useEffect} from 'react';
import { Provider } from 'react-redux'
import { store } from './src/reducers'
import AppNavigation from './src/navigation'
import RNFetchBlob from 'rn-fetch-blob';
import DeviceInfo from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
console.disableYellowBox = true;
const component = () => {  
  // global.theme = themes.light;
  let uniqueId = DeviceInfo.getUniqueId();
  global.DeviceId = uniqueId;
  console.log("uniqueId======",global.theme)
  console.log("Gloabal",global);
  let dirs = RNFetchBlob.fs.dirs
  let path = dirs.DocumentDir;

  RNFetchBlob.fs.exists(path+'/shopkitty')
  .then((exist) => {
  if (!exist){
      RNFetchBlob.fs.mkdir(path+'/shopkitty')
      .then(() => console.log('success'))
      .catch((err) => console.log(err))
  } else {
    console.log('directory already exist')
  } 
  firestore()
  .collection('chats')
  .onSnapshot(querySnapshot => {
    let chatList = [];
    querySnapshot.forEach(documentSnapshot => {
      chatList.push(documentSnapshot.data())
    });
    global.chatList = chatList;
  })

  firestore()
    .collection('chatgroups')    
    .onSnapshot(async(documentSnapshot) => {
      let chatgroupData = [];
      let phoneNumber = await AsyncStorage.getItem('phoneNumber', '')
      documentSnapshot.forEach(doc => {
        doc.data().checked = false;
        chatgroupData.push(doc.data())
      })
      global.chatgroupData = chatgroupData
    })
  })

  .catch((err) => console.log(err))
  return(
      <Provider store={store}>
        <AppNavigation/> 
      </Provider>
  )

}
export default component;