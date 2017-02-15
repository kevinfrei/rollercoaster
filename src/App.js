//@flow

import React from 'react';

// My modules
import {BoundFuncList, BoundFuncGraph, FunctionState, FunctionEditor} from './ReduxControls';

// Resources
import './App.css';

const App = () => (
    <div className='ColList'>
      <div>
        <FunctionState/>
        <BoundFuncList/>
        <FunctionEditor/>
      </div>
      <div className='RowList'>
        <BoundFuncGraph/>
        <h5>Graph Controls Down Here!</h5>
      </div>
    </div>
  );

export default App;
