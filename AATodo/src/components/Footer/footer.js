
import React, {Component} from 'react';
import { StyleSheet, Text, View,TouchableOpacity} from 'react-native';


class Footer extends Component {
  render() {
    const {children, removeAll} = this.props
    return (
        <TouchableOpacity onPress={removeAll}>
            <View style={styles.container}>
                <Text style={styles.text}>{children}</Text>
            </View>
        </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#AA3939',
    padding: 10,
    alignItems: 'center',
  },
  text:{
      color: 'white',
      fontWeight:'bold',
  }
 
});

export default Footer;