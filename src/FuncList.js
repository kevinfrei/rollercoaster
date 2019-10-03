//@flow

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FunctionDivider from './FuncDivider';
import FunctionViewer from './FuncViewer';
import { Colors } from './FuncGraph';
import { Actions } from './Actions';
import { GetTextColor } from './HtmlUtils';

import type { FuncArray } from './UserFunction';
import type { CoasterAction } from './Actions';
import type { DisplayStateType } from './StoreTypes';
import type { GraphState } from './StoreTypes';

type FuncListAttribs = {
  funcs: FuncArray,
  status: DisplayStateType,
  onEdit: (id: number) => void,
  onPrev: (id: number) => void,
  onNext: (id: number) => void,
  onDel: (id: number) => void,
  onChange: (id: number, value: string | number) => void
};

export const UnboundFunctionList = ({
  funcs,
  status,
  onEdit,
  onPrev,
  onNext,
  onDel,
  onChange
}: FuncListAttribs) => {
  // Should I assert that they're sorted?
  const MapOfFuncs = funcs.map((uf, index) => {
    let contents = '';
    if (
      status.state !== 'GOOD' &&
      typeof status.message !== 'string' &&
      status.message.func === index + 1
    ) {
      contents += status.state === 'WARNING' ? '❉' : '❕';
    }
    const header = (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '3pt'
        }}
      >
        <FunctionDivider
          pos={index}
          low={uf.range.low}
          high={uf.range.high}
          onChange={onChange}
        />
        <div>{contents}</div>
      </div>
    );
    const color = Colors[index % Colors.length];
    return (
      <div key={index}>
        <div
          style={{
            backgroundColor: color,
            padding: '2pt',
            color: GetTextColor(color)
          }}
        >
          {header}
        </div>
        <FunctionViewer
          id={index}
          first={index === 0}
          last={index === funcs.length - 1}
          userFunc={uf}
          onNext={onNext}
          onPrev={onPrev}
          onEdit={onEdit}
          onDel={onDel}
        />
        <div style={{ backgroundColor: color, height: '2pt' }} />
      </div>
    );
  });
  return <div>{MapOfFuncs}</div>;
};

UnboundFunctionList.propTypes = {
  funcs: PropTypes.arrayOf(PropTypes.object).isRequired,
  status: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onDel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

const FunctionList = connect(
  // State to Props
  (state: GraphState) => ({
    funcs: state.funcs,
    status: state.displayState
  }),
  // Dispatch To Handler Props
  (dispatch: (a: CoasterAction) => void) => ({
    onPrev: (id: number) => dispatch(Actions.MoveFunction(id, true)),
    onNext: (id: number) => dispatch(Actions.MoveFunction(id, false)),
    onDel: (id: number) => dispatch(Actions.DeleteFunction(id)),
    onEdit: (id: number) => dispatch(Actions.EditFunction(id)),
    onChange: (id: number, value: number | string) =>
      dispatch(Actions.ChangeDivider(id, value))
  })
)(UnboundFunctionList);

export default FunctionList;
