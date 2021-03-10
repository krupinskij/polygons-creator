import Creator from '../../creator';
import EditionController from './EditionController';

import Vertex from '../../model/Vertex';

import { Color } from '../../constants/Color';
import { Edition } from '../../constants/Edition';

import { areInLine } from '../../helpers/areInLine';
import { getPoint } from '../../helpers/getPoint';
import { refreshCanvas } from '../../helpers/refreshCanvas';
import { throwError } from '../../helpers/throwError';

class MoveEdgeController implements EditionController {
  public edition = Edition.MoveEdge;

  private edgeFounded: boolean;
  private canMoveEdge: boolean;
  private edgeToMove: Vertex[];

  constructor() {
    this.edition = Edition.MoveEdge;

    this.edgeFounded = false;
    this.canMoveEdge = false;
    this.edgeToMove = [];
  }

  mousedownEventHandler(event: MouseEvent): void {
    this.edgeToMove = this.edgeToMove || [];
    if (this.edgeToMove.length === 2) {
      this.edgeToMove[0].color = Color.Red;
      this.edgeToMove[0].edgeColor = Color.Red;
      this.edgeToMove[1].color = Color.Red;

      this.canMoveEdge = true;

      Creator.prevPoint = getPoint(event);

      refreshCanvas();
    }
  }

  mousemoveEventHandler(event: MouseEvent): void {
    refreshCanvas();

    Creator.currPoint = getPoint(event);
    this.edgeFounded = false;

    this.edgeToMove = this.edgeToMove || [];
    if (this.edgeToMove.length === 2 && !this.canMoveEdge) {
      this.edgeToMove[0].color = Color.Blue;
      this.edgeToMove[0].edgeColor = Color.Black;
      this.edgeToMove[1].color = Color.Blue;
    }

    if (!Creator.currentPolygon) {
      throwError('Error moving edge!');
    }

    Creator.currentPolygon.vertices.forEach((vertex) => {
      if (this.canMoveEdge || !Creator.currPoint) return;
      if (!vertex.nextVertex) {
        throwError('Error moving edge!');
      }

      if (areInLine(vertex.position, vertex.nextVertex.position, Creator.currPoint)) {
        vertex.color = Color.Red;
        vertex.edgeColor = Color.Red;
        vertex.nextVertex.color = Color.Red;

        this.edgeToMove = [vertex, vertex.nextVertex];

        this.edgeFounded = true;
      }
    });

    if (this.canMoveEdge) {
      this.edgeToMove.forEach((vertex) => {
        if (!Creator.currPoint || !Creator.prevPoint) {
          throwError('Error moving edge!');
        }
        vertex.position.x += Creator.currPoint.x - Creator.prevPoint.x;
        vertex.position.y += Creator.currPoint.y - Creator.prevPoint.y;
      });

      Creator.prevPoint = Creator.currPoint;
      refreshCanvas();
    }
  }

  mouseupEventHandler(event: MouseEvent): void {
    this.canMoveEdge = false;
    this.edgeFounded = false;

    if (this.edgeToMove.length === 2) {
      this.edgeToMove[0].color = Color.Blue;
      this.edgeToMove[0].edgeColor = Color.Black;
      this.edgeToMove[1].color = Color.Blue;
    }

    this.edgeToMove = [];

    Creator.prevPoint = Creator.currPoint = null;

    refreshCanvas();
  }
}

export default new MoveEdgeController();
