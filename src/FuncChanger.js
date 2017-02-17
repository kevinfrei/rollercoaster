// @flow
import React, {Component, PropTypes} from 'react';

type FuncChangerAttribs = {
  onSave: (pos:number, func:string)=>void,
  onClear: () => void,
  func: string,
  pos: number
};

export class FuncChanger extends Component {
  props:FuncChangerAttribs;
  _textarea:?HTMLTextAreaElement;
  click = (event:Event) => {
    if (this._textarea)
      this.props.onSave(this.props.pos, this._textarea.value);
    event.preventDefault();
  }
  render() {
    console.log(this.props)
    const pos = this.props.pos;
    const add = pos < 0;
    const ta = <textarea defaultValue={this.props.func} ref={ta => this._textarea = ta}/>;
    // Okay, this is a royal PITA.
    // textarea is NOT re-rendered when the value updates. Seems like a bug.
    // Not sure *whose* bug (mine, React, Redux, probably mine, honestly)
    // So, if it's already been displayed, set the value explicitly.
    if (this._textarea)
      this._textarea.value = this.props.func;
    return (
      <div className='RowList'>
        {add ? 'New Function' : `Editing Function #${pos}`}<br/>
        <div className='ColList'>f(x)&nbsp;=&nbsp;{ta}</div>
        <div className='ColList'>
          <button onClick={this.click}>{`${add ? 'Add' : 'Save'} Function`}</button>
          <button onClick={this.props.onClear}>Clear</button>
        </div>
      </div>
    );
  }
};

FuncChanger.propTypes = {
  onClear: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  func: PropTypes.string.isRequired,
  pos: PropTypes.number.isRequired
};
