import React, {Component} from 'react';
import {View, PixelRatio, Dimensions} from 'react-native';
import {Colors} from 'api';
import { DoubleBackground, Card, TextMontserrat, BackHeader, ButtonGradient} from 'components';
import Logo from 'components/utilities/logo';
import TouchableText from '../../components/texts/TextTouchable';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CreateAccountForm from './components/create_account_form';
import * as responsive from '../login/api/responsiveHelper'
import { ScrollView } from 'react-native-gesture-handler';
import EStyleSheet from 'react-native-extended-stylesheet';

class CreateAccount extends Component {

    static navigationOptions = {
        header: null
    }

    getStyles = () => {
        return EStyleSheet.create({
            mainContainer: {
                flex: 1,
            },
            scroll: {
                backgroundColor: 'green',
                flex: 1
            },
            logoContainer: {
                flexGrow: 1,
                justifyContent: 'center',
            },
            cardContainer: {
                backgroundColor: 'red',
                alignItems: 'center',
                flexGrow: 1
            },
            card: {
                paddingHorizontal: '3rem',
                paddingBottom: '2rem'
            },
            termsContainer: {
                marginVertical: hp('2%'),
                flexDirection: 'row',
            },
            termsText: {
                fontSize: Dimensions.get('screen').width <= 320 ? 12 : 14,
                fontWeight: '500',
                textAlign: 'center',
                color: '#666'
            },
            touchableText: {
                fontSize: Dimensions.get('screen').width <= 320 ? 12 : 14,
                fontWeight: '700',
                color: Colors.primary,
            },
        
            createAccountContainer: {
                alignItems: 'center',
                marginBottom: 20
            },
            '@media (min-width: 500)': {
                $scale: 1.5,
                $width: 320,
                card: {
                    width: '$width',
                    paddingHorizontal: '2.5rem',
                    paddingBottom: '1.5rem'
                },
            },
            '@media (min-width: 320) and (max-width: 500)': {
                $width: '85%',
                card: {
                    width: '$width',
                },
                forgotPasswordText: {
                    fontSize: '1.6rem'
                },
                containerSignIn: {
                },
                signInButton: {
                    width: '$width'
                },
                createAccountButton: {
                    width: '$width'
                }
            }
        });
    }

    render() {

        const styles = this.getStyles();

        return (
            <DoubleBackground>
                <BackHeader style={{position: 'absolute'}} {...this.props} />
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.logoContainer}>
                        <Logo/>
                    </View>
                    <View style={styles.cardContainer}>
                        <Card style={styles.card}>
                            <CreateAccountForm/>
                        </Card>
                    </View>
                    <View style={styles.termsContainer}>
                        <TextMontserrat style={styles.termsText}>ePaisa's </TextMontserrat>
                        <TouchableText style={styles.touchableText}>Seller Agreement</TouchableText>
                        <TextMontserrat> and </TextMontserrat>                        
                        <TouchableText style={styles.touchableText}>e-Sign Consent</TouchableText>
                    </View>
                    <View style={styles.createAccountContainer}>
                        <View style={styles.createAccountButton}>
                            <ButtonGradient title={'CREATE NEW ACCOUNT'}/>
                        </View>
                    </View>
                </ScrollView>
            </DoubleBackground>
        )
    }
}

export default CreateAccount;