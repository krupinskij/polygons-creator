
import Point from './model/Point.js';
import Vertex from './model/Vertex.js';
import Polygon from './model/Polygon.js';

import { Mode } from './enum/Mode.js';
import { Color } from './enum/Color.js';

import getPoint from './helpers/getPoint.js';
import refreshCanvas from './helpers/refreshCanvas.js';
import calcDistance from './helpers/calcDistance.js';

import { drawPoint, drawLine } from './utils/drawing.js';


export default class app {

    public static polygons: Array<Polygon> = [];
    public static currentPolygon: Polygon | null = null;
    private static polygonsInterator: number = 0;

    public static mode: Mode = Mode.Default;

    public static prevPoint: Point | null = null;
    public static currPoint: Point | null = null;

    public static canvas: any = document.getElementById("canvas");
    public static context: CanvasRenderingContext2D = app.canvas.getContext("2d");


    private static addButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-add");
    private static clearButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-clear");

    private static polygonsDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("div-polygons")


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
    }

    private static startAdding(): void {
        app.addButton.innerText = "Gotowe";

        app.polygonsInterator++;

        const polygonBtn = document.createElement("button");
        polygonBtn.innerText = "Edytuj wielokąt #" + app.polygonsInterator;
        polygonBtn.className = "polygons-btn_polygon btn";

        app.currentPolygon = new Polygon(polygonBtn);
        app.polygons.push(app.currentPolygon);

        app.canvas.addEventListener("click", app.addVertex); // dodawanie wierzchołków po kliknięciu
        app.canvas.addEventListener("mousemove", app.moveCursor); // poruszanie się kursorem

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

        app.prevPoint = getPoint(event, app.canvas);

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

        app.currPoint = getPoint(event, app.canvas);

        refreshCanvas();
        drawPoint(app.currPoint, 5, Color.Red);

        if (app.prevPoint) drawLine(app.prevPoint, app.currPoint, Color.Red);

        if (app.currentPolygon.vertices.length) drawLine(app.currentPolygon.vertices[0].position, app.currPoint, Color.Red);

        if (app.currentPolygon.vertices.length > 2 && calcDistance(app.currPoint, app.currentPolygon.vertices[0].position) <= 15) {
            drawPoint(app.currentPolygon.vertices[0].position, 15, Color.Red);
        }
    }
}

app.init();