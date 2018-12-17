import React, { Component } from 'react';
import {
  Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity,AsyncStorage,
  View, TextInput, AppRegistry, Alert, ImageBackground, ActivityIndicator,
  Dimensions, Button,TouchableWithoutFeedback,FlatList,Modal,Keyboard,BackHandler, TouchableHighlight
        } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Drawer from 'react-native-drawer'
import Swiper from 'react-native-swiper';
import FloatLabelTextInput from 'react-native-floating-label-text-input';
import { strings,changeLanguage } from '../services/i18n';
import { scale, moderateScale, verticalScale} from '../utils/scaling';
import { Dropdown } from 'react-native-material-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation-locker';

import DeviceInfo from 'react-native-device-info';
import MainMenuDrawer from '../navigation/mainMenuDrawer';
import PaymentIcon from '../components/paymentIconComponent';
import LinkFingerPrint from '../screens/LinkFingerPrint';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {deliveryPortraitStyles} from './src/styles/DeliveryCharge/DeliveryStylesPortrait';
import {deliveryLandscapeStyles} from './src/styles/DeliveryCharge/DeliveryStylesLandscape';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Swipeout from 'react-native-swipeout';

var tempNumber='0'; 



class ProductDetail extends React.Component{

  componentDidMount () {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidHide = () => {
    this.removeFocus()
  }

  removeFocus = () =>{
    if(this.state.detailVisible){
      this.refs['productName'].blur();
      this.refs['productQuantity'].blur();
      this.refs['productDiscount'].blur();
      this.refs['productAmount'].blur();
    }
  }

  hideDetail = () =>{
    this.setState({detailVisible:false});
  }

  constructor(props){
    super(props)
    
    this.state = {
      number:this.props.item.number,
      quantity:1,
      name:this.props.item.name, 
      amount:this.props.item.amount,
      detailVisible:false,
      productNameInput:'',
      productNameFocus:false,
      productQuantityInput:'',
      orientation: isPortrait(),
      productQuantityFocus:false,
      productDiscountFocus:false,
      productAmountInput:'',
      productAmountFocus:false,
      changeInputNameText:false,
      changeInputQuantityText:false,
      changeInputDiscountText:false,
      changeInputAmountText:false,
    

      discountSign:"%",
      productDiscountInputTemp:'',
      productDiscountInput:'',
      productDiscountValue:'',

      
    }

    this.changeDropdownDiscountArrow = this.changeDropdownDiscountArrow.bind(this);
  }

  clearInput = (inputParam)=>{
    this.refs[inputParam].clear();
  }

  calculateCurrentAmount = () =>{
    var currentAmount=0;
    for (let index = 0; index < this.state.currentSale.length; index++) {
      const element = this.state.currentSale[index];
      
    }
    return this.formatThousandsWithRounding(parseInt(currentAmount)/100,2);
  }

  formatThousandsWithRounding(n, dp){
    var w = n.toFixed(dp), k = w|0, b = n < 0 ? 1 : 0,
        u = Math.abs(w-k), d = (''+u.toFixed(dp)).substr(2, dp),
        s = ''+k, i = s.length, r = '';
    while ( (i-=3) > b ) { r = ',' + s.substr(i, 3) + r; }
    return n.toFixed(dp);
  };

  formatNumberCommasDecimal(nStr){
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  };

  saveInfo=()=>{
    var prevSubtotal = this.state.productAmountInput;

    let reg = /^[0-9]*([.][0-9]{1,2})?$/;
    let reg1 = /^[0-9]*([.][0-9]{1,2})?$/;
    let reg2 = /^[0-9]*$/;


    if(this.state.productNameInput!=""){
      this.setState({name:this.state.productNameInput})
    }
    if(this.state.productQuantityInput!=""){
        if(!reg2.test(this.state.productQuantityInput)){
            this.setState({validNumberQuantity: true})
        }else{
          this.setState({quantity:this.state.productQuantityInput})
        }
    }
    if(this.state.productAmountInput!=""){
        if (!reg1.test(this.state.productAmountInput)){
            this.setState({validNumberAmount: true})
        }else {
            this.setState({amount: this.formatThousandsWithRounding(this.state.productAmountInput * this.state.productQuantityInput,2)})
            var currentSale = this.props.parentFlatList.state.currentSale;
            currentSale[this.props.index]=this.state.productAmountInput;
            this.props.parentFlatList.setState({currentSale:currentSale})    
        }
    }
    if(this.state.productDiscountInputTemp!=""){
        if(!reg.test(this.state.productDiscountInput)){
            this.setState({validNumberDiscount: true})
        }else{
          //this.setState({discount:this.state.productDiscountInput})
            //this.setState({productDiscountInput:this.state.productDiscountInputTemp})
            this.setDiscountCalculation();
        }      
    }
    this.setState({detailVisible:false});

    var result = this.formatThousandsWithRounding((parseFloat(this.state.productAmountInput) * parseFloat(this.state.productQuantityInput))
                  - parseFloat(this.state.productDiscountValue !== '' ? this.state.productDiscountValue : 0) ,2)

    //this.props.handler(result < 0 ? Math.abs(result) : result);
    this.props.handler(parseFloat(this.state.amount) > result ? (result-parseFloat(this.state.amount)) : result-parseFloat(this.state.amount));
  }

  validateNumberDiscount = () => {
    let reg = /^[0-9]*([.][0-9]{1,2})?$/;
    if(!reg.test(this.state.productDiscountInput)){
        this.setState({validNumberDiscount: true})
        return false
    }else{
        this.setState({validNumberDiscount: false})
        return true
    }
  }

  changeDropdownDiscountArrow() {
    return (
      <IconMaterialCommunityIcons size={moderateScale(23,0.2)} name={'chevron-down'} color={this.state.orientation ? "#7f7f7f" : "#174285"}/>
    );
  }

   cvalidateNumberAmount = () => {
      if(this.state.productAmountInput != ''){
        let reg1 = /^[0-9]*([.][0-9]{1,2})?$/;
        if (!reg1.test(this.state.productAmountInput)){
            this.setState({validNumberAmount: true})
            return false
        }else{
            this.setState({validNumberAmount: false})
            return true
        }
      }      
  }

  validateNumberQuantity = () => {
    let reg2 = /^[0-9]*$/;
    if(!reg2.test(this.state.productQuantityInput)){
        this.setState({validNumberQuantity: true})
        return false
    }else{
        this.setState({validNumberQuantity: false})
        return true
    }
  } 
  
  // ###
  calculateDiscount = () => {
    if('' === this.state.productDiscountInputTemp)
      return this.formatThousandsWithRounding(0, 2)
    else{
      // rupees
      if('%' !== this.state.discountSign)
      return this.formatThousandsWithRounding(parseFloat(this.state.productDiscountInputTemp), 2)
      //percentage
      else{
        return this.formatThousandsWithRounding(parseFloat(this.state.productDiscountInputTemp) * 
                      (parseFloat(this.state.productQuantityInput) * parseFloat(this.state.productAmountInput)) / 100, 2)
      }
    }
  }

  // ###
  setDiscountCalculation = () => {
    this.setState({
        productDiscountInput : this.state.productDiscountInputTemp,
        productDiscountValue : this.calculateDiscount()
      }, () => {
        //this.setState({
          //totalSale : this.formatThousandsWithRounding(parseFloat(this.state.subtotalSale) - parseFloat(this.state.totalDiscount) 
            //                + parseFloat(this.state.tax) + parseFloat(this.state.deliveryCharge), 2)
        //})
      }
    )
  }
  
  render() {

    let dataDiscountNomination = [
      {value: "%"},
      {value: '₹'}
    ];
      
    {/* --------------------------- @@@@ PRODUCT DETAIL --------------------------- */}
    return(
    <View>
      <TouchableOpacity onPress={()=>{
        this.props.parentFlatList.removeDetails();
        this.setState({detailVisible:!this.state.detailVisible})
        }}>
        <View>
          <View  style={this.state.orientation ? styles.saleContainer : styles.saleContainerLandscape}>
              <Text style={this.state.orientation ? styles.TextGrayProductIndex : 
                                  styles.TextGrayProductIndexLandscape}>{this.state.number}.</Text>     
              <Text style={this.state.orientation ? styles.TextGrayProduct : 
                                  styles.TextGrayProductLandscape} numberOfLines={3}>{this.state.name}</Text>
              <Text style={this.state.orientation ? styles.TextGray : 
                                  styles.TextGrayLandscape}>{this.state.quantity}</Text>    
              <View style={this.state.orientation ? styles.productAmount : 
                                  styles.productAmountLandscape}>
                  <Text style={this.state.orientation ? styles.TextBlueProduct : 
                                      styles.TextBlueProductLandscape} numberOfLines={1} textAlign={'right'}>
                      <IconFontAwesome style={styles.iconBlue} size={this.state.orientation ? hp('1.95%') : hp('1.95%')} name={'rupee'}/> {this.formatNumberCommasDecimal(this.state.amount)}
                      </Text>
              </View>  
          </View>
          { this.state.productDiscountInput !== '' ?
            <View style={this.state.orientation ? styles.productDetailDiscountContainer : styles.productDetailDiscountContainerLandscape}>
              <Text style={this.state.orientation ? styles.productDetailDiscountLabel : styles.productDetailDiscountLabelLandscape }>— Discount @ {this.state.productDiscountInput}%</Text>
              <Text style={ this.state.orientation ? styles.productDetailDiscountValue : styles.productDetailDiscountValueLandscape }><IconFontAwesome style={styles.iconOrangeDiscountProduct} size={this.state.orientation ? hp('1.5%') : hp('1.4%')} name={'rupee'}/> {this.formatNumberCommasDecimal(this.state.productDiscountValue)}</Text>
            </View> : null
          }
        </View>
      </TouchableOpacity>
      {/*--ScrollSecond*/}
      {this.state.detailVisible && 
    <View>
      <ScrollView
      scrollEnabled={true}
      keyboardShouldPersistTaps={'handled'}
      style={[this.state.orientation ? styles.productDetailContainer : styles.productDetailContainerLandscape]}>
      <View>
        <View style={{paddingHorizontal:15,  }}>
          <View style={[styles.inputContainer, {borderBottomColor: this.state.productNameFocus?'#0a46a8':'#EBEBEB'}]}>
              <View  style={styles.inputUser}  height={45}>
                <FloatLabelTextInput
                  autoCapitalize={'none'}
                  placeholder={strings('cash.productDetail.label1')}
                  fontSize={this.state.orientation ? moderateScale(16,0.3) : moderateScale(12,0.3)}
                  labelSize={this.state.orientation ? moderateScale(13,0.3) : moderateScale(11,0.2)}
                  ref={'productName'}
                  colortext={(this.state.changeInputNameText) ? '#0a46a8' : '#515050'}
                  labelTop={this.state.orientation ? moderateScale(5,0.3) : moderateScale(5,0.2)}
                  style={styles.inputPlaceholder}
                  selectionColor={'#0a46a8'}
                  noBorder={true}
                  value={this.state.productNameInput}
                  onChangeTextValue ={(text) => this.setState({productNameInput: text})}
                  returnKeyType={'next'}
                  blurOnSubmit={true}
                  onFocus={()=>{
                    this.setState({ productNameFocus: !this.state.productNameFocus });
                    this.setState({ changeInputNameText: true });
                  }}
                  onBlur={()=>{
                    this.setState({ productNameFocus: !this.state.productNameFocus });
                    this.setState({ changeInputNameText: false });
                  }}
                  onSubmitEditing={()=>this.refs['productQuantity'].focus()}
                />
                { this.state.productNameInput!='' &&
                <TouchableOpacity onPressIn={()=>{this.clearInput('productName'); this.setState({ productNameInput: '' });}}>
                  <View marginRight={5}>
                    <IconMaterialIcons style={this.state.orientation ? {marginTop:moderateScale(20)} : {marginTop:moderateScale(20,0.1)}} name="cancel" size={this.state.orientation ? moderateScale(20) : moderateScale(10,0.4)} />
                  </View>
                </TouchableOpacity>
                }                
            </View>
          </View>
        </View>
        <View style={{    paddingHorizontal:15,  }}>
          <View style={[styles.inputContainer, {borderBottomColor: this.state.productQuantityFocus?'#0a46a8':'#EBEBEB'}]}>
              <View  style={styles.inputUser} height={45}>
                <FloatLabelTextInput
                  autoCapitalize={'none'}
                  placeholder={strings('cash.productDetail.label2')}
                  fontSize={this.state.orientation ? moderateScale(16,0.3) : moderateScale(12,0.3)}
                  labelSize={this.state.orientation ? moderateScale(13,0.3) : moderateScale(11,0.2)}
                  ref={'productQuantity'}
                  colortext={this.state.changeInputQuantityText ? '#0a46a8' : '#515050'}
                  labelTop={this.state.orientation ? moderateScale(5,0.3) : moderateScale(5,0.2)}
                  style={styles.inputPlaceholder}
                  selectionColor={'#0a46a8'}
                  noBorder={true}
                  value={this.state.productQuantityInput}                  
                  onChangeTextValue ={(text)=> this.setState({productQuantityInput: text})}
                  returnKeyType={'next'}
                  keyboardType={'numeric'}
                  maxLength={3}
                  blurOnSubmit={true}
                  onFocus={()=>{
                    this.setState({ productQuantityFocus: !this.state.productQuantityFocus });
                    this.setState({ changeInputQuantityText: true });
                  }}
                  onBlur={()=>{
                    this.setState({ productQuantityFocus: !this.state.productQuantityFocus });
                    this.setState({ changeInputQuantityText: false });
                    this.validateNumberQuantity();
                  }}
                  onSubmitEditing={()=>this.refs['productAmount'].focus()}
                />
                { this.state.productQuantityInput!='' &&
                <TouchableOpacity onPressIn={()=>{this.clearInput('productQuantity'); this.setState({ productQuantityInput: '' });}}>
                  <View marginRight={5} >
                    <IconMaterialIcons style={this.state.orientation ? {marginTop:moderateScale(20)} : {marginTop:moderateScale(20,0.1)}} name="cancel" size={this.state.orientation ? moderateScale(20) : moderateScale(10,0.4)} />
                  </View>
                </TouchableOpacity>
                }
            </View>
          </View>
          {
            this.state.validNumberQuantity && <View style={{flexDirection:'row',alignContent:'center'}} ><Text style={styles.warningText}>Only numbers</Text></View>
          }
        </View>
        <View style={{    paddingHorizontal:15,  }}>
          <View style={[styles.inputContainer, {borderBottomColor: this.state.productAmountFocus?'#0a46a8':'#EBEBEB'}]}>
              <View  style={styles.inputUser} height={45}>
                <FloatLabelTextInput
                  autoCapitalize={'none'}
                  placeholder={strings('cash.productDetail.label4')}
                  fontSize={this.state.orientation ? moderateScale(16,0.3) : moderateScale(12,0.3)}
                  labelSize={this.state.orientation ? moderateScale(13,0.3) : moderateScale(11,0.2)}
                  labelTop={this.state.orientation ? moderateScale(5,0.3) : moderateScale(5,0.2)}
                  ref={'productAmount'}
                  colortext={this.state.changeInputAmountText ? '#0a46a8' : '#515050'}
                  style={styles.inputPlaceholder}
                  selectionColor={'#0a46a8'}
                  value={this.state.productAmountInput}
                  onChangeTextValue ={(text) => this.setState({productAmountInput: text})}
                  returnKeyType={'done'}
                  blurOnSubmit={true}
                  noBorder={true}
                  keyboardType={'numeric'}
                  onFocus={()=>{
                    this.setState({ productAmountFocus: !this.state.productAmountFocus });
                    this.setState({ changeInputAmountText: true });                    
                  }}
                  onBlur={()=>{
                    this.setState({ productAmountFocus: !this.state.productAmountFocus });
                    this.setState({ changeInputAmountText: false });
                    this.validateNumberAmount();
                  }}
                  onSubmitEditing={()=>this.refs['productDiscount'].focus()}
                />
                { this.state.productAmountInput!='' &&
                <TouchableOpacity onPressIn={()=>{this.clearInput('productAmount'); this.setState({ productAmountInput: '' });}}>
                  <View marginRight={5}>
                    <IconMaterialIcons style={this.state.orientation ? {marginTop:moderateScale(20)} : {marginTop:moderateScale(20,0.1)}} name="cancel" size={this.state.orientation ? moderateScale(20) : moderateScale(10,0.4)} />
                  </View>
                </TouchableOpacity>
                }
            </View>
          </View>
          {
            this.state.validNumberAmount && <View style={{flexDirection:'row',alignContent:'center'}} ><Text style={styles.warningText}>Only numbers and dot</Text></View>
          }
        </View>
        <View style={{    paddingHorizontal:15,  }}>
          <View style={[styles.inputContainer, {borderBottomColor: this.state.productDiscountFocus?'#0a46a8':'#EBEBEB'}]}>
              <View  style={styles.inputUser} height={45}>
               
                
              
                <FloatLabelTextInput
                  autoCapitalize={'none'}
                  placeholder={strings('cash.productDetail.label3')}
                  fontSize={this.state.orientation ? moderateScale(16,0.3) : moderateScale(12,0.3)}
                  labelSize={this.state.orientation ? moderateScale(13,0.3) : moderateScale(11,0.2)}
                  labelTop={this.state.orientation ? moderateScale(5,0.3) : moderateScale(5,0.2)}
                  ref={'productDiscount'}
                  colortext={this.state.changeInputDiscountText ? '#0a46a8' : '#515050'}
                  style={[styles.inputPlaceholder,{width:'20%'}]}
                  selectionColor={'#0a46a8'}
                  noBorder={true}
                  value={this.state.productDiscountInputTemp}
                  onChangeTextValue ={(text) => this.setState({productDiscountInputTemp: text})}
                  returnKeyType={'next'}
                  blurOnSubmit={true}
                  keyboardType={'numeric'}
                  onFocus={()=>{
                    this.setState({ productDiscountFocus: !this.state.productDiscountFocus });
                    this.setState({ changeInputDiscountText: true });
                  }}
                  onBlur={()=>{
                    this.setState({ productDiscountFocus: !this.state.productDiscountFocus });
                    this.setState({ changeInputDiscountText: false });
                    this.validateNumberDiscount();
                  }}
                  onSubmitEditing={Keyboard.dismiss} />
                  
                { this.state.productDiscountInput!='' &&
                <TouchableOpacity onPressIn={()=>{this.clearInput('productDiscount'); this.setState({ productDiscountInputTemp: '', productDiscountInput: '', productDiscountValue: ''});}}>
                  <View marginRight={5}>
                    <IconMaterialIcons style={this.state.orientation ? {marginTop:moderateScale(20)} : {marginTop:moderateScale(20,0.1)}} name="cancel" size={this.state.orientation ? moderateScale(20) : moderateScale(10,0.4)} />
                  </View>
                </TouchableOpacity>
                }
            </View>            
          </View>
          {
            this.state.validNumberDiscount && <View style={{flexDirection:'row',alignContent:'center'}} ><Text style={styles.warningText}>Only numbers and dot</Text></View>
          }
        </View>
        <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center',marginVertical:10}}>
          <TouchableOpacity onPressIn={()=>{this.setState({detailVisible:false})}}>
            <View style={this.state.orientation ? styles.buttonCancel : styles.buttonCancelLandscape}>
              <Text style={this.state.orientation ? styles.buttonText : styles.buttonTextLandscape}>{strings('cash.productDetail.button1')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPressIn={()=>{this.saveInfo();}}>
            <View style={this.state.orientation ? styles.buttonSave : styles.buttonSaveLandscape}>
              <Text style={this.state.orientation ? styles.buttonTextWhite : styles.buttonTextWhiteLandscape}>{strings('cash.productDetail.button2')}</Text>
            </View>
          </TouchableOpacity>     
       
        </View>
        </View>
      </ScrollView>
      </View>
     
       }
       
    </View>
    
    
    )
  }
}


const isPortrait = () => {
    const dim = Dimensions.get('window');
    if(dim.height >= dim.width){
      return true;
    }else {
      return false;
    }
};

export default class CashScreen extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props){
    super(props)
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
    this._flatItem = [];
    this.state = {
      amount:'0.00',
      currentSale:[],
      orientation: isPortrait(),
      isPhone: !DeviceInfo.isTablet(),
      subtotalSale:'00.00',
      totalSale:'00.00',
      tax:'0.00',
      tooltip:false,
      mainTooltip:false,
      modalDiscount:false,
      modalDelivery:false,
      discountFocus:false,
      discountNomination: '%',
      username:this.getUserInfo(),

      // ###
      discountSign:'%',
      discount:'',
      totalDiscount:'0.00',

      // DELIVERY
      deliveryTemp:'',
      deliveryCharge:'0.00',

      // ### ERROR MESSAGE
      opacityError: 0,
      colorError: '#174285',
      errorMessage:'',

      // ### SUCCESS MESAGE MODAL
      messageSuccessModal: false,

      // ### USER DATA CART MODULE
      userName: '',

      // FOR DELETING CHARGES ON CART
      deleteDelivery:false,
      deleteDiscount:false,


      keyboardActive:false,

    };
    this._dimensionListener = Dimensions.addEventListener('change', () => {

        this.setState({ orientation: !this.state.orientation });
        this.closeControlPanelRight();
    });
    this.changeDropdownDiscountArrow = this.changeDropdownDiscountArrow.bind(this);

