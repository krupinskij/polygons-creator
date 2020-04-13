import app from "../app";

import Vertex from "../model/Vertex";

import { Modification } from "../constants/Modification";
import { Color } from "../constants/Color";

import getPoint from '../helpers/getPoint';
import refreshCanvas from '../helpers/refreshCanvas';
import calcDistance from '../helpers/calcDistance';
import areInLine from '../helpers/areInLine';

import { addRelation, correctRelations } from './relation';

import { drawPoint } from '../utils/drawing';
import { Relation } from "../constants/Relation";

const movePolygonBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-polygon-movePolygon");
const moveVertexBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-polygon-moveVertex");
const addVertexBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-polygon-addVertex");
const deleteVertexBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-polygon-deleteVertex");
const moveEdgeBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-polygon-moveEdge");
const addRelationBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-polygon-addRelation");
const deleteRelationBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-polygon-deleteRelation");

const equalRelationBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-relation-equal");
const parallelRelationBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-relation-parallel");

const cancelButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-polygon-cancel");

interface IController {
	modification: Modification;

	mousedownEventHandler(event: MouseEvent): void;
	mousemoveEventHandler(event: MouseEvent): void;
	mouseupEventHandler(event: MouseEvent): void;
}

const movePolygonController = {
	modification: Modification.MovePolygon,
	canMovePolygon: false,

	mousedownEventHandler: (event: MouseEvent) => {
		movePolygonController.canMovePolygon = true;
		app.prevPoint = getPoint(event);
	},

	mousemoveEventHandler: (event: MouseEvent) => {
		app.currPoint = getPoint(event);

		if (app.currentPolygon === null) {
			throw new Error("Wystąpił błąd podczas przesuwania wielokąta!");
		}

		if (movePolygonController.canMovePolygon) {

			app.currentPolygon.vertices.forEach(vertex => {

				if (app.currPoint === null || app.prevPoint === null) {
					throw new Error("Wystąpił błąd podczas przesuwania wielokąta!");
				}

				vertex.position.x += app.currPoint.x - app.prevPoint.x;
				vertex.position.y += app.currPoint.y - app.prevPoint.y;
			});
			app.prevPoint = app.currPoint;
			refreshCanvas();
		}
	},

	mouseupEventHandler: (event: MouseEvent) => {
		movePolygonController.canMovePolygon = false;
		app.prevPoint = app.currPoint = null;
	}
}

let moveVertexController = {

	modification: Modification.MoveVertex,

	vertexFounded: false,
	canMoveVertex: false,

	vertexToMove: null as Vertex | null,
	indexToMove: null as number | null,

	mousedownEventHandler: (event: MouseEvent) => {
		if (moveVertexController.vertexFounded) {
			if (moveVertexController.vertexToMove === null) {
				throw new Error("Wystąpił błąd podczas przesuwania wierzchołka!");
			}
			moveVertexController.vertexToMove.color = Color.Red;
			moveVertexController.canMoveVertex = true;

			app.prevPoint = getPoint(event);
			refreshCanvas();
		}
	},

	mousemoveEventHandler: (event: MouseEvent) => {
		refreshCanvas();
		app.currPoint = getPoint(event);
		moveVertexController.vertexFounded = false;

		if (moveVertexController.vertexToMove && !moveVertexController.canMoveVertex) {
			moveVertexController.vertexToMove.color = Color.Black;
		}

		if (app.currentPolygon === null) {
			throw new Event("Wystąpił błąd podczas przesuwania wierzchołka!");
		}

		for (const vertex of app.currentPolygon.vertices) {

			if (moveVertexController.canMoveVertex) break;

			if (calcDistance(app.currPoint, vertex.position) < 10) {
				vertex.color = Color.Red;

				moveVertexController.vertexToMove = vertex;
				moveVertexController.indexToMove = app.currentPolygon.vertices.findIndex(el => el === vertex);
				moveVertexController.vertexFounded = true;
			}
		}

		if (moveVertexController.canMoveVertex) {
			if (moveVertexController.vertexToMove === null || app.currPoint === null || app.prevPoint === null) {
				throw new Error("Wystąpił błąd podczas przesuwania wierzchołka!");
			}
			moveVertexController.vertexToMove.position.x += app.currPoint.x - app.prevPoint.x;
			moveVertexController.vertexToMove.position.y += app.currPoint.y - app.prevPoint.y;
			app.prevPoint = app.currPoint;

			refreshCanvas();
		}

		correctRelations(moveVertexController.indexToMove as number);
	},

	mouseupEventHandler: (event: MouseEvent) => {
		moveVertexController.canMoveVertex = false;
		moveVertexController.vertexFounded = false;
		if (moveVertexController.vertexToMove) moveVertexController.vertexToMove.color = Color.Black;
		moveVertexController.vertexToMove = null;
		moveVertexController.indexToMove = null;
		app.prevPoint = app.currPoint = null;
	}
}

