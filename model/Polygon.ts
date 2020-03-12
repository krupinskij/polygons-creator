import app from '../app.js';

import Vertex from './Vertex.js';

import { Color } from '../constants/Color.js';

import refreshCanvas from '../helpers/refreshCanvas.js';

export default class Polygon {
    public vertices: Array<Vertex>;
    public button: HTMLButtonElement;

    constructor(button: HTMLButtonElement) {
        this.vertices = [];
        this.button = button;

        this.button.addEventListener('mouseover', () => { this.changeColor(Color.Red) });
        this.button.addEventListener('mouseleave', () => { this.changeColor(Color.Black) });

        this.button.addEventListener('click', () => {
            app.currentPolygon = this;

            document.getElementById("button-polygon-cancel")?.removeAttribute("disabled");

            app.addButton.setAttribute("disabled", "disabled");
            app.clearButton.setAttribute("disabled", "disabled");

            document.getElementById("button-polygon-movePolygon")?.removeAttribute("disabled");
            document.getElementById("button-polygon-moveVertex")?.removeAttribute("disabled");
            document.getElementById("button-polygon-addVertex")?.removeAttribute("disabled");
            document.getElementById("button-polygon-deleteVertex")?.removeAttribute("disabled");
            document.getElementById("button-polygon-moveEdge")?.removeAttribute("disabled");
            document.getElementById("button-polygon-addRelation")?.removeAttribute("disabled");
            document.getElementById("button-polygon-deleteRelation")?.removeAttribute("disabled");
        })
    }

    private changeColor(color: Color): void {
        this.vertices.forEach(vertex => {
            vertex.color = color;
            vertex.edgeColor = color;
        });

        refreshCanvas();
    }
}