    this.handler = this.handler.bind(this)
  }

  handler(newValue) {
    //alert('in handler: '+newValue);
    this.setState({
      subtotalSale: this.formatThousandsWithRounding(parseFloat(this.state.subtotalSale) + parseFloat(newValue), 2)},()=>{
      this.setState({tax:this.formatThousandsWithRounding((parseFloat(this.state.subtotalSale) * 0.09,2))},
        () => { 
          this.setState({
            totalDiscount: this.calculateDiscount()},
            () => { this.setState({
              //totalSale:this.formatThousandsWithRounding((((parseFloat(this.state.subtotalSale)*100)+parseFloat(tempNumber))*1.09-parseFloat(this.state.totalDiscount))/100,2)})})})
              totalSale:this.formatThousandsWithRounding(parseFloat(this.state.subtotalSale) + parseFloat(this.state.tax) + parseFloat(this.state.deliveryCharge) - parseFloat(this.state.totalDiscount),2)})})})})
  }

  clearModalDiscountInput = () => {
    this.setState({
      discount: ''
    })
  }

  clearModalDeliveryInput = () => {
    this.setState({
      deliveryCharge: '',
      deliveryTemp: ''
    })
  }
  
  changeDiscountNominationValue = (value) => {
    this.setState({
      discountNomination: value
    })
  }

  // ###
  calculateDiscount = () => {
    if('' === this.state.discount)
      return this.formatThousandsWithRounding(0, 2)
    else{
      // rupees
      if('%' !== this.state.discountSign)
      return this.formatThousandsWithRounding(parseFloat(this.state.discount), 2)
      //percentage
      else{
        return this.formatThousandsWithRounding(parseFloat(this.state.discount) * this.state.subtotalSale / 100, 2)
      }
    }
  }

  // ###
  setDiscountCalculation = () => {
    this.setState({
        totalDiscount : this.calculateDiscount()
      }, () => {
        this.setState({
          totalSale : this.formatThousandsWithRounding(parseFloat(this.state.subtotalSale) - parseFloat(this.state.totalDiscount) 
                            + parseFloat(this.state.tax) + parseFloat(this.state.deliveryCharge), 2)
        })
      }
    )
  }

  padAdd = (number)=>{
    if(tempNumber>0){
      this.setState({
        subtotalSale:this.formatThousandsWithRounding(parseFloat(this.state.subtotalSale)+parseFloat(tempNumber)/100,2),
        tax:this.formatThousandsWithRounding(((parseFloat(this.state.tax) * 100)+parseFloat(tempNumber)*0.09)/100,2)},
        () => { 
          this.setState({
            totalDiscount: this.calculateDiscount()},
            () => { this.setState({
              //totalSale:this.formatThousandsWithRounding((((parseFloat(this.state.subtotalSale)*100)+parseFloat(tempNumber))*1.09-parseFloat(this.state.totalDiscount))/100,2)})})})
              totalSale:this.formatThousandsWithRounding(parseFloat(this.state.subtotalSale) + parseFloat(this.state.tax) + parseFloat(this.state.deliveryCharge) - parseFloat(this.state.totalDiscount),2)})})})
      

      var temp = this.state.currentSale;
      temp.push(this.state.amount);
      this.setState({currentSale:temp})
      tempNumber='0';
      this.setState({amount:'0.00'})
    }
  }


  showErrorMessageDiscount = (message) => {
    this.setState({
      opacityError: 1,
      colorError: '#D0021B',
      errorMessage: message
    })
  }

 
  hideErrorMessageDiscount = () => {
    this.setState({
      opacityError: 0,
      colorError: '#174285'
    })
  }


  discountAmountVerification = () => {
    //\d+(\.\d{1,2})?
    var integerRegex = /^\d{1,6}$/;
    var decimalRegex = /^\d+\.\d{0,2}$/; 

    var invalidInput = 'Enter a valid discount';
    var invalidPercentage = 'Enter a valid discount from 0.1% - 99.9%';
    var invalidAmount = 'Enter a valid discount from 0.1 - ';

    if('' !== this.state.discount){
      if(decimalRegex.test(this.state.discount) || integerRegex.test(this.state.discount)){
        switch(this.state.discountSign) {
          case '%':
            if(this.state.discount < 0.1 || this.state.discount > 99.9){ 
              this.showErrorMessageDiscount(invalidPercentage);
              this.setState({ discount : '' });
              this.discountInput.focus();
            } else {
              this.setDiscountCalculation(); 
              this.hideErrorMessageDiscount();
              //this.setState({messageSuccessModal : !this.state.messageSuccessModal});
              this.closeModal();
            }
            break;
          default:
            if(this.state.discount < 0.1 || this.state.discount > (this.state.subtotalSale-1)){
              this.showErrorMessageDiscount(invalidAmount+(this.state.subtotalSale - 1));
              this.setState({ discount : '' });
              this.discountInput.focus();
            } else {
              this.setDiscountCalculation(); 
              this.hideErrorMessageDiscount();
              //this.setState({messageSuccessModal : !this.state.messageSuccessModal});
              this.closeModal();
            }
            break;
        }
      } else {
        this.showErrorMessageDiscount(invalidInput);
        this.setState({ discount : '' });
        this.discountInput.focus();
      }
    } else {
      this.showErrorMessageDiscount(invalidInput);
      this.setState({ discount : '' });
      this.discountInput.focus();
    }
  }


  // ###
  showErrorMessageDelivery = (message) => {
    this.setState({
      opacityError: 1,
      colorError: '#D0021B',
      errorMessage: message
    })
  }

  // ###
  hideErrorMessageDelivery = () => {
    this.setState({
      opacityError: 0,
      colorError: '#174285'
    })
  }

  // ###
  deliveryChargeVerification = () => {
    //\d+(\.\d{1,2})?
    var integerRegex = /^\d{1,6}$/;
    var decimalRegex = /^\d+\.\d{0,2}$/; 

    var invalidInput = 'Enter a valid charge amount';

    if('' !== this.state.deliveryTemp){
      if(decimalRegex.test(this.state.deliveryTemp) || integerRegex.test(this.state.deliveryTemp)){
        if(this.state.deliveryTemp < 0.1){ 
          this.showErrorMessageDelivery(invalidInput);
          this.setState({ deliveryTemp : '' });
          this.deliveryInput.focus();
        } else {
          this.hideErrorMessageDelivery();
          this.setState({deliveryCharge : this.formatThousandsWithRounding(parseFloat(this.state.deliveryTemp),2)}, ()=>{
            this.setState({ totalSale : this.formatThousandsWithRounding(parseFloat(this.state.subtotalSale) - parseFloat(this.state.totalDiscount) + parseFloat(this.state.tax) + parseFloat(this.state.deliveryCharge), 2)})
          });
          this.closeModal();
        }
      } else {
        this.showErrorMessageDelivery(invalidInput);
        this.setState({ deliveryTemp : '' });
        this.deliveryInput.focus();
      }
    } else {
      this.showErrorMessageDelivery(invalidInput);
      this.setState({ deliveryTemp : '' });
      this.deliveryInput.focus();
    }
  }
      

  changeDropdownDiscountArrow() {
    return (
      <IconMaterialCommunityIcons size={moderateScale(23,0.2)} name={'chevron-down'} color={this.state.orientation ? "#7f7f7f" : "#174285"}/>
    );
  }


  _onOrientationDidChange = (orientation) => {

    /*if(this.state.isPhone){
      if (orientation == 'LANDSCAPE-LEFT' || orientation == 'LANDSCAPE-RIGHT') {
        alert('Please, rotate your device.')
      }
    } else {
      if (orientation == 'PORTRAIT' || orientation == 'PORTRAIT-UPSIDEDOWN') {
        alert('Please, rotate your device.')
      }
    }*/

  }

