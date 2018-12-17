import React, {Component}from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../styles/colors';
import { ScrollView,StyleSheet,Text, View,TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import InputField from '../components/form/InputField';
import NextArrowButton from '../components/buttons/NextArrowButton';
import Notification from '../components/Notification'

export default class LogIn extends Component {
    handleNextButton=()=>{
        alert("Next button pressed")
    }
    render(){
        return(
            <KeyboardAvoidingView style={styles.wrapper}>
                <View style={styles.scrollViewWrapper}>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.loginHeader}>Log In</Text>
                        <InputField 
                            labelText="EMAIL ADRESS"
                            labelTextSize={14}
                            labelTextColor ={colors.white}
                            textColor={colors.white}
                            borderBottom={colors.white}
                            inputType="email"
                            customStyle={{marginBottom: 30}}
                        />
                        <InputField 
                            labelText="PASSWORD"
                            labelTextSize={14}
                            labelTextColor ={colors.white}
                            textColor={colors.white}
                            borderBottom={colors.white}
                            inputType="password"
                            customStyle={{marginBottom: 30}}
                        />
                    </ScrollView>
                    
                <View style={styles.nextButton}> 
                        <NextArrowButton
                            handleNextButton={this.handleNextButton}
                            disabled={false}
                        />  
                    </View>
                    <View>
                        <Notification
                            type="Error"
                            firstLine= "Those credentials don't look right"
                            secondLine= "Please try again"
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        )
    }
}
const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        display: 'flex',
        backgroundColor: colors.green01
    },
    scrollViewWrapper:{
        marginTop: 70,
        flex:1
        //backgroundColor: colors.green01
    },
    scrollView:{
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
        flex:1
    },
    loginHeader:{
        fontSize: 34,
        color: colors.white,
        fontWeight: '300',
        marginBottom: 40,
    },
    nextButton:{
        marginTop: 40,
        alignItems: 'flex-end',
        right:20,
        bottom: 20
    }
})
