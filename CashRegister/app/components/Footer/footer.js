import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Image} from 'react-native';
import colors from '../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class Footer extends Component{
  render() {
    return (
      <View style={styles.container}>
      <Image source={require('../../assets/img/Group.png')} resizeMode="contain" style={styles.img}/>
        <Text style={styles.title} > ADD CUSTOMER</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: colors.darkGray,
    padding: 10,
  },
  title:{
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2
  },
  img:{

  },
  '@media (min-width: 200) and (max-width: 400)': { // media queries
    title:{
      fontSize: 12,
    fontWeight: '600',
    },
    img:{
      height:'90%'
    }
  }
});
