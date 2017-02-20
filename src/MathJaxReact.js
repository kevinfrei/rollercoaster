//@flow

import React, {Component, PropTypes} from 'react';

export class MathJaxReact extends Component {
  props:{formula:string};
  MathOutput:HTMLElement;
  QueueForRendering() {
    if (!window.MathJax) {
      console.error('MathJax should be loaded on the window object');
      throw String('fail');
    }
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, this.MathOutput]);
  }
  componentDidUpdate() {
    this.QueueForRendering();
  }
  render() {
    return <div ref='MathOutput'>{'`' + this.props.formula + '`'}</div>;
  }
}

MathJaxReact.propTypes = {
  formula: PropTypes.string.isRequired
};