  async getUserData() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:userName');
      this.setState({userName: value});
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }

  changeKeyboardActive = () => {
    this.setState({
      keyboardActive : true
    })
  }

  changeKeyboardInactive = () => {
    this.setState({
      keyboardActive : false
    })
  }

  componentWillMount() {

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.changeKeyboardActive);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.changeKeyboardInactive);

    // Retreives the user data stored on AsyncStorage
    this.getUserData();

    /*var value =  AsyncStorage.getItem('userName');
    value.then((e)=>{
      this.setState({
       name: e.name
      })
    })*/

    //The getOrientation method is async. It happens sometimes that
    //you need the orientation at the moment the js starts running on device.
    //getInitialOrientation returns directly because its a constant set at the
    //beginning of the js code.
    var initial = Orientation.getInitialOrientation();
    if (initial === 'PORTRAIT') {
      //do stuff
    } else {
      //do other stuff
    }
  }
  
  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );


    this.state.isPhone ? Orientation.lockToPortrait() : Orientation.lockToLandscape(); 
    //Orientation.lockToPortrait() this will lock the view to Portrait
    //Orientation.lockToLandscapeLeft(); //this will lock the view to Landscape
    //Orientation.unlockAllOrientations(); //this will unlock the view to all Orientations

    //get current orientation
    /*
    Orientation.getOrientation((orientation,deviceOrientation)=> {
      console.log("Current UI Orientation: ", orientation);
      console.log("Current Device Orientation: ", deviceOrientation);
    });
    */

    //Orientation.addOrientationListener(this._onOrientationDidChange);
  }

  onBackButtonPressAndroid = () => {
    Alert.alert(
      'Quit App?',
      'Are you sure you want to exit this App?',
      [
        {text: 'Yes', onPress: () => BackHandler.exitApp()},
        {text: 'No', onPress: () => {}},
      ],
    );
    return true;
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();

    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    //Orientation.removeOrientationListener(this._onOrientationDidChange);
  }

  removeDetails=()=>{
    this._flatItem.forEach(element => {
      element.hideDetail();
    });
  }
  
  closeControlPanelLeft = () => {
    this._drawerLeft.close()
  };

  openControlPanelLeft = () => {
    this._drawerLeft.open()
  };
  closeControlPanelRight = () => {
    this._drawerRight.close()
  };
  openControlPanelRight = () => {
    this._drawerRight.open()
  };
 
  navigateTo = (route)=>{
    const { navigate } = this.props.navigation;
    navigate(route);
  }

  padClick = (number)=>{
    if(tempNumber<10000000){
      tempNumber+=number;
      this.setState({amount:this.formatThousandsWithRounding(parseInt(tempNumber)/100,2)})    
    }
  }

  padClear = (number)=>{
    if(tempNumber>0){
      tempNumber=tempNumber.slice(0,-1);
      this.setState({amount:this.formatThousandsWithRounding(parseInt(tempNumber)/100,2)})
    }
  }

  async saveAmount() {
    try {
      await AsyncStorage.setItem('@MySuperStore:amount', this.state.totalSale);
    } catch (error) {
      Alert.alert(error)
      // Error saving data
    }
  }

  calculateCurrentAmount = () =>{
    var currentAmount=0;
    for (let index = 0; index < this.state.currentSale.length; index++) {
      const element = this.state.currentSale[index];
      
    }
    return this.formatThousandsWithRounding(parseInt(currentAmount)/100,2);
  }

  formatThousandsWithRounding(n, dp){
    var w = n.toFixed(dp), k = w|0, b = n < 0 ? 1 : 0,
        u = Math.abs(w-k), d = (''+u.toFixed(dp)).substr(2, dp),
        s = ''+k, i = s.length, r = '';
    while ( (i-=3) > b ) { r = ',' + s.substr(i, 3) + r; }
    return n.toFixed(dp);
    //return Number(n.toFixed(dp)).toLocaleString('en', { minimumFractionDigits: 2 });
  };

  formatNumberCommasDecimal(nStr){
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  };
  
  getUserInfo(){
    const { navigation } = this.props;
    return navigation.getParam('username', 'Missing Info').toString();
  }

  swipe = (dir)=>{
    this.refs.swiper.scrollBy(dir);
  }

  getCurrentIndex = ()=>{
    return this.refs.swiper.state.index
  }

  getCurrentItems=()=>{
    let data = [];
    
    this.state.currentSale.forEach(function(element, index){
      let objectSection = {};
      objectSection = { number:(index+1), name: 'Custom Product '+(index+1), amount: element.toString() };
      data.push(objectSection);
    });

    return data;
  }

  closeModal = ()=>{
    this.setState({ modalDiscount: false, modalDelivery: false });
  }

  closeSuccessMessage = () => {
    this.setState({
      messageSuccessModal: false
    });
  }

  render() {
  
  const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3, elevation: 20},
  }

  let dataDiscountNomination = [
    {value: "%"},
    {value: '₹'}
  ];

  //  swipe
  onSwipeLeft = (gestureState) => {
    this.setState({myText: 'You swiped left!'});
  }


  deliveryOnChangedText = (text) => { 
    var newText = ''; 
    var numbers = '0123456789.'; 

    if(text.length < 1) { 
      this.setState({ deliveryTemp: '' }); 
    } 
    
    for (var i=0; i < text.length; i++) { 
      if(numbers.indexOf(text[i]) > -1 ) { 
        newText = newText + text[i]; 
      } 
      
      this.setState({ deliveryTemp: newText }); 
    } 
  }

  // DELETE DISCOUNT AND DELIVERY BUTTON
  const swipeBtns = [
    {
      component: (
        /*<View 
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent:'center',
              flexDirection: 'column',
            }}
        >
          <Image source={require('../assets/icons/delete_red.png')} style={{ resizeMode:'contain', width: this.state.orientation ? hp('2.2%') : hp('2.4%')}} />
        </View>*/
        <Text style={this.state.orientation ? {fontFamily:'Montserrat-SemiBold', fontSize:hp('1.85%'), color:'white', width:wp('16%'), height:'100%', textAlign:'center', textAlignVertical:'center'} :
                    {fontFamily:'Montserrat-SemiBold', fontSize:hp('2.1%'), color:'white', width:wp('7%'), height:'100%', textAlign:'center', textAlignVertical:'center'}}>Delete</Text>
      ),
      backgroundColor: 'red',
      onPress: () => {
        if(this.state.deleteDelivery) {
          this.setState({ deliveryCharge: '0.00', deliveryTemp:'' }, () => {
            this.setState({ totalSale : this.formatThousandsWithRounding(parseFloat(this.state.subtotalSale) - parseFloat(this.state.totalDiscount) + parseFloat(this.state.tax) + parseFloat(this.state.deliveryCharge), 2)})
          })
        } 

        if(this.state.deleteDiscount) {
          this.setState({ totalDiscount: '0.00', discount:'' }, () => {
            this.setState({ totalSale : this.formatThousandsWithRounding(parseFloat(this.state.subtotalSale) - parseFloat(this.state.totalDiscount) + parseFloat(this.state.tax) + parseFloat(this.state.deliveryCharge), 2)})
          })
        } 
      },
    },
  ];
  
    return (

    <Drawer
    ref={(ref) => this._drawerLeft = ref}
    type={"overlay"}
    tapToClose={true}
    openDrawerOffset={this.state.orientation ? moderateScale(0.27) : moderateScale(0.6,0.05)}
    tweenHandler={ratio => ({
        main: {
        opacity: 1,
        },
        mainOverlay: {
        opacity: ratio / 1.5,
        backgroundColor: 'black',
        },
        })}
    content={
        <MainMenuDrawer
          navigation={this.props.navigation}
        />
    } 
    
    styles={drawerStyles}
    >

    {/* -------------------------- ##### SHOP CART PORTRAIT -------------------------- */}
    <Drawer
      ref={(ref) => this._drawerRight = ref}
      type={"overlay"}
      tapToClose={true}
      openDrawerOffset={0.1}
      tweenHandler={
          ratio => ({
          main: {
          opacity: 1,
          },
          mainOverlay: {
          opacity: ratio / 1.5,
          backgroundColor: 'black',
          },
        })
      }
      side={'right'}  
      onClose={()=>{
        this._flatItem.forEach(element => {
          element.removeFocus();
        });
      }}
      content={
        
        <View style={styles.drawerRightContainer}>
        <ImageBackground
          source={ require('../assets/images/side_nav_portrait_faded.png') }
          style={styles.backgroundImage}
          resizeMode= {'stretch'}
        />
            <View style={{width:'100%', height:hp('13.6%'), flexDirection:'row', borderBottomWidth:hp('0.15%'), elevation:hp('1.4%')}}>
                <View style={styles.drawerRightMainTitleContainer}>

                  <View style={{/*backgroundColor:'red', */height:'100%', paddingLeft:wp('2.65%'), paddingTop:hp('2.6%')}}>
                      {/* SHADOW FOR USER NAME BOX */}
                      <View style={{height:hp('7%'), width:wp('40%'), backgroundColor:'#000000', flexDirection: 'column', position:'absolute', top:hp('3%'), left:wp('3.3%'), borderRadius:hp('1.4%'), opacity:0.15}} />

                      <View style={{height:hp('7%'), width:wp('40%'), backgroundColor:'#5D6770',  flexDirection: 'column', borderWidth:hp('0.14%'), borderRadius:hp('1.4%')}}>
                          <Text numberOfLines={1} style={{height:'50%', width:'100%', paddingTop:hp('0.40%'), paddingLeft:wp('2%'), paddingRight:wp('2%'), fontFamily:'Montserrat-Bold', fontSize:hp('2.2%'), color:'white'}}>{this.state.userName}</Text>
                          <Text numberOfLines={1} style={{height:'50%', width:'100%', paddingTop:hp('0.2%'), paddingLeft:wp('2%'), fontSize:hp('1.85%'), fontFamily:'Montserrat-Bold', color:'white'}}>174 265 44</Text>
                      </View>                 
                  </View>

                </View>


                <View style={styles.saleContainerMain}>

                    {/*<View style={{backgroundColor:'#e7af73', flexDirection:'row', width:'50%', height:'100%', paddingTop:hp('0.35%'), paddingLeft:wp('5%')}}>                 
                      <Text style={{fontSize:hp('1.95%'), fontFamily:'Montserrat-Bold', color:'white'}}>Txn ID : </Text>
                      <Text style={{fontSize:hp('1.95%'), fontFamily:'Montserrat-Bold', color:'white'}}>14758932</Text>
                      </View>*/}

                    <View style={{width:'100%', height:hp('5.8%'), alignItems:'flex-end', justifyContent:'flex-end', paddingRight:wp('4%')}}>
                      <Text style={{fontSize:hp('2.7%'), fontFamily:'Montserrat-Bold', color:'white'}}>400 Points</Text>
                    </View>

                    <View style={[styles.drawerRightTitleContainer/*,{backgroundColor:'red', }*/]}>
                        <TouchableOpacity onPress={()=>{this.setState({ modalDelivery: true });}}>
                          <Image source={require('../assets/icons/Delivery2.png')} style={[styles.drawerRightIcon,{marginRight:wp('2.1%')}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.setState({ modalDiscount: true });}}> 
                          <Image source={require('../assets/icons/Discount2.png')} style={[styles.drawerRightIcon,{marginRight:wp('2.1%')}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.closeControlPanelRight()}}>
                          <Image source={require('../assets/icons/Close2.png')} style={[styles.drawerRightIcon,{marginRight:wp('3.2%')}]}/>
                        </TouchableOpacity>
                    </View>

                </View>     
            </View> 
          
            <View style={styles.saleDetailsContainer}>

              <View style={{flexDirection:'row', height:hp('3.95%'), paddingLeft:wp('2.1%'), paddingRight:wp('4%'), alignItems:'center', borderBottomWidth:hp('0.15%'), borderColor:'#D0D0D0'}}>
                  <Text style={{fontFamily:'Montserrat-Bold', fontSize:hp('1.8%'), color:'#555555', width:wp('10%')}}>S No.</Text>
                  <Text style={{fontFamily:'Montserrat-Bold', fontSize:hp('1.8%'), color:'#555555', width:wp('41%'), paddingLeft:wp('1.75%')}}>Description</Text>
                  <Text style={{fontFamily:'Montserrat-Bold', fontSize:hp('1.8%'), color:'#555555', width:wp('9%'), textAlign:'center'}}>Qty</Text>
                  <Text style={{fontFamily:'Montserrat-Bold', fontSize:hp('1.8%'), color:'#555555', width:wp('23.5%'), textAlign:'right'}}>Price</Text>
              </View>
              
              <FlatList
                  style={{flexGrow: 0}}
                  keyboardShouldPersistTaps={'handled'}
                  keyExtractor={(item, index) => item + index}
                  data={this.getCurrentItems()}
                  scrollEnabled={true} 
                  renderItem={({item,index}) =>      
                    <ProductDetail
                      handler = {this.handler.bind(this)}
                      parentFlatList={this}
                      index={index}
                      ref={(ref) => this._flatItem[index] = ref}
                      item={item} />
                    }
              />
              
              {
                this.state.currentSale.length > 0 ? 
                <TouchableOpacity  style={styles.saleContainerAdd} onPressIn={()=>{this.closeControlPanelRight()}}>
                    <View>
                      <Text style={styles.addMore}>{strings('cash.drawerRight.addMore')}</Text>
                    </View>
                </TouchableOpacity> : null
              }
            </View> 

            <View style={styles.TotalContainer}>
                <View  style={[styles.subTotalContainer,{paddingTop:hp('0.7%')}]}>
                    <Text style={styles.textDark1}>{strings('cash.drawerRight.subTotal')}</Text>       
                    <View style={styles.salePriceContainer}>
                        <IconFontAwesome style={styles.iconBlue1} size={hp('2.05%')} name={'rupee'}/>
                        <Text style={styles.TextBlue1}>{this.formatNumberCommasDecimal(this.state.subtotalSale)}</Text>
                    </View> 
                </View>

                { // CHECKS WHETHER TRANSACTION VALUE IS 0, IF SO, DON'T PRINT DISCOUNT AND CGST 
                parseFloat(this.state.subtotalSale) === 0 ? null :
                <View style={{width:'100%'}}>
                    {
                      parseFloat(this.state.totalDiscount) > 0 ?
                        <Swipeout 
                          right={swipeBtns}
                          autoClose={true}
                          backgroundColor={'transparent'}
                          buttonWidth={wp('16%')}
                          onOpen={()=>{this.setState({deleteDelivery:false, deleteDiscount: true})}}
                          onClose={()=>{this.setState({deleteDiscount: false})}}
                        >
                          <View  style={styles.subTotalContainer}>
                              <Text style={styles.subTextOrange}>{strings('cash.drawerRight.discount')}</Text>       
                              <View style={styles.salePriceContainer}>
                                  <IconFontAwesome style={styles.iconOrange} size={hp('1.8%')} name={'rupee'}/>
                                  <Text style={styles.textOrange}>{this.formatNumberCommasDecimal(this.state.totalDiscount)}</Text>
                              </View> 
                          </View>
                        </Swipeout> : null
                    }
                    {
                      parseFloat(this.state.deliveryCharge) > 0 ? 
                        <Swipeout 
                          right={swipeBtns}
                          autoClose={true}
                          backgroundColor={'transparent'}
                          buttonWidth={wp('16%')}
                          onOpen={()=>{this.setState({deleteDiscount:false, deleteDelivery: true})}}
                          onClose={()=>{this.setState({deleteDelivery: false})}}
                        >
                          <View  style={styles.subTotalContainer}>
                              <Text style={styles.subTextGray}>{strings('cash.drawerRight.delivery')}</Text>       
                              <View style={styles.salePriceContainer}>
                                  <IconFontAwesome style={styles.iconBlue} size={hp('1.8%')} name={'rupee'}/>
                                  <Text style={styles.subTextBlue}>{this.formatNumberCommasDecimal(this.state.deliveryCharge)}</Text>
                              </View>
                          </View> 
                        </Swipeout> : null
                    }
                    <View  style={[styles.subTotalContainer, {paddingTop:hp('0%')}]}>
                        <Text style={styles.subTextGray}>{strings('cash.drawerRight.tax')}</Text>       
                        <View style={styles.salePriceContainer}>
                            <IconFontAwesome style={styles.iconBlue} size={hp('1.8%')} name={'rupee'}/>
                            <Text style={styles.subTextBlue}>{this.formatNumberCommasDecimal(this.state.tax)}</Text>
                        </View> 
                    </View>
                </View>
                }

                <View  style={styles.subTotalContainer}>
                    <Text style={styles.textDark2}>{strings('cash.drawerRight.totalAmount')}</Text>       
                    <View style={styles.salePriceContainer}>
                      <IconFontAwesome style={styles.iconBlue2} size={hp('2.15%')} name={'rupee'}/>
                      <Text style={styles.TextBlue2}>{this.formatNumberCommasDecimal(this.state.totalSale)}</Text>
                    </View> 
                </View>

                {/* ****** HOLD AND PAY BUTTONS ****** */}
                <View style={{flexDirection:'row', height:hp('6.75'), width:'100%', justifyContent:'space-between', paddingLeft:wp('2.3%'), paddingRight:wp('2.3%')}}>
                    <TouchableOpacity
                      onPress={()=>{alert('Not implemented for this version.')}} >
                        <View style={styles.holdButtonCartPortrait}>
                            <Text style={{fontFamily:'Montserrat-Bold', fontSize:hp('2.6%'), color:'#47525D', }}>HOLD</Text>
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={()=>{alert('Not implemented for this version.')}} >
                        <View style={{backgroundColor:'#09BA83', width:wp('60%'), height:hp('6.1%'), borderRadius:hp('0.9%'), justifyContent:'center', alignItems:'center', elevation:moderateScale(1.5)}}>
                            <Text style={{fontFamily:'Montserrat-Bold', fontSize:hp('2.6%'), color:'white', }}>PAY ₹ {this.formatNumberCommasDecimal(this.state.totalSale)}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
          </View>    
      }
      styles={drawerStyles}
      >
    {/*------------------------------ Modal Discount -----------------------------*/}
    <Modal
      onRequestClose={ ()=>{} }
      animationType={'fade'}
      transparent={true}
      visible={this.state.modalDiscount}
      presentationStyle="overFullScreen">

      <TouchableOpacity style={styles.modalDiscountContainer} activeOpacity={1}>

        {/* { DeviceInfo.isTablet() ? <Text>Tablet</Text> : <Text>Phone</Text> } */}
        <View style={ this.state.isPhone ? styles.modalBox : this.state.orientation ? styles.modalBoxPortraitTablet : styles.modalBoxLandscape}>

          <View style={this.state.orientation ? styles.modalDiscountBoxTop : styles.modalDiscountBoxTopLandscape}>
            <Text style={this.state.orientation ? styles.modalDiscountDescriptionPortrait : styles.modalDiscountDescriptionLandscape}>{strings('cash.modalDiscount.discount')}</Text>
            <TouchableOpacity onPressIn={ ()=>this.closeModal() } style={{position:'absolute',right:0,top:0}}>
              <View >
                <Image source={require('../assets/icons/close.png')} style={ this.state.isPhone ? styles.imageDiscountModalClosePortrait : this.state.orientation ? styles.imageDiscountModalClosePortraitTablet : styles.imageDiscountModalCloseLandscape } />
              </View>
            </TouchableOpacity>
          </View>

          <View style={ this.state.orientation ? styles.modalDiscountBoxBottom : styles.modalDiscountBoxBottomLandscape}>
          
            <View ref={(ref) => { this.bottomSeparator = ref; }} style={ this.state.isPhone ? [styles.textInputModal, {borderBottomColor:this.state.colorError}] : this.state.orientation ? [styles.textInputModalPortraitTablet, {borderBottomColor:this.state.colorError}] : [styles.textInputModalLandscape, {borderBottomColor:this.state.colorError}]}>
              
              <View style={this.state.orientation ? {height:hp('7%')} : {height:hp('7.8%')}}>

                <View style={{ flexDirection: 'row', alignItems: 'flex-end'}}>
                  <Text style={ this.state.orientation ? {fontFamily:'Montserrat-SemiBold', fontSize: hp('1.85%')} : {fontFamily:'Montserrat-Medium', fontSize: hp('1.87%')} }>Discount</Text>
                  <Image ref={(ref) => { this.signDiscountExclamation = ref; }} source={require('../assets/icons/error.png')} style={ this.state.isPhone ? [styles.imageDiscountModalErrorPortrait, {marginLeft:wp('1.4%'), opacity: this.state.opacityError}] : this.state.orientation ? [styles.imageDiscountModalErrorPortraitTablet, {marginLeft:wp('1.4%'),opacity: this.state.opacityError}] : [styles.imageDiscountModalErrorLandscape, {marginLeft:wp('0.7%'), opacity: this.state.opacityError}] } />
                </View>
                
                <View style={ this.state.isPhone ? {paddingLeft: wp('4.5%')} : this.state.orientation ? {paddingLeft: wp('1.9%')} : {paddingLeft: wp('1.8%')} }>

                  {/* on dropdown, ask whether keyboard is hidden or inactive before opening picker, it could fix mispositioning issue */}
                  <Dropdown
                  //keyActive?
                      disabled={this.state.keyboardActive}
                      textColor={this.state.colorError}
                      style={this.state.orientation ? {fontFamily:'Montserrat-Medium', fontWeight:'600'} : {fontFamily:'Montserrat-Medium', fontWeight:'400'}}
                      selectedItemColor='#222222'
                      textAlign='center'
                      value = {this.state.discountSign}
                      dropdownPosition={ this.state.orientation ? -3.11 : -3.32 }
                      dropdownMargins={{min: 0, max: 0} }
                      dropdownOffset={ this.state.orientation ? {top:hp('0.70%'),left:wp('-5%')} : {top:hp('0.7%'),left:wp('-1.9%')} }
                      renderAccessory={this.changeDropdownDiscountArrow}
                      inputContainerStyle={{ borderBottomColor: 'transparent' }}
                      itemPadding={hp('0.38%')}
                      itemCount={2}
                      fontSize={ this.state.orientation ? hp('2.32%') : hp('2.4%') }
                      data={dataDiscountNomination}
                      //itemTextStyle={{backgroundColor:'#F2D6BC', textAlign: 'center', fontSize: hp('2.32%')}}
                      itemTextStyle={{textAlign: 'center', fontWeight: '500',fontSize: hp('2.32%')}}
                      containerStyle={this.state.orientation ? {width: wp('11%')} : {width: wp('5.2%')}}
                      //pickerStyle={{backgroundColor:'green', width:wp('18%'), height:hp('11.2%'), paddingTop: 0}}
                      pickerStyle={ this.state.orientation ? {width:wp('18%'), height:hp('11.14%'), elevation: 5, paddingTop: 0} : {width:wp('8%'), height:hp('11.12%'), elevation: 5, paddingTop: 0}}
                      onChangeText={(value)=>{this.setState({discountSign: value})}} />  

                </View>
              </View>

              {/*  SEPARATOR BETWEEN BOTH INPUTS  */}
              { this.state.orientation ? 
                <View 
                    ref={(ref) => { this.inputsSeparator = ref; }}
                    height={hp('4%')}
                    width={wp('0.25%')}
                    marginLeft={wp('-0.5%')}
                    paddingTop={hp('0.5%')}
                    backgroundColor={this.state.colorError} /> :
                
                  <View 
                    ref={(ref) => { this.inputsSeparator = ref; }}
                    height={hp('4.8%')}
                    width={wp('0.15%')}
                    marginLeft={wp('-0.6%')}
                    paddingTop={hp('0.5%')}
                    backgroundColor={this.state.colorError} /> 
              }


              <View width={this.state.orientation ? wp('40%') : wp('16%')}>
                <TextInput 
                  ref={(ref) => { this.discountInput = ref; }}
                  value={this.state.discount}
                  keyboardType={'numeric'}
                  returnKeyType={'done'}
                  underlineColorAndroid='transparent'
                  height={hp('6%')}
                  style={ this.state.orientation ? [styles.discountModalDiscountInputPortrait, {color:this.state.colorError}] : [styles.discountModalDiscountInputLandscape, {color:this.state.colorError}] }
                  onChangeText={ (text) => {this.setState({discount:text}); if(this.state.opacityError === 1){ this.hideErrorMessageDiscount() } }} />
              </View>

              {/* CLEAR TEXT BUTTON */}
              {
                this.state.discount.length > 0 ? 
                <TouchableOpacity 
                onPress={
                  () => {this.clearModalDiscountInput(); this.discountInput.focus()}
                }
                style={{position: "absolute", bottom: 0, right: 0, paddingBottom: hp('0.8%')}}>                  
                    <IconMaterialCommunityIcons name="close-circle" size={this.state.orientation ? hp('2.9%') : hp('3.5%')} color={'#6B6B6B'} />
                </TouchableOpacity> : null
              }

              </View>

              <Text ref={(ref) => { this.textErrorMessage = ref; }} style={this.state.isPhone ? [styles.errorMessagePortrait, {opacity: this.state.opacityError}] : this.state.orientation ? [styles.errorMessagePortraitTablet, {opacity: this.state.opacityError}] : [styles.errorMessageLandscape, {opacity: this.state.opacityError}]}>{this.state.errorMessage}</Text>
              
              {/*  SEPARATOR BETWEEN INPUTS AND BUTTON ADD  */}
              <View style={this.state.orientation ? {height: hp('2.35%')} : {height: hp('2.4%')}}/>

              {/* ADD BUTTON */}
              <TouchableHighlight
                  onPress={() => {
                    this.discountAmountVerification();  
                  }}
                  style={ this.state.isPhone ? styles.touchableModalDiscountAdd : this.state.orientation ? styles.touchableModalDiscountAddPortraitTablet : styles.touchableModalDiscountAddLandscape }>

                <LinearGradient 
                    colors={['#174285', '#0079AA']} 
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={ { borderRadius: 50 } }>        
                    <View style= {{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}} >
                      <Text style= { this.state.orientation ? styles.textDiscountAddButtonPortrait : styles.textDiscountAddButtonLandscape }>ADD</Text>                
                    </View>
                </LinearGradient>
              </TouchableHighlight>
              
            </View>

        </View>

      </TouchableOpacity>

    </Modal>



    {/*------------------------------ Modal Delivery -----------------------------*/}
    <Modal
      onRequestClose={ ()=>{} }
      animationType={'fade'}
      transparent={true}
      visible={this.state.modalDelivery}
      presentationStyle="overFullScreen">

      <TouchableOpacity style={deliveryPortraitStyles.modalDeliveryContainer} activeOpacity={1}>

        {/* { DeviceInfo.isTablet() ? <Text>Tablet</Text> : <Text>Phone</Text> } */}
        <View style={this.state.orientation ? deliveryPortraitStyles.modalBox : deliveryLandscapeStyles.modalBoxLandscape}>

          <View style={this.state.orientation ? deliveryPortraitStyles.modalDiscountBoxTop : deliveryLandscapeStyles.modalDiscountBoxTopLandscape}>
            <Text style={this.state.orientation ? deliveryPortraitStyles.modalDiscountDescriptionPortrait : deliveryLandscapeStyles.modalDiscountDescriptionLandscape}>{strings('cash.modalDelivery.title')}</Text>
            <TouchableOpacity onPressIn={ ()=>this.closeModal() } style={{position:'absolute',right:0,top:0}}>
              <View >
                <Image source={require('../assets/icons/close.png')} style={ this.state.orientation ? deliveryPortraitStyles.imageDiscountModalClosePortrait : deliveryLandscapeStyles.imageDiscountModalCloseLandscape } />
              </View>
            </TouchableOpacity>
          </View>

          <View style={ this.state.orientation ? deliveryPortraitStyles.modalDiscountBoxBottom : deliveryLandscapeStyles.modalDiscountBoxBottomLandscape}>
          
            <View 
              ref={(ref) => { this.bottomSeparator = ref; }} 
              style={ this.state.orientation ? [deliveryPortraitStyles.textInputModal, {borderBottomColor:this.state.colorError}] : 
                    [deliveryLandscapeStyles.textInputModalLandscape, {borderBottomColor:this.state.colorError}]}>

              <View width={this.state.orientation ? '80%' : '80%'} height={hp('5.8%')} style={{flexDirection:'row',}}>
                  <TextInput 
                    ref={(ref) => { this.deliveryInput = ref; }}
                    //value={this.state.deliveryTemp}
                    value={'₹'}
                    editable={false}
                    keyboardType={'numeric'}
                    returnKeyType={'done'}
                    underlineColorAndroid='transparent'
                    height={hp('5.8%')}
                    width={this.state.orientation ? '12%' : '10%'}
                    style={ this.state.orientation ? 
                              [deliveryPortraitStyles.discountModalDiscountInputSignPortrait, {color:this.state.colorError}] : 
                              [deliveryLandscapeStyles.discountModalDiscountInputSignLandscape, {color:this.state.colorError}] } />
                  <TextInput 
                    ref={(ref) => { this.deliveryInput = ref; }}
                    value={this.state.deliveryTemp}
                    keyboardType={'numeric'}
                    returnKeyType={'done'}
                    underlineColorAndroid='transparent'
                    height={hp('5.8%')}
                    width={this.state.orientation ? '94%' : '80%'}
                    style={ this.state.orientation ? 
                              [deliveryPortraitStyles.discountModalDiscountInputPortrait, {color:this.state.colorError}] : 
                              [deliveryLandscapeStyles.discountModalDiscountInputLandscape, {color:this.state.colorError}] }
                    onChangeText={ (text) => {deliveryOnChangedText(text); if(this.state.opacityError === 1){ this.hideErrorMessageDelivery() } }} />
              </View>

              {/* CLEAR TEXT BUTTON */}
              {
                this.state.deliveryTemp.length > 0 ? 
                <TouchableOpacity 
                onPress={() => {this.clearModalDeliveryInput(); this.deliveryInput.focus()}}
                style={this.state.orientation ? deliveryPortraitStyles.clearButton : deliveryLandscapeStyles.clearButton}>                  
                    <IconMaterialCommunityIcons name="close-circle" size={this.state.orientation ? hp('3.3%') : hp('3.8%')} color={'#6B6B6B'} />
                </TouchableOpacity> : null
              }

              </View>

              {/* SEPARATOR LINE */}
              <View style={{width:'100%', height:hp('0.4%'), backgroundColor:this.state.colorError}} />         
              
              {/*  SEPARATOR BETWEEN INPUTS AND BUTTON ADD  */}
              <View style={this.state.orientation ? {height: hp('5%'), width:'100%', flexDirection:'row'} : {height: hp('6.1%'), width:'100%', flexDirection:'row'}}>             
                  <Image 
                      ref={(ref) => { this.signDiscountExclamation = ref; }} 
                      source={require('../assets/icons/error.png')} 
                      style={ this.state.orientation ? 
                            [deliveryPortraitStyles.imageDiscountModalErrorPortrait, {marginLeft:wp('1.4%'), opacity: this.state.opacityError}] : 
                            [deliveryLandscapeStyles.imageDiscountModalErrorLandscape, {marginLeft:wp('0.7%'), opacity: this.state.opacityError}] } /> 
                  <Text 
                      ref={(ref) => { this.textErrorMessage = ref; }} 
                      style={this.state.orientation ? 
                            [deliveryPortraitStyles.errorMessagePortrait, {opacity: this.state.opacityError}] : 
                            [deliveryLandscapeStyles.errorMessageLandscape, {opacity: this.state.opacityError}]}
                    >
                      {this.state.errorMessage}
                  </Text>
              </View>

              {/* ADD BUTTON */}
              <TouchableHighlight
                  onPress={() => {
                    this.deliveryChargeVerification();  
                    //this.setState({opacityError: 1})
                  }}
                  style={ this.state.orientation ? 
                      deliveryPortraitStyles.touchableModalDiscountAdd : 
                      deliveryLandscapeStyles.touchableModalDiscountAddLandscape }
                >
                <LinearGradient 
                    colors={['#174285', '#0079AA']} 
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={ { borderRadius: 50 } }>        
                    <View style= {{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}} >
                      <Text style= { this.state.orientation ? deliveryPortraitStyles.textDiscountAddButtonPortrait : deliveryLandscapeStyles.textDiscountAddButtonLandscape }>ADD</Text>                
                    </View>
                </LinearGradient>
              </TouchableHighlight>
              
            </View>

        </View>

      </TouchableOpacity>

    </Modal>




    {/* ---------VVVVVV--------- SUCCESSFUL MESSAGE MODAL ---------VVVVVV--------- */}

    <Modal
      onRequestClose={ ()=>{} }
      animationType={'fade'}
      transparent={true}
      visible={this.state.messageSuccessModal}
      presentationStyle="overFullScreen" >

      <TouchableOpacity style={styles.successMessageContainer} activeOpacity={1}>
      
        <View  style={ this.state.orientation ? styles.successMessageBox : styles.successMessageBoxLandscape}>
          <View style={{width:'100%', height:'50%', alignItems:'center', justifyContent:'flex-end', paddingBottom:hp('2.4%')}}>
            <Text style={{fontFamily:'Montserrat-SemiBold', fontSize:hp('2.5%'), color:'#47525D'}}>{strings('successAppliedMessage.discount')}</Text>
          </View>

          <View style={{width:'100%', height:'50%', alignItems:'center', justifyContent:'flex-end', paddingBottom:hp('3%')}}>
            {/* OK BUTTON */}
            <TouchableHighlight
                    onPress={() => {
                      this.closeSuccessMessage();
                      this.closeModal();
                    }}
                    style={ this.state.isPhone ? styles.touchableModalDiscountAdd : this.state.orientation ? styles.touchableModalDiscountAddPortraitTablet : styles.touchableModalDiscountAddLandscape }>

                  <LinearGradient 
                      colors={['#174285', '#0079AA']} 
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 1 }}
                      style={ { borderRadius: 50 } }>        
                      <View style= {{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}} >
                        <Text style= { this.state.orientation ? styles.textDiscountAddButtonPortrait : styles.textDiscountAddButtonLandscape }>OK</Text>                
                      </View>
                  </LinearGradient>
              </TouchableHighlight>
          </View>
        </View>

      </TouchableOpacity>

    </Modal>

    {/* ---------^^^^^^--------- SUCCESSFUL MESSAGE MODAL ---------^^^^^^--------- */}



    {/*----------------------------- -Main -View -----------------------------*/}
        
    <ScrollView keyboardShouldPersistTaps={'always'} >
    <View style={this.state.orientation ? styles.mainContainer : styles.mainContainerLandscape}>
    <TouchableWithoutFeedback onPressIn={()=>{this.setState({mainTooltip:false})}}>
      <View style={this.state.orientation ? styles.container : styles.containerLandscape}>
        {this.state.mainTooltip && 
        <View style={this.state.orientation ? styles.buttonsDots : styles.buttonsDotsLandscape}>
          <TouchableOpacity style={{paddingLeft:15,paddingVertical:5}}
            onPressIn={()=>{this.setState({ modalDiscount: true });}}
          >
            <View>
              <Text style={{color:'black',fontSize:moderateScale(15)}}>{strings('cash.mainView.tooltip1')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{paddingLeft:15,paddingVertical:5}}
            onPressIn={()=>{this.setState({ modalDelivery: true });}}
          >
            <View>
              <Text style={{color:'black',fontSize:moderateScale(15)}}>{strings('cash.mainView.tooltip2')}</Text>
            </View>
          </TouchableOpacity>
        </View>}

        <View style={this.state.orientation ? styles.container1 : styles.containerLandscape1}>

        <View style={this.state.orientation ? styles.header : styles.headerLandscape}>


          <TouchableOpacity style={this.state.orientation ? styles.headerTextContainer : styles.headerTextContainerLandscape} onPressIn={()=>{ this.openControlPanelLeft(); this.setState({mainTooltip:false})}}>
            {/*<IconFontAwesome style={styles.icon} size={hp('3%')} name={'bars'}/>*/}
            <Image source={require('../assets/icons/sidelist_icon.png')} style={{height:hp('3%') ,width:hp('3%'),marginTop:this.state.orientation ? 0 : hp('1%')}}/>
          </TouchableOpacity>




          <Text style={this.state.orientation ? styles.headerText : styles.headerTextLandscape}>{strings('cash.mainView.headerTitle')}</Text>


          {this.state.orientation && <TouchableOpacity onPressIn={()=>{this.swipe(1); this.setState({mainTooltip:false})}}>
          <View style={{flexDirection:'row',justifyContent:'center',marginLeft: wp('5.28%')}}>
              <Image source={require('../assets/icons/Cart_white.png')} style={styles.savedIcon}/>
              <View style={styles.savedAmount}>
                <Text style={styles.savedText}>6</Text>
              </View>
            </View>
          </TouchableOpacity>}



          {this.state.orientation && <TouchableOpacity  style={{padding:15}} onPressIn={()=>{this.openControlPanelRight(); this.setState({mainTooltip:false})}}>
            <View>
              <IconMaterialCommunityIcons style={styles.iconCart} size={hp('4%')} name={'cart'}/>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{this.state.currentSale.length}</Text>
              </View>
            </View>
          </TouchableOpacity>}




          {this.state.orientation && <View containerViewStyle={this.state.orientation ? {borderWidth:0} : {alignItems:'flex-end',width:'100%',borderWidth:2}} >
          <TouchableOpacity onPressIn={()=>{this.setState({mainTooltip:!this.state.mainTooltip})}}>
            <IconMaterialCommunityIcons style={this.state.orientation ? styles.iconDots : styles.iconDotsLandscape} size={hp('4%')} name={'dots-vertical'}/>
          </TouchableOpacity>
          </View>}

        </View>
        




        <Swiper 
        ref='swiper'
        showsButtons={false}
        showsPagination={false}
        scrollEnabled={false}
        >
        <View style={{flex:1}}>




        { this.state.orientation && <View style={styles.totalAmountTopView}>
          {/*<View style={{justifyContent:'center',alignItems:'center',marginLeft:this.orientation ? wp('5.56%') : wp('2.64%')}}>
            <IconMaterialCommunityIcons style={styles.iconCart} size={hp('3%')} name={'cart'}/>
            <View style={this.orientation ? styles.badgeContainerTotalAmount : styles.badgeContainerTotalAmountLandscape}>
              <Text style={[styles.badgeText,{fontSize:hp('1%')}]}>{this.state.currentSale.length}</Text>
            </View>
        </View>*/}
          <Text style={styles.totalAmountTopText}>TOTAL AMOUNT</Text>
          <Text style={this.state.orientation ? styles.totalAmountValueTopText : styles.totalAmountValueTopTextLandscape}>₹ 1570.00</Text>
        </View>}

          <View style={this.state.orientation ? styles.currencyContainer : styles.currencyContainerLandscape}>
            <TouchableOpacity  onPressIn={()=>{this.setState({mainTooltip:false})}}>
              <PaymentIcon type={'Cash'}/>
            </TouchableOpacity>
            <TouchableOpacity  onPressIn={()=>{this.navigateTo('CardPayment');this.setState({mainTooltip:false}); this.saveAmount();}}>
              <PaymentIcon type={'Card'}/>
            </TouchableOpacity>
            <TouchableOpacity onPressIn={()=>{this.setState({mainTooltip:false})}}>
              <PaymentIcon type={'Wallet'}/>
            </TouchableOpacity>
            {this.state.orientation && <TouchableOpacity onPressIn={()=>{this.setState({mainTooltip:false})}}>
              <PaymentIcon type={'Pos'}/>
            </TouchableOpacity>}
            {this.state.orientation && <TouchableOpacity onPressIn={()=>{this.setState({mainTooltip:false})}}>
              <PaymentIcon type={'More'}/>
            </TouchableOpacity>}
            {!this.state.orientation && <TouchableOpacity onPressIn={()=>{this.setState({mainTooltip:false})}}>
              <PaymentIcon type={'Upi'}/>
            </TouchableOpacity>}
            {!this.state.orientation && <TouchableOpacity onPressIn={()=>{this.setState({mainTooltip:false})}}>
              <PaymentIcon type={'Cheque'}/>
            </TouchableOpacity>}
            {!this.state.orientation && <TouchableOpacity onPressIn={()=>{this.setState({mainTooltip:false})}}>
              <PaymentIcon type={'Emi'}/>
            </TouchableOpacity>}
            {!this.state.orientation && <TouchableOpacity onPressIn={()=>{this.setState({mainTooltip:false})}}>
              <PaymentIcon type={'Split'}/>
            </TouchableOpacity>}
          </View>
          <ImageBackground source={require('../assets/icons/amount_container.png')} style={this.state.orientation ? styles.amountContainer : styles.amountContainerLandscape} resizeMode={'stretch'}>
            <Text style={this.state.orientation ? styles.amountText1 : styles.amountText1Landscape}>{strings('cash.mainView.amount')}</Text>
            <Text style={this.state.orientation ? styles.amountText2 : styles.amountText2Landscape}><IconFontAwesome style={styles.iconGray} size={hp('3%')} name={'rupee'}/>{"  " + this.state.amount}</Text>
          </ImageBackground>


          <View style={{paddingLeft:moderateScale(3)}}>
          <View style={this.state.orientation ? styles.numberPadContainerTop : styles.numberPadContainerTopLandscape}>

            <View style={this.state.orientation ? styles.numberPadContainerColumn : styles.numberPadContainerColumnLandscape}>
              <ImageBackground source={require('../assets/icons/number_container.png')} resizeMode={'stretch'} style={this.state.orientation ? styles.numberContainerSingle : styles.numberContainerSingleLandscape}>
                <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' style={this.state.orientation ? styles.numpadHighlight : styles.numpadHighlightLandscape} onPressIn={()=>{this.padClick(1);this.setState({mainTooltip:false})}}>
                    <Text style={this.state.orientation ? styles.numberPadText : styles.numberPadTextLandscape}>1</Text>
                </TouchableHighlight>
              </ImageBackground>
              <ImageBackground source={require('../assets/icons/number_container.png')} resizeMode={'stretch'} style={this.state.orientation ? styles.numberContainerSingle : styles.numberContainerSingleLandscape}>
                <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' style={this.state.orientation ? styles.numpadHighlight : styles.numpadHighlightLandscape} onPressIn={()=>{this.padClick(4);this.setState({mainTooltip:false})}}>
                  <Text style={this.state.orientation ? styles.numberPadText : styles.numberPadTextLandscape}>4</Text>
                </TouchableHighlight>
              </ImageBackground>
            </View>


            <View style={this.state.orientation ? styles.numberPadContainerColumn : styles.numberPadContainerColumnLandscape}>
              <ImageBackground source={require('../assets/icons/number_container.png')} resizeMode={'stretch'} style={this.state.orientation ? styles.numberContainerSingle : styles.numberContainerSingleLandscape}>
                <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' style={this.state.orientation ? styles.numpadHighlight : styles.numpadHighlightLandscape} onPressIn={()=>{this.padClick(2);this.setState({mainTooltip:false})}}>
                  <Text style={this.state.orientation ? styles.numberPadText : styles.numberPadTextLandscape}>2</Text>
                </TouchableHighlight>
              </ImageBackground>
              <ImageBackground source={require('../assets/icons/number_container.png')} resizeMode={'stretch'} style={this.state.orientation ? styles.numberContainerSingle : styles.numberContainerSingleLandscape}>
                <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' style={this.state.orientation ? styles.numpadHighlight : styles.numpadHighlightLandscape} onPressIn={()=>{this.padClick(5);this.setState({mainTooltip:false})}}>
                  <Text style={this.state.orientation ? styles.numberPadText : styles.numberPadTextLandscape}>5</Text>
                </TouchableHighlight>
              </ImageBackground>
            </View>


            <View style={this.state.orientation ? styles.numberPadContainerColumn : styles.numberPadContainerColumnLandscape}>
              <ImageBackground source={require('../assets/icons/number_container.png')} resizeMode={'stretch'} style={this.state.orientation ? styles.numberContainerSingle : styles.numberContainerSingleLandscape}>
                <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' style={this.state.orientation ? styles.numpadHighlight : styles.numpadHighlightLandscape} onPressIn={()=>{this.padClick(3);this.setState({mainTooltip:false})}}>
                  <Text style={this.state.orientation ? styles.numberPadText : styles.numberPadTextLandscape}>3</Text>
                </TouchableHighlight>
              </ImageBackground>
              <ImageBackground source={require('../assets/icons/number_container.png')} resizeMode={'stretch'} style={this.state.orientation ? styles.numberContainerSingle : styles.numberContainerSingleLandscape}>
                <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' style={this.state.orientation ? styles.numpadHighlight : styles.numpadHighlightLandscape} onPressIn={()=>{this.padClick(6);this.setState({mainTooltip:false})}}>
                  <Text style={this.state.orientation ? styles.numberPadText : styles.numberPadTextLandscape}>6</Text>
                </TouchableHighlight>
              </ImageBackground>
            </View>


            <View style={this.state.orientation ? styles.numberPadContainerColumn : styles.numberPadContainerColumnLandscape}>
              <ImageBackground source={require('../assets/icons/number_container_vertical.png')} resizeMode={'stretch'} style={this.state.orientation ? styles.numberContainerArrow : styles.numberContainerArrowLandscape}>
                <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' style={this.state.orientation ? styles.numpadHighlightArrow : styles.numpadHighlightArrowLandscape} onPressIn={()=>{this.padClear();this.setState({mainTooltip:false})}} onLongPress={()=>{this.setState({amount:'0.00'});tempNumber='0';}}>
                  <IconMaterialCommunityIcons style={styles.iconDelete} size={moderateScale(40,0.2)} name={'arrow-left'}/>
                </TouchableHighlight>
              </ImageBackground>
            </View>

          </View> 
          </View> 
















        <View style={{paddingLeft:moderateScale(3)}}>
          <View style={(this.state.orientation) ? styles.numberPadContainerBottom : styles.numberPadContainerBottomLandscape}>


            <View style={this.state.orientation ? styles.numberPadContainerColumn : styles.numberPadContainerColumnLandscape}>
              <ImageBackground source={require('../assets/icons/number_container.png')} resizeMode={'stretch'} style={this.state.orientation ? styles.numberContainerSingle : styles.numberContainerSingleLandscape}>
                <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' style={this.state.orientation ? styles.numpadHighlight : styles.numpadHighlightLandscape} onPressIn={()=>{this.padClick(7);this.setState({mainTooltip:false})}}>
                  <Text style={this.state.orientation ? styles.numberPadText : styles.numberPadTextLandscape}>7</Text>
                </TouchableHighlight>
              </ImageBackground>
              <ImageBackground source={require('../assets/icons/number_container.png')} resizeMode={'stretch'} style={this.state.orientation ? styles.numberContainerSingleC : styles.numberContainerSingleCLandscape}>
                <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' style={this.state.orientation ? styles.numpadHighlight : styles.numpadHighlightLandscape} onPressIn={()=>{this.setState({amount:'0.00'});tempNumber='0';this.setState({mainTooltip:false})}}>
                  <Text style={[this.state.orientation ? styles.numberPadText : styles.numberPadTextLandscape,{color:'#D0021B', fontWeight:'bold'}]}>C</Text>
                </TouchableHighlight>
              </ImageBackground>
            </View>


            <View style={this.state.orientation ? styles.numberPadContainerColumn2 : styles.numberPadContainerColumnLandscape}>
              <ImageBackground source={require('../assets/icons/number_container.png')} resizeMode={'stretch'} style={this.state.orientation ? styles.numberContainerSingle : styles.numberContainerSingleLandscape}>
                  <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' style={this.state.orientation ? styles.numpadHighlight : styles.numpadHighlightLandscape} onPressIn={()=>{this.padClick(8);this.setState({mainTooltip:false})}}>
                    <Text style={this.state.orientation ? styles.numberPadText : styles.numberPadTextLandscape}>8</Text>
                </TouchableHighlight>
              </ImageBackground>
              <ImageBackground source={require('../assets/icons/number_container_horizontal.png')} resizeMode={'stretch'} style={this.state.orientation ? styles.numberContainerSingle2 : styles.numberContainerSingle2Landscape}>
                <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' style={this.state.orientation ? styles.numpadHighlight0 : styles.numpadHighlight0Landscape} onPressIn={()=>{this.padClick(0);this.setState({mainTooltip:false})}}>
                  <Text style={this.state.orientation ? styles.numberPadText2 : styles.numberPadText2Landscape}>0</Text>
                </TouchableHighlight>
              </ImageBackground>
            </View>


            <View style={this.state.orientation ? styles.numberPadContainerColumn : styles.numberPadContainerColumnLandscape}>
              <ImageBackground source={require('../assets/icons/number_container.png')} resizeMode={'stretch'} style={this.state.orientation ? styles.numberContainerSingle : styles.numberContainerSingleLandscape}>
                <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' style={this.state.orientation ? styles.numpadHighlight : styles.numpadHighlightLandscape} onPressIn={()=>{this.padClick(9);this.setState({mainTooltip:false})}}>
                  <Text style={this.state.orientation ? styles.numberPadText : styles.numberPadTextLandscape}>9</Text>
                </TouchableHighlight>
              </ImageBackground>
            </View>


            <View style={this.state.orientation ? styles.numberPadContainerColumn : styles.numberPadContainerColumnLandscape}>
              <ImageBackground source={require('../assets/icons/number_container_vertical.png')} resizeMode={'stretch'} style={this.state.orientation ? styles.numberContainerPlus : styles.numberContainerPlusLandscape}>
                <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' style={this.state.orientation ? styles.numpadHighlightPlus : styles.numpadHighlightPlusLandscape} onPressIn={()=>{this.padAdd();this.setState({mainTooltip:false})}}>
                  <IconFontAwesome style={this.state.orientation ? styles.iconAdd : styles.iconAddLandscape} size={moderateScale(40,0.2)} name={'plus'}/>
                </TouchableHighlight>
              </ImageBackground>
            </View>


          </View> 
          </View>










          {this.state.orientation && <View style={{ width: '100%', paddingBottom:0}}>
            <TouchableOpacity style={{backgroundColor: '#52565F', height:hp('6.25%'),justifyContent:'center',alignItems:'center',borderTopLeftRadius:5,borderTopRightRadius:5, marginHorizontal:1}}>
              <View style={{flexDirection:'row'}}>
                <Image source={require('../assets/icons/add_customer_icon.png')} style={{width:hp('3.44%') , height: hp('3.44%'), marginRight:wp('2.78%')}}/>
                <Text style={{color:'white', fontSize:hp('2.5%'), fontFamily:'Montserrat-Medium',
                            letterSpacing:1.67}}>ADD CUSTOMER</Text>
              </View>
            </TouchableOpacity>
          </View>}
        
        </View>  

















        <View flex={1}>
          <View style={styles.savedHeader}>
            <TouchableOpacity>
              <View style={{flexDirection:'row',justifyContent:'center'}}>
                <Image source={require('../assets/icons/Cart_white.png')} style={styles.savedIcon}/>
                <View style={styles.savedAmount}>
                  <Text style={styles.savedText}>6</Text>
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.headerText}>{strings('cash.mainView.savedTitle')}</Text>

          </View>
          {/*--ScrollMain*/}
          <ScrollView
          scrollEnabled={this.state.enabled}
          keyboardShouldPersistTaps={'handled'}
          onScroll={()=>{this.setState({tooltip:false})}}
          onMomentumScrollEnd={()=>{this.setState({tooltip:false})}}
          onResponderRelease ={()=>{this.setState({tooltip:false})}}
          >
            <TouchableWithoutFeedback
             onPressIn={()=>{this.setState({tooltip:false})}}
            >
            <View >
            <View style={styles.transactionCard}>
              {this.state.tooltip && 
              <View style={{flexDirection:'column',position:'absolute',backgroundColor:'#FAFAFA',elevation:2,right:10,top:10,zIndex:10}}>
                <TouchableOpacity style={{backgroundColor:'#EEEEEE',paddingHorizontal:15,paddingVertical:5}}>
                  <View>
                    <Text>{strings('cash.mainView.tooltip1')}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{paddingHorizontal:15,paddingVertical:5}}>
                  <View>
                    <Text>{strings('cash.mainView.tooltip2')}</Text>
                  </View>
                </TouchableOpacity>
              </View>}
                <View style={styles.transactionCardHeader} >
                  <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
                    <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}  marginTop={'10%'}>
                      <IconMaterialCommunityIcons style={styles.iconBlue} size={moderateScale(20,0.2)} name={'cart'}/>
                      <View style={styles.badgeContainerTransactions}>
                        <Text style={styles.badgeText}>2</Text>
                      </View>
                    </View>
                    <View style={{flexDirection:'column',marginLeft:5}}>
                        <Text style={styles.transactionHeaderTitle}>{strings('cash.mainView.userType1')}</Text>
                        <Text style={styles.transactionHeaderSubTitle}>{strings('cash.mainView.savedSubtitle',  { number: 45561 })}</Text>
                    </View>
                  </View>
                  <View style={{flexDirection:'row',alignContent:'center',justifyContent:'flex-end'}}>
                    <View style={{flexDirection:'column',marginLeft:5}}>
                        <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                            <Text style={styles.transactionHeaderSubTitle}>12/06/2018</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                            <Text style={styles.transactionHeaderSubTitleClock}>13:42</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPressIn={()=>{this.setState({tooltip:true})}}>
                      <IconMaterialCommunityIcons style={styles.iconGray2} size={moderateScale(25)} name={'dots-vertical'}/>
                    </TouchableOpacity>
                  </View>                
                </View>
                <View style={styles.transactionCardBody}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center'}}>
                    <View style={styles.salePriceContainer}>
                      <Text style={styles.transactionText}>1 </Text>       
                      <Text style={styles.transactionText}>Heinz Ketchup</Text>  
                    </View>     
                    <View style={styles.salePriceContainer} marginRight={10}>
                      <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                      <Text style={styles.transactionAmount}>148.50</Text>
                    </View> 
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center'}}>
                    <View style={styles.salePriceContainer}>
                      <Text style={styles.transactionText}>1 </Text>       
                      <Text style={styles.transactionText}>Cadbury Silk</Text>  
                    </View>     
                    <View style={styles.salePriceContainer} marginRight={10}>
                      <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                      <Text style={styles.transactionAmount}>100.50</Text>
                    </View> 
                  </View>
                </View>
                <View style={styles.transactionCardFooter}>
                  <Text style={styles.transactionTextTotal}>{strings('cash.mainView.totalAmount')}</Text>
                  <View style={styles.salePriceContainer} marginRight={10}>
                    <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                    <Text style={styles.transactionAmount}>570.00</Text>
                  </View> 
                </View>              
              </View>
              <View style={styles.transactionCard}>
                <View style={styles.transactionCardHeader}>
                  <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
                    <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}  marginTop={'10%'}>
                      <IconMaterialCommunityIcons style={styles.iconBlue} size={moderateScale(20,0.2)} name={'cart'}/>
                      <View style={styles.badgeContainerTransactions}>
                        <Text style={styles.badgeText}>2</Text>
                      </View>
                    </View>
                    <View style={{flexDirection:'column',marginLeft:5}}>
                      <Text style={styles.transactionHeaderTitle}>{strings('cash.mainView.userType1')}</Text>
                      <Text style={styles.transactionHeaderSubTitle}>{strings('cash.mainView.savedSubtitle', { number: 45561 })}</Text>
                    </View>
                  </View>
                  <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
                    <View style={{flexDirection:'column',marginLeft:5}}>
                    <   View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                            <Text style={styles.transactionHeaderSubTitle}>12/06/2018</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                            <Text style={styles.transactionHeaderSubTitleClock}>13:42</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                      <IconMaterialCommunityIcons style={styles.iconGray2} size={moderateScale(25)} name={'dots-vertical'}/>
                    </TouchableOpacity>
                  </View>
                  
                </View>
                <View style={styles.transactionCardBody}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center'}}>
                    <View style={styles.salePriceContainer}>
                      <Text style={styles.transactionText}>1 </Text>       
                      <Text style={styles.transactionText}>Heinz Ketchup</Text>  
                    </View>     
                    <View style={styles.salePriceContainer} marginRight={10}>
                      <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                      <Text style={styles.transactionAmount}>148.50</Text>
                    </View> 
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center'}}>
                    <View style={styles.salePriceContainer}>
                      <Text style={styles.transactionText}>1 </Text>       
                      <Text style={styles.transactionText}>Cadbury Silk</Text>  
                    </View>     
                    <View style={styles.salePriceContainer} marginRight={10}>
                      <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                      <Text style={styles.transactionAmount}>100.50</Text>
                    </View> 
                  </View>
                </View>
                <View style={styles.transactionCardFooter}>
                  <Text style={styles.transactionTextTotal}>{strings('cash.mainView.totalAmount')}</Text>
                  <View style={styles.salePriceContainer} marginRight={10}>
                    <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                    <Text style={styles.transactionAmount}>570.00</Text>
                  </View> 
                </View>              
              </View>
              <View style={styles.transactionCard}>
                <View style={styles.transactionCardHeader}>
                  <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
                    <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}  marginTop={'10%'}>
                      <IconMaterialCommunityIcons style={styles.iconBlue} size={20} name={'cart'}/>
                      <View style={styles.badgeContainerTransactions}>
                        <Text style={styles.badgeText}>2</Text>
                      </View>
                    </View>
                    <View style={{flexDirection:'column',marginLeft:5}}>
                      <Text style={styles.transactionHeaderTitle}>{strings('cash.mainView.userType1')}</Text>
                      <Text style={styles.transactionHeaderSubTitle}>{strings('cash.mainView.savedSubtitle', { number: 45561 })}</Text>
                    </View>
                  </View>
                  <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
                    <View style={{flexDirection:'column',marginLeft:5}}>
                        <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                            <Text style={styles.transactionHeaderSubTitle}>12/06/2018</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                            <Text style={styles.transactionHeaderSubTitleClock}>13:42</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                      <IconMaterialCommunityIcons style={styles.iconGray2} size={moderateScale(25)} name={'dots-vertical'}/>
                    </TouchableOpacity>
                  </View>
                  
                </View>
                <View style={styles.transactionCardBody}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center'}}>
                    <View style={styles.salePriceContainer}>
                      <Text style={styles.transactionText}>1 </Text>       
                      <Text style={styles.transactionText}>Heinz Ketchup</Text>  
                    </View>     
                    <View style={styles.salePriceContainer} marginRight={10}>
                      <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                      <Text style={styles.transactionAmount}>148.50</Text>
                    </View> 
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center'}}>
                    <View style={styles.salePriceContainer}>
                      <Text style={styles.transactionText}>1 </Text>       
                      <Text style={styles.transactionText}>Cadbury Silk</Text>  
                    </View>     
                    <View style={styles.salePriceContainer} marginRight={10}>
                      <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                      <Text style={styles.transactionAmount}>100.50</Text>
                    </View> 
                  </View>
                </View>
                <View style={styles.transactionCardFooter}>
                  <Text style={styles.transactionTextTotal}>{strings('cash.mainView.totalAmount')}</Text>
                  <View style={styles.salePriceContainer} marginRight={10}>
                    <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                    <Text style={styles.transactionAmount}>570.00</Text>
                  </View> 
                </View>              
              </View>
              <View style={styles.transactionCard}>
                <View style={styles.transactionCardHeader}>
                  <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
                    <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}  marginTop={'10%'}>
                      <IconMaterialCommunityIcons style={styles.iconBlue} size={moderateScale(20,0.2)} name={'cart'}/>
                      <View style={styles.badgeContainerTransactions}>
                        <Text style={styles.badgeText}>2</Text>
                      </View>
                    </View>
                    <View style={{flexDirection:'column',marginLeft:5}}>
                      <Text style={styles.transactionHeaderTitle}>{strings('cash.mainView.userType1')}</Text>
                      <Text style={styles.transactionHeaderSubTitle}>{strings('cash.mainView.savedSubtitle', { number: 45561 })}</Text>
                    </View>
                  </View>
                  <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
                    <View style={{flexDirection:'column',marginLeft:5}}>
                        <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                            <Text style={styles.transactionHeaderSubTitle}>12/06/2018</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                            <Text style={styles.transactionHeaderSubTitleClock}>13:42</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                      <IconMaterialCommunityIcons style={styles.iconGray2} size={moderateScale(25)} name={'dots-vertical'}/>
                    </TouchableOpacity>
                  </View>
                  
                </View>
                <View style={styles.transactionCardBody}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center'}}>
                    <View style={styles.salePriceContainer}>
                      <Text style={styles.transactionText}>1 </Text>       
                      <Text style={styles.transactionText}>Heinz Ketchup</Text>  
                    </View>     
                    <View style={styles.salePriceContainer} marginRight={10}>
                      <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                      <Text style={styles.transactionAmount}>148.50</Text>
                    </View> 
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center'}}>
                    <View style={styles.salePriceContainer}>
                      <Text style={styles.transactionText}>1 </Text>       
                      <Text style={styles.transactionText}>Cadbury Silk</Text>  
                    </View>     
                    <View style={styles.salePriceContainer} marginRight={10}>
                      <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                      <Text style={styles.transactionAmount}>100.50</Text>
                    </View> 
                  </View>
                </View>
                <View style={styles.transactionCardFooter}>
                  <Text style={styles.transactionTextTotal}>{strings('cash.mainView.totalAmount')}</Text>
                  <View style={styles.salePriceContainer} marginRight={10}>
                    <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                    <Text style={styles.transactionAmount}>570.00</Text>
                  </View> 
                </View>              
              </View>
              <View style={styles.transactionCard}>
                <View style={styles.transactionCardHeader}>
                  <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
                    <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}  marginTop={'10%'}>
                      <IconMaterialCommunityIcons style={styles.iconBlue} size={moderateScale(20,0.2)} name={'cart'}/>
                      <View style={styles.badgeContainerTransactions}>
                        <Text style={styles.badgeText}>2</Text>
                      </View>
                    </View>
                    <View style={{flexDirection:'column',marginLeft:5}}>
                      <Text style={styles.transactionHeaderTitle}>{strings('cash.mainView.userType1')}</Text>
                      <Text style={styles.transactionHeaderSubTitle}>{strings('cash.mainView.savedSubtitle', { number: 45561 })}</Text>
                    </View>
                  </View>
                  <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
                    <View style={{flexDirection:'column',marginLeft:5}}>
                        <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                            <Text style={styles.transactionHeaderSubTitle}>12/06/2018</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                            <Text style={styles.transactionHeaderSubTitleClock}>13:42</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                      <IconMaterialCommunityIcons style={styles.iconGray2} size={moderateScale(25)} name={'dots-vertical'}/>
                    </TouchableOpacity>
                  </View>
                  
                </View>
                <View style={styles.transactionCardBody}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center'}}>
                    <View style={styles.salePriceContainer}>
                      <Text style={styles.transactionText}>1 </Text>       
                      <Text style={styles.transactionText}>Heinz Ketchup</Text>  
                    </View>     
                    <View style={styles.salePriceContainer} marginRight={10}>
                      <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                      <Text style={styles.transactionAmount}>148.50</Text>
                    </View> 
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center'}}>
                    <View style={styles.salePriceContainer}>
                      <Text style={styles.transactionText}>1 </Text>       
                      <Text style={styles.transactionText}>Cadbury Silk</Text>  
                    </View>     
                    <View style={styles.salePriceContainer} marginRight={10}>
                      <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                      <Text style={styles.transactionAmount}>100.50</Text>
                    </View> 
                  </View>
                </View>
                <View style={styles.transactionCardFooter}>
                  <Text style={styles.transactionTextTotal}>{strings('cash.mainView.totalAmount')}</Text>
                  <View style={styles.salePriceContainer} marginRight={10}>
                    <IconFontAwesome style={styles.iconBlue} size={10} name={'rupee'}/>
                    <Text style={styles.transactionAmount}>570.00</Text>
                  </View> 
                </View>              
              </View>  
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </View>  
      </Swiper>    
      {/* <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>Saved Transactions</Text>
              </View>
          </TouchableOpacity>
        </View>    */}  
    </View>  


    {/* -----------VVVVVVV---------- @@@@ CART DETAILS LANDSCAPE --------------VVVVVVV----------- */}   
    {!this.state.orientation && <View style={styles.drawerRightContainerLandscape}>
    <ImageBackground
            source={ require('../assets/images/side_nav_portrait.png') }
            style={styles.backgroundImage}
            resizeMode= {'stretch'} />

          <View style={{width:'100%', height:hp('12.6%'), flexDirection:'row', borderBottomWidth:hp('0.15%'), elevation:hp('1.4%')}}>
                <View style={styles.drawerRightMainTitleContainerLandscape}>

                  <View style={{/*backgroundColor:'red', */height:'100%', paddingLeft:wp('1.25%'), paddingTop:hp('1.3%')}}>
                      {/* SHADOW FOR USER NAME BOX */}
                      <View style={{height:hp('4.6%'), width:wp('14%'), backgroundColor:'#000000', flexDirection: 'column', position:'absolute', top:hp('1.7%'), left:wp('1.4%'), borderRadius:hp('1.4%'), opacity:0.15}} />

                      <View style={{height:hp('4.6%'), width:wp('14%'), backgroundColor:'#5D6770',  flexDirection: 'column', borderWidth:hp('0.2%'), borderRadius:hp('1.4%')}}>
                          <Text numberOfLines={1} style={{height:'100%', width:'100%', paddingLeft:wp('0.8%'), paddingRight:wp('0.1%'), paddingTop:hp('0.35%'), fontFamily:'Montserrat-Bold', fontSize:hp('2.25%'), color:'white'}}>Customer #43</Text>
                      </View>                 
                  </View>

                </View>

                <View style={styles.saleContainerMainLandscape}>

                    <View style={{width:'100%', height:hp('5.4%'), alignItems:'flex-end', justifyContent:'flex-end', paddingRight:wp('1.5%')}}>
                      <Text style={{fontSize:hp('2.7%'), fontFamily:'Montserrat-Bold', color:'white'}}>0 Points</Text>
                    </View>

                    <View style={[styles.drawerRightTitleContainerLandscape,{justifyContent:'flex-end', paddingTop:hp('0.8%') }]}>
                        <TouchableOpacity onPress={()=>{this.setState({ modalDelivery: true });}}>
                          <Image source={require('../assets/icons/Delivery2.png')} style={[styles.drawerRightIconLandscape,{marginRight:wp('0.8%')}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.setState({ modalDiscount: true });}}> 
                          <Image source={require('../assets/icons/Discount2.png')} style={[styles.drawerRightIconLandscape,{marginRight:wp('1%')}]}/>
                        </TouchableOpacity>
                    </View>

                </View>     
          </View> 
          
          <View style={styles.saleDetailsContainer}>

              <View style={{flexDirection:'row', height:hp('3.95%'), paddingLeft:wp('1%'), paddingRight:wp('1.5%'), alignItems:'center', borderBottomWidth:hp('0.15%'), borderColor:'#D0D0D0'}}>
                  <Text style={{fontFamily:'Montserrat-Bold', fontSize:hp('2%'), color:'#555555', width:wp('3.8%')}}>S No.</Text>
                  <Text style={{fontFamily:'Montserrat-Bold', fontSize:hp('2%'), color:'#555555', width:wp('17.3%'), paddingLeft:wp('0.6%')}}>Description</Text>
                  <Text style={{fontFamily:'Montserrat-Bold', fontSize:hp('2%'), color:'#555555', width:wp('3.1%'), textAlign:'center'}}>Qty</Text>
                  <Text style={{fontFamily:'Montserrat-Bold', fontSize:hp('2%'), color:'#555555', width:wp('9.6%'), textAlign:'right'}}>Price</Text>
              </View>

            <FlatList
              keyboardShouldPersistTaps={'handled'}
              keyExtractor={(item, index) => item + index}
              data={this.getCurrentItems()}
              renderItem={({item,index}) =>      
                <ProductDetail
                parentFlatList={this}
                ref={(ref) => this._flatItem[index] = ref}
                item={item}>
                </ProductDetail>
            }
            />
          </View>   
          <View style={styles.TotalContainerLandscape}>

            <View  style={[styles.subTotalContainerLandscape, {paddingTop:hp('0.3%')}]}>
                <Text style={styles.textDark1Landscape}>{strings('cash.drawerRight.subTotal')}</Text>       
                <View style={styles.salePriceContainer}>
                    <IconFontAwesome style={[styles.iconBlue1Landscape,{paddingTop:wp('0.2%'), paddingRight:wp('0.25%')}]} size={hp('2.2%')} name={'rupee'}/>
                    <Text style={styles.TextBlue1Landscape}>{this.state.subtotalSale}</Text>
                </View> 
            </View>
            
            { // CHECKS WHETHER TRANSACTION VALUE IS 0, IF SO, DON'T PRINT DISCOUNT AND CGST ###########
                parseFloat(this.state.subtotalSale) === 0 ? null :
                <View style={{width:'100%'}}>
                    {
                      parseFloat(this.state.totalDiscount) > 0 ?
                        <Swipeout 
                          right={swipeBtns}
                          autoClose={true}
                          backgroundColor={'transparent'}
                          buttonWidth={wp('7%')}
                          onOpen={()=>{this.setState({deleteDelivery:false, deleteDiscount: true})}}
                          onClose={()=>{this.setState({deleteDiscount: false})}}
                        >
                          <View  style={styles.subTotalContainerLandscape}>
                              <Text style={styles.subTextOrangeLandscape}>{strings('cash.drawerRight.discount')}</Text>       
                              <View style={styles.salePriceContainer}>
                                  <IconFontAwesome style={[styles.iconOrangeLandscape,{paddingTop:hp('0.25%'), paddingRight:wp('0.2%')}]} size={hp('2.1%')} name={'rupee'}/>
                                  <Text style={styles.textOrangeLandscape}>{this.state.totalDiscount}</Text>
                              </View> 
                          </View>
                        </Swipeout> : null
                    }
                    {
                      parseFloat(this.state.deliveryCharge) > 0 ? 
                        <Swipeout 
                          right={swipeBtns}
                          autoClose={true}
                          backgroundColor={'transparent'}
                          buttonWidth={wp('7%')}
                          onOpen={()=>{this.setState({deleteDiscount:false, deleteDelivery: true})}}
                          onClose={()=>{this.setState({deleteDelivery: false})}}
                        >
                          <View  style={styles.subTotalContainerLandscape}>
                              <Text style={styles.subTextGrayLandscape}>{strings('cash.drawerRight.delivery')}</Text>       
                              <View style={styles.salePriceContainer}>
                                  <IconFontAwesome style={[styles.iconBlue1Landscape,{paddingTop:hp('0.2%'), paddingRight:wp('0.2%')}]} size={hp('2.1%')} name={'rupee'}/>
                                  <Text style={styles.subTextBlueLandscape}>{this.state.deliveryCharge}</Text>
                              </View>
                          </View> 
                        </Swipeout> : null
                    }
                    <View  style={[styles.subTotalContainerLandscape]}>
                        <Text style={styles.subTextGrayLandscape}>{strings('cash.drawerRight.tax')}</Text>       
                        <View style={styles.salePriceContainer}>
                            <IconFontAwesome style={[styles.iconBlue1Landscape,{paddingTop:hp('0.2%'), paddingRight:wp('0.2%')}]} size={hp('2.1%')} name={'rupee'}/>
                            <Text style={styles.subTextBlueLandscape}>{this.state.tax}</Text>
                        </View> 
                    </View>
                </View>
                }

            <View  style={[styles.subTotalContainerLandscape,{paddingTop:hp('0.1%')}]}>
                <Text style={styles.textDark2Landscape}>{strings('cash.drawerRight.totalAmount')}</Text>       
                <View style={styles.salePriceContainer}>
                    <IconFontAwesome style={[styles.iconBlue2Landscape,{paddingBottom:hp('0.2%'), paddingRight:wp('0.25%')}]} size={hp('2.5%')} name={'rupee'}/>
                    <Text style={styles.TextBlue2Landscape}>{this.state.totalSale}</Text>
                </View> 
            </View>


                {/** @@@@ */}
            <View style={{width:'100%', height:hp('6.75%'), alignItems:'center'}}>
                <TouchableOpacity
                  onPress={()=>{alert('Not implemented for this version.')}} >
                    <View style={styles.holdButtonCartLandscape}>
                        <Text style={{fontFamily:'Montserrat-Bold', fontSize:hp('2.6%'), color:'#47525D', }}>HOLD</Text>
                    </View>
                </TouchableOpacity>
            </View>

          </View>
        </View> }
    </View>
    </TouchableWithoutFeedback>
    </View>    
    </ScrollView>
    </Drawer>
    </Drawer>
    );
  }

}



