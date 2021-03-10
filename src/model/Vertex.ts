import Point from './Point';

import { Color } from '../constants/Color';

export default class Vertex {
  public radius: number;

  public prevVertex: Vertex | null;
  public nextVertex: Vertex | null;

  public color: Color;
  public edgeColor: Color;

  constructor(public position: Point) {
    this.radius = 10;

    this.prevVertex = null;
    this.nextVertex = null;

    this.color = Color.Blue;
    this.edgeColor = Color.Black;
  }
}
