import React, { Component } from "react";
import { View, TextInput, Text, Animated, Platform } from "react-native";
import { Colors } from "api";
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextMontserrat} from "components";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import normalize from "./../utilities/helpers/normalizeText";
import EStyleSheet from 'react-native-extended-stylesheet';

/**
 * Example of input with errors and validation
  <FloatingTextInput
      label={'E-mail'}
      errors={['Enter a valid E-mail address']}
  />
  <FloatingTextInput
      label={'Password'}
      secureTextEntry={true}
      validate={{
          title: 'Password must contain',
          validations: [
              {
                  name: '5 Characters',
                  validateInput: (val) => {
                      return val.length > 5;
                  }
              },
              {
                  name: '1 Number',
                  validateInput: (val) => {
                      return /\d/.test(val);
                    }
              },
              {
                  name: '1 Special Character',
                  validateInput: (val) => {
                      return /\W+/.test(val);
                    }
              }
          ]
      }}
  />
 */

class FloatingTextInput extends Component {

  state = {
    isFocused: false,
    value: this.props.value ? `${this.props.value}` : "",
    secureTextEntry: this.props.secureTextEntry,
    isPassword: this.props.secureTextEntry,
    errors: this.props.errors || [],
    validate: this.props.validate
  };

  componentWillMount() {
    this._animatedIsFocusedAndEmpty = new Animated.Value(
      this.state.value === "" ? 0 : 1
    );
    this._animatedIsFocused = new Animated.Value(0);
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocusedAndEmpty, {
      toValue: this.state.isFocused || this.state.value !== "" ? 1 : 0,
      duration: 200
    }).start();

    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused ? 1 : 0,
      duration: 100
    }).start();
  }

  iconPressHandler = () => {
    if (this.state.isPassword) {
      this.setState({
        secureTextEntry: !this.state.secureTextEntry
      });
      return;
    }
    this.setState({ value: "" });
  };

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => {
    this.setState({ isFocused: false });
  };

  renderValidation = () => {
    const {validate: {title, validations}} = this.props;
    const textStyle = {
      fontWeight: '600',
      fontSize: EStyleSheet.value('1.2rem'),
      color: '#6b6b6b'
    }
    return (
      <View style={{flexDirection: 'row'}}>
        <TextMontserrat style={textStyle}>{title} - </TextMontserrat>
        <View>
          {validations.map((validation, i) => {
            const passed = validation.validateInput(this.state.value);
            const statusColor = passed ? '#00c38a' : '#787878';
            return (
              <View key={`validation_${i}`} style={{flexDirection: 'row', alignItems: 'center', left: 3}}>
                <IconMaterialCommunityIcons name='check-circle' color={statusColor}/>
                <TextMontserrat style={{...textStyle, color: statusColor}}> {validation.name}</TextMontserrat>
              </View>
            )
          })}

        </View>
      </View>
    )
  }

  renderIcon = () => {
    if (this.state.isPassword) {
      const icon = this.state.secureTextEntry ? "eye-off" : "eye";
      return (
        <IconMaterialCommunityIcons
          style={[styles.iconStyle, this.props.iconStyle]}
          name={icon}
          size={24}
          color="#666"
          onPress={this.iconPressHandler}
        />
      );
    } else {
      if (this.state.isFocused) {
        return (
          <IconMaterialIcons
            style={styles.iconStyle}
            name={"cancel"}
            size={24}
            color="#666"
            onPress={this.iconPressHandler}
          />
        );
      }
    }
  };

  _changeText = v => {
    const { decimals } = this.props;
    if (decimals) {
      //   v = v.toFixed(decimals);
    }
    this.setState({ value: v });
    // this.props.onChangeText(v);
  };

  _hasError = () => {
    return this.state.errors.length > 0;
  }

  render() {
    const leftPadding = this.props.lineLeft ? 10 : 0;

    const { isFocused, value, secureTextEntry } = this.state;
    const { label, underline, inputStyle, keyboardType } = this.props;

    const inputActiveColor = this._hasError() ? Colors.danger : Colors.primary;
    const inputInActiveColor = this._hasError() ? Colors.danger : "#6b6b6b";
    const ExtendedStyles = EStyleSheet.create({
      labelDown: {
        fontSize: '1.6rem'
      },
      labelUp: {
        fontSize: '1.2rem'
      },
      labelOptionalDown: {
        fontSize: '1.3rem'
      },
      labelOptionalUp: {
        fontSize: '1.0rem'
      },
      underline: {
        height: '.2rem',
      },
      textInput: {
        fontSize: '1.4rem'
      },
      errorText: {
        fontSize: '1.3rem'
      },
      '@media (min-width: 500)' : {
        textInput: {
          fontSize: '1.6rem'
        },
      }
    })

    const textInputStyle = {
      fontSize: ExtendedStyles.textInput.fontSize,
      color: isFocused ? inputActiveColor : inputInActiveColor,
      height: EStyleSheet.value('4rem'),
      marginTop: this.props.margin || 20,
      fontFamily: "Montserrat-SemiBold",
      width: "80%"
    };

    const leftOffset = Platform.OS === 'ios' ? 0 : 0;
    
    const labelStyle = {
      position: "absolute",
      fontFamily: 'Montserrat-SemiBold',
      left: leftOffset + leftPadding,
      top: this._animatedIsFocusedAndEmpty.interpolate({
        inputRange: [0, 1],
        outputRange: [28, 5]
      }),
      fontSize: this._animatedIsFocusedAndEmpty.interpolate({
        inputRange: [0, 1],
        outputRange: [ExtendedStyles.labelDown.fontSize, ExtendedStyles.labelUp.fontSize]
      }),
      color: "#6b6b6b",
      ...this.props.labelStyle
    };
    optionalLabelStyle = {
      fontSize: this._animatedIsFocusedAndEmpty.interpolate({
        inputRange: [0, 1],
        outputRange: [ExtendedStyles.labelOptionalDown.fontSize, ExtendedStyles.labelOptionalUp.fontSize]
      })
    };
    const underlineStyle = {
      left: leftOffset,
      backgroundColor: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#eee', inputActiveColor]
      }),
      height: ExtendedStyles.underline.height,
      width: "100%",
      marginBottom: 3
    };

    renderUnderline = () => {
      if (underline != false) {
        return <Animated.View style={underlineStyle} />;
      }
    };

    return (
      <View>
        <Animated.Text style={labelStyle}>
          {label}{" "}{this._hasError() && <IconMaterialCommunityIcons size={18} name="alert-circle" color={inputActiveColor}/>}
          <Animated.Text style={optionalLabelStyle}>
            {this.props.labelOptional ? this.props.labelOptional : ""}
          </Animated.Text>
        </Animated.Text>
        <View>
          {this.renderIcon()}
          {this.props.lineLeft && <View style={{
            width: 1, 
            height: 35, 
            backgroundColor: this.state.isFocused ? inputActiveColor : '#eee',
            position: "absolute",
            bottom: 0
            }}/>}
          <TextInput
            style={[textInputStyle, inputStyle, {paddingLeft: leftPadding }]}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={value}
            onChangeText={v => this._changeText(v)}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            underlineColorAndroid="transparent"
          />
        </View>
        {renderUnderline()}
        {this.state.errors.map((error, i) => {
          return (<TextMontserrat key={`err_${i}`} style={{
            fontWeight: '600',
            color: inputActiveColor,
            left: leftOffset,
            fontSize: ExtendedStyles.errorText.fontSize
          }}>{error}</TextMontserrat>)
        })}
        {!!this.props.validate && this.state.isFocused && this.renderValidation()}
      </View>
    );
  }
}
const styles = {
  iconStyle: {
    position: "absolute",
    right: 5,
    top: "50%",
    zIndex: 50
  }
};
export default FloatingTextInput;
