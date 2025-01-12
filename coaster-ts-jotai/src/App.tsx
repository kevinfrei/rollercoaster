import { useState } from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Button,
} from '@fluentui/react-components';
import { MathJaxContext } from 'better-react-mathjax';
import './App.css';

function App() {
  const [light, setLight] = useState(false);
  return (
    <FluentProvider theme={light ? webLightTheme : webDarkTheme}>
      <MathJaxContext>
        <h1>Getting started</h1>
        <div className="card">
          <Button appearance='primary' onClick={() => setLight((l) => !l)}>
            Theme is {light ? 'light' : 'dark'}
          </Button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </MathJaxContext>
    </FluentProvider>
  );
}

export default App;
