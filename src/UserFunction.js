//@flow

import math from 'mathjs';

export type Point = {
  x : number,
  y : number
};

// I'm abusing this a bit:
// 'line' indicates, for the simulation,
// whether the point is still on the function or not
export type Vector = {
  origin : Point,
  angle : number,
  magnitude : number,
  line : boolean
};

export type Range = {
  low : number,
  high : number
};

export type MathFunc = (val: number) => number;

export type UserFunction = {
  text : string,
  func : MathFunc,
  range : Range,
};

export type FuncArray = Array<UserFunction>;

export const MakePoint = (x: number, y: number): Point => ({x, y});

export const MakeVector =
  (origin: Point, angle: number, magnitude: number, line: boolean) =>
  ({origin, angle, magnitude, line});

export const MakeUserFunc = (
    text: string, l: number, h: number): (UserFunction|string) => {
  // Validate the range, since that's easy
  const low = Math.min(l, h);
  const high = Math.max(l, h);

  // TODO: validate the function expression
  const compiled = math.compile(text);
  const func: MathFunc = (a) => compiled.eval({x:a});
  return { text, func, range : {low, high} };
};

export const DemandUserFunc =
  (text: string, l: number, h: number):UserFunction => {
  const val = MakeUserFunc(text, l, h);
  if (typeof val === 'string') {
    throw val;
  }
  return val;
};

export const CopyUserFunc =
  (func:UserFunction, low:number, high:number):UserFunction =>
  ({text:func.text, func:func.func, range: {low, high}});

export const GetFunc = (funcList: FuncArray, x: number): ?UserFunction => {
  // TODO: Make this more efficient than a linear search through the
  // array...
  for (let f of funcList) {
    if (f.range.high > x) {
      return f;
    }
  }
};

export const FuncListRange = (funcList: FuncArray): Range => {
  let high = funcList[0].range.high;
  let low = funcList[0].range.low;
  for (let f of funcList) {
    if (f.range.low < low) {
      low = f.range.low;
    }
    if (f.range.high > high) {
      high = f.range.high;
    }
  }
  return {low, high};
};

export const FuncArrayString = (funcs:FuncArray): string =>
  funcs.map(f => f.text + `{${f.range.low},${f.range.high}}`).join('*');
