import React from 'react';
import ReactDOM from 'react-dom';

import {UnboundFunctionEditor, FunctionEditorHeader} from '../FuncEditor';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FunctionEditorHeader add={true} pos={0}/>, div);
  ReactDOM.render(<FunctionEditorHeader add={true} pos={1}/>, div);
  ReactDOM.render(<FunctionEditorHeader add={false} pos={0}/>, div);
  ReactDOM.render(<FunctionEditorHeader add={false} pos={1}/>, div);
  ReactDOM.render(
    <UnboundFunctionEditor
       pos={1} func='x' onClear={()=>{}} onSave={(a,b)=>{}}/>, div);

});
