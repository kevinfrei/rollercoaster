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
    const uf1 = MakeUserFunc('0.05 * x + (Math.cos(x * 2.25) + 1) * Math.PI / (x / 2 + 0.5)', '0.0', '30.0');
    const uf2 = MakeUserFunc('1', '30.0', '35.0');
    if (typeof uf1 === 'string' || typeof uf2 === 'string') {
      return (<div>Nope!{uf1}{uf2}</div>);
    }
    let funcList = [ uf1, uf2 ];
    return (
      <div className='App'>
        <FuncList funcs={funcList} />
        <FuncGraph funcs={funcList}/>
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
