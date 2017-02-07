//@flow
// node modules
// Resources
// import logo from './logo.svg';
import './App.css';

import React, {Component} from 'react';

// My modules

import {FuncGraph} from './FunctionGraph';
import {FuncList} from './FunctionList';
import {MakeUserFunc} from './UserFunction';

class App extends Component {
  render() {
    // A couple of functions...
    // const uf1 = MakeUserFunc('(x-1)*(x-1)/(x+.003) + 1', '0', '50');
    // const uf1 = MakeUserFunc('Math.cos(x*x) / (x +.03) + .1 * x', '0', '10');
    const uf1 =
        MakeUserFunc('5+5*Math.cos((x+.01)*(Math.PI/4))/(x+.8)', '0', '6');
    const uf2 = MakeUserFunc('.8*x+.2', '6.0', '11.0');
    const uf3 = MakeUserFunc(
        'Math.sqrt(Math.abs(1 - (x-20) * (x-20)))', '11.0', '30.0');
    if (typeof uf1 === 'string' || typeof uf2 === 'string' ||
        typeof uf3 === 'string') {
      return (<div>Nope!{uf1} {uf2}</div>);
    }
    let funcList = [ uf1, uf2, uf3 ];
    return (
      <div className='RowList'>
        <div className='ColList'>
          <FuncList funcs={funcList} />
          <FuncGraph funcs = {funcList} />
        </div>
        <div>
          Graph Controls Down Here!
        </div>
      </div>
    );
  }
}

export default App;

/*
<div className='App-header'>
  <img src={logo} className='App-logo' alt='logo' />
  <h2>Welcome to a really cheesy little roller coaster simulator</h2>
</div>
*/
