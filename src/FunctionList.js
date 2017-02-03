//@flow

import React from 'react';

import type {UserFunction} from './UserFunction';

export const FuncRange = ({Low, High}: {Low : number, High : number}) => {
  return (<span style={{alignSelf:'center'}}>{Low}&nbsp;&larr;&nbsp;x&nbsp;&larr;&nbsp;{High}</span>);
};

const td = (n:number):number => Math.round(n * 100) / 100;

export const FuncItem = ({userFunc}:{userFunc: UserFunction}) => {
  return (<div className='ColList'>
    <div>
      <button>&uarr;</button><br/>
      <button>&darr;</button>
    </div>
      <div style={{border:'1pt solid black',margin:'2pt',alignSelf:'center',flexGrow:'4'}}>
        f(x) = {userFunc.text}
      </div>
      <FuncRange Low={userFunc.range.low} High={userFunc.range.high}/>
  </div>);
};

// TODO: Needs wired to Redux, as it affects state
export const FuncAdder = () => {
  return (<div style={{margin:'2pt', alignSelf:'center'}}><button>Add Function (NYI!)</button></div>);
};

export const FuncList = ({funcs}:{funcs: Array<UserFunction>}) => {
  // Should I assert that they're sorted?
  const MapOfFuncs = funcs.map((uf, index) => {
    return (<FuncItem key={index} userFunc={uf}/>);
  });
  return (<div className='RowList'>
    {MapOfFuncs}
    <FuncAdder/>
  </div>);
};
