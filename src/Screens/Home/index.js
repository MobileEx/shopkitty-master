import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import Svg, { Path, Mask, G } from "react-native-svg"
import firestore from '@react-native-firebase/firestore';
import EStyleSheet from 'react-native-extended-stylesheet';

const Home = (props) => {
  const [flag, setFlag] = useState(0) 
  EStyleSheet.build({
    $theme: global.theme
  });
  useEffect(() => {
    const unscribe = props.navigation.addListener('didFocus', () => {
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
  }, [])
  
  global.page = 'Home'
  const pageMove = async(item) => {
    let phoneNumber = await AsyncStorage.getItem('phoneNumber', '');
    let name = await AsyncStorage.getItem('userName');
    global.phone = phoneNumber
    // let compasionResult = []
    // await firestore()
    //     .collection('users')
    //     .where('deviceId', '==', global.DeviceId)
    //     .get()
    //     .then(querySnapshot => {
    //       querySnapshot.forEach(doc => {
    //         compasionResult.push(doc.data())
    //       })
    //     });
    // if (compasionResult.length > 0){
    //   props.navigation.navigate(item)
    // } else {
    //   props.navigation.navigate('User')
    // }
    if (phoneNumber == null){
      props.navigation.navigate('User')
    } else {
      props.navigation.navigate(item,{name : name ? name : ''});
    }
    
  }

     return (
        <View style={styles.container}>
          {console.log("flag",flag)}
          {Platform.OS == "android" && 
          <StatusBar
            barStyle = "dark-content" 
            hidden = {false}
            backgroundColor = {EStyleSheet.value('$theme.primary')}/>
          }
          <SafeAreaView style={styles.background}>
            <View style={{top: Platform.OS == 'ios'?30:10}}>
                <Image source={require('../../assets/logo.png')}/>
            </View>
            <View style={{marginTop:Platform.OS == 'ios'?30:10}}>
                <Text style={{fontFamily: 'Ubuntu-Bold', fontSize: Platform.OS == 'ios'?36:30, textAlign:'center'}}>Shop Kitty</Text>
                <View style={{marginTop:3}}>
                <Text style={{fontFamily: 'Ubuntu-Regular', fontSize: Platform.OS == 'ios'?16:14, textAlign:'center', letterSpacing:1}}>shop with your pals</Text>
                </View>
            </View>
          </SafeAreaView>
          <View style={{flexDirection: 'row', marginHorizontal: Platform.OS == 'ios'?25:15, marginTop: Platform.OS == 'ios'?40: 15}}>
            <TouchableOpacity onPress={() => pageMove('Chats')} style={styles.firstItem}>
              {/* <Image source={require('../../assets/chats.png')}/> */}
              <Svg width={138} height={128} viewBox="0 0 138 128" fill="none" {...props}>
              <Path
                d="M8.125 29C5.89 30.515 1 30.5 1 22.5S13.25-.75 23.75.75c5.495.785 8.993 3.889 7.125 8.875C29.008 14.611 10.361 27.485 8.125 29zM110.295 116.056c4.535-4.535 10.291-6.866 16.556-8.056 1.484 0 3.025-.5 4.625-.5 1.231 0 5.797 1.783 4.5 8.528-.676 3.514-1.92 6.005-4.556 8.486-2.541 2.392-5.466 3.708-8.958 3.181-12.167-1.837-15.338-8.468-12.167-11.639z"
                fill="#FFDCE5"
              />
              <Path
                d="M114.53 105.477c-1.227-.389-2.718-1.059-3.399-1.295 0-.179.46.229.532.065.137-.307.359-.548.508-.845.253-.507.766-.989 1.132-1.421.317-.374.64-.748.964-1.115.644-.727 1.535-1.333 2.295-1.927.695-.544 1.309-1.187 2.014-1.716 1.014-.76 2.435-1.38 3.711-.888.594.228.553-.108.626.415.192 1.398-.165 4.202-.809 5.49-.644 1.288-.865 2.461-2.039 3.237-1.103.728-2.382.533-3.611.338-.643-.102-1.283-.243-1.924-.338z"
                fill="#E85F82"
              />
              <Mask
                id="prefix__a"
                maskUnits="userSpaceOnUse"
                x={0}
                y={11}
                width={138}
                height={98}
              >
                <Path
                  d="M133.971 50.157C108.733.375 42.999 3.278 14.751 35-.495 52.118-5.885 81.218 11.25 96.5c13.25 11.818 27.204 10.573 47.468 10.849 13.64.186 33.229 2.1 44.456 0 32.185-6.02 41.008-37.05 30.796-57.192z"
                  fill="#F6D4DD"
                />
              </Mask>
              <G mask="url(#prefix__a)">
                <Path
                  d="M134.167 50.157C110.155.375 43.375 3.028 16.5 34.75 1.997 51.868-3.051 83.968 13.25 99.25c12.607 11.818 30.044 7.823 49.323 8.099 12.978.186 31.614 2.1 42.296 0 30.62-6.02 39.013-37.05 29.298-57.192z"
                  fill="#F6D4DD"
                />
                <Path
                  d="M63.315 63.029a2 2 0 011.71-1.74l4.422-.614a2 2 0 012.256 2.254l-1.585 11.53a2 2 0 01-2.264 1.708l-4.09-.584a2 2 0 01-1.703-2.22l1.254-10.334z"
                  fill="#9B98BF"
                />
                <Path
                  d="M70.423 62.921a.564.564 0 11-.845-.747.564.564 0 01.845.747z"
                  fill="#565656"
                />
                <Path
                  d="M61.851 70.988c-.3 3.577.463 6.475-.279 8.836l3.887 2.811c3.51-4.268 5.172-7.623 5.433-11.465.22-3.23-1.166-4.941-2.691-3.284-1.906 2.07-2 3.41-3.665 6.25-.444.757-.83.55-1.047-.365l-.636-2.854c-.188-.93-.98-1.256-1.002.07zM55.709 57.972c.868-1.216-2.952-1.679-3.705-11.404-9.262-1.042-16.787 1.448-18.987 13.083-1.215 4.746-2.257 6.714-4.63 8.104l14.124 10.42c-.463-4.863-.984-7.7 1.852-11.81 3.763.927 7.062.29 8.162-2.836l.926-3.589c.995-.723 1.39-.752 2.258-1.968z"
                  fill="#E4A591"
                />
                <Path
                  d="M34.349 62.545c2.894 2.49 7.12-.926 5.267-3.705-5.615-2.315-1.1-11.461 3.705-4.978 2.142 1.331 5.326-2.026 2.894-4.862 2.432 2.605 8.683.868 7.526-3.82 6.425-.406 5.325-9.842.578-9.842.81-2.43-2.836-4.804-5.672-2.894 0-7.583-11.404-8.278-13.777-1.505-5.731-3.994-12.851 1.042-9.725 7.873-7.062-1.563-9.84 8.856-3.126 11.345-6.83 3.705-2.2 14.53 5.325 11.925 0 3.647 6.426 4.4 7.005.463z"
                  fill="#3B339B"
                />
                <Path
                  d="M12.294 100.518c0-9.146 13.904-34.244 16.324-32.763C41.5 71 45.125 82.375 51.375 91.625c3.563-4.75 6-7.375 10.25-12l4.313 2.625c-2 10-6.188 15.75-11.063 21.75-4.875-.75-6.625-1.875-9.75-3.482-1.04 5.109-1.343 6.237-2.383 11.346-11.23 0-20.492-4.168-30.448-11.346z"
                  fill="#FF80A1"
                />
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M34.02 92.833a.7.7 0 01.99-.016c3.646 3.533 6.365 5.347 10.83 7.637a.7.7 0 11-.639 1.246c-4.565-2.342-7.403-4.232-11.166-7.877a.7.7 0 01-.015-.99z"
                  fill="#D55E7D"
                />
                <Path
                  d="M79.326 32.56c-7.463 9.773-1.62 24.66 6.368 35.31l37.163 23.85c1.852-1.158 3.674-3.085 5.094-5.905 8.567-17.018-20.376-23.617-19.45-35.079 0-9.03-3.288-16.008-7.525-18.987-7.41-5.21-16.787-5.557-21.65.81z"
                  fill="#FF5845"
                />
                <Path
                  d="M106.185 65.902c-9.377-1.968-13.404-.522-21.65 3.242-5.325 2.431-9.26 7.062-11.229 12.62-2.532 7.149-2.084 16.555-1.042 26.627 19.681.579 29.985 0 50.13-5.094 1.389-9.262 1.43-21.997-3.126-28.596-3.358-4.862-7.153-7.554-13.083-8.799z"
                  fill="#E85F82"
                />
                <Path
                  d="M89.514 68.912c0-2.396 0-4.341-.752-6.425l7.93-8.046c.521 5.557 2.026 9.204 5.789 11.056-1.389 4.805-9.204 9.088-12.967 3.415z"
                  fill="#FBA09E"
                />
                <Path
                  d="M86.388 62.198c-4.515-3.879-5.615-7.294-7.409-14.067 2.894-1.678 4.92-4.862 5.21-9.493 3.705 5.094 5.962 5.73 11.172 6.83 5.268-3.415 5.557 6.31 2.142 6.889-.407 2.803-.869 4.284-2.142 6.367-1.772 2.9-6.03 6.002-8.973 3.474z"
                  fill="#FFBEB4"
                />
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M82.544 86.156a.5.5 0 01.08.703c-2.292 2.882-3.138 5.435-3.194 7.725-.056 2.3.683 4.393 1.664 6.356.491.982 1.037 1.922 1.57 2.839l.008.013c.527.907 1.044 1.797 1.463 2.66.836 1.721 1.343 3.459.677 5.168a.5.5 0 11-.932-.363c.507-1.301.164-2.704-.645-4.369-.4-.826-.9-1.687-1.435-2.606l-.002-.004c-.53-.912-1.092-1.877-1.598-2.891-1.015-2.03-1.831-4.294-1.77-6.827.062-2.544 1.007-5.302 3.412-8.324a.5.5 0 01.702-.08z"
                  fill="#FFAEC3"
                />
                <Path
                  d="M77.851 81.677a2 2 0 01.796-2.963l3.888-1.803a2 2 0 012.49.682l5.863 8.531a2 2 0 01-.549 2.803l-3.44 2.266a2 2 0 01-2.737-.522l-6.311-8.994z"
                  fill="#fff"
                />
                <Path
                  d="M84.105 78.423a.564.564 0 11-1.128 0 .564.564 0 011.127 0z"
                  fill="#858585"
                />
                <Path
                  d="M89.38 82.834c2.789 2.748 4.215 5.689 6.505 7.116l-1.221 5.086c-5.936-1.041-9.693-2.638-12.638-5.632-2.474-2.517-2.542-4.918-.102-4.63 3.046.362 4.076 1.404 7.47 2.572.905.311 1.078-.133.607-1.046l-1.5-2.813c-.505-.903-.08-1.735.88-.653z"
                  fill="#FFBEB4"
                />
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M109.148 79.76a.5.5 0 01.545.45c.396 4.152 1.27 6.645 2.297 9.572.462 1.316.955 2.72 1.448 4.402a.5.5 0 01-.737.57c-1.968-1.181-4.608-2.122-7.478-2.944-2.047-.587-4.185-1.106-6.257-1.609-.707-.171-1.406-.341-2.09-.51-.567.974-.908 1.723-1.176 2.564-.28.878-.483 1.865-.767 3.334.513.323 1.012.64 1.5.948 5.759 3.643 9.989 6.319 16.977 8.718a.5.5 0 11-.325.946c-7.103-2.438-11.424-5.173-17.18-8.815-.582-.368-1.179-.746-1.794-1.133a.5.5 0 01-.225-.518c.317-1.642.54-2.773.861-3.784.326-1.023.75-1.913 1.459-3.093a.5.5 0 01.55-.228c.786.196 1.598.394 2.425.594 2.079.505 4.249 1.032 6.317 1.624 2.408.69 4.715 1.478 6.623 2.445-.35-1.105-.702-2.11-1.042-3.078-1.045-2.982-1.974-5.634-2.381-9.91a.5.5 0 01.45-.545z"
                  fill="#FFE8EE"
                />
              </G>
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M23.75 3.983a3 3 0 00-3 3v13.25a3 3 0 003 3h4.675l2.102 3.158 1.831-3.158h30.267a3 3 0 003-3V6.983a3 3 0 00-3-3H23.75zM82.881 9.933a3 3 0 00-3 3v7.626a3 3 0 003 3h20.393l1.885 2.832 1.641-2.832h1.331a3 3 0 003-3v-7.626a3 3 0 00-3-3h-25.25z"
                fill="#fff"
              />
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M25.938 9.933c0-.465.376-.842.841-.842h32.817a.842.842 0 110 1.684H26.779a.842.842 0 01-.841-.842zm0 3.675c0-.465.376-.842.841-.842h32.817a.842.842 0 110 1.683H26.779a.842.842 0 01-.841-.841zm.841 2.833a.842.842 0 100 1.683h15.192a.842.842 0 000-1.683H26.779zM83.817 14.067a.842.842 0 000 1.683h23.379a.84.84 0 100-1.683h-23.38zm12.803 3.675a.842.842 0 000 1.683h10.576a.84.84 0 100-1.683H96.62z"
                fill="#E1E0ED"
              />
            </Svg>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pageMove('Photos')} style={styles.secondItem}>
              <Image source={require('../../assets/photos.png')}/>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', marginHorizontal: Platform.OS == 'ios'?25:10, marginTop: Platform.OS == 'ios'?10:4}}>
            <View style={{flex:1, marginRight: 10}}>
              <Text style={styles.itemTitleText}>chats</Text>
              <Text style={styles.itemBodyText}>shop and chat with your friends</Text>
            </View>
            <View style={{flex:1, marginLeft: 10}}>
              <Text style={styles.itemTitleText}>photos</Text>
              <Text style={styles.itemBodyText}>share your saved photos</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginHorizontal: Platform.OS == 'ios'?25:15, marginTop: Platform.OS == 'ios'?40: 12}}>
            <TouchableOpacity onPress={() => pageMove('Camera')} style={[styles.firstItem, {backgroundColor: '#C1E9F5'}]}>
               <Image source={require('../../assets/camera.png')}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pageMove('WebStores')} style={[styles.secondItem, {backgroundColor: '#D4F0F0'}]}>
              <Image source={require('../../assets/webstores.png')}/>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', marginHorizontal: Platform.OS == 'ios'?25:15, marginTop: Platform.OS == 'ios'?10:5}}>
            <View style={{flex:1, marginRight: 10}}>
              <Text style={styles.itemTitleText}>camera</Text>
              <Text style={styles.itemBodyText}>take a photo and share it</Text>
            </View>
            <View style={{flex:1, marginLeft: 10}}>
              <Text style={styles.itemTitleText}>web stores</Text>
              <Text style={styles.itemBodyText}>visit your favorite stores</Text>
            </View>
          </View>
          <View style={styles.copyRight}>
            <Text style={{fontSize: 16, fontFamily:'Roboto-Light', textAlign: 'center'}}>Copyright {'\u00A9'} 2020 shopkitty.com </Text>
          </View>
        </View>
    );
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$theme.background'
  },
  copyRight: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right:0
  },
  background: {
    height:Platform.OS == 'ios'?250: 155, 
    backgroundColor: '$theme.primary', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 6, 
    alignItems:'center'
  },
  firstItem:{
    flex:1,
    height:Platform.OS == 'ios'?180: 150, 
    backgroundColor:'#FFE8EE', 
    marginRight: 10, 
    borderTopLeftRadius:6,
    borderTopRightRadius: 30,
    borderBottomLeftRadius:30,
    borderBottomRightRadius: 6,
    justifyContent: 'center',
    alignItems:'center'
  },
  secondItem: {
    flex:1, 
    height:Platform.OS == 'ios'?180:150, 
    backgroundColor: '#EEDBF9',
    marginLeft: 10,
    borderTopLeftRadius:30,
    borderTopRightRadius: 6,
    borderBottomLeftRadius:6,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems:'center'
  },
  itemTitleText: {
    fontFamily: 'Ubuntu-Bold', 
    fontSize: Platform.OS == 'ios'?20:18
  },
  itemBodyText: {
    fontFamily:'Roboto-Light', 
    fontSize: Platform.OS == 'ios'?12:11,
    color: '#6C6C6C',
    marginTop: Platform.OS == 'ios'?5:3
  }
});
export default Home;
