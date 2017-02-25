import React from 'react';
import ReactDOM from 'react-dom';

import {DemandUserFunc} from '../UserFunction';
import FunctionViewer from '../FuncViewer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const fn = (id) => {};
  ReactDOM.render(
    <FunctionViewer
      id={1}
      userFunc={DemandUserFunc('x', 1, 2)}
      first={false}
      last={false}
      onEdit={fn}
      onPrev={fn}
      onNext={fn}
      onDel={fn}/>, div);
});
