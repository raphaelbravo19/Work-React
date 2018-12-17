import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Header from '../cash_register/components/Header/header'
// import TotalAmount from './components/TotalAmount/totalAmount'
// import ItemsContainer from './components/ItemsContainer/itemsContainer'
// import Calculator from './components/Calculator/Calculator'
// import Footer from './components/Footer/footer';
import colors from '../cash_register/styles/colors'
import { connect } from 'react-redux';
import { cashActions } from '../cash_register/actions';

const mapStateToProps = (state) =>({
  amount: state.amount,
  total_amount: state.total_amount
})
class CashDetails extends Component{
  static navigationOptions = {
    header: null
}
  render() {
    const{amount, total_amount} = this.props
    return (
      <View style={styles.container}>
        <Header label="TRANSACTIONS"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.darkWhite,
  },
});

export default connect(mapStateToProps)(CashDetails)