import app from '../app';

import Polygon from '../model/Polygon';
import Vertex from '../model/Vertex';

import { Relation } from '../constants/Relation';
import { Color } from '../constants/Color';

import refreshCanvas from '../helpers/refreshCanvas';

const fileInput: HTMLInputElement = document.getElementById(
  'file-load',
) as HTMLInputElement;
const loadBtn: HTMLButtonElement = document.getElementById(
  'load-json',
) as HTMLButtonElement;

const saveInput: HTMLInputElement = document.getElementById(
  'save-name',
) as HTMLInputElement;
const saveBtn: HTMLButtonElement = document.getElementById(
  'save-json',
) as HTMLButtonElement;

interface IPoint {
  x: number;
  y: number;
}

interface IRelation {
  e1: number;
  e2: number;
  type: number;
}

interface IPolygon {
  points: IPoint[];
  relations: IRelation[];
}

saveBtn.addEventListener('click', () => {
  const polygons = app.polygons.map((polygon) => {
    const jPolygon = {
      points: [] as IPoint[],
      relations: [] as IRelation[],
    };

    const set = new Set();

    polygon.vertices.forEach((vertex) => {
      jPolygon.points.push({ x: vertex.position.x, y: vertex.position.y });

      if (vertex.relation != Relation.None) {
        if (!set.has(vertex.relationId)) {
          set.add(vertex.relationId);

          jPolygon.relations.push({
            e1: polygon.vertices.findIndex((el) => el === vertex),
            e2: polygon.vertices.findIndex(
              (el) => el === vertex.correspondingVertex,
            ),
            type: vertex.relation === Relation.Equal ? 0 : 1,
          });
        }
      }
    });

    return jPolygon;
  });

  const polygonJSON = JSON.stringify(polygons);

  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(
    new Blob([polygonJSON], { type: 'octet/stream' }),
  );
  a.download =
    (saveInput.value.length > 0 ? saveInput.value : 'polygons') + '.json';
  a.click();

  saveInput.value = '';
});

loadBtn.addEventListener('click', () => {
  app.clear();

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    loadPolygonsFromJSON(reader.result as string);
  });

  if (fileInput.files !== null && fileInput.files[0])
    reader.readAsText(fileInput.files[0]);
});

function loadPolygonsFromJSON(data: string) {
  const Jpolygons = JSON.parse(data) as IPolygon[];

  Jpolygons.forEach((Jpolygon: IPolygon) => {
    const polygonBtn = document.createElement('button');
    polygonBtn.innerText = 'Edytuj wielokąt #1';
    polygonBtn.className = 'polygons-btn_polygon btn';
    app.polygonsDiv.appendChild(polygonBtn);

    const polygon = new Polygon(polygonBtn);

    Jpolygon.points.forEach((point) => {
      polygon.vertices.push(new Vertex(point));
    });

    for (let i = 1; i < polygon.vertices.length; i++) {
      polygon.vertices[i - 1].nextVertex = polygon.vertices[i];
      polygon.vertices[i].prevVertex = polygon.vertices[i - 1];
      polygon.vertices[i].edgeColor = Color.Black;
    }

    polygon.vertices[polygon.vertices.length - 1].nextVertex =
      polygon.vertices[0];
    polygon.vertices[0].prevVertex =
      polygon.vertices[polygon.vertices.length - 1];
    polygon.vertices[0].edgeColor = Color.Black;

    Jpolygon.relations.forEach((relation) => {
      polygon.vertices[relation.e1].relationId = app.relationIterator;
      polygon.vertices[relation.e2].relationId = app.relationIterator;

      polygon.vertices[relation.e1].correspondingVertex =
        polygon.vertices[relation.e2];
      polygon.vertices[relation.e2].correspondingVertex =
        polygon.vertices[relation.e1];

      polygon.vertices[relation.e1].relation =
        relation.type == 0 ? Relation.Equal : Relation.Parallel;
      polygon.vertices[relation.e2].relation =
        relation.type == 0 ? Relation.Equal : Relation.Parallel;

      app.relationIterator++;
    });

    app.polygons.push(polygon);
    app.polygonsInterator++;
  });

  refreshCanvas();
}
