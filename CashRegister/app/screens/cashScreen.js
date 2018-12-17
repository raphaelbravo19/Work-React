import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Header from '../components/Header/header'
import TotalAmount from '../components/TotalAmount/totalAmount'
import ItemsContainer from '../components/ItemsContainer/itemsContainer'
import Calculator from '../components/Calculator/Calculator'
import Footer from '../components/Footer/footer';
import colors from '../styles/colors'


export default class CashScreen extends Component{
  state={
    totalAmount:0,
    Amount:0,
  }
  sumAmount=(value)=>{
      this.setState({
        Amount: (this.state.Amount*10)+parseInt(value) 
      })
  }
  sumTotal=()=>{
    this.setState({
      totalAmount: (this.state.totalAmount)+(this.state.Amount),
      Amount: 0
    })
  }
  cleanTotal=()=>{
    this.setState({
      Amount: 0
    })
  }
  backAmount=()=>{
    const back = Math.floor(this.state.Amount/10)
    this.setState({
      Amount: back
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Header/>
        <TotalAmount value={this.state.totalAmount}/>
        <ItemsContainer/>
        <Calculator amount={this.state.Amount} sumAmount={this.sumAmount} sumTotal={this.sumTotal} cleanTotal={this.cleanTotal} backAmount={this.backAmount}/>
        <Footer/>
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
