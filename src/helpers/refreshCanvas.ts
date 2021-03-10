import Creator from '../creator';

import { Color } from '../constants/Color';

export function refreshCanvas() {
  Creator.context.clearRect(0, 0, Creator.canvas.width, Creator.canvas.height);
  const fS = Creator.hContext.fillStyle;
  Creator.hContext.fillStyle = Color.White;
  Creator.hContext.fillRect(0, 0, Creator.hCanvas.width, Creator.hCanvas.height);
  Creator.hContext.fillStyle = fS;
  Creator.drawer.drawPolygons();
}
