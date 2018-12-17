
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableHighlight} from 'react-native';


class Checkbox extends Component {
  render() {
    
    const {checked, makeCheck} = this.props
   
    return (
        <TouchableHighlight onPress={makeCheck}>
            <View style={styles.box} >
                {
                    checked? <View style={styles.check}></View>:null
                }
            </View>
        </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
    box: {
        borderColor:'#24292e',
        borderWidth: 2,
        width: 25,
        height: 25,
    },
    check: {
        backgroundColor: '#24292e',
        flex:1,
        margin: 2,
    },
 
});

export default Checkbox;