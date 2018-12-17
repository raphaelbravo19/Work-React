import React, {Component} from 'react';
import {View, Platform} from 'react-native';

class Card extends Component {
    render() {

        const rootStyle = {
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 15,
            ...Platform.select({
                ios: {
                    shadowOffset: {
                        width: 0,
                        height: 10
                    },
                    shadowRadius: 10,
                    shadowColor: 'black',
                    shadowOpacity: .3,
                }, android: {
                    elevation: 10,
                }
            })
            
        }
        const {children, style} = this.props;
        return (
            <View style={[rootStyle, style]}>
                {children}
            </View>
        )
    }
}

export {Card}