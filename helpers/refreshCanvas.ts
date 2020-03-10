import app from '../app.js';

import { drawPolygons } from '../utils/drawing.js';

export default function refreshCanvas() {
    app.context.clearRect(0, 0, app.canvas.width, app.canvas.height);
    drawPolygons();
}