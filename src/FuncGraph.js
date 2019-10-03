//@flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getPosition } from './PhysicSim';
import { FuncArrayString } from './UserFunction';
import { Actions } from './Actions';

import type { Vector, FuncArray } from './UserFunction';
import type { CoasterAction } from './Actions';
import type { GraphState } from './StoreTypes';

type FuncGraphProps = {
  funcs: FuncArray,
  selected: number,
  scale: number,
  time: number,
  showVector: boolean,
  showCart: boolean,
  showLabels: boolean,
  size: { width: number, height: number },
  onStopped: () => void
};

// Super duper exciting constant
const twoPi = Math.PI * 2;
const halfPi = Math.PI / 2;
const qtrPi = Math.PI / 4;
const arrowAngle = Math.PI + Math.PI / 6;

// Function colors
export const Colors = [
  '#080',
  '#008',
  '#800',
  '#088',
  '#808',
  '#880',
  '#C00',
  '#0C0',
  '#00C',
  '#0CC',
  '#C0C',
  '#CC0',
  '#C80',
  '#0C8',
  '#80C',
  '#C08',
  '#8C0',
  '#08C',
  '#CC8',
  '#C8C',
  '#8CC',
  '#88C',
  '#8C8',
  '#C88'
];

let scale = 20; // Scale of the graph
let graphStep = 0.25 / scale; // The steps used for drawing the graph
let xo = 10;
let yo = 500;
const tx = (x: number): number => x * scale + xo;
const ty = (y: number): number => yo - y * scale;
const xu = (a: number): number => (a - xo) / scale;
const yu = (b: number): number => (b - yo) / -scale;

const textScale = (ctx: CanvasRenderingContext2D) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};

const drawScale = (ctx: CanvasRenderingContext2D) => {
  ctx.setTransform(scale, 0, 0, -scale, xo, yo);
};

const freshContext = (canvas: ?HTMLCanvasElement): CanvasRenderingContext2D => {
  if (!canvas) {
    console.log('oops');
    throw String('oops');
  }
  const ctx: ?CanvasRenderingContext2D = canvas.getContext('2d');
  if (!ctx) throw String('testOnly');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScale(ctx);
  return ctx;
};

const dot = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  style: string
) => {
  ctx.beginPath();
  ctx.fillStyle = style;
  ctx.arc(x, y, r, 0, twoPi);
  ctx.closePath();
  ctx.fill();
};

