//@flow

import React, {Component} from 'react';

import {getPosition} from './PhysicSim';
import {FuncArrayString} from './UserFunction';

import type {Vector, FuncArray} from './UserFunction';

type FuncGraphProps = {
  funcs:FuncArray,
  selected:number,
  scale:number,
  time:number,
  size:{width:number, height:number}
};

// Super duper exciting constant
const twoPi = Math.PI * 2;
const halfPi = Math.PI / 2;
const qtrPi = Math.PI / 4;
const arrowAngle = Math.PI + Math.PI / 6;
const FPS = 60;

// Function colors
const strokes = [
  '#060', '#006', '#600', '#066', '#606', '#660',
  '#A00', '#0A0', '#00A', '#0AA', '#A0A', '#AA0'
];

/*
const hx = (i: number): string => {
  const str = Math.round(i).toString(16);
  return str.length === 1 ? `0${str}` : str;
};
const b = (i: number): string => {
  // This 'bounces' a value between 0 and 255, and returns it in hex
  return hx(Math.abs(255 - (i % 510)));
}
*/

// This isn't particularly safe, but I hate typing "this.xf(x)" everywhere :(
let scale = 30; // Scale of the graph
let graphStep = 0.25/scale; // The steps used for drawing the graph
let xo = 10;
let yo = 500;
const xf = (x: number): number => xo + x * scale;
const yf = (y: number): number => yo - y * scale;
const xu = (a: number): number => (a - xo) / scale;
const yu = (b: number): number => (b - yo) / scale;

const dot = (ctx:CanvasRenderingContext2D,
  x:number, y:number, r:number, style:string) => {
  ctx.beginPath();
  ctx.fillStyle = style;
  ctx.arc(xf(x), yf(y), r*scale, 0, twoPi);
  ctx.closePath();
  ctx.fill();
};

const path = (ctx:CanvasRenderingContext2D, ...dots:Array<number>) => {
  let seen = false;
  for (let i = 0; i < dots.length + 1; i += 2) {
    const x = dots[i];
    const y = dots[i+1];
    if (seen) {
      ctx.lineTo(xf(x), yf(y));
    } else {
      ctx.moveTo(xf(x), yf(y));
      seen = true;
    }
  }
};

const move = (x, y, a, m) => {
  return [x + Math.cos(a) * m, y + Math.sin(a) * m];
};

const drawGraphPaper = (
  ctx: CanvasRenderingContext2D, {w, h}:{w:number, h:number}) => {
  // TODO: Add some numeric labels
  const x1 = xu(0);
  const y1 = yu(0);
  const x2 = xu(w);
  const y2 = yu(h);
  const low = Math.min(x1,y1,x2,y2);
  const high = Math.max(x1,y1,x2,y2);
  for (let pos = Math.round(low); pos <= high; pos += .5) {
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    if (Math.round(pos + .1) === Math.round(pos - .1)) {
      ctx.lineWidth = pos ? .15 : .5;
    } else {
      ctx.lineWidth = .05;
    }
    ctx.moveTo(xf(pos), 0);
    ctx.lineTo(xf(pos), h);
    ctx.moveTo(0, yf(pos));
    ctx.lineTo(w, yf(pos));
    ctx.stroke();
  }
};

const drawVector = (ctx: CanvasRenderingContext2D, vec:Vector) => {
  // This draws the velocity vector on the graph
  const xo = vec.origin.x;
  const yo = vec.origin.y;
  const [xe, ye] = move(xo, yo, vec.angle, vec.magnitude);
  const [xl, yl] = move(xe, ye, vec.angle + arrowAngle, .3);
  const [xr, yr] = move(xe, ye, vec.angle - arrowAngle, .3);
  ctx.beginPath();
  path(ctx, xo, yo, xe, ye, xl, yl, xr, yr, xe, ye);
  ctx.closePath();
  ctx.strokeStyle = '#008';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#008';
  ctx.stroke();
  ctx.fill();
};

