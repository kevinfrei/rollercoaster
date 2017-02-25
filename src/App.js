//@flow

import React from 'react';

import FunctionList from './FuncList';
import FunctionState from './FuncState';
import FunctionGraph from './FuncGraph';

import GraphSettings from './GraphSettings';

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
        <GraphSettings />
      </div>
    </div>
  </div>
);

export default App;
