import React from 'react';
import ReactDOM from 'react-dom';
import {FuncChanger} from './FuncChanger';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <FuncChanger pos={1} func='x' onClear={()=>{}} onSave={(a,b)=>{}}/>, div);
});