let addVertexController = {

	modification: Modification.AddVertex,

	canAddVertex: false,
	vertexToAdd: null as Vertex | null,

	mousemoveEventHandler: (event: MouseEvent) => {

		app.currPoint = getPoint(event);
		addVertexController.canAddVertex = false;

		if (addVertexController.vertexToAdd && !addVertexController.canAddVertex) {
			if (addVertexController.vertexToAdd.nextVertex === null) {
				throw new Error("Wystąpił błąd podczas dodawania wierzchołka!");
			}
			addVertexController.vertexToAdd.color = Color.Black;
			addVertexController.vertexToAdd.edgeColor = Color.Black;
			addVertexController.vertexToAdd.nextVertex.color = Color.Black;
		}

		if (app.currentPolygon === null) {
			throw new Error("Wystąpił błąd podczas dodawania wierzchołka!");
		}

		for (const vertex of app.currentPolygon.vertices) {

			if (vertex.nextVertex === null) {
				throw new Error("Wystąpił błąd podczas dodawania wierzchołka!");
			}

			if (areInLine(vertex.position, vertex.nextVertex.position, app.currPoint)) {
				vertex.color = Color.Red;
				vertex.edgeColor = Color.Red;
				vertex.nextVertex.color = Color.Red;

				addVertexController.canAddVertex = true;
				addVertexController.vertexToAdd = vertex;

			}
		}

		refreshCanvas();

	},

	mousedownEventHandler: (event: MouseEvent) => {
		const currPoint = getPoint(event);

		if (addVertexController.canAddVertex) {

			if (app.currentPolygon === null || addVertexController.vertexToAdd === null) {
				throw new Error("Wystąpił błąd podczas dodawania wierzchołka!");
			}

			const index = app.currentPolygon.vertices.findIndex(elem => elem === addVertexController.vertexToAdd);
			app.currentPolygon.vertices.splice(index + 1, 0, new Vertex(currPoint));

			app.currentPolygon.vertices[index + 1].nextVertex = addVertexController.vertexToAdd.nextVertex;
			addVertexController.vertexToAdd.nextVertex = app.currentPolygon.vertices[index + 1];

			app.currentPolygon.vertices[index + 1].prevVertex = addVertexController.vertexToAdd;
			(app.currentPolygon.vertices[index + 1].nextVertex as Vertex).prevVertex = app.currentPolygon.vertices[index + 1];

			if (addVertexController.vertexToAdd.correspondingVertex !== null) {
				addVertexController.vertexToAdd.correspondingVertex.relation = Relation.None;
				addVertexController.vertexToAdd.correspondingVertex.correspondingVertex = null;
				addVertexController.vertexToAdd.correspondingVertex.relationId = null;
			}

			addVertexController.vertexToAdd.relation = Relation.None;
			addVertexController.vertexToAdd.correspondingVertex = null;
			addVertexController.vertexToAdd.relationId = null;

		}
	},

	mouseupEventHandler: (event: MouseEvent) => {

		if (addVertexController.vertexToAdd === null || addVertexController.vertexToAdd.nextVertex === null || addVertexController.vertexToAdd.nextVertex.nextVertex === null) {
			throw new Error("Wystąpił błąd podczas dodawania wierzchołka!");
		}

		addVertexController.canAddVertex = false;
		addVertexController.vertexToAdd.color = Color.Black;
		addVertexController.vertexToAdd.edgeColor = Color.Black;
		addVertexController.vertexToAdd.nextVertex.edgeColor = Color.Black;
		addVertexController.vertexToAdd.nextVertex.nextVertex.color = Color.Black;

		addVertexController.vertexToAdd = null;

		app.prevPoint = app.currPoint = null;

		refreshCanvas();
	}
}

