//@flow

import React from 'react';
import MathJax from 'react-mathjax';
import {Button, ButtonGroup, ListGroup, ListGroupItem} from 'react-bootstrap';

import {FunctionEditor} from './ReduxControls';

import type {UserFunction} from './UserFunction';
import type {DisplayStateType} from './coasterRedux';

// Don't forget: These are all stateless components!
// Stateful components should in the 'Containers.js' file

export const FuncDivider = ({pos, low, high, onChange}:
  {pos:number,low:number,high:number,onChange:Function}) => {
  const lowDig = Math.min(low.toString().length, low.toFixed(5).length);
  const hiDig = Math.min(high.toString().length, high.toFixed(5).length);
  return (
    <div>
      Function&nbsp;{pos+1}&nbsp;for&nbsp;x&nbsp;:&nbsp;
      <input
        type='text'
        value={low}
        style={{width:lowDig * 12 + 5, textAlign:'center'}}
        disabled={low === 0}
        onChange={(a) => onChange(pos, a.target.value)}/>
      &nbsp;-&nbsp;
      <input
        type='text'
        value={high}
        style={{width:hiDig * 12 + 5, textAlign:'center'}}
        onChange={(a) => onChange(pos + 1, a.target.value)}/>
    </div>);
};

type FuncViewerAttribs = {
  id: number,
  userFunc: UserFunction,
  first: boolean,
  last: boolean,
  onEdit: (id:number)=>void,
  onPrev: (id:number)=>void,
  onNext: (id:number)=>void,
  onDel: (id:number)=>void
};

const FuncMover = ({first, last, id, onPrev, onNext}) => (
  <ButtonGroup vertical>
    <Button block bsSize='xsmall' disabled={first} onClick={() => onPrev(id)}>&uarr;</Button>
    <Button block bsSize='xsmall' disabled={last} onClick={() => onNext(id)}>&darr;</Button>
  </ButtonGroup>
);

const FuncDisplayer = ({text}) => (
  <MathJax.Context>
    <MathJax.Node>
      {`y = ${text}`}
    </MathJax.Node>
  </MathJax.Context>
);

const FuncChangeButtons = ({first, last, id, onDel, onEdit}) => (
  <ButtonGroup vertical>
    <Button block bsSize='xsmall' onClick={() => onDel(id)} disabled={first && last}>Delete</Button>
    <Button block bsSize='xsmall' onClick={() => onEdit(id)}>Edit</Button>
  </ButtonGroup>
);

export const FuncViewer =
({id,userFunc,first,last,onEdit,onPrev,onNext,onDel}:FuncViewerAttribs) => {
  return (
    <div className='ColJust'>
      <FuncMover id={id} first={first} last={last} onPrev={onPrev} onNext={onNext}/>
      <div style={{padding:'4pt'}}>
        <FuncDisplayer text={userFunc.text}/>
      </div>
      <FuncChangeButtons id={id} first={first} last={last} onDel={onDel} onEdit={onEdit}/>
    </div>
  );
};

type FuncListAttribs = {
  funcs: Array<UserFunction>,
  onEdit: (id:number)=>void,
  onPrev: (id:number)=>void,
  onNext: (id:number)=>void,
  onDel: (id:number)=>void,
  onChange: (id:number, value:number)=>void,
  selected: number
};

export const FuncList =
  ({funcs, onEdit, onPrev, onNext, onDel, onChange, selected}:FuncListAttribs) => {
  // Should I assert that they're sorted?
  const MapOfFuncs = funcs.map(
    (uf, index) => {
      const header = (
        <FuncDivider pos={index} low={uf.range.low} high={uf.range.high}
          onChange={onChange}/>);
      return (
        <ListGroupItem key={index} header={header}>
          <FuncViewer
            id={index}
            first={index===0}
            last={index===funcs.length-1}
            userFunc={uf}
            onNext={onNext}
            onPrev={onPrev}
            onEdit={onEdit}
            onDel={onDel}/>
        </ListGroupItem>
      );
  });
  const withEditor = [...MapOfFuncs, <FunctionEditor key='TheEditor'/>];
  return (
    <ListGroup>
      {withEditor}
    </ListGroup>
  );
};

export const StateDisplay = ({state}:{state:DisplayStateType}) => {
  if (state.state === 'GOOD') {
    return <div/>;
  }
  return (<div style={{padding:'2pt'}}>{state.state}: {state.message}</div>);
};
