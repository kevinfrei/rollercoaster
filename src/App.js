//@flow

import React from 'react';

import {FunctionList, FunctionGraph,
  FunctionState, GraphConfiguration} from './ReduxControls';

// Resources
import './App.css';

const App = () => (
  <div className='ColList'>
    <div id='left'>
      <FunctionState/>
      <FunctionList/>
    </div>
    <div className='RowList'>
      <FunctionGraph/>
      <div id='bottom' className='RowList' style={{alignSelf:'stretch'}}>
        <GraphConfiguration />
      </div>
    </div>
  </div>
);

export default App;
