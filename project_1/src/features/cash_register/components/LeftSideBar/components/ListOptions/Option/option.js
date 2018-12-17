import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Dimensions, Modal,TouchableOpacity} from 'react-native';
//import colors from '../../styles/colors'
import EStyleSheet from 'react-native-extended-stylesheet';
import colors from '../../../../../styles/colors';
export default class Option extends Component{
    
    render() {
        //const {active,toggle}=this.props
        const {label, icon, active, index, handleOption} = this.props
        const Icon = icon!= "" ? icon : require('../../../../../assets/img/iconOption.png')
        const activeStyle=active?{tintColor:colors.white}:null
        const activeStyleText=active?{color:colors.white}:{color:colors.noactiveGray}
        return (
            <TouchableOpacity style={styles.container} onPress={()=>handleOption(index)}>
                <Image source={Icon} resizeMode="contain" style={[activeStyle,styles.img]}/>      
                <Text style={[activeStyleText,styles.optionText]}>{label}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = EStyleSheet.create({
    container: {
        width: '100%',
        height: '10%',
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems:'center',
      },
      optionText:{
        fontSize: 19,
        fontWeight: '300',
        fontFamily: 'Montserrat-Bold',
      },
      img:{
        height: '100%',
        width:'12%', 
        marginRight: '6%'
      },
      '@media (min-width: 200) and (max-width: 400)': { // media queries
        optionText:{
            fontSize: 14,
        },
        img:{
            width:'11%', 
            marginRight: '4%'
        }
      }
});
