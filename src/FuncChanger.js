// @flow
import React, {Component, PropTypes} from 'react';
import {Button, Panel} from 'react-bootstrap';

type FuncChangerAttribs = {
  onSave: (pos:number, func:string)=>void,
  onClear: () => void,
  func: string,
  pos: number
};

const FuncChangerHeader = ({add, pos}:{add:boolean, pos:number}) => (
  <div>{add ? 'Add a Function' : `Editing Function #${pos+1}`}</div>
);

export class FuncChanger extends Component {
  props:FuncChangerAttribs;
  _textarea:?HTMLTextAreaElement;
  click = (event:Event) => {
    if (this._textarea)
      this.props.onSave(this.props.pos, this._textarea.value);
    event.preventDefault();
  }
  render() {
    const pos = this.props.pos;
    const add = pos < 0;
    const btn = {width:'40pt'};
    const ta = <textarea
      style={{flexGrow:3}}
      defaultValue={this.props.func}
      ref={ta => this._textarea = ta}/>;
    // Okay, this is a royal PITA.
    // textarea is NOT re-rendered when the value updates. Seems like a bug.
    // Not sure *whose* bug (mine, React, Redux, probably mine, honestly)
    // So, if it's already been displayed, set the value explicitly.
    if (this._textarea)
      this._textarea.value = this.props.func;
    const hdr = <FuncChangerHeader add={add} pos={pos}/>;
    const clr = this.props.onClear;
    const clk = this.click;
    return (
      <Panel header={hdr}>
        <div className='ColJust' style={{padding:'4pt'}}>
          y&nbsp;=&nbsp;{ta}
        </div>
        <div className='ColJust' style={{padding:'4pt'}}>
          <Button bsSize='small' bsStyle='primary' style={btn} onClick={clk}>
            {`${add ? 'Add' : 'Save'}`}
          </Button>
          <Button bsSize='small' bsStyle='danger' style={btn} onClick={clr}>
            Clear
          </Button>
        </div>
      </Panel>
    );
  }
};

FuncChanger.propTypes = {
  onClear: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  func: PropTypes.string.isRequired,
  pos: PropTypes.number.isRequired
};
