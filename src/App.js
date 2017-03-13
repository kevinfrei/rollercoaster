//@flow

import React from 'react';

import FunctionList from './FuncList';
import FunctionState from './FuncState';
import FunctionGraph from './FuncGraph';
import FunctionEditor from './FuncEditor';
import FileDialog from './FileDialog';
import GraphSettings from './GraphSettings';
import {MathJaxFixer} from './MathJaxReact';

// Resources
import './App.css';

const App = () => (
  <div className='ColList'>
    <div id='left'>
      <div style={{
        padding:'1pt',
        display:'flex',
        alignItems:'stretch',
        justifyContent:'space-between'}}>
        <FunctionEditor/>
        <FileDialog/>
        <MathJaxFixer/>
      </div>
      <FunctionList/>
      <FunctionState/>
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
