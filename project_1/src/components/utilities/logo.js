import React from 'react';
import {View, Image, Dimensions} from 'react-native';
import {TextMontserrat} from 'components';
import Logo from 'assets/images/ep_logo.png';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const lineStyle = {
    width: (15/100) * width,
    height: (.4/100) * height,
    backgroundColor: 'white'
}
export default () => {
    return (
        <View style={{alignItems: "center"}}>
            <Image 
                resizeMode="contain"
                style={{
                    width: (60/100) * Dimensions.get('window').width,
                    height: 60
                }} source={Logo}/>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={lineStyle}/>
                    <TextMontserrat style={{marginHorizontal: 15, color: 'white', fontWeight: '700', fontSize: 13}}>LEARN MORE</TextMontserrat>
                <View style={lineStyle}/>
            </View>
        </View>
    )
}