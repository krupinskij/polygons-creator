import { Mode } from './constants/Mode';
import { ErrorCode } from './constants/ErrorCode';
import { getContext, getElementById } from './helpers/getElement';
import { throwError } from './helpers/throwError';
import Polygon from './model/Polygon';
import Point from '../model/Point';
import { getPoint } from './helpers/getPoint';
import { calcDistance } from './helpers/calcDistance';
import { Color } from './constants/Color';
import Vertex from './model/Vertex';
import { drawLine, drawPoint } from './utils/drawing';
import refreshCanvas from './helpers/refreshCanvas';

export default class Creator {
  public static canvas: HTMLCanvasElement = getElementById('canvas');
  public static context: CanvasRenderingContext2D = getContext(Creator.canvas);

  public static hCanvas: HTMLCanvasElement = getElementById('hidden-canvas');
  public static hContext: CanvasRenderingContext2D = getContext(Creator.hCanvas);

  private static addButton: HTMLButtonElement;
  private static stopButton: HTMLButtonElement;

  private static mode = Mode.Default;

  private static polygonsIterator = 0;
  private static currentPolygon: Polygon | null = null;
  public static polygons: Polygon[] = [];

  private static prevPoint: Point | null = null;
  private static currPoint: Point | null = null;

  public static thickness = 1;

  static init() {
    Creator.addButton = getElementById('add-button');
    Creator.addButton.addEventListener('click', Creator.startAdding);

    Creator.stopButton = getElementById('stop-button');
    Creator.stopButton.addEventListener('click', Creator.endAdding);

    Creator.resizeCanvas();
    window.addEventListener('resize', Creator.resizeCanvas);
  }

  private static resizeCanvas() {
    const container: HTMLDivElement = getElementById('canvas-container');

    Creator.canvas.height = container.clientHeight;
    Creator.canvas.width = container.clientWidth;

    Creator.hCanvas.height = Creator.canvas.height * 2;
    Creator.hCanvas.width = Creator.canvas.width * 2;
  }

  private static startAdding() {
    Creator.mode = Mode.Adding;
    Creator.polygonsIterator++;
    Creator.currentPolygon = new Polygon(Creator.polygonsIterator);
    Creator.polygons = [...Creator.polygons, Creator.currentPolygon];

    Creator.canvas.addEventListener('click', Creator.addVertex);
    Creator.canvas.addEventListener('mousemove', Creator.moveCursor);
  }

  private static endAdding(): void {
    if (!Creator.currentPolygon) throwError(ErrorCode.AddPolygonError);

    const length = Creator.currentPolygon.vertices.length;

    Creator.currentPolygon.vertices[length - 1].edgeColor = Color.Black;
    Creator.currentPolygon.vertices[length - 1].nextVertex = Creator.currentPolygon.vertices[0];
    Creator.currentPolygon.vertices[0].prevVertex = Creator.currentPolygon.vertices[length - 1];

    Creator.canvas.removeEventListener('click', Creator.addVertex);
    Creator.canvas.removeEventListener('mousemove', Creator.moveCursor);

    Creator.mode = Mode.Default;
    Creator.currentPolygon = null;
    Creator.prevPoint = Creator.currPoint = null;

    refreshCanvas();
  }

  private static addVertex(event: MouseEvent): void {
    if (!Creator.currentPolygon) throwError(ErrorCode.AddPolygonError);

    Creator.prevPoint = getPoint(event);

    const length = Creator.currentPolygon.vertices.length;

    if (
      length > 2 &&
      calcDistance(Creator.prevPoint, Creator.currentPolygon.vertices[0].position) <= 10
    ) {
      Creator.endAdding();
      return;
    }

    if (length > 0) {
      Creator.currentPolygon.vertices[length - 1].edgeColor = Color.Black;
    }

    Creator.currentPolygon.vertices.push(new Vertex(Creator.prevPoint));

    if (length > 1) {
      Creator.currentPolygon.vertices[length - 2].nextVertex =
        Creator.currentPolygon.vertices[length - 1];
      Creator.currentPolygon.vertices[length - 1].prevVertex =
        Creator.currentPolygon.vertices[length - 2];
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
    if (length)
      drawLine(Creator.currentPolygon.vertices[0].position, Creator.currPoint, Color.Blue);

    if (
      length > 2 &&
      calcDistance(Creator.currPoint, Creator.currentPolygon.vertices[0].position) <= 15
    ) {
      drawPoint(Creator.currentPolygon.vertices[0].position, 15, Color.Blue);
    }
  }
}
