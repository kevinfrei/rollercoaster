//@flow

import React, {Component} from 'react';
import {MakeVector, MakePoint} from './UserFunction';

import type {UserFunction, Vector, Point} from './UserFunction';
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

// Super duper exciting constants
const halfPi = Math.PI / 2;
const twoPi = Math.PI * 2;
const gravity = 9.8; // m/s^2
// This is probably worth doing, otherwise things fly off...
const friction = 1;

// Scale of the graph
const scale = 40;
// How many slices used to calculate random stuff
const timeSlice = 1/128;

// Function colors
const strokes = [
  '#0f0', '#00f', '#f00',
  '#0ff', '#f0f', '#ff0',
  '#800', '#080', '#008',
  '#088', '#808', '#880'];

// console.log helpers: text digits, text angle
const td = (n:number):number => Math.round(n * 100) / 100;
const ta = (n:number):number => td(n * Math.PI / 180);

// Helper functions
const distSquare = (pt:Point, x:number, y:number): number => {
  const xd = pt.x - x;
  const yd = pt.y - y;
  return xd * xd + yd * yd;
};
const dist = (pt:Point, x:number, y:number):number => {
  return Math.sqrt(distSquare(pt, x, y));
};
// I want to make sure that all angles I get are between pi and -pi
const NormalizeAngle = (n:number):number => {
  let res = n % twoPi;
  if (res > Math.PI) {
    res -= twoPi;
  }
  return res;
}

const xf = (x:number):number => 10.0 + x * scale;
const yf = (y:number):number => 500.0 - y * scale;

// TODO: Add some numeric labels, maybe?
const drawGraphPaper = (ctx:CanvasRenderingContext2D) => {
  for (let pos = -100; pos <= 120; pos += .5) {
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    if (Math.round(pos + .1) === Math.round(pos - .1)) {
      ctx.lineWidth = pos ? .2 : 1;
    } else {
      ctx.lineWidth = .05;
    }
    ctx.moveTo(xf(pos),yf(-100));
    ctx.lineTo(xf(pos),yf(100));
    ctx.moveTo(xf(-10), yf(pos));
    ctx.lineTo(xf(120), yf(pos));
    ctx.stroke();
  }
};


const drawFunctions =
  (ctx: CanvasRenderingContext2D, funcs: Array<UserFunction>):void => {
  let curStroke = 0;
  for (let f of funcs) {
    let x = f.endPoints.a.x;
    let y = f.endPoints.a.y;
    ctx.beginPath();
    ctx.strokeStyle = strokes[curStroke];
    ctx.fillStyle = strokes[curStroke];
    ctx.lineWidth = 0.25;
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
    ctx.arc(xf(f.endPoints.b.x), yf(f.endPoints.b.y), 2.5, 0, twoPi);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(xf(f.endPoints.a.x), yf(f.endPoints.a.y), 2.5, 0, twoPi);
    ctx.fill();
  }
};

const getTangentAngle =
  (x: number, dir: boolean, func: (x: number) => number): number => {
  // Stupid approximation :(
  const slice = dir ? 1e-10 : -1e-10;
  const y = func(x);
  const y2 = func(x + slice);
  const delta = y2 - y;
  return NormalizeAngle(Math.atan2(delta, slice));
};

let resMap: Array<Vector> = [];