const path = (ctx: CanvasRenderingContext2D, ...dots: Array<number>) => {
  let seen = false;
  for (let i = 0; i < dots.length + 1; i += 2) {
    const x = dots[i];
    const y = dots[i + 1];
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
  ctx: CanvasRenderingContext2D,
  { w, h, lbls }: { w: number, h: number, lbls: boolean }
) => {
  const x1 = xu(0);
  const y1 = yu(0);
  const x2 = xu(w);
  const y2 = yu(h);
  const low = Math.min(x1, y1, x2, y2);
  const high = Math.max(x1, y1, x2, y2);
  for (let pos = Math.round(low); pos <= high; pos += 0.5) {
    ctx.beginPath();
    ctx.strokeStyle = '#AAA';
    if (!pos) {
      ctx.lineWidth = 0.1; // 0 : darkest on the axes
    } else if (Math.round(Math.round(pos * 0.2) * 10) === Math.round(pos * 2)) {
      ctx.lineWidth = 5e-2; // multiples of 5
    } else if (Math.round(pos + 0.05) === Math.round(pos - 0.05)) {
      ctx.lineWidth = 2e-2; // on every 1
    } else {
      ctx.lineWidth = 5e-3; // one every .5
    }
    path(ctx, pos, yu(0), pos, yu(h));
    path(ctx, xu(0), pos, xu(w), pos);
    ctx.stroke();
  }
  if (lbls && scale > 2.5) {
    textScale(ctx);
    const textSize = scale;
    ctx.font = `${textSize * 0.75}pt Courier`;
    for (let val = 5; val < high; val += 5) {
      ctx.textAlign = 'right';
      ctx.fillText(val.toString(), tx(-0.1), ty(val - 0.3));
      ctx.fillText((-val).toString(), tx(-0.1), ty(-val - 0.3));
      ctx.textAlign = 'center';
      ctx.fillText(val.toString(), tx(val), ty(-0.9));
    }
    drawScale(ctx);
  }
};

const drawVector = (ctx: CanvasRenderingContext2D, vec: Vector) => {
  // This draws the velocity vector on the graph
  const xo = vec.origin.x;
  const yo = vec.origin.y;
  const [xe, ye] = move(xo, yo, vec.angle, vec.magnitude);
  const [xl, yl] = move(xe, ye, vec.angle + arrowAngle, 1 / 4);
  const [xr, yr] = move(xe, ye, vec.angle - arrowAngle, 1 / 4);
  ctx.beginPath();
  path(ctx, xo, yo, xe, ye, xl, yl, xr, yr, xe, ye);
  ctx.closePath();
  ctx.strokeStyle = '#008';
  ctx.lineWidth = 1 / 16;
  ctx.fillStyle = '#008';
  ctx.stroke();
  ctx.fill();
};

const drawVehicle = (
  ctx: CanvasRenderingContext2D,
  vec: Vector,
  cart: ?boolean
) => {
  // This isn't a very attractive looking rollercoaster car...
  const carWidth = 1;
  const { x, y } = vec.origin;
  const a = vec.angle;
  if (!cart || vec.stuck) {
    const color = vec.stuck ? '#00F' : vec.line ? '#000' : '#F00';
    dot(ctx, x, y, vec.stuck ? 0.5 : 0.125, color);
    return;
  }
  const [rWheelX, rWheelY] = move(x, y, a, 0.5 * carWidth);
  const [lWheelX, lWheelY] = move(x, y, a + Math.PI, 0.5 * carWidth);
  const na = Math.abs(a) > halfPi ? -qtrPi : qtrPi;
  const [rTopX, rTopY] = move(x, y, a + na, carWidth * 1.5);
  const [lTopX, lTopY] = move(x, y, a - na + Math.PI, carWidth * 1.5);

  ctx.beginPath();
  path(ctx, rWheelX, rWheelY, rTopX, rTopY, lTopX, lTopY, lWheelX, lWheelY);
  ctx.fillStyle = '#632'; //vec.line ? '#632' : '#F00'; For when it's off track?
  ctx.closePath();
  ctx.fill();
  dot(ctx, lWheelX, lWheelY, 0.15 * carWidth, '#000');
  dot(ctx, rWheelX, rWheelY, 0.15 * carWidth, '#000');
};

// This draws the lines for the function on the graph:
const drawFunctions = (
  ctx: CanvasRenderingContext2D,
  funcs: FuncArray
): void => {
  let curStroke = 0;
  for (let f of funcs) {
    let x = parseFloat(f.range.low);
    let y = f.func(x);
    dot(ctx, x, y, 1 / 8, '#000');
    ctx.beginPath();
    ctx.strokeStyle = Colors[curStroke];
    ctx.fillStyle = Colors[curStroke];
    ctx.lineWidth = 2 / scale;
    curStroke = (curStroke + 1) % Colors.length;
    ctx.moveTo(x, y);
    const e = parseFloat(f.range.high);
    while (x < e) {
      let fail = false;
      try {
        y = f.func(x);
        fail = Number.isNaN(y);
      } catch (e) {
        fail = true;
      }
      if (!fail) ctx.lineTo(x, y);
      x += graphStep;
    }
    y = f.func(e);
    ctx.lineTo(e, y);
    ctx.stroke();
    dot(ctx, e, y, 0.1, '#000');
  }
};

type renderState = {
  funcs: string,
  w: number,
  h: number,
  lbls: boolean,
  time: number,
  scale: number
};
const NewRenderState = (): renderState => ({
  funcs: '',
  w: 500,
  h: 500,
  lbls: false,
  time: -1,
  scale: 1
});
const RenderStateChange = (
  reqState: renderState,
  drawnState: renderState
): boolean =>
  reqState.w !== drawnState.w ||
  reqState.h !== drawnState.h ||
  reqState.funcs !== drawnState.funcs ||
  reqState.time !== drawnState.time ||
  reqState.lbls !== drawnState.lbls ||
  reqState.scale !== drawnState.scale;
const RedrawAxes = (reqState: renderState, drawnState: renderState): boolean =>
  reqState.w !== drawnState.w ||
  reqState.h !== drawnState.h ||
  reqState.funcs !== drawnState.funcs ||
  reqState.lbls !== drawnState.lbls ||
  reqState.scale !== drawnState.scale;

export class UnboundFunctionGraph extends Component {
  // Flow annotations
  CarGraph: ?HTMLCanvasElement;
  FuncGraph: ?HTMLCanvasElement;
  props: FuncGraphProps;
  // The 'requested' state of the system
  state: renderState;
  // The 'rendering' state of the system
  latestState: renderState;

  constructor(props: FuncGraphProps) {
    super(props);
    this.state = NewRenderState();
    this.latestState = NewRenderState();
  }
  componentDidMount() {
    this.updateCanvas();
  }
  componentDidUpdate() {
    this.updateCanvas();
  }
  updateCanvas() {
    const drawnState = this.state;
    const reqState = this.latestState;
    if (!RenderStateChange(reqState, drawnState)) {
      return;
    }
    this.setState(reqState);
    if (RedrawAxes(reqState, drawnState)) {
      const ctx: CanvasRenderingContext2D = freshContext(this.FuncGraph);
      drawGraphPaper(ctx, {
        w: reqState.w,
        h: reqState.h,
        lbls: reqState.lbls
      });
      drawFunctions(ctx, this.props.funcs);
    }
    const ctx: CanvasRenderingContext2D = freshContext(this.CarGraph);
    // If we're stopped, don't draw the cart
    if (reqState.time < 0) return;
    const vec: Vector = getPosition(this.props.funcs, reqState.time);
    drawVehicle(ctx, vec, this.props.showCart);
    if (this.props.showVector) {
      drawVector(ctx, vec);
    }
    if (vec.stuck && this.props.onStopped) {
      this.props.onStopped();
    }
  }
  // This specifies the state that affects whether we redraw the graph paper
  stateUpdateRequest = (w: number, h: number) => {
    this.latestState.w = w;
    this.latestState.h = h;
    this.latestState.lbls = this.props.showLabels;
    this.latestState.funcs = FuncArrayString(this.props.funcs);
    this.latestState.scale = this.props.scale;
    this.latestState.time = this.props.time;
    yo = h * 0.75;
    xo = w * 0.002 * scale + 10;
  };
  render() {
    scale = this.props.scale || 30;
    graphStep = 1 / scale;
    const left = document.getElementById('left');
    const bottom = document.getElementById('bottom');
    let w = 500;
    let h = 500;
    if (left && this.props.size.width > 0 && left.clientWidth > 0) {
      w = Math.max(w, this.props.size.width - left.clientWidth - 8);
    }
    if (bottom && this.props.size.height > 0 && bottom.scrollHeight > 0) {
      h = Math.max(h, this.props.size.height - bottom.scrollHeight - 8);
    }
    this.stateUpdateRequest(w, h);
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
      <div style={{ position: 'relative', height: hpx, width: wpx }}>
        <canvas
          ref={(fg: HTMLCanvasElement) => (this.FuncGraph = fg)}
          width={w}
          height={h}
          style={s}
        />
        <canvas
          ref={(cg: HTMLCanvasElement) => (this.CarGraph = cg)}
          width={w}
          height={h}
          style={s}
        />
      </div>
    );
  }
}

UnboundFunctionGraph.propTypes = {
  funcs: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  showVector: PropTypes.bool.isRequired,
  showCart: PropTypes.bool.isRequired,
  showLabels: PropTypes.bool.isRequired,
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  onStopped: PropTypes.func
};

const FunctionGraph = connect(
  // State to Props
  (state: GraphState) => ({
    scale: state.scale,
    funcs: state.funcs,
    time: state.millisec,
    selected: state.currentEdit,
    showVector: state.showVector,
    showCart: state.showCart,
    showLabels: state.showLabels,
    size: state.size
  }),
  (dispatch: (a: CoasterAction) => void) => ({
    onStopped: () => dispatch(Actions.Stop())
  })
)(UnboundFunctionGraph);

export default FunctionGraph;
