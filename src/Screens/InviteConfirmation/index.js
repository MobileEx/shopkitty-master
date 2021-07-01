import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text
} from 'react-native';
const InviteConfirmation = (props) => { 
     return (
        <SafeAreaView style={styles.container}>
          <Text> Hello world </Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10A2EF',
    justifyContent: 'center',
  }
});
export default InviteConfirmation;
