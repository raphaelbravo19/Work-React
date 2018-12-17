import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions} from 'react-native';
import CashScreen from './app/screens/cashScreen'
import colors from './app/styles/colors'
import EStyleSheet from 'react-native-extended-stylesheet';

let {height, width} = Dimensions.get('window');
EStyleSheet.build({
  $rem: width > 400 ? 18 : 16
  
});
export default class App extends Component{
  render() {
    return (
      <View style={styles.container}>
        <CashScreen/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightWhite,
  },
});
