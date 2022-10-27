import { MathComponent } from 'mathjax-react';
import { CSSProperties } from 'react';

import './App.css';

export default function MathJaxReact({
  formula,
}: {
  formula: string;
}): JSX.Element {
  return <MathComponent tex={formula} display={true} />;
}
