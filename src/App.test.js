import React from 'react';
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme';

import App from './App';
import {createStore} from 'redux';
import {CoasterReducer} from './coasterRedux';
import {Provider} from 'react-redux';

it('renders without crashing', () => {
  shallow(<App/>);
});
