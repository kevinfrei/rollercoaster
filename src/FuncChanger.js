// @flow
import React, {Component, PropTypes} from 'react';

type FuncChangerAttribs = {
  onClick: (pos:number, func:string)=>void,
  func: string,
  pos: number
};

export class FuncChanger extends Component {
  props:FuncChangerAttribs;
  _textarea:?HTMLTextAreaElement;
  click = (event:Event) => {
    if (this._textarea)
      this.props.onClick(this.props.pos, this._textarea.value);
    event.preventDefault();
  }
  render() {
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
      <form onSubmit={this.click}>
        <label>{add ? 'New Function' : `Editing Function #${pos}`}<br/>
        f(x)&nbsp;=&nbsp;{ta}
        </label>
        <input type='submit' value={`${add ? 'Add' : 'Save'} Function`}/>
      </form>
    );
  }
};

FuncChanger.propTypes = {
  onClick: PropTypes.func.isRequired,
  func: PropTypes.string.isRequired,
  pos: PropTypes.number.isRequired
};
