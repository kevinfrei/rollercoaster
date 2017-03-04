//@flow

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {FuncProblems} from './Reducers';

import type {
  GraphState,
  DisplayStateType,
  FunctionProblem
} from './StoreTypes';

const UnboundFunctionState = ({state}:{state:DisplayStateType}) => {
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

UnboundFunctionState.propTypes = {
  state: PropTypes.object.isRequired
};

const FunctionState = connect(
  // State to Props
  (state:GraphState) => ({ state: state.displayState })
)(UnboundFunctionState);

export default FunctionState;
