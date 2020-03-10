import Point from '../model/Point.js'

export default function getPoint(event: MouseEvent, canvas: HTMLCanvasElement): Point {
    return new Point(event.x - canvas.offsetLeft, event.y - canvas.offsetTop);
}