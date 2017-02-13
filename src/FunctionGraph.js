//@flow

import React, {Component} from 'react';
import {getPosition} from './PhysicSim';

import type {UserFunction, Vector} from './UserFunction';

// Super duper exciting constants
const twoPi = Math.PI * 2;
const scale = 25; // Scale of the graph
const graphStep = 1e-2; // The steps used for drawing the graph
// Function colors
const strokes = [
  '#040', '#004', '#400', '#044', '#404', '#440',
  '#800', '#080', '#008', '#088', '#808', '#880'
];

const xf = (x: number): number => 10.0 + x * scale;
const yf = (y: number): number => 500.0 - y * scale;

// TODO: Add some numeric labels, maybe?
const drawGraphPaper = (ctx: CanvasRenderingContext2D) => {
  for (let pos = -100; pos <= 120; pos += .5) {
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    if (Math.round(pos + .1) === Math.round(pos - .1)) {
      ctx.lineWidth = pos ? .15 : .5;
    } else {
      ctx.lineWidth = .05;
    }
    ctx.moveTo(xf(pos), yf(-100));
    ctx.lineTo(xf(pos), yf(100));
    ctx.moveTo(xf(-10), yf(pos));
    ctx.lineTo(xf(120), yf(pos));
    ctx.stroke();
  }
};

const drawFunctions =
  (ctx: CanvasRenderingContext2D, funcs: Array<UserFunction>): void => {
  let curStroke = 0;
  for (let f of funcs) {
    let x = f.range.low;
    let y = f.func(x);
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(xf(x), yf(y), 2.5, 0, twoPi);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = strokes[curStroke];
    ctx.fillStyle = strokes[curStroke];
    ctx.lineWidth = 0.25;
    curStroke = (curStroke + 1) % strokes.length;
    ctx.moveTo(xf(x), yf(y));
    const e = f.range.high;
    while (x < e) {
      let fail = false;
      try {
        y = f.func(x);
        fail = Number.isNaN(y);
      } catch (e) {
        fail = true;
      }
      if (!fail)
        ctx.lineTo(xf(x), yf(y));
      x += graphStep;
    }
    y = f.func(e);
    ctx.lineTo(xf(e), yf(y));
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(xf(e), yf(y), 2.5, 0, twoPi);
    ctx.fill();
  }
};

const hx = (i: number): string => {
  const str = Math.round(i).toString(16);
  return str.length === 1 ? `0${str}` : str;
};

const b = (i: number): string => {
  // This 'bounces' a value between 0 and 255, and returns it in hex
  return hx(Math.abs(255 - (i % 510)));
}

export class FuncGraph extends Component {
  componentDidMount() {
    this.updateCanvas();
  }
  updateCanvas() {
    const ctx: CanvasRenderingContext2D = this.refs.FuncGraph.getContext('2d');
    const funcs: Array<UserFunction> = this.props.funcs;
    drawGraphPaper(ctx);
    drawFunctions(ctx, funcs);
    for (let t = 0; t <= 60; t += .03125) {
      const vec: Vector = getPosition(funcs, t);
      ctx.beginPath();
      const n = Math.round(t * 32);
      ctx.fillStyle = `#${b(n)}${b((n + 128) * 5)}${b(n * 3)}`;
      ctx.arc(xf(vec.origin.x), yf(vec.origin.y), 1.5, 0, twoPi);
      ctx.fill();
      if (false) {
        // This draws the velocity vector on the graph
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = .2;
        const xo = vec.origin.x;
        const yo = vec.origin.y;
        ctx.moveTo(xf(xo), yf(yo));
        const xe = xo + Math.cos(vec.angle + Math.PI / 2) * vec.magnitude;
        const ye = yo + Math.sin(vec.angle + Math.PI / 2) * vec.magnitude;
        ctx.lineTo(xf(xe), yf(ye));
        ctx.stroke();
      }
    }
  }
  render() {
    const s = {border : '1px solid #91f', height : '600px', width : '600px'};
    return (<canvas ref='FuncGraph' width={800} height={800} style={s}/>);
  }
};
