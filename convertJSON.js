"use strict"

const fileInput = document.getElementById("file-load");
const loadBtn = document.getElementById("load-json");

const saveInput = document.getElementById("save-name");
const saveBtn = document.getElementById("save-json");

saveBtn.addEventListener('click', () => {

	const polygons = [];

	state.polygons.forEach(polygon => {
		const jPolygon = {
			points: [],
			relations: []
		}

		const set = new Set();

		polygon.vertices.forEach(vertex => {
			jPolygon.points.push({ x: vertex.position.x, y: vertex.position.y });

			if (vertex.relationId > -1) {
				if (!set.has(vertex.relationId)) {
					set.add(vertex.relationId);

					jPolygon.relations.push({
						e1: polygon.vertices.findIndex(el => el === vertex),
						e2: polygon.vertices.findIndex(el => el === vertex.relativeVertex),
						type: vertex.relation === "equal" ? 0 : 1,
					})
				}
			}

		});

		polygons.push(jPolygon);

	});

	const polygonJSON = JSON.stringify(polygons);

	const a = document.createElement("a");
	a.href = window.URL.createObjectURL(new Blob([polygonJSON], { type: "octet/stream" }));
	a.download = (saveInput.value.length > 0 ? saveInput.value : "polygons") + ".json";
	a.click();
	window.URL.revokeObjectURL(url);
	
	saveInput.value = "";
	

	// https://www.quora.com/How-do-I-make-a-JSON-file-with-JavaScript
})

loadBtn.addEventListener('click', () => {

	clear();

	const reader = new FileReader();
	reader.addEventListener("load",  () => { loadPolygonsFromJSON(reader.result); });
	
	if(fileInput.files[0]) reader.readAsText(fileInput.files[0]);

});

function loadPolygonsFromJSON(data) {

	const Jpolygons = JSON.parse(data);

	Jpolygons.forEach(Jpolygon => {

		const polygonBtn = document.createElement("button");
		polygonBtn.innerText = "Edytuj wielokąt #1";
		polygonBtn.className = "polygons-btn_polygon btn";
		polygonsDiv.appendChild(polygonBtn);

		const polygon = new Polygon(polygonBtn);

		Jpolygon.points.forEach(point => {
			polygon.vertices.push(new Vertex(point));
			polygon.verticesCount++;
		})

		for (let i = 1; i < polygon.verticesCount; i++) {
			polygon.vertices[i - 1].nextVertex = polygon.vertices[i];
			polygon.vertices[i].prevVertex = polygon.vertices[i - 1];
			polygon.vertices[i].edgeColor = "black";
		}

		polygon.vertices[polygon.verticesCount - 1].nextVertex = polygon.vertices[0];
		polygon.vertices[0].prevVertex = polygon.vertices[polygon.verticesCount - 1];
		polygon.vertices[0].edgeColor = "black";


		Jpolygon.relations.forEach(relation => {

			polygon.vertices[relation.e1].relationId = state.relationsCount;
			polygon.vertices[relation.e2].relationId = state.relationsCount;

			polygon.vertices[relation.e1].relativeVertex = polygon.vertices[relation.e2];
			polygon.vertices[relation.e2].relativeVertex = polygon.vertices[relation.e1];

			polygon.vertices[relation.e1].relation = relation.type == 0 ? "equal" : "parallel";
			polygon.vertices[relation.e2].relation = relation.type == 0 ? "equal" : "parallel";

			state.relationsCount++;
		})

		state.polygons.push(polygon);
		state.polygonsCounter++;

	})

	refreshCanvas();
}