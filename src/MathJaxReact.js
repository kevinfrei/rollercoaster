//@flow

import React, {Component, PropTypes} from 'react';
import {Button} from 'react-bootstrap';

import './App.css';

// This is a terrible hack, but I don't know why it sometimes just gets stuck...
export const MathJaxFixer = ({children}:{children?:mixed}) => (
  <Button bsSize='xsmall' onClick={() => {
    const MathJaxHub = window.MathJax.Hub;
    if (MathJaxHub) {
      MathJaxHub.Queue(["PreProcess", MathJaxHub], ["Reprocess", MathJaxHub]);
    }
  }}>{children}</Button>);

class MathJaxReact extends Component {
  props:{formula:string};
  MathOutput:HTMLElement;
  QueueForRendering = () => {
    const MathJax = window.MathJax;
    if (MathJax && MathJax.Hub) {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.MathOutput]);
    }
  }
  componentDidMount() {
    this.QueueForRendering();
  }
  componentDidUpdate() {
    this.QueueForRendering();
  }
  render() {
    return (
      <div ref={(m:HTMLDivElement) => this.MathOutput = m}>
        {'`' + this.props.formula + '`'}
      </div>
    );
  }
}

MathJaxReact.propTypes = {
  formula: PropTypes.string.isRequired
};

export default MathJaxReact;
