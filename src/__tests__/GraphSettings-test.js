import React from 'react';
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme';

import {UnboundGraphSettings} from '../GraphSettings';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const btn = <div/>;
  ReactDOM.render(
    <UnboundGraphSettings
      scale={5}
      time={1}
      running={false}
      onScaleChange={a=>{}}
      onPlay={a=>{}}
      openDialogButton={btn}/>, div);
});
