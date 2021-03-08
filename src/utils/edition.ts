import Creator from '../creator';

import Vertex from '../model/Vertex';

import { Color } from '../constants/Color';
import { Edition } from '../constants/Edition';

import { getPoint } from '../helpers/getPoint';
import { refreshCanvas } from '../helpers/refreshCanvas';
import { calcDistance } from '../helpers/calcDistance';
import { areInLine } from '../helpers/areInLine';

import { drawPoint } from '../utils/drawing';
import { getElementById } from '../helpers/getElement';
import { throwError } from '../helpers/throwError';
import { ErrorCode } from '../constants/ErrorCode';

const movePolygonBtn: HTMLButtonElement = getElementById('button-polygon-movePolygon');
const moveVertexBtn: HTMLButtonElement = getElementById('button-polygon-moveVertex');
const addVertexBtn: HTMLButtonElement = getElementById('button-polygon-addVertex');
const deleteVertexBtn: HTMLButtonElement = getElementById('button-polygon-deleteVertex');
const moveEdgeBtn: HTMLButtonElement = getElementById('button-polygon-moveEdge');

interface IController {
  edition: Edition;

  mousedownEventHandler(event: MouseEvent): void;
  mousemoveEventHandler(event: MouseEvent): void;
  mouseupEventHandler(event: MouseEvent): void;
}

const movePolygonController = {
  edition: Edition.MovePolygon,
  canMovePolygon: false,

  mousedownEventHandler: (event: MouseEvent) => {
    movePolygonController.canMovePolygon = true;
    Creator.prevPoint = getPoint(event);
  },

  mousemoveEventHandler: (event: MouseEvent) => {
    Creator.currPoint = getPoint(event);

    if (!Creator.currentPolygon) throwError(ErrorCode.MovePolygonError);

    if (movePolygonController.canMovePolygon) {
      Creator.currentPolygon.vertices.forEach((vertex) => {
        if (!Creator.currPoint || !Creator.prevPoint) throwError(ErrorCode.MovePolygonError);

        vertex.position.x += Creator.currPoint.x - Creator.prevPoint.x;
        vertex.position.y += Creator.currPoint.y - Creator.prevPoint.y;
      });

      Creator.prevPoint = Creator.currPoint;
      refreshCanvas();
    }
  },

  mouseupEventHandler: (event: MouseEvent) => {
    movePolygonController.canMovePolygon = false;
    Creator.prevPoint = Creator.currPoint = null;
  },
};

let moveVertexController = {
  edition: Edition.MoveVertex,

  vertexFounded: false,
  canMoveVertex: false,

  vertexToMove: null as Vertex | null,
  indexToMove: null as number | null,

  mousedownEventHandler: (event: MouseEvent) => {
    if (moveVertexController.vertexFounded) {
      if (!moveVertexController.vertexToMove) {
        throwError('Error occured when move edge');
      }
      moveVertexController.vertexToMove.color = Color.Red;
      moveVertexController.canMoveVertex = true;

      Creator.prevPoint = getPoint(event);
      refreshCanvas();
    }
  },

  mousemoveEventHandler: (event: MouseEvent) => {
    refreshCanvas();
    Creator.currPoint = getPoint(event);
    moveVertexController.vertexFounded = false;

    if (moveVertexController.vertexToMove && !moveVertexController.canMoveVertex) {
      moveVertexController.vertexToMove.color = Color.Blue;
    }

    if (!Creator.currentPolygon) {
      throwError('Wystąpił błąd podczas przesuwania wierzchołka!');
    }

    Creator.currentPolygon.vertices.forEach((vertex) => {
      if (moveVertexController.canMoveVertex) return;
      if (!Creator.currPoint || !Creator.currentPolygon) return;

      if (calcDistance(Creator.currPoint, vertex.position) < 10) {
        vertex.color = Color.Red;

        moveVertexController.vertexToMove = vertex;
        moveVertexController.indexToMove = Creator.currentPolygon.vertices.findIndex((el) => el === vertex);
        moveVertexController.vertexFounded = true;
      }
    });

    if (moveVertexController.canMoveVertex) {
      if (moveVertexController.vertexToMove === null || Creator.currPoint === null || Creator.prevPoint === null) {
        throwError('Wystąpił błąd podczas przesuwania wierzchołka!');
      }
      moveVertexController.vertexToMove.position.x += Creator.currPoint.x - Creator.prevPoint.x;
      moveVertexController.vertexToMove.position.y += Creator.currPoint.y - Creator.prevPoint.y;
      Creator.prevPoint = Creator.currPoint;

      refreshCanvas();
    }
  },

  mouseupEventHandler: (event: MouseEvent) => {
    moveVertexController.canMoveVertex = false;
    moveVertexController.vertexFounded = false;
    if (moveVertexController.vertexToMove) moveVertexController.vertexToMove.color = Color.Blue;
    moveVertexController.vertexToMove = null;
    moveVertexController.indexToMove = null;
    Creator.prevPoint = Creator.currPoint = null;
  },
};

