import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ImageBackground, TouchableOpacity} from 'react-native';
import colors from '../../../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class NumberButton extends Component{
  render() {
    const { number, type, textcolor, handleSum } = this.props
    const color = textcolor || colors.gray
    return (
      <TouchableOpacity style={styles.container} onPress={handleSum}>
        <ImageBackground 
            source={require('../../../../assets/img/rectangle.png')}
            style={styles.imgb}
            resizeMode="stretch"
        >  
            <View style={styles.fieldResult}>
                <Text style={[{color},styles.textField]}>{number}</Text>
            </View>
                
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
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
  },
  fieldResult:{
    justifyContent: 'center',
    alignItems:'center',
  },
  textField:{
    fontSize: 32,
    fontWeight: '700',
  },
  '@media (min-width: 200) and (max-width: 400)': { // media queries
    textField:{
      fontSize: 26,
      fontWeight: '600',
    },
  }

});
