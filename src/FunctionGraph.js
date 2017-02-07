//@flow

import React, {Component} from 'react';
import {MakeVector, MakePoint} from './UserFunction';

import type {UserFunction, Vector, Point} from './UserFunction';

type PointData = {
  tangent: number,
  normal: number
};

type ForceVectors = {
  Ax:number,
  Ay:number,
  Vx:number,
  Vy:number,
};

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
// This is probably worth doing
const friction = 1;

// Scale of the graph
const scale = 30;
// How many slices used to calculate random stuff
const timeSlice = 1/256;
const timeSliceSquared = timeSlice * timeSlice;

// Function colors
const strokes = [
  '#040', '#004', '#400',
  '#044', '#404', '#440',
  '#800', '#080', '#008',
  '#088', '#808', '#880'];

// console.log helpers: text digits, text angle
// const td = (n:number):number => Math.round(n * 10000) / 10000;
// const ta = (n:number):number => td(n * Math.PI / 180);

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

const getTangentAngle = (x: number, func: (x: number) => number): number => {
  // Stupid approximation :(
  const slice = 1e-10;
  const y = func(x);
  const y2 = func(x + slice);
  const delta = y2 - y;
  return NormalizeAngle(Math.atan2(delta, slice));
};

const GetPointData = (x:number, func:UserFunction):PointData => {
  const tangent = getTangentAngle(x, func.func);
  const normal = NormalizeAngle(tangent + halfPi);
  return {tangent, normal};
};

const CalcForceVectors = (vec:Vector, normal:number, tangent:number):ForceVectors => {
  const normalForce = vec.line ? Math.cos(normal) : 1.0;
  //if (!vec.line)
  //  debugger;
  const A = friction * gravity * normalForce; // Tangential acceleration!
  // const N = gravity * Math.sin(tangent); // This goes away (Normal force)

  const Ax = A * (vec.line ? Math.cos(tangent) : 0);
  const Ay = A * (vec.line ? Math.sin(tangent) : -1);

  const Vx = vec.magnitude * Math.cos(vec.angle);
  const Vy = vec.magnitude * Math.sin(vec.angle);
  return {Ax, Ay, Vx, Vy};
}

let resMap: Array<Vector> = [];

const getPosition = (funcs:Array<UserFunction>, time:number):Vector => {
  // Okay, reasonable way to simulate gravity? Just calculate it cumulatively
  // because I've forgotten the Calculus necessary to do it accurately :/
  let func:UserFunction = funcs[0];
  let funcPos = 0;
  let vec:Vector = MakeVector(func.endPoints.a, 0, 0, true);

  for (let idx = 0; idx <= time / timeSlice; idx++) {
    if (resMap[idx]) {
      // Dynamic programming, FTW...
      vec = resMap[idx];
      continue;
    }

    // First, approximate the tangent to the curve at the current location
    let { tangent, normal } = GetPointData(vec.origin.x, func);
    let {Ax, Ay, Vx, Vy} = CalcForceVectors(vec, normal, tangent);

    // Calculate the estimated delta from the current location
    let xd = Ax * timeSliceSquared + Vx * timeSlice;
    let yd = Ay * timeSliceSquared + Vy * timeSlice;

    // Get the next position
    let x = xd + vec.origin.x;
    let yc = yd + vec.origin.y;
    let yf = func.func(x); // The point on the track

    const overTheLine = yc < yf;
    if (overTheLine) {
      // FYI, This is the common case
      // We need to find a 'good' point on the function that is close to
      // the distance from the origin.
      // This is just a best-effort. The smaller the timeSlice
      // the more accurate this will be, at least that's the idea

      // The idea I'm trying is that you have a vector *below* the graph.
      // reflect that vector across the vector on the graph at the updated X
      // location, then bisect the two points and use that as your X coord.

      // I did a bunch of math by hand, and came up with a pretty easy forumla
      // that appears to be correct for a couple of simple examples
      //debugger;
      const angleFunc = NormalizeAngle(Math.atan2(yf - vec.origin.y, xd));
      const angleVect = NormalizeAngle(Math.atan2(yd, xd));
      const angleDelt = angleVect - angleFunc;
      const afSin = Math.sin(angleFunc);
      const adSin = Math.sin(angleDelt);
      const magVect = Math.sqrt(xd * xd + yd * yd);
      const xOffset = magVect * afSin * adSin;
      //console.log({x,xOffset,yc,yf,xn:x+xOffset,yn:func.func(x+xOffset)});
      x += xOffset;
      yf = func.func(x);
    } // else we don't care, because we're off the track, anyway...

    // Check to see if we've moved off the end of this function
    // (and on to the next)...
    if (false && x > func.range.high) {
      //debugger;
      if (funcPos + 1 === funcs.length) {
        // If we've moved off the end of the functions, we're all done
        return vec;
      } else {
        func = funcs[++funcPos];
      }
      // TODO: TO handle loop-de-loops, we'll need to override direction
      // Since we've moved on to a new function, we need to 'smooth' the graph
      // a bit for estimtation to work moderately well
      const {tangent:newTangent, normal:newNormal} = GetPointData(x, func);
      const {Ax:newAx, Ay:newAy, Vx:newVx, Vy:newVy} = CalcForceVectors(vec, newNormal, newTangent);
      const newX = newAx * timeSliceSquared + newVx * timeSlice + vec.origin.x;
      const newY = newAy * timeSliceSquared + newVy * timeSlice + vec.origin.y;
      x = (newX + x) / 2; // Because averaging makes *total* sense :/
      yc = (newY + yc) / 2; // particularly for the caclucated position, but whatever...
    }

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
    const s = {border : '1px solid #91f', height:'800px', width:'800px'};
    return (<canvas ref='FuncGraph' width={800} height={800} style={s}/>);
  }
};
