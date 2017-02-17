// @flow
// import redux from 'redux';
import {connect} from 'react-redux';

import {FuncGraph, GraphSettings} from './FunctionGraph';
import {FuncList, StateDisplay} from './FunctionList';
import {FuncChanger} from './FuncChanger';
import {Actions} from './coasterRedux';

import type {GraphState} from './coasterRedux';

// This is just a bunch of maps from state to properties and actions to dispatch
// which create the 'stateful' UI components

// Redux is incredibly elegant for letting you build stateless UI pieces,
// then just stitching them together.

export const FunctionList = connect(
  // State to Props
  (state:GraphState) => ({
    funcs: state.funcs,
    selected: state.currentEdit
  }),
  // Dispatch To Handler Props
  (dispatch:Function) => ({
    onPrev: (id) => dispatch(Actions.MoveFunction(id, true)),
    onNext: (id) => dispatch(Actions.MoveFunction(id, false)),
    onDel: (id) => dispatch(Actions.DeleteFunction(id)),
    onEdit: (id) => dispatch(Actions.SelectFunction(id)),
    onChange: (id, value) => dispatch(Actions.ChangeDivider(id, value))
  })
)(FuncList);

export const FunctionState = connect(
  // State to Props
  (state:GraphState) => ({ state: state.displayState})
)(StateDisplay);

export const FunctionEditor = connect(
  // State to Props
  (state:GraphState) => ({
    pos: state.currentEdit,
    func: (state.currentEdit < 0) ? '' : String(state.funcs[state.currentEdit].text)
  }),
  // Dispatch to Handler Props
  (dispatch:Function) => ({
    onSave: (id:number, expr:string) => dispatch(
      (id >= 0)
        ? Actions.EditFunction(id, expr)
        : Actions.AddFunction(expr)),
    onClear: () => dispatch(Actions.ClearEditor())
  })
)(FuncChanger);

export const FunctionGraph = connect(
  // State to Props
  (state:GraphState) => ({
    scale: state.scale,
    funcs: state.funcs,
    time: state.time,
    selected: state.currentEdit
  })
)(FuncGraph);

export const GraphConfiguration = connect(
  // State to Props:
  (state:GraphState) => ({
    scale: state.scale,
    time: state.time,
    running: state.running
  }),
  // Dispatch to Handler Prop
  (dispatch:Function) => ({
    onPlay: (play:boolean) => dispatch(play ? Actions.Start() : Actions.Stop()),
    onScaleChange: (value:string) => dispatch(Actions.ChangeScale(value))
  })
)(GraphSettings);
