import _ from '../creator';

import Point from '../model/Point';

import { Color } from '../constants/Color';

export function drawPoint(p: Point, r: number, color: Color): void {
  _.context.fillStyle = color;

  _.context.beginPath();
  _.context.arc(p.x, p.y, r, 0, 2 * Math.PI, true);
  _.context.fill();

  _.context.fillStyle = Color.Black;
}

function drawPixel(p: Point, w: number): void {
  _.context.fillRect(p.x, p.y, w, w);
}

export function drawLine({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point, color: Color) {
  _.context.fillStyle = color;

  if (Math.abs(y2 - y1) < Math.abs(x2 - x1)) {
    if (x1 > x2) {
      let tmpX = x1;
      x1 = x2;
      x2 = tmpX;
      let tmpY = y1;
      y1 = y2;
      y2 = tmpY;
    }

    const dx = x2 - x1;
    const dy = y2 - y1;

    let d = 2 * (dy - dx);

    const incrE = 2 * dy;
    const incrNSE = (y2 - y1) * (x2 - x1) > 0 ? 2 * (dy - dx) : 2 * (dx + dy);
    const yi = (y2 - y1) * (x2 - x1) > 0 ? 1 : -1;

    let x = x1;
    let y = y1;

    while (x < x2) {
      if (d * yi < 0) {
        d += incrE;
        x++;
      } else {
        d += incrNSE;
        x++;
        y += yi;
      }
      for (let i = 0; i < _.thickness; i++) {
        drawPixel({ x: x, y: Math.ceil(y - _.thickness / 2) + i }, 1);
      }
    }
  } else {
    if (y1 > y2) {
      let tmpX = x1;
      x1 = x2;
      x2 = tmpX;
      let tmpY = y1;
      y1 = y2;
      y2 = tmpY;
    }

    const dx = x2 - x1;
    const dy = y2 - y1;

    let d = 2 * (dx - dy);

    const incrS = 2 * dx;
    const incrSWE = (y2 - y1) * (x2 - x1) > 0 ? 2 * (dx - dy) : 2 * (dx + dy);
    const xi = (y2 - y1) * (x2 - x1) > 0 ? 1 : -1;

    let x = x1;
    let y = y1;

    while (y < y2) {
      if (d * xi < 0) {
        d += incrS;
        y++;
      } else {
        d += incrSWE;
        y++;
        x += xi;
      }
      for (let i = 0; i < _.thickness; i++) {
        drawPixel({ x: Math.ceil(x - _.thickness / 2) + i, y: y }, 1);
      }
    }
  }
}

export function drawPolygons() {
  _.polygons.forEach((polygon) => {
    for (let i = 0; i < polygon.vertices.length; i++) {
      drawLine(
        polygon.vertices[i].position,
        polygon.vertices[(i + 1) % polygon.vertices.length].position,
        polygon.vertices[i].edgeColor,
      );
      drawPoint(
        polygon.vertices[i].position,
        polygon.vertices[i].radius,
        polygon.vertices[i].color,
      );
    }
  });
}
