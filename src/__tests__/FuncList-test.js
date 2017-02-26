import React from 'react';
import ReactDOM from 'react-dom';

import {UnboundFunctionList} from '../FuncList';
import {DemandUserFunc} from '../UserFunction';
import {MakeStateError, MakeStateGood, MakeStateWarning} from '../coasterRedux';

import type {DisplayStateType} from '../coasterRedux';

// TODO: This doesn't do anything, because of a problem with using a
// container component

it('renders without crashing', () => {
  const div = document.createElement('div');
  const funcs = [ DemandUserFunc('x', 0, 1) ];
  const fn = (id) => {};
  const err = MakeStateError('test');
  const wrn = MakeStateWarning('test');
  const gud = MakeStateGood();
  ReactDOM.render(
    <UnboundFunctionList
      funcs={funcs}
      onEdit={fn}
      onPrev={fn}
      onNext={fn}
      onDel={fn}
      status={wrn}
      onChange={(a,b)=>{}}
      selected={0}
      editor={<div>editor</div>}
    />, div);
//  ReactDOM.render(<StateDisplay/>, div);
});
