//@flow

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

export const MakePoint = (x: number, y: number): Point => ({x, y});

export const MakeVector =
  (origin: Point, angle: number, magnitude: number, line: boolean) =>
  ({origin, angle, magnitude, line});

export const MakeUserFunc = function(
    text: string, low: string, high: string): (UserFunction|string) {
  // Validate the range, since that's easy
  const l: number = parseFloat(low);
  const h: number = parseFloat(high);
  if (Number.isNaN(l)) {
    return 'Low value of range is not a number.';
  }
  if (Number.isNaN(h)) {
    return 'High value of range is not a number.';
  }
  const lo = Math.min(l, h);
  const hi = Math.max(l, h);
  // TODO: Parse/validate the function expression
  // For now, just to make it fast, I'm using eval, which is a HUGE no no.
  // Kids, don't do what I'm doing here.

  // Rather than have 'theFunc' be an eval, I'm evaluating the expression
  // such that theFunc will be a routine that invokes the function directly
  // I *believe* this has the effect of compiling the expression.
  // It certainly seems faster while I'm debugging

  // eslint-disable-next-line
  const func: MathFunc = eval('(x) => {try { return (' + text + ');} catch (e) {} return 0;}');
  const a: Point = MakePoint(lo, func(lo));
  const b: Point = MakePoint(hi, func(hi));
  return {
    text,
    func,
    range : {low : lo, high : hi},
  };
};

export const GetFunc =
  (funcList: Array<UserFunction>, x: number): ? UserFunction => {
  // TODO: Make this more efficient than a linear search through the
  // array...
  for (let f of funcList) {
    if (f.range.high > x) {
      return f;
    }
  }
};

export const FuncListRange = (funcList: Array<UserFunction>): Range => {
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
