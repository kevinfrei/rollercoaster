//@flow

import React, {PropTypes} from 'react';
import {Panel} from 'react-bootstrap';
import {connect} from 'react-redux';

import FunctionEditor from './FuncEditor';
import FunctionDivider from './FuncDivider';
import FunctionViewer from './FuncViewer';
import {Actions} from './coasterRedux';

import type {FuncArray} from './UserFunction';
import type {
  GraphState,
  CoasterAction,
  DisplayStateType
} from './coasterRedux';

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

export const UnboundFunctionList = ({
  funcs, status, onEdit, onPrev, onNext, onDel, onChange, selected
}:FuncListAttribs) => {
  // Should I assert that they're sorted?
  const MapOfFuncs = funcs.map(
    (uf, index) => {
      const header = (
        <FunctionDivider pos={index} low={uf.range.low} high={uf.range.high}
          onChange={onChange}/>);
      let btnStyle = (selected === index) ? 'info' : 'default';
      if (status.state !== 'GOOD' && typeof status.message !== 'string') {
        if (status.message.func === index + 1) {
          btnStyle = (status.state === 'WARNING') ? 'warning' : 'danger';
        }
      }
      return (
        <Panel key={index} header={header} bsStyle={btnStyle}>
          <FunctionViewer
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

UnboundFunctionList.propTypes = {
  funcs: PropTypes.arrayOf(PropTypes.object).isRequired,
  status: PropTypes.object.isRequired,
  selected: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onDel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

const FunctionList = connect(
  // State to Props
  (state:GraphState) => ({
    funcs: state.funcs,
    status: state.displayState,
    selected: state.currentEdit
  }),
  // Dispatch To Handler Props
  (dispatch:(a:CoasterAction)=>void) => ({
    onPrev: (id:number) => dispatch(Actions.MoveFunction(id, true)),
    onNext: (id:number) => dispatch(Actions.MoveFunction(id, false)),
    onDel: (id:number) => dispatch(Actions.DeleteFunction(id)),
    onEdit: (id:number) => dispatch(Actions.SelectFunction(id)),
    onChange: (id:number, value:number|string) => dispatch(Actions.ChangeDivider(id, value))
  })
)(UnboundFunctionList);

export default FunctionList;
