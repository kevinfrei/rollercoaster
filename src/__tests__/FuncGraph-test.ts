import React from 'react';
import ReactDOM from 'react-dom';

import {UnboundFunctionGraph} from '../FuncGraph';
import {DemandUserFunc} from '../UserFunction';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const funcs = [ DemandUserFunc('x', 0, 1) ];
  try {
  ReactDOM.render(
    <UnboundFunctionGraph
      funcs={funcs} selected={0} showVector={false} showCart={false}
      showLabels={true} scale={20} time={0} size={{width:-1,height:-1}}/>, div);
  } catch (e){
    if (e !== 'testOnly')
      throw e;
  }
});
