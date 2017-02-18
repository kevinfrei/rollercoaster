import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import {createStore} from 'redux';
import {CoasterReducer, Actions} from './coasterRedux';
import {Provider} from 'react-redux';

const store = createStore(CoasterReducer);
const timer = () => {
  store.dispatch(Actions.Tick());
};
//let interval:Object;
ReactDOM.render(
  (<Provider store={store}><App /></Provider>),
  document.getElementById('root')
);
/*interval =*/ window.setInterval(timer, 1000/32);
