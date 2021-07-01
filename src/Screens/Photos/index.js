import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  ScrollView,
  Platform
} from 'react-native';
import Header from '../../components/Header';
import CustomButton from '../../components/CustomButton';
import RNFetchBlob from 'rn-fetch-blob';
import EStyleSheet from 'react-native-extended-stylesheet';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

import Toast from 'react-native-simple-toast';
import Dialog, {DialogContent, DialogFooter, DialogButton} from 'react-native-popup-dialog';
import { conditionalExpression } from '@babel/types';

const Photos = (props) => {
  const [photos, setPhotos] = useState([]);
  const [counter, setCounter] = useState(0);
  const [selectItem, setSelectItem] = useState([]);
  const [flag, setFlag] = useState(0);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);

  global.page = 'Photos'
  EStyleSheet.build({
    $theme: global.theme
  });
  const options = {
    title: 'Select Photos',
    takePhotoButtonTitle: null,
    customButtons:[{ name: 'camera', title: 'Take photos from camera...' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  useEffect(() => {
    const unscribe = props.navigation.addListener('didFocus', () => {
      EStyleSheet.build({
        $theme: global.theme
      });
      let dirs = RNFetchBlob.fs.dirs
      let path = `${dirs.DocumentDir}/shopkitty`;
      RNFetchBlob.fs.ls(path)
      .then((files) => {
        let photoArray = [];
        files.forEach(photoItem => {
          photoArray.push({
            photoname: photoItem,
            checked: false
          })
        })
        if (photoArray.length<1){
          Toast.show('No photos')
        }
        setPhotos(photoArray)
      })
      setFlag(1);
    })
    const unblur = props.navigation.addListener('didBlur', () => {
      setFlag(0);
    })
    return () => {
      unblur.remove();
      unscribe.remove();
    }
  }, [])

  useEffect(() => {
    
  }, [])

  const itemCheckPress = (index) => {
    let clonelist = [...photos];
    let count = 0;
    let selectedItem = []
    clonelist[index].checked = !clonelist[index].checked
    for(var i = 0; i < clonelist.length; ++i){
      if(clonelist[i].checked) {
        selectedItem.push(clonelist[i].photoname)
        count++;
      }
    }
    setPhotos(clonelist);
    setCounter(count);
    setSelectItem(selectedItem);
  };

  const addPhotos = () => {
    console.log("Add phots")
    ImagePicker.showImagePicker(options,async (response) => {    
      if (response.didCancel) {
        Toast.show('Cancelled')
      } else if (response.error) {
        Toast.show('Camera Error')
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        props.navigation.navigate('Camera', {from: 'photos'})
      } else {
        console.log("Hiiiii")
        const source = { uri: response.uri };
        let dirs = RNFetchBlob.fs.dirs
        let path = dirs.DocumentDir;
        let currentTimeStamp = Math.round(new Date().getTime()/1000);
        let photoArray = [];


        await ImageResizer.createResizedImage(response.uri, 100, 100, "png", 50, 0, path+`/shopkitty/`)
        .then(responsee => {
      
          console.log("Response ",responsee);
          // response.uri is the URI of the new image that can now be displayed, uploaded...
          // response.path is the path of the new image
          // response.name is the name of the new image with the extension
          // response.size is the size of the new image

          photoArray.push(`${currentTimeStamp}.png`);
          global.postPhotos = photoArray;
          let newObject = {};
          for(let i=0;i<photoArray.length;i++){
            newObject.photoname = photoArray[i];
            newObject.checked = false;
          }
          setPhotos([...photos, newObject]);

        })
        .catch(err => {
          console.log("Errr ",err);
          // Oops, something went wrong. Check that the filename is correct and
          // inspect err to get more details.
        });


        // RNFetchBlob.fs.cp('file://'+response.path, path+`/shopkitty/${currentTimeStamp}.png`)
        //   .then(() => {
        //     console.log("cp file ")
        //     photoArray.push(`${currentTimeStamp}.png`);
        //     global.postPhotos = photoArray;
        //     let newObject = {};
        //     for(let i=0;i<photoArray.length;i++){
        //       newObject.photoname = photoArray[i];
        //       newObject.checked = false;
        //     }
        //     setPhotos([...photos, newObject]);
        // });
      }
});
  }

  const deleteItems = async() => {
    let path = RNFetchBlob.fs.dirs.DocumentDir;
    let photoPath = path+'/shopkitty/';
    selectItem.forEach(item => {
      RNFetchBlob.fs.unlink(photoPath+item)
    })
    RNFetchBlob.fs.ls(photoPath).then((files) => {
      let photoArray = [];
      files.forEach(photoItem => {
        photoArray.push({
          photoname: photoItem,
          checked: false
        })
      })
      setCounter(0);
      setPhotos(photoArray)
    })
  }

  const onPressLastChat = async() => {

    if(selectItem.length == 0)
    {
      Toast.show('No photo selected!');
      return
    }


    let path = RNFetchBlob.fs.dirs.DocumentDir;
    let photoPath = path+'/shopkitty/';
    if (global.lastGroupId == undefined){
      global.postPhotos = [];
      setVisible2(true)
    } else {
      global.postPhotos = selectItem;
      props.navigation.navigate('ChatDetail', {groupId:global.lastGroupId})
    }
    RNFetchBlob.fs.ls(photoPath).then((files) => {
      let photoArray = [];
      files.forEach(photoItem => {
        photoArray.push({
          photoname: photoItem,
          checked: false
        })
      })
      setCounter(0);
      setPhotos(photoArray)
    })
  }

  const onPressNewChat = () => {

    if(selectItem.length == 0)
    {
      Toast.show('No photo selected!');
      return
    }

    let path = RNFetchBlob.fs.dirs.DocumentDir;
    let photoPath = path+'/shopkitty/';
    global.postPhotos = selectItem;
    props.navigation.navigate('Chats')
    RNFetchBlob.fs.ls(photoPath).then((files) => {
      let photoArray = [];
      files.forEach(photoItem => {
        photoArray.push({
          photoname: photoItem,
          checked: false
        })
      })
      setCounter(0);
      setPhotos(photoArray)
    })
  }

  const renderItem = ({item, index}) => {
    let path = RNFetchBlob.fs.dirs.DocumentDir;
    let photoPath = Platform.OS === "android" ? ('file://' + path+'/shopkitty/'+item.photoname) : path+'/shopkitty/'+item.photoname;
    return (
      <View style={{marginVertical: 10}}>
        <TouchableOpacity onPress={() => {itemCheckPress(index)}} style={{flexDirection: 'row', justifyContent:'center'}}>
          <View>
            <Image source={{isStatic:true, uri: photoPath}} style={{width: 110, height: 110, borderRadius: 20}}/>
            {item.checked&&
            <View style={styles.checkbuttonStyle}>
              <Image source={require('../../assets/ic_check.png')}/>
            </View>
            }
          </View>
        </TouchableOpacity>
      </View>
    )
  } 
  return (
    <View style={styles.container}>
      <Header title='Photos' navigation={props.navigation} addPhotos={addPhotos}/>
      {counter != 0 &&
      <View style={styles.selectedViewStyle}>
        <View style={{flex:1}}>
          <Text style={styles.selectTextStyle}>
            Selected: {counter}
          </Text>
        </View>
        <TouchableOpacity onPress={() => {deleteItems()}} style={{flex:1, alignItems:'flex-end'}}>
          <Image source={require('../../assets/ic_delete.png')}/>
        </TouchableOpacity>
      </View>
      }
      <ScrollView style={{marginTop: Platform.OS == 'ios'?30:20}}>
        <FlatList
            data={photos}
            renderItem={renderItem}
            horizontal={false}
            numColumns={3}
            keyExtractor={(item, index) => item.id}
            columnWrapperStyle={{
              flexWrap: "wrap",
              flex: 1,
              justifyContent: "space-around"
          }}
        />
      </ScrollView>
      {photos.length>0&&
      <CustomButton 
        ButtonStyle={{marginBottom: Platform.OS == 'ios'?20: 15, marginTop: 5, backgroundColor: '#E5D9E5'}}
        textValue='Post To Last Chat'
        onPress={onPressLastChat}/>
      }
      {photos.length>0&&
      <CustomButton 
        ButtonStyle={{marginBottom: Platform.OS == 'ios'?50: 30}}
        textValue='Post To New Chat'
        onPress={onPressNewChat}/>
      }    
        <Dialog
          visible={visible2}
          footer={
            <DialogFooter>
              <DialogButton
                text="OK"
                onPress={() => {setVisible2(false)}}
              />
            </DialogFooter>
          }
          onTouchOutside={() => {
              setVisible2(false);
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
    selectedViewStyle: {
      marginTop: 20, 
      flexDirection: 'row', 
      alignContent: 'space-between', 
      marginHorizontal: 25
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
      left:12, 
      backgroundColor: '#ECE8EE', 
      borderRadius: 4, 
      borderWidth: 2, 
      borderColor: "#fff", 
      alignItems:'center', 
      justifyContent:'center'
    },
    dialogStyle: {
      paddingHorizontal: 50,
      paddingVertical: 25
    }
  });
export default Photos;
