//@flow

import React from 'react';
import {Panel} from 'react-bootstrap';

import {FunctionEditor} from './ReduxControls';
import {FuncDivider} from './FuncDivider';
import {FuncViewer} from './FuncViewer';

import type {FuncArray} from './UserFunction';
import type {DisplayStateType} from './coasterRedux';

type FuncListAttribs = {
  funcs: FuncArray,
  onEdit: (id:number)=>void,
  onPrev: (id:number)=>void,
  onNext: (id:number)=>void,
  onDel: (id:number)=>void,
  onChange: (id:number, value:string|number)=>void,
  selected: number
};

export const FuncList = ({
  funcs, onEdit, onPrev, onNext, onDel, onChange, selected
}:FuncListAttribs) => {
  // Should I assert that they're sorted?
  const MapOfFuncs = funcs.map(
    (uf, index) => {
      const header = (
        <FuncDivider pos={index} low={uf.range.low} high={uf.range.high}
          onChange={onChange}/>);
      return (
        <Panel key={index} header={header} bsStyle={(selected === index) ?'info':'default'}>
          <FuncViewer
            id={index}
            first={index===0}
            last={index===funcs.length-1}
            userFunc={uf}
            onNext={onNext}
            onPrev={onPrev}
            onEdit={onEdit}
            onDel={onDel}/>
        </Panel>
      );
  });
  const withEditor = [...MapOfFuncs, <FunctionEditor key='TheEditor'/>];
  return (
    <div>
      {withEditor}
    </div>
  );
};

export const StateDisplay = ({state}:{state:DisplayStateType}) => {
  if (state.state === 'GOOD') {
    return <div/>;
  }
  const color = state.state === 'WARNING' ? '#FF0' : '#F00';
  return (<div style={{padding:'3pt', backgroundColor:color}}>
    {state.state}: {state.message}
  </div>);
};
