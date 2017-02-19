// @flow

import React from 'react';

type FuncDividerTypes = {
  pos: number,
  low: number,
  high: number,
  onChange: (pos:number, val:number) => void
};

export const FuncDivider = ({pos, low, high, onChange}:FuncDividerTypes) => {
  const lowDig = Math.min(low.toString().length, low.toFixed(5).length);
  const hiDig = Math.min(high.toString().length, high.toFixed(5).length);
  return (
    <span>
      Function&nbsp;{pos+1}&nbsp;for&nbsp;x&nbsp;:&nbsp;
      <input
        type='text'
        value={low}
        style={{width:lowDig * 12 + 5, textAlign:'center'}}
        disabled={low === 0}
        onChange={(a) => onChange(pos, a.target.value)}/>
      &nbsp;-&nbsp;
      <input
        type='text'
        value={high}
        style={{width:hiDig * 12 + 5, textAlign:'center'}}
        onChange={(a) => onChange(pos + 1, a.target.value)}/>
    </span>);
};

FuncDivider.propTypes = {
  pos:React.PropTypes.number.isRequired,
  low:React.PropTypes.number.isRequired,
  high:React.PropTypes.number.isRequired,
  onChange:React.PropTypes.func.isRequired
};
