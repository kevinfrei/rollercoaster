import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import {createStore} from 'redux';
import {CoasterReducer, Actions} from './coasterRedux';
import {Provider} from 'react-redux';

import type {GraphState} from './coasterRedux';

const store = createStore(CoasterReducer);
const timer = () => {
  const state:GraphState = store.getState();
  if (state.running)
    store.dispatch(Actions.Tick());
};
// Click every 60th of a second...
window.setInterval(timer, 1000/60);
const canvasResize = () => {
  store.dispatch(Actions.WindowResize(window.innerWidth, window.innerHeight));
};
window.addEventListener('resize', canvasResize, false);
canvasResize();
ReactDOM.render(
  (<Provider store={store}><App /></Provider>),
  document.getElementById('root')
);
