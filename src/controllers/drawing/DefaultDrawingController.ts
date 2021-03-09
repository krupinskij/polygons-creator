import { Color } from '../../constants/Color';
import Creator from '../../creator';
import Point from '../../model/Point';
import DrawingController from './DrawingController';

class DefaultDrawingController implements DrawingController {
  drawPoint({ x, y }: Point, r: number, color: Color): void {
    Creator.context.fillStyle = color;

    Creator.context.beginPath();
    Creator.context.arc(x, y, r, 0, 2 * Math.PI, true);
    Creator.context.fill();

    Creator.context.fillStyle = Color.Black;
  }

  drawPixel({ x, y }: Point, w: number): void {
    Creator.context.fillRect(x, y, w, w);
  }

  drawLine({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point = { x: x1, y: y1 }, color: Color) {
    Creator.context.fillStyle = color;

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
        for (let i = 0; i < Creator.thickness; i++) {
          this.drawPixel({ x: x, y: Math.ceil(y - Creator.thickness / 2) + i }, 1);
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
        for (let i = 0; i < Creator.thickness; i++) {
          this.drawPixel({ x: Math.ceil(x - Creator.thickness / 2) + i, y: y }, 1);
        }
      }
    }
  }

  drawPolygons() {
    Creator.polygons
      .filter((polygon) => polygon.id !== Creator.currentPolygon?.id)
      .forEach((polygon) => {
        polygon.vertices.forEach((vertex) => {
          this.drawLine(vertex.position, vertex.nextVertex?.position || vertex.position, Color.Gray);
        });
        polygon.vertices.forEach((vertex) => {
          this.drawPoint(vertex.position, vertex.radius, Color.Gray);
        });
      });

    if (!Creator.currentPolygon) return;
    Creator.currentPolygon.vertices.forEach((vertex) => {
      this.drawLine(vertex.position, vertex.nextVertex?.position || vertex.position, vertex.edgeColor);
    });
    Creator.currentPolygon.vertices.forEach((vertex) => {
      this.drawPoint(vertex.position, vertex.radius, vertex.color);
    });
  }
}

export default new DefaultDrawingController();
