import React from 'react';
import ReactDOM from 'react-dom';

import MathJaxReact from '../MathJaxReact';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MathJaxReact formula='x^2+cos(x)'/>, div);
});
