// @flow

import type {FuncArray} from './UserFunction';

// My 'user state':

// A list of UserFunctions
// Are those functions good to graph?
// An optional 'selected' user function for editing

// Knowne fu

// And various messages that it needs to respond to:

// Add a new function
// Delete function
// Edit a function
// Change X divider value
// Move a function up/down

// These flow types are quite tedious
// There really ought to be a better way...

export type AddFunctionAction = {
  type: 'ADD_FUNCTION',
  funcBody: string
};

export type DeleteFunctionAction = {
  type: 'DELETE_FUNCTION',
  position: number
};

export type ChangeFunctionAction = {
  type: 'CHANGE_FUNCTION',
  position: number,
  funcBody: string
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

export type SelectFunctionAction = {
  type: 'SELECT_FUNCTION',
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

export type OpenEditorAction = {
  type: 'OPEN_EDITOR'
};

export type CloseEditorAction = {
  type: 'CLOSE_EDITOR'
};

export type CoasterAction =
  AddFunctionAction |
  DeleteFunctionAction |
  ChangeFunctionAction |
  ChangeDividerAction |
  MoveFunctionAction |
  SelectFunctionAction |
  StartAction |
  StopAction |
  ScaleChangeAction |
  TickAction |
  WindowsResizeAction |
  SettingsAction |
  OpenEditorAction |
  CloseEditorAction |
  AllFuncsAction;

export const Actions = {
  AddFunction: (funcBody:string):AddFunctionAction => ({
    type: 'ADD_FUNCTION', funcBody}),
  DeleteFunction: (position:number):DeleteFunctionAction => ({
    type: 'DELETE_FUNCTION', position}),
  ChangeFunction: (position:number, funcBody:string):ChangeFunctionAction => ({
    type: 'CHANGE_FUNCTION', position, funcBody}),
  ChangeDivider: (position:number, value: number|string):ChangeDividerAction => ({
    type: 'CHANGE_LIMIT', position, value}),
  MoveFunction: (position:number, up:boolean):MoveFunctionAction => ({
    type: 'MOVE_FUNCTION', position, up}),
  SelectFunction: (position:number):SelectFunctionAction => ({
    type: 'SELECT_FUNCTION', position}),
  Start: ():StartAction => ({ type: 'START_ANIMATION' }),
  Stop: ():StopAction => ({ type: 'STOP_ANIMATION' }),
  ChangeScale: (value:string):ScaleChangeAction => ({
    type: 'CHANGE_SCALE', value}),
  Tick: ():TickAction => ({ type: 'TICK' }),
  WindowResize: (width:number, height:number):WindowsResizeAction => ({
    type: 'WINDOW_RESIZE', width, height}),
  Settings: (cart: boolean, velocity: boolean, labels: boolean):SettingsAction => ({
    type: 'SETTINGS', value:{cart, velocity, labels}}),
  OpenEditor: ():OpenEditorAction => ({ type: 'OPEN_EDITOR' }),
  CloseEditor: ():CloseEditorAction => ({ type: 'CLOSE_EDITOR' }),
  AllFuncs: (value: FuncArray) => ({ type: 'ALL_FUNCS', value }),
};
