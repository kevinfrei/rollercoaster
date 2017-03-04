// @flow
import React, {Component, PropTypes} from 'react';
import {Button, Panel} from 'react-bootstrap';
import {connect} from 'react-redux';

import {Actions} from './Actions';

import type {GraphState} from './StoreTypes';
import type {CoasterAction} from './Actions';

type FuncEditorProps = {
  onSave: (pos:number, func:string)=>void,
  onClear: () => void,
  func: string,
  pos: number
};

export const FunctionEditorHeader = ({add, pos}:{add:boolean, pos:number}) => (
  <div>{add ? 'Add a Function' : `Editing Function #${pos+1}`}</div>
);

export class UnboundFunctionEditor extends Component {
  props:FuncEditorProps;
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
      ref={(ta:HTMLTextAreaElement) => this._textarea = ta}/>;
    // Okay, this is a royal PITA.
    // textarea is NOT re-rendered when the value updates. Seems like a bug.
    // Not sure *whose* bug (mine, React, Redux, probably mine, honestly)
    // So, if it's already been displayed, set the value explicitly.
    if (this._textarea)
      this._textarea.value = this.props.func;
    const hdr = <FunctionEditorHeader add={add} pos={pos}/>;
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

UnboundFunctionEditor.propTypes = {
  onClear: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  func: PropTypes.string.isRequired,
  pos: PropTypes.number.isRequired
};

const FunctionEditor = connect(
  // State to Props
  (state:GraphState) => ({
    pos: state.currentEdit,
    func: (state.currentEdit < 0) ? '' : String(state.funcs[state.currentEdit].text)
  }),
  // Dispatch to Handler Props
  (dispatch:(a:CoasterAction)=>void) => ({
    onSave: (id:number, expr:string) => dispatch(
      (id >= 0)
        ? Actions.EditFunction(id, expr)
        : Actions.AddFunction(expr)),
    onClear: () => dispatch(Actions.ClearEditor())
  })
)(UnboundFunctionEditor);

export default FunctionEditor;
