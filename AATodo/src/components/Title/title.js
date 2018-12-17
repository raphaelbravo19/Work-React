
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';


class Title extends Component {
  render() {
    const {children} = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{children}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    padding: 10,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
 
});

export default Title;