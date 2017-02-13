//@flow

import React from 'react';

// My modules
import {BoundFuncList, BoundFuncGraph, FunctionState, FunctionEditor} from './ReduxControls';

// Resources
import './App.css';

const App = () => (
    <div className='ColList'>
      <div>
        <FunctionState key='fs'/>
        <BoundFuncList key='bfl'/>
        <FunctionEditor key='fe'/>
      </div>
      <div className='RowList' key='b'>
        <BoundFuncGraph key='bfg'/>
        <h5 key='e'>Graph Controls Down Here!</h5>
      </div>
    </div>
  );

export default App;
