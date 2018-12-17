// // @flow

 //import React, { Component } from "react";
 //import { View, TextView } from "react-native";
// import { Provider } from "react-redux";
// import Layout from "./components/layout";
// import ApplicationNavigator from "./navigation/containers";
// import myStore from "./myStore";

// export default class MyApp extends Component {
//   render() {
//     return (
//       <Provider store={myStore}>
//         <Layout>
//           <ApplicationNavigator />
//         </Layout>
//       </Provider>
//     );
//   }
// }


// ==============================================================
// import React from "react";
// import { View, Text } from "react-native";
// import { createStackNavigator, createAppContainer } from "react-navigation";

// class HomeScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//         <Text>Home Screen</Text>
//       </View>
//     );
//   }
// }

// const AppNavigator = createStackNavigator({
//   Home: {
//     screen: HomeScreen
//   }
// });

// const AppContainer = createAppContainer(AppNavigator);

// export default class App extends React.Component {
//   render() {
//     return <AppContainer />;
//   }
// }

import { Provider } from 'react-redux';
import React, {Component} from 'react';
import store from './myStore';
import AppNavigator from './navigation/navigators';


export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}