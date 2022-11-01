import {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
  MouseEvent,
} from 'react';

export type ModalDialogProps = {
  close: (cancelled: boolean) => void;
  visible: boolean;
  children: ReactNode;
  clickAway?: boolean;
  escapeClose?: boolean;
  style?: CSSProperties;
  closeButton?: boolean;
  title?: JSX.Element | string;
};

const wrapperStyle: CSSProperties = {
  display: 'flex',
  backgroundColor: '#888c',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
  left: 0,
  top: 0,
  position: 'absolute',
  zIndex: 888888,
};

const contentStyle: CSSProperties = {
  border: '10pt solid white',
  borderRadius: '5pt',
  backgroundColor: 'white',
};

const contentWithTitleBarStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gridTemplateRows: 'auto 1fr',
};

const titleStyle: CSSProperties = {
  gridRow: 1,
  gridColumn: 1,
  textAlign: 'left',
  fontWeight: 'bold',
  marginBottom: '5pt',
};

const closeButtonStyle: CSSProperties = {
  gridRow: 1,
  gridColumn: 2,
  cursor: 'pointer',
  fontSize: 24,
  border: '1px solid black',
  borderRadius: 4,
  backgroundColor: '#EEE',
  lineHeight: 0.5,
  width: '14px',
  height: '20px',
  paddingLeft: 3,
};

const contentOnlyStyle: CSSProperties = {
  gridRow: 2,
  gridColumnStart: 1,
  gridColumnEnd: 3,
};

export function ModalDialog({
  children,
  close,
  visible,
  clickAway,
  escapeClose,
  style,
  closeButton,
  title,
}: ModalDialogProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const escClose = escapeClose === undefined || escapeClose;
  const keyListener = useCallback(
    (ev: KeyboardEvent) => {
      if (escClose && visible && ev.key === 'Escape') {
        close(true);
      }
    },
    [visible, close, escClose],
  );
  useEffect(() => {
    window.addEventListener('keyup', keyListener);
    return () => window.removeEventListener('keyup', keyListener);
  });
  const clickClose =
    visible &&
    containerRef &&
    containerRef.current &&
    (clickAway === undefined || clickAway);
  const mouseListener = useCallback(
    (ev: MouseEvent<HTMLDivElement>) => {
      if (ev.target === containerRef.current && clickClose) {
        close(true);
      }
    },
    [close, clickClose],
  );
  if (!visible) {
    return <></>;
  }
  if (!closeButton && title === undefined) {
    return (
      <div ref={containerRef} style={wrapperStyle} onClick={mouseListener}>
        <div style={{ ...contentStyle, ...style, zIndex: 999999 }}>
          {children}
        </div>
      </div>
    );
  }
  return (
    <div ref={containerRef} style={wrapperStyle} onClick={mouseListener}>
      <div
        style={{
          ...contentStyle,
          ...style, // This gets overridden by contentWithTitleBarStyle
          ...contentWithTitleBarStyle,
          zIndex: 999999,
        }}
      >
        <div style={titleStyle}>{title || ''}</div>
        {closeButton ? (
          <div style={closeButtonStyle} onClick={() => close(true)}>
            ⨯
          </div>
        ) : (
          ''
        )}
        <div style={contentOnlyStyle}>{children}</div>
      </div>
    </div>
  );
}

export function Checkbox({
  checked,
  onClick,
}: {
  checked: boolean;
  onClick: (cur: boolean) => void;
}): JSX.Element {
  return (
    <input type="checkbox" checked={checked} onClick={() => onClick(checked)} />
  );
}
