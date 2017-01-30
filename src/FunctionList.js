//@flow

import React from 'react';

import type {UserFunction} from './UserFunction';

export const FuncRange = ({Low, High}: {Low : number, High : number}) => {
  return (<span> {`{${Low} <= x < ${High}}`}</span>);
};

const td = (n:number):number => Math.round(n * 100) / 100;

export const FuncItem = ({userFunc}:{userFunc: UserFunction}) => {
  return (<div>
    <pre>f(x) = {userFunc.text}</pre>
    <div>lo:{td(userFunc.range.low)},{td(userFunc.func(userFunc.range.low))} -
      hi:{td(userFunc.range.high)},{td(userFunc.func(userFunc.range.high))}</div>
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
