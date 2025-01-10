//@flow

import * as math from 'mathjs';

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
  line : boolean,
  stuck : boolean
};

export type Range = {
  low : string,
  high : string
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
  (origin: Point, angle: number, magnitude: number, line: boolean, stuck: boolean) =>
  ({origin, angle, magnitude, line, stuck});

export const MakeUserFunc = (
    text: string, lo: number|string, hi: number|string): (UserFunction|string) => {
  // Validate the range, since that's easy
  const l = parseFloat(lo.toString());
  const h = parseFloat(hi.toString());
  const low = Math.min(l, h);
  const high = Math.max(l, h);

  // TODO: validate the function expression
  try {
    const compiled:Expression = math.compile(text);
    console.log(compiled);
    const func: MathFunc = (a) => compiled.evaluate({x:a});
    return { text, func, range : {low: low.toString(), high:high.toString()} };
  } catch (e) {
    return `Problem occurred processing function '${text}'`;
  }
};

export const DemandUserFunc =
  (text: string, l: number|string, h: number|string):UserFunction => {
  const val = MakeUserFunc(text, l, h);
  if (typeof val === 'string') {
    throw val;
  }
  return val;
};

export const CopyUserFunc =
  (func:UserFunction, low:number|string, high:number|string):UserFunction =>
  ({text:func.text, func:func.func, range: {low:low.toString(), high:high.toString()}});

export const GetFunc = (funcList: FuncArray, x: number): ?UserFunction => {
  // TODO: Make this more efficient than a linear search through the array?
  for (let f of funcList) {
    if (parseFloat(f.range.high.toString()) > x) {
      return f;
    }
  }
};

export const FuncListRange = (funcList: FuncArray): Range => {
  let high = parseFloat(funcList[0].range.high.toString());
  let low = parseFloat(funcList[0].range.low.toString());
  for (let f of funcList) {
    const l = parseFloat(f.range.low.toString());
    if (l < low) {
      low = l;
    }
    const h = parseFloat(f.range.high.toString());
    if (h > high) {
      high = h;
    }
  }
  return {low:low.toString(), high:high.toString()};
};

export const FuncArrayString = (funcs:FuncArray): string =>
  funcs.map(f => f.text + `{${f.range.low},${f.range.high}}`).join('*');
