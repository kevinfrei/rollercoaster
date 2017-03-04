//@flow

import React from 'react';
import {Button} from 'react-bootstrap';
import MathJaxReact from './MathJaxReact';

import type {UserFunction} from './UserFunction';

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
  <div style={{height:'100%'}}>
    <Button block bsSize='small' disabled={first} onClick={() => onPrev(id)}>
      &uarr;
    </Button>
    <Button block bsSize='small' disabled={last} onClick={() => onNext(id)}>
      &darr;
    </Button>
  </div>
);

const FuncDisplayer = ({text}) => <MathJaxReact formula={`y = ${text}`}/>;

const FuncChangeButtons = ({first, last, id, onDel, onEdit}) => (
  <div style={{height:'100%'}}>
    <Button block bsSize='small'
      onClick={() => onDel(id)} disabled={first && last}>✗</Button>
    <Button block bsSize='small' onClick={() => onEdit(id)}>✎</Button>
  </div>
);

const FunctionViewer =
({id,userFunc,first,last,onEdit,onPrev,onNext,onDel}:FuncViewerAttribs) => (
  <div className='ColJust'>
    <FuncMover id={id} first={first} last={last}
      onPrev={onPrev} onNext={onNext}/>
    <div style={{padding:'4pt', display:'flex', justifyContent:'center', alignItems:'center'}}>
      <FuncDisplayer text={userFunc.text}/>
    </div>
    <FuncChangeButtons id={id} first={first} last={last}
      onDel={onDel} onEdit={onEdit}/>
  </div>
);

export default FunctionViewer;
