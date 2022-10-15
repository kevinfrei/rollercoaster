//@flow

import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';

import './App.css';

// This is a terrible hack, but I don't know why it sometimes just gets stuck...
export const MathJaxFixer = ({ children }: { children?: mixed }) => (
  <Button
    bsSize="xsmall"
    onClick={() => {
      const MathJaxHub = window.MathJax.Hub;
      if (MathJaxHub) {
        MathJaxHub.Queue(['PreProcess', MathJaxHub], ['Reprocess', MathJaxHub]);
      }
    }}
  >
    {children}
  </Button>
);

export default function MathJaxReact({
  formula,
  style,
}: {
  formula: string;
  style?: CSS.Properties;
}): JSX.Element {
  return <div style={style}>{formula}</div>;
}
