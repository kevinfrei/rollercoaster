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
  Panel,
  Tab,
  Tabs,
} from 'react-bootstrap';

import {
  LoadFuncSets, SaveFuncSets, FuncSetToArray, ArrayToFuncSet
} from './LoadSave';

import type {FuncArray} from './UserFunction';
import type {FuncSetsType} from './LoadSave';

/*
const loadState = ():LoadSaveState => ({
  selected:-1,
  funcLists:[]
});

const saveState = (st: LoadState, funcs:FuncArray, name:string) => {
  //CONTINUE HERE$$$ ### @@@
};
*/

type FileDialogState = {
  showModal:boolean,
  selected:number,
  //settings: {
    cart:boolean,
    velocity:boolean,
    labels:boolean,
  //},
  //loader: {
    loadSelection:string,
    funcsets: FuncSetsType;
  //},
  //saver: {
    saveName:string,
  //},
};

type FileDialogProps = {
  cart: boolean,
  velocity: boolean,
  labels: boolean,
  curFuncs: FuncArray,
  onSave: (cart: boolean, velocity: boolean, labels: boolean) => void,
  onLoad: (funcSet: FuncArray) => void,
};

export class FileDialog extends Component {
  state:FileDialogState;
  constructor(props:FileDialogProps) {
    super(props);
    this.state = {
      showModal:false,
      selected:1,

        cart: props.cart,
        velocity: props.velocity,
        labels: props.labels,

        loadSelection: 'le set deux',
        funcsets: new Map()/*props.curFuncs.map([
          ['set numero uno', '1;2;sin(x)'],
          ['le set deux', '2;3;cos(x)'],
          ['troisieme', '3;5;x^2']
        ]))*/,

        saveName:''
    };
  }
  open = () => {
    this.setState({showModal:true});
  }
  close = () => {
    this.setState({showModal:false});
  }
  tabSelect = (which:number) => {
    this.setState({selected: which});
  }
  loadSelect = (which:string) => {
    this.setState({loadSelection:which})
  }
  cart = () => this.setState({cart:!this.state.cart});
  velocity = () => this.setState({velocity:!this.state.velocity});
  labels = () => this.setState({labels:!this.state.labels});
  changeName = (e) => this.setState({saveName:e.target.value});
  saveFuncSet = () => {
    // TODO: Save the func sets as name
  }
  delFuncSet = () => {
    // TODO: Build a UI, and add the capability to delete a saved FuncSet
  }
  loadFuncSets = () => {
    // TODO: Load the func sets from name
    //this.props.onLoad(FuncArray);
  }
  saveSettings = () => {
    this.props.onSave(this.state.cart, this.state.velocity, this.state.labels);
    this.close();
  }
  render() {
    const ButtonInfo = '⚙/💾'; // I love UTF8...
    const map:FuncSetsType = this.state.funcsets;
    const FuncSets = Array.from(map.keys()).map((k,i) => (
      <MenuItem key={i} eventKey={k} onSelect={this.loadSelect}>{k}</MenuItem>
    ));
    const FuncSetTitle = (map.size > 0) ? this.state.loadSelection :
      'No function sets available!';
    return (
      <div>
        <Button onClick={this.open}>{ButtonInfo}</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Body>
            <Tabs defaultActiveKey={1} id='LoadSaveSettings' onSelect={this.tabSelect}>
              <Tab eventKey={1} title='Graph Settings'>
                <Panel>
                  <Form horizontal>
                    <FormGroup>
                      <Col smOffset={3} sm={6}>
                        <Checkbox checked={this.state.cart}
                          onChange={this.cart}>
                          Show cart
                        </Checkbox>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col smOffset={3} sm={6}>
                        <Checkbox checked={this.state.velocity}
                          onChange={this.velocity}>
                          Show velocity vector
                        </Checkbox>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col smOffset={3} sm={6}>
                        <Checkbox checked={this.state.labels}
                          onChange={this.labels}>
                          Draw numeric labels
                        </Checkbox>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col smOffset={3} sm={2}>
                        <Button onClick={this.close}>Close</Button>
                      </Col>
                      <Col smOffset={1} sm={2}>
                        <Button
                          bsStyle='primary'
                          disabled={(this.props.velocity === this.state.velocity) &&
                            (this.props.cart === this.state.cart) &&
                            (this.props.labels === this.state.labels)}
                          onClick={this.loadFuncSets}>
                          Save Settings
                        </Button>
                      </Col>
                    </FormGroup>
                  </Form>
                </Panel>
              </Tab>
              <Tab eventKey={2} title='Load Functions'>
                <Panel>
                  <Form horizontal>
                    <FormGroup controlId='formLoadFuncSet'>
                      <Col componentClass={ControlLabel} sm={4}>
                        Function&nbsp;Set&nbsp;Name
                      </Col>
                      <Col sm={8}>
                      <DropdownButton title={FuncSetTitle} id='ddb'>
                        {FuncSets}
                      </DropdownButton>
                    </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col smOffset={4} sm={2}>
                        <Button onClick={this.close}>Close</Button>
                      </Col>
                      <Col sm={6}>
                        <Button
                          bsStyle='primary'
                          disabled={map.size === 0}
                          onClick={this.loadFuncSets}>
                          Load Selected Function Set
                        </Button>
                      </Col>
                    </FormGroup>
                  </Form>
                </Panel>
              </Tab>
              <Tab eventKey={3} title='Save Functions'>
                <Panel>
                  <Form horizontal>
                    <FormGroup controlId='formSaveFuncSet'>
                      <Col componentClass={ControlLabel} sm={4}>
                        Function&nbsp;Set&nbsp;Name
                      </Col>
                      <Col sm={8}>
                        <FormControl type='text' value={this.state.saveName}
                        onChange={this.changeName}/>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col smOffset={4} sm={2}>
                        <Button onClick={this.close}>Close</Button>
                      </Col>
                      <Col sm={6}>
                      <Button
                        bsStyle='primary'
                        disabled={this.state.saveName.length === 0}
                        onClick={this.saveFuncSet}>
                        Save Current Function Set
                      </Button>
                      </Col>
                    </FormGroup>
                  </Form>
                </Panel>
              </Tab>
            </Tabs>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

FileDialog.propTypes = {
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
  }))
};
