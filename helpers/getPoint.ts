import app from '../app';

import Point from '../model/Point';

export default function getPoint(event: MouseEvent): Point {
  return new Point(
    event.x - app.canvas.offsetLeft,
    event.y - app.canvas.offsetTop,
  );
}
