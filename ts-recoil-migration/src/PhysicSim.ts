import {
  GetFunc,
  MakePoint,
  MakeVector,
  FuncArrayString,
  MathFunc,
  Vector,
  Point,
  FuncArray,
} from './UserFunction';

type PointData = {
  tangent: number;
  normal: number;
};

type ForceVectors = {
  Ax: number;
  Ay: number;
  Vx: number;
  Vy: number;
};

// Super duper exciting constants
const halfPi = Math.PI / 2;
const twoPi = Math.PI * 2;
const gravity = 9.8; // m/s^2

const initialSpeed = 0;
const initialAngle = -halfPi;

// How many slices used to calculate random stuff
// This value corresponds to what the 'time' value in the GraphState represents
// It's effectively "milliseconds since beginning"
const timeSlice = 0.001;
const timeSliceSquared = timeSlice * timeSlice;

// Helper functions
function distSquare(pt: Point, x: number, y: number): number {
  const xd = pt.x - x;
  const yd = pt.y - y;
  return xd * xd + yd * yd;
}

function dist(pt: Point, x: number, y: number): number {
  return Math.sqrt(distSquare(pt, x, y));
}

// I want to make sure that all angles I get are between pi and -pi
function NormalizeAngle(n: number): number {
  let res = n % twoPi;
  if (res > Math.PI) {
    res -= twoPi;
  }
  return res;
}

function getTangentAngle(x: number, func: MathFunc): number {
  // Stupid approximation :(
  const slice = 1e-10;
  try {
    const y = func(x);
    const y2 = func(x + slice);
    const delta = y2 - y;
    return Number.isNaN(delta) ? 0 : NormalizeAngle(Math.atan2(delta, slice));
  } catch (e) {
    return 0;
  }
}

function GetPointData(x: number, func: MathFunc): PointData {
  const tangent = getTangentAngle(x, func);
  const normal = NormalizeAngle(tangent + halfPi);
  return { tangent, normal };
}

function CalcForceVectors(
  vec: Vector,
  normal: number,
  tangent: number,
): ForceVectors {
  const normalForce = vec.line ? Math.cos(normal) : 1.0;
  const A = gravity * normalForce; // Tangential acceleration!
  // const N = gravity * Math.sin(tangent); // This goes away (Normal force)

  const Ax = A * (vec.line ? Math.cos(tangent) : 0);
  const Ay = A * (vec.line ? Math.sin(tangent) : -1);

  const Vx = vec.magnitude * Math.cos(vec.angle);
  const Vy = vec.magnitude * Math.sin(vec.angle);
  return { Ax, Ay, Vx, Vy };
}

let resMap: Vector[] = [];
let resMapKey: string = '';

export function getMaxTime(funcs: FuncArray, maxTime: number): number {
  let min = 1;
  let max = maxTime;
  // Binary search the time space
  do {
    const half = Math.floor((min + max) / 2);
    const vec: Vector = getPosition(funcs, half);
    if (vec.stuck) {
      max = half;
    } else {
      min = half;
    }
  } while (min + 1 < max);
  return max;
}

export function getPosition(funcs: FuncArray, time: number): Vector {
  // Okay, reasonable way to simulate gravity? Just calculate it
  // cumulatively because I've forgotten the Calculus necessary to do it
  // accurately :/
  const firstFunc = funcs[0];
  const start = parseFloat(firstFunc.range.low);
  let vec: Vector = MakeVector(
    MakePoint(start, firstFunc.func(start)),
    initialAngle,
    initialSpeed,
    true,
    false,
  );
  const fas = FuncArrayString(funcs);
  if (fas !== resMapKey) {
    resMap = [];
    resMapKey = fas;
  }
  for (let idx = 0; idx <= time && !vec.stuck; idx++) {
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
    let { tangent, normal } = GetPointData(vec.origin.x, func);
    let { Ax, Ay, Vx, Vy } = CalcForceVectors(vec, normal, tangent);

    // Calculate the estimated delta from the current location
    let xd = Ax * timeSliceSquared + Vx * timeSlice;
    let yd = Ay * timeSliceSquared + Vy * timeSlice;

    // Get the next position
    let x = xd + vec.origin.x;
    let yc = yd + vec.origin.y;
    let yf = func(x); // The point on the track

    if (idx > 1) {
      const prevFunc = GetFunc(funcs, resMap[idx - 2].origin.x);
      if (prevFunc && prevFunc.text !== userFunc.text) {
        //debugger;
        // Figure out which values to test for continuity
        const lo = parseFloat(userFunc.range.low);
        const hi = parseFloat(userFunc.range.high);
        const boundx = Math.abs(lo - x) > Math.abs(hi - x) ? hi : lo;
        const curBoundY = func(boundx);
        const prvBoundY = prevFunc.func(boundx);
        if (
          Math.abs(curBoundY - prvBoundY) > 1e-6 &&
          (vec.line || vec.origin.y < curBoundY)
        ) {
          if (curBoundY > prvBoundY)
            return MakeVector(vec.origin, 0, 0, true, true);
        }
      }
    }

    const overTheLine = yc < yf;
    if (overTheLine) {
      // FYI, This is the common case. We need to find a 'good' point on the
      // function that is close to the distance from the origin. This is just a
      // best-effort. The smaller the timeSlice the more accurate this will be,
      // at least that's the idea.

      // The idea I'm trying is that you have a vector *below* the graph.
      // Reflect that vector across the vector on the graph at the updated X
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

    // TODO: TO handle loop-de-loops, we'll need to override direction. Since
    // we've moved on to a new function, we need to 'smooth' the graph a bit for
    // estimtation to work moderately well

    const y = overTheLine ? yf : yc;
    const vectorDirection = NormalizeAngle(
      Math.atan2(y - vec.origin.y, x - vec.origin.x),
    );
    let magnitude = dist(vec.origin, x, y) / timeSlice;
    if (magnitude > vec.magnitude) {
      // At this point, sometimes the estimate for collisions winds up being off
      // in the positive direction.
      // Because I'm lazy, instead of doing more crazy trig, I'm using
      // basic potential vs. kinetic energy to prevent the velocity from being
      // too high
      const oPotential = (vec.origin.y - y) * gravity;
      const oKinetic = vec.magnitude * vec.magnitude;
      magnitude = Math.min(Math.sqrt(oPotential + oKinetic), magnitude);
    }

    const stopped = idx > 10 && magnitude < 1e-5 && vec.magnitude < 1e-5;
    vec = MakeVector(
      MakePoint(x, y),
      vectorDirection,
      magnitude,
      overTheLine,
      stopped,
    );
    resMap[idx] = vec;
  }

  return vec;
}
