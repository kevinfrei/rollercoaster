// @flow

import React, {PropTypes} from 'react';

type FuncDividerTypes = {
  pos: number,
  low: number|string,
  high: number|string,
  onChange: (pos:number, val:string|number) => void
};

const FunctionDivider = ({pos, low, high, onChange}:FuncDividerTypes) => {
  const lowDig = Math.min(low.toString().length, parseFloat(low.toString()).toFixed(5).length);
  const hiDig = Math.min(high.toString().length, parseFloat(high.toString()).toFixed(5).length);
  return (
    <span>
      Function&nbsp;{pos+1}&nbsp;range:&nbsp;
      <input
        type='text'
        value={low}
        style={{width:lowDig * 12 + 5, textAlign:'center', color:'#000'}}
        disabled={low === 0}
        onChange={(a:HTMLInputEvent) => onChange(pos, a.target.value)}/>
      &nbsp;-&nbsp;
      <input
        type='text'
        value={high}
        style={{width:hiDig * 12 + 5, textAlign:'center', color:'#000'}}
        onChange={(a:HTMLInputEvent) => onChange(pos + 1, a.target.value)}/>
    </span>);
};

FunctionDivider.propTypes = {
  pos:PropTypes.number.isRequired,
  low:PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  high:PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange:React.PropTypes.func.isRequired
};

export default FunctionDivider;
