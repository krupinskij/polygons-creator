import { Color } from '../constants/Color';
import { Edition } from '../constants/Edition';
import Creator from '../creator';
import { areInLine } from '../helpers/areInLine';
import { getPoint } from '../helpers/getPoint';
import { refreshCanvas } from '../helpers/refreshCanvas';
import { throwError } from '../helpers/throwError';
import Vertex from '../model/Vertex';
import EditionController from './EditionController';

class AddVertexController implements EditionController {
  public edition: Edition;
  private canAddVertex: boolean;
  private vertexToAdd: Vertex | null;

  constructor() {
    this.edition = Edition.AddVertex;

    this.canAddVertex = false;
    this.vertexToAdd = null;
  }

  mousedownEventHandler(event: MouseEvent): void {
    const currPoint = getPoint(event);

    if (this.canAddVertex) {
      if (!Creator.currentPolygon || !this.vertexToAdd) {
        throwError('Error adding vertex!');
      }

      const index = Creator.currentPolygon.vertices.findIndex((elem) => elem === this.vertexToAdd);
      Creator.currentPolygon.vertices.splice(index + 1, 0, new Vertex(currPoint));

      Creator.currentPolygon.vertices[index + 1].nextVertex = this.vertexToAdd.nextVertex;
      this.vertexToAdd.nextVertex = Creator.currentPolygon.vertices[index + 1];

      Creator.currentPolygon.vertices[index + 1].prevVertex = this.vertexToAdd;
      (Creator.currentPolygon.vertices[index + 1].nextVertex as Vertex).prevVertex =
        Creator.currentPolygon.vertices[index + 1];
    }
  }

  mousemoveEventHandler(event: MouseEvent): void {
    Creator.currPoint = getPoint(event);
    this.canAddVertex = false;

    if (this.vertexToAdd && !this.canAddVertex) {
      if (!this.vertexToAdd.nextVertex) {
        throwError('Error adding vertex!');
      }
      this.vertexToAdd.color = Color.Blue;
      this.vertexToAdd.edgeColor = Color.Black;
      this.vertexToAdd.nextVertex.color = Color.Blue;
    }

    if (!Creator.currentPolygon) {
      throwError('Error adding vertex!');
    }

    Creator.currentPolygon.vertices.forEach((vertex) => {
      if (!vertex.nextVertex) {
        throwError('Error adding vertex!');
      }
      if (!Creator.currPoint) return;

      if (areInLine(vertex.position, vertex.nextVertex.position, Creator.currPoint)) {
        vertex.color = Color.Red;
        vertex.edgeColor = Color.Red;
        vertex.nextVertex.color = Color.Red;

        this.canAddVertex = true;
        this.vertexToAdd = vertex;
      }
    });

    refreshCanvas();
  }

  mouseupEventHandler(event: MouseEvent): void {
    if (!this.vertexToAdd || !this.vertexToAdd.nextVertex || !this.vertexToAdd.nextVertex.nextVertex) {
      throwError('Error adding vertex!');
    }

    this.canAddVertex = false;
    this.vertexToAdd.color = Color.Blue;
    this.vertexToAdd.edgeColor = Color.Black;
    this.vertexToAdd.nextVertex.edgeColor = Color.Black;
    this.vertexToAdd.nextVertex.nextVertex.color = Color.Blue;

    this.vertexToAdd = null;

    Creator.prevPoint = Creator.currPoint = null;

    refreshCanvas();
  }
}

export default new AddVertexController();
