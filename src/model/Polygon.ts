import Vertex from './Vertex';

export default class Polygon {
  public vertices: Vertex[];

  constructor(public id: number) {
    this.vertices = [];
  }
}
