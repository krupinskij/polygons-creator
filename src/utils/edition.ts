import Creator from '../creator';

import { getElementById } from '../helpers/getElement';

import deleteVertexController from '../controllers/edition/RemoveVertexController';
import movePolygonController from '../controllers/edition/MovePolygonController';
import moveVertexController from '../controllers/edition/MoveVertexController';
import addVertexController from '../controllers/edition/AddVertexController';
import moveEdgeController from '../controllers/edition/MoveEdgeController';
import EditionController from '../controllers/edition/EditionController';

const movePolygonBtn: HTMLButtonElement = getElementById('button-polygon-movePolygon');
const moveVertexBtn: HTMLButtonElement = getElementById('button-polygon-moveVertex');
const addVertexBtn: HTMLButtonElement = getElementById('button-polygon-addVertex');
const deleteVertexBtn: HTMLButtonElement = getElementById('button-polygon-deleteVertex');
const moveEdgeBtn: HTMLButtonElement = getElementById('button-polygon-moveEdge');

let currentController: EditionController;

movePolygonBtn.addEventListener('click', (event: MouseEvent) => {
  switchOn.call(movePolygonController);
});
moveVertexBtn.addEventListener('click', (event: MouseEvent) => {
  switchOn.call(moveVertexController);
});
addVertexBtn.addEventListener('click', (event: MouseEvent) => {
  switchOn.call(addVertexController);
});
deleteVertexBtn.addEventListener('click', (event: MouseEvent) => {
  switchOn.call(deleteVertexController);
});
moveEdgeBtn.addEventListener('click', (event: MouseEvent) => {
  switchOn.call(moveEdgeController);
});

getElementById('layer').addEventListener('click', (event: MouseEvent) => {
  switchOff.call(currentController);

  Creator.prevPoint = Creator.currPoint = null;
});

function switchOn(this: EditionController) {
  if (!Creator.currentPolygon) return;

  if (!currentController) switchOff.call(currentController);
  currentController = this;

  Creator.canvas.addEventListener('mousedown', this.mousedownEventHandler);
  Creator.canvas.addEventListener('mousemove', this.mousemoveEventHandler);
  Creator.canvas.addEventListener('mouseup', this.mouseupEventHandler);
}

function switchOff(this: EditionController) {
  if (!this) return;

  Creator.canvas.removeEventListener('mousedown', this.mousedownEventHandler);
  Creator.canvas.removeEventListener('mousemove', this.mousemoveEventHandler);
  Creator.canvas.removeEventListener('mouseup', this.mouseupEventHandler);
}
