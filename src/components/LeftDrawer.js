
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; 
import Icon from "react-native-vector-icons/AntDesign";
import {DrawerActions} from 'react-navigation-drawer';
const LeftDrawer = (props) => {
  return (
    <View style={{flex:1, flexDirection: 'row', backgroundColor:'transparent'}}>
      <LinearGradient 
        colors={['#E9D2E9', '#9D649D']}
        style={styles.gradientStyle}>
        {/*My Profile*/}
        <ScrollView>
          <TouchableOpacity onPress={() => props.navigation.navigate('Home')}
            style={[styles.drawerIconViewStyle, global.page == 'Home'&&{backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 10, marginRight: 8}, {marginTop: Platform.OS == 'ios'?50:25}]}>
            <View style={styles.itemIconStyle}>
              <Image
                  style={styles.drawerIconStyle}
                  source={require('../assets/drawer_home.png')}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={styles.drawerIconTextStyle}>
                Home
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.dashline}/>
          <TouchableOpacity onPress={() => props.navigation.navigate('Camera')}
            style={[styles.drawerIconViewStyle, global.page == 'Camera'&&{backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 10, marginRight: 8}, {marginTop: Platform.OS == 'ios'?25:20}]}>
            <View style={styles.itemIconStyle}>
              <Image
                  style={styles.drawerIconStyle}
                  source={require('../assets/drawer_camera.png')}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={styles.drawerIconTextStyle}>
                Camera
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate('Photos')}
            style={[styles.drawerIconViewStyle, global.page == 'Photos'&&{backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 10, marginRight: 8}]}>
            <View style={styles.itemIconStyle}>
              <Image
                  style={styles.drawerIconStyle}
                  source={require('../assets/drawer_photos.png')}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={styles.drawerIconTextStyle}>
                Photos
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate('WebStores')}
            style={[styles.drawerIconViewStyle, global.page == 'WebStores'&&{backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 10, marginRight: 8}]}>
            <View style={styles.itemIconStyle}>
              <Image
                  style={styles.drawerIconStyle}
                  source={require('../assets/drawer_webstore.png')}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={styles.drawerIconTextStyle}>
                Web Stores
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate('Chats')}
            style={[styles.drawerIconViewStyle, global.page == 'Chats'&&{backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 10, marginRight: 8}]}>
            <View style={styles.itemIconStyle}>
              <Image
                  style={styles.drawerIconStyle}
                  source={require('../assets/drawer_chat.png')}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={styles.drawerIconTextStyle}>
                Chats
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate('Friends')}
            style={[styles.drawerIconViewStyle, global.page == 'Friends'&&{backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 10, marginRight: 8}]}>
            <View style={styles.itemIconStyle}>
              <Image
                  style={styles.drawerIconStyle}
                  source={require('../assets/drawer_friend.png')}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={styles.drawerIconTextStyle}>
                Friends
              </Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.dashline, {marginTop: Platform.OS == 'ios'?80:40}]}/>
          <TouchableOpacity onPress={() => props.navigation.navigate('Settings')}
            style={[styles.drawerIconViewStyle, global.page == 'Settings'&&{backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 10, marginRight: 8} ,{marginTop: Platform.OS == 'ios'?25:20}]}>
            <View style={styles.itemIconStyle}>
              <Image
                  style={styles.drawerIconStyle}
                  source={require('../assets/drawer_setting.png')}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={styles.drawerIconTextStyle}>
                Settings
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate('About')}
            style={[styles.drawerIconViewStyle, global.page == 'About'&&{backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 10, marginRight: 8}]}>
            <View style={styles.itemIconStyle}>
              <Image
                  style={styles.drawerIconStyle}
                  source={require('../assets/drawer_about.png')}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={styles.drawerIconTextStyle}>
                About
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={()=>props.navigation.dispatch(DrawerActions.closeDrawer())}>
          <Icon name='close' size={26} color='#FFF'/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LeftDrawer;

const styles = StyleSheet.create({

  drawerIconStyle: {
    height: 22,
    width: 22,
  },
  itemStyle: {
    justifyContent: 'center'
  },
  itemIconStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)', 
    width: 55, 
    height: 55, 
    borderRadius: 10, 
    justifyContent:'center', 
    alignItems:'center'
  },
  drawerIconViewStyle: {
    flexDirection: 'row',
    marginBottom:Platform.OS == 'ios'?25:20,
    marginLeft: 8
  },
  dashline: {
    borderWidth: 1,
    borderColor: '#E5D9E5'
  },
  drawerIconTextStyle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#000',
    lineHeight: 19,
    marginLeft: 25,
  },
  gradientStyle: {
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    width:'85%', 
    paddingVertical: 16, 
    paddingHorizontal: 25
  }
});