const drawVehicle = (ctx: CanvasRenderingContext2D, vec:Vector) => {
  // This isn't a very attractive looking rollercoaster car...
  const carWidth = 1;
  const {x,y} = vec.origin;
  const a = vec.angle;
  //dot(ctx, x, y, 8, vec.line ? '#000' : '#F00');
  const [rWheelX, rWheelY] = move(x, y, a, carWidth / 2);
  const [lWheelX, lWheelY] = move(x, y, a + Math.PI, carWidth / 2);
  const na = (Math.abs(a) > halfPi) ? -qtrPi : qtrPi;
  const [rTopX, rTopY] = move(x, y, a + na, carWidth * 1.5);
  const [lTopX, lTopY] = move(x, y, a - na + Math.PI, carWidth * 1.5);

  ctx.beginPath();
  path(ctx, rWheelX, rWheelY, rTopX, rTopY, lTopX, lTopY, lWheelX, lWheelY);
  ctx.fillStyle = '#632';//vec.line ? '#632' : '#F00'; For when it's off track
  ctx.closePath();
  ctx.fill();
  dot(ctx, lWheelX, lWheelY, .2 * carWidth, '#000');
  dot(ctx, rWheelX, rWheelY, .2 * carWidth, '#000');
  if (true) {
    drawVector(ctx, vec);
  }
};

export class FuncGraph extends Component {
  props:FuncGraphProps;
  state:{lastFuncs:string, size:{w:number, h:number}};
  curSize:{w:number, h:number};
  constructor(props:FuncGraphProps) {
    super(props);
    this.state = {lastFuncs:'', size:{w:600, h:600}};
  }

  // This draws the lines for the function on the graph:
  drawFunctions(ctx: CanvasRenderingContext2D, funcs: FuncArray): void {
    let curStroke = 0;
    for (let f of funcs) {
      let x = f.range.low;
      let y = f.func(x);
      dot(ctx, x, y, .1, '#000');
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
      dot(ctx, e, y, .1, '#000');
    }
  }
  componentDidMount() {
    this.updateCanvas();
  }
  componentDidUpdate() {
    this.updateCanvas();
  }
  updateCanvas() {
    let canvas = this.refs.FuncGraph;
    let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    if (!ctx)
      return;
    const funcs: FuncArray = this.props.funcs;
    const funcStr = FuncArrayString(funcs) + scale;
    if (this.state.lastFuncs !== funcStr ||
      this.state.size.w !== this.curSize.w ||
      this.state.size.h !== this.curSize.h) {
      // We want an early exit, because we're overriding the rendering logic...
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGraphPaper(ctx, this.curSize);
      this.drawFunctions(ctx, funcs);
      this.setState({lastFuncs:funcStr, size:this.curSize});
    }
    canvas = this.refs.CarGraph;
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // If we're stopped, don't draw the dot
    if (this.props.time < 0)
      return;
    const t = this.props.time / FPS;
    const vec: Vector = getPosition(funcs, t);
    drawVehicle(ctx, vec);
  }
  updateSize(w:number, h:number) {
    this.curSize = {w,h};
    yo = h * .75;
    xo = w * .01
  }
  render() {
    scale = this.props.scale || 30;
    graphStep = 1/scale;
    const left = document.getElementById('left');
    const bottom = document.getElementById('bottom');
    let w = 600;
    let h = 600;
    if (left && this.props.size.width > 0 && left.clientWidth > 0) {
      w = Math.max(w, this.props.size.width - left.clientWidth - 4);
    }
    if (bottom && this.props.size.height > 0 && bottom.scrollHeight > 0) {
      h = Math.max(h, this.props.size.height - bottom.scrollHeight - 4);
    }
    this.updateSize(w,h);
    const hpx = `${h}px`;
    const wpx = `${w}px`;
    const s = {
      border: '4px solid #000',
      height: hpx,
      width: wpx,
      position: 'absolute',
      top: 0,
      left: 0
    };
    return (
      <div style={{position:'relative', height: hpx, width:wpx}}>
        <canvas ref='FuncGraph' width={w} height={h} style={s}/>
        <canvas ref='CarGraph' width={w} height={h} style={s}/>
      </div>
    );
  }
};
