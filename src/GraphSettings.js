// @flow

import React from 'react';
import {Grid, Row, Col, Button, Checkbox} from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';

import {FileDialog} from './FileDialog';

import './bootstrap-slider-min.css';
import './App.css';

type GraphSettingsProps = {
  scale: number,
  time: number,
  running: boolean,
  onScaleChange: (a:string)=>void,
  onPlay: (a:boolean)=>void,
};

export const GraphSettings = ({
  scale,
  time,
  running,
  onScaleChange,
  onPlay
}:GraphSettingsProps) => {
  const timeInSeconds = time / 32;
  const min = Math.floor(timeInSeconds / 60);
  const sec = Math.round(10 * (timeInSeconds - min * 60)) / 10;
  const timeExpr = `${min}:${(sec<10)?'0':''}${sec}`;
  const pad = {padding:'3pt'};
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
      <Button onClick={() => onPlay(!running)} style={{flexGrow:1}}>
        {label}
      </Button>
      <div style={{width:'120pt',padding:'3pt'}}>
        Current time: {(time > 0) ? timeExpr : 'Stopped'}
      </div>
      <div style={{padding:'3pt'}}>Zoom:&nbsp;</div>
      <div style={{flexGrow:10}}>
        <ReactBootstrapSlider
          style={pad}
          value={scale}
          min={1}
          max={100}
          step={.01}
          orientation='horizontal'
          change={handler}
          slideStop={handler}/>
      </div>
      <FileDialog/>
    </div>
  );
};
