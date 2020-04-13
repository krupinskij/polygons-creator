import Point from './Point';

import { Color } from '../constants/Color';
import { Relation } from '../constants/Relation';

export default class Vertex {

    public position: Point;
    public radius: number;

    public color: Color;
    public edgeColor: Color;

    public prevVertex: Vertex | null;
    public nextVertex: Vertex | null;

    public relation: Relation;
    public relationId: number | null;
    public correspondingVertex: Vertex | null;

    constructor(position: Point) {
        this.position = position;
        this.radius = 5;

        this.color = Color.Black;
        this.edgeColor = Color.Black;

        this.prevVertex = null;
        this.nextVertex = null;

        this.relation = Relation.None;
        this.relationId = null;
        this.correspondingVertex = null;
    }
}