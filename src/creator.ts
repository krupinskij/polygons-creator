import { Mode } from './constants/Mode';
import { ErrorCode } from './constants/ErrorCode';
import { createNewTab, getContext, getElementById } from './helpers/getElement';
import { throwError } from './helpers/throwError';
import Polygon from './model/Polygon';
import Point from '../model/Point';
import { getPoint } from './helpers/getPoint';
import { calcDistance } from './helpers/calcDistance';
import { Color } from './constants/Color';
import Vertex from './model/Vertex';
import { drawLine, drawPoint } from './utils/drawing';
import { refreshCanvas } from './helpers/refreshCanvas';

import './utils/edition';

export default class Creator {
  public static canvas: HTMLCanvasElement = getElementById('canvas');
  public static context: CanvasRenderingContext2D = getContext(Creator.canvas);

  public static hCanvas: HTMLCanvasElement = getElementById('hidden-canvas');
  public static hContext: CanvasRenderingContext2D = getContext(Creator.hCanvas);

  private static mode = Mode.Default;

  private static polygonsIterator = 0;
  public static currentPolygon: Polygon | null = null;
  public static polygons: Polygon[] = [];

  public static prevPoint: Point | null = null;
  public static currPoint: Point | null = null;

  public static thickness = 1;

  static init() {
    Creator.resizeCanvas();
    window.addEventListener('resize', Creator.resizeCanvas);
  }

  private static resizeCanvas() {
    const container: HTMLDivElement = getElementById('canvas-container');

    Creator.canvas.height = container.clientHeight;
    Creator.canvas.width = container.clientWidth;

    Creator.hCanvas.height = Creator.canvas.height * 2;
    Creator.hCanvas.width = Creator.canvas.width * 2;

    refreshCanvas();
  }

  public static startAdding(): HTMLLIElement {
    Creator.mode = Mode.Adding;
    Creator.polygonsIterator++;
    Creator.currentPolygon = new Polygon(Creator.polygonsIterator);
    Creator.polygons = [...Creator.polygons, Creator.currentPolygon];

    const tabs: HTMLUListElement = getElementById('tabs');
    const tab = createNewTab(Creator.polygonsIterator);
    tab.addEventListener('click', () => {
      Creator.currentPolygon =
        Creator.polygons.find((polygon) => polygon.id === Creator.polygonsIterator) ||
        throwError(ErrorCode.CurrentPolygonError);
    });
    tabs.appendChild(tab);

    Creator.canvas.addEventListener('click', Creator.addVertex);
    Creator.canvas.addEventListener('mousemove', Creator.moveCursor);

    return tab as HTMLLIElement;
  }

  public static endAdding(): void {
    if (Creator.mode !== Mode.Adding) return;
    if (!Creator.currentPolygon) throwError(ErrorCode.AddPolygonError);

    const length = Creator.currentPolygon.vertices.length;

    Creator.currentPolygon.vertices[length - 1].edgeColor = Color.Black;
    Creator.currentPolygon.vertices[length - 1].nextVertex = Creator.currentPolygon.vertices[0];
    Creator.currentPolygon.vertices[0].prevVertex = Creator.currentPolygon.vertices[length - 1];

    Creator.canvas.removeEventListener('click', Creator.addVertex);
    Creator.canvas.removeEventListener('mousemove', Creator.moveCursor);

    Creator.mode = Mode.Default;
    Creator.prevPoint = Creator.currPoint = null;

    refreshCanvas();
  }

  private static addVertex(event: MouseEvent): void {
    if (!Creator.currentPolygon) throwError(ErrorCode.AddPolygonError);

    Creator.prevPoint = getPoint(event);

    let length = Creator.currentPolygon.vertices.length;

    if (length > 2 && calcDistance(Creator.prevPoint, Creator.currentPolygon.vertices[0].position) <= 10) {
      Creator.endAdding();
      return;
    }

    if (length > 0) {
      Creator.currentPolygon.vertices[length - 1].edgeColor = Color.Black;
    }

    Creator.currentPolygon.vertices.push(new Vertex(Creator.prevPoint));
    length++;

    if (length > 1) {
      Creator.currentPolygon.vertices[length - 2].nextVertex = Creator.currentPolygon.vertices[length - 1];
      Creator.currentPolygon.vertices[length - 1].prevVertex = Creator.currentPolygon.vertices[length - 2];
      Creator.currentPolygon.vertices[length - 1].nextVertex = Creator.currentPolygon.vertices[0];
      Creator.currentPolygon.vertices[0].prevVertex = Creator.currentPolygon.vertices[length - 1];
    }

    refreshCanvas();
  }

  private static moveCursor(event: MouseEvent): void {
    if (!Creator.currentPolygon) throwError(ErrorCode.AddPolygonError);

    Creator.currPoint = getPoint(event);

    refreshCanvas();

    drawPoint(Creator.currPoint, 5, Color.Blue);

    if (Creator.prevPoint) drawLine(Creator.prevPoint, Creator.currPoint, Color.Blue);

    const length = Creator.currentPolygon.vertices.length;
    if (length) {
      drawLine(Creator.currentPolygon.vertices[0].position, Creator.currPoint, Color.Blue);
    }

    if (length > 2 && calcDistance(Creator.currPoint, Creator.currentPolygon.vertices[0].position) <= 15) {
      drawPoint(Creator.currentPolygon.vertices[0].position, 15, Color.Blue);
    }
  }

  public static setCurrentPolygon(event: Event) {
    const elem = event.target as HTMLElement;
    const id = elem.id.substring(8);

    Creator.currentPolygon =
      Creator.polygons.find((polygon) => polygon.id === +id) || throwError(ErrorCode.CurrentPolygonError);

    refreshCanvas();
  }

  public static unsetCurrentPolygon() {
    Creator.currentPolygon = null;
    refreshCanvas();
  }

  public static setThickness(thickness: number) {
    Creator.thickness = thickness;
    refreshCanvas();
  }
}
