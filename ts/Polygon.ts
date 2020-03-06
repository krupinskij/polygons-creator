import { Vertex } from './Vertex';
import { Modification } from './Modification';
import { Color } from './Color';

export class Polygon {
    public vertices: Array<Vertex>;
    private button: HTMLButtonElement;
    public lastModification: Modification;

    constructor(button: HTMLButtonElement) {
        this.vertices = [];
        this.button = button;
        this.lastModification = Modification.none;

        this.button.addEventListener('mouseover', () => { this.changeColor(Color.Red) });
        this.button.addEventListener('mouseleave', () => { this.changeColor(Color.Black) });

        this.button.addEventListener('click', () => {
            // TO DO set current polygon
        })
    }

    private changeColor(color: Color): void {
        this.vertices.forEach(vertex => {
            vertex.color = color;
            vertex.edgeColor = color;
        });
        // TO DO refreshCanvas();
    }
}