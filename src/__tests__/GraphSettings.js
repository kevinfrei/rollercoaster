import React from 'react';
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme';

import {GraphSettings} from '../GraphSettings';

it('renders without crashing', () => {
  const div = document.createElement('div');
  shallow(
    <GraphSettings
      scale={5}
      time={1}
      running={false}
      onScaleChange={a=>{}}
      onPlay={a=>{}}/>);
});
