import React from 'react';
import ReactDOM from 'react-dom';

import {UnboundFunctionEditor, FunctionEditorHeader} from '../FuncEditor';

it('renders without crashing', () => {
  const div = document.createElement('div');
  for (let pos = -1; pos < 3; pos++) {
    for (let visible = 0; visible < 2; visible++) {
      ReactDOM.render(<UnboundFunctionEditor func={'x^2'} pos={pos}
        visible={visible===1} onAddClick={() => {}} onClose={() => {}}
        onSave={() => {}}/>, div);
    }
  }
});
