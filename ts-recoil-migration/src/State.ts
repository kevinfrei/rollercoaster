import { DemandUserFunc, MakeUserFunc, UserFunction } from './UserFunction';
import type { CoasterAction } from './Actions';
import type { FuncArray } from './UserFunction';
import { atom, atomFamily } from 'recoil';

// My 'user state':

// A list of UserFunctions
// Are those functions good to graph?
// An optional 'selected' user function for editing

// Known fu
export type FunctionProblem = {
  func: number;
  problem: string | number;
};

export type DisplayStateType = {
  state: 'ERROR' | 'WARNING' | 'GOOD';
  message: string | FunctionProblem;
};

/*
type FileDialogState = {
  showModal : boolean,
  // settings: {
  cart : boolean,
  velocity : boolean,
  labels : boolean,
  //},
  // loader: {
  loadSelection : string,
  funcsets : FuncSetsType;
  //},
  // saver: {
  saveName : string,
  //},
};
*/

export const settingsDialogVisibleState = atom<boolean>({
  key: 'SettingsDialogVisibleState',
  default: false,
});
export const functionEditorVisibleState = atom<boolean>({
  key: 'FunctionEditorVisibleState',
  default: false,
});
export const showCartState = atom<boolean>({
  key: 'ShowCartState',
  default: true,
});
export const showVelocityState = atom<boolean>({
  key: 'ShowVelocityState',
  default: true,
});
export const showLabelsState = atom<boolean>({
  key: 'ShowLabelsState',
  default: true,
});
const FunctionCountState = atom<number>({
  key: 'FunctionCount',
  default: 0,
});
const FunctionsState = atomFamily<UserFunction, number>({
  key: 'FunctionsState',
});
const DisplayState = atom<DisplayStateType>({
  key: 'DisplayState',
  default: { state: 'WARNING', message: 'uninitialized' },
});
const EditorOpenState = atom<boolean>({ key: 'EditorOpen', default: false });

export type GraphState = {
  funcs: FuncArray;
  displayState: DisplayStateType;
  editorOpen: boolean;
  currentEdit: number;
  currExpr: string;
  scale: number;
  maxTime: number;
  startTime: number;
  millisec: number;
  running: boolean;
  showLabels: boolean;
  showVector: boolean;
  showCart: boolean;
  size: { width: number; height: number };
};

export const MakeStateError = (
  message: string | FunctionProblem,
): DisplayStateType => ({
  state: 'ERROR',
  message,
});

export const MakeStateWarning = (
  message: string | FunctionProblem,
): DisplayStateType => ({
  state: 'WARNING',
  message,
});

export const MakeStateGood = (message: string = ''): DisplayStateType => ({
  state: 'GOOD',
  message,
});

export const initialState: GraphState = {
  funcs: [
    DemandUserFunc('x^2-16x+64', 0, 8),
    DemandUserFunc('sin((pi x)/2-pi/2)+1', 8, 12),
    DemandUserFunc('x^2/2-12x+72', 12, 20),
  ],
  displayState: MakeStateGood(),
  editorOpen: false,
  currentEdit: -1,
  currExpr: 'x',
  scale: 25,
  startTime: -1,
  millisec: 0,
  maxTime: 60000,
  running: false,
  showLabels: true,
  showVector: false,
  showCart: true,
  size: { width: -1, height: -1 },
};

export type dispatchType = (action: CoasterAction) => void;
