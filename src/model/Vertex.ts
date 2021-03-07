import Point from './Point';

export default class Vertex {
  public radius: number;

  public prevVertex: Vertex | null;
  public nextVertex: Vertex | null;

  constructor(public position: Point) {
    this.radius = 5;

    this.prevVertex = null;
    this.nextVertex = null;
  }
}
