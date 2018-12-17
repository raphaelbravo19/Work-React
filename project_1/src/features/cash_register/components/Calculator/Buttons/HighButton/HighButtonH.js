import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ImageBackground,TouchableOpacity} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class HighButtonH extends Component{
  render() {
    const { number, actionButton} = this.props
    return (
      <TouchableOpacity style={styles.container} onPress={actionButton}>
        <ImageBackground 
            source={require('../../../../assets/img/rectangleHigh2.png')}
            style={styles.imgb}
            resizeMode="stretch"
        >  
               <View style={styles.fieldResult}>
                <Text style={styles.textField}>{number}</Text>
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
    flex:2,
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
