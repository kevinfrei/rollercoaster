//@flow

import React from 'react';

import {FunctionList, FunctionGraph,
  FunctionState, GraphConfiguration} from './ReduxControls';

// Resources
import './App.css';

const App = () => (
    <div className='ColList'>
      <div>
        <FunctionState/>
        <FunctionList/>
      </div>
      <div className='RowList'>
        <FunctionGraph/>
        <GraphConfiguration/>
      </div>
    </div>
  );

export default App;
