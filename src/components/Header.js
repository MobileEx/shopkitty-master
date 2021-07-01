import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dialog, {DialogContent, DialogFooter, DialogButton} from 'react-native-popup-dialog';
import { themes } from '../Themes';

const screenWidth = Math.round(Dimensions.get('window').width);
const position = (screenWidth/15);

const Header = (props) => {
  const [visible, setVisible] = useState(false);
  const {title, navigation, members} = props;
  EStyleSheet.build({
    $theme: global.theme
  });
  const goLastChat = () => {
    if (global.lastGroupId == undefined){
      setVisible(true);
    } else {
      props.navigation.navigate('ChatDetail', {groupId:global.lastGroupId})
    }
  }

  return (   
    <SafeAreaView style={styles.background}>
       {Platform.OS == "android" && 
          <StatusBar
            barStyle = "dark-content" 
            hidden = {false}
            backgroundColor = {EStyleSheet.value('$theme.primary')}/>
        }
      <View style={{flexDirection: 'row', alignItems:'center', alignContent: 'space-between', marginHorizontal: 20}}>
        {title != 'User' &&
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{top:Platform.OS == 'ios'?30: 40, flex:1}}>
            <Image source={require('../assets/ic_menu.png')}/>
        </TouchableOpacity>
        }
        <View style={{top:Platform.OS == 'ios'?30:35, flex:4, alignItems:'center'}}>
            <Text style={{fontFamily:'Ubuntu-Bold', fontSize: 22}}>{title}</Text>
            {members != undefined&&
            <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12, color:'#6C6C6C'}}>{members} members</Text>
            }
        </View>
        {title != 'User' &&
        <View style={{top:Platform.OS == 'ios'?30:40, flex:1, alignItems: 'flex-end'}}>
          {title == 'Invite' || title == 'Photos' || title == 'Friends'?
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() =>{title == 'Invite'?navigation.navigate('Friends'): props.addPhotos()}} style={{top: -4, right: position, marginRight: 10}}>
                <Icon name='add' size={30} color='#000'/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => goLastChat()}>
                <Image source={require('../assets/ic_chat.png')}/>
              </TouchableOpacity>
            </View>
            :
            <>
              {title == 'Chat'?
              <View>
                <Ionicons name='md-information-circle-outline' size={32}/>
              </View>
              :
              <TouchableOpacity onPress={() => goLastChat()}>
                <Image source={require('../assets/ic_chat.png')}/>
              </TouchableOpacity>
              }
            </>
          }
        </View>
        }
      </View>
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
                Can not find last chat
              </Text>
            </View>
          </DialogContent>
        </Dialog>
    </SafeAreaView>
  )
}
const styles = EStyleSheet.create({
    background: {
    height:Platform.OS == 'ios'?135:100,
    backgroundColor: '$theme.primary',
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 6,
    },
    dialogStyle: {
      paddingHorizontal: 50,
      paddingVertical: 25
    }
});
export default Header