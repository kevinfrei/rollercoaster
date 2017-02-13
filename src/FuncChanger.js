// @flow
import React, {Component, PropTypes} from 'react';

type FuncChangerAttribs = {
  onClick: Function,
  func: string,
  pos: number
};

export class FuncChanger extends Component {
  props:FuncChangerAttribs;
  _textarea:?Object;
  FuncChanger() { this._textarea = null; }
  render() {
    const {onClick, func, pos}:FuncChangerAttribs = this.props;
    const add = pos < 0;
    return (
      <div style={{margin:'2pt'}} className='RowList'>
        <div>{add ? 'New Function' : `Editing function #${pos}`}</div>
        <div className='ColList'>
          f(x)&nbsp;=&nbsp;
            <textarea  ref={ta => this._textarea = ta}
            defaultValue={func}/>
        </div>
        <div style={{alignSelf:'auto'}}>
          <button onClick={() =>
            onClick(pos, this._textarea ? this._textarea.value : '')}>
            {add ? 'Add' : 'Save'} Function
          </button>
        </div>
      </div>
    );
  }
};

FuncChanger.propTypes = {
  onClick: PropTypes.func.isRequired,
  func: PropTypes.string.isRequired,
  pos: PropTypes.number.isRequired
};
