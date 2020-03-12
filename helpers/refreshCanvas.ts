import app from '../app.js';

import { drawPolygons, multisampling } from '../utils/drawing.js';

import { Color } from '../constants/Color.js';

const antialiasingCheckBox: HTMLInputElement = document.getElementById("checkbox-antialiasing") as HTMLInputElement;

export default function refreshCanvas() {
    app.context.clearRect(0, 0, app.canvas.width, app.canvas.height);
    
    if (antialiasingCheckBox.checked) {
        app.hContext.clearRect(0, 0, app.hCanvas.width, app.hCanvas.height);
        const fS = app.hContext.fillStyle;
        app.hContext.fillStyle = Color.White;
        app.hContext.fillRect(0, 0, app.hCanvas.width, app.hCanvas.height);
        app.hContext.fillStyle = fS;
        multisampling()
      } else {
        drawPolygons();
      }
}