let deleteVertexController = {

	modification: Modification.DeleteVertex,

	vertexToDelete: null as Vertex | null,
	canDeleteVertex: false,

	mousemoveEventHandler: (event: MouseEvent) => {

		refreshCanvas();
		app.currPoint = getPoint(event);
		deleteVertexController.canDeleteVertex = false;

		if (app.currentPolygon === null) {
			throw new Error("Wystąpił błąd podczas usuwania wierzchołka!");
		}

		for (const vertex of app.currentPolygon.vertices) {
			if (calcDistance(vertex.position, app.currPoint) < 10) {
				drawPoint(vertex.position, 10, Color.Red);
				deleteVertexController.vertexToDelete = vertex;
				deleteVertexController.canDeleteVertex = true;
			}
		}
	},

	mousedownEventHandler: (event: MouseEvent) => {

		if (deleteVertexController.canDeleteVertex) {

			if (app.currentPolygon === null) {
				throw new Error("Wystąpił błąd podczas usuwania wierzchołka!");
			}

			if (app.currentPolygon.vertices.length > 3) {
				const index = (app.currentPolygon.vertices.findIndex(elem => elem === deleteVertexController.vertexToDelete));
				const vertex = deleteVertexController.vertexToDelete;

				if (vertex === null || vertex.prevVertex === null || vertex.nextVertex === null) {
					throw new Error("Wystąpił błąd podczas usuwania wierzchołka!");
				}

				vertex.prevVertex.nextVertex = vertex.nextVertex;
				vertex.nextVertex.prevVertex = vertex.prevVertex;

				if (vertex.correspondingVertex !== null) {
					vertex.correspondingVertex.relation = Relation.None;
					vertex.correspondingVertex.correspondingVertex = null;
					vertex.correspondingVertex.relationId = null;
				}

				vertex.relation = Relation.None;
				vertex.correspondingVertex = null;
				vertex.relationId = null;

				if (vertex.prevVertex.correspondingVertex !== null) {
					vertex.prevVertex.correspondingVertex.relation = Relation.None;
					vertex.prevVertex.correspondingVertex.correspondingVertex = null;
					vertex.prevVertex.correspondingVertex.relationId = null;
				}

				vertex.prevVertex.relation = Relation.None;
				vertex.prevVertex.correspondingVertex = null;
				vertex.prevVertex.relationId = null;

				app.currentPolygon.vertices.splice(index, 1);
			}
		}
	},

	mouseupEventHandler: (event: MouseEvent) => {
		deleteVertexController.canDeleteVertex = false;
		deleteVertexController.vertexToDelete = null;

		app.prevPoint = app.currPoint = null;
		refreshCanvas();
	}
}

let moveEdgeController = {

	modification: Modification.MoveEdge,

	edgeFounded: false,
	canMoveEdge: false,
	edgeToMove: [] as Vertex[],

	mousemoveEventHandler: (event: MouseEvent) => {
		refreshCanvas();
		app.currPoint = getPoint(event);
		moveEdgeController.edgeFounded = false;

		if (moveEdgeController.edgeToMove.length === 2 && !moveEdgeController.canMoveEdge) {
			moveEdgeController.edgeToMove[0].color = Color.Black;
			moveEdgeController.edgeToMove[0].edgeColor = Color.Black;
			moveEdgeController.edgeToMove[1].color = Color.Black;
		}

		if (app.currentPolygon === null) {
			throw new Error("Wystąpił błąd podczas przesuwania krawędzi!");
		}

		for (const vertex of app.currentPolygon.vertices) {

			if (moveEdgeController.canMoveEdge) break;
			if (vertex.nextVertex === null) {
				throw new Error("Wystąpił błąd podczas przesuwania krawędzi!")
			}

			if (areInLine(vertex.position, vertex.nextVertex.position, app.currPoint)) {
				vertex.color = Color.Red;
				vertex.edgeColor = Color.Red;
				vertex.nextVertex.color = Color.Red;

				moveEdgeController.edgeToMove = [vertex, vertex.nextVertex];

				moveEdgeController.edgeFounded = true;

			}
		}

		if (moveEdgeController.canMoveEdge) {
			moveEdgeController.edgeToMove.forEach(vertex => {
				if (app.currPoint === null || app.prevPoint === null) {
					throw new Error("Wystąpił błąd podczas przesuwania krawędzi!")
				}
				vertex.position.x += app.currPoint.x - app.prevPoint.x;
				vertex.position.y += app.currPoint.y - app.prevPoint.y;
			});

			app.prevPoint = app.currPoint;
			correctRelations(app.currentPolygon.vertices.findIndex(el => el === moveEdgeController.edgeToMove[0]));
			refreshCanvas();
		}
	},

	mousedownEventHandler: (event: MouseEvent) => {

		if (moveEdgeController.edgeToMove.length === 2) {
			moveEdgeController.edgeToMove[0].color = Color.Red;
			moveEdgeController.edgeToMove[0].edgeColor = Color.Red;
			moveEdgeController.edgeToMove[1].color = Color.Red;

			moveEdgeController.canMoveEdge = true;

			app.prevPoint = getPoint(event);

			refreshCanvas();
		}


	},

	mouseupEventHandler: (event: MouseEvent) => {

		moveEdgeController.canMoveEdge = false;
		moveEdgeController.edgeFounded = false;

		if (moveEdgeController.edgeToMove.length === 2) {
			moveEdgeController.edgeToMove[0].color = Color.Black;
			moveEdgeController.edgeToMove[0].edgeColor = Color.Black;
			moveEdgeController.edgeToMove[1].color = Color.Black;
		}

		moveEdgeController.edgeToMove = [];

		app.prevPoint = app.currPoint = null;

		refreshCanvas();
	}
}