let addVertexController = {
  edition: Edition.AddVertex,

  canAddVertex: false,
  vertexToAdd: null as Vertex | null,

  mousemoveEventHandler: (event: MouseEvent) => {
    Creator.currPoint = getPoint(event);
    addVertexController.canAddVertex = false;

    if (addVertexController.vertexToAdd && !addVertexController.canAddVertex) {
      if (addVertexController.vertexToAdd.nextVertex === null) {
        throw new Error('Wystąpił błąd podczas dodawania wierzchołka!');
      }
      addVertexController.vertexToAdd.color = Color.Blue;
      addVertexController.vertexToAdd.edgeColor = Color.Black;
      addVertexController.vertexToAdd.nextVertex.color = Color.Blue;
    }

    if (Creator.currentPolygon === null) {
      throw new Error('Wystąpił błąd podczas dodawania wierzchołka!');
    }

    for (const vertex of Creator.currentPolygon.vertices) {
      if (vertex.nextVertex === null) {
        throw new Error('Wystąpił błąd podczas dodawania wierzchołka!');
      }

      if (areInLine(vertex.position, vertex.nextVertex.position, Creator.currPoint)) {
        vertex.color = Color.Red;
        vertex.edgeColor = Color.Red;
        vertex.nextVertex.color = Color.Red;

        addVertexController.canAddVertex = true;
        addVertexController.vertexToAdd = vertex;
      }
    }

    refreshCanvas();
  },

  mousedownEventHandler: (event: MouseEvent) => {
    const currPoint = getPoint(event);

    if (addVertexController.canAddVertex) {
      if (Creator.currentPolygon === null || addVertexController.vertexToAdd === null) {
        throw new Error('Wystąpił błąd podczas dodawania wierzchołka!');
      }

      const index = Creator.currentPolygon.vertices.findIndex((elem) => elem === addVertexController.vertexToAdd);
      Creator.currentPolygon.vertices.splice(index + 1, 0, new Vertex(currPoint));

      Creator.currentPolygon.vertices[index + 1].nextVertex = addVertexController.vertexToAdd.nextVertex;
      addVertexController.vertexToAdd.nextVertex = Creator.currentPolygon.vertices[index + 1];

      Creator.currentPolygon.vertices[index + 1].prevVertex = addVertexController.vertexToAdd;
      (Creator.currentPolygon.vertices[index + 1].nextVertex as Vertex).prevVertex =
        Creator.currentPolygon.vertices[index + 1];
    }
  },

  mouseupEventHandler: (event: MouseEvent) => {
    if (
      addVertexController.vertexToAdd === null ||
      addVertexController.vertexToAdd.nextVertex === null ||
      addVertexController.vertexToAdd.nextVertex.nextVertex === null
    ) {
      throw new Error('Wystąpił błąd podczas dodawania wierzchołka!');
    }

    addVertexController.canAddVertex = false;
    addVertexController.vertexToAdd.color = Color.Blue;
    addVertexController.vertexToAdd.edgeColor = Color.Black;
    addVertexController.vertexToAdd.nextVertex.edgeColor = Color.Blue;
    addVertexController.vertexToAdd.nextVertex.nextVertex.color = Color.Black;

    addVertexController.vertexToAdd = null;

    Creator.prevPoint = Creator.currPoint = null;

    refreshCanvas();
  },
};

let deleteVertexController = {
  edition: Edition.DeleteVertex,

  vertexToDelete: null as Vertex | null,
  canDeleteVertex: false,

  mousemoveEventHandler: (event: MouseEvent) => {
    refreshCanvas();
    Creator.currPoint = getPoint(event);
    deleteVertexController.canDeleteVertex = false;

    if (Creator.currentPolygon === null) {
      throw new Error('Wystąpił błąd podczas usuwania wierzchołka!');
    }

    for (const vertex of Creator.currentPolygon.vertices) {
      if (calcDistance(vertex.position, Creator.currPoint) < 10) {
        drawPoint(vertex.position, 10, Color.Red);
        deleteVertexController.vertexToDelete = vertex;
        deleteVertexController.canDeleteVertex = true;
      }
    }
  },

  mousedownEventHandler: (event: MouseEvent) => {
    if (deleteVertexController.canDeleteVertex) {
      if (Creator.currentPolygon === null) {
        throw new Error('Wystąpił błąd podczas usuwania wierzchołka!');
      }

      if (Creator.currentPolygon.vertices.length > 3) {
        const index = Creator.currentPolygon.vertices.findIndex(
          (elem) => elem === deleteVertexController.vertexToDelete,
        );
        const vertex = deleteVertexController.vertexToDelete;

        if (vertex === null || vertex.prevVertex === null || vertex.nextVertex === null) {
          throw new Error('Wystąpił błąd podczas usuwania wierzchołka!');
        }

        vertex.prevVertex.nextVertex = vertex.nextVertex;
        vertex.nextVertex.prevVertex = vertex.prevVertex;

        Creator.currentPolygon.vertices.splice(index, 1);
      }
    }
  },

  mouseupEventHandler: (event: MouseEvent) => {
    deleteVertexController.canDeleteVertex = false;
    deleteVertexController.vertexToDelete = null;

    Creator.prevPoint = Creator.currPoint = null;
    refreshCanvas();
  },
};

