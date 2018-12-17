import * as screenNames from "../screen_names";
import {createStackNavigator, createAppContainer} from 'react-navigation';

// SCREENS
import Login from "../../features/login";
import CreateAccount from "../../features/create_account";
import ForgotPassword from "../../features/forgot_password";
import cashScreen from "../../features/cash_register/cashScreen"
import cashDetails from "../../features/cash_details/cashDetails"

const AppNavigator = createStackNavigator({
  [screenNames.LOGIN]: {
    screen: Login
  },
  [screenNames.CREATE_ACCOUNT]: {
    screen: CreateAccount,
  },
  [screenNames.FORGOT_PASSWORD]: {
    screen: ForgotPassword,
  },
  [screenNames.CASH_REGISTER]: {
    screen: cashScreen,
  },
  [screenNames.CASH_DETAILS]: {
    screen: cashDetails,
  }
}, {
  initialRouteName: screenNames.CASH_REGISTER
});


export default createAppContainer(AppNavigator);
