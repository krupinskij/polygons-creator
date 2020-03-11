"use strict"

const movePolygonBtn = document.getElementById("button-polygon-movePolygon"); // przesuwanie wielokąta
const moveVertexBtn = document.getElementById("button-polygon-moveVertex"); // przesuwanie wierzchołka
const addVertexBtn = document.getElementById("button-polygon-addVertex"); // dodawanie wierzchołka
const deleteVertexBtn = document.getElementById("button-polygon-deleteVertex"); // usuwanie wierzchołka
const moveEdgeBtn = document.getElementById("button-polygon-moveEdge"); // przesuwanie krawędzi
const addRelationBtn = document.getElementById("button-polygon-addRelation"); // nadawanie relacji
const deleteRelationBtn = document.getElementById("button-polygon-deleteRelation"); // nadawanie relacji

const cancelButton = document.getElementById("button-polygon-cancel"); // kończenie edycji

// do szybkiej iteracji
const polygonButtons = [
	movePolygonBtn,
	moveVertexBtn,
	addVertexBtn,
	deleteVertexBtn,
	moveEdgeBtn,
	addRelationBtn,
	deleteRelationBtn
]

// teraz mamy kontrolery do manipulowania modyfikacjami
// każdy z nich ma trzy event handlery: mousedownEventHandler, mousemoveEventHandler i mouseupEventHandler oraz potrzebne zmienne

let movePolygonController = {

	id: 0,

	canMovePolygon: false,

	mousedownEventHandler: event => {
		movePolygonController.canMovePolygon = true;
		state.prevPoint = getPoint(event);
	},

	mousemoveEventHandler: event => {
		state.currPoint = getPoint(event);

		if (movePolygonController.canMovePolygon) {
			state.currentPolygon.vertices.forEach(vertex => {
				vertex.position.x += state.currPoint.x - state.prevPoint.x;
				vertex.position.y += state.currPoint.y - state.prevPoint.y;
			});
			state.prevPoint = state.currPoint;
			refreshCanvas();
		}
	},

	mouseupEventHandler: event => {
		movePolygonController.canMovePolygon = false;
		state.prevPoint = state.currPoint = undefined;
	}
}

let moveVertexController = {

	id: 1,

	vertexFounded: false,
	canMoveVertex: false,

	vertexToMove: null,
	indexToMove: null,

	mousedownEventHandler: event => {
		if (moveVertexController.vertexFounded) {
			moveVertexController.vertexToMove.color = "red";
			moveVertexController.canMoveVertex = true;


			state.prevPoint = getPoint(event);
			refreshCanvas();
		}
	},

	mousemoveEventHandler: event => {
		refreshCanvas();
		state.currPoint = getPoint(event);
		moveVertexController.vertexFounded = false;

		if (moveVertexController.vertexToMove && !moveVertexController.canMoveVertex) {
			moveVertexController.vertexToMove.color = "black";
		}

		for (const vertex of state.currentPolygon.vertices) {

			if (moveVertexController.canMoveVertex) break;

			if (calcDistance(state.currPoint, vertex.position) < 10) {
				vertex.color = "red";

				moveVertexController.vertexToMove = vertex;
				moveVertexController.indexToMove = state.currentPolygon.vertices.findIndex(el => el === vertex);
				moveVertexController.vertexFounded = true;
			}
		}

		if (moveVertexController.canMoveVertex) {
			moveVertexController.vertexToMove.position.x += state.currPoint.x - state.prevPoint.x;
			moveVertexController.vertexToMove.position.y += state.currPoint.y - state.prevPoint.y;
			state.prevPoint = state.currPoint;


			correctRelations(moveVertexController.indexToMove);

			refreshCanvas();
		}
	},

	mouseupEventHandler: event => {
		moveVertexController.canMoveVertex = false;
		moveVertexController.vertexFounded = false;
		if (moveVertexController.vertexToMove) moveVertexController.vertexToMove.color = "black";
		moveVertexController.vertexToMove = undefined;
		moveVertexController.indexToMove = undefined;
		state.prevPoint = state.currPoint = undefined;
	}
}


