import { Color } from '../constants/Color';
import Point from './Point';

export default class Vertex {
  public radius: number;

  public prevVertex: Vertex | null;
  public nextVertex: Vertex | null;

  public color: Color;
  public edgeColor: Color;

  constructor(public position: Point) {
    this.radius = 5;

    this.prevVertex = null;
    this.nextVertex = null;

    this.color = Color.Blue;
    this.edgeColor = Color.Black;
  }
}
