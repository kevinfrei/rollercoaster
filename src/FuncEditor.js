// @flow
import React, {PropTypes} from 'react';
import {
  Button,
  FormControl,
  FormGroup,
  InputGroup,
  Modal} from 'react-bootstrap';
import {connect} from 'react-redux';

import {Actions} from './Actions';

import './App.css';

import type {GraphState} from './StoreTypes';
import type {CoasterAction} from './Actions';

type FuncEditorProps = {
  onSave: (pos:number) => void,
  onClose: () => void,
  onAddClick: () => void,
  onChange: (expr: string) => void;
  func: string,
  pos: number,
  visible: boolean
};

export const UnboundFunctionEditor =
  ({onSave, onClose, onAddClick, onChange, func, pos, visible}:FuncEditorProps) =>
    (<div>
      <Button onClick={onAddClick} className='btnWidth'>Add</Button>
      <Modal show={visible} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create/Edit Function</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <InputGroup>
              <InputGroup.Addon>y = </InputGroup.Addon>
              <FormControl type="text" defaultValue={func}
                onChange={e => onChange(e.target.value)}/>
              <InputGroup.Button>
                <Button onClick={onSave}>Save</Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Modal.Body>
      </Modal>
    </div>);
/*
export class UnboundOldFunctionEditor extends Component {
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
    if (this._textarea) {
      this._textarea.value = this.props.func;
    }
    const hdr = <div/>;//FunctionEditorHeader add={add} pos={pos} />;
    const clr = this.props.onClose;
    const clk = this.click;
    return (
      <Panel header={hdr}>
        <div className='ColJust' style={{padding:'4pt'}}>
          y&nbsp;=&nbsp;{ta}
        </div>
        <div className='ColJust' style={{padding: '4pt'}}>
          <Button bsSize='small' bsStyle='primary' style={btn} onClick={clk}>
            {`${add ? 'Add' : 'Save'}`}
          </Button>
          <Button bsSize='small' bsStyle='danger' style={btn} onClick={clr}>
            Clear
          </Button>
        </div>
      </Panel>);
  }
};
*/

UnboundFunctionEditor.propTypes = {
  onAddClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  func: PropTypes.string.isRequired,
  pos: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired
};

const FunctionEditor = connect(
  // State to Props
  (state:GraphState) => ({
    pos: state.currentEdit,
    visible: state.editorOpen,
    func: (state.currentEdit < 0) ? 'x' : state.funcs[state.currentEdit].text
  }),
  // Dispatch to Handler Props
  (dispatch:(a:CoasterAction)=>void) => ({
    onSave: () => dispatch(Actions.SaveFunction()),
    onAddClick: () => dispatch(Actions.AddNewFunction()),
    onClose: () => dispatch(Actions.CloseEditor()),
    onChange: (expr:string) => dispatch(Actions.ChangeCurrentExpression(expr))
  })
)(UnboundFunctionEditor);

export default FunctionEditor;
