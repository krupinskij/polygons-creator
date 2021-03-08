import Point from '../model/Point';

export function areInLine(p1: Point, p2: Point, e: Point) {
  const dxc = e.x - p1.x;
  const dyc = e.y - p1.y;

  const dxl = p2.x - p1.x;
  const dyl = p2.y - p1.y;

  const cross = dxc * dyl - dyc * dxl;

  if (Math.abs(cross) > 500) return false;

  if (Math.abs(dxl) >= Math.abs(dyl)) return dxl > 0 ? p1.x <= e.x && e.x <= p2.x : p2.x <= e.x && e.x <= p1.x;
  else return dyl > 0 ? p1.y <= e.y && e.y <= p2.y : p2.y <= e.y && e.y <= p1.y;
}
