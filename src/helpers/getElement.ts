import { ErrorCode } from '../constants/ErrorCode';
import { throwError } from './throwError';

export function getElementById<T extends HTMLElement>(id: string): T {
  return (document.getElementById(id) as T) || throwError(ErrorCode.ElementNotFound);
}

export function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  return canvas.getContext('2d') as CanvasRenderingContext2D;
}

export function createNewTab(id: number): HTMLLIElement {
  const tab = document.createElement('li');
  tab.className = 'tab';
  const a = document.createElement('a');
  a.href = `#polygon-${id}`;
  a.id = `polygon-${id}`;
  a.innerText = `Polygon ${id}`;
  a.className = 'tab-link';
  tab.appendChild(a);

  return tab;
}
