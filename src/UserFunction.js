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

type MathFunc = (val: number)=> number;

export type UserFunction = {
  text : string,
  func : MathFunc,
  range : {low : number, high : number},
  endPoints : {a : Point, b : Point}
};

export const MakePoint = (x: number, y: number): Point => ({x, y});

export const MakeVector = (origin: Point, angle: number, magnitude: number, line: boolean) => {
  return {origin, angle, magnitude, line};
};

export const MakeUserFunc = function(funcExpr: string, low: string,
                                     high: string): (UserFunction | string) {
  // Validate the range, since that's easy
  const l: number = parseFloat(low);
  const h: number = parseFloat(high);
  if (Number.isNaN(l)) {
    return "Low value of range is not a number.";
  }
  if (Number.isNaN(h)) {
    return "High value of range is not a number.";
  }
  const lo = Math.min(l, h);
  const hi = Math.max(l, h);
  // TODO: Parse/validate the function expression
  // For now, just to make it fast, I'm using eval, which is a HUGE no
  // no.
  // Kids, don't do what I'm doing here.

  // Rather than have 'theFunc' be an eval, I'm evaluating the expression
  // such that theFunc will be a routine that invokes the function directly
  // I *believe* this has the effect of compiling the expression.
  // It certainly seems faster while I'm debugging

  // And yes, I know eval is dangerous...
  // eslint-disable-next-line
  const theFunc: MathFunc = eval("(x) => (" + funcExpr + ");");
  const a: Point = MakePoint(lo, theFunc(lo));
  const b: Point = MakePoint(hi, theFunc(hi));
  return {
    text : funcExpr,
    func : theFunc,
    range : {low : lo, high : hi},
    endPoints : {a, b}
  };
};
