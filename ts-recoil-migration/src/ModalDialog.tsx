/*import {
  ArrayToFuncSet,
  FuncSetToArray,
  LoadFuncSets,
  SaveFuncSets,
} from './LoadSave';
import type { FuncArray } from './UserFunction';
import type { FuncSetsType, FlatFunc } from './LoadSave';
*/
import React, { useCallback, useEffect, useRef } from 'react';
import './App.css';

/*
type FileDialogProps = {
  cart: boolean;
  velocity: boolean;
  labels: boolean;
  curFuncs: FuncArray;
  onSave: (cart: boolean, velocity: boolean, labels: boolean) => void;
  onLoad: (funcSet: FuncArray) => void;
};
*/
export function ModalDialog({
  children,
  close,
  visible
}: {
  close: (cancelled: boolean) => void;
  visible: boolean;
  children: React.ReactNode;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  const keyListener = useCallback((ev: KeyboardEvent) => {
    if (visible && ev.key === 'Escape') {
      close(true);
    }
  }, [visible, close]);
  useEffect(() => {
    window.addEventListener('keyup', keyListener);
    return () => window.removeEventListener('keyup', keyListener);
  });

  const mouseListener = useCallback(
      (ev: React.MouseEvent<HTMLDivElement>) => {
        if (ref && ref.current && ev.target === ref.current && visible) {
          close(true);
        }
      }, [close, visible]
  );

  return visible ? (
    <div ref={ref} className="modalWrapper" onClick={mouseListener}>
      <div className="modalContext">{children}</div>
    </div>
  ) : (
    <></>
  );
}