let addVertexController = {

	id: 2,

	canAddVertex: false,
	vertexToAdd: null,

	mousemoveEventHandler: event => {

		state.currPoint = getPoint(event);
		addVertexController.canAddVertex = false;

		if (addVertexController.vertexToAdd && !addVertexController.canAddVertex) {
			addVertexController.vertexToAdd.color = "black";
			addVertexController.vertexToAdd.edgeColor = "black";
			addVertexController.vertexToAdd.nextVertex.color = "black";
		}

		for (const vertex of state.currentPolygon.vertices) {
			if (areInLine(vertex.position, vertex.nextVertex.position, state.currPoint)) {
				vertex.color = "red";
				vertex.edgeColor = "red";
				vertex.nextVertex.color = "red";

				addVertexController.canAddVertex = true;
				addVertexController.vertexToAdd = vertex;

			}
		}

		refreshCanvas();

	},

	mousedownEventHandler: event => {
		const currPoint = getPoint(event);

		if (addVertexController.canAddVertex) {
			const index = state.currentPolygon.vertices.findIndex(elem => elem === addVertexController.vertexToAdd);
			state.currentPolygon.vertices.splice(index + 1, 0, new Vertex(currPoint));
			state.currentPolygon.verticesCount++;

			state.currentPolygon.vertices[index + 1].nextVertex = addVertexController.vertexToAdd.nextVertex;
			addVertexController.vertexToAdd.nextVertex = state.currentPolygon.vertices[index + 1];

			if (addVertexController.vertexToAdd.relativeVertex) {
				addVertexController.vertexToAdd.relativeVertex.relation = undefined;
				addVertexController.vertexToAdd.relativeVertex.relativeVertex = null;
				addVertexController.vertexToAdd.relativeVertex.relationId = undefined;
			}

			addVertexController.vertexToAdd.relation = undefined;
			addVertexController.vertexToAdd.relativeVertex = null;
			addVertexController.vertexToAdd.relationId = undefined;
		}
	},

	mouseupEventHandler: event => {

		addVertexController.canAddVertex = false;
		addVertexController.vertexToAdd.color = "black";
		addVertexController.vertexToAdd.edgeColor = "black";
		addVertexController.vertexToAdd.nextVertex.edgeColor = "black";
		addVertexController.vertexToAdd.nextVertex.nextVertex.color = "black";


		addVertexController.vertexToAdd = null;

		state.prevPoint = state.currPoint = undefined;

		refreshCanvas();
	}
}

let deleteVertexController = {

	id: 3,

	vertexToDelete: null,
	canDeleteVertex: false,

	mousemoveEventHandler: event => {

		refreshCanvas();
		state.currPoint = getPoint(event);
		deleteVertexController.canDeleteVertex = false;

		for (const vertex of state.currentPolygon.vertices) {
			if (calcDistance(vertex.position, state.currPoint) < 10) {
				drawPoint(vertex.position, 10, "red");
				deleteVertexController.vertexToDelete = vertex;
				deleteVertexController.canDeleteVertex = true;
			}
		}
	},

	mousedownEventHandler: event => {

		if (deleteVertexController.canDeleteVertex) {

			if (state.currentPolygon.verticesCount > 3) {
				const index = (state.currentPolygon.vertices.findIndex(elem => elem === deleteVertexController.vertexToDelete));
				const vertex = deleteVertexController.vertexToDelete;

				vertex.prevVertex.nextVertex = vertex.nextVertex;
				vertex.nextVertex.prevVertex = vertex.prevVertex;

				if (vertex.relativeVertex) {
					vertex.relativeVertex.relation = undefined;
					vertex.relativeVertex.relativeVertex = null;
					vertex.relativeVertex.relationId = undefined;
				}

				vertex.relation = undefined;
				vertex.relativeVertex = null;
				vertex.relationId = undefined;

				if (vertex.prevVertex.relativeVertex) {
					vertex.prevVertex.relativeVertex.relation = undefined;
					vertex.prevVertex.relativeVertex.relativeVertex = null;
					vertex.prevVertex.relativeVertex.relationId = undefined;
				}

				vertex.prevVertex.relation = undefined;
				vertex.prevVertex.relativeVertex = null;
				vertex.prevVertex.relationId = undefined;

				state.currentPolygon.vertices.splice(index, 1);
				state.currentPolygon.verticesCount--;
			}
		}
	},

	mouseupEventHandler: event => {
		deleteVertexController.canDelete = false;
		deleteVertexController.vertexToDelete = -1;

		state.prevPoint = state.currPoint = undefined;
		refreshCanvas();
	}
}

let moveEdgeController = {

	id: 4,

	edgeFounded: false,
	canMoveEdge: false,
	edgeToMove: [],

	mousemoveEventHandler: event => {
		refreshCanvas();
		state.currPoint = getPoint(event);
		moveEdgeController.edgeFounded = false;

		if (moveEdgeController.edgeToMove.length && !moveEdgeController.canMoveEdge) {
			moveEdgeController.edgeToMove[0].color = "black";
			moveEdgeController.edgeToMove[0].edgeColor = "black";
			moveEdgeController.edgeToMove[1].color = "black";
		}

		for (const vertex of state.currentPolygon.vertices) {

			if (moveEdgeController.canMoveEdge) break;

			if (areInLine(vertex.position, vertex.nextVertex.position, state.currPoint)) {
				vertex.color = "red";
				vertex.edgeColor = "red";
				vertex.nextVertex.color = "red";

				moveEdgeController.edgeToMove = [vertex, vertex.nextVertex];

				moveEdgeController.edgeFounded = true;

			}
		}

		if (moveEdgeController.canMoveEdge) {
			moveEdgeController.edgeToMove.forEach(vertex => {
				vertex.position.x += state.currPoint.x - state.prevPoint.x;
				vertex.position.y += state.currPoint.y - state.prevPoint.y;
			});

			state.prevPoint = state.currPoint;
			correctRelations(state.currentPolygon.vertices.findIndex(el => el === moveEdgeController.edgeToMove[0]));
			refreshCanvas();
		}
	},

	mousedownEventHandler: event => {

		if (moveEdgeController.edgeToMove) {
			moveEdgeController.edgeToMove[0].color = "red";
			moveEdgeController.edgeToMove[0].edgeColor = "red";
			moveEdgeController.edgeToMove[1].color = "red";

			moveEdgeController.canMoveEdge = true;

			state.prevPoint = getPoint(event);

			refreshCanvas();
		}


	},

	mouseupEventHandler: event => {

		moveEdgeController.canMoveEdge = false;
		moveEdgeController.edgeFounded = false;
		moveEdgeController.edgeToMove[0].color = "black";
		moveEdgeController.edgeToMove[0].edgeColor = "black";
		moveEdgeController.edgeToMove[1].color = "black";
		moveEdgeController.edgeToMove = [];

		state.prevPoint = state.currPoint = undefined;

		refreshCanvas();

	}
}

