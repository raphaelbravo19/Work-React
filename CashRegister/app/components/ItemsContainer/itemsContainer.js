import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Item from './Item/item'
import colors from '../../styles/colors';
import { Categories } from '../../constants/categories';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class ItemsContainer extends Component{
  render() {
    return (
      <View style={styles.container}>
        <Item item={Categories.cash}/>
        <Item item={Categories.card}/>
        <Item item={Categories.wallet}/>
        <Item item={Categories.cashPOS}/>
        <Item item={Categories.more}/>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    backgroundColor: colors.darkWhite,
    paddingHorizontal: 5,
    paddingVertical: 6,
  },
  title:{
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 2
  }
});
