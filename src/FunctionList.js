//@flow

import React from 'react';

import {MakeUserFunc} from './UserFunction';

import type {UserFunction} from './UserFunction';

// Don't forget: These are all stateless components!
// Stateful components should in the 'Containers.js' file

export const FuncDivider = ({value,onChange}:{value:number,onChange?:Function}) =>
  (<div style={{alignSelf:'center'}}>
    x = <input type='text' value={value} onChange={onChange && onChange()} style={{width:'14pt', textAlign:'center'}}/></div>);

type FuncItemAttribs = {
  userFunc: UserFunction,
  first?:boolean,
  last?:boolean,
  onEdit?:Function,
  onPrev?:Function,
  onNext?:Function,
  onDel?:Function
};

export const FuncItem = ({userFunc,first,last,onEdit,onPrev,onNext,onDel}:FuncItemAttribs) => {
  return (
    <div style={{width:'250pt',alignItems:'stretch'}} className='RowList'>
    <div className='ColList'>
      <div style={{flexGrow:'1'}}>
        <button disabled={first} onClick={onPrev && onPrev()}>&uarr;</button><br/>
        <button disabled={last} onClick={onNext && onNext()}>&darr;</button>
      </div>
      <div style={{margin:'2pt',alignSelf:'stretch',flexGrow:'500'}}>{userFunc.text}</div>
      <div style={{flexGrow:'1'}}>
        <button onClick={onDel && onDel()} disabled={first && last}>del</button><br/>
        <button onClick={onEdit && onEdit()}>edit</button>
      </div>
    </div>
    <FuncDivider value={userFunc.range.high}/>
  </div>
  );
};

// TODO: Needs wired to Redux, as it affects state
export const FuncChanger = ({onClick,func}:{onClick:Function, func?:UserFunction}) => {
  return (
    <div style={{margin:'2pt'}} className='RowList'>
      <div className='ColList'>
        f(x) =  <textarea value={func ? func.text : 'x'}/>
      </div>
      <div alignSelf='auto'><button onClick={onClick}>{func ? 'Save' : 'Add'} Function</button></div>
    </div>
  );
};

export const FuncList = ({funcs, addSaveFunc}:{funcs: Array<UserFunction>, addSaveFunc: Function}) => {
  // Should I assert that they're sorted?
  const MapOfFuncs = funcs.map((uf, index) =>
    (<FuncItem first={index===0} last={index===funcs.length-1} key={index} userFunc={uf}/>));
  const DefaultFunc = MakeUserFunc('5*x',15,20);
  if (typeof DefaultFunc === 'string') throw String('');
  return (
    <div style={{margin:'2pt'}} className='RowList'>
      <FuncDivider value={0}/>
      {MapOfFuncs}
      <FuncChanger onClick={addSaveFunc} func={DefaultFunc}/>
    </div>
  );
};
