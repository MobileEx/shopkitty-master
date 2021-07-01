import React from 'react';
import {
  Image,
  View
} from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import LeftDrawer from '../components/LeftDrawer';
import Home from '../Screens/Home';
import Camera from '../Screens/Camera';
import Photo from '../Screens/Photo'
import WebPage from '../Screens/WebPage';
import ChatDetail from '../Screens/ChatDetail';
import InviteConfirmation from '../Screens/InviteConfirmation';
import Chats from '../Screens/Chats';
import Friends from '../Screens/Friends';
import Photos from '../Screens/Photos';
import WebStores from '../Screens/WebStores';
import Invite from '../Screens/Invite';
import User from '../Screens/User';
import Settings from '../Screens/Settings';
import About from '../Screens/About';
import Icon from 'react-native-vector-icons/FontAwesome';
import Contacts from '../Screens/Contacts';

const MainStackNavigator = createStackNavigator({
  Home,
  Camera,
  Photo,
  WebPage,
  ChatDetail,
  InviteConfirmation,
  Chats,
  Friends,
  Invite,
  WebStores,
  Photos,
  User,
  Settings,
  About,
  Contacts
}, {
  initialRouteName: 'Home',
  headerMode: 'none'
})
const MainDrawerNavigator = createDrawerNavigator({
  Home : MainStackNavigator,
}, {
  contentComponent: LeftDrawer,
  drawerType: 'front',
  drawerWidth: '100%',
  hideStatusBar: true,
  drawerBackgroundColor: 'rgba(0,0,0,0.2)',
}
);
// SWITCH FOR LOADING, AUTH AND MAIN SCREENS
const switchNavigator = createSwitchNavigator(
  {
    App: MainDrawerNavigator,
  },
  {
    headerMode: 'none',
    initialRouteName: 'App'
  }
);
export default createAppContainer(switchNavigator);