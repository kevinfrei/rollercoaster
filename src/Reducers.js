//@flow

import {CopyUserFunc, MakeUserFunc} from './UserFunction';
import {MakeStateError, MakeStateWarning, MakeStateGood} from './StoreTypes';
import {initialState} from './StoreTypes';
import {getMaxTime} from './PhysicSim';

import type {UserFunction, FuncArray} from './UserFunction';
import type {GraphState, FunctionProblem, DisplayStateType} from './StoreTypes';
import type {
  CoasterAction,
  DeleteFunctionAction,
  ChangeDividerAction,
  MoveFunctionAction,
  EditFunctionAction,
  ScaleChangeAction,
  WindowsResizeAction,
  SetTimeAction,
  SettingsAction,
  AddNewFunctionAction,
  CloseEditorAction,
  ChangeCurrentExpressionAction,
  AllFuncsAction} from './Actions';

const nobj = (a:Object, b:Object):Object => Object.assign({}, a, b);

export const FuncProblems = {
  UnorderedRange: 0,
  Discontinuous: 1,
  ParseFailure: 2,
  EvaluationFail: 3,
  Make: (func:number, problem: string|number): FunctionProblem => ({
    func, problem
  })
};

const ValidateFuncs = (funcs:FuncArray):DisplayStateType => {
  let prevHi:?number = undefined;
  let prevY:?number = undefined;
  // TODO: Check for smoothness of transitions and warn
  let i = 0;
  for (let func of funcs) {
    i++;
    try {
      const lo = parseFloat(func.range.low);
      const hi = parseFloat(func.range.high);
      if (lo > hi) {
        return MakeStateError(
          FuncProblems.Make(i, FuncProblems.UnorderedRange));
      }
      if (prevHi && Math.abs(prevHi - lo) > 1e-6) {
        return MakeStateError(
          FuncProblems.Make(i, 'X range is not continuous (Bug in app!)'));
      }
      const curY = func.func(lo);
      if (prevY && Math.abs(prevY - curY) > 1e-6) {
        return MakeStateWarning(
          FuncProblems.Make(i, FuncProblems.Discontinuous));
      }
      prevHi = hi;
      prevY = func.func(prevHi);
    } catch (e) {
      return MakeStateError(
        FuncProblems.Make(i, FuncProblems.EvaluationFail));
    }
  }
  return MakeStateGood();
};

const UpdateFunctions = (
    originalState: GraphState,
    funcs: FuncArray,
    displayState: DisplayStateType): GraphState => {
  if (displayState.state === 'ERROR') {
    return nobj(originalState,
      { funcs, displayState, currentEdit: -1, editorOpen: false });
  }
  const maxTime = getMaxTime(funcs, 300000);
  return nobj(originalState,
  {funcs, displayState, currentEdit: -1, editorOpen: false, maxTime})
}

const CheckFunctions =
  (origState:GraphState, funcs: FuncArray):GraphState =>
  UpdateFunctions(origState, funcs, ValidateFuncs(funcs));

const sliceOut = (
  funcs:FuncArray,
  pos:number):{bArr:FuncArray,func:UserFunction,eArr:FuncArray} => {
  const bArr = funcs.slice(0,pos);
  const eArr = funcs.slice(pos+1,funcs.length);
  return {bArr, func:funcs[pos], eArr};
};

const updateExistingFunction = (state:GraphState):GraphState => {
  const funcs = state.funcs;
  const pos = state.currentEdit
  if (pos < 0 || pos > funcs.length) {
    console.log('Invalid edit function request for current state');
    return state;
  }
  const {bArr, func, eArr} = sliceOut(funcs, pos);
  const newFunc:(UserFunction|string) =
    MakeUserFunc(state.currExpr, func.range.low, func.range.high);
  if (typeof newFunc === 'string') {
    return UpdateFunctions(
      state,
      funcs,
      MakeStateWarning(
        FuncProblems.Make(pos, FuncProblems.ParseFailure)), state.currentEdit);
  }
  return CheckFunctions(state, [...bArr, newFunc, ...eArr]);
};

const saveNewFunction = (state:GraphState):GraphState => {
  if (state.currentEdit !== -1) {
    console.log('Invalid saveNewFunction request for current state');
    return state;
  }
  const funcs = state.funcs;
  const r = funcs[funcs.length - 1].range.high;
  const func = MakeUserFunc(state.currExpr, r, r + 5);
  if (typeof func === 'string') {
    return UpdateFunctions(
      state,
      funcs,
      MakeStateError(FuncProblems.Make(-1, FuncProblems.EvaluationFail)),
      state.currentEdit);
  }
  return CheckFunctions(state, [...funcs, func]);
};

const saveFunctionReducer = (state:GraphState):GraphState =>
  (state.currentEdit === -1) ?
    saveNewFunction(state) :
    updateExistingFunction(state);

