
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput} from 'react-native';


class Input extends Component {
    state={
        text: ''
    }
    render() {
        
        const {placeholder, onSubmit} = this.props
        const {text} = this.state
        return (
            <TextInput 
                underlineColorAndroid="rgba(0,0,0,0)"
                value={this.state.text}
                onChangeText={(text)=>{this.setState({text})}}
                onSubmitEditing={()=>{onSubmit(text); this.setState({text:''})} }
                placeholderTextColor="white" 
                style={styles.container} 
                placeholder={placeholder}
                blurOnSubmit={false}
            />
        );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#24292e',
    padding: 10,
    paddingLeft: 20,
    color:'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  
 
});

export default Input;