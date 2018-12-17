import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, PixelRatio, Dimensions} from 'react-native';
import {CREATE_ACCOUNT} from 'navigation/screen_names';
import {DoubleBackground, TextMontserrat, BackHeader} from 'components';
import Card from '../../components/cards';
import {FloatingTextInput} from 'components/inputs';
import Logo from 'components/utilities/logo'
import TouchableText from '../../components/texts/TextTouchable';
import colors from 'api/colors';
import { ButtonGradient, ButtonOutline } from 'components';
class Login extends Component {

    static navigationOptions = {
        header: null
    }

    render() {

        return (
            <DoubleBackground>
                <BackHeader {...this.props} />
                <TextMontserrat>Forgot Password Screen</TextMontserrat>
            </DoubleBackground>
        )
    }
}

export default Login;