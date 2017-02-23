//@flow

import React, {Component, PropTypes} from 'react';
import {
  Modal,
  Button,
  DropdownButton,
  Tabs,
  Tab,
  MenuItem,
  Panel,
  Form,
  FormGroup,
  FormControl,
  Checkbox,
  ControlLabel,
  Col
} from 'react-bootstrap';

import type {FuncArray} from './UserFunction';

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
  loadSelection:string,
  saveName:string,
  cart:boolean,
  velocity:boolean,
  labels:boolean,
  funcsets: Map<string,string>
};
type FileDialogProps = {
  cart: boolean,
  velocity: boolean,
  labels: boolean,
  curFuncs: FuncArray,
  onSave: (cart: boolean, velocity: boolean, labels: boolean) => void,
  onLoad: (funcSet: FuncArray) => void,
}

export class FileDialog extends Component {
  state:FileDialogState = {
    showModal:false,
    selected:1,
    loadSelection:'',
    saveName:'',
    cart:true,
    velocity:false,
    labels:true,
    funcsets:new Map()
  }
  constructor(props:FileDialogProps) {
    super(props);
    this.state.cart = props.cart;
    this.state.velocity = !props.velocity;
    this.state.labels = props.labels;
    const map:Map<string,string> = new Map([
      ['set numero uno', '1;2;sin(x)'],
      ['le set deux', '2;3;cos(x)'],
      ['troisieme', '3;5;x^2']
    ]);
    this.state.funcsets = map;
    this.state.loadSelection = 'le set deux';
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
  saveFuncSets = () => {
    // TODO: Save the func sets as name
    const m = this.state.funcsets;
    m.set(this.state.saveName, '1;2;3^x');
    this.setState({funcsets:m});
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
    const map:Map<string, string> = this.state.funcsets;
    const FuncSets = Array.from(map.keys()).map((k,i) => (
      <MenuItem key={i} eventKey={k} onSelect={this.loadSelect}>{k}</MenuItem>
    ));
    const FuncSetTitle = (map.size > 0) ? this.state.loadSelection :
      'No function sets available!';
    let disabled =
      (this.props.velocity === this.state.velocity) &&
      (this.props.cart === this.state.cart) &&
      (this.props.labels === this.state.labels);
    let buttonTitle = 'Save Settings';
    let doit = this.saveSettings;
    if (this.state.selected === 2) {
      buttonTitle = 'Load Function Set';
      disabled = (map.size === 0);
      doit = this.loadFuncSets;
    } else if (this.state.selected === 3) {
      buttonTitle = 'Save Function Set';
      disabled = this.state.saveName.length === 0;
      doit = this.saveFuncSets;
    }
    return (
      <div>
        <Button onClick={this.open}>{ButtonInfo}</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header>
            <Modal.Title>Load &amp; Save your functions</Modal.Title>
          </Modal.Header>
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
                  </Form>
                </Panel>
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
            <Button bsStyle='primary' disabled={disabled} onClick={this.doit}>
              {buttonTitle}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
