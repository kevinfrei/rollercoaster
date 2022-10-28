import React, { useEffect, useRef } from 'react';

export type ContextType = '2d' | 'bitmaprenderer' | 'webgl' | 'webgl2';
export type DrawFunction<T> = (ctxt: T, frameCount: number) => void;
export type CanvasProps<T> = React.ComponentProps<'canvas'> & {
  draw: DrawFunction<T>;
  //  context?: ContextType;
};
type AllDrawFuncs =
  | DrawFunction<CanvasRenderingContext2D>
  | DrawFunction<ImageBitmapRenderingContext>
  | DrawFunction<WebGLRenderingContext>
  | DrawFunction<WebGL2RenderingContext>
  | DrawFunction<RenderingContext>;

// Overkill, but why not?
export function useCanvas(
  draw: DrawFunction<CanvasRenderingContext2D>,
  contextType?: '2d',
): React.RefObject<HTMLCanvasElement>;
export function useCanvas(
  draw: DrawFunction<ImageBitmapRenderingContext>,
  contextType: 'bitmaprenderer',
): React.RefObject<HTMLCanvasElement>;
export function useCanvas(
  draw: DrawFunction<WebGLRenderingContext>,
  contextType: 'webgl',
): React.RefObject<HTMLCanvasElement>;
export function useCanvas(
  draw: DrawFunction<WebGL2RenderingContext>,
  contextType: 'webgl2',
): React.RefObject<HTMLCanvasElement>;
export function useCanvas(
  draw: DrawFunction<RenderingContext>,
  contextType: string,
): React.RefObject<HTMLCanvasElement>;

export function useCanvas(
  draw: AllDrawFuncs,
  contextType?: ContextType | string,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    let frameCount = 0;
    let animationFrameId = 0;
    const render = () => {
      if (canvas !== null) {
        const context = canvas.getContext(contextType || '2d');
        if (context !== null) {
          const { width, height } = canvas.getBoundingClientRect();
          if (
            (canvas.width !== width || canvas.height !== height) &&
            (!contextType || contextType === '2d')
          ) {
            const { devicePixelRatio: ratio = 1 } = window;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            (context as CanvasRenderingContext2D).scale(ratio, ratio);
          }
          draw(context as any, frameCount++);
        }
      }
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, contextType]);
  return canvasRef;
}

export function Canvas(
  allprops: CanvasProps<CanvasRenderingContext2D>,
): JSX.Element {
  //  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { draw, ...props } = allprops;
  const canvasRef = useCanvas(draw);
  return <canvas ref={canvasRef} {...props} />;
}
