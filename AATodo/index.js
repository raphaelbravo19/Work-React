import React, {Component} from 'react';

import {AppRegistry} from 'react-native';


import { Provider } from 'react-redux';
import { createStore, applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise';

import {name as appName} from './app.json';
import App from './App';

import {reducer} from './src/Store/reducers'

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(createStore)

const appRedux = () => (
    <Provider store={createStoreWithMiddleware(reducer)}>
        <App/>
    </Provider>
)


AppRegistry.registerComponent(appName, () => appRedux);
