//@flow

import React, {Component, PropTypes} from 'react';

export class MathJaxReact extends Component {
  props:{formula:string};
  MathOutput:HTMLElement;
  QueueForRendering() {
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, this.MathOutput]);
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
