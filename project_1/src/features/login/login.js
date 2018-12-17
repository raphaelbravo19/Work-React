import React, {Component} from 'react';
import {View, ScrollView, Platform, Image, PixelRatio, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {CREATE_ACCOUNT, FORGOT_PASSWORD} from 'navigation/screen_names';
import {DoubleBackground} from 'components';
import {FloatingTextInput} from 'components/inputs';
import { TextMontserrat } from 'components';
import Logo from 'components/utilities/logo';
import TouchableText from '../../components/texts/TextTouchable';
import {Colors} from 'api';
import { ButtonGradient, ButtonOutline, Card } from 'components';
import * as responsive from './api/responsiveHelper';
import EStyleSheet from 'react-native-extended-stylesheet';

class Login extends Component {

    static navigationOptions = {
        header: null
    }
    constructor() {
        super();
        this.state = {
            orientation: Dimensions.get('window').width < Dimensions.get('window').height ? 'portrait' : 'landscape'
        }
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
            this.setState({
                orientation: Dimensions.get('window').width < Dimensions.get('window').height ? 'portrait' : 'landscape'
            });
        });

    }

    wp = (dp) => {
        return (dp/100) * Dimensions.get("window").width;
    }

    hp = (dp) => {
        return (dp/100) * Dimensions.get("window").height;
    }

    navigateTo = (screen) => {
        return this.props.navigation.navigate(screen);
    }

    getHeight = () => {
        if(this.state.orientation) {
            return (Dimensions.get('window').height > 700 ? 700 : Dimensions.get('window').height) - (Platform.OS === 'ios' ? 0 : 48);
        } else {
            return (Dimensions.get('window').width > 700 ? 700 : Dimensions.get('window').width) - (Platform.OS === 'ios' ? 0 : 48);
        }
    }

    getEStyle = () => {
        return EStyleSheet.create({
            $scale: 1.5,
            container: {
                flex: 1,
            },
            scroll: {
            },
            logoContainer:{
                flexGrow:1,
                justifyContent: 'center',
                alignItems: 'center',
            },
            cardContainer: {
                alignItems: 'center',
            },
            card: {
                paddingHorizontal: '3rem',
                paddingBottom: '2rem'
            },
            forgotContainer: {
            },
            forgotPasswordText: {
                fontWeight: '700',
                color: Colors.primary,
                textAlign: 'center',
                fontSize: '2rem',
                margin: '.8rem'
            },
            containerSignIn: {
                alignItems: 'center',
            },
            containerCreateAccount: {
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexGrow:1,
            },
            createAccountButton: {
                marginBottom: '1rem'
            },
            '@media (min-width: 500)': {
                $width: 320,
                card: {
                    width: '$width',
                    paddingHorizontal: '2.5rem',
                    paddingBottom: '1.5rem'
                },
                forgotPasswordText: {
                    fontSize: 14
                },
                signInButton: {
                    width: '$width'
                },
                containerCreateAccount: {
                    justifyContent: 'flex-start'
                },
                createAccountButton: {
                    marginTop: 20,
                    width: '$width'
                }
            },
            '@media (min-width: 320) and (max-width: 500)': {
                $scale: 1,
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
    
    getStyles = () => {
        const height = this.getHeight();
    
        return {
            container: {
                justifyContent: "center",
                alignItems:"center",
                flex: 1,
                backgroundColor: 'yellow'
            },
            scroll: {
                flex: 1,
                height: height ,
                width: '100%'
            },
            logoContainer: {
                justifyContent: "center", 
                alignItems: "center", 
                marginBottom: this.hp(5), 
                flexGrow:1,
                flex: 1
            },
            cardContainer: {
                backgroundColor: 'red'
            },
            forgotContainer: {
                justifyContent: "center",
                alignItems:"center"
            },
            forgot: {
                fontWeight: '700',
                color: Colors.primary,
                marginVertical: this.hp(2)
            },
            card: {
                width: this.wp(85),
                maxWidth: 400,
                paddingHorizontal: responsive.getCardPadding(),
                paddingBottom: responsive.getCardPadding()
            },
            containerSignIn: {
                width: this.wp(85),
                maxWidth: 400,
                flexGrow:1
            },
            containerCreateAccount: { 
                justifyContent: 'flex-end', 
                alignItems: 'center',
            }
        
        }
    }
    

    render() {
        const {container, containerSignIn, logoContainer,createAccountButton, containerCreateAccount,signInButton, scroll, upperSide, card, cardContainer, forgotPasswordText, forgotContainer} = this.getEStyle();
        
        console.log(this.getEStyle())
        
        return (
            <DoubleBackground>
                <ScrollView style={scroll} contentContainerStyle={{justifyContent: 'center', flex:1}} centerContent={true}>
                        <View style={logoContainer}>
                            <Logo/>
                        </View>
                        <View style={cardContainer}>
                            <Card style={this.getEStyle().card}>
                                <FloatingTextInput
                                    label={'E-mail'}
                                    errors={['Enter a valid E-mail address']}
                                />
                                <FloatingTextInput
                                    label={'Password'}
                                    secureTextEntry={true}
                                />
                            </Card>
                        </View>
                        <View style={forgotContainer}>
                            <TouchableText
                                onPress={() => this.navigateTo(FORGOT_PASSWORD)}
                                style={forgotPasswordText}>
                                Forgot your Password?
                            </TouchableText>
                        </View>
                        <View style={containerSignIn}>
                            <View style={signInButton}>
                                <ButtonGradient title={'SIGN IN'}/>
                            </View>
                        </View>
                        <View style={containerCreateAccount}>
                            <View style={createAccountButton}>
                                <ButtonOutline title={'CREATE NEW ACCOUNT'} onPress={() => this.navigateTo(CREATE_ACCOUNT)}/>
                            </View>
                        </View>
                </ScrollView>
            </DoubleBackground>
        )
    }
}

export default Login;