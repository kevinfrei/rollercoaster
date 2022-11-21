import { ModalDialog } from './ModalDialog';

/*
import React, {PropTypes} from 'react';
import {
  Button,
  FormControl,
  FormGroup,
  InputGroup,
  HelpBlock,
  Modal} from 'react-bootstrap';
import {connect} from 'react-redux';

import {Actions} from './Actions';

import './App.css';

import type {GraphState} from './StoreTypes';
import type {CoasterAction} from './Actions';
*/

type FuncEditorProps = {
  onSave: (pos: number) => void;
  onClose: (cancel: boolean) => void;
  onAddClick: () => void;
  onChange: (expr: string) => void;
  func: string;
  pos: number;
  visible: boolean;
};

export function FunctionEditor({
  onSave,
  onClose,
  onAddClick,
  onChange,
  func,
  pos,
  visible,
}: FuncEditorProps): JSX.Element {
  return (
    <ModalDialog
      visible={visible}
      close={onClose}
      title={pos === -1 ? 'Add New Function' : `Edit Function #${pos + 1}`}
    >
      <button onClick={onAddClick} className="btnWidth">
        Add
      </button>
      <div>y = </div>
      <input
        type="text"
        defaultValue={func}
        onChange={(e) => onChange(e.target.value)}
      />
      <button onClick={() => onSave(pos)}>Save</button>
    </ModalDialog>
  );
}
/*
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
*/
export {};
