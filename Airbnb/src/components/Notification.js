import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import colors from '../styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome'
import { 
    View, 
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

export default class Notification extends Component {
  render() {
    const { type, firstLine, secondLine} = this.props
    return (
      <View style={styles.wrapper}>
        <View style={styles.notificationContent}>
            <Text style={styles.errorText}>{type}</Text>
            <Text style={styles.errorMessage}>{firstLine}</Text>
            <Text style={styles.errorMessage}>{secondLine}</Text>
        </View>
      </View>
    );
  }
}

Notification.propTypes = {
    type: PropTypes.string,
    firstLine: PropTypes.string,
    secondLine: PropTypes.string,
}

const styles = StyleSheet.create({
    wrapper:{
        backgroundColor: colors.white,
        height: 60,
        width: '100%',
        padding: 10
    },
    notificationContent:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    errorText:{
        color: colors.darkOrange
    },
    errorMessage:{
        marginBottom: 2,
        fontSize: 14,
    }
})