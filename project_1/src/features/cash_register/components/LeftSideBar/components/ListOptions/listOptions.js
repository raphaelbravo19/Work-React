import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Dimensions, Modal,TouchableOpacity} from 'react-native';
//import colors from '../../styles/colors'
import EStyleSheet from 'react-native-extended-stylesheet';
import Option from './Option/option';
const listOptions = [
    {label:"Cash Register",icon:""},
    {label:"Customers",icon:""},
    {label:"Notifications",icon:""},
    {label:"Transactions",icon:""},
    {label:"Settings",icon:require('../../../../assets/img/Settings.png')},
    {label:"My Account",icon:""},
    {label:"Help",icon:""},
]
export default class ListOptions extends Component{

    render() {
        const {sideOption,handleOption}=this.props
        
        return (
            <View style={styles.container}>
            {
                listOptions.map((item, i)=>{
                    return(<Option key={i} index={i} label={item.label} handleOption={handleOption} active={i==sideOption} icon={item.icon}/>)
                })
            }
                
            </View>
        );
    }
}

const styles = EStyleSheet.create({
    container:{
        flex:1,
        justifyContent:'space-between',
    }
});
