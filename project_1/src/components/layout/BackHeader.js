import React, {Component} from 'react';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';

export default class BackHeader extends Component {
    render() {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <IconMaterialCommunityIcons style={{color: 'white'}} size={50} name="chevron-left"/>
            </TouchableOpacity>
        )
    }
}