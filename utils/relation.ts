import app from '../app';

import Vertex from '../model/Vertex';

import { Relation } from '../constants/Relation';

import calcDistance from '../helpers/calcDistance';

export function addRelation(v1: Vertex, v2: Vertex) {
  if (app.currentPolygon === null) {
    throw new Error('Wystąpił błąd podczas dodawania relacji!');
  }

  v1.correspondingVertex = v2;
  v2.correspondingVertex = v1;

  v1.relationId = app.relationIterator;
  v2.relationId = app.relationIterator;
  app.relationIterator++;

  correctRelations(app.currentPolygon.vertices.findIndex((el) => el === v1));
}

export function correctRelations(id: number) {
  if (app.currentPolygon === null) {
    throw new Error('Wystąpił błąd podczas poprawiania relacji!');
  }

  let v = app.currentPolygon.vertices[id % app.currentPolygon.vertices.length];
  let vertex = v;

  do {
    if (vertex.correspondingVertex === v) {
      vertex = vertex.nextVertex as Vertex;
      continue;
    }

    if (vertex.relation === Relation.Equal) {
      const correspondingVertex = vertex.correspondingVertex as Vertex;

      if (
        vertex.nextVertex === null ||
        correspondingVertex.nextVertex === null
      ) {
        throw new Error('Wystąpił błąd podczas poprawiania relacji!');
      }

      const distance1 = calcDistance(
        vertex.position,
        vertex.nextVertex.position,
      );
      const distance2 = calcDistance(
        correspondingVertex.position,
        correspondingVertex.nextVertex.position,
      );
      const a = distance1 / distance2;

      correspondingVertex.position.x = Math.floor(
        correspondingVertex.nextVertex.position.x +
          (correspondingVertex.position.x -
            correspondingVertex.nextVertex.position.x) *
            a,
      );
      correspondingVertex.position.y = Math.floor(
        correspondingVertex.nextVertex.position.y +
          (correspondingVertex.position.y -
            correspondingVertex.nextVertex.position.y) *
            a,
      );
    } else if (vertex.relation === Relation.Parallel) {
      const correspondingVertex = vertex.correspondingVertex as Vertex;

      if (
        vertex.nextVertex === null ||
        correspondingVertex.nextVertex === null
      ) {
        throw new Error('Wystąpił błąd podczas poprawiania relacji!');
      }

      if (
        Math.abs(vertex.position.y - vertex.nextVertex.position.y) <
        Math.abs(vertex.position.x - vertex.nextVertex.position.x)
      ) {
        let t =
          (vertex.position.y - vertex.nextVertex.position.y) /
          (vertex.position.x - vertex.nextVertex.position.x);
        if (Math.abs(t) < 0.01) t = 0.01;

        correspondingVertex.position.y = Math.floor(
          correspondingVertex.nextVertex.position.y -
            t *
              (correspondingVertex.nextVertex.position.x -
                correspondingVertex.position.x),
        );
      } else {
        let t =
          (vertex.position.x - vertex.nextVertex.position.x) /
          (vertex.position.y - vertex.nextVertex.position.y);
        if (Math.abs(t) < 0.01) t = 0.01;

        correspondingVertex.position.x = Math.floor(
          correspondingVertex.nextVertex.position.x -
            t *
              (correspondingVertex.nextVertex.position.y -
                correspondingVertex.position.y),
        );
      }
    }

    vertex = vertex.nextVertex as Vertex;
  } while (vertex.nextVertex !== v);
}