const getPosition = (funcs:Array<UserFunction>, time:number):Vector => {
  // Okay, reasonable way to simulate gravity? Just calculate it cumulatively
  // because I've forgotten the Calculus necessary to do it accurately :/
  const func:UserFunction = funcs[0];
  let vec:Vector = MakeVector(func.endPoints.a, 0, 0, true);

  for (let idx = 0; idx <= time / timeSlice; idx++) {
    if (resMap[idx]) {
      // Dynamic programming, FTW...
      vec = resMap[idx];
      continue;
    }
    // First, approximate the tangent to the curve at the current location
    if (vec.origin.x > 2)
      debugger;
    const direction = Math.abs(vec.angle) < halfPi;
    const tangent = getTangentAngle(vec.origin.x, direction, func.func);
    const normal = NormalizeAngle(tangent + halfPi);

    //const normal = tangent + Math.PI/2;
    const normalForce = vec.line ? Math.cos(normal) : 1.0;
    const A = friction * gravity * normalForce; // Tangential acceleration!
    // const N = gravity * Math.sin(tangent); // This goes away (Normal force)

    const Ax = A * (vec.line ? Math.cos(tangent) : 0);
    const Ay = A * (vec.line ? Math.sin(tangent) : -1);

    const Vx = vec.magnitude * Math.cos(vec.angle);
    const Vy = vec.magnitude * Math.sin(vec.angle);

/*
    console.log({A:`${td(A)},${td(Ax)},${td(Ay)}`, V:td(vec.magnitude),
      Pos:`${td(vec.origin.x)},${td(vec.origin.y)}`});
*/

    const x = Ax * timeSlice * timeSlice + Vx * timeSlice + vec.origin.x;
    const yc = Ay * timeSlice * timeSlice + Vy * timeSlice + vec.origin.y;
    const yf = func.func(x); // The point on the track

    // TODO: pick which y to report:
    // If it's "below" the track, then it's the function value.
    // If it's "above" the track, then it's the calculcated value.

    // Calculate the angle from the origin to the calculated point
    // as well as to the 'track' point,
    // And compare it to the angle of the tangent. If it's within 90 degrees of
    // the normal, you're off the track (so return the calculated point)

    const calcAngle = NormalizeAngle(Math.atan2(yc - vec.origin.y, x - vec.origin.x));
    const trackAngle = NormalizeAngle(Math.atan2(yf - vec.origin.y, x - vec.origin.x));
    const calcd = Math.abs(normal - calcAngle);
    const trackd = Math.abs(normal - trackAngle);
    const overTheLine = calcd > trackd;
    // console.log({c:ta(calcAngle), n:ta(normal), cd:ta(calcd), td:ta(trackd), o:overTheLine});

    const y = overTheLine ? yf : yc;
    const vectorDirection = NormalizeAngle(Math.atan2(y - vec.origin.y, x - vec.origin.x));
    vec = MakeVector(MakePoint(x, y), vectorDirection,
                     dist(vec.origin, x, y) / timeSlice, overTheLine);
    resMap[idx] = vec;
  }

  /*console.log({
    x : td(vec.origin.x),
    y : td(vec.origin.y),
    degs : td(vec.angle * 180 / Math.PI),
    mag : td(vec.magnitude)
  });*/
  return vec;
};

const hx = (i:number):string => {
  const str = Math.round(i).toString(16);
  return str.length === 1 ? `0${str}` : str;
};

export class FuncGraph extends Component {
  componentDidMount() { this.updateCanvas(); }
  updateCanvas() {
    const ctx:CanvasRenderingContext2D = this.refs.FuncGraph.getContext('2d');
    const funcs:Array<UserFunction> = this.props.funcs;
    drawGraphPaper(ctx);
    drawFunctions(ctx, funcs);
    for (let t = 0; t <= 18; t += .03125) {
      const vec:Vector = getPosition(funcs, t);
      ctx.beginPath();
      const n = Math.round(t * 255 / 18);
      ctx.fillStyle = `#${hx(n)}${hx((n * 5) % 255)}${hx((n * 3) % 255)}`;
      ctx.arc(xf(vec.origin.x), yf(vec.origin.y), 1.5, 0, twoPi);
      ctx.fill();
      /*
      ctx.beginPath();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = .2;
      const xo = vec.origin.x;
      const yo = vec.origin.y;
      ctx.moveTo(xf(xo), yf(yo));
      const xe = xo + Math.cos(vec.angle+Math.PI/2) * vec.magnitude;
      const ye = yo + Math.sin(vec.angle+Math.PI/2) * vec.magnitude;
      ctx.lineTo(xf(xe), yf(ye));
      ctx.stroke();
      */
    }
  }
  render() {
    const s = {border : '1px solid #91f'};
    return (<canvas ref='FuncGraph' width={800} height={800} style={s}/>);
  }
};
