import { Color } from './Color';
import { Relation } from './Relation';

export class Vertex {

    public position: any;
    public radius: number;

    public color: Color;
    public edgeColor: Color;

    public nextVertex: Vertex;
    public prevVertex: Vertex;

    public relation: Relation;
    public correspondingVertex: Vertex

    constructor(position: any) {
        this.position = position;
        this.radius = 5;

        this.color = Color.Black;
        this.edgeColor = Color.Black;
    }
}