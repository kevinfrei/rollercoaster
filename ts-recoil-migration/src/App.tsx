import React from 'react';
import './App.css';
import MathJaxReact from './MathJaxReact';
import FunctionList from './FunctionList.js';
import FunctionState from './FunctionState.js';
import FunctionGraph from './FunctionGraph.js';
import FunctionEditor from './FunctionEditor.js';
import FileDialog from './FileDialog';
import GraphSettings from './GraphSettings';

// Resources
import './App.css';

export default function App(): JSX.Element {
  /*  return (
    <div className="App">
        <MathJaxReact formula="ax^2+bx+c=0" />
    </div>
  );*/
  return (
    <div className="ColList">
      <div id="left">
        <div
          style={{
            padding: '2pt',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >         
          <FunctionEditor /> 
          <FileDialog />
        </div>
        <FunctionList />
        <FunctionState />
      </div>
      <div className="RowList">
        <FunctionGraph />
        <div id="bottom" className="RowList" style={{ alignSelf: 'stretch' }}>
          <GraphSettings />
        </div>
      </div>
    </div>
  );
}
