// @flow

import type {FuncArray} from './UserFunction';

// My 'user state':

// A list of UserFunctions
// Are those functions good to graph?
// An optional 'selected' user function for editing

// And various messages that it needs to respond to:

// Add a new function
// Delete function
// Edit a function
// Change X divider value
// Move a function up/down

// These flow types are quite tedious
// There really ought to be a better way...

export type SaveFunctionAction = {
  type: 'SAVE_FUNCTION',
};

export type DeleteFunctionAction = {
  type: 'DELETE_FUNCTION',
  position: number
};

export type ChangeDividerAction = {
  type: 'CHANGE_LIMIT',
  position: number,
  value: number|string
};

export type MoveFunctionAction = {
  type: 'MOVE_FUNCTION',
  position: number,
  up: boolean
};

export type EditFunctionAction = {
  type: 'EDIT_FUNCTION',
  position: number
};

export type StartAction = {
  type: 'START_ANIMATION'
};

export type StopAction = {
  type: 'STOP_ANIMATION'
};

export type ScaleChangeAction = {
  type: 'CHANGE_SCALE',
  value: string
};

export type TickAction = {
  type: 'TICK'
};

export type WindowsResizeAction = {
  type: 'WINDOW_RESIZE',
  width: number,
  height: number
};

export type SettingsTuple = {cart: boolean, velocity: boolean, labels: boolean};

export type SettingsAction = {
  type: 'SETTINGS',
  value: SettingsTuple
};

export type AllFuncsAction = {
  type: 'ALL_FUNCS',
  value: FuncArray
};

export type AddNewFunctionAction = {
  type: 'ADD_NEW_FUNCTION'
};

export type CloseEditorAction = {
  type: 'CLOSE_EDITOR'
};

export type ChangeCurrentExpressionAction = {
  type: 'CHANGE_CURRENT_EXPRESSION',
  expr: string
};

export type CoasterAction =
  SaveFunctionAction |
  DeleteFunctionAction |
  ChangeDividerAction |
  MoveFunctionAction |
  EditFunctionAction |
  StartAction |
  StopAction |
  ScaleChangeAction |
  TickAction |
  WindowsResizeAction |
  SettingsAction |
  AddNewFunctionAction |
  CloseEditorAction |
  ChangeCurrentExpressionAction |
  AllFuncsAction;

export const Actions = {
  SaveFunction: ():SaveFunctionAction => ({
    type: 'SAVE_FUNCTION'}),
  DeleteFunction: (position:number):DeleteFunctionAction => ({
    type: 'DELETE_FUNCTION', position}),
  ChangeDivider: (position:number, value: number|string):ChangeDividerAction => ({
    type: 'CHANGE_LIMIT', position, value}),
  MoveFunction: (position:number, up:boolean):MoveFunctionAction => ({
    type: 'MOVE_FUNCTION', position, up}),
  EditFunction: (position:number):EditFunctionAction => ({
    type: 'EDIT_FUNCTION', position}),
  ChangeCurrentExpression: (expr:string):ChangeCurrentExpressionAction => ({
    type: 'CHANGE_CURRENT_EXPRESSION', expr}),
  Start: ():StartAction => ({ type: 'START_ANIMATION' }),
  Stop: ():StopAction => ({ type: 'STOP_ANIMATION' }),
  ChangeScale: (value:string):ScaleChangeAction => ({
    type: 'CHANGE_SCALE', value}),
  Tick: ():TickAction => ({ type: 'TICK' }),
  WindowResize: (width:number, height:number):WindowsResizeAction => ({
    type: 'WINDOW_RESIZE', width, height}),
  Settings: (cart: boolean, velocity: boolean, labels: boolean):SettingsAction => ({
    type: 'SETTINGS', value:{cart, velocity, labels}}),
  AddNewFunction: ():AddNewFunctionAction => ({ type: 'ADD_NEW_FUNCTION' }),
  CloseEditor: ():CloseEditorAction => ({ type: 'CLOSE_EDITOR' }),
  AllFuncs: (value: FuncArray) => ({ type: 'ALL_FUNCS', value }),
};
