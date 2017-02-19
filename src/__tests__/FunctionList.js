import React from 'react';
import ReactDOM from 'react-dom';

import {createStore} from 'redux';
import {CoasterReducer} from './coasterRedux';
import {Provider} from 'react-redux';
//import {FuncList, StateDisplay} from './FunctionList';
import {DemandUserFunc} from './UserFunction';

// TODO: This doesn't do anything, because of a problem with using a
// container component

it('renders without crashing', () => {
  const div = document.createElement('div');
  const funcs = [ DemandUserFunc('x', 0, 1) ];
  const fn = (id) => {};
  /*
  ReactDOM.render(<Provider store={createStore(CoasterReducer)}>
    <FuncList
      funcs={funcs}
      onEdit={fn}
      onPrev={fn}
      onNext={fn}
      onDel={fn}
      onChange={(a,b)=>{}}
      selected={0}
    />
  </Provider>, div);
  ReactDOM.render(<StateDisplay/>, div);
  */
});
