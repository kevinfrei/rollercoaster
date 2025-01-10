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
        padding:'2pt',
        display:'flex',
        justifyContent:'space-around'}}>
        <FunctionEditor/>
        <FileDialog/>
      </div>
      <FunctionList/>
      <FunctionState/>
      <div style={{textAlign:'center', margin:'5pt'}}>
        If the formulas don't look right,<br/>
        try <MathJaxFixer>clicking here</MathJaxFixer> to redraw them.
      </div>
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
