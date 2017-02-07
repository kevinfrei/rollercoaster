// @flow

import {GetFunc, MakePoint, MakeVector} from './UserFunction';

import type {UserFunction, MathFunc, Vector, Point} from './UserFunction';

type PointData = {
  tangent : number,
  normal : number
};

type ForceVectors = {
  Ax : number,
  Ay : number,
  Vx : number,
  Vy : number,
};

// Super duper exciting constants
const halfPi = Math.PI / 2;
const twoPi = Math.PI * 2;
const gravity = 9.8; // m/s^2
// This is probably worth doing something with eventually
const friction = 1;

// How many slices used to calculate random stuff
// More slices == more accuracy
const timeSlice = 1 / 1024;
const timeSliceSquared = timeSlice * timeSlice;

// console.log helpers: text digits, text angle
// const td = (n:number):number => Math.round(n * 10000) / 10000;
// const ta = (n:number):number => td(n * Math.PI / 180);

// Helper functions
const distSquare = (pt: Point, x: number, y: number): number => {
  const xd = pt.x - x;
  const yd = pt.y - y;
  return xd * xd + yd * yd;
};

const dist = (pt: Point, x: number, y: number): number => {
  return Math.sqrt(distSquare(pt, x, y));
};

// I want to make sure that all angles I get are between pi and -pi
const NormalizeAngle = (n: number): number => {
  let res = n % twoPi;
  if (res > Math.PI) {
    res -= twoPi;
  }
  return res;
};

const getTangentAngle = (x: number, func: MathFunc): number => {
  // Stupid approximation :(
  const slice = 1e-10;
  const y = func(x);
  const y2 = func(x + slice);
  const delta = y2 - y;
  return NormalizeAngle(Math.atan2(delta, slice));
};

const GetPointData = (x: number, func: MathFunc): PointData => {
  const tangent = getTangentAngle(x, func);
  const normal = NormalizeAngle(tangent + halfPi);
  return {tangent, normal};
};

const CalcForceVectors =
  (vec: Vector, normal: number, tangent: number):ForceVectors => {
  const normalForce = vec.line ? Math.cos(normal) : 1.0;
  // if (!vec.line)
  //  debugger;
  const A = friction * gravity * normalForce; // Tangential acceleration!
  // const N = gravity * Math.sin(tangent); // This goes away (Normal force)

  const Ax = A * (vec.line ? Math.cos(tangent) : 0);
  const Ay = A * (vec.line ? Math.sin(tangent) : -1);

  const Vx = vec.magnitude * Math.cos(vec.angle);
  const Vy = vec.magnitude * Math.sin(vec.angle);
  return {Ax, Ay, Vx, Vy};
};

let resMap: Array<Vector> = [];

export const getPosition =
  (funcs: Array<UserFunction>, time: number): Vector => {
  // Okay, reasonable way to simulate gravity? Just calculate it
  // cumulatively because I've forgotten the Calculus necessary to do it
  // accurately :/
  const firstFunc = funcs[0];
  let vec: Vector = MakeVector(firstFunc.endPoints.a, 0, 0, true);

  for (let idx = 0; idx <= time / timeSlice; idx++) {
    if (resMap[idx]) {
      // Dynamic programming, FTW...
      vec = resMap[idx];
      continue;
    }
    const userFunc = GetFunc(funcs, vec.origin.x);
    if (!userFunc) {
      return vec;
    }
    const func = userFunc.func;
    // First, approximate the tangent to the curve at the current location
    let {tangent, normal} = GetPointData(vec.origin.x, func);
    let {Ax, Ay, Vx, Vy} = CalcForceVectors(vec, normal, tangent);

    // Calculate the estimated delta from the current location
    let xd = Ax * timeSliceSquared + Vx * timeSlice;
    let yd = Ay * timeSliceSquared + Vy * timeSlice;

    // Get the next position
    let x = xd + vec.origin.x;
    let yc = yd + vec.origin.y;
    let yf = func(x); // The point on the track

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
      // that appears to be correct for a couple of simple examples debugger;
      const angleFunc = NormalizeAngle(Math.atan2(yf - vec.origin.y, xd));
      const angleVect = NormalizeAngle(Math.atan2(yd, xd));
      const angleDelt = angleVect - angleFunc;
      const afSin = Math.sin(angleFunc);
      const adSin = Math.sin(angleDelt);
      const magVect = Math.sqrt(xd * xd + yd * yd);
      const xOffset = magVect * afSin * adSin;
      // console.log({x,xOffset,yc,yf,xn:x+xOffset,yn:func.func(x+xOffset)});
      x += xOffset;
      yf = func(x);
    } // else we don't care, because we're off the track, anyway...

    // TODO: TO handle loop-de-loops, we'll need to override direction
    // Since we've moved on to a new function, we need to 'smooth' the graph
    // a bit for estimtation to work moderately well

    const y = overTheLine ? yf : yc;
    const vectorDirection =
        NormalizeAngle(Math.atan2(y - vec.origin.y, x - vec.origin.x));
    vec = MakeVector(MakePoint(x, y),
                     vectorDirection,
                     dist(vec.origin, x, y) / timeSlice,
                     overTheLine);
    resMap[idx] = vec;
  }

  return vec;
};
