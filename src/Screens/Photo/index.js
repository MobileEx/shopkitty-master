import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ImageBackground,
  StatusBar,
  ProgressViewIOSComponent
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob';
import Dialog, {DialogContent, DialogFooter, DialogButton} from 'react-native-popup-dialog';

const Photo = (props) => {
  const [visible, setVisible] = useState(false);
  let dir = RNFetchBlob.fs.dirs;
  let photoName = props.navigation.getParam('photoName', {}); 
  let imagePath = props.navigation.getParam('imagePath', {}); 
  global.page = 'Camera'

  const postLastChat = () => {
    let postPhotos = [];
    postPhotos.push(photoName);
    if (global.lastGroupId == undefined){
      global.postPhotos = [];
      setVisible(true);
    } else {
      global.postPhotos = postPhotos;
      props.navigation.navigate('ChatDetail', {groupId:global.lastGroupId})
    }
  }

  const postNewChat = () => {
    let postPhotos = [];
    postPhotos.push(photoName);
    global.postPhotos = postPhotos;
    props.navigation.navigate('Chats')    
  }

  const deleteImage = () => {
    RNFetchBlob.fs.unlink(imagePath).then(() => {
      global.imagePath = '';
      props.navigation.goBack();
    })
  }

  const renderIcon = () => {
    return (
      <Ionicons name='ios-add' color='#000' size={40}/>
    )
  }

  return (
    <View style={styles.container}>
      {Platform.OS == "android" && 
        <StatusBar 
          hidden = {true}/>
      }
     <ImageBackground style={{flex: 1, alignItems:'stretch'}} source={{uri: imagePath}}>
      <View style={styles.headerViewStyle}>
        <TouchableOpacity onPress={() => props.navigation.openDrawer()} style={{flex:1, alignItems: 'flex-start'}}>
          <Image source={require('../../assets/ic_menu_white.png')}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteImage()} style={{flex:1, alignItems:'center'}}>
          <Image source={require('../../assets/ic_delete_white.png')}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('ChatDetail', {groupId:global.lastGroupId})} style={{flex:1, alignItems: 'flex-end'}}>
          <Image source={require('../../assets/ic_chat_white.png')}/>
        </TouchableOpacity>
      </View>
      <ActionButton
        buttonColor='rgba(172,228,228,1)'
        size={50}
        position='center'
        offsetY={Platform.OS == 'ios'?70: 40}
        spacing={4}
        hideShadow={true}
        renderIcon={renderIcon}
        >
        <ActionButton.Item onPress={() => postNewChat()}>
          <View style={{width: 200, backgroundColor: 'rgba(172,228,228,1)',height: 50,borderRadius:25,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:'Roboto:Medium', fontSize: 18}}>Post to New Chat</Text>
          </View>
        </ActionButton.Item>
        <ActionButton.Item onPress={() => postLastChat()}>
        <View style={{width: 200, backgroundColor: 'rgba(172,228,228,1)',height: 50,borderRadius:25,justifyContent:'center',alignItems:'center'}}>
        
          <Text style={{fontSize:'Roboto:Medium', fontSize: 18}}>Post to Old Chat</Text>
        </View>
        </ActionButton.Item>
        <ActionButton.Item onPress={() => console.log("hello")}>
        <View style={{width: 200, backgroundColor: 'rgba(172,228,228,1)',height: 50,borderRadius:25,justifyContent:'center',alignItems:'center'}}>
        
          <Text style={{fontSize:'Roboto:Medium', fontSize: 18}}>Save Only</Text>
        </View>
        </ActionButton.Item>
      </ActionButton>
      </ImageBackground>
      <Dialog
          visible={visible}
          footer={
            <DialogFooter>
              <DialogButton
                text="OK"
                onPress={() => {setVisible(false)}}
              />
            </DialogFooter>
          }
          onTouchOutside={() => {
              setVisible(false);
          }}
          dialogStyle={styles.dialogStyle}
          >
          <DialogContent>
            <View style={{justifyContent: 'center', alignItems:'center'}}>
              <Text style={{fontSize: 18, fontFamily: 'Roboto-Bold'}}>
                There is no last chat
              </Text>
            </View>
          </DialogContent>
        </Dialog>
    </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    headerViewStyle: {
      position:"absolute", 
      top:Platform.OS == 'ios'?60:40, 
      flexDirection: 'row', 
      alignContent: 'space-between',
      marginHorizontal: 25
    },
    footerViewStyle: {
      position:'absolute', 
      bottom:50, 
      flexDirection: 'row',
      alignContent: 'space-between',
      marginHorizontal: 25
    },
    takePhotoStyle: {
      backgroundColor: "#FFF", 
      width: 70, 
      height: 70, 
      borderRadius: 60, 
      borderWidth: 6,
      borderColor:'#C4C4C4'
    },
    dialogStyle: {
      paddingHorizontal: 50,
      paddingVertical: 25
    }
  });
export default Photo;