const deleteFunctionReducer =
  (state:GraphState, action:DeleteFunctionAction):GraphState => {
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
    eArr[0].range.low = '0';
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


const allFuncsReducer =
  (state:GraphState, action:AllFuncsAction):GraphState => {
  const funcs = CheckFunctions(state, action.value, -1);
  return funcs;
}

// Gives you 4 pieces: the functions before & after the "center"
// As well as the func array before & after those two
// If you pass it the beginning or end, it f1 or f2 will be undefined
const sliceTwoOut = (
  funcs:FuncArray,
  pos:number
):{bArr:FuncArray, f1:?UserFunction, f2:?UserFunction, eArr:FuncArray} => {
  if (pos < 1) {
    return {
      bArr:[],
      f1:undefined,
      f2:funcs[0],
      eArr:funcs.slice(1,funcs.length)
    };
  }
  if (pos >= funcs.length) {
    return {
      bArr:funcs.slice(0, funcs.length - 1),
      f1:funcs[funcs.length-1],
      f2:undefined,
      eArr:[]
    };
  }
  return {
    bArr:funcs.slice(0,pos-1),
    f1:funcs[pos-1],
    f2:funcs[pos],
    eArr:funcs.slice(pos+1)
  };
};

const changeDividerReducer =
  (state:GraphState, action:ChangeDividerAction):GraphState => {
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

const moveFunctionReducer =
  (state:GraphState, action:MoveFunctionAction):GraphState => {
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

const editFunctionReducer =
  (state:GraphState, action:EditFunctionAction):GraphState => {
  return nobj(state, {editorOpen: true, currentEdit: action.position});
};

const changeScaleReducer =
  (state:GraphState, action:ScaleChangeAction): GraphState => {
  const val = parseFloat(action.value);
  if (val > 1e-2) {
    return nobj(state, {scale: val});
  }
  return state;
};

const toggleAnimationReducer = (state:GraphState): GraphState => {
  if (state.running) {
    // If we're running, just pause the thing
    return nobj(state, {running: false});
  } else {
    // Resume by recalculating the 'startTime' as an offset from right now
    // This works only if 'stop' has the effect of setting the time to zero
    return nobj(
      state,
      { running: true, startTime: Date.now() - state.millisec }
    );
  }
}

const stopAnimationReducer = (state:GraphState): GraphState =>
  nobj(state, {running: false, millisec: 0});

const tickReducer = (state: GraphState): GraphState =>
  state.running ? nobj(state, {millisec: Date.now() - state.startTime}) : state;

  const setTimeReducer = (state: GraphState, action: SetTimeAction): GraphState =>
    nobj(state, {millisec: action.msec, startTime: Date.now() - action.msec});

const windowResizeReducer =
  (state: GraphState, action: WindowsResizeAction): GraphState =>
  nobj(state, { size: { width:action.width, height:action.height } });

const settingsReducer = (state: GraphState, action: SettingsAction):GraphState =>
  nobj(state, {
    showCart: action.value.cart,
    showVector: action.value.velocity,
    showLabels: action.value.labels
  });

const addNewFunctionReducer = (state: GraphState, action: AddNewFunctionAction):GraphState =>
  nobj(state, {editorOpen: true, currentEdit: -1});

const closeEditorReducer = (state: GraphState, action: CloseEditorAction):GraphState =>
  nobj(state, {editorOpen: false});

const changeCurrentExpressionReducer = (state: GraphState, action: ChangeCurrentExpressionAction): GraphState =>
  nobj(state, {currExpr: action.expr});

const internalCoasterReducer =
  (state:GraphState = initialState, action:CoasterAction): GraphState => {
  switch (action.type) {
    case 'SAVE_FUNCTION':
      return saveFunctionReducer(state, action);
    case 'DELETE_FUNCTION':
      return deleteFunctionReducer(state, action);
    case 'CHANGE_LIMIT':
      return changeDividerReducer(state, action);
    case 'MOVE_FUNCTION':
      return moveFunctionReducer(state, action);
    case 'EDIT_FUNCTION':
      return editFunctionReducer(state, action);
    case 'TOGGLE_ANIMATION':
      return toggleAnimationReducer(state);
    case 'STOP_ANIMATION':
      return stopAnimationReducer(state);
    case 'CHANGE_SCALE':
      return changeScaleReducer(state, action);
    case 'SET_TIME':
      return setTimeReducer(state, action);
    case 'TICK':
      return tickReducer(state);
    case 'WINDOW_RESIZE':
      return windowResizeReducer(state, action);
    case 'SETTINGS':
      return settingsReducer(state, action);
    case 'ADD_NEW_FUNCTION':
      return addNewFunctionReducer(state, action);
    case 'CLOSE_EDITOR':
      return closeEditorReducer(state, action);
    case 'ALL_FUNCS':
      return allFuncsReducer(state, action);
    case 'CHANGE_CURRENT_EXPRESSION':
      return changeCurrentExpressionReducer(state, action);
    default:
      if (action.type !== '@@redux/INIT') {
        console.log(`Unkown state type: ${action.type}`);
        console.log(action);
      }
      return state;
  }
};

export const CoasterReducer =
  (state:GraphState, action:CoasterAction): GraphState => {
  if (false && action.type !== 'TICK') {
    console.log(state);
    console.log(action);
  }
  const res = internalCoasterReducer(state, action);
  if (false && action.type !== 'TICK') {
    console.log(res);
  }
  return res;
};
