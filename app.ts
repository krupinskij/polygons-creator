

import Vertex from './model/Vertex';
import Point from './model/Point';
import Polygon from './model/Polygon';

import { Mode } from './constants/Mode';
import { Color } from './constants/Color';

import getPoint from './helpers/getPoint';
import refreshCanvas from './helpers/refreshCanvas';
import calcDistance from './helpers/calcDistance';

import { drawPoint, drawLine } from './utils/drawing';
import './utils/edition';
import './utils/convertJSON';
import './utils/thickness';

import "./style.css";


export default class app {

    public static polygons: Array<Polygon> = [];
    public static currentPolygon: Polygon | null = null;
    public static polygonsInterator: number = 0;

    public static mode: Mode = Mode.Default;

    public static prevPoint: Point | null = null;
    public static currPoint: Point | null = null;

    public static relationIterator: number = 0;

    public static thickness: number = 1;

    public static canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    public static context: CanvasRenderingContext2D = app.canvas.getContext("2d") as CanvasRenderingContext2D;

    public static hCanvas: HTMLCanvasElement = document.getElementById("hidden-canvas") as HTMLCanvasElement;
    public static hContext: CanvasRenderingContext2D = app.hCanvas.getContext("2d") as CanvasRenderingContext2D;


    public static addButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-add");
    public static clearButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-clear");

    public static polygonsDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("div-polygons")


    public static init(): void {

        app.addButton.addEventListener("click", () => {
            switch (app.mode) {
                case Mode.Default:
                    app.startAdding();
                    break;
                case Mode.AddingPolygon:
                    app.endAdding();
                    break;
                default:
                    throw new Error("Wystąpił błąd podczas dodawania wielokąta");

            }
        })

        app.clearButton.addEventListener("click", app.clear);
    }

    private static startAdding(): void {
        app.addButton.innerText = "Gotowe";

        app.polygonsInterator++;

        const polygonBtn = document.createElement("button");
        polygonBtn.innerText = "Edytuj wielokąt #" + app.polygonsInterator;
        polygonBtn.className = "polygons-btn_polygon btn";

        app.currentPolygon = new Polygon(polygonBtn);
        app.polygons.push(app.currentPolygon);

        app.canvas.addEventListener("click", app.addVertex);
        app.canvas.addEventListener("mousemove", app.moveCursor);

        app.mode = Mode.AddingPolygon;

        app.addButton.setAttribute("disabled", "disabled");
        app.clearButton.setAttribute("disabled", "disabled");
    }

    private static endAdding(): void {

        if (app.currentPolygon === null) throw new Error("Wystąpił błąd podczas dodawania wielokąta!")

        app.addButton.innerText = "Dodaj wielokąt";

        app.currentPolygon.vertices[app.currentPolygon.vertices.length - 1].edgeColor = Color.Black;
        app.currentPolygon.vertices[app.currentPolygon.vertices.length - 1].nextVertex = app.currentPolygon.vertices[0];
        app.currentPolygon.vertices[0].prevVertex = app.currentPolygon.vertices[app.currentPolygon.vertices.length - 1];

        app.polygonsDiv.appendChild(app.currentPolygon.button);

        app.canvas.removeEventListener("click", app.addVertex);
        app.canvas.removeEventListener("mousemove", app.moveCursor);

        app.mode = Mode.Default;
        app.currentPolygon = null;
        app.prevPoint = app.currPoint = null;

        app.clearButton.removeAttribute("disabled");

        refreshCanvas();
    }

    private static addVertex(event: MouseEvent): void {

        if (app.currentPolygon === null) throw new Error("Wystąpił błąd podczas dodawania wielokąta!")

        app.prevPoint = getPoint(event);

        if (app.currentPolygon.vertices.length > 2 && calcDistance(app.prevPoint, app.currentPolygon.vertices[0].position) <= 10) {
            app.endAdding();
            return;
          }

        if (app.currentPolygon.vertices.length > 0) {
            app.currentPolygon.vertices[app.currentPolygon.vertices.length - 1].edgeColor = Color.Black;
        }

        app.currentPolygon.vertices.push(new Vertex(app.prevPoint));

        if (app.currentPolygon.vertices.length > 1) {
            app.currentPolygon.vertices[app.currentPolygon.vertices.length - 2].nextVertex = app.currentPolygon.vertices[app.currentPolygon.vertices.length - 1];
            app.currentPolygon.vertices[app.currentPolygon.vertices.length - 1].prevVertex = app.currentPolygon.vertices[app.currentPolygon.vertices.length - 2];
        }

        if (app.currentPolygon.vertices.length > 2) {
            app.addButton.removeAttribute("disabled");
        }

        refreshCanvas();
    }

    private static moveCursor(event: MouseEvent): void {

        if (app.currentPolygon === null) throw new Error("Wystąpił błąd podczas dodawania wielokąta!")

        app.currPoint = getPoint(event);

        refreshCanvas();
        drawPoint(app.currPoint, 5, Color.Red);

        if (app.prevPoint) drawLine(app.prevPoint, app.currPoint, Color.Red);

        if (app.currentPolygon.vertices.length) drawLine(app.currentPolygon.vertices[0].position, app.currPoint, Color.Red);

        if (app.currentPolygon.vertices.length > 2 && calcDistance(app.currPoint, app.currentPolygon.vertices[0].position) <= 15) {
            drawPoint(app.currentPolygon.vertices[0].position, 15, Color.Red);
        }
    }

    public static clear(): void {
        app.polygons = [];
        app.polygonsInterator = 0;
        app.currentPolygon = null;

        app.relationIterator = 0;
      
        app.prevPoint = null;
        app.currPoint = null;
      
        app.polygonsDiv.innerHTML = "";
      
        refreshCanvas();
      }
}

app.init();