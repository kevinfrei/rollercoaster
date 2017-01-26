//@flow

import React, {Component} from 'react';

import type {UserFunction, Point} from './UserFunction';
/*
export const FuncRange = ({Low, High}:{Low:number, High: number}) => {
  return (<div><span>Range:</span>{Low} - {High}</div>);
};

export const FuncItem = ({userFunc}:{userFunc: UserFunction}) => {
  return (<div>
    <div>{userFunc.text}</div>
    <div>Low: {userFunc.range.low},{userFunc.func(userFunc.range.low)}</div>
    <div>Low: {userFunc.range.high},{userFunc.func(userFunc.range.high)}</div>
    <FuncRange Low={userFunc.range.low} High={userFunc.range.high}/>
  </div>);
};

// Needs wired to Redux, as it affects state
export const FuncAdder = () => {
  return (<div>This will be a func data entry thing...</div>);
};
*/

export type Position = {
  x: number,
  y: number,
  angle: number
};

const strokes = [
  '#f00', '#0f0', '#00f',
  '#0ff', '#f0f', '#ff0',
  '#800', '#080', '#008',
  '#088', '#808', '#880'];

const xf = (x:number) => 10.0 + x * 75.0;
const yf = (y:number) => 500.0 - y * 75.0;
// TODO: Add some numeric labels...
const drawGraphPaper = (ctx:CanvasRenderingContext2D) => {
  for (let pos = -10; pos <= 12; pos += .5) {
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    if (Math.round(pos + .1) === Math.round(pos - .1)) {
      ctx.lineWidth = pos ? .2 : 1;
    } else {
      ctx.lineWidth = .05;
    }
    ctx.moveTo(xf(pos),yf(-10));
    ctx.lineTo(xf(pos),yf(10));
    ctx.moveTo(xf(-1), yf(pos));
    ctx.lineTo(xf(12), yf(pos));
    ctx.stroke();
  }
};

const drawFunctions = (ctx:CanvasRenderingContext2D, funcs:Array<UserFunction>) =>    {
  let curStroke = 0;
  for (let f of funcs) {
    let x = f.endPoints.a.x;
    let y = f.endPoints.a.y;
    ctx.beginPath();
    ctx.strokeStyle = strokes[curStroke];
    ctx.fillStyle = strokes[curStroke];
    ctx.lineWidth = 1;
    curStroke = (curStroke + 1) % strokes.length;
    ctx.moveTo(xf(x), yf(y));
    const e = f.range.high;
    while (x < e) {
      y = f.func(x);
      ctx.lineTo(xf(x), yf(y));
      x += .01;
    }
    ctx.lineTo(xf(f.endPoints.b.x), yf(f.endPoints.b.y));
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(xf(f.endPoints.b.x), yf(f.endPoints.b.y), 2.5, 0,2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(xf(f.endPoints.a.x), yf(f.endPoints.a.y), 2.5, 0,2*Math.PI);
    ctx.fill();
  }
};

const getPosition = (funcs:Array<UserFunction>, time:number):Position => {
  // Okay, reasonable way to simulate gravity? Just calculate it, each time
  return {x:0, y:0, angle:0};
};

export class FuncGraph extends Component {
  componentDidMount() { this.updateCanvas(); }
  updateCanvas() {
    const ctx:CanvasRenderingContext2D = this.refs.FuncGraph.getContext('2d');
    const funcs:Array<UserFunction> = this.props.funcs;
    drawGraphPaper(ctx);
    drawFunctions(ctx, funcs);
    const pt = getPosition(funcs, 0);
  }
  render() {
    const s = {border : '1px solid #444'};
    return (
      <canvas
        ref='FuncGraph'
        width={800}
        height={800}
        style={s}/>
    );
  }
};
