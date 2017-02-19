import React from 'react';
import ReactDOM from 'react-dom';
import {FuncDivider} from './FuncDivider';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <FuncDivider pos={1} low={0} high={1} onChange={(a,b)=>{}}/>, div);
});
