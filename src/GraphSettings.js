// @flow

import React from 'react';
import {Button, Checkbox} from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';

import './bootstrap-slider-min.css';
import './App.css';

type GraphSettingsProps = {
  scale: number,
  time: number,
  running: boolean,
  showVector:boolean,
  showCart:boolean,
  onScaleChange: (a:string)=>void,
  onPlay: (a:boolean)=>void,
  onShowVector: (a:boolean)=>void,
  onShowCart: (a:boolean)=>void
};

export const GraphSettings = ({
  scale,
  time,
  running,
  showVector,
  showCart,
  onShowVector,
  onShowCart,
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
    <div id='bottom' className='ColJust' style={{alignItems:'center', padding:'2pt'}}>
      <Button onClick={() => onPlay(!running)} style={{width:'30pt'}}>
        {label}
      </Button>
      <div className='RowJust' style={{padding:'2pt'}}>
        <Checkbox checked={showCart} onChange={()=>onShowCart(!showCart)}>
          Show Cart on Track
        </Checkbox>
        <Checkbox checked={showVector} onChange={()=>onShowVector(!showVector)}>
          Show Velocity Vector
        </Checkbox>
      </div>
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
