/*
import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import InputRange from 'react-input-range';

import {Actions} from './Actions';

import './bootstrap-slider-min.css';
import 'react-input-range/lib/css/index.css';
import './App.css';

import type {GraphState} from './StoreTypes';
import type {CoasterAction} from './Actions';

type GraphSettingsProps = {
  scale: number,
  time: number,
  maxTime: number,
  running: boolean,
  onScaleChange: (a:string) => void,
  onPlayPause: () => void,
  onStop: () => void,
  onSetTime: (msec:number) => void
};

const format = (msec:number, type:string):string=>{
  const time = msec / 1000;
  const min = Math.floor(time / 60);
  const sec = Math.round(10 * (time - min * 60)) / 10;
  return `${min}:${(sec<10)?'0':''}${sec}`;
};

export const UnboundGraphSettings = ({
  scale,
  time,
  running,
  maxTime,
  onScaleChange,
  onPlayPause,
  onStop,
  onSetTime
}:GraphSettingsProps) => (
    <div className='ColJust' style={{
      padding:'3pt',
      alignSelf:'stretch',
      justifyContent:'space-between',
      alignItems:'stretch',
      alignContent:'center'
      }}>
      <Button onClick={onPlayPause} style={{width:40, margin:2}}>
        {running ? '❚❚' : '▶'}
      </Button>
      <Button onClick={onStop} style={{width:40, margin:2}}>◾</Button>
      <div className='ColJust' style={{flexGrow:5, border:'solid black 1pt', margin:2}}>
        <div style={{padding:'5pt'}}>Time:</div>
        <div style={{flexGrow:5, padding:'8pt'}}>
          <InputRange
            value={time} step={25}
            minValue={0} maxValue={maxTime}
            formatLabel={format}
            onChange={onSetTime} onChangeComplete={onSetTime}/>
        </div>
      </div>
      <div className='ColJust' style={{flexGrow:5, border:'solid black 1pt', margin:2}}>
        <div style={{padding:'5pt'}}>Zoom:</div>
        <div style={{flexGrow:5, padding:'8pt'}}>
          <InputRange
            value={scale} step={.01}
            minValue={1} maxValue={50}
            formatLabel={(v:number, t:string) => (t==='value')? v.toString().substr(0, 5) : ''}
            onChange={onScaleChange} onChangeComplete={onScaleChange}/>
        </div>
      </div>
    </div>
  );


UnboundGraphSettings.propTypes = {
  scale: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  running: PropTypes.bool.isRequired,
  maxTime: PropTypes.number.isRequired,
  onScaleChange: PropTypes.func.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onSetTime: PropTypes.func.isRequired
};

const GraphSettings = connect(
  // State to Props:
  (state:GraphState) => ({
    scale: state.scale,
    time: state.millisec,
    running: state.running,
    maxTime: state.maxTime
  }),
  // Dispatch to Handler Prop
  (dispatch:(a:CoasterAction)=>void) => ({
    onPlayPause: () => dispatch(Actions.PlayPause()),
    onScaleChange: (value:string) => dispatch(Actions.ChangeScale(value)),
    onStop: () => dispatch(Actions.Stop()),
    onSetTime: (msec:number) => dispatch(Actions.SetTime(msec))
  })
)(UnboundGraphSettings);

export default GraphSettings;
*/
export {}