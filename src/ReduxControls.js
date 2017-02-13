// @flow
// import redux from 'redux';
import {connect} from 'react-redux';

import {FuncGraph} from './FunctionGraph';
import {FuncList, StateDisplay} from './FunctionList';
import {FuncChanger} from './FuncChanger';
import {Actions} from './coasterRedux';

import type {GraphState} from './coasterRedux';

const mapStateToProps = (state:GraphState) => {
  return {
    funcs: state.funcs,
    selected: state.currentEdit
  };
};

const mapDispatchToProps = (dispatch:Function) => {
  return {
    onPrev: (id) => dispatch(Actions.MoveFunction(id, true)),
    onNext: (id) => dispatch(Actions.MoveFunction(id, false)),
    onDel: (id) => dispatch(Actions.DeleteFunction(id)),
    onEdit: (id) => dispatch(Actions.SelectFunction(id)),
    onChange: (id, value) => dispatch(Actions.ChangeDivider(id, value)),
  };
};

export const BoundFuncList = connect(mapStateToProps, mapDispatchToProps)(FuncList);
export const BoundFuncGraph = connect(mapStateToProps)(FuncGraph);

const displayStateToProps = (state:GraphState) => {
  return {
    state: state.displayState
  };
};

export const FunctionState = connect(displayStateToProps)(StateDisplay);

const changerStateToProps = (state:GraphState) => {
  return {
    pos: state.currentEdit,
    func: state.currentEdit < 0 ? 'x' : state.funcs[state.currentEdit].text
  }
};

const changerDispatchToProps = (dispatch:Function) => {
  return {
    onClick: (id:number, expr:string) => dispatch(
      (id >= 0)
        ? Actions.EditFunction(id, expr)
        : Actions.AddFunction(expr))
  };
};

export const FunctionEditor = connect(changerStateToProps, changerDispatchToProps)(FuncChanger);
