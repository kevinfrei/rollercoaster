//@flow

import React, {PropTypes} from 'react';
import {Panel} from 'react-bootstrap';

import {FunctionEditor} from './ReduxControls';
import {FuncDivider} from './FuncDivider';
import {FuncViewer} from './FuncViewer';
import {FuncProblems} from './coasterRedux';

import type {FuncArray} from './UserFunction';
import type {DisplayStateType, FunctionProblem} from './coasterRedux';

type FuncListAttribs = {
  funcs: FuncArray,
  status: DisplayStateType,
  onEdit: (id:number)=>void,
  onPrev: (id:number)=>void,
  onNext: (id:number)=>void,
  onDel: (id:number)=>void,
  onChange: (id:number, value:string|number)=>void,
  selected: number
};

export const FuncList = ({
  funcs, status, onEdit, onPrev, onNext, onDel, onChange, selected
}:FuncListAttribs) => {
  // Should I assert that they're sorted?
  const MapOfFuncs = funcs.map(
    (uf, index) => {
      const header = (
        <FuncDivider pos={index} low={uf.range.low} high={uf.range.high}
          onChange={onChange}/>);
      let btnStyle = (selected === index) ? 'info' : 'default';
      if (status.state !== 'GOOD' && typeof status.message !== 'string') {
        if (status.message.func === index + 1) {
          btnStyle = (status.state === 'WARNING') ? 'warning' : 'danger';
        }
      }
      return (
        <Panel key={index} header={header} bsStyle={btnStyle}>
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
  return (<div>{withEditor}</div>);
};

FuncList.propTypes = {
  funcs: PropTypes.arrayOf(PropTypes.object).isRequired,
  status: PropTypes.object.isRequired,
  selected: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onDel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export const StateDisplay = ({state}:{state:DisplayStateType}) => {
  if (state.state === 'GOOD') {
    return <div/>;
  }
  const color = state.state === 'WARNING' ? '#FF0' : '#F00';
  let msg = state.message;
  const message:string | FunctionProblem = state.message;
  if (typeof message !== 'string') {
    msg = ' in function #' + message.func;
    switch (message.problem) {
      case FuncProblems.UnorderedRange:
        msg += ": the low and high values are out of order.";
        break;
      case FuncProblems.Discontinuous:
        msg += ": the function appears to not be continuous.";
        break;
      case FuncProblems.ParseFailure:
        msg += ": the function doesn't parse properly.";
        break;
      case FuncProblems.EvaluationFail:
        msg += ": the function doesn't evaluate properly";
        break;
      default:
        msg += message.problem;
    }
  }
  return (<div style={{padding:'3pt', backgroundColor:color}}>
    {state.state}: {msg}
  </div>);
};

StateDisplay.propTypes = {
  state: PropTypes.object.isRequired
};
