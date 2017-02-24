// @flow
// import redux from 'redux';
import {connect} from 'react-redux';

import {FuncGraph} from './FuncGraph';
import {GraphSettings} from './GraphSettings';
import {FuncList, StateDisplay} from './FuncList';
import {FuncChanger} from './FuncChanger';
import {Actions} from './coasterRedux';
import {FileDialog} from './FileDialog';

import type {GraphState, CoasterAction} from './coasterRedux';

// This is just a bunch of maps from state to properties and actions to dispatch
// which create the 'stateful' UI components

// Redux is incredibly elegant for letting you build stateless UI pieces,
// then just stitching them together.

export const FunctionList = connect(
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
  (dispatch:(a:CoasterAction)=>void) => ({
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
    selected: state.currentEdit,
    showVector: state.showVector,
    showCart: state.showCart,
    size: state.size
  })
)(FuncGraph);

export const GraphConfiguration = connect(
  // State to Props:
  (state:GraphState) => ({
    scale: state.scale,
    time: state.time,
    running: state.running,
    showVector: state.showVector,
    showCart: state.showCart
  }),
  // Dispatch to Handler Prop
  (dispatch:(a:CoasterAction)=>void) => ({
    onPlay: (play:boolean) => dispatch(play ? Actions.Start() : Actions.Stop()),
    onScaleChange: (value:string) => dispatch(Actions.ChangeScale(value)),
    onShowVector: (show:boolean) => dispatch(Actions.Vector(show)),
    onShowCart: (show:boolean) => dispatch(Actions.Cart(show))
  })
)(GraphSettings);
/*
export FileIO = connect(
  // State to Props
  (state:GraphState) => ({
    cart: state.showCart,
    velocity: state.showVector,
    labels: false, //TODO: Add this as state
    curFuncs: state.funcs
  }),
  //TODO: Dispatch to Handler Props
  (dispatch:(a:CoasterAction)=>void) => ({
    onSave: (cart: boolean, velocity: boolean, labels: boolean) => void,
    onLoad: (funcSet: FuncArray) => void,
  })
)(FileDialog);*/
