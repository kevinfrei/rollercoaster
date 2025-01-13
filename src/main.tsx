import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NuApp } from './NuApp.tsx';
import { MathJaxContext } from 'better-react-mathjax';

import './main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MathJaxContext>
      <NuApp />
    </MathJaxContext>
  </StrictMode>,
);
