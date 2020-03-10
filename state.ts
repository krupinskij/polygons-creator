
import Point from './model/Point.js';
import Vertex from './model/Vertex.js';
import Polygon from './model/Polygon.js';

import { Mode } from './enum/Mode.js';

import { getPoint } from './functions/getPoint.js';

class state {

    public static polygons: Array<Polygon> = [];
    public static currentPolygon: Polygon | null = null;

    public static mode: Mode = Mode.Default;

    public static prevPoint: Point | null = null;
    public static currPoint: Point | null = null;

    public static canvas: any = document.getElementById("canvas");
    public static context: CanvasRenderingContext2D = state.canvas.getContext("2d");

    public static points: Array<Point> = [];

    public static setPoint(): void {
        state.canvas.addEventListener('click', (event: MouseEvent) => {
            console.log(getPoint(event, state.canvas));
        })
    }
}

state.setPoint();