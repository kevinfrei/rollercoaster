//@flow

import React from 'react';

import type {UserFunction} from './UserFunction';
import type {DisplayStateType} from './coasterRedux';

// Don't forget: These are all stateless components!
// Stateful components should in the 'Containers.js' file

export const FuncDivider = ({pos,value,onChange}:
  {pos:number,value:number,onChange:Function}) =>
  (<div style={{alignSelf:'center'}}>
    x = <input
            type='text'
            value={value}
            onChange={(a) => onChange(pos, a.target.value)}
            style={{width:'14pt', textAlign:'center'}}/>
  </div>);

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

export const FuncViewer =
({id,userFunc,first,last,onEdit,onPrev,onNext,onDel}:FuncViewerAttribs) => {
  return (
    <div className='ColList'>
      <div style={{flexGrow:'1'}}>
        <button disabled={first} onClick={() => onPrev(id)}>&uarr;</button>
        <br/>
        <button disabled={last} onClick={() => onNext(id)}>&darr;</button>
      </div>
      <div style={{margin:'2pt',alignSelf:'stretch',flexGrow:'500'}}>
        {userFunc.text}
      </div>
      <div style={{flexGrow:'1'}}>
        <button onClick={() => onDel(id)} disabled={first && last}>del</button>
        <br/>
        <button onClick={() => onEdit(id)}>edit</button>
      </div>
    </div>
  );
}

type FuncChangerAttribs = {
  onClick: Function,
  func: string,
  pos?: number
};

export class FuncChanger extends React.Component {
  props:FuncChangerAttribs;
  _textarea:?Object;
  FuncChanger() { this._textarea = null; }
  render() {
    let {onClick, func, pos}:FuncChangerAttribs = this.props;
    if (!pos) pos = -1;

    return (
      <div style={{margin:'2pt'}} className='RowList'>
        <div>{(pos >= 0) ? `Editing function #${pos}` : 'New Function'}</div>
        <div className='ColList'>
          f(x)&nbsp;=&nbsp;<textarea
            ref={ta => this._textarea = ta}
            defaultValue={(pos >= 0) ? func : 'x'}/>
        </div>
        <div style={{alignSelf:'auto'}}>
          <button onClick={() =>
            onClick(pos, this._textarea ? this._textarea.value : '')}>
            {(pos >= 0) ? 'Save' : 'Add'} Function
          </button>
        </div>
      </div>
    );
  }
};
FuncChanger.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  func: React.PropTypes.string.isRequired,
  pos: React.PropTypes.number
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
    (uf, index) =>
      (<div key={index} className='RowList'>
        <FuncViewer
          id={index}
          first={index===0}
          last={index===funcs.length-1}
          userFunc={uf}
          onNext={onNext}
          onPrev={onPrev}
          onEdit={onEdit}
          onDel={onDel}/>
        <FuncDivider style={{alignSelf:'center'}}
          pos={index + 1}
          value={uf.range.high}
          onChange={onChange}/>
        </div>
      )
    );
  return (
    <div style={{margin:'2pt'}} className='RowList'>
      <FuncDivider key={-1} value={0} pos={0} onChange={onChange}/>
      {MapOfFuncs}
    </div>
  );
};

export const StateDisplay = ({state}:{state:DisplayStateType}) => {
  return (<div>{state.state}: {state.message}</div>);
};
