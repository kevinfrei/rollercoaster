// @flow
import {CopyUserFunc, MakeUserFunc, DemandUserFunc} from './UserFunction';

import type {UserFunction} from './UserFunction';

// My 'user state':

// A list of UserFunctions
// Are those functions good to graph?
// An optional 'selected' user function for editing
//  Eventually:
//    Graph scale
//    Current time
//    Gravity?

export type DisplayStateType = {
  state: 'ERROR' | 'WARNING' | 'GOOD',
  message: string
};

export type GraphState = {
  funcs: Array<UserFunction>,
  displayState: DisplayStateType,
  currentEdit: number,
  scale: number,
  time: number,
  running: boolean
};

type FuncArray = Array<UserFunction>;

// And various messages that it needs to respond to:

// Add a new function
// Delete function
// Edit a function
// Change X divider value
// Move a function up/down

type AddFunctionAction = {
  type: 'ADD_FUNCTION',
  expr: string
};

type DeleteFunctionAction = {
  type: 'DELETE_FUNCTION',
  position: number
};

type EditFunctionAction = {
  type: 'EDIT_FUNCTION',
  position: number,
  funcBody: string
};

type ChangeDividerAction = {
  type: 'CHANGE_LIMIT',
  position: string,
  value: number
};

type MoveFunctionAction = {
  type: 'MOVE_FUNCTION',
  position: number,
  up: boolean
};

type SelectFunctionAction = {
  type: 'SELECT_FUNCTION',
  position: number
};

type ClearEditorAction = {
  type: 'CLEAR_EDITOR'
};

type StartAction = {
  type: 'START_ANIMATION'
};

type StopAction = {
  type: 'STOP_ANIMATION'
};

type ScaleChangeAction = {
  type: 'CHANGE_SCALE',
  value: string
}
export type CoasterAction =
  AddFunctionAction |
  DeleteFunctionAction |
  EditFunctionAction |
  ChangeDividerAction |
  MoveFunctionAction |
  SelectFunctionAction |
  ClearEditorAction |
  StartAction |
  StopAction |
  ScaleChangeAction;

export const Actions = {
  AddFunction: (expr:string):AddFunctionAction => ({
    type: 'ADD_FUNCTION',
    expr
  }),
  DeleteFunction: (position:number):DeleteFunctionAction => ({
    type: 'DELETE_FUNCTION',
    position
  }),
  EditFunction: (position:number, funcBody:string):EditFunctionAction => ({
    type: 'EDIT_FUNCTION',
    position,
    funcBody
  }),
  ChangeDivider: (position:string, value: number):ChangeDividerAction => ({
    type: 'CHANGE_LIMIT',
    position,
    value
  }),
  MoveFunction: (position:number, up:boolean): MoveFunctionAction => ({
    type: 'MOVE_FUNCTION',
    position,
    up
  }),
  SelectFunction: (position:number): SelectFunctionAction => ({
    type: 'SELECT_FUNCTION',
    position
  }),
  ClearEditor: ():ClearEditorAction => ({type: 'CLEAR_EDITOR'}),
  Start: ():StartAction => ({type: 'START_ANIMATION'}),
  Stop: ():StopAction => ({type: 'STOP_ANIMATION'}),
  ChangeScale: (value:string):ScaleChangeAction => ({
    type:'CHANGE_SCALE',
    value
  })
};


const MakeStateError =
  (message:string): DisplayStateType => ({state: 'ERROR', message});
const MakeStateWarning =
  (message:string): DisplayStateType => ({state: 'WARNING', message});
const MakeStateGood =
  (message:string = ''): DisplayStateType => ({state: 'GOOD', message});


const initialState:GraphState = {
  funcs: [DemandUserFunc('Math.cos(x)/(x+.15) + x/3', 0, 20)],
  displayState: MakeStateGood(),
  currentEdit: -1,
  scale: 25,
  time: -1,
  running: false
};

