//@flow

import React from 'react';

import type {UserFunction} from './UserFunction';

export const FuncRange = ({Low, High}:{Low:number, High: number}) => {
  return (<div><span>Range:</span>{Low} - {High}</div>);
};

export const FuncItem = ({userFunc}:{userFunc: UserFunction}) => {
  return (<div>
    <div>{userFunc.text}</div>
    <div>Low: {userFunc.range.low},{userFunc.func(userFunc.range.low)}</div>
    <div>High: {userFunc.range.high},{userFunc.func(userFunc.range.high)}</div>
    <FuncRange Low={userFunc.range.low} High={userFunc.range.high}/>
  </div>);
};

// Needs wired to Redux, as it affects state
export const FuncAdder = () => {
  return (<div>This will be a func data entry thing...</div>);
};

export const FuncList = ({funcs}:{funcs: Array<UserFunction>}) => {
  // Should I assert that they're sorted?
  const MapOfFuncs = funcs.map((uf, index) => {
    return (<li key={index}><FuncItem userFunc={uf}/></li>);
  });
  return (<ul>
    {MapOfFuncs}
    <FuncAdder/>
  </ul>);
};
