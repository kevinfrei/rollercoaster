// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  FormControl,
  FormGroup,
  InputGroup,
  Modal
} from 'react-bootstrap';
import { connect } from 'react-redux';

import { Actions } from './Actions';

import './App.css';

import type { GraphState } from './StoreTypes';
import type { CoasterAction } from './Actions';

type FuncEditorProps = {
  onSave: (pos: number) => void,
  onClose: () => void,
  onAddClick: () => void,
  onChange: (expr: string) => void,
  func: string,
  pos: number,
  visible: boolean
};

export const UnboundFunctionEditor = ({
  onSave,
  onClose,
  onAddClick,
  onChange,
  func,
  pos,
  visible
}: FuncEditorProps) => (
  <div>
    <Button onClick={onAddClick} className="btnWidth">
      Add
    </Button>
    <Modal show={visible} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {pos === -1 ? 'Add New Function' : `Edit Function #${pos + 1}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup>
          <InputGroup>
            <InputGroup.Addon>y = </InputGroup.Addon>
            <FormControl
              type="text"
              defaultValue={func}
              onChange={e => onChange(e.target.value)}
            />
            <InputGroup.Button>
              <Button onClick={onSave}>Save</Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </Modal.Body>
    </Modal>
  </div>
);

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
  (state: GraphState) => ({
    pos: state.currentEdit,
    visible: state.editorOpen,
    func: state.currentEdit < 0 ? 'x' : state.funcs[state.currentEdit].text
  }),
  // Dispatch to Handler Props
  (dispatch: (a: CoasterAction) => void) => ({
    onSave: () => dispatch(Actions.SaveFunction()),
    onAddClick: () => dispatch(Actions.AddNewFunction()),
    onClose: () => dispatch(Actions.CloseEditor()),
    onChange: (expr: string) => dispatch(Actions.ChangeCurrentExpression(expr))
  })
)(UnboundFunctionEditor);

export default FunctionEditor;
