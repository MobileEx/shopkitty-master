import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNFetchBlob from 'rn-fetch-blob';

class Camera extends Component {
  constructor(props){
    super(props);
    this.state = {
      cameraType: 'back',
      torchon: RNCamera.Constants.FlashMode.off,
      mirrorMode : false,
      photoName: ''
    }
  }
  
  componentDidMount = async() => {
    global.page = 'Camera'
    this.unscribe = this.props.navigation.addListener('didFocus', () => {
      if (global.imagePath == ''){
        this.setState({imagePath: ''})
      }
    })
  }

  componentWillUnmount = () => {
    this.unscribe.remove();
  }

  changeCameraType() {
    if (this.state.cameraType === 'back') {
      this.setState({
        cameraType: 'front',
        mirror: true
      });
    } else {
      this.setState({
        cameraType: 'back',
        mirror: false
      });
    }
  }

  torchon = () => {
    let tstate = this.state.torchon;
    if (tstate == RNCamera.Constants.FlashMode.off){
        tstate = RNCamera.Constants.FlashMode.torch;
    } else {
        tstate = RNCamera.Constants.FlashMode.off;
    }
    this.setState({torchon:tstate})
  }

  takePicture = async() => {
    let from = this.props.navigation.getParam('from', '')
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      let dirs = RNFetchBlob.fs.dirs
      let path = dirs.DocumentDir;
      let currentTimeStamp = Math.round(new Date().getTime()/1000);
      let realPath = path+`/shopkitty/${currentTimeStamp}.png`;
      RNFetchBlob.fs.cp(data.uri, realPath)
        .then(() => 
        this.setState({imagePath: Platform.OS == 'android'?'file://'+realPath:realPath, photoName: `${currentTimeStamp}.png`},
        () => {
          global.imagePath = this.state.imagePath
          if (from == 'photos'){
            this.props.navigation.goBack()
          }
        }))
        .catch(() => console.log('fail'))
    }
  }

  render(){
    return (
      <View style={styles.container}>
        {Platform.OS == "android" && 
          <StatusBar 
            hidden = {true}/>
        }
        <RNCamera
          ref = {ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={this.state.cameraType}
          flashMode={this.state.torchon}
          mirrorImage={this.state.mirrorMode}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok', 
            buttonNegative: 'Cancel',
          }}
        />
        <View style={styles.headerViewStyle}>
          <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} style={{flex:1, alignItems: 'flex-start'}}>
            <Image source={require('../../assets/ic_menu_white.png')}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.torchon()} style={{flex:1, alignItems:'center'}}>
            <Image source={require('../../assets/ic_flash_white.png')}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatDetail', {groupId:global.lastGroupId})} style={{flex:1, alignItems: 'flex-end'}}>
            <Image source={require('../../assets/ic_chat_white.png')}/>
          </TouchableOpacity>
        </View>
        <View style={styles.footerViewStyle}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Photo', {imagePath: this.state.imagePath, photoName: this.state.photoName})} style={{flex:1, alignItems: 'flex-start', justifyContent: 'center'}}>
            <View style={styles.smallImageView}>
              <Image source={{uri: this.state.imagePath}} style={styles.smallImageIcon}/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.takePicture()} style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
            <View style={styles.takePhotoStyle}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.changeCameraType()} style={{flex:1, alignItems: 'flex-end', justifyContent: 'center'}}>
            <Image source={require('../../assets/camera_white.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
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
      top:Platform.OS == 'ios'? 60:40, 
      flexDirection: 'row', 
      alignContent: 'space-between',
      marginHorizontal: 25
    },
    footerViewStyle: {
      position:'absolute', 
      bottom:Platform.OS == 'ios'?50:30, 
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
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
    smallImageView: {
      width:40,
      height:40, 
      borderWidth:2, 
      borderRadius: 7, 
      borderColor: '#FFF', 
      backgroundColor: 'black', 
      justifyContent: 'center', 
      alignItems:'center'
    },
    smallImageIcon: {
      width: 40, 
      height:40, 
      borderWidth:2, 
      borderRadius: 7, 
      borderColor: '#FFF'
    }
  });
export default Camera;
