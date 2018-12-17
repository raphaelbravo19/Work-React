
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { connect } from 'react-redux'
import Title from './src/components/Title/title'
import Input from './src/components/Input/input'
import List from './src/components/List/list'
import Footer from './src/components/Footer/footer'
import { actionCreators } from './src/Store/reducers'

const mapStateToProps = (state) =>({
    data: state.data
})
class App extends Component {
  
  async componentDidMount(){
    const {dispatch} = this.props
    
    dispatch(actionCreators.get())
  }
  makeCheck = (item,i) => {
    const {dispatch} = this.props

    dispatch(actionCreators.check(i))
  }
  removeItem = (item,i) => {
    const {dispatch} = this.props

    dispatch(actionCreators.remove(i))
  }
  addItem = (text) =>{
    if(text!=''){
      var newItem = {title: text, completed: false}
      const {dispatch} = this.props

      dispatch(actionCreators.add(newItem))
    }
  }
  removeAll = () =>{
    const {dispatch} = this.props

    dispatch(actionCreators.removeAll())
  }
  render() {
    const {data} = this.props
    //store.getS
    return (
      <View style={styles.container}>
        <Title>Todo List</Title>
        <Input placeholder="Insert name ..." onSubmit={this.addItem}/>
        <List data={data} makeCheck={this.makeCheck} removeItem={this.removeItem}/>
        <Footer removeAll={this.removeAll}>Remote selected items</Footer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
 
});

export default connect(mapStateToProps)(App)