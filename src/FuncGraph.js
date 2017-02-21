//@flow

import React, {Component, PropTypes} from 'react';

import {getPosition} from './PhysicSim';
import {FuncArrayString} from './UserFunction';

import type {Vector, FuncArray} from './UserFunction';

type FuncGraphProps = {
  funcs:FuncArray,
  selected:number,
  scale:number,
  time:number,
  showVector?:boolean,
  showCart?:boolean,
  size:{width:number, height:number}
};

// Super duper exciting constant
const twoPi = Math.PI * 2;
const halfPi = Math.PI / 2;
const qtrPi = Math.PI / 4;
const arrowAngle = Math.PI + Math.PI / 6;
const FPS = 60; // This should match what's set in index.js

// Function colors
const strokes = [
  '#060', '#006', '#600', '#066', '#606', '#660',
  '#A00', '#0A0', '#00A', '#0AA', '#A0A', '#AA0'
];

let scale = 20; // Scale of the graph
let graphStep = 0.25/scale; // The steps used for drawing the graph
let xo = 10;
let yo = 500;
const xu = (a: number): number => (a - xo) / scale;
const yu = (b: number): number => (b - yo) / -scale;

const freshContext = (canvas:?HTMLCanvasElement):CanvasRenderingContext2D => {
  if (!canvas) {console.log('oops');throw String('oops');}
  const ctx:?CanvasRenderingContext2D = canvas.getContext('2d');
  if (!ctx) throw String('testOnly');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(scale, 0, 0, -scale, xo, yo);
  return ctx;
};

const dot = (ctx:CanvasRenderingContext2D,
  x:number, y:number, r:number, style:string) => {
  ctx.beginPath();
  ctx.fillStyle = style;
  ctx.arc(x, y, r, 0, twoPi);
  ctx.closePath();
  ctx.fill();
};

const path = (ctx:CanvasRenderingContext2D, ...dots:Array<number>) => {
  let seen = false;
  for (let i = 0; i < dots.length + 1; i += 2) {
    const x = dots[i];
    const y = dots[i+1];
    if (seen) {
      ctx.lineTo(x, y);
    } else {
      ctx.moveTo(x, y);
      seen = true;
    }
  }
};

// This moves a point forward M units, at angle A
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
    if (Math.round(pos + .05) === Math.round(pos - .05)) {
      ctx.lineWidth = pos ? 1/64 : 1/16;
    } else {
      ctx.lineWidth = 1/256;
    }
    path(ctx, pos, yu(0), pos, yu(h));
    path(ctx, xu(0), pos, xu(w), pos);
    ctx.stroke();
  }
};

const drawVector = (ctx: CanvasRenderingContext2D, vec:Vector) => {
  // This draws the velocity vector on the graph
  const xo = vec.origin.x;
  const yo = vec.origin.y;
  const [xe, ye] = move(xo, yo, vec.angle, vec.magnitude);
  const [xl, yl] = move(xe, ye, vec.angle + arrowAngle, 1/4);
  const [xr, yr] = move(xe, ye, vec.angle - arrowAngle, 1/4);
  ctx.beginPath();
  path(ctx, xo, yo, xe, ye, xl, yl, xr, yr, xe, ye);
  ctx.closePath();
  ctx.strokeStyle = '#008';
  ctx.lineWidth = 1/16;
  ctx.fillStyle = '#008';
  ctx.stroke();
  ctx.fill();
};

const drawVehicle = (ctx: CanvasRenderingContext2D, vec:Vector, cart:?boolean) => {
  // This isn't a very attractive looking rollercoaster car...
  const carWidth = 1;
  const {x,y} = vec.origin;
  const a = vec.angle;
  if (!cart) {
    dot(ctx, x, y, .125, vec.line ? '#000' : '#F00');
    return;
  }
  const [rWheelX, rWheelY] = move(x, y, a, .5 * carWidth);
  const [lWheelX, lWheelY] = move(x, y, a + Math.PI, .5 * carWidth);
  const na = (Math.abs(a) > halfPi) ? -qtrPi : qtrPi;
  const [rTopX, rTopY] = move(x, y, a + na, carWidth * 1.5);
  const [lTopX, lTopY] = move(x, y, a - na + Math.PI, carWidth * 1.5);

  ctx.beginPath();
  path(ctx, rWheelX, rWheelY, rTopX, rTopY, lTopX, lTopY, lWheelX, lWheelY);
  ctx.fillStyle = '#632';//vec.line ? '#632' : '#F00'; For when it's off track?
  ctx.closePath();
  ctx.fill();
  dot(ctx, lWheelX, lWheelY, .15 * carWidth, '#000');
  dot(ctx, rWheelX, rWheelY, .15 * carWidth, '#000');
};

export class FuncGraph extends Component {
  // Flow annotations
  CarGraph:?HTMLCanvasElement;
  FuncGraph:?HTMLCanvasElement;
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
      ctx.beginPath();
      ctx.strokeStyle = strokes[curStroke];
      ctx.fillStyle = strokes[curStroke];
      ctx.lineWidth = 1/16;
      curStroke = (curStroke + 1) % strokes.length;
      ctx.moveTo(x, y);
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
          ctx.lineTo(x, y);
        x += graphStep;
      }
      y = f.func(e);
      ctx.lineTo(e, y);
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
    const funcs: FuncArray = this.props.funcs;
    const funcStr = FuncArrayString(funcs) + scale;
    if (this.state.lastFuncs !== funcStr ||
      this.state.size.w !== this.curSize.w ||
      this.state.size.h !== this.curSize.h) {
      // We want an early exit, because we're overriding the rendering logic...
      const ctx:CanvasRenderingContext2D = freshContext(this.FuncGraph);
      drawGraphPaper(ctx, this.curSize);
      this.drawFunctions(ctx, funcs);
      this.setState({lastFuncs:funcStr, size:this.curSize});
    }
    const ctx:CanvasRenderingContext2D = freshContext(this.CarGraph);
    // If we're stopped, don't draw the dot
    if (this.props.time < 0)
      return;
    const t = this.props.time / FPS;
    const vec: Vector = getPosition(funcs, t);
    drawVehicle(ctx, vec, this.props.showCart);
    if (this.props.showVector) {
      drawVector(ctx, vec);
    }
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
        <canvas ref={(fg:HTMLCanvasElement) => this.FuncGraph = fg}
          width={w} height={h} style={s}/>
        <canvas ref={(cg:HTMLCanvasElement) => this.CarGraph = cg}
          width={w} height={h} style={s}/>
      </div>
    );
  }
};

FuncGraph.propTypes = {
  funcs: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  showVector: PropTypes.bool,
  showCart: PropTypes.bool,
  size: PropTypes.shape({
    width:PropTypes.number.isRequired,
    height:PropTypes.number.isRequired}
  ).isRequired
};