const makeParallelController = {

	modification: Modification.MakeParallel,

	relationVertices: [] as Vertex[],
	relationVertex: null as Vertex | null,
	
	canAddRelation: false,

	mousemoveEventHandler: (event: MouseEvent) => {
		app.currPoint = getPoint(event);
		makeParallelController.canAddRelation = false;

		if (makeParallelController.relationVertex !== null && makeParallelController.relationVertex !== makeParallelController.relationVertices[0]) {
			if (!makeParallelController.relationVertices[0] || makeParallelController.relationVertex !== makeParallelController.relationVertices[0].nextVertex) {
				makeParallelController.relationVertex.color = Color.Black;
			}
			makeParallelController.relationVertex.edgeColor = Color.Black;

			if (!makeParallelController.relationVertices[0] || makeParallelController.relationVertex.nextVertex !== makeParallelController.relationVertices[0]) {
				if(makeParallelController.relationVertex.nextVertex === null) {
					throw new Error("Wystąpił błąd podczas dodawania relacji!");
				}
				makeParallelController.relationVertex.nextVertex.color = Color.Black;
			}
		}

		if(app.currentPolygon === null) {
			throw new Error("Wystąpił błąd podczas dodawania relacji!");
		}

		for (const vertex of app.currentPolygon.vertices) {
			if(vertex.nextVertex === null) {
				throw new Error("Wystąpił błąd podczas dodawania relacji!");
			}
			if (areInLine(vertex.position, vertex.nextVertex.position, app.currPoint)) {

				if (vertex.relation) break;

				vertex.color = Color.Red;
				vertex.edgeColor = Color.Red;
				vertex.nextVertex.color = Color.Red;

				makeParallelController.relationVertex = vertex;
				makeParallelController.canAddRelation = true;
			}
		}

		refreshCanvas();
	},

	mousedownEventHandler: (event: MouseEvent) => {
		if (makeParallelController.canAddRelation) {
			if(makeParallelController.relationVertex === null) {
				throw new Error("Wystąpił błąd podczas dodawania relacji!");
			}
			makeParallelController.relationVertices.push(makeParallelController.relationVertex as Vertex);
			makeParallelController.relationVertex.relation = Relation.Parallel;

			if (makeParallelController.relationVertices.length === 2) {

				if(makeParallelController.relationVertices[0].nextVertex === null || makeParallelController.relationVertices[1].nextVertex === null) {
					throw new Error("Wystąpił błąd podczas dodawania relacji!");
				}

				addRelation(makeParallelController.relationVertices[0], makeParallelController.relationVertices[1]);

				makeParallelController.relationVertices[0].color = Color.Black;
				makeParallelController.relationVertices[0].edgeColor = Color.Black;
				makeParallelController.relationVertices[0].nextVertex.color = Color.Black;

				makeParallelController.relationVertices[1].color = Color.Black;
				makeParallelController.relationVertices[1].edgeColor = Color.Black;
				makeParallelController.relationVertices[1].nextVertex.color = Color.Black;

				makeParallelController.relationVertex = null;
				makeParallelController.relationVertices = [];

			}

			refreshCanvas();
		}
	},

	mouseupEventHandler: (event: MouseEvent) => {
		makeParallelController.canAddRelation = false;
	}
}

const makeEqualController = {

	modification: Modification.MakeParallel,

	relationVertices: [] as Vertex[],
	relationVertex: null as Vertex | null,
	
	canAddRelation: false,

	mousemoveEventHandler: (event: MouseEvent) => {
		app.currPoint = getPoint(event);
		makeParallelController.canAddRelation = false;

		if (makeParallelController.relationVertex !== null && makeParallelController.relationVertex !== makeParallelController.relationVertices[0]) {
			if (!makeParallelController.relationVertices[0] || makeParallelController.relationVertex !== makeParallelController.relationVertices[0].nextVertex) {
				makeParallelController.relationVertex.color = Color.Black;
			}
			makeParallelController.relationVertex.edgeColor = Color.Black;

			if (!makeParallelController.relationVertices[0] || makeParallelController.relationVertex.nextVertex !== makeParallelController.relationVertices[0]) {
				if(makeParallelController.relationVertex.nextVertex === null) {
					throw new Error("Wystąpił błąd podczas dodawania relacji!");
				}
				makeParallelController.relationVertex.nextVertex.color = Color.Black;
			}
		}

		if(app.currentPolygon === null) {
			throw new Error("Wystąpił błąd podczas dodawania relacji!");
		}

		for (const vertex of app.currentPolygon.vertices) {
			if(vertex.nextVertex === null) {
				throw new Error("Wystąpił błąd podczas dodawania relacji!");
			}
			if (areInLine(vertex.position, vertex.nextVertex.position, app.currPoint)) {

				if (vertex.relation) break;

				vertex.color = Color.Red;
				vertex.edgeColor = Color.Red;
				vertex.nextVertex.color = Color.Red;

				makeParallelController.relationVertex = vertex;
				makeParallelController.canAddRelation = true;
			}
		}

		refreshCanvas();
	},

	mousedownEventHandler: (event: MouseEvent) => {
		if (makeParallelController.canAddRelation) {
			if(makeParallelController.relationVertex === null) {
				throw new Error("Wystąpił błąd podczas dodawania relacji!");
			}
			makeParallelController.relationVertices.push(makeParallelController.relationVertex as Vertex);
			makeParallelController.relationVertex.relation = Relation.Equal;

			if (makeParallelController.relationVertices.length === 2) {

				if(makeParallelController.relationVertices[0].nextVertex === null || makeParallelController.relationVertices[1].nextVertex === null) {
					throw new Error("Wystąpił błąd podczas dodawania relacji!");
				}

				addRelation(makeParallelController.relationVertices[0], makeParallelController.relationVertices[1]);

				makeParallelController.relationVertices[0].color = Color.Black;
				makeParallelController.relationVertices[0].edgeColor = Color.Black;
				makeParallelController.relationVertices[0].nextVertex.color = Color.Black;

				makeParallelController.relationVertices[1].color = Color.Black;
				makeParallelController.relationVertices[1].edgeColor = Color.Black;
				makeParallelController.relationVertices[1].nextVertex.color = Color.Black;

				makeParallelController.relationVertex = null;
				makeParallelController.relationVertices = [];

			}

			refreshCanvas();
		}
	},

	mouseupEventHandler: (event: MouseEvent) => {
		makeParallelController.canAddRelation = false;
	}
}

let deleteRelationController = {

	modification: Modification.DeleteRelation,

	canDeleteRelation: false,
	vertexToDelete: null as Vertex | null,

	mousemoveEventHandler: (event: MouseEvent) => {

		app.currPoint = getPoint(event);
		deleteRelationController.canDeleteRelation = false;

		if (deleteRelationController.vertexToDelete !== null && !deleteRelationController.canDeleteRelation) {
			
			if(deleteRelationController.vertexToDelete.nextVertex === null) {
				throw new Error("Wystąpił błąd podczas usuwania relacji!");
			}

			deleteRelationController.vertexToDelete.color = Color.Black;
			deleteRelationController.vertexToDelete.edgeColor = Color.Black;
			deleteRelationController.vertexToDelete.nextVertex.color = Color.Black;
		}

		if(app.currentPolygon === null) {
			throw new Error("Wystąpił błąd podczas usuwania relacji!");
		}

		for (const vertex of app.currentPolygon.vertices) {
			if(vertex.nextVertex === null) {
				throw new Error("Wystąpił błąd podczas usuwania relacji!");
			}

			if (areInLine(vertex.position, vertex.nextVertex.position, app.currPoint)) {
				if(vertex.relation === Relation.None) continue;
				vertex.color = Color.Red;
				vertex.edgeColor = Color.Red;
				vertex.nextVertex.color = Color.Red;

				deleteRelationController.canDeleteRelation = true;
				deleteRelationController.vertexToDelete = vertex;

			}
		}

		refreshCanvas();

	},

	mousedownEventHandler: (event: MouseEvent) => {

		if (deleteRelationController.canDeleteRelation) {

			if(deleteRelationController.vertexToDelete === null || deleteRelationController.vertexToDelete.correspondingVertex === null) {
				throw new Error("Wystąpił błąd podczas usuwania relacji!");
			}

			deleteRelationController.vertexToDelete.correspondingVertex.relation = Relation.None;
			deleteRelationController.vertexToDelete.correspondingVertex.relationId = null;
			deleteRelationController.vertexToDelete.correspondingVertex.correspondingVertex = null;

			deleteRelationController.vertexToDelete.relation = Relation.None;
			deleteRelationController.vertexToDelete.relationId = null;
			deleteRelationController.vertexToDelete.correspondingVertex = null;
		}
	},

	mouseupEventHandler: (event: MouseEvent) => {

		if(deleteRelationController.vertexToDelete === null || deleteRelationController.vertexToDelete.nextVertex === null) {
			throw new Error("Wystąpił błąd podczas usuwania relacji!");
		}

		deleteRelationController.canDeleteRelation = false;
		deleteRelationController.vertexToDelete.color = Color.Black;
		deleteRelationController.vertexToDelete.edgeColor = Color.Black;
		deleteRelationController.vertexToDelete.nextVertex.color = Color.Black;


		deleteRelationController.vertexToDelete = null;

		app.prevPoint = app.currPoint = null;

		refreshCanvas();
	}
}

let currentController: IController | null = null;

movePolygonBtn.addEventListener('click', (event: MouseEvent) => { switchOn.call(movePolygonController) });
moveVertexBtn.addEventListener('click', (event: MouseEvent) => { switchOn.call(moveVertexController) });
addVertexBtn.addEventListener('click', (event: MouseEvent) => { switchOn.call(addVertexController) });
deleteVertexBtn.addEventListener('click', (event: MouseEvent) => { switchOn.call(deleteVertexController) });
moveEdgeBtn.addEventListener('click', (event: MouseEvent) => { switchOn.call(moveEdgeController) });

parallelRelationBtn.addEventListener('click', (event: MouseEvent) => { switchOn.call(makeParallelController) })
equalRelationBtn.addEventListener('click', (event: MouseEvent) => { switchOn.call(makeEqualController) })

deleteRelationBtn.addEventListener('click', (event: MouseEvent) => { switchOn.call(deleteRelationController) })

addRelationBtn.addEventListener('click', event => {
	equalRelationBtn.removeAttribute("disabled");
	parallelRelationBtn.removeAttribute("disabled");
})

deleteRelationBtn.addEventListener('click', event => {
	equalRelationBtn.setAttribute("disabled", "disabled");
	parallelRelationBtn.setAttribute("disabled", "disabled");
})

cancelButton.addEventListener('click', (event: MouseEvent) => {
	switchOff.call(currentController as IController);

	movePolygonBtn.setAttribute("disabled", "disabled");
	moveVertexBtn.setAttribute("disabled", "disabled");
	addVertexBtn.setAttribute("disabled", "disabled");
	deleteVertexBtn.setAttribute("disabled", "disabled");
	moveEdgeBtn.setAttribute("disabled", "disabled");

	addRelationBtn.setAttribute("disabled", "disabled");
	deleteRelationBtn.setAttribute("disabled", "disabled");

	equalRelationBtn.setAttribute("disabled", "disabled");
	parallelRelationBtn.setAttribute("disabled", "disabled");

	app.prevPoint = app.currPoint = null;

	app.addButton.removeAttribute("disabled");
	app.clearButton.removeAttribute("disabled");

	app.currentPolygon = null;
})

function switchOn(this: IController) {
	if (app.currentPolygon === null) throw new Error("Wystąpił błąd podczas próby modyfikacji!")

	if (currentController !== null) switchOff.call(currentController);
	currentController = this;

	app.canvas.addEventListener('mousedown', this.mousedownEventHandler)
	app.canvas.addEventListener('mousemove', this.mousemoveEventHandler)
	app.canvas.addEventListener('mouseup', this.mouseupEventHandler);
}

function switchOff(this: IController) {
	equalRelationBtn.setAttribute("disabled", "disabled");
	parallelRelationBtn.setAttribute("disabled", "disabled");

	app.canvas.removeEventListener('mousedown', this.mousedownEventHandler)
	app.canvas.removeEventListener('mousemove', this.mousemoveEventHandler)
	app.canvas.removeEventListener('mouseup', this.mouseupEventHandler);
}