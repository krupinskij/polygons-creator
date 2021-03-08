import _ from '../creator';

import { drawPolygons } from '../utils/drawing';

export function refreshCanvas() {
  _.context.clearRect(0, 0, _.canvas.width, _.canvas.height);

  drawPolygons();
}
