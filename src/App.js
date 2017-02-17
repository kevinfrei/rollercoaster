//@flow

import React from 'react';

// My modules
import {FunctionList, FunctionGraph, FunctionState, FunctionEditor, GraphConfiguration} from './ReduxControls';

// Resources
import './App.css';

const App = () => (
    <div className='ColList'>
      <div>
        <FunctionState/>
        <FunctionList/>
        <FunctionEditor/>
      </div>
      <div className='RowList'>
        <FunctionGraph/>
        <GraphConfiguration/>
      </div>
    </div>
  );

export default App;
