// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';

import './bootstrap-slider-min.css';
import './App.css';

type GraphSettingsProps = {
  onScaleChange: (a:string)=>void,
  onPlay: (a:boolean)=>void,
  scale: number,
  time: number,
  running: boolean
};

export const GraphSettings = (
  {onScaleChange, onPlay, scale, time, running}:GraphSettingsProps) => {
  const timeInSeconds = time / 32;
  const min = Math.floor(timeInSeconds / 60);
  const sec = Math.round(10 * (timeInSeconds - min * 60)) / 10;
  const timeExpr = `${min}:${(sec<10)?'0':''}${sec}`;
  const pad = {padding:'3pt'};
  const label = running ? '◾' : '▶'; // UTF8 Files :)
  const handler = e => onScaleChange(e.target.value);
  return (
    <div className='ColJust' style={{alignItems:'center', padding:'2pt'}}>
      <Button onClick={() => onPlay(!running)} style={{width:'30pt'}}>
        {label}
      </Button>
      <div style={pad}>Zoom:&nbsp;</div>
      <ReactBootstrapSlider
        style={pad}
        value={scale}
        min={5}
        max={100}
        step={1}
        orientation='horizontal'
        change={handler}
        slideStop={handler}/>
      <div style={pad}>
        Current time: {(time > 0) ? timeExpr : 'Stopped'}
      </div>
    </div>
  );
};
