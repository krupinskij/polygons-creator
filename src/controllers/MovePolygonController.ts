import { getPoint } from '../helpers/getPoint';
import { refreshCanvas } from '../helpers/refreshCanvas';
import { Edition } from '../constants/Edition';
import Creator from '../creator';
import { throwError } from '../helpers/throwError';
import EditionController from './EditionController';

class MovePolygonController implements EditionController {
  public edition: Edition;
  private canMovePolygon: boolean;

  constructor() {
    (this.edition = Edition.MovePolygon), (this.canMovePolygon = false);
  }

  mousedownEventHandler(event: MouseEvent): void {
    this.canMovePolygon = true;
    Creator.prevPoint = getPoint(event);
  }

  mousemoveEventHandler(event: MouseEvent): void {
    Creator.currPoint = getPoint(event);

    if (!Creator.currentPolygon) throwError('Error moving polygon');

    if (this.canMovePolygon) {
      Creator.currentPolygon.vertices.forEach((vertex) => {
        if (!Creator.currPoint || !Creator.prevPoint) {
          throwError('Error moving polygon');
        }

        vertex.position.x += Creator.currPoint.x - Creator.prevPoint.x;
        vertex.position.y += Creator.currPoint.y - Creator.prevPoint.y;
      });

      Creator.prevPoint = Creator.currPoint;
      refreshCanvas();
    }
  }

  mouseupEventHandler(event: MouseEvent): void {
    this.canMovePolygon = false;
    Creator.prevPoint = Creator.currPoint = null;
  }
}

export default new MovePolygonController();