const ValidateFuncs = (funcs:FuncArray):DisplayStateType => {
  let prevHi:?number;
  let prevY:?number;
  // TODO: Check for smoothness of transitions and warn
  for (let func of funcs) {
    try {
      if (func.range.low > func.range.high) {
        return MakeStateError('Low greater than high for function ' + func.text);
      }
      if (prevHi && Math.abs(prevHi - func.range.low) > 1e-6) {
        return MakeStateError('X ranges are not continuous (open an issue on github)');
      }
      const curY = func.func(func.range.low);
      if (prevY && Math.abs(prevY - curY) > 1e-6) {
        return MakeStateWarning('Functions do not appear continuous at point ' + func.range.low);
      }
      prevHi = func.range.high;
      prevY = func.func(prevHi);
    } catch (e) {
      return MakeStateError(`Function '${func.text}'' appears to be barfing: ${e}`);
    }
  }
  return MakeStateGood();
}

const UpdateFunctions = (
    originalState: GraphState,
    funcs: FuncArray,
    displayState:DisplayStateType,
    currentEdit:number): GraphState => {
  return {
    funcs,
    displayState,
    currentEdit,
    scale: originalState.scale,
    time: originalState.time,
    running: originalState.running
  };
};

const CheckFunctions = (origState:GraphState, funcs: FuncArray, currentEdit:number):GraphState =>
  UpdateFunctions(origState, funcs, ValidateFuncs(funcs), currentEdit);

const sliceOut = (funcs:FuncArray, pos:number):{bArr:FuncArray,func:UserFunction,eArr:FuncArray} => {
  const bArr = funcs.slice(0,pos);
  const eArr = funcs.slice(pos+1,funcs.length);
  return {bArr, func:funcs[pos], eArr};
};

const editFunctionReducer = (state:GraphState, action:EditFunctionAction):GraphState => {
  let funcs = state.funcs;
  const pos = action.position;
  if (pos < 0 || pos > funcs.length) {
    console.log('Invalid edit function request for current state');
    return state;
  }
  const {bArr, func, eArr} = sliceOut(funcs, pos);
  const newFunc:(UserFunction|string) = MakeUserFunc(action.funcBody, func.range.low, func.range.high);
  if (typeof newFunc === 'string') {
    return UpdateFunctions(state, funcs, MakeStateWarning('Function does not appear to work'), state.currentEdit);
  }
  funcs = [...bArr, newFunc, ...eArr];
  const displayState = ValidateFuncs(funcs);
  return UpdateFunctions(state, funcs, displayState, (displayState.state === 'GOOD') ? -1 : state.currentEdit);
};

const deleteFunctionReducer = (state:GraphState, action:DeleteFunctionAction):GraphState => {
  let funcs = state.funcs;
  const pos = action.position;
  if (pos < 0 || pos > funcs.length) {
    console.log('Invalid delete function request for current state');
    return state;
  }
  const {bArr, func, eArr} = sliceOut(funcs, pos);
  // Fill in the gap in the range
  const high = func.range.high;
  if (bArr.length > 0) {
    bArr[bArr.length-1].range.high = high;
  } else if (eArr.length > 0) {
    eArr[0].range.low = high;
  } else {
    console.log('Invalid delete function results');
  }
  funcs = [...bArr, ...eArr];
  let currentEdit = state.currentEdit;
  if (currentEdit === pos) {
    currentEdit = -1;
  } else if (currentEdit > pos) {
    currentEdit--;
  }
  return CheckFunctions(state, funcs, currentEdit);
};

const addFunctionReducer = (state:GraphState, action:AddFunctionAction):GraphState => {
  let funcs = state.funcs;
  const r = funcs[funcs.length - 1].range.high;
  const func = MakeUserFunc(action.expr, r, r+1);
  if (typeof func === 'string') {
    return UpdateFunctions(state, funcs, MakeStateError(func), state.currentEdit);
  }
  funcs = [...funcs, func];
  const isValid = ValidateFuncs(funcs);
  if (isValid.state === 'GOOD') {
    return UpdateFunctions(state, funcs, isValid, -1);
  }
  return UpdateFunctions(state, funcs, isValid, funcs.length - 1);
};

// Gives you 4 pieces: the functions before & after the "center"
// As well as the func array before & after those two
// If you pass it the beginning or end, it f1 or f2 will be undefined
const sliceTwoOut = (funcs:FuncArray, pos:number):{bArr:FuncArray, f1:?UserFunction, f2:?UserFunction, eArr:FuncArray} => {
  if (pos < 1) {
    return {bArr:[], f1:undefined, f2:funcs[0], eArr:funcs.slice(1,funcs.length)};
  }
  if (pos >= funcs.length) {
    return {bArr:funcs.slice(0, funcs.length - 1), f1:funcs[funcs.length-1], f2:undefined, eArr:[]};
  }
  return {bArr:funcs.slice(0,pos-1), f1:funcs[pos-1], f2:funcs[pos], eArr:funcs.slice(pos+1)};
};