let moveEdgeController = {
  edition: Edition.MoveEdge,

  edgeFounded: false,
  canMoveEdge: false,
  edgeToMove: [] as Vertex[],

  mousemoveEventHandler: (event: MouseEvent) => {
    refreshCanvas();
    Creator.currPoint = getPoint(event);
    moveEdgeController.edgeFounded = false;

    if (moveEdgeController.edgeToMove.length === 2 && !moveEdgeController.canMoveEdge) {
      moveEdgeController.edgeToMove[0].color = Color.Blue;
      moveEdgeController.edgeToMove[0].edgeColor = Color.Black;
      moveEdgeController.edgeToMove[1].color = Color.Blue;
    }

    if (Creator.currentPolygon === null) {
      throw new Error('Wystąpił błąd podczas przesuwania krawędzi!');
    }

    for (const vertex of Creator.currentPolygon.vertices) {
      if (moveEdgeController.canMoveEdge) break;
      if (vertex.nextVertex === null) {
        throw new Error('Wystąpił błąd podczas przesuwania krawędzi!');
      }

      if (areInLine(vertex.position, vertex.nextVertex.position, Creator.currPoint)) {
        vertex.color = Color.Red;
        vertex.edgeColor = Color.Red;
        vertex.nextVertex.color = Color.Red;

        moveEdgeController.edgeToMove = [vertex, vertex.nextVertex];

        moveEdgeController.edgeFounded = true;
      }
    }

    if (moveEdgeController.canMoveEdge) {
      moveEdgeController.edgeToMove.forEach((vertex) => {
        if (Creator.currPoint === null || Creator.prevPoint === null) {
          throw new Error('Wystąpił błąd podczas przesuwania krawędzi!');
        }
        vertex.position.x += Creator.currPoint.x - Creator.prevPoint.x;
        vertex.position.y += Creator.currPoint.y - Creator.prevPoint.y;
      });

      Creator.prevPoint = Creator.currPoint;
      refreshCanvas();
    }
  },

  mousedownEventHandler: (event: MouseEvent) => {
    if (moveEdgeController.edgeToMove.length === 2) {
      moveEdgeController.edgeToMove[0].color = Color.Red;
      moveEdgeController.edgeToMove[0].edgeColor = Color.Red;
      moveEdgeController.edgeToMove[1].color = Color.Red;

      moveEdgeController.canMoveEdge = true;

      Creator.prevPoint = getPoint(event);

      refreshCanvas();
    }
  },

  mouseupEventHandler: (event: MouseEvent) => {
    moveEdgeController.canMoveEdge = false;
    moveEdgeController.edgeFounded = false;

    if (moveEdgeController.edgeToMove.length === 2) {
      moveEdgeController.edgeToMove[0].color = Color.Blue;
      moveEdgeController.edgeToMove[0].edgeColor = Color.Black;
      moveEdgeController.edgeToMove[1].color = Color.Blue;
    }

    moveEdgeController.edgeToMove = [];

    Creator.prevPoint = Creator.currPoint = null;

    refreshCanvas();
  },
};

let currentController: IController | null = null;

movePolygonBtn.addEventListener('click', (event: MouseEvent) => {
  switchOn.call(movePolygonController);
});
moveVertexBtn.addEventListener('click', (event: MouseEvent) => {
  switchOn.call(moveVertexController);
});
addVertexBtn.addEventListener('click', (event: MouseEvent) => {
  switchOn.call(addVertexController);
});
deleteVertexBtn.addEventListener('click', (event: MouseEvent) => {
  switchOn.call(deleteVertexController);
});
moveEdgeBtn.addEventListener('click', (event: MouseEvent) => {
  switchOn.call(moveEdgeController);
});

getElementById('layer').addEventListener('click', (event: MouseEvent) => {
  switchOff.call(currentController as IController);

  Creator.prevPoint = Creator.currPoint = null;
});

function switchOn(this: IController) {
  if (Creator.currentPolygon === null) return;
  console.log(Creator.currentPolygon);

  if (currentController !== null) switchOff.call(currentController);
  currentController = this;

  Creator.canvas.addEventListener('mousedown', this.mousedownEventHandler);
  Creator.canvas.addEventListener('mousemove', this.mousemoveEventHandler);
  Creator.canvas.addEventListener('mouseup', this.mouseupEventHandler);
}

function switchOff(this: IController) {
  if (!this) return;
  Creator.canvas.removeEventListener('mousedown', this.mousedownEventHandler);
  Creator.canvas.removeEventListener('mousemove', this.mousemoveEventHandler);
  Creator.canvas.removeEventListener('mouseup', this.mouseupEventHandler);
}
