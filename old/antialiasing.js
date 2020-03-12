const antialiasingCheckBox = document.getElementById("checkbox-antialiasing");
antialiasingCheckBox.addEventListener('change', refreshCanvas);

function drawPixelMS({ x, y }, w) {
	newContext.fillRect(x, y, w, w);
}

function drawPointMS({ x, y }, r, color) {

  newContext.fillStyle = color;

  newContext.beginPath();
  newContext.arc(2*x, 2*y, 2*r, 0, 2 * Math.PI, true);
  newContext.fill();

  newContext.fillStyle = "black";
}

function drawLineMS(pP, cP, color) {

	newContext.fillStyle = color;

	let x1 = pP.x * 2, y1 = pP.y * 2;
	let x2 = cP.x * 2, y2 = cP.y * 2;

	if (Math.abs(y2 - y1) < Math.abs(x2 - x1)) {

		if (x1 > x2) {

			let tmpX = x1; x1 = x2; x2 = tmpX;
			let tmpY = y1; y1 = y2; y2 = tmpY;
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
			for(let i=0; i<state.thickness; i++) {
        drawPixelMS({ x: x, y: y-state.thickness + 2*i }, 2)
      }
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
			for(let i=0; i<state.thickness; i++) {
        drawPixelMS({ x: x-state.thickness + 2*i, y: y }, 2)
      }
		}
	}

	newContext.fillStyle = "black";
}

function multisampling() {

	drawEdgesMS();

	const imgData2 = newContext.getImageData(0, 0, newCanvas.width, newCanvas.height);
	const arr = new Uint8ClampedArray(canvas.width * canvas.height * 4);

	for (let i = 0, j = 0; j < imgData2.data.length / 4; i += 8, j += 4) {

		if (i % (newCanvas.width * 4) === 0 && (i / (newCanvas.width * 4)) % 2 === 1) i += newCanvas.width * 4;

		arr[j] = Math.floor((imgData2.data[i] + imgData2.data[i + 4] + imgData2.data[i + newCanvas.width * 4] + imgData2.data[i + newCanvas.width * 4 + 4]) / 4);
		arr[j + 1] = Math.floor((imgData2.data[i + 1] + imgData2.data[i + 5] + imgData2.data[i + newCanvas.width * 4 + 1] + imgData2.data[i + newCanvas.width * 4 + 5]) / 4);
		arr[j + 2] = Math.floor((imgData2.data[i + 2] + imgData2.data[i + 6] + imgData2.data[i + newCanvas.width * 4 + 2] + imgData2.data[i + newCanvas.width * 4 + 6]) / 4);
		arr[j + 3] = 255;

	}
	let imageData = new ImageData(arr, canvas.width, canvas.height);
	context.putImageData(imageData, 0, 0);

	drawPointsMS();

}

function drawEdgesMS() {

	state.polygons.forEach(polygon => {
		for (let i = 0; i < polygon.verticesCount; i++) {
			drawLineMS(polygon.vertices[i].position, polygon.vertices[(i + 1) % polygon.verticesCount].position, polygon.vertices[i].edgeColor);
			drawPointMS(polygon.vertices[i].position, polygon.vertices[i].radius, polygon.vertices[i].color);
		}

	})
}

function drawPointsMS() {
	state.polygons.forEach(polygon => {
		for (let i = 0; i < polygon.verticesCount; i++) {
			if (polygon.vertices[i].relationId > -1) {
				drawRelationMark(polygon.vertices[i].position, polygon.vertices[(i + 1) % polygon.verticesCount].position, polygon.vertices[i].relation, polygon.vertices[i].relationId)
			}
		}

	})
}