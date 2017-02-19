import React from 'react';
import ReactDOM from 'react-dom';
import {FuncGraph} from './FunctionGraph';
import {DemandUserFunc} from './UserFunction';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const funcs = [ DemandUserFunc('x', 0, 1) ];
  ReactDOM.render(
    <FuncGraph funcs={funcs} selected={0} scale={20} time={0}/>, div);
});
