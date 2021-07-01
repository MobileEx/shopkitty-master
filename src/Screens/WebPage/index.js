import React, {Component} from 'react';
import {
  View,
  Text,
  Platform
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Header from '../../components/Header';
import ActionButton from 'react-native-action-button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {WebView} from 'react-native-webview';
import ViewShot from 'react-native-view-shot';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-community/async-storage';
import EStyleSheet from 'react-native-extended-stylesheet';
import Dialog, {DialogContent, DialogFooter, DialogButton} from 'react-native-popup-dialog';

class WebPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      flag: 0,
      visible: false,
      errorvisible: false,
      lastvisible: false
    }
  }

  componentDidMount = () => {
    global.page = 'WebStores'
      this.unscribe = this.props.navigation.addListener('didFocus', () => {
        EStyleSheet.build({
          $theme: global.theme
        });
        this.setState({flag:1});
      })
      this.unblur = this.props.navigation.addListener('didBlur', () => {
        this.setState({flag:0});
      })
  }  
  
  componentWillUnmount = () => {
    this.unblur.remove();
    this.unscribe.remove();
  }

  takeScreenShot = () => {
    let dirs = RNFetchBlob.fs.dirs
    let path = dirs.DocumentDir;
    let currentTimeStamp = Math.round(new Date().getTime()/1000);
    this.refs.viewshot.capture().then(uri => {
      RNFetchBlob.fs.cp(uri, path+`/shopkitty/${currentTimeStamp}.png`)
        .then(() => {this.getImageInfo(currentTimeStamp); this.setState({visible:true})})
        .catch(() => this.setState({errorvisible: true}))
    });
  }

  getImageInfo = async(currentTimeStamp) => {
    let url = this.props.navigation.getParam('url', {});
    let phoneNumber = await AsyncStorage.getItem('phoneNumber');
    if (url.includes('www')){
      url = url;
    } else {
      url = 'www.'+url;
    }
    let ref = firestore().collection('imageInfo')
    await ref.add({
      imageName: `${currentTimeStamp}.png`,
      url: url,
      created_at : phoneNumber
    })
    .then(res => {
      let docref = firestore().collection('imageInfo').doc(res.id)
      docref.update({
        timestamp: firestore.FieldValue.serverTimestamp()
      })
    })
  }

  addMyLink = async() => {
    let url = this.props.navigation.getParam('url', {});
    let phoneNumber = await AsyncStorage.getItem('phoneNumber');
    let ref = firestore().collection('mylinklists')
    if (url.includes('www')){
      url = url;
    } else {
      url = 'www.'+url;
    }
    await ref.add({
      url: url,
      created_at : phoneNumber
    })
    .then(res => {
      let docref = firestore().collection('mylinklists').doc(res.id)
      docref.update({
        id: res.id,
        timestamp: firestore.FieldValue.serverTimestamp()
      })
    })
  }

  addNewChat = () => {
    let dirs = RNFetchBlob.fs.dirs
    let path = dirs.DocumentDir;
    let currentTimeStamp = Math.round(new Date().getTime()/1000);
    let postPhotos = [];
    this.refs.viewshot.capture().then(uri => {
      RNFetchBlob.fs.cp(uri, path+`/shopkitty/${currentTimeStamp}.png`)
        .then(async() => {
          this.getImageInfo(currentTimeStamp);
          postPhotos.push(`${currentTimeStamp}.png`);
          global.postPhotos = postPhotos;
          this.props.navigation.navigate('Chats')
        })
        .catch(() => this.setState({errorvisible: true}))
    });
  }

  addLastChat = () => {
    let dirs = RNFetchBlob.fs.dirs
    let path = dirs.DocumentDir;
    let currentTimeStamp = Math.round(new Date().getTime()/1000);
    let postPhotos = [];
    this.refs.viewshot.capture().then(uri => {
      RNFetchBlob.fs.cp(uri, path+`/shopkitty/${currentTimeStamp}.png`)
        .then(() => {
          this.getImageInfo(currentTimeStamp);
          postPhotos.push(`${currentTimeStamp}.png`);
          if (global.lastGroupId == undefined){
            global.postPhotos = [];
            this.setState({lastvisible: true})
          } else {
            global.postPhotos = postPhotos;
            this.props.navigation.navigate('ChatDetail', {groupId:global.lastGroupId, postPhotos: postPhotos})
          }
        })
        .catch(() => this.setState({errorvisible: true}))
    });
  }

  renderIcon = () => {
    return (
      <Ionicons name='ios-add' color='#000' size={40}/>
    )
  }
  render(){
    EStyleSheet.build({
      $theme: global.theme
    });
    let url = this.props.navigation.getParam('url', {});
    return (
      <View style={styles.container}>
        <Header title='Web Page' navigation={this.props.navigation}/>
        <ViewShot style={{flex:1}} ref='viewshot'>
          <WebView
            source={{uri: `https://${url}`}}
          />
        </ViewShot>
        <ActionButton
          buttonColor='rgba(172,228,228,1)'
          size={50}
          position='center'
          offsetY={Platform.OS == 'ios'?130: 80}
          spacing={4}
          hideShadow={true}
          renderIcon={this.renderIcon}
          >
          <ActionButton.Item onPress={() => this.takeScreenShot()}>
          <View style={{width: 200, backgroundColor: 'rgba(172,228,228,1)',height: 50,borderRadius:25,justifyContent:'center',alignItems:'center'}}>
          
            <Text style={{fontSize:'Roboto:Medium', fontSize: 16}}>Take A Screenshot</Text>
          </View>
          </ActionButton.Item>
          <ActionButton.Item onPress={() => this.addMyLink()}>
          <View style={{width: 200, backgroundColor: 'rgba(172,228,228,1)',height: 50,borderRadius:25,justifyContent:'center',alignItems:'center'}}>
         
            <Text style={{fontSize:'Roboto:Medium', fontSize: 16}}>Add To My Links</Text>
          </View>
          </ActionButton.Item>
          <ActionButton.Item onPress={() => this.addNewChat()}>
          <View style={{width: 200, backgroundColor: 'rgba(172,228,228,1)',height: 50,borderRadius:25,justifyContent:'center',alignItems:'center'}}>
          
            <Text style={{fontSize:'Roboto:Medium', fontSize: 16}}>Add To New Chat</Text>
          </View>
          </ActionButton.Item>
          <ActionButton.Item onPress={() => this.addLastChat()}>
          <View style={{width: 200, backgroundColor: 'rgba(172,228,228,1)',height: 50,borderRadius:25,justifyContent:'center',alignItems:'center'}}>
          
            <Text style={{fontSize:'Roboto:Medium', fontSize: 16}}>Add To Last Chat</Text>
          </View>
          </ActionButton.Item>
        </ActionButton>
        <Dialog
          visible={this.state.visible}
          footer={
            <DialogFooter>
              <DialogButton
                text="OK"
                onPress={() => {this.setState({visible:false})}}
              />
            </DialogFooter>
          }
          onTouchOutside={() => {
              this.setState({visible:false});
          }}
          dialogStyle={styles.dialogStyle}
          >
          <DialogContent>
            <View style={{justifyContent: 'center', alignItems:'center'}}>
              <Text style={{fontSize: 18, fontFamily: 'Roboto-Bold'}}>
                  ScreenShot Success
              </Text>
            </View>
          </DialogContent>
        </Dialog>
        <Dialog
          visible={this.state.errorvisible}
          footer={
            <DialogFooter>
              <DialogButton
                text="OK"
                onPress={() => {this.setState({errorvisible:false})}}
              />
            </DialogFooter>
          }
          onTouchOutside={() => {
              this.setState({errorvisible:false});
          }}
          dialogStyle={styles.dialogStyle}
          >
          <DialogContent>
            <View style={{justifyContent: 'center', alignItems:'center'}}>
              <Text style={{fontSize: 18, fontFamily: 'Roboto-Bold'}}>
                  ScreenShot Error
              </Text>
            </View>
          </DialogContent>
        </Dialog>
        <Dialog
          visible={this.state.lastvisible}
          footer={
            <DialogFooter>
              <DialogButton
                text="OK"
                onPress={() => {this.setState({lastvisible:false})}}
              />
            </DialogFooter>
          }
          onTouchOutside={() => {
              this.setState({lastvisible:false});
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
    itemImageViewStyle: {
      width: 70, 
      height:60, 
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
    nameTextStyle: {
      fontFamily: 'Roboto-Medium', 
      fontSize: 16
    },
    urlTextStyle: {
      fontFamily: 'Roboto-Medium', 
      fontSize: 14, 
      color: '#63B0B0'
    },
    dialogStyle: {
      paddingHorizontal: 50,
      paddingVertical: 25
    }
  });
export default WebPage;
