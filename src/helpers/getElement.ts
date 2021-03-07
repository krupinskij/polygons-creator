import { ErrorCode } from '../constants/ErrorCode';
import { throwError } from './throwError';

export function getElementById<T extends HTMLElement>(id: string): T {
  return (document.getElementById(id) as T) || throwError(ErrorCode.ElementNotFound);
}

export function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  return canvas.getContext('2d') as CanvasRenderingContext2D;
}
