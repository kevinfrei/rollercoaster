import React from 'react';
import ReactDOM from 'react-dom';

import {FuncGraph} from '../FuncGraph';
import {DemandUserFunc} from '../UserFunction';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const funcs = [ DemandUserFunc('x', 0, 1) ];
  try {
  ReactDOM.render(
    <FuncGraph funcs={funcs} selected={0}
      scale={20} time={0} size={{width:-1,height:-1}}/>, div);
  } catch (e){
    if (e !== 'testOnly')
      throw e;
  }
});
