import { Button } from '@fluentui/react-components';
import type { UserFunction } from './UserFunction';
import { MathJax } from 'better-react-mathjax';

type FuncMoverProps = {
  first: boolean;
  last: boolean;
  id: number;
  onPrev: (id: number) => void;
  onNext: (id: number) => void;
};

function FuncMover({ first, last, id, onPrev, onNext }: FuncMoverProps) {
  return (
    <div style={{ height: '100%' }}>
      <Button disabled={first} onClick={() => onPrev(id)}>
        &uarr;
      </Button>
      <Button disabled={last} onClick={() => onNext(id)}>
        &darr;
      </Button>
    </div>
  );
}

function FuncDisplayer({ text }: { text: string }) {
  return <MathJax>{`y=${text}`}</MathJax>;
}

type FuncChangeButtonsProps = {
  first: boolean;
  last: boolean;
  id: number;
  onDel: (id: number) => void;
  onEdit: (id: number) => void;
};

function FuncChangeButtons({
  first,
  last,
  id,
  onDel,
  onEdit,
}: FuncChangeButtonsProps) {
  return (
    <div style={{ height: '100%' }}>
      <Button
        block
        bsSize="small"
        onClick={() => onDel(id)}
        disabled={first && last}
      >
        ✗
      </Button>
      <Button block bsSize="small" onClick={() => onEdit(id)}>
        ✎
      </Button>
    </div>
  );
}

type FunctionViewerProps = {
  id: number;
  userFunc: UserFunction;
  first: boolean;
  last: boolean;
  onEdit: (id: number) => void;
  onPrev: (id: number) => void;
  onNext: (id: number) => void;
  onDel: (id: number) => void;
};

function FunctionViewer({
  id,
  userFunc,
  first,
  last,
  onEdit,
  onPrev,
  onNext,
  onDel,
}: FunctionViewerProps) {
  return (
    <div className="ColJust">
      <FuncMover
        id={id}
        first={first}
        last={last}
        onPrev={onPrev}
        onNext={onNext}
      />
      <div
        style={{
          padding: '4pt',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FuncDisplayer text={userFunc.text} />
      </div>
      <FuncChangeButtons
        id={id}
        first={first}
        last={last}
        onDel={onDel}
        onEdit={onEdit}
      />
    </div>
  );
}

export default FunctionViewer;
