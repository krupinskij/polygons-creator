import Point from '../model/Point.js'

export function getPoint(event: MouseEvent, canvas: any): Point {
    return new Point(event.x - canvas.offsetLeft, event.y - canvas.offsetTop);
}