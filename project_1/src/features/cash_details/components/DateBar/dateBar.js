import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import colors from '../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class DateBar extends Component{
  render() {
    //const {value} = this.props
    return (
      <View style={styles.container}>
        <View>
        <Image source={require('../../assets/img/Wallet.png')} resizeMode="contain" />
        <Text style={styles.title}>01 Sept 2018 - 30 Sept 2018</Text>
        <Image source={require('../../assets/img/Wallet.png')} resizeMode="contain" />
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    flexDirection:'row',
    justifyContent:'',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  title:{
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2
  },
  '@media (min-width: 200) and (max-width: 400)': { // media queries
    title:{
      fontSize: 11,
      fontWeight: '500',
      letterSpacing: 1,
    },
    container: {
      
      paddingHorizontal: 14,
    },
  }
});