let deleteRelationController = {

	id: 5,

	canDeleteRelation: false,
	vertexToDelete: null,

	mousemoveEventHandler: event => {

		state.currPoint = getPoint(event);
		deleteRelationController.canDeleteRelation = false;

		if (deleteRelationController.vertexToDelete && !deleteRelationController.canDeleteRelation) {
			deleteRelationController.vertexToDelete.color = "black";
			deleteRelationController.vertexToDelete.edgeColor = "black";
			deleteRelationController.vertexToDelete.nextVertex.color = "black";
		}

		for (const vertex of state.currentPolygon.vertices) {
			if (areInLine(vertex.position, vertex.nextVertex.position, state.currPoint)) {
				if(!(vertex.relationId>-1)) continue;
				vertex.color = "red";
				vertex.edgeColor = "red";
				vertex.nextVertex.color = "red";

				deleteRelationController.canDeleteRelation = true;
				deleteRelationController.vertexToDelete = vertex;

			}
		}

		refreshCanvas();

	},

	mousedownEventHandler: event => {

		if (deleteRelationController.canDeleteRelation) {

			deleteRelationController.vertexToDelete.relativeVertex.relation = "";
			deleteRelationController.vertexToDelete.relativeVertex.relationId = undefined;
			deleteRelationController.vertexToDelete.relativeVertex.relativeVertex = null;

			deleteRelationController.vertexToDelete.relation = "";
			deleteRelationController.vertexToDelete.relationId = undefined;
			deleteRelationController.vertexToDelete.relativeVertex = null;
		}
	},

	mouseupEventHandler: event => {

		deleteRelationController.canDeleteRelation = false;
		deleteRelationController.vertexToDelete.color = "black";
		deleteRelationController.vertexToDelete.edgeColor = "black";
		deleteRelationController.vertexToDelete.nextVertex.color = "black";


		deleteRelationController.vertexToDelete = null;

		state.prevPoint = state.currPoint = undefined;

		refreshCanvas();
	}
}

// po kliknięciu włączamy daną modyfikację
movePolygonBtn.addEventListener('click', event => { switchOn.call(movePolygonController) });
moveVertexBtn.addEventListener('click', event => { switchOn.call(moveVertexController) });
addVertexBtn.addEventListener('click', event => { switchOn.call(addVertexController) });
deleteVertexBtn.addEventListener('click', event => { switchOn.call(deleteVertexController) });
moveEdgeBtn.addEventListener('click', event => { switchOn.call(moveEdgeController) });
deleteRelationBtn.addEventListener('click', event => { switchOn.call(deleteRelationController) })

// albo kończymy
cancelButton.addEventListener('click', event => {
	if (state.currentPolygon.lastModification) switchOff.call(state.currentPolygon.lastModification);
	state.prevPoint = state.currPoint = undefined;

	polygonButtons.forEach(button => {
		button.setAttribute("disabled", "disabled");
	});

	addButton.removeAttribute("disabled");
	clearButton.removeAttribute("disabled");
	resetButton.removeAttribute("disabled");

	state.currentPolygon = null;
});

// włączanie danej modyfikacji
// btw. używając wywołania switchOn.call(...) ustawiamy this na pierwszy parametr wywołania
function switchOn() {
	// usuwamy poprzednią modyfikację (jeśli jest)
	if (state.currentPolygon.lastModification) switchOff.call(state.currentPolygon.lastModification);
	state.currentPolygon.lastModification = this; // ustawiamy bieżącą modyfikację
	console.log(state.currentPolygon.lastModification)

	// dodajemy listenery do canvasu
	canvas.addEventListener('mousedown', this.mousedownEventHandler)
	canvas.addEventListener('mousemove', this.mousemoveEventHandler)
	canvas.addEventListener('mouseup', this.mouseupEventHandler);
}

// usuwanie modyfikacji
function switchOff() {
	canvas.removeEventListener('mousedown', this.mousedownEventHandler)
	canvas.removeEventListener('mousemove', this.mousemoveEventHandler)
	canvas.removeEventListener('mouseup', this.mouseupEventHandler);

	// odłączanie kontrolerów relacji equall/parallel (szczegóły relation.js)
	makeEqualController.disconnect();
	makeParallelController.disconnect();
	equalRelationBtm.setAttribute("disabled", "disabled");
	parallelRelationBtm.setAttribute("disabled", "disabled");
}


