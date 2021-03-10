import Creator from '../../creator';
import EditionController from './EditionController';

import Vertex from '../../model/Vertex';

import { Color } from '../../constants/Color';
import { Edition } from '../../constants/Edition';

import { getPoint } from '../../helpers/getPoint';
import { calcDistance } from '../../helpers/calcDistance';
import { refreshCanvas } from '../../helpers/refreshCanvas';
import { throwError } from '../../helpers/throwError';

class MoveVertexController implements EditionController {
  public edition: Edition;
  private vertexFounded: boolean;
  private canMoveVertex: boolean;
  private vertexToMove: Vertex | null;
  private indexToMove: number | null;

  constructor() {
    (this.edition = Edition.MoveVertex), (this.vertexFounded = false);
    this.canMoveVertex = false;

    this.vertexToMove = null;
    this.indexToMove = null;
  }

  mousedownEventHandler(event: MouseEvent): void {
    if (this.vertexFounded) {
      if (!this.vertexToMove) {
        throwError('Error moving vertex');
      }
      this.vertexToMove.color = Color.Red;
      this.canMoveVertex = true;

      Creator.prevPoint = getPoint(event);
      refreshCanvas();
    }
  }

  mousemoveEventHandler(event: MouseEvent): void {
    refreshCanvas();
    Creator.currPoint = getPoint(event);
    this.vertexFounded = false;

    if (this.vertexToMove && !this.canMoveVertex) {
      this.vertexToMove.color = Color.Blue;
    }

    if (!Creator.currentPolygon) {
      throwError('Error moving vertex');
    }

    Creator.currentPolygon.vertices.forEach((vertex) => {
      if (this.canMoveVertex) return;
      if (!Creator.currPoint || !Creator.currentPolygon) return;

      if (calcDistance(Creator.currPoint, vertex.position) < 10) {
        vertex.color = Color.Red;

        this.vertexToMove = vertex;
        this.indexToMove = Creator.currentPolygon.vertices.findIndex((el) => el === vertex);
        this.vertexFounded = true;
      }
    });

    if (this.canMoveVertex) {
      if (!this.vertexToMove || !Creator.currPoint || !Creator.prevPoint) {
        throwError('Error moving vertex');
      }

      this.vertexToMove.position.x += Creator.currPoint.x - Creator.prevPoint.x;
      this.vertexToMove.position.y += Creator.currPoint.y - Creator.prevPoint.y;
      Creator.prevPoint = Creator.currPoint;

      refreshCanvas();
    }
  }

  mouseupEventHandler(event: MouseEvent): void {
    this.canMoveVertex = false;
    this.vertexFounded = false;
    if (this.vertexToMove) {
      this.vertexToMove.color = Color.Blue;
    }
    this.vertexToMove = null;
    this.indexToMove = null;
    Creator.prevPoint = Creator.currPoint = null;
  }
}

export default new MoveVertexController();
