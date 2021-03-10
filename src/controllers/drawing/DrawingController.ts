import Point from '../../model/Point';

import { Color } from '../../constants/Color';

export default interface DrawingController {
  drawPoint(p: Point, r: number, color: Color): void;
  drawPixel(p: Point, w: number): void;
  drawLine(p1: Point, p2: Point, color: Color): void;
  drawPolygons(): void;
}
