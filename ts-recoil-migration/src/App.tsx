/*
import FunctionList from './FunctionList.js';
import FunctionState from './FunctionState.js';
import FunctionGraph from './FunctionGraph.js';
import FunctionEditor from './FunctionEditor.js';
import FileDialog from './FileDialog';
import GraphSettings from './GraphSettings';
import { Dialog } from '@fluentui/react';
*/
import { Canvas } from './Canvas';
import { SettingsDialog } from './SettingsDialog';

// Resources
import './App.css';
import { RecoilRoot, useRecoilCallback } from 'recoil';
import { useMyTransaction } from '@freik/web-utils';
import { settingsDialogVisibleState } from './State';

export default function App(): JSX.Element {
  const settingsShow = useRecoilCallback(({ set }) => () => {
    set(settingsDialogVisibleState, true);
  });
  return (
      <div id="App">
        <SettingsDialog />
        <div id="FunctionList" />
        <div id="ButtonPanel">
          <button onClick={settingsShow}>Show Settings</button>
        </div>
        <div id="Graph" />
        <div id="GraphControls" />
      </div>
  );
}

/*
<Canvas
  draw={(ctx: CanvasRenderingContext2D, frameCount: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = '#AAA';
    ctx.moveTo(10, 10);
    ctx.lineTo(10, ctx.canvas.height - 10);
    ctx.lineTo(ctx.canvas.width - 10, ctx.canvas.height - 10);
    ctx.lineTo(ctx.canvas.width - 10, 10);
    ctx.lineTo(10, 10);
    ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    const v = 20 * Math.sin(frameCount * 0.05) ** 2;
    ctx.arc(50, 100, v, 0, 2 * Math.PI);
    ctx.fill();
  }}
/>
*/
/*
    <FunctionList />
    <FunctionGraph />
    <GraphSettings />
    <FunctionEditorDialog />
    <SaveAndSettingsDialog />
*/
