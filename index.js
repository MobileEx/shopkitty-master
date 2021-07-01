/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { themes } from './src/Themes';
import AsyncStorage from '@react-native-community/async-storage';

// async function getTheme(){
//     let theme = await AsyncStorage.getItem('theme');
//     if (theme === null){
//         console.log("I am here", theme)
//       global.theme = themes.light
//     } else {
        
//         console.log("I am here", theme)
//       global.theme = theme;
//     }
// }
// getTheme();
  global.theme = themes.light

  AppRegistry.registerComponent(appName, () => App);