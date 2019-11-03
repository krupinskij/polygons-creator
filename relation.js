"use strict"

const equalRelationBtm = document.getElementById("button-relation-equal"); // relacja równości
const parallelRelationBtm = document.getElementById("button-relation-parallel"); // relacja równoległości

// łączenie dwóch krawędzi w relację
function addRelation(a1, a2) {

	// ustawianie odpowiadających sobie krawędzi
	a1.relativeVertex = a2;
	a2.relativeVertex = a1;

	// ustawianie numeru relacji
	a1.relationId = state.relationCount;
	a2.relationId = state.relationCount;

	// zwiększenie ilości relacji
	state.relationCount++;

	// poprawienie relacji
	correctRelations(state.currentPolygon.vertices.findIndex(el => el === a1));
}

// włączenie dodawania relacji
addRelationBtn.addEventListener('click', event => {
	if (state.currentPolygon.lastModification) switchOff.call(state.currentPolygon.lastModification);
	state.currentPolygon.lastModification = this;

	equalRelationBtm.removeAttribute("disabled");
	parallelRelationBtm.removeAttribute("disabled");
})

// moduł (nie klasa), do tworzenia kontrolerów relacji equal/parallel
function MakeRelationController(t) {

	const type = t; // typ relacji "equal"/"parallel"

	let relationVertexes = []; // tablica do przechowywania dwóch krawędzi, którym nadamy relację
	let relationVertex = null; // tymczasowy przechowywacz ostatniej krawędzi
	// krawędzi tzn. wierzchołka, ale już, że to samo (szczegóły classes.js)

	let canAddRelation = false;

	const mousemoveListener = event => {
		state.currPoint = getPoint(event);
		canAddRelation = false;

		if (relationVertex && relationVertex !== relationVertexes[0]) {
			if (!relationVertexes[0] || relationVertex !== relationVertexes[0].nextVertex) {
				relationVertex.color = "black";
			}
			relationVertex.edgeColor = "black";

			if (!relationVertexes[0] || relationVertex.nextVertex !== relationVertexes[0]) {
				relationVertex.nextVertex.color = "black";
			}
		}

		for (const vertex of state.currentPolygon.vertices) {
			if (areInLine(vertex.position, vertex.nextVertex.position, state.currPoint)) {

				if (vertex.relation) break;

				vertex.color = "red";
				vertex.edgeColor = "red";
				vertex.nextVertex.color = "red";

				relationVertex = vertex;
				canAddRelation = true;
			}
		}

		refreshCanvas();
	};

	const mousedownListener = event => {
		if (canAddRelation) {
			relationVertexes.push(relationVertex);
			relationVertex.relation = type;

			if (relationVertexes.length === 2) {

				addRelation(...relationVertexes);

				relationVertexes[0].color = "black";
				relationVertexes[0].edgeColor = "black";
				relationVertexes[0].nextVertex.color = "black";

				relationVertexes[1].color = "black";
				relationVertexes[1].edgeColor = "black";
				relationVertexes[1].nextVertex.color = "black";

				relationVertex = null;
				relationVertexes = [];

			}

			refreshCanvas();
		}
	};

	const mouseupListener = event => {
		canAddRelation = false;
	};

	// zwracamy obiekt z dwiema funkcjami do kontrolowania canvasem
	return {
		connect: () => {
			canvas.addEventListener('mousemove', mousemoveListener);
			canvas.addEventListener('mousedown', mousedownListener);
			canvas.addEventListener('mouseup', mouseupListener);
		},

		disconnect: () => {
			canvas.removeEventListener('mousemove', mousemoveListener);
			canvas.removeEventListener('mousedown', mousedownListener);
			canvas.removeEventListener('mouseup', mouseupListener);
		}
	}

}

// tworzymy kontrolery
const makeEqualController = MakeRelationController("equal");
const makeParallelController = MakeRelationController("parallel")

// włączamy kontrolery na przycisk (tak swoją drogą to trochę się dziwię, że to działa, ale już nieważne)
equalRelationBtm.addEventListener('click', makeEqualController.connect)
parallelRelationBtm.addEventListener('click', makeParallelController.connect)

// poprawianie wierzchołków dla zachowania relacji
// parametrem jest indeks wierzchołka, na którym była jakaś modyfikacja
function correctRelations(id) {

	let v = state.currentPolygon.vertices[id % state.currentPolygon.verticesCount];
	let vertex = v;

	// przechodzimy po wszystkich wierzchołkach
	do {

		// w rzeczywistości poprawiamy wierzchołek odpowiadający bieżącemu,
		// więc jeśli natrafimy na wierzchołek, który odpowiada temu z którego wyszliśmy to go przeskakujemy,
		// chodzi o to by nie modyfikować wierzchołka, którego możemy mieć "pod kursorem" i żeby on nam nie uciekał
		if (vertex.relativeVertex === v) {
			vertex = vertex.nextVertex;
			continue;
		}

		// jeśli relacja jest "equal"
		if (vertex.relation === "equal") {

			// bieżemy odpowiadający wierzchołek
			const relativeVertex = vertex.relativeVertex;

			// mierzymy długość krawędzi i oblicamy współczynnik
			const distance1 = calcDistance(vertex.position, vertex.nextVertex.position);
			const distance2 = calcDistance(relativeVertex.position, relativeVertex.nextVertex.position);
			const a = distance1 / distance2;

			// modyfikujemy odpowiadający wierzchołek
			relativeVertex.position.x = Math.floor(relativeVertex.nextVertex.position.x + (relativeVertex.position.x - relativeVertex.nextVertex.position.x) * a);
			relativeVertex.position.y = Math.floor(relativeVertex.nextVertex.position.y + (relativeVertex.position.y - relativeVertex.nextVertex.position.y) * a);

			// jeśli relacja jest "parallel"
		} else if (vertex.relation === "parallel") {

			// bieżemy odpowiadający wierzchołek
			const relativeVertex = vertex.relativeVertex;

			// sprawdzamy czy nasz wierzchołek jest bardziej pionowy czy poziomy
			// jak zostawimy to przypadkowi to jednak się trochę rozjeżdża
			if (Math.abs(vertex.position.y - vertex.nextVertex.position.y) < Math.abs(vertex.position.x - vertex.nextVertex.position.x)) {
				
				// liczymy nachylenie naszej krawędzi
				let t = (vertex.position.y - vertex.nextVertex.position.y) / (vertex.position.x - vertex.nextVertex.position.x);
				if(Math.abs(t)<0.01) t = 0.01; // w razie gdy wartość jest bliska 0 to trochę ją powiększamy

				// zmieniamy współrzędną y odpowiadającego wierzchołka
				relativeVertex.position.y = Math.floor(relativeVertex.nextVertex.position.y - t * (relativeVertex.nextVertex.position.x - relativeVertex.position.x));
			
			} else {
				
				let t = (vertex.position.x - vertex.nextVertex.position.x) / (vertex.position.y - vertex.nextVertex.position.y);
				if(Math.abs(t)<0.01) t = 0.01;

				relativeVertex.position.x = Math.floor(relativeVertex.nextVertex.position.x - t * (relativeVertex.nextVertex.position.y - relativeVertex.position.y));
			
			}
		}

		// przechodzimy dalej
		vertex = vertex.nextVertex;

	} while (vertex.nextVertex !== v);
}