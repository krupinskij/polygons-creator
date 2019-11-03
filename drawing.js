"use strict"

// rysowanie punktu (kursor, wierzchołki...)
function drawPoint({ x, y }, r, color) {

  context.fillStyle = color;

  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, true);
  context.fill();

  context.fillStyle = "black";
}

// rysowanie pikseli
function drawPixel({ x, y }, w) {
  context.fillRect(x, y, w, w);
}

// rysowanie etykiet
function drawRelationMark(p1, p2, relation, id) {

  const x = (p1.x + p2.x) / 2;
  const y = (p1.y + p2.y) / 2;

  if (relation === "equal") {
    context.fillStyle = "orange";
  } else if (relation === "parallel") {
    context.fillStyle = "pink";
  } else {
    context.fillStyle = "black";
  }

  context.fillRect(x + 10, y + 10, 25, 25);

  context.fillStyle = "black";

  context.fillText(id, x + 15, y + 25)
}

// rysowanie linii Bresenhamem
function drawLine(pP, cP, color) {

  context.fillStyle = color;

  // pobieramy współrzędne z punktów
  let x1 = pP.x, y1 = pP.y;
  let x2 = cP.x, y2 = cP.y;

  // sprawdzamy czy linia jest bardziej pozioma (czyli iteracja po x) czy pionowa (czyli iteracja po y)
  if (Math.abs(y2 - y1) < Math.abs(x2 - x1)) {

    // zapewniamy by x1<x2
    if (x1 > x2) {
      let tmpX = x1; x1 = x2; x2 = tmpX;
      let tmpY = y1; y1 = y2; y2 = tmpY;
    }

    // to Pan zna
    const dx = x2 - x1;
    const dy = y2 - y1;

    let d = 2 * (dy - dx);

    const incrE = 2 * dy;
    const incrNSE = (y2 - y1) * (x2 - x1) > 0 ? 2 * (dy - dx) : 2 * (dx + dy); // rozróżniamy NE i SE
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
      drawPixel({ x: x, y: y }, 1)
    }

  } else {

    if (y1 > y2) {
      let tmpX = x1; x1 = x2; x2 = tmpX;
      let tmpY = y1; y1 = y2; y2 = tmpY;
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
      drawPixel({ x: x, y: y }, 1)
    }
  }
}

// rysowanie wierzchołków
function drawPolygons() {

  state.polygons.forEach(polygon => {
    for (let i = 0; i < polygon.verticesCount; i++) {
      drawLine(polygon.vertices[i].position, polygon.vertices[(i + 1) % polygon.verticesCount].position, polygon.vertices[i].edgeColor);
      drawPoint(polygon.vertices[i].position, polygon.vertices[i].radius, polygon.vertices[i].color);
      if (polygon.vertices[i].relationId > -1) {
        drawRelationMark(polygon.vertices[i].position, polygon.vertices[(i + 1) % polygon.verticesCount].position, polygon.vertices[i].relation, polygon.vertices[i].relationId)
      }
    }

  })
}
