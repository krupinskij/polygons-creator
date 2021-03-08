import { Color } from '../constants/Color';
import { Edition } from '../constants/Edition';
import Creator from '../creator';
import { calcDistance } from '../helpers/calcDistance';
import { getPoint } from '../helpers/getPoint';
import { refreshCanvas } from '../helpers/refreshCanvas';
import { throwError } from '../helpers/throwError';
import Vertex from '../model/Vertex';
import { drawPoint } from '../utils/drawing';
import EditionController from './EditionController';

class DeleteVertexController implements EditionController {
  public edition: Edition;

  private vertexToDelete: Vertex | null;
  private canDeleteVertex: boolean;

  constructor() {
    this.edition = Edition.DeleteVertex;

    this.vertexToDelete = null;
    this.canDeleteVertex = false;
  }

  mousedownEventHandler(event: MouseEvent): void {
    if (this.canDeleteVertex) {
      if (!Creator.currentPolygon) {
        throwError('Error removing vertex!');
      }

      if (Creator.currentPolygon.vertices.length > 3) {
        const index = Creator.currentPolygon.vertices.findIndex((elem) => elem === this.vertexToDelete);
        const vertex = this.vertexToDelete;

        if (!vertex || !vertex.prevVertex || !vertex.nextVertex) {
          throwError('Error removing vertex!');
        }

        vertex.prevVertex.nextVertex = vertex.nextVertex;
        vertex.nextVertex.prevVertex = vertex.prevVertex;

        Creator.currentPolygon.vertices.splice(index, 1);
      }
    }
  }

  mousemoveEventHandler(event: MouseEvent): void {
    refreshCanvas();

    Creator.currPoint = getPoint(event);
    this.canDeleteVertex = false;

    if (!Creator.currentPolygon) {
      throwError('Error removing vertex!');
    }

    Creator.currentPolygon.vertices.forEach((vertex) => {
      if (!Creator.currPoint) return;

      if (calcDistance(vertex.position, Creator.currPoint) < 10) {
        drawPoint(vertex.position, 10, Color.Red);
        this.vertexToDelete = vertex;
        this.canDeleteVertex = true;
      }
    });
  }

  mouseupEventHandler(event: MouseEvent): void {
    this.canDeleteVertex = false;
    this.vertexToDelete = null;

    Creator.prevPoint = Creator.currPoint = null;
    refreshCanvas();
  }
}

export default new DeleteVertexController();
