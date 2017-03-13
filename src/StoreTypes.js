// @flow
import {DemandUserFunc} from './UserFunction';

import type {CoasterAction} from './Actions';
import type {FuncArray} from './UserFunction';

// My 'user state':

// A list of UserFunctions
// Are those functions good to graph?
// An optional 'selected' user function for editing

// Knowne fu

export type FunctionProblem = {
  func: number,
  problem: string|number
};

export type DisplayStateType = {
  state: 'ERROR' | 'WARNING' | 'GOOD',
  message: string | FunctionProblem;
};

export type GraphState = {
  funcs: FuncArray,
  displayState: DisplayStateType,
  editorOpen: boolean,
  currentEdit: number,
  scale: number,
  startTime: number,
  millisec: number,
  running: boolean,
  showLabels: boolean,
  showVector: boolean,
  showCart: boolean,
  size: {width:number, height:number}
};

export const MakeStateError =
  (message:string|FunctionProblem): DisplayStateType => ({
    state: 'ERROR', message});

export const MakeStateWarning =
  (message:string|FunctionProblem): DisplayStateType => ({
    state: 'WARNING', message});

export const MakeStateGood =
  (message:string = ''): DisplayStateType => ({
    state: 'GOOD', message});

export const initialState:GraphState = {
  funcs: [
    DemandUserFunc('x^2-16x+64', 0, 8),
    DemandUserFunc('sin((pi x)/2-pi/2)+1', 8, 12),
    DemandUserFunc('x^2/2-12x+72',12,20)
  ],
  displayState: MakeStateGood(),
  editorOpen: false,
  currentEdit: -1,
  scale: 25,
  startTime: -1,
  millisec: 0,
  running: false,
  showLabels: true,
  showVector: false,
  showCart: true,
  size: {width: -1, height: -1}
};

export type dispatchType = (action:CoasterAction) => void;
