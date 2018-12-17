import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import bg_blue_pattern from 'assets/images/bg/bg_blue_pattern.png';
import bg_white_pattern from 'assets/images/bg/bg_white_pattern.png';
class DoubleBackground extends Component {

    render() {
        const {children} = this.props;
        return (
            <View style={{flex: 1}}>
                <Image source={bg_blue_pattern} style={{flex: 45, width: '100%'}} resizeMode={'stretch'}/>
                <Image source={bg_white_pattern} style={{flex: 55, width: '100%'}} resizeMode={'stretch'}/>

                <View style={{flex: 1, position: "absolute", width: '100%', height: '100%'}}>
                    <SafeAreaView style={{flex: 1}}>
                        {children}
                    </SafeAreaView>
                </View>
            </View>
        )
    }
}

export default DoubleBackground;