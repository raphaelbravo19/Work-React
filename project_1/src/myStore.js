import appReducer from './reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'

const store = createStore(
  appReducer,
  applyMiddleware(thunk, logger),
);

export default store;