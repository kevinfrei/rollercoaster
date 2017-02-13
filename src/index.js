import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import {createStore} from 'redux';
import {CoasterReducer} from './coasterRedux';
import {Provider} from 'react-redux';

const store = createStore(CoasterReducer);

ReactDOM.render(
  (<div><Provider store={store}><App /></Provider></div>),
  document.getElementById('root')
);
