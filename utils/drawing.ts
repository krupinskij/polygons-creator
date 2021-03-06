import app from '../app';

import Point from '../model/Point';

import refreshCanvas from '../helpers/refreshCanvas';

import { Color } from '../constants/Color';
import { Relation } from '../constants/Relation';

const antialiasingCheckBox: HTMLInputElement = document.getElementById(
  'checkbox-antialiasing',
) as HTMLInputElement;

export function drawPoint(p: Point, r: number, color: Color): void {
  app.context.fillStyle = color;

  app.context.beginPath();
  app.context.arc(p.x, p.y, r, 0, 2 * Math.PI, true);
  app.context.fill();

  app.context.fillStyle = Color.Black;
}

function drawPixel(p: Point, w: number): void {
  app.context.fillRect(p.x, p.y, w, w);
}

function drawRelationMark(
  p1: Point,
  p2: Point,
  relation: Relation,
  id: number,
) {
  const x = (p1.x + p2.x) / 2;
  const y = (p1.y + p2.y) / 2;

  if (relation === Relation.Equal) {
    app.context.fillStyle = Color.Orange;
  } else if (relation === Relation.Parallel) {
    app.context.fillStyle = Color.Pink;
  } else {
    app.context.fillStyle = Color.Black;
  }

  app.context.fillRect(x + 10, y + 10, 25, 25);
  app.context.fillStyle = Color.Black;
  app.context.fillText(String(id), x + 15, y + 25);
}

export function drawLine(pP: Point, cP: Point, color: Color) {
  app.context.fillStyle = color;

  let x1 = pP.x,
    y1 = pP.y;
  let x2 = cP.x,
    y2 = cP.y;

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
      for (let i = 0; i < app.thickness; i++) {
        drawPixel({ x: x, y: Math.ceil(y - app.thickness / 2) + i }, 1);
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
      for (let i = 0; i < app.thickness; i++) {
        drawPixel({ x: Math.ceil(x - app.thickness / 2) + i, y: y }, 1);
      }
    }
  }
}

export function drawPolygons() {
  app.polygons.forEach((polygon) => {
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

      if (polygon.vertices[i].relationId !== null) {
        drawRelationMark(
          polygon.vertices[i].position,
          polygon.vertices[(i + 1) % polygon.vertices.length].position,
          polygon.vertices[i].relation,
          polygon.vertices[i].relationId as number,
        );
      }
    }
  });
}

antialiasingCheckBox.addEventListener('change', refreshCanvas);

export function multisampling() {
  drawEdgesMS();

  const imgData2 = app.hContext.getImageData(
    0,
    0,
    app.hCanvas.width,
    app.hCanvas.height,
  );
  const arr = new Uint8ClampedArray(app.canvas.width * app.canvas.height * 4);

  for (let i = 0, j = 0; j < imgData2.data.length / 4; i += 8, j += 4) {
    if (
      i % (app.hCanvas.width * 4) === 0 &&
      (i / (app.hCanvas.width * 4)) % 2 === 1
    )
      i += app.hCanvas.width * 4;

    arr[j] = Math.floor(
      (imgData2.data[i] +
        imgData2.data[i + 4] +
        imgData2.data[i + app.hCanvas.width * 4] +
        imgData2.data[i + app.hCanvas.width * 4 + 4]) /
        4,
    );
    arr[j + 1] = Math.floor(
      (imgData2.data[i + 1] +
        imgData2.data[i + 5] +
        imgData2.data[i + app.hCanvas.width * 4 + 1] +
        imgData2.data[i + app.hCanvas.width * 4 + 5]) /
        4,
    );
    arr[j + 2] = Math.floor(
      (imgData2.data[i + 2] +
        imgData2.data[i + 6] +
        imgData2.data[i + app.hCanvas.width * 4 + 2] +
        imgData2.data[i + app.hCanvas.width * 4 + 6]) /
        4,
    );
    arr[j + 3] = 255;
  }
  let imageData = new ImageData(arr, app.canvas.width, app.canvas.height);
  app.context.putImageData(imageData, 0, 0);

  drawPointsMS();
}

function drawPixelMS(p: Point, w: number) {
  app.hContext.fillRect(p.x, p.y, w, w);
}

function drawPointMS(p: Point, r: number, color: Color) {
  app.hContext.fillStyle = color;

  app.hContext.beginPath();
  app.hContext.arc(2 * p.x, 2 * p.y, 2 * r, 0, 2 * Math.PI, true);
  app.hContext.fill();

  app.hContext.fillStyle = Color.Black;
}

function drawLineMS(pP: Point, cP: Point, color: Color) {
  app.hContext.fillStyle = color;

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
      for (let i = 0; i < app.thickness; i++) {
        drawPixelMS({ x: x, y: y - app.thickness + 2 * i }, 2);
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
      for (let i = 0; i < app.thickness; i++) {
        drawPixelMS({ x: x - app.thickness + 2 * i, y: y }, 2);
      }
    }
  }

  app.hContext.fillStyle = Color.Black;
}

function drawEdgesMS() {
  app.polygons.forEach((polygon) => {
    for (let i = 0; i < polygon.vertices.length; i++) {
      drawLineMS(
        polygon.vertices[i].position,
        polygon.vertices[(i + 1) % polygon.vertices.length].position,
        polygon.vertices[i].edgeColor,
      );
      drawPointMS(
        polygon.vertices[i].position,
        polygon.vertices[i].radius,
        polygon.vertices[i].color,
      );
    }
  });
}

function drawPointsMS() {
  app.polygons.forEach((polygon) => {
    for (let i = 0; i < polygon.vertices.length; i++) {
      if (polygon.vertices[i].relation !== Relation.None) {
        drawRelationMark(
          polygon.vertices[i].position,
          polygon.vertices[(i + 1) % polygon.vertices.length].position,
          polygon.vertices[i].relation,
          polygon.vertices[i].relation,
        );
      }
    }
  });
}
