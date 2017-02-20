//@flow

import React, {Component, PropTypes} from 'react';
import loadScript from 'load-script';

let loading = false;
let queue = [];
let mjr = null;

export class MathJaxReact extends Component {
  MathOutput:HTMLElement;
  constructor(props:{formula:string}) {
    super(props);
    this.loadMathJax();
  }
  onLoad(err:string, script:HTMLScriptElement) {
    loading = false;
    mjr.ProcessQueue();
  }
  loadMathJax() {
    if (loading || window.MathJax)
      return;
    loading = true;
    const head:?HTMLElement = document.head;
    if (!head) {
      throw String('Nope');
    }
    const cfgScript:HTMLScriptElement = document.createElement("script");
    cfgScript.type = "text/x-mathjax-config";
    cfgScript.text =
      "MathJax.Hub.Config({" +
      "  asciimath2jax: { inlineMath: [['$','$'], ['\\\\(','\\\\)']] }" +
      "});";
    head.appendChild(cfgScript);
    mjr = this;
    loadScript(
      "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_CHTML",
      {/*text:'window.mj = MathJax;'*/}, this.onLoad);
  }
  ProcessQueue() {
    if (loading)
      return;
    if (!window.MathJax) {
      console.error('MathJax should be loaded, but is not');
      throw String('fail');
    }
    while (queue.length > 0) {
      const mjr = queue.pop();
      const node = mjr.MathOutput;
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, node]);
    }
  }
  QueueForRendering() {
    queue.push(this);
    this.ProcessQueue();
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
