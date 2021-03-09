import { Color } from '../../constants/Color';
import Creator from '../../creator';
import Point from '../../model/Point';
import DrawingController from './DrawingController';

class MultiSamplingDrawingController implements DrawingController {
  drawPoint({ x, y }: Point, r: number, color: Color) {
    Creator.context.fillStyle = color;

    Creator.context.beginPath();
    Creator.context.arc(x, y, r, 0, 2 * Math.PI, true);
    Creator.context.fill();

    Creator.context.fillStyle = Color.Black;
  }

  drawPixel({ x, y }: Point, w: number): void {
    Creator.hContext.fillRect(x, y, w, w);
  }

  private drawPixel2({ x, y }: Point, w: number): void {
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
          this.drawPixel2({ x: x, y: Math.ceil(y - Creator.thickness / 2) + i }, 1);
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
          this.drawPixel2({ x: Math.ceil(x - Creator.thickness / 2) + i, y: y }, 1);
        }
      }
    }
  }

  drawEdge(pP: Point, cP: Point = pP, color: Color) {
    Creator.hContext.fillStyle = color;

    let x1 = pP.x * 2,
      y1 = pP.y * 2;
    let x2 = cP.x * 2,
      y2 = cP.y * 2;

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
    Creator.polygons.forEach((polygon) => {
      if (polygon.id !== Creator.currentPolygon?.id) {
        polygon.vertices.forEach((vertex) => {
          this.drawEdge(vertex.position, vertex.nextVertex?.position, Color.Gray);
        });
      } else {
        Creator.currentPolygon.vertices.forEach((vertex) => {
          this.drawEdge(vertex.position, vertex.nextVertex?.position, vertex.edgeColor);
        });
      }
    });

    this.multisampling();

    Creator.polygons.forEach((polygon) => {
      if (polygon.id !== Creator.currentPolygon?.id) {
        polygon.vertices.forEach((vertex) => {
          this.drawPoint(vertex.position, vertex.radius, Color.Gray);
        });
      } else {
        Creator.currentPolygon.vertices.forEach((vertex) => {
          this.drawPoint(vertex.position, vertex.radius, vertex.color);
        });
      }
    });
  }

  private multisampling() {
    const width = Creator.canvas.width;
    const height = Creator.canvas.height;
    const hWidth = Creator.hCanvas.width;
    const hHeight = Creator.hCanvas.height;

    const imgData2 = Creator.hContext.getImageData(0, 0, hWidth, hHeight);
    const arr = new Uint8ClampedArray(width * height * 4);

    for (let i = 0, j = 0; j < imgData2.data.length / 4; i += 8, j += 4) {
      if (i % (hWidth * 4) === 0 && (i / (hWidth * 4)) % 2 === 1) {
        i += Creator.hCanvas.width * 4;
      }

      arr[j] = Math.floor(
        (imgData2.data[i] + imgData2.data[i + 4] + imgData2.data[i + hWidth * 4] + imgData2.data[i + hWidth * 4 + 4]) /
          4,
      );
      arr[j + 1] = Math.floor(
        (imgData2.data[i + 1] +
          imgData2.data[i + 5] +
          imgData2.data[i + hWidth * 4 + 1] +
          imgData2.data[i + hWidth * 4 + 5]) /
          4,
      );
      arr[j + 2] = Math.floor(
        (imgData2.data[i + 2] +
          imgData2.data[i + 6] +
          imgData2.data[i + hWidth * 4 + 2] +
          imgData2.data[i + hWidth * 4 + 6]) /
          4,
      );
      arr[j + 3] = 255;
    }
    let imageData = new ImageData(arr, width, height);
    Creator.context.putImageData(imageData, 0, 0);
  }
}

export default new MultiSamplingDrawingController();
