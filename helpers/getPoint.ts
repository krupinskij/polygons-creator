import app from '../app.js';

import Point from '../model/Point.js';

export default function getPoint(event: MouseEvent): Point {
    return new Point(event.x - app.canvas.offsetLeft, event.y - app.canvas.offsetTop);
}