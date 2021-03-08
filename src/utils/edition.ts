import Creator from '../creator';

import { getElementById } from '../helpers/getElement';

import movePolygonController from '../controllers/MovePolygonController';
import moveVertexController from '../controllers/MoveVertexController';
import addVertexController from '../controllers/AddVertexController';
import deleteVertexController from '../controllers/RemoveVertexController';
import moveEdgeController from '../controllers/MoveEdgeController';
import EditionController from '../controllers/EditionController';

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
