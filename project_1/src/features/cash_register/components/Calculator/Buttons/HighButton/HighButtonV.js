import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ImageBackground,Image,TouchableOpacity} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class HighButtonV extends Component{
  render() {
    const {type,icon,label,color, actionButton}=this.props
    return (
      <TouchableOpacity style={styles.container} onPress={actionButton}>
        <ImageBackground 
            source={require('../../../../assets/img/rectangleHigh.png')}
            style={styles.imgb}
            resizeMode="stretch"
        >  
            {
              type==='icon'?
              <Image source={icon} resizeMode="stretch"/>
              :<Text style={[{color},styles.textField]}>{label}</Text>
            }
                
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
  },
  imgb:{
    width:'100%',
    height:'100%',
    justifyContent: 'center',
    alignItems:'center',
    
  },
  fieldResult:{
    justifyContent: 'center',
    alignItems:'center',
  },
  textField:{
    fontSize: 50,
    fontWeight: '700',
  },
});
