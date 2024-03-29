import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import { settingsDialogVisibleState, showCartState, showLabelsState, showVelocityState } from './State';
/*import {
  ArrayToFuncSet,
  FuncSetToArray,
  LoadFuncSets,
  SaveFuncSets,
} from './LoadSave';
import type { FuncArray } from './UserFunction';
import type { FuncSetsType, FlatFunc } from './LoadSave';
*/
import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, ModalDialog } from './ModalDialog';

/*
type FileDialogProps = {
  cart: boolean;
  velocity: boolean;
  labels: boolean;
  curFuncs: FuncArray;
  onSave: (cart: boolean, velocity: boolean, labels: boolean) => void;
  onLoad: (funcSet: FuncArray) => void;
};
*/
export function SettingsDialog({
  visible,
  close,
}: {
  visible: boolean;
  close: (cancel: boolean) => void;
}): JSX.Element {
  const [showCart, setShowCart] = useRecoilState(showCartState);
  const [showLabels, setShowLabels] = useRecoilState(showLabelsState);
  const [showVelocity, setShowVelocity] = useRecoilState(showVelocityState);
  return (
    <ModalDialog
      visible={visible}
      close={close}
      closeButton={true}
      title="Settings"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          marginTop:15,
          rowGap:5,
          columnGap:15          
        }}
      >
        <div>Show Cart:</div>
        <Checkbox onClick={(v) => setShowCart(!v)} checked={showCart} />
        <div>Show Labels:</div>
        <Checkbox onClick={(v) => setShowLabels(!v)} checked={showLabels} />
        <div>Show Velocity:</div>
        <Checkbox onClick={(v) => setShowVelocity(!v)} checked={showVelocity} />
      </div>
    </ModalDialog>
  );
}
/*
export class UnboundFileDialog extends Component {
  state: FileDialogState;
  constructor(props: FileDialogProps) {
    super(props);
    const funcsets = LoadFuncSets();
    let loadSelection: string = '';
    for (loadSelection of funcsets.keys()) break;
    this.state = {
      showModal: false,

      cart: props.cart,
      velocity: props.velocity,
      labels: props.labels,

      loadSelection,
      funcsets,

      saveName: '',
    };
  }
  open = () => {
    this.setState({ showModal: true });
  };
  close = () => {
    this.setState({ showModal: false });
  };
  loadSelect = (which: string) => {
    this.setState({ loadSelection: which });
  };
  cart = () => {
    this.props.onSave(!this.state.cart, this.state.velocity, this.state.labels);
    this.setState({ cart: !this.state.cart });
  };
  velocity = () => {
    this.props.onSave(this.state.cart, !this.state.velocity, this.state.labels);
    this.setState({ velocity: !this.state.velocity });
  };
  labels = () => {
    this.props.onSave(this.state.cart, this.state.velocity, !this.state.labels);
    this.setState({ labels: !this.state.labels });
  };
  changeName = (e: HTMLInputEvent) =>
    this.setState({ saveName: e.target.value });
  saveFuncSet = () => {
    const funcSet: Array<FlatFunc> = ArrayToFuncSet(this.props.curFuncs);
    const funcsets = this.state.funcsets;
    funcsets.set(this.state.saveName, funcSet);
    SaveFuncSets(funcsets);
    this.setState({ funcsets: funcsets, loadSelection: this.state.saveName });
  };
  delFuncSet = () => {
    const funcsets = this.state.funcsets;
    funcsets.delete(this.state.loadSelection);
    let loadSelection: string = '';
    for (loadSelection of funcsets.keys()) break;
    SaveFuncSets(funcsets);
    this.setState({ funcsets, loadSelection });
  };
  loadFuncSets = () => {
    const funcArray: FuncArray = FuncSetToArray(
      this.state.funcsets,
      this.state.loadSelection,
    );
    this.props.onLoad(funcArray);
    this.close();
  };
  render() {
    const ButtonInfo = '⚙/💾'; // I love UTF8...
    const map: FuncSetsType = this.state.funcsets;
    const FuncSets = Array.from(map.keys()).map((k, i) => (
      <MenuItem key={i} eventKey={k} onSelect={this.loadSelect}>
        {k}
      </MenuItem>
    ));
    const FuncSetTitle =
      map.size > 0
        ? this.state.loadSelection.substring(0, 17)
        : 'No function sets available!';
    return (
      <div>
        <Button onClick={this.open} className="btnWidth">
          {ButtonInfo}
        </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>
              Settings, Loading, Saving (and eventually import/export)
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup>
                <Col smOffset={1} sm={4}>
                  <Checkbox checked={this.state.labels} onChange={this.labels}>
                    Show labels on axes
                  </Checkbox>
                </Col>
                <Col sm={4}>
                  <Checkbox
                    checked={this.state.velocity}
                    onChange={this.velocity}
                  >
                    Show velocity vector
                  </Checkbox>
                </Col>
                <Col sm={3}>
                  <Checkbox checked={this.state.cart} onChange={this.cart}>
                    Show cart
                  </Checkbox>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  Initial Cart Velocity:
                </Col>
                <Col sm={5}>
                  <FormControl
                    type="text"
                    value={this.props.initVelocity}
                    onChange={(e) =>
                      this.props.initVelocityChanged(parseFloat(e.target.value))
                    }
                  />
                </Col>
                <Col sm={4}>meters / second</Col>
              </FormGroup>
              <FormGroup controlId="formLoadFuncSet">
                <Col componentClass={ControlLabel} sm={3}>
                  Available&nbsp;sets&nbsp;to&nbsp;load
                </Col>
                <Col sm={5}>
                  <DropdownButton
                    title={FuncSetTitle}
                    disabled={map.size === 0}
                    id="ddb"
                  >
                    {FuncSets}
                  </DropdownButton>
                </Col>
                <Col sm={2}>
                  <Button
                    bsStyle="primary"
                    disabled={map.size === 0}
                    style={{ width: 78 }}
                    onClick={this.loadFuncSets}
                  >
                    Load
                  </Button>
                </Col>
                <Col sm={2}>
                  <Button
                    bsStyle="danger"
                    disabled={map.size === 0}
                    style={{ width: 78 }}
                    onClick={this.delFuncSet}
                  >
                    Delete
                  </Button>
                </Col>
              </FormGroup>
              <FormGroup controlId="formSaveFuncSet">
                <Col componentClass={ControlLabel} sm={3}>
                  Current&nbsp;set&nbsp;name
                </Col>
                <Col sm={5}>
                  <FormControl
                    type="text"
                    value={this.state.saveName}
                    onChange={this.changeName}
                  />
                </Col>
                <Col sm={4}>
                  <Button
                    bsStyle="primary"
                    style={{ width: 78 }}
                    disabled={this.state.saveName.length === 0}
                    onClick={this.saveFuncSet}
                  >
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
  curFuncs: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      func: PropTypes.func.isRequired,
      range: PropTypes.shape({
        low: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        high: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
      }),
    }),
  ),
  onSave: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired,
};

const FileDialog = connect(
  // State to Props
  (state: GraphState) => ({
    cart: state.showCart,
    velocity: state.showVector,
    labels: state.showLabels,
    curFuncs: state.funcs,
  }),
  //TODO: Dispatch to Handler Props
  (dispatch: dispatchType) => ({
    onSave: (cart: boolean, velocity: boolean, labels: boolean): void =>
      dispatch(Actions.Settings(cart, velocity, labels)),
    onLoad: (funcSet: FuncArray): void => {
      dispatch(Actions.AllFuncs(funcSet));
    },
  }),
)(UnboundFileDialog);

export default FileDialog;
*/
