// @flow
import React, {Component, PropTypes} from 'react';
import {
  Button,
  FormControl,
  FormGroup,
  InputGroup,
  Modal,
  Panel} from 'react-bootstrap';
import {connect} from 'react-redux';

import {Actions} from './Actions';

import './App.css';

import type {GraphState} from './StoreTypes';
import type {CoasterAction} from './Actions';

type FuncEditorProps = {
  onSave: (pos:number, func:string)=>void,
  onClose: () => void,
  onAddClick: () => void,
  func: string,
  pos: number,
  visible: boolean
};

type FuncEditorState = {
  value: string
};

export class UnboundFunctionEditor extends Component {
  props:FuncEditorProps;
  TextArea:?HTMLTextAreaElement;
  state:FuncEditorState;
  constructor(props:FuncEditorProps) {
    super(props);
    this.state = {value:props.func};
  }
  handleChange = (e:Event) => {
    // TODO: Function validation here?
    if (e.target && e.target.value && typeof e.target.value === 'string')
      this.setState({value: e.target.value})
  }
  clickSave = () => {
    this.props.onSave(this.props.pos, this.state.value);
    this.props.onClose();
  }
  render() {
    return (<div>
      <Button onClick={this.props.onAddClick} className='btnWidth'>Add</Button>
      <Modal show={this.props.visible} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create/Edit Function</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <InputGroup>
              <InputGroup.Addon>y = </InputGroup.Addon>
              <FormControl type="text" value={this.state.value}
                onChange={this.handleChange}/>
              <InputGroup.Button>
                <Button onClick={this.clickSave}>Save</Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Modal.Body>
      </Modal>
    </div>);
  }
}
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
  func: PropTypes.string.isRequired,
  pos: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired
};

const FunctionEditor = connect(
  // State to Props
  (state:GraphState) => ({
    pos: state.currentEdit,
    visible: state.editorOpen,
    func: (state.currentEdit < 0) ? 'x' : String(state.funcs[state.currentEdit].text)
  }),
  // Dispatch to Handler Props
  (dispatch:(a:CoasterAction)=>void) => ({
    onSave: (id:number, expr:string) =>
      dispatch((id >= 0)
        ? Actions.ChangeFunction(id, expr)
        : Actions.AddFunction(expr)),
    onAddClick: () => dispatch(Actions.OpenEditor()),
    onClose: () => dispatch(Actions.CloseEditor())
  })
)(UnboundFunctionEditor);

export default FunctionEditor;
