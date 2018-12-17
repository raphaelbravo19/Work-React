/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Modal, TextInput, Image, KeyboardAvoidingView, ScrollView} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Clear from './assets/icon.png';
import Visible from './assets/visible.png';
import Invisible from './assets/invisible.png';
import Checked from './assets/checked.png';
class App extends Component {
  state = {
      activeModal: false,
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      mobileNumber: false,
      companyName: false,
      refferalCode: false,
      passV: false,
      tfirstName: '',
      tlastName: '',
      temail: '',
      tpassword: '',
      tmobileNumber: '',
      tcompanyName: '',
      trefferalCode: '',
  }
  
  handleModal1 = () =>{
    this.setState({
      activeModal: true,
      
    })
  }
  handleModal2 = () =>{
    this.setState({
      activeModal: false,
      activeModal: false,
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      mobileNumber: false,
      companyName: false,
      refferalCode: false,
      passV: false,
      tfirstName: '',
      tlastName: '',
      temail: '',
      tpassword: '',
      tmobileNumber: '',
      tcompanyName: '',
      trefferalCode: '',
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Button title="Enter" onPress={this.handleModal1}/>
        <Button title="Hola" onPress={()=>{alert(1)}}/>
        <Modal animationType="fade" transparent={true} visible={this.state.activeModal} onRequestClose={this.handleModal2}>
       
        <ScrollView style={{flex:1}}> 
          <View style={styles.modalStyle}>

              <View style={styles.formModal}>
              
                <View style={[styles.rowNames,{marginTop:0,}]}>
                <View style={{width:'38%', alignItems: 'flex-start',justifyContent:'center',borderRightColor:'lightgray',
                  borderBottomColor:this.state.firstName?'#174285':'lightgray',borderRightWidth:2, 
                  borderBottomWidth:2,marginTop:10,}
              }>
                <Text style={{width: '80%', color:'gray',
                    fontWeight: 'bold',fontSize:this.state.firstName||this.state.lastName? 16:19, }}>First Name</Text>
                  <TextInput style={{
                    color:'#174285',
                  fontSize:19, 
                  paddingTop:0,
                  width:'100%',  
                  height: this.state.firstName||this.state.lastName?'auto':0,
                  
                  fontWeight:'bold', 
                  }} 
                  value={this.state.tfirstName}
                  onChangeText={(tfirstName) => this.setState({tfirstName})}
                  onFocus={()=>{this.setState({firstName:true})}} 
                  onBlur={()=>{this.setState({firstName:false})}}
                  underlineColorAndroid="transparent" />
                </View>
                <View style={{width:'42%', alignItems: 'flex-start'}}>
                <Text style={{width: '80%', color:'gray', paddingLeft:10,
                    fontWeight: 'bold',fontSize:this.state.lastName||this.state.firstName? 16:19, marginTop:10,}}>Last Name</Text>
                  <TextInput style={{
                    color:'#174285',
                    fontSize:19,
                    paddingLeft:10,
                    paddingTop:0, width:'100%',
                    fontWeight:'bold',
                    height: this.state.lastName||this.state.firstName?'auto':0,
                    borderColor:this.state.lastName?'#47577A':'lightgray', 
                    borderBottomWidth:2}} 
                    value={this.state.tlastName}
                    onChangeText={(tlastName) => this.setState({tlastName})}
                    onFocus={()=>{this.setState({lastName:true})}} 
                    onBlur={()=>{this.setState({lastName:false})}}
                    />
                    </View>
                </View>
                <View style={{width:'100%', alignItems: 'center'}}>
                  <Text style={{width: '80%', color:'gray',
                    fontWeight: 'bold',fontSize:this.state.email? 16:19, marginTop:20}}>E-mail</Text>
                    
                  <View style={[styles.rowNames,{width: '80%',borderBottomColor:this.state.email?'#174285':'lightgray',
                    borderBottomWidth:2,justifyContent:'flex-start'}]}>
                    <TextInput style={{
                    paddingTop:0, 
                    paddingBottom:10, 
                    width:'90%',
                    height: this.state.email?'auto':0,
                    fontWeight: 'bold',
                    fontSize: 19,
                    color: '#174285'
                  }}
                    value={this.state.temail}
                    onChangeText={(temail) => this.setState({temail})}
                    onFocus={()=>{this.setState({email:true})}} 
                    onBlur={()=>{this.setState({email:false})}} 
                    underlineColorAndroid={'transparent'}/>
                    {
                      this.state.email&&this.state.temail!=''?<View onTouchEnd={()=>{this.setState({ temail: ''})}}><Image opacity={0.4} source={Clear} style={{height:20,width:20}}/></View>:null
                    }
                  </View>
                </View>
                <View style={{width:'100%', alignItems: 'center'}}>
                  <Text style={{width: '80%', color:'gray', 
                    fontWeight: 'bold',fontSize:this.state.password? 16:19, marginTop:20}}>Password</Text>
                  <View style={[styles.rowNames,{width: '80%',borderBottomColor:this.state.password?'#174285':'lightgray',
                    borderBottomWidth:2,justifyContent:'flex-start'}]}>
                    <TextInput secureTextEntry={!this.state.passV} style={{
                    paddingTop:0, 
                    paddingBottom:10, 
                    width:'85%',
                    height: this.state.password?'auto':0,
                    fontWeight:'bold',
                    fontSize: 19,
                    color: '#174285'
                  }}
                  value={this.state.tpassword}
                  onChangeText={(tpassword) => this.setState({tpassword})}
                    onFocus={()=>{this.setState({password:true})}} 
                    onBlur={()=>{this.setState({password:false})}}  />
                    <View onTouchEnd={()=>{this.setState({ password:true,passV: !this.state.passV});}}>{this.state.password?<Image opacity={0.4} source={this.state.passV?Visible:Invisible} style={{height:25,width:25,marginLeft:10, alignSelf:'flex-end'}}/>:null}</View>
                    
                  </View>
                </View>
                <View style={{width:'100%', alignItems: 'center'}}>
                  <Text style={{width: '80%', color:'gray', 
                    fontWeight: 'bold',fontSize:this.state.mobileNumber? 16:19, marginTop:20}}>Mobile Number</Text>
                  <View style={[styles.rowNames,{width: '80%',borderBottomColor:this.state.mobileNumber?'#174285':'lightgray',
                    borderBottomWidth:2,justifyContent:'flex-start'}]}>
                    <TextInput style={{
                    paddingTop:0, 
                    paddingBottom:10, 
                    width:'90%',
                    height: this.state.mobileNumber?'auto':0,
                    fontWeight: 'bold',
                    fontSize: 19,
                    color: '#174285'
                  }}
                  value={this.state.tmobileNumber}
                  onChangeText={(tmobileNumber) => this.setState({tmobileNumber})}
                    onFocus={()=>{this.setState({mobileNumber:true})} } 
                    onBlur={()=>{this.setState({mobileNumber:false})}} />
                    {
                      this.state.mobileNumber&&this.state.tmobileNumber!=''?<View onTouchEnd={()=>{this.setState({ tmobileNumber: ''})}}><Image opacity={0.4} source={Clear} style={{height:20,width:20}}/></View>:null
                    }
                  </View>
                </View>
                <View style={{width:'100%', alignItems: 'center'}}>
                  
                  <Text style={{width: '80%', color:'gray', 
                    fontWeight: 'bold',fontSize:this.state.companyName? 16:19, marginTop:20,}}>Company Name<Text style={{fontSize:this.state.companyName? 13:16,color:'gray',}}> (Optional)</Text></Text>
                  <View style={[styles.rowNames,{width: '80%',borderBottomColor:this.state.companyName?'#174285':'lightgray',
                    borderBottomWidth:2,justifyContent:'flex-start'}]}
                    >
                    <TextInput style={{
                    paddingTop:0, 
                    paddingBottom:10, 
                    width:'90%',
                    height: this.state.companyName?'auto':0,
                    fontWeight: 'bold',
                    fontSize: 19,
                    color: '#174285'
                  }}
                  value={this.state.tcompanyName}
                  onChangeText={(tcompanyName) => this.setState({tcompanyName})}
                    onFocus={()=>{this.setState({companyName:true})}} 
                    onBlur={()=>{this.setState({companyName:false})}} />
                    {
                      this.state.companyName&&this.state.tcompanyName!=''?<View onTouchEnd={()=>{this.setState({ tcompanyName: ''})}}><Image opacity={0.4} source={Clear} style={{height:20,width:20}}/></View>:null
                    }
                  </View>
                </View>
                <View style={{width:'100%', alignItems: 'center'}}>
                  <Text style={{width: '80%', color:'gray',
                    fontWeight: 'bold',fontSize:this.state.refferalCode? 16:19, marginTop:20,}}>Refferal Code<Text style={{fontSize:this.state.refferalCode? 13:16,}}> (Optional)</Text></Text>
                  <View style={[styles.rowNames,{width: '80%',borderBottomColor:this.state.refferalCode?'#174285':'lightgray',
                    borderBottomWidth:2,justifyContent:'flex-start',}]}>
                    <TextInput style={{
                    paddingTop:0, 
                    paddingBottom:10, 
                    width:'90%',
                    height: this.state.refferalCode?'auto':0,
                    fontWeight: 'bold',
                    fontSize: 19,
                    color: '#174285'
                  }}
                  value={this.state.trefferalCode}
                  onChangeText={(trefferalCode) => this.setState({trefferalCode})}
                    onFocus={()=>{this.setState({refferalCode:true})}} 
                    onBlur={()=>{this.setState({refferalCode:false})}} />
                    {
                      this.state.refferalCode&&this.state.trefferalCode!=''?<View onTouchEnd={()=>{this.setState({ trefferalCode: ''})}}><Image opacity={0.4} source={Clear} style={{height:20,width:20}}/></View>:null
                    }
                  </View>
                </View>
              </View>
          </View>
          <View style={styles.modalStyle2}>
          <View style={{flexDirection:'row'}}>
            <Image opacity={0.6} source={Checked} style={{height:20,width:20, marginTop:3}}/>
            <Text style={{fontSize:17, color:'gray', fontWeight:'bold'}}> ePaisa's <Text style={{fontSize:17, color:'#174285'}}>Seller Agreement </Text>and <Text style={{fontSize:17, color:'#174285'}}>e-Sign Consent </Text></Text>
          </View>
           
              <Text style={styles.btnCreate}>CREATE AN ACCOUNT -></Text>
          </View>
        </ScrollView>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  modalStyle:{
    justifyContent: 'flex-end',
    alignItems: 'center',
    height:520
  },
  modalStyle2:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  formModal:{
    width:'86%',
    height:400,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 15,
    paddingTop: 0,
    paddingBottom: 20,
  },
  rowNames:{
    flexDirection:'row',
    justifyContent: 'center',
    width:'100%',
  },
  inputItem:{
    paddingTop:0, 
    paddingBottom:10, 
    width:'80%',
    borderBottomColor:'lightgray', 
    borderBottomWidth:2,
    fontWeight: 'bold',
    fontSize: 19,
    marginTop: 20,
    color: '#3C4974'
  },
  btnCreate:{
    width:'86%',
    fontSize: 15,
    backgroundColor:'blue',
    color: '#ffff',
    marginTop: 20,
    textAlign: 'center',
    paddingVertical: 15,
    borderRadius:30,
    letterSpacing: 2
  }
});

export default App;