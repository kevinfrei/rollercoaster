//@flow

export type Point = {
  x : number,
  y : number
};

export type UserFunction = {
  text : string,
  func : (val: number) => number,
  range : {low : number, high : number},
  endPoints : {a : Point, b : Point}
};

export const MakePoint = (x: number, y: number): Point => ({x, y});

export const MakeUserFunc =
(funcExpr: string, low: string, high: string): (UserFunction | string) => {
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
  // For now, just to make it fast, I'm using eval, which is a HUGE no no.
  // Kids, don't do what I'm doing here.
  const theFunc = (val: number): number => {
    // eslint-disable-next-line
    const x = val;
    // eslint-disable-next-line
    return eval(funcExpr);
  };
  const a: Point = MakePoint(lo, theFunc(lo));
  const b: Point = MakePoint(hi, theFunc(hi));
  return {
    text : funcExpr,
    func : theFunc,
    range : {low : lo, high : hi},
    endPoints : {a, b}
  };
};