const styles = StyleSheet.create({
    
  totalAmountTopView:{
    backgroundColor: '#5D6770',
    height:hp('4.69%'),
    width:wp('100%'),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    flexDirection: 'row'
  },

  totalAmountTopText:{
      width: wp('33.89%'),
      color: '#FFFFFF',
      fontFamily: 'Montserrat-Medium',
      fontSize: hp('1.8%'),
      fontWeight: '500',
      letterSpacing: 1.45,
      paddingVertical: hp('1.30%'),
      marginLeft: wp('5.56%')
  },

  totalAmountValueTopText:{
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Medium',
    fontSize: hp('1.8%'),
    fontWeight: '500',
    letterSpacing: 1.45,
    paddingVertical: hp('1.30%'),
    position: 'absolute',
    right:0,
    marginRight: wp('5.56%')
  },

  totalAmountValueTopTextLandscape:{
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Medium',
    fontSize: hp('1.8%'),
    fontWeight: '500',
    letterSpacing: 1.45,
    paddingVertical: hp('1.30%'),
    position: 'absolute',
    right:0,
    marginRight: wp('40.56%')
  },

    //Input
  inputUser: {
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  inputDiscountPrefix:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputDiscountNumber:{
    fontWeight: 'bold',
  },
  input: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
  },
  inputContainer:{
    flex:1,
    flexDirection:'column',
    alignContent:'center',
    justifyContent:'center',
    width:'100%',
    borderColor:'red',
    borderBottomWidth:2,
  },
  inputPlaceholder: {
    fontFamily: "Roboto-Bold",
    flex: 1,
    fontWeight: 'bold',
  },

  //Transaction cards:
  transactionCard:{
    flexDirection:'column',
    alignContent:'center',
    borderColor:'lightgray',
    margin:10,
    elevation:2,
  },
  transactionCardHeader:{
    flexDirection:'row',
    alignContent:'center',
    justifyContent:'space-between',
    borderColor:'lightgray',
    borderBottomWidth:1,
    padding:5,
  },
  transactionCardBody:{
    flexDirection:'column',
    alignContent:'center',
    padding:5,
  },
  transactionCardFooter:{
    flexDirection:'row',
    alignContent:'center',
    justifyContent:'space-between',
    padding:5,
    borderColor:'lightgray',
    borderTopWidth:1,
  },
  badgeContainerTransactions:{
    marginLeft:moderateScale(12,0.3),
    backgroundColor:'#6A737B',
    position: 'absolute',
    top: 0,
    left: 0,
    width: moderateScale(11,0.3),
    height: moderateScale(11,0.3),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:10,
  },

  // CART DRAWER CONTAINER
  drawerRightContainer: {
    flexDirection:'column',
    height:Dimensions.get('window').height-25,
    justifyContent:'center',
    backgroundColor:'#5D6770',
  },
  drawerRightContainerLandscape: {
    flexDirection:'column',
    height:Dimensions.get('window').height-25,
    width: wp('36.34%'),
    elevation:30,
    backgroundColor:'black'
  },

  // MAIN TITLE CONTAINER CART
  drawerRightMainTitleContainer:{
    height:hp('13.6%'),
    width:'50%',
    backgroundColor: '#5D6770',
    //backgroundColor:'green',
  },
  drawerRightMainTitleContainerLandscape:{
    height:hp('12.6%'),
    width:'50%',
    backgroundColor: '#5D6770',
  },
  // CURRENT SALE VALUE CONTAINER
  saleContainerMain:{
    height:hp('13.6%'),
    width:'50%',
    backgroundColor: '#5D6770',
    flexDirection:'column',  
  },
  saleContainerMainLandscape:{
    height:hp('12.6%'),
    width:'50%',
    backgroundColor: '#5D6770',
    flexDirection:'column',  
  },

  // DRAWER ICONS CONTAINER CART
  drawerRightTitleContainer:{
    height:hp('7.8%'),
    flexDirection:'row',
    width:'100%',
    paddingTop:hp('0.8%'),
    //alignContent:'flex-start',
    justifyContent:'flex-end',
  },
  drawerRightTitleContainerLandscape:{
    //backgroundColor:'#F2D6BC',
    flexDirection:'row',
    width:'100%',
    height:hp('7%'),
    //justifyContent:'space-evenly',
  },

  // CART MAIN TITLE
  titleText:{
    //backgroundColor:'#B4B6FA',
    fontSize:hp('2.7%'),
    color:'white',
    fontFamily: "Montserrat-Bold",
    width:wp('40%'),
  },
  titleTextLandscape:{
    //backgroundColor:'#B4B6FA',
    fontSize:hp('2.7%'),
    paddingTop:hp('0.5%'),
    color:'white',
    fontFamily: "Montserrat-Bold",
    width:'60%',
    paddingLeft:wp('3.7%')
  },

  // CURRENT SALE VALUE CART
  saleText:{
    fontSize:hp('3.1%'),
    color:'white',
    //backgroundColor:'#AF7BC8',
    fontFamily: "Montserrat-Bold",
  },
  saleTextLandscape:{
    fontSize:hp('3.1%'),
    color:'white',
    //backgroundColor:'#AF7BC8',
    fontFamily: "Montserrat-Bold",
  },
  // CURRENT SALE TITLE CART
  saleText1:{
    fontSize:hp('3%'),
    //backgroundColor:'#A0F1C3',
    color:'white',
    fontFamily: "Montserrat-Bold",
  },
  saleTextLandscape1:{
    fontSize:hp('3%'),
    //backgroundColor:'#A0F1C3',
    color:'white',
    fontFamily: "Montserrat-Bold",
  },
  // PRODUCTS COUNTER CART
  badgeContainerDrawer:{
    backgroundColor:'#B1B1B1',
    position:'absolute',
    width:  wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:moderateScale(10,0.3),
    marginLeft:wp('4%'),
    top: hp('-0.2%'),
    left:wp('0.7%')
  },
  badgeContainerDrawerLandscape:{
    backgroundColor:'#B1B1B1',
    position:'absolute',
    width:  wp('1.4%'),
    height: hp('1.7%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:moderateScale(10,0.3),
    marginLeft:wp('1.1%'),
    top: hp('0%'),
    left:wp('0.7%')
  },
  // ADD MORE OPTION CART
  addMore: {
    fontSize:hp('1.95%'),
    fontFamily: 'Montserrat-SemiBold',
    color:'#9B9B9B',
    paddingLeft:wp('5%'),
    paddingTop:hp('0.7%')
  },
  addMoreLandscape: {
    fontSize:moderateScale(13,0.3),
    paddingLeft:moderateScale(10,0.01)
  },
  // CART TOTAL SALE CONTAINER
  TotalContainer:{
    borderTopWidth:hp('0.2%'),
    borderColor:'#D0D0D0',
    width:'100%',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'space-between',
  },
  TotalContainerLandscape:{
    borderTopWidth:hp('0.2%'),
    borderColor:'#D0D0D0',
    width:'100%',
    flexDirection:'column',
    alignItems:'center',
    //height:hp('19%')
  },
  // CART SUBTOTAL AMOUNT LABEL
  textDark1:{
    fontSize:hp('2.4%'),
    color:'#47525D',
    fontFamily: "Montserrat-Bold",
    paddingLeft: wp('2.65%')
  },
  textDark1Landscape:{
    fontSize:hp('2.5%'),
    color:'#47525D',
    fontFamily: "Montserrat-Bold",
  },
  // CART TOTAL AMOUNT LABEL
  textDark2:{
    fontSize:hp('2.6%'),
    letterSpacing:wp('0.2%'),
    color:'#47525D',
    fontFamily: "Montserrat-Bold",
    paddingBottom: hp('1%'),
    paddingLeft: wp('2.65%')
  },
  textDark2Landscape:{
    fontSize:hp('2.8%'),
    letterSpacing:wp('0.1%'),
    color:'#47525D',
    fontFamily: "Montserrat-Bold",
    paddingBottom: hp('0.6%'),
  },
  // CART DISCOUNT AMOUNT LABEL
  subTextOrange:{
    fontSize:hp('2.1%'),
    color:'#FF6000',
    fontFamily: "Montserrat-SemiBold",
    paddingLeft: wp('2.65%')
  },
  subTextOrangeLandscape:{
    fontSize:hp('2.45%'),
    color:'#FF6000',
    fontFamily: "Montserrat-SemiBold",
  },
  // CART CGST AMOUNT LABEL
  subTextGray:{
    fontSize:hp('2.1%'),
    color:'#47525D',
    fontFamily: "Montserrat-SemiBold",
    paddingLeft: wp('2.65%')
  },
  subTextGrayLandscape:{
    fontSize:hp('2.45%'),
    color:'#47525D',
    fontFamily: "Montserrat-SemiBold",
  },
  // CART SUBTOTAL VALUE
  TextBlue1:{
    fontSize:hp('2.3%'),
    color:'#174285',
    fontFamily: "Montserrat-Bold",
    letterSpacing:wp('0.03%'),
    paddingRight: wp('4%')
  },
  TextBlue1Landscape:{
    fontSize:hp('2.5%'),
    color:'#174285',
    fontFamily: "Montserrat-Bold",
    letterSpacing:wp('0.03%'),
  },
  // CART DISCOUNT VALUE
  textOrange:{
    fontSize:hp('2.1%'),
    color:'#FF6000',
    fontFamily: "Montserrat-SemiBold",
    paddingRight: wp('4%')
  },
  textOrangeLandscape:{
    fontSize:hp('2.6%'),
    color:'#FF6000',
    fontFamily: "Montserrat-SemiBold",
  },
  // CART CGST VALUE
  subTextBlue:{
    fontSize:hp('2.1%'),
    color:'#174285',
    fontFamily: "Montserrat-SemiBold",
    paddingRight: wp('4%')
  },
  subTextBlueLandscape:{
    fontSize:hp('2.6%'),
    color:'#174285',
    fontFamily: "Montserrat-SemiBold",
  },
  // CART TOTAL VALUE
  TextBlue2:{
    fontSize:hp('2.6%'),
    color:'#174285',
    fontFamily: "Montserrat-Bold",
    letterSpacing:wp('0.22%'),
    paddingBottom: hp('1%'),
    paddingRight: wp('4%')
  },
  TextBlue2Landscape:{
    fontSize:hp('3%'),
    color:'#174285',
    fontFamily: "Montserrat-Bold",
    letterSpacing:wp('0.22%'),
    paddingBottom: hp('0.6%'),
  },
  // CART RUPEE SIGN SUBTOTAL
  iconBlue1: {
    color:'#174285',
    paddingTop: hp('0.3%'),
    paddingRight: wp('0.8%')
  },
  iconBlue1Landscape: {
    color:'#174285',    
  },
  // CART RUPEE SIGN DISCOUNT
  iconOrange: {
    color:'#FD853B',
    paddingTop: hp('0.35%'),
    paddingRight: wp('0.8%'), 
  },
  // CART RUPEE SIGN CGST 
  iconBlue: {
    color:'#174285',
    paddingTop: hp('0.35%'),
    paddingRight: wp('0.8%'),  
  },
  // CART RUPEE SIGN TOTAL
  iconBlue2: {
    color:'#174285',
    paddingBottom: hp('0.55%'),
    paddingRight: wp('0.9%')
  },
  iconBlue2Landscape: {
    color:'#174285',
  },
  // CART RUPEE SIGN DISCOUNT ON PRODUCT
  iconOrangeDiscountProduct: {
    color:'#FD853B',
  },

  
  iconOrangeLandscape: {
    color:'#FD853B',
  },
  //ProductDetail
  productDetailContainer:{
    flexDirection:'column',
    backgroundColor:'white',
    alignContent:'center',
    //justifyContent:'center',
    borderWidth:0.1,
    borderColor:'gray',
    width:'93%',
    elevation:7,
    paddingTop:10,
    borderRadius:10,
    marginBottom:5,
    marginLeft:10,
  },
  productDetailContainerLandscape:{
    flexDirection:'column',
    alignContent:'center',
    backgroundColor:'white',
    //justifyContent:'center',
    borderWidth:0.1,
    borderColor:'gray',
    width:'93%',
    elevation:7,
    paddingTop:10,
    borderRadius:10,
    marginBottom:5,
    marginLeft:moderateScale(10,0.3),
  }, 
  //saleDetail
  saleDetailsContainer:{
    flex:6,
    flexDirection:'column',
  },
  saleDetailsContainer1:{
    flex:8,
    backgroundColor: '#FFF',
    flexDirection:'column',
    borderWidth:2,
  },
  saleDetailsContainerLandscape:{
    flex:3,
    flexDirection:'column',
    width:'100%'
  },

  // --------------- @@@@ STYLES FOR PRODUCT DETAIL ITEMS ---------------
  // PRODUCT DETAIL VIEW ITEM CONTAINER
  saleContainer:{
    width:'100%',
    flexDirection:'row',
    paddingLeft:wp('2.1%'),
    paddingTop:hp('0.5%'),
  },
  saleContainerLandscape:{
    width:'100%',
    flexDirection:'row',
    paddingLeft:wp('1%'),
    paddingTop:hp('0.2%'),
    marginBottom:hp('0.1%')
  },
  // PRODUCT DETAIL ITEM QUANTITY
  TextGray:{
    //backgroundColor:('red'),
    //fontSize:hp('2.6%'),
    fontSize:hp('2.1%'),
    color:'#555555',
    fontFamily: "Montserrat-Medium",  
    width:wp('9%'),
    textAlign:'center',
  },
  TextGrayLandscape:{
    //backgroundColor:('red'),
    //fontSize:hp('2.6%'),
    fontSize:hp('2.25%'),
    color:'#555555',
    fontFamily: "Montserrat-Medium",  
    width:wp('3.1%'),
    textAlign:'center',
  },  
  // PRODUCT DETAIL ITEM INDEX
  TextGrayProductIndex:{
    //backgroundColor:('yellow'),
    color:'#555555',
    //fontFamily: "Montserrat-SemiBold",
    fontFamily: "Montserrat-Medium", 
    //fontSize:hp('2.6%'),
    fontSize:hp('2.1%'),
    textAlign:'center',
    width:wp('10%'),
  },
  TextGrayProductIndexLandscape:{
    //backgroundColor:('green'),
    color:'#555555',
    //fontFamily: "Montserrat-SemiBold",
    fontFamily: "Montserrat-Medium", 
    //fontSize:hp('2.6%'),
    fontSize:hp('2.25%'),
    width:wp('3.7%'),
    textAlign:'center',
  },
  // PRODUCT DETAIL ITEM NAME
  TextGrayProduct:{
    //backgroundColor:('green'),
    color:'#555555',
    //fontFamily: "Montserrat-SemiBold",
    fontFamily: "Montserrat-Medium", 
    //fontSize:hp('2.6%'),
    fontSize:hp('2.1%'),
    width:wp('41%'),
    paddingLeft:wp('1.75%'),
    paddingRight:wp('0.8%')
  },
  TextGrayProductLandscape:{
    //backgroundColor:('#F1BC87'),
    color:'#555555',
    //fontFamily: "Montserrat-SemiBold",
    fontFamily: "Montserrat-Medium", 
    //fontSize:hp('2.6%'),
    fontSize:hp('2.25%'),
    width:wp('17.3%'),
    paddingLeft:wp('0.6%'),
    paddingRight:wp('0.6%')
  },
  // PRODUCT DETAIL ITEM SUBTOTAL CONTAINER 
  productAmount: {
    //backgroundColor:'yellow',
    width:wp('23.5%'),
    flexDirection:'row',
    justifyContent:'flex-end'
  },
  productAmountLandscape: {
    //backgroundColor:'blue',
    width:wp('9.6%'),
    flexDirection:'row',
    justifyContent:'flex-end'
  }, 
  // PRODUCT DETAIL ITEM PRICE SUBTOTAL
  TextBlueProduct:{
    //backgroundColor:('green'),
    //fontSize:hp('2.6%'),
    fontSize:hp('2.1%'),
    color:'#174285',
    width:wp('23.5%'),
    textAlign:'right',
    fontFamily: "Montserrat-SemiBold",
    //fontFamily: "Montserrat-Medium",
  },
  TextBlueProductLandscape:{
    //backgroundColor:('yellow'),
    //fontSize:hp('2.6%'),
    fontSize:hp('2.25%'),
    color:'#174285',
    width:wp('9.6%'),
    textAlign:'right',
    fontFamily: "Montserrat-SemiBold",
    //fontFamily: "Montserrat-Medium",
  },
  //PRODUCT DETAIL DISCOUNT CONTAINER
  productDetailDiscountContainer:{
    //backgroundColor:'#CBF5FB',
    flexDirection:'row', 
    justifyContent:'flex-end', 
    //height:hp('3%'), 
    width:'100%', 
    //paddingTop:hp('0.3%'), 
    paddingRight:wp('4.4%')
  },
  productDetailDiscountContainerLandscape:{
    //backgroundColor:'yellow',
    flexDirection:'row', 
    justifyContent:'flex-end', 
    height:hp('2.5%'),
    width:'100%', 
    paddingRight:wp('1.5%')
  },
  //PRODUCT DETAIL DISCOUNT LABEL
  productDetailDiscountLabel:{  
    color:'#FD853D', 
    fontFamily:'Montserrat-SemiBold', 
    fontSize:hp('1.72%'), 
    width:wp('53.1%')
  },
  productDetailDiscountLabelLandscape:{
    //backgroundColor:'blue',
    color:'#FD853D', 
    fontFamily:'Montserrat-SemiBold', 
    fontSize:hp('1.85%'), 
    width:'68.5%', 
    paddingLeft:wp('3.25%')
  },
  //PRODUCT DETAIL DISCOUNT VALUE
  productDetailDiscountValue:{
    color:'#FD853D', 
    fontFamily:'Montserrat-SemiBold', 
    fontSize:hp('1.72%'), 
    textAlign:'right', 
    width:wp('20%')
  },
  productDetailDiscountValueLandscape:{
    //backgroundColor:'green', 
    color:'#FD853D', 
    fontFamily:'Montserrat-SemiBold', 
    fontSize:hp('1.85%'), 
    textAlign:'right', 
    width:'26%'
  },

  saleContainerAdd:{
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    //justifyContent:'space-between',
  },
  salePriceContainer:{
    flexDirection:'row',
    alignItems:'center',
  },
  transactionHeaderTitle:{
    fontSize:moderateScale(18),
    fontWeight:'bold',
    fontFamily: "Roboto-bold",
  },
  transactionHeaderSubTitle:{
    fontSize:moderateScale(14),
    color:'gray',
    fontFamily: "Roboto-bold",
    justifyContent:'flex-end',
  },
  transactionHeaderSubTitleClock:{
    fontSize:moderateScale(14),
    color:'gray',
    justifyContent:'flex-end',
    fontFamily: "Roboto-bold",
  },
  transactionText:{
    fontSize:moderateScale(14),
    color:'gray',
    fontFamily: "Roboto-medium",
    marginLeft:moderateScale(5,1.2)
  },
  transactionTextTotal:{
    fontSize:moderateScale(14),
    fontFamily: "Roboto-bold",
    fontWeight: "bold",
    marginLeft:moderateScale(5,1.2)
  },
  transactionAmount:{
    fontSize:moderateScale(14),
    color:'#174285',
    fontFamily: "Roboto-medium",
    marginRight: moderateScale(2,2.6)
  },

  // DISCOUNT
  discountContainer:{
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingLeft:20
  },
  discountText:{
    fontSize:moderateScale(16,0.2),
    color:'#333333',
    fontFamily: "Roboto-bold",
  },
  discountPriceText:{
    fontSize:moderateScale(16,0.2),
    color:'#FD853B',
    fontFamily: "Roboto-bold",
  },

  // CART SUBTOTAL CONTAINER
  subTotalContainer:{
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  subTotalContainerLandscape:{
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingLeft:wp('1%'),
    paddingRight:wp('1.5%') 
  },
  //icons
  icon: {
    color:'white',
    marginRight: 10
  },
  iconDots: {
      color: 'white',
      marginRight: 10
  },
  iconDotsLandscape: {
    color: 'white',
  },
  iconGray: {
    color:'#52565F'
  },
  iconGray2: {
    color:'#52565F',
    padding: moderateScale(2.8),
  },
  iconDelete: {
    color:'#FF6000',
  },
  iconAdd: {
    color:'#174285',    
    marginLeft:moderateScale(22,2.5)
  },
  iconAddLandscape: {
    color:'#174285'
  },
  iconCart: {
    color:'white',   
  },
  iconCartDrawer: {
    color:'white', 
  },  
  iconCartDrawerLandscape: {
    color:'white',
  },
  //Main
  container: {
    height:Dimensions.get('window').height-25,
    backgroundColor: '#FFF'    
  },
  containerLandscape: {
    height:Dimensions.get('window').height-25,
    backgroundColor: '#FFF',
    width: '100%',
    flexDirection:'row',
  },

  // MAIN CONTAINER CASH REGISTER
  container1: {
    height:Dimensions.get('window').height-25,
    backgroundColor: '#FFF'    
  },
  containerLandscape1: {
    height:Dimensions.get('window').height-25,
    backgroundColor: '#FFF',
    width: wp('63.66%'),
    flexDirection:'column'
  },
  //Header
header: {
    height:'10%',
    width:'100%',
    backgroundColor: '#174285',
    flexDirection:'row',
    alignItems:'center',
    elevation:10
  },
  headerLandscape: {
    height:hp('8.33%'),
    width:'100%',
    backgroundColor: '#174285',
    flexDirection:'row',
    elevation:10,
    paddingTop:hp('2.3%')
  },
  savedHeader: {
    height:'10%',
    width:'100%',
    backgroundColor: '#5D6770',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
  },
  headerTextContainer: {
    marginLeft: wp('5.56%')
  },
  headerTextContainerLandscape: {
    paddingLeft:moderateScale(15),
  },
  headerText:{
    fontSize: hp('2%'),
    color:'white',
    fontFamily: "Montserrat-Light",
    fontWeight: '500',
    letterSpacing: 1.44,
    marginLeft: wp('21.48%'),
    width:wp('32.72%')
  },
  headerTextLandscape:{
    fontSize: hp('2.5%'),
    color:'white',
    fontFamily: "Montserrat-Light",
    fontWeight: '500',
    letterSpacing: 1.44,
    width:'100%',
    height:'100%',
    position: 'absolute',
    justifyContent:'center',
    alignItems:'center',
    textAlign:'center',
    marginTop:hp('2.86%')
  },
  // CART PRODUCTS COUNTER
  badgeText:{
    fontSize: moderateScale(9,0.2),
    color:'white',
  },
  badgeTextLandscape:{
    fontSize: hp('1.3%'),
    color:'white',
  },
  savedText:{
    fontSize:hp('1.9%'),
    color:'white',
    flex:1,
    fontWeight:'bold',
    fontFamily: 'Montserrat-Medium',
  },  
  badgeContainer:{
    marginLeft: moderateScale(12),
    backgroundColor:'#6A737B',
    position: 'absolute',
    top: 0,
    left: 0,
    width: moderateScale(13,0.2),
    height: verticalScale(11,0.3),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:moderateScale(10,0.3),
  },
  badgeContainerTotalAmount:{
    marginLeft: moderateScale(12),
    backgroundColor:'#E3A33D',
    position: 'absolute',
    marginTop:1,
    top: 0,
    left: 0,
    width: moderateScale(11,0.2),
    height: verticalScale(9,0.3),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:moderateScale(10,0.3),
  },
  badgeContainerTotalAmountLandscape:{
    marginLeft: wp('1.10%'),
    backgroundColor:'#E3A33D',
    position: 'absolute',
    marginTop:1,
    top: 0,
    left: 0,
    width: moderateScale(11,0.2),
    height: verticalScale(9,0.3),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:moderateScale(10,0.3),
  },
  //Buttons Dots
  buttonsDots: {
    flexDirection:'column',
    position:'absolute',
    backgroundColor:'#FAFAFA',
    elevation:20,
    right:moderateScale(1),
    top:verticalScale(52),
    zIndex:10,
    width:moderateScale(150)
  },
  buttonsDotsLandscape: {
    flexDirection:'column',
    position:'absolute',
    backgroundColor:'#FAFAFA',
    elevation:2,
    right:moderateScale(170),
    top:verticalScale(52),
    zIndex:10,
    width:moderateScale(135)
  },  
    //Cuadrado
  savedAmount:{
    position: 'absolute',
    height: hp('3.91%'),
    width: wp('6.94%'),  
    alignItems:'center',
    justifyContent:'center',
    paddingRight: wp('1%'),
    paddingTop:hp('0.3%')
  },
  //CurrentSale
  currentSaleContainer:{
    flex:1,
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:10,
    justifyContent:'space-between',
    borderBottomWidth:1,
    borderColor:'gray'
  },
  currentSaleContainer2:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
  },
  clearText:{
    color:'#FF6000',
  },
  currentSaleText:{
    color:'#174285',
    fontFamily:'roboto-bold',
    fontSize:Dimensions.get('window').width/12,
    fontWeight:'bold'
  },
  badgeContainer2:{
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top:'35%',
    left:'45%'
  },
  badgeBlue:{
    fontSize:17,
    color:'#174285',
    fontFamily:'roboto-bold',
  },
  //Main Containers
  mainContainer: {
    width:'100%',
    height: '100%',
    flex:1,
  },
  mainContainerLandscape: {
    width:'100%',
    height:Dimensions.get('window').height-25,
    flex: 1
  },
  //Currency
  currencyContainer: {
    top: 0,
    left: 0,
    flex:1 ,
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  currencyContainerLandscape: {
    left: 0,
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between',
    paddingTop: moderateScale(5,0.3)
  },
  currency:{
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'column',
    paddingHorizontal:moderateScale(2),
  },
  currencyImages:{
    height:moderateScale(60,0.3),
    width:moderateScale(60,0.3),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'column',
  },
  currencyImagesLandscape:{
    height:hp('8.29%'),
    width:hp('8.29%'),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'column',
  },
  currencyImagesCash:{
    height:moderateScale(60,0.3),
    width:moderateScale(60,0.3),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'column',
    marginLeft:moderateScale(5),
  },
  currencyImagesCashLandscape:{
    height:hp('8.29%'),
    width:hp('8.29%'),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'column',
    marginLeft: moderateScale(10,0.8)
  },
  currencyImagesMore:{
    height:moderateScale(60,0.3),
    width:moderateScale(60,0.3),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'column',
    marginRight:moderateScale(5)
  },
  currencyImagesMoreLandscape:{
    height:hp('8.29%'),
    width:hp('8.29%'),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'column',
    marginRight: moderateScale(10,0.8),
  },
  currencyText:{
    fontSize:hp('2%'),
    fontFamily: "Roboto-bold",
    fontWeight:'bold',
    color: '#5D6770'
  },
  currencyTextLandscape:{
    fontSize:hp('2%'),
    fontFamily: "Roboto-bold",
    fontWeight:"bold",
    color: '#5D6770'
  },
  currencyTextCash:{
    fontSize:hp('2%'),
    fontFamily: "Roboto-bold",
    fontWeight:'bold',
    color: '#5D6770'
  },
  currencyTextCashLandscape:{
    fontSize:hp('2%'),
    fontFamily: "Roboto-bold",
    fontWeight:"bold",
    marginLeft: moderateScale(8,0.8),
    color: '#5D6770'
  },
  currencyTextMore:{
    fontSize:hp('2%'),
    fontFamily: "Roboto-bold",
    fontWeight:'bold',
    marginRight:moderateScale(6.5),
    color: '#5D6770'
  },
  currencyTextMoreLandscape:{
    fontSize:hp('2%'),
    fontFamily: "Roboto-bold",
    fontWeight:"bold",
    marginRight: moderateScale(10,0.8),
    color: '#5D6770'
  },
  //Ammount
  amountContainer:{//10.16
    height: hp('9.38%'),
    width:wp('94%'),    
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:moderateScale(20),
    justifyContent:'space-between',
    margin:moderateScale(7)
  },
  amountContainerLandscape:{
    height:hp('10.68%'),
    width:wp('59.47%'),
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:moderateScale(16),
    justifyContent:'space-between',
    marginLeft: wp('1.95%'),
    marginTop:hp('1.69%'),
    marginBottom:hp('1.69%')
  },
  amountText1:{
    fontSize: hp('3%'),
    fontFamily: "Roboto-Medium",
    color: '#52565F',
    fontWeight:'bold',
  },
  amountText1Landscape:{
    fontSize: hp('3%'),
    fontFamily: "Roboto-Medium",
    color: '#52565F',
    fontWeight:'bold',
  },
  amountText2:{
    fontSize: hp('3%'),
    fontFamily: "Roboto-Medium",
    fontWeight:'bold',
    color: '#52565F'
  },
  amountText2Landscape:{
    fontSize: hp('3%'),
    fontFamily: "Roboto-Medium",
    color: '#52565F',
    fontWeight:'bold',
  },
  //NumbPad
  numberPadContainerTop:{
    flexDirection:'row',
    width:wp('96%'),
    justifyContent:'space-between',
    borderColor:'blue'
  },
  numberPadContainerTopLandscape:{
    flexDirection:'row',
    width:wp('35.66%'),
    marginLeft:wp('1%')
  },
  numberPadContainerBottom:{    
    flexDirection:'row',
    width:wp('96%'),
    justifyContent:'space-between',
    borderColor:'green'
  },
  numberPadContainerBottomLandscape:{
    flexDirection:'row',
    width:wp('35.66%'),
    marginLeft:wp('1%'),
    marginTop:-hp('0.5%')
  },
  numberPadContainerColumn:{
    flexDirection:'column'
  },
  numberPadContainerColumn2:{
    flexDirection:'column',
    width: wp('23.78%')
  },
  numberPadContainerColumnLandscape:{
    flexDirection:'column',
    width:wp('15.13%')
  },
  numberContainerSingle:{
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('11.72%'),
    width: wp('22.78%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2
  },
  numberContainerSingleC:{
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('11.72%'),
    width: wp('22.78%')
  },
  numberContainerSingleLandscape:{
    alignItems: 'center',
    justifyContent: 'center',
    margin:moderateScale(2,0.01),
    height:hp('13.67%'),
    width: wp('13.96%')
  },
  numberContainerSingleCLandscape:{
    alignItems: 'center',
    justifyContent: 'center',
    margin:moderateScale(2,0.01),
    height:hp('13.67%'),
    width: wp('13.96%')
  },
  numberContainerSingle2:{    
    justifyContent: 'center',    
    height: hp('11.72%'),
    width: wp('47.5%')
  },
  numberContainerSingle2Landscape:{    
    justifyContent: 'center',    
    height:hp('13.67%'),
    marginTop: verticalScale(3,2),
    width:wp('29.2%')
  },
  numberContainerArrow:{
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('23.44%'),
    width: wp('22.78%'),
    paddingBottom:moderateScale(2.5)
  },
  numberContainerArrowLandscape:{
    alignItems: 'center',
    justifyContent: 'center',
    height:hp('28.26%'),
    width: wp('13.96%')
  },
  numberContainerPlus:{
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('23.44%'),
    width: wp('22.78%'),
    paddingRight:moderateScale(4)
    },
  numberContainerPlusLandscape:{
    alignItems: 'center',
    justifyContent: 'center',
    height:hp('28.26%'),
    width: wp('13.96%')
  },  
  numberPadText:{
    fontSize: hp('4%'),
    fontFamily: "Roboto-bold",
    fontWeight: 'bold',
    marginRight: moderateScale(7,1.1),
    marginBottom: verticalScale(10),
    width: moderateScale(20),
    color: '#666666'
  },
  numberPadTextLandscape:{
    fontSize: hp('4%'),
    fontFamily: "Roboto-bold",
    fontWeight: 'bold',
    color: '#666666',
    justifyContent:'center',
    textAlign:'center',
  },
  numberPadText2:{
    fontSize: hp('4%'),
    fontFamily: "Roboto-bold",
    fontWeight: 'bold',
    width: moderateScale(20),
    marginBottom: verticalScale(8),
    color: '#666666'
  },
  numberPadText2Landscape:{
    fontSize: hp('4%'),
    fontFamily: "Roboto-bold",
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
    color: '#666666'
  },
  //Numpad Highlight
  numpadHighlight: {
    paddingRight:moderateScale(22),
    paddingLeft:moderateScale(33),
    paddingBottom:verticalScale(15),
    paddingTop: verticalScale(26),
    borderRadius: moderateScale(12)
  },
  numpadHighlightLandscape: {
    borderRadius: moderateScale(12),
    height:hp('13.67%'),
    width: wp('13.96%'),
    justifyContent:'center',
    alignItems:'center'
  },
  numpadHighlightArrow: {
   
  },
  numpadHighlightArrowLandscape: {
    borderRadius:moderateScale(12),
    height:hp('25.26%'),
    width: wp('13.96%'),
    justifyContent:'center',
    alignItems:'center'
  },
  numpadHighlight0: {
    paddingRight:moderateScale(48,0.01), 
    paddingLeft:moderateScale(75,1), 
    paddingBottom:verticalScale(19), 
    paddingTop:verticalScale(23),
    borderRadius:moderateScale(12)
  },
  numpadHighlight0Landscape: {
    justifyContent:'center',
    alignItems:'center',
    width:'98%',
    height:'100%',
    marginBottom:'2%',
    borderRadius:20
  },
  numpadHighlightPlus: {
    paddingRight:moderateScale(22),
    paddingVertical:moderateScale(60,0.06),
    borderRadius:12
  },
  numpadHighlightPlusLandscape: {
    height:hp('28.26%'),
    width: wp('13.96%'),
    borderRadius:12,
    justifyContent:'center',
    alignItems:'center'
  },
  //Button
  buttonContainer:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    marginTop: 5,
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: '#fff',
    elevation:5,
    width:'85%'
  },
  buttonTextContainer: {
    padding: 10,
  },
  buttonText: {
    fontSize:moderateScale(15),
    color: '#174285',
    fontFamily: 'Roboto-Medium',
  },
  buttonTextLandscape: {
    fontSize:moderateScale(10),
    color: '#174285',
    fontFamily: 'Roboto-Medium',
  },
  buttonTextWhite: {
    fontSize:moderateScale(15),
    color: '#FFF',
    fontFamily: 'Roboto-Medium',
  },
  buttonTextWhiteLandscape: {
    fontSize:moderateScale(10),
    color: '#FFF',
    fontFamily: 'Roboto-Medium',
  },
  drawerContainer: {
    flexDirection:'column',
    height:'100%',    
    justifyContent:'center',
    backgroundColor:'#333333',
    elevation:30
  },
  //DrawerItems
  drawerItem:{
    flexDirection:'row',
    alignItems:'center',
    marginVertical:10,
  },
  drawerItemLandscape:{
    width:"75%",
    flexDirection:'row',
    alignItems:'center',
    marginVertical:moderateScale(1,5),
  },
  drawerItemText:{
    marginVertical:10,
  },
  drawerText:{
    fontSize:hp('2.8%'),
    color:'#999999',
    fontFamily: "Roboto-Medium",
    marginLeft: moderateScale(7),
  },
  drawerTextLandscape:{
    fontSize:moderateScale(12,0.3),
    color:'white',
    fontFamily: "Roboto-Medium",
    marginLeft: moderateScale(7),
  },
  drawerIcon:{
    height:wp('7.5%'),
    width:wp('7.5%'),
    marginHorizontal:10,
    resizeMode: 'contain'
  },
  drawerIconLandscape:{
    height:hp('5.13%'),
    width:hp('5.13%'),
    marginHorizontal:10,
    resizeMode: 'contain'
  },
  savedIcon:{
    height: hp('3.91%'),
    width: wp('6.94%'),  
    resizeMode: 'contain'
  },

  // DRAWER ICON CART
  drawerRightIcon:{
    //backgroundColor:'green',
    width:wp('9.5%'),
    height:hp('6.5%'),
    resizeMode: 'contain',
    //justifyContent:'center',
    alignItems:'flex-start',
  },
  drawerRightIconLandscape:{
    //backgroundColor:'green',
    width:wp('3.5%'),
    height:hp('4.5%'),
    resizeMode: 'contain',
    //justifyContent:'center',
    alignItems:'flex-end',
  },
  //Main
  mainBackgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  // DISCOUNT MODAL CONTAINER
  modalDiscountContainer: {
    //backgroundColor: rgba(0,0,0,0.6),
    backgroundColor: 'rgba(47, 49, 51, 0.6)',
    flex: 1,
    //paddingVertical: Dimensions.get('window').height/3,
    //paddingHorizontal: Dimensions.get('window').width/10,
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    justifyContent:'center',
  },

  modalDiscountBoxTop: {
    backgroundColor: 'white',
    height: hp('7.66%'),
    flexDirection: 'row',
    justifyContent: 'center',
    //alignItems: 'center',
    borderTopLeftRadius: moderateScale(2),
    borderTopRightRadius: moderateScale(2),
  },
  modalDiscountBoxTopLandscape: {
    backgroundColor: 'white',
    height: hp('8.2%'),
    flexDirection: 'row',
    justifyContent: 'center',
    //alignItems: 'center',
    borderTopLeftRadius: moderateScale(8),
    borderTopRightRadius: moderateScale(8),
  },

  modalDiscountBoxBottom: {
    backgroundColor: 'white',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:'#b3b2b2',
    borderTopColor: '#979797',
    borderTopWidth:hp('0.29%'),
    borderBottomLeftRadius: moderateScale(2),
    borderBottomRightRadius: moderateScale(2),
    elevation: moderateScale(10)
  },
  modalDiscountBoxBottomLandscape: {
    backgroundColor: 'white',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:'#b3b2b2',
    borderTopColor: '#979797',
    borderTopWidth: hp('0.29%'),
    borderBottomLeftRadius: moderateScale(9),
    borderBottomRightRadius: moderateScale(9),
    elevation: moderateScale(10)
  },

  modalDiscountDescriptionPortrait: {
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    marginTop: hp('1.75%'),
    color:'#47525D',
    fontSize: hp('3.4%'),
  },
  modalDiscountDescriptionLandscape: {
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    marginTop: hp('1.9%'),
    color:'#47525D',
    fontSize:hp('3.6%'),
  },

  modalDiscountAccept: {
    fontSize: 15,
    color: '#174285',
    fontWeight: 'bold',
    fontFamily: 'Roboto-Medium',
  },

  textInputModal: {
    width:wp('69.1%'),
    flexDirection: 'row',   
    borderWidth:hp('0.29%'),
    borderColor:'transparent',
    alignItems: 'flex-end'
  },
  textInputModalPortraitTablet: {
    width:wp('50%'),
    flexDirection: 'row',   
    borderWidth:hp('0.30%'),
    borderColor:'transparent',
    alignItems: 'flex-end'
  },
  textInputModalLandscape: {
    width: wp('30%'),
    //backgroundColor:'green',
    flexDirection: 'row',       
    borderWidth:hp('0.345%'),
    borderColor:'transparent',
    alignItems: 'flex-end'
  },
  
  inputCoin:{
    alignItems: 'center'
  },
  backgroundImage: {
    position: 'absolute',
    width:'100%',
    height:'100%',
  },
  backgroundImageLandscape: {
    position: 'absolute',
    width:'100%',
    height:'100%',
  },
  //Buttons Change
  buttonCancel: {
    marginHorizontal:5, 
    width: moderateScale(85,0.5),
    alignItems: 'center',
    borderRadius: 5, 
    backgroundColor:'#FFF',
    borderColor:'#174285',
    borderWidth:1
  },
  buttonCancelLandscape: {
    marginHorizontal:5, 
    width: moderateScale(50,0.5),
    alignItems: 'center',
    borderRadius: 5, 
    backgroundColor:'#FFF',
    borderColor:'#174285',
    borderWidth:1
  },
  buttonSave: {
    marginHorizontal:5,
    width: moderateScale(85,0.5),
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor:'#174285',
    padding:1
  },
  buttonSaveLandscape: {
    marginHorizontal:5,
    width: moderateScale(50,0.5),
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor:'#174285',
    padding:1
  },
  iconsDrawerLeft: {
    width:moderateScale(30),
    height:moderateScale(30)
  },
  iconsDrawerLeftLandscape: {
    width:moderateScale(20),
    height:moderateScale(20)
  },
  companyNameDrawerLeft: {
    color:'white',
    fontSize: hp('2.50%'),
    fontFamily:'roboto-bold',
    fontWeight:'bold',
    marginTop:hp('0.73%')
  },
  companyNameDrawerLeftLandscape: {
    color:'white',
    fontSize: hp('2.81%'),
    fontFamily:'roboto-bold',
    fontWeight:'bold',
    marginTop:hp('0.63%')
  },
  usernameDrawerLeft: {
    color:'white',
    fontSize:hp('2.50%'),
    fontFamily:'roboto-medium'
  },
  usernameDrawerLeftLandscape: {
    color:'white',
    fontSize:moderateScale(12,0.3),
    fontFamily:'roboto-medium'
  },
  logoDrawerLeft: {
    width:moderateScale(150,0.06),
    height:55
  },
  logoDrawerLeftLandscape: {
    width:moderateScale(90,0.4),
    height:moderateScale(30,0.4)
  },
  warningText:{
    color:'red',
    fontSize:moderateScale(11, 0.2),
    fontFamily:'roboto-medium',
    marginBottom:2
  },

  touchableModalDiscountAdd:{
    width: wp('50%'),
    height: hp('6.25%'),
    elevation: moderateScale(3),
    borderRadius: 50,
  },
  touchableModalDiscountAddPortraitTablet:{
    width: wp('36%'),
    height: hp('6.25%'),
    elevation: moderateScale(2),
    borderRadius: 50,
  },
  touchableModalDiscountAddLandscape:{
    width: wp('26%'),
    height: hp('7.8%'),
    elevation: moderateScale(2),
    borderRadius: 50,
  },

  imageDiscountModalClosePortrait:{
    width:wp('3.9%'), 
    height: hp('3.9%'), 
    resizeMode: 'contain', 
    marginTop:hp('1.4%'), 
    marginRight: wp('2.7%')
  },
  imageDiscountModalClosePortraitTablet:{
    width:wp('3.3%'), 
    height: hp('3.3%'), 
    resizeMode: 'contain', 
    marginTop:hp('1.4%'), 
    marginRight: wp('2.7%')
  },
  imageDiscountModalCloseLandscape:{
    width:wp('2.5%'), 
    height: hp('2.5%'), 
    resizeMode: 'contain', 
    marginTop:hp('2.1%'), 
    marginRight: wp('1.1%')
  },

  // ### ERROR NOTIFICATION EXCLAMATION
  imageDiscountModalErrorPortrait:{
    width:wp('2.6%'), 
    height: hp('2.6%'), 
    resizeMode: 'contain', 
    //paddingBottom:hp('2%'), 
    //paddingLeft: wp('2%')
  },
  imageDiscountModalErrorPortraitTablet:{
    width:wp('3.3%'), 
    height: hp('3.3%'), 
    resizeMode: 'contain', 
    marginTop:hp('1.4%'), 
    marginRight: wp('2.7%')
  },
  imageDiscountModalErrorLandscape:{
    width:wp('1.9%'), 
    height: hp('1.9%'), 
    resizeMode: 'contain', 
    //marginTop:hp('2.1%'), 
    //marginRight: wp('1.1%')
  },

  textDiscountAddButtonPortrait:{
    fontFamily: 'Montserrat-SemiBold', 
    color:'white', 
    fontSize: hp('1.95%'), 
    letterSpacing: 1.33
  },
  textDiscountAddButtonLandscape:{
    fontFamily: 'Montserrat-SemiBold', 
    color:'white', 
    fontSize: hp('2.7%'), 
    letterSpacing: 2.33
  },

  discountModalDiscountInputPortrait:{
    fontFamily: 'Montserrat-Medium',
    fontWeight: '700',
    fontSize: hp('2.05%'),
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('0.4%'),
    position: 'absolute', left: 0, right: 0, bottom: 0
  },
  discountModalDiscountInputLandscape:{
    fontFamily: 'Montserrat-Medium',
    fontWeight: '600',
    fontSize: hp('2.4%'),
    paddingHorizontal: wp('1.9%'),
    paddingBottom: hp('0.8%'),
    position: 'absolute', left: 0, right: 0, bottom: 0
  },

  errorMessagePortrait:{ 
    fontFamily:'Montserrat-Medium', 
    fontSize:hp('1.45%'), 
    color:'#D0021B', 
    width:'100%', 
    paddingTop:hp('0.75%'), 
    paddingLeft:wp('8.9%'), 
  },
  errorMessagePortraitTablet:{ 
    fontFamily:'Montserrat-Medium', 
    fontSize:hp('2%'), 
    color:'#D0021B', 
    width:'100%', 
    paddingTop:hp('0.75%'), 
    paddingLeft:wp('3%'), 
  },
  errorMessageLandscape:{ 
    fontFamily:'Montserrat-Medium', 
    fontSize:hp('1.6%'), 
    color:'#D0021B', 
    width:'100%', 
    paddingTop:hp('0.75%'), 
    paddingLeft:wp('3%'), 
  },

  // DISCOUNT MODAL BOX
  modalBox:{
    height:hp('25%'),
    width:wp('86.6%')
  },
  modalBoxPortraitTablet:{
    height:hp('25%'),
    width:wp('60%')
  },
  modalBoxLandscape:{
    height:hp('27%'),
    width:wp('36%')
  },

  // SUCCES MESSAGE BOX
  successMessageBox:{
    backgroundColor:'white',
    height:hp('27%'),
    width:wp('86.6%'),
    borderRadius:moderateScale(5),
    alignItems:'center'
  },
  successMessageBoxLandscape:{    
    backgroundColor:'white',
    height:hp('25%'),
    width:wp('36%'),
    borderRadius:moderateScale(5),
    alignItems:'center'
  },
  // SUCCES MESSAGE CONTAINER
  successMessageContainer: {
    backgroundColor: 'rgba(47, 49, 51, 0.6)',
    flex: 1,
    //paddingVertical: Dimensions.get('window').height/3,
    //paddingHorizontal: Dimensions.get('window').width/10,
    //flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    justifyContent:'center',
    marginTop:hp('7.5%')
  },
  successMessageContainerLandscape: {
    backgroundColor: 'rgba(47, 49, 51, 0.6)',
    //paddingVertical: Dimensions.get('window').height/3,
    //paddingHorizontal: Dimensions.get('window').width/10,
    //flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    justifyContent:'center',
    marginTop:hp('7.5%')
  },

  // HOLD BUTTON CART
  holdButtonCartPortrait:{
    backgroundColor:'#D8D8D8',
    width:wp('23.5%'), 
    height:hp('6.1%'), 
    borderRadius:hp('0.9%'), 
    justifyContent:'center', 
    alignItems:'center', 
    elevation:moderateScale(1.5)
  },
  holdButtonCartLandscape:{
    backgroundColor:'#D8D8D8',
    width:wp('34.5%'), 
    height:hp('6.3%'), 
    borderRadius:hp('0.9%'), 
    justifyContent:'center', 
    alignItems:'center', 
  },



  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 30
  },
});