import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import colors from '../../styles/colors'
import EStyleSheet from 'react-native-extended-stylesheet';
export default class Header extends Component{
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.iconLeft}>
          <Image source={require('../../assets/img/sidelist.png')} resizeMode="stretch"/>
        </View>
        <Text style={styles.titleCentral} >CASH REGISTRER</Text>
        <View style={styles.iconRight}>
          <View style={styles.iconContainer}>
            <View style={styles.iconItem}>
              <Image source={require('../../assets/img/Fill.png')} resizeMode="contain" style={{height:30}}/>
            </View>
            <View style={styles.iconItem}>
              <Image source={require('../../assets/img/Cart.png')} resizeMode="contain" style={{height:20}}/>
            </View>
            <View style={styles.iconItem}>
              <Image source={require('../../assets/img/MoreDot.png')} resizeMode="contain" style={{height:20}}/>
            </View>
            
          </View>
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: colors.darkBlue,
    padding: 22,
  },
  iconLeft:{
    position: 'absolute',
    height: '100%',
    left:20,
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    justifyContent: 'center'
  },
  iconRight:{
    flexDirection: 'row',
    position: 'absolute',
    height:'100%',
    right:12,
    alignItems:'center'
  },
  iconItem:{
    height:'100%',
    justifyContent:'center',
    marginHorizontal: 8,
  },
  iconContainer:{
    flexDirection: 'row',
    height:'100%',
    justifyContent:'space-between'
  },
  titleCentral:{
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign:'center'
  },
  '@media (min-width: 200) and (max-width: 400)': { // media queries
    titleCentral: {
      fontSize: 14,
      letterSpacing: 1,
    },
    iconRight:{
      right:8,
    },
    iconLeft:{
      left:14,
    },
    iconItem:{
      marginHorizontal: 5,
    },
  }

});
