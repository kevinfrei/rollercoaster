//@flow

import React, {Component, PropTypes} from 'react';

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