const changeDividerReducer = (state:GraphState, action:ChangeDividerAction):GraphState => {
  const funcs = state.funcs;
  const pos = parseFloat(action.position);
  if (pos > funcs.length || pos < 0) {
    console.log('Invalid change divider request for current state');
    return state;
  }
  // Get the two functions we're modifying
  let {bArr, f1:hiFunc, f2:loFunc, eArr} = sliceTwoOut(funcs, pos);
  // Modify the hi & lo ranges
  let result:FuncArray = [];
  if (hiFunc) {
    hiFunc = CopyUserFunc(hiFunc, hiFunc.range.low, action.value);
  }
  if (loFunc) {
    loFunc = CopyUserFunc(loFunc, action.value, loFunc.range.high);
  }
  if (hiFunc && loFunc) {
    result = [...bArr, hiFunc, loFunc, ...eArr];
  } else if (hiFunc) {
    result = [...bArr, hiFunc];
  } else if (loFunc) {
    result = [loFunc, ...eArr];
  }
  return CheckFunctions(state, result, state.currentEdit);
};

const moveFunctionReducer = (state:GraphState, action:MoveFunctionAction):GraphState => {
  let funcs = state.funcs;
  const pos = action.position;
  const up = action.up;
  if (pos < (up ? 1 : 0) || pos > (funcs.length - (up ? 0 : 1))) {
    console.log('Invalid function move request for current state');
    return state;
  }
  const {bArr, f1, f2, eArr} = sliceTwoOut(funcs, pos + (up ? 0 : 1));
  if (!f1 || !f2) {
    console.log('Inconsistent state detected');
    return state;
  }
  const n1 = CopyUserFunc(f2, f1.range.low, f1.range.high);
  const n2 = CopyUserFunc(f1, f2.range.low, f2.range.high);
  funcs = [...bArr, n1, n2, ...eArr];
  return CheckFunctions(state, funcs, state.currentEdit);
};

const selectFunctionReducer = (state:GraphState, action:SelectFunctionAction):GraphState => {
  return CheckFunctions(state, state.funcs, action.position);
};

const clearEditorReducer = (state:GraphState, action:ClearEditorAction): GraphState => {
  console.log('clearing');
  return CheckFunctions(state, state.funcs, -1);
};

const changeScaleReducer = (state:GraphState, action:ScaleChangeAction): GraphState => {
  const val = parseFloat(action.value);
  if (val > 1e-2) {
    return Object.assign({}, state, {scale: val});
  }
  return state;
};

const changeAnimationReducer = (state:GraphState, start:boolean): GraphState => {
  return Object.assign({}, state, {running: start});
}

const internalCoasterReducer = (state:GraphState = initialState, action:CoasterAction): GraphState => {
  switch (action.type) {
    case 'ADD_FUNCTION':
      return addFunctionReducer(state, action);
    case 'DELETE_FUNCTION':
      return deleteFunctionReducer(state, action);
    case 'EDIT_FUNCTION':
      return editFunctionReducer(state, action);
    case 'CHANGE_LIMIT':
      return changeDividerReducer(state, action);
    case 'MOVE_FUNCTION':
      return moveFunctionReducer(state, action);
    case 'SELECT_FUNCTION':
      return selectFunctionReducer(state, action);
    case 'CLEAR_EDITOR':
      return clearEditorReducer(state, action);
    case 'START_ANIMATION':
      return changeAnimationReducer(state, true);
    case 'STOP_ANIMATION':
      return changeAnimationReducer(state, false);
    case 'CHANGE_SCALE':
      return changeScaleReducer(state, action);
    default:
      return state;
  }
};

export const CoasterReducer = (state:GraphState, action:CoasterAction): GraphState => {
  /*console.log('***********************');
  console.log({name:'***reducer input', state, action});*/
  const res = internalCoasterReducer(state, action);
  /*console.log({name:'***reducer output', state:res});
  console.log('***********************')*/
  return res;
};
