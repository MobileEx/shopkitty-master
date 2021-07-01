import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  ScrollView,
  Image
} from 'react-native';
import Header from '../../components/Header';
import CustomButton from '../../components/CustomButton'
import CustomInput from '../../components/CustomInput'
import Dialog, {DialogContent, DialogFooter, DialogButton} from 'react-native-popup-dialog';
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-community/async-storage';
import EStyleSheet from 'react-native-extended-stylesheet';

function WebStores(props){
  const [value, setValue] = useState('');
  const [sitelist, setSitelist] = useState('');
  const [counter, setCounter] = useState(0);
  const [selectItem, setSelectItem] = useState([]);
  const [flag, setFlag] = useState(0);
  const colors = ['#F6D4DD', '#C1E9F5', '#B8DEDE', '#F2E1FF', '#C8D4F5', '#BF9B9A', '#EEDAA5', '#D0EF8D', '#EAB1E5', '#C9B1EA' ]
  global.page = '';
  EStyleSheet.build({
    $theme: global.theme
  });
  useEffect(() => {
    const unscribe = props.navigation.addListener('didFocus', () => {
      EStyleSheet.build({
        $theme: global.theme
      });
      setFlag(1);
      getList();
    });
    const unblur = props.navigation.addListener('didBlur', () => {
      setFlag(0);
    })
    return () => { 
      unblur.remove();
      unscribe.remove();
    }
  }, [])
 
  const getList = () => {
    let brandlinkref = firestore().collection('brandlinklists')
      return brandlinkref.get().then(querySnapshot => {
        const brandlinklist = [];
        querySnapshot.forEach(doc => {
          const {url, id} = doc.data();
          brandlinklist.push({url, id})
        });
        let mylinkref = firestore().collection('mylinklists')
        return mylinkref.get().then(async(querySnapshot) => {
          let phoneNumber = await AsyncStorage.getItem('phoneNumber');
          querySnapshot.forEach((doc) => {
            const {url, from, created_at, id} = doc.data();
            if (created_at == phoneNumber){
              brandlinklist.push({url, id})
            }
          });
          setSitelist(brandlinklist)
        });
      });
  }

  const goWebPage = () => {
    if (value != ''){
      props.navigation.navigate('WebPage', {url: value})
      setValue('')
    } else{
      setValue('')
    }
  }

  const itemCheckLongPress = (index) => {
    let clonelist = [...sitelist];
    console.log('cloneList', clonelist)
    let count = 0;
    let selectedItem = []    
    clonelist[index].checked = !clonelist[index].checked
    for(var i = 0; i < clonelist.length; ++i){
      if(clonelist[i].checked) {
        selectedItem.push(clonelist[i].id)
        count++;
      }
    }
    setCounter(count);
    setSelectItem(selectedItem);
  };

  const deleteItems = async() => {
    console.log("tere",selectItem)
    await Promise.all(selectItem.map(item => {
      firestore()
      .collection('mylinklists')
      .doc(item)
      .delete()
      .then(() => {
        console.log('User deleted!');
      });
    }))
    await Promise.all(selectItem.map(item => {
      firestore()
      .collection('brandlinklists')
      .doc(item)
      .delete()
      .then(() => {
        console.log('User deleted!');
      });
    }))
    setCounter(0);
    setSelectItem([]);
    getList();
  }

  const renderItem = ({item, index}) => {
    let colorItem = index%10;
    let urlArr = item.url.split('.');
    let title = '';
    let nameArr = [];
    if (urlArr.length == 2){
      title = urlArr[0]
    } else {
      title = urlArr[1]
    }
    let titleName = title.split(' ');
    for (let i=0;i<titleName.length;i++){
      nameArr.push(titleName[i].substr(0,1))
    }

    return (
      <View style={styles.listViewStyle}>
        <TouchableOpacity onLongPress={() => itemCheckLongPress(index)} onPress={() => props.navigation.navigate('WebPage', {url:item.url})} style={{flexDirection: 'row', justifyContent:'center'}}>
          {item.checked&&
            <View style={styles.checkbuttonStyle}>
              <Image source={require('../../assets/ic_check.png')}/>
            </View>
          }
          <View style={{flex:1, justifyContent: 'center'}}>
            <View style={[styles.itemImageViewStyle, {backgroundColor: colors[colorItem]}]}>
              <Text style={styles.itemImageTextStyle}>{nameArr.join().replace(',','').toUpperCase()}</Text>
            </View>
          </View>
          <View style={{flex:3, justifyContent: 'space-around'}}>
            <Text style={styles.nameTextStyle}>{title.toUpperCase()}</Text>
            <Text style={styles.urlTextStyle}>{item.url}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  } 
  return (
    <View style={styles.container}>
      <Header title='Web Stores' navigation={props.navigation}/>
      {counter != 0 &&
      <View style={styles.selectedViewStyle}>
        <View style={{flex:1}}>
          <Text style={styles.selectTextStyle}>
            Selected: {counter}
          </Text>
        </View>
        <TouchableOpacity onPress={() => deleteItems()} style={{flex:1, alignItems:'flex-end'}}>
          <Image source={require('../../assets/ic_delete.png')}/>
        </TouchableOpacity>
      </View>
      }
      <ScrollView style={{marginTop: Platform.OS == 'ios'?30:18}}>
        <FlatList
            data={sitelist}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id}
        />
      </ScrollView>
      <CustomInput 
          inputWrapperStyle={{
              marginBottom: 15
          }}
          placeholder="Enter URL(macys.com)"
          placeholderTextColor="#6C6C6C"
          value = {value}
          onChangeText={(text)=> setValue(text)}
      />
      <CustomButton 
        ButtonStyle={{marginBottom: Platform.OS == 'ios'?50:30, backgroundColor: value == ''?'lightgray':'#ACE4E4'}}
        textValue='Go'
        onPress={()=> value != ''&&goWebPage()}/>
      </View>
);
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$theme.background'
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
    dialogCustomStyle: {
      width: 288, 
      height: 154,
      borderTopLeftRadius: 30, 
      borderTopRightRadius: 6, 
      borderBottomRightRadius: 30, 
      borderBottomLeftRadius: 6, 
      justifyContent: 'center'
    },
    selectedViewStyle: {
      marginTop: Platform.OS=='ios'?20:10, 
      flexDirection: 'row', 
      alignContent: 'space-between', 
      marginHorizontal: 20
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
      right:2, 
      backgroundColor: '#ECE8EE', 
      borderRadius: 4, 
      borderWidth: 2, 
      borderColor: "#fff", 
      alignItems:'center', 
      justifyContent:'center'
    },
  });
export default WebStores;
