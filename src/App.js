//@flow
// node modules
import React, {Component} from 'react';

// My modules
import {FuncList} from './FunctionList';
import {FuncGraph} from './FunctionGraph';
import {MakeUserFunc} from './UserFunction';

// Resources
//import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    // A couple of functions...
    //const uf1 = MakeUserFunc('(x-1)*(x-1)/(x+.003) + 1', '0.0', '50.0');
    const uf1 = MakeUserFunc('Math.cos(x*x) / (x +.03) + .1 * x', '0.0', '10.0');
    const uf2 = MakeUserFunc('(x+9)/10', '10.0', '11.0');
    const uf3 = MakeUserFunc('Math.sqrt(Math.abs(1 - (x-20) * (x-20)))','11.0','30.0');
    if (typeof uf1 === 'string' || typeof uf2 === 'string' || typeof uf3 === 'string') {
      return (<div>Nope!{uf1}{uf2}</div>);
    }
    let funcList = [ uf1, uf2, uf3 ];
    return (
      <div className='RowList'>
      <div className='ColList'>
        <FuncList funcs={funcList} />
        <FuncGraph funcs={funcList}/>
      </div>
      <div>Graph Controls Down Here!</div>
    </div>
    );
  }
}

export default App;

/*<div className='App-header'>
  <img src={logo} className='App-logo' alt='logo' />
  <h2>Welcome to a really cheesy little roller coaster simulator</h2>
</div>
*/
