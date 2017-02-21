//@flow

import React from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';

import {MathJaxReact} from './MathJaxReact';
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
  <ButtonGroup vertical>
    <Button block bsSize='xsmall' disabled={first} onClick={() => onPrev(id)}>
      &nbsp;&uarr;&nbsp;
    </Button>
    <Button block bsSize='xsmall' disabled={last} onClick={() => onNext(id)}>
      &nbsp;&darr;&nbsp;
    </Button>
  </ButtonGroup>
);

const FuncDisplayer = ({text}) => (<MathJaxReact formula={`y = ${text}`}/>);

const FuncChangeButtons = ({first, last, id, onDel, onEdit}) => (
  <ButtonGroup vertical>
    <Button block bsSize='xsmall'
      onClick={() => onDel(id)} disabled={first && last}>
      Delete
    </Button>
    <Button block bsSize='xsmall' onClick={() => onEdit(id)}>
      Edit
    </Button>
  </ButtonGroup>
);

export const FuncViewer =
({id,userFunc,first,last,onEdit,onPrev,onNext,onDel}:FuncViewerAttribs) => {
  return (
    <div className='ColJust'>
      <FuncMover id={id} first={first} last={last}
        onPrev={onPrev} onNext={onNext}/>
      <div style={{padding:'4pt'}}>
        <FuncDisplayer text={userFunc.text}/>
      </div>
      <FuncChangeButtons id={id} first={first} last={last}
        onDel={onDel} onEdit={onEdit}/>
    </div>
  );
};
