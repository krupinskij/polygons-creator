import Creator from '../creator';

import Point from '../model/Point';

export function getPoint(event: MouseEvent): Point {
  return new Point(event.x - Creator.canvas.offsetLeft, event.y - Creator.canvas.offsetTop);
}
