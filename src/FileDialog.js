//@flow

import React, {Component, PropTypes} from 'react';
import {
  Button,
  Checkbox,
  Col,
  ControlLabel,
  DropdownButton,
  Form,
  FormControl,
  FormGroup,
  MenuItem,
  Modal,
} from 'react-bootstrap';
import {connect} from 'react-redux';

import {
  ArrayToFuncSet,
  FuncSetToArray,
  LoadFuncSets,
  SaveFuncSets
} from './LoadSave';
import {Actions} from './coasterRedux';

import type {FuncArray} from './UserFunction';
import type {FuncSetsType, FlatFunc} from './LoadSave';
import type {GraphState, CoasterAction} from './coasterRedux';

type FileDialogState = {
  showModal : boolean,
  // settings: {
  cart : boolean,
  velocity : boolean,
  labels : boolean,
  //},
  // loader: {
  loadSelection : string,
  funcsets : FuncSetsType;
  //},
  // saver: {
  saveName : string,
  //},
};

type FileDialogProps = {
  cart : boolean,
  velocity : boolean,
  labels : boolean,
  curFuncs : FuncArray,
  onSave : (cart: boolean, velocity: boolean, labels: boolean) => void,
  onLoad : (funcSet: FuncArray) => void,
};

export class UnboundFileDialog extends Component {
  state: FileDialogState;
  constructor(props: FileDialogProps) {
    super(props);
    this.state = {
      showModal : false,

      cart : props.cart,
      velocity : props.velocity,
      labels : props.labels,

      loadSelection : '',
      funcsets : new Map(),

      saveName : ''
    };
  }
  open = () => {
    this.setState({showModal : true});
  }
  close = () => {
    this.setState({showModal : false});
  }
  loadSelect = (which: string) => {
    this.setState({loadSelection : which})
  }
  cart = () => {
    this.props.onSave(!this.state.cart, this.state.velocity, this.state.labels);
    this.setState({cart: !this.state.cart});
  }
  velocity = () => {
    this.props.onSave(this.state.cart, !this.state.velocity, this.state.labels);
    this.setState({velocity: !this.state.velocity});
  }
  labels = () => {
    this.props.onSave(this.state.cart, this.state.velocity, !this.state.labels);
    this.setState({labels: !this.state.labels});
  }
  changeName = (e) => this.setState({saveName : e.target.value});
  saveFuncSet = () => {
    const funcSet:Array<FlatFunc> = ArrayToFuncSet(this.props.curFuncs);
    const fs = this.state.funcsets;
    fs.set(this.state.saveName, funcSet);
    SaveFuncSets(fs);
    this.setState({funcsets: fs, loadSelection:this.state.saveName});
  }
  delFuncSet = () => {
    // TODO: Build a UI, and add the capability to delete a saved FuncSet
  }
  loadFuncSets = () => {
    this.props.onLoad(this.state.loadSelection);
  }
  saveSettings = () => {
    this.props.onSave(this.state.cart, this.state.velocity, this.state.labels);
    this.close();
  }
  render() {
    const ButtonInfo = '⚙/💾'; // I love UTF8...
    const map: FuncSetsType = this.state.funcsets;
    const FuncSets = Array.from(map.keys()).map((k,i) => (
      <MenuItem key={i} eventKey={k} onSelect={this.loadSelect}>{k}</MenuItem>
    ));
    const FuncSetTitle = (map.size > 0) ? this.state.loadSelection :
      'No function sets available!';
    return (
      <div>
        <Button onClick={this.open}>{ButtonInfo}</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Settings, Loading, Saving (and eventually import/export)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup>
                <Col smOffset={1} sm={4}>
                  <Checkbox checked={this.state.labels}
                    onChange={this.labels}>
                    Show labels on axes
                  </Checkbox>
                </Col>
                <Col sm={4}>
                  <Checkbox checked={this.state.velocity}
                    onChange={this.velocity}>
                    Show velocity vector
                  </Checkbox>
                </Col>
                <Col sm={3}>
                  <Checkbox checked={this.state.cart}
                    onChange={this.cart}>
                    Show cart
                  </Checkbox>
                </Col>
              </FormGroup>
              <FormGroup controlId='formLoadFuncSet'>
                <Col componentClass={ControlLabel} sm={3}>
                  Available&nbsp;sets&nbsp;to&nbsp;load
                </Col>
                <Col sm={5}>
                  <DropdownButton
                    title={FuncSetTitle}
                    disabled={map.size === 0}
                    id='ddb'>
                    {FuncSets}
                  </DropdownButton>
                </Col>
                <Col sm={2}>
                    <Button
                      bsStyle='primary'
                      disabled={map.size === 0}
                      style={{width:78}}
                      onClick={this.loadFuncSets}>
                      Load
                    </Button>
                  </Col>
                  <Col sm={2}>
                    <Button
                      bsStyle='danger'
                      disabled={map.size === 0}
                      style={{width:78}}
                      onClick={this.loadFuncSets}>
                      Delete
                    </Button>
                </Col>
              </FormGroup>
              <FormGroup controlId='formSaveFuncSet'>
                <Col componentClass={ControlLabel} sm={3}>
                  Current&nbsp;set&nbsp;name
                </Col>
                <Col sm={5}>
                  <FormControl type='text' value={this.state.saveName}
                    onChange={this.changeName}/>
                </Col>
                <Col sm={4}>
                  <Button
                    bsStyle='primary'
                    style={{width:78}}
                    disabled={this.state.saveName.length === 0}
                    onClick={this.saveFuncSet}>
                    Save Set
                  </Button>
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

UnboundFileDialog.propTypes = {
  cart: PropTypes.bool.isRequired,
  velocity: PropTypes.bool.isRequired,
  labels: PropTypes.bool.isRequired,
  curFuncs: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    func: PropTypes.func.isRequired,
    range: PropTypes.shape({
      low: PropTypes.number.isRequired,
      high: PropTypes.number.isRequired
    })
  })),
  onSave: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired
};

const FileDialog = connect(
  // State to Props
  (state:GraphState) => ({
    cart: state.showCart,
    velocity: state.showVector,
    labels: state.showLabels,
    curFuncs: state.funcs
  }),
  //TODO: Dispatch to Handler Props
  (dispatch:(a:CoasterAction)=>void) => ({
    onSave: (cart: boolean, velocity: boolean, labels: boolean):void =>
      dispatch(Actions.Settings(cart, velocity, labels)),
    onLoad: (funcSet: FuncArray): void => dispatch(Actions.AllFuncs(funcSet))
  })
)(UnboundFileDialog);

export default FileDialog;
