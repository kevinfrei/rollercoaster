// @flow
import {CopyUserFunc, MakeUserFunc} from './UserFunction';

import type {UserFunction} from './UserFunction';

// My 'user state':

// A list of UserFunctions
// Are those functions good to graph?
// An optional 'selected' user function for editing
//  Eventually:
//    Graph scale
//    Current time
//    Gravity?

export type GraphState = {
  funcs: Array<UserFunction>,
  displayState: DisplayStateType
};

type FuncArray = Array<UserFunction>;

// And various messages that it needs to respond to:

// Add a new function
// Delete function
// Edit a function
// Change X divider value
// Move a function up/down

export type AddFunctionAction = {
  type: 'ADD_FUNCTION',
  expr: string
};

export type DeleteFunctionAction = {
  type: 'DELETE_FUNCTION',
  position: number
};

export type EditFunctionAction = {
  type: 'EDIT_FUNCTION',
  position: number,
  funcBody: string
};

export type ChangeDividerAction = {
  type: 'CHANGE_LIMIT',
  position: number,
  value: number
};

export type MoveFunctionAction = {
  type: 'MOVE_FUNCTION',
  position: number,
  up: boolean
};

type CoasterAction = AddFunctionAction | DeleteFunctionAction | EditFunctionAction | ChangeDividerAction | MoveFunctionAction;

export type DisplayStateType = {
  state: 'ERROR' | 'WARNING' | 'GOOD',
  message: string
};

const MakeStateError =
  (message:string): DisplayStateType => ({state: 'ERROR', message});
const MakeStateWarning =
  (message:string): DisplayStateType => ({state: 'WARNING', message});
const MakeStateGood =
  (message:string = ''): DisplayStateType => ({state: 'GOOD', message});


const initialState:GraphState = {funcs:[], displayState:MakeStateError('No Functions!')};

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
    return {funcs, displayState:MakeStateWarning('New function does not appear to work')};
  }
  funcs = [...bArr, newFunc, ...eArr];
  return {funcs, displayState:ValidateFuncs(funcs)};
};

const deleteFunctionReducer = (state:GraphState, action:DeleteFunctionAction):GraphState => {
  let funcs = state.funcs;
  const pos = action.position;
  if (pos < 0 || pos > funcs.length) {
    console.log('Invalid delete function request for current state');
    return state;
  }
  const {bArr, func, eArr} = sliceOut(funcs, pos);
  funcs = [...bArr, ...eArr];
  return {funcs, displayState:ValidateFuncs(funcs)};
};

const addFunctionReducer = (state:GraphState, action:AddFunctionAction):GraphState => {
  let funcs = state.funcs;
  const r = funcs[funcs.length - 1].range.high;
  const func = MakeUserFunc(action.expr, r, r+1);
  if (typeof func === 'string') {
    return {funcs, displayState:MakeStateError(func)};
  }
  funcs = [...funcs, func];
  return {funcs, displayState:ValidateFuncs(funcs)};
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
}

const changeDividerReducer = (state:GraphState, action:ChangeDividerAction):GraphState => {
  const funcs = state.funcs;
  const pos = action.position;
  const first = pos === 0;
  const last = pos === funcs.length;
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
  return {funcs:result, displayState:ValidateFuncs(result)};
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
  return {funcs, displayState:ValidateFuncs(funcs)};
};

const CoasterReducer = (state:GraphState = initialState, action:CoasterAction): GraphState => {
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
    default:
      return state;
  }
};
