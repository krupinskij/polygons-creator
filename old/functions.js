"use strict"

function refreshCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (antialiasingCheckBox.checked) {
    newContext.clearRect(0, 0, newCanvas.width, newCanvas.height);
    const fS = newContext.fillStyle;
    newContext.fillStyle = "white";
    newContext.fillRect(0, 0, newCanvas.width, newCanvas.height);
    newContext.fillStyle = fS;
    multisampling()
  } else {
    drawPolygons();
  }
}

// obliczamy dystans między dwoma punktami
function calcDistance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// pobieramy punkt z eventu
function getPoint(event) {
  return { x: event.x - canvas.offsetLeft, y: event.y - canvas.offsetTop };
}

// sprawdzamy czy punkt e jest w jednej linii między p1 i p2
function areInLine(p1, p2, e) {

  const dxc = e.x - p1.x;
  const dyc = e.y - p1.y;

  const dxl = p2.x - p1.x;
  const dyl = p2.y - p1.y;

  const cross = dxc * dyl - dyc * dxl;

  if (Math.abs(cross) > 500)
    return false;

  if (Math.abs(dxl) >= Math.abs(dyl))
    return dxl > 0 ?
      p1.x <= e.x && e.x <= p2.x :
      p2.x <= e.x && e.x <= p1.x;
  else
    return dyl > 0 ?
      p1.y <= e.y && e.y <= p2.y :
      p2.y <= e.y && e.y <= p1.y;

  //https://stackoverflow.com/questions/11907947/how-to-check-if-a-point-lies-on-a-line-between-2-other-points
}