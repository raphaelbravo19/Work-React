import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity} from 'react-native';
import colors from '../../styles/colors'
import EStyleSheet from 'react-native-extended-stylesheet';
export default class Header extends Component{
  
  render() {
    const {label, cant, toggleSide, toggleRight}=this.props
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.iconLeft} onPress={toggleSide}>
          <Image source={require('../../assets/img/sidelist.png')} resizeMode="stretch"/>
        </TouchableOpacity>
        <Text style={styles.titleCentral} >{label}</Text>
        <View style={styles.iconRight}>
          <View style={styles.iconContainer}>
            <View style={styles.iconItem}>
              <Image source={require('../../assets/img/Fill.png')} resizeMode="contain" />
              <View style={styles.stack}>
                <Text style={styles.stackText}>5</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.iconItem} onPress={toggleRight}>
              <Image source={require('../../assets/img/Cart.png')} resizeMode="contain" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cant}</Text>
              </View>
            </TouchableOpacity>
            <View style={[styles.iconItem,styles.marginExtra]}>
              <Image  source={require('../../assets/img/MoreDot.png')} resizeMode="contain" />
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
  badge:{
    position: 'absolute',
    right:-8,
    top:-7,
    backgroundColor: colors.gray,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  badgeText:{
    color: colors.white,
    fontSize:9,
    fontFamily: 'Montserrat-Bold'
  },
  stack:{
    position: 'absolute',
    left: '27%',
    top: '5%',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 20,
  },
  stackText:{
    color: colors.white,
    fontSize:13,
    fontWeight:'bold'
  },
  iconRight:{
    flexDirection: 'row',
    position: 'absolute',
    height:'100%',
    right:6,
    alignItems:'center'
  },
  iconItem:{
    height:'100%',
    justifyContent:'center',
    marginHorizontal: 8,
  },
  marginExtra:{
    marginLeft: 12,
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
    stack:{
      top: -2
    },
    marginExtra:{
      marginLeft: 7,
    },
  }

});
