import React, { Component }from 'react';
import { PropTypes } from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { 
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import colors from '../../styles/colors';

export default class InputField extends Component{
    state={
        secureInput: this.props.inputType === 'password' ? true: false
    }
    toggleShowPassword=()=>{
        this.setState({
            secureInput: !this.state.secureInput
        })
    }
    render(){
        const {labelText, labelTextSize,labelTextColor, textColor,borderBottom, inputType, customStyle} = this.props
        const {secureInput} = this.state
        const fontSize= labelTextSize || 14
        const color= labelTextColor || colors.white
        const inputColor= textColor || colors.white
        const borderBottomColor= borderBottom || 'transparent'
        return(
            <View style={[customStyle,styles.wrapper]}>
                <Text style={[{fontSize, color},styles.label]}>{labelText}</Text>
                {
                    inputType==='password'?
                    <TouchableOpacity 
                        style={styles.showButton} 
                        onPress={this.toggleShowPassword}>
                        <Text style={styles.showButtonText}>{secureInput?"Show":"Hide"}</Text>
                    </TouchableOpacity>
                    :null
                }
                <TextInput
                    autoCorrect={false}
                    style={[{color: inputColor, borderBottomColor ,},styles.inputField]}
                    secureTextEntry={inputType==='password'&&secureInput}
                />
            </View>
        )
    }
}

InputField.propTypes ={
    labelText: PropTypes.string.isRequired,
    labelTextSize: PropTypes.number,
    labelTextColor: PropTypes.string,
    textColor: PropTypes.string,
    borderBottom: PropTypes.string,
    inputType: PropTypes.string.isRequired,
    customStyle: PropTypes.object,
};

const styles = StyleSheet.create({
    wrapper:{
        display: 'flex',
    },
    label:{
        fontWeight: '700',
        marginBottom: 20,
    },
    inputField:{
        borderBottomWidth: 1,
        paddingVertical: 5,
    },
    showButton:{
        position: 'absolute',
        right: 0
    },
    showButtonText:{
        color: colors.white,
        fontWeight: '700'
    }
})