//import liraries
import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground} from 'react-native';

// create a component
class RightSideBar extends Component {
    render() {
        return (
            <View style={styles.drawerRightContainer}>
                <ImageBackground
                source={ require('../../../../assets/images/side/side_nav_portrait_faded.png') }
                style={styles.backgroundImage}
                resizeMode= {'stretch'}
                />
                
            </View>       
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    drawerRightContainer: {
        flexDirection:'column',
        height:Dimensions.get('window').height-25,
        justifyContent:'center',
        backgroundColor:'#5D6770',
    },
    backgroundImage: {
        position: 'absolute',
        width:'100%',
        height:'100%',
    },
});

//make this component available to the app
export default RightSideBar;
