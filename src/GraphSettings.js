// @flow

import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import {connect} from 'react-redux';

import FileDialog from './FileDialog';
import {Actions} from './coasterRedux';

import './bootstrap-slider-min.css';
import './App.css';

import type {GraphState, CoasterAction} from './coasterRedux';

type GraphSettingsProps = {
  scale: number,
  time: number,
  running: boolean,
  openDialogButton: mixed,
  onScaleChange: (a:string)=>void,
  onPlay: (a:boolean)=>void,
};

export const UnboundGraphSettings = ({
  scale,
  time,
  running,
  openDialogButton,
  onScaleChange,
  onPlay
}:GraphSettingsProps) => {
  const min = Math.floor(time / 60);
  const sec = Math.round(10 * (time - min * 60)) / 10;
  const timeExpr = `${min}:${(sec<10)?'0':''}${sec}`;
  const label = running ? '◾' : '▶'; // UTF8 Files :)
  const handler = (e:HTMLInputEvent) => onScaleChange(e.target.value);
  return (
    <div className='ColJust' style={{
      padding:'3pt',
      alignSelf:'stretch',
      justifyContent:'space-between',
      alignItems:'stretch',
      alignContent:'center'
    }}>
      <Button onClick={() => onPlay(!running)} style={{width:50}}>
        {label}
      </Button>
      <div style={{width:'120pt', padding:'5pt'}}>
        Current time: {(time > 0) ? timeExpr : 'Stopped'}
      </div>
      <div style={{padding:'5pt'}}>Zoom:&nbsp;</div>
      <div style={{flexGrow:10, padding:'5pt'}}>
        <ReactBootstrapSlider
          value={scale} orientation='horizontal'
          min={1} max={100} step={.01}
          change={handler} slideStop={handler}/>
      </div>
      {openDialogButton}
    </div>
  );
};

UnboundGraphSettings.propTypes = {
  scale: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  openDialogButton: PropTypes.element.isRequired,
  onScaleChange: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired
};

const GraphSettings = connect(
  // State to Props:
  (state:GraphState) => ({
    scale: state.scale,
    time: state.millisec/1000,
    running: state.running,
    openDialogButton: <FileDialog/>
  }),
  // Dispatch to Handler Prop
  (dispatch:(a:CoasterAction)=>void) => ({
    onPlay: (play:boolean) => dispatch(play ? Actions.Start() : Actions.Stop()),
    onScaleChange: (value:string) => dispatch(Actions.ChangeScale(value))
  })
)(UnboundGraphSettings);

export default GraphSettings;
