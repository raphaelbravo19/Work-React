import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ImageBackground, Image} from 'react-native';
import colors from '../../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
export default class Item extends Component{
  render() {
    const{source,label, item} = this.props
    return (
      
      <View style={styles.container}>
      
          <ImageBackground source={require('../../../assets/img/qqq.png')} style={styles.icon}>
            <Image source={item.icon} />
          </ImageBackground>
        
        <Text style={styles.title}>{item.label}</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center',
  },
  icon:{
    width:65,
    height:65,
    justifyContent: 'center',
    alignItems:'center',
  },
  title:{
    color: colors.slateGray,
    fontSize: 11,
    fontWeight: '500',
  },
  '@media (min-width: 200) and (max-width: 400)': { // media queries
    icon:{
      width:50,
      height:50,
      
    },
  }
});
