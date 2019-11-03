"use strict"

// pobieram canvas i context
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// trzy głowne przyciski:
const addButton = document.getElementById("button-add"); // dodaje nowy wielokąt
const clearButton = document.getElementById("button-clear"); // czyści tło
const resetButton = document.getElementById("button-reset"); // resetuje tło, dodaje predefiniowany wielokąt

// pole do dodawania przycisków odpowiadających wielokątom
const polygonsDiv = document.getElementById("div-polygons");

// głowy obiekt, przechowujący informacje
const state = {
  polygons: [], // tablica z wielokątami
  polygonsCounter: 0, // ilość wielokątów w tablicy
  currentPolygon: null, // bieżacy wielokąt (używane np. przy edycji)

  isAdding: false, // do sprawdznia czy teraz dodajemy wielokąt czy nie

  prevPoint: null, // poprzedni naciśnięty punkt
  currPoint: null, // bieżacy naciśnięty punkt

  relationCount: 0, // liczymy ilość relacji (używane przy etykietach)
}

// na przemian dodajemy wielokąt i kończymy dodawanie
addButton.addEventListener("click", () => {
  if (state.isAdding) endAdding();
  else startAdding();
})

// czyścimy pole
clearButton.addEventListener("click", clear);

function clear() {
  state.polygons = [];
  state.polygonsCounter = 0;
  state.currentPolygon = null;

  state.prevPoint = null;
  state.currPoint = null;

  state.relationsCount = 0;

  polygonsDiv.innerHTML = "";

  refreshCanvas();
}

// resetujemy pole
resetButton.addEventListener("click", reset);
document.addEventListener("DOMContentLoaded", reset); // tworzymy predefiniowany wielokąt przy otwarciu

function reset() {
  polygonsDiv.innerHTML = "";

  const polygon = createPredefinedPolygon();

  state.polygons = [polygon];
  state.polygonsCounter = 1;
  state.currentPolygon = null;

  state.prevPoint = null;
  state.currPoint = null;

  state.relationsCount = 0;

  refreshCanvas();
}

// dodajemy nowy wielokąt
const startAdding = () => {
  addButton.innerText = "Gotowe"; // zmieniamy napis na przycisku

  state.polygonsCounter++; // zwiększamy ilość wielokątów

  // tworzymy przycisk odpowiadający tworzonemu wielokątowi
  const polygonBtn = document.createElement("button");
  polygonBtn.innerText = "Edytuj wielokąt #" + state.polygonsCounter;
  polygonBtn.className = "polygons-btn_polygon btn";

  // tworzymy wielokąt i dodajemy do tablicy wielokątów
  state.currentPolygon = new Polygon(polygonBtn);
  state.polygons.push(state.currentPolygon);

  // dodajemy listenery do canvasu
  canvas.addEventListener("click", addVertex); // dodawanie wierzchołków po kliknięciu
  canvas.addEventListener("mousemove", moveCursor); // poruszanie się kursorem

  // oznaczamy dodawanie wielokąta 
  state.isAdding = true;

  // wyłączamy przyciski
  addButton.setAttribute("disabled", "disabled");
  clearButton.setAttribute("disabled", "disabled");
  resetButton.setAttribute("disabled", "disabled");
}

const endAdding = () => {
  addButton.innerText = "Dodaj wielokąt"; // zmieniamy napis na przycisku

  // trochę porządkujemy na koniec :/
  state.currentPolygon.vertices[state.currentPolygon.verticesCount - 1].edgeColor = "black"; // zmieniamy kolor ostatniej krawędzi na czarny
  state.currentPolygon.vertices[state.currentPolygon.verticesCount - 1].nextVertex = state.currentPolygon.vertices[0]; // łączy ostatni wierzchołek z pierwszym
  state.currentPolygon.vertices[0].prevVertex = state.currentPolygon.vertices[state.currentPolygon.verticesCount - 1]; // ...i pierwszy z ostatnim (szegóły w classes.js)

  polygonsDiv.appendChild(state.currentPolygon.button); // dodajemy przycisk to grupy przycisków

  // zdejmujemy listenery z canvasu
  canvas.removeEventListener("click", addVertex);
  canvas.removeEventListener("mousemove", moveCursor);

  state.isAdding = false; // oznaczamy brak dodawania
  state.currentPolygon = null; // usuwamy wskazanie na bieżacy wielokąt
  state.prevPoint = state.currPoint = undefined; // ...i ostatnie punkty

  // włączamy przyciski
  clearButton.removeAttribute("disabled");
  resetButton.removeAttribute("disabled");

  refreshCanvas();
}

// dodawanie krawędzi
const addVertex = event => {

  // pobieramy naciśnięty punkt i zapisujemy do poprzedniego punktu
  state.prevPoint = getPoint(event);

  // jeśli jest więcej niż trzy wierzchołki i nacisnęliśmy blisko pierwszego wierzchołka to koniec
  if (state.currentPolygon.verticesCount > 2 && calcDistance(state.prevPoint, state.currentPolygon.vertices[0].position) <= 10) {
    endAdding();
    return;
  }

  // jeśli jest wierzchołek zmieniamy kolor ostatniej krawędzi na czarny
  if (state.currentPolygon.verticesCount > 0) {
    state.currentPolygon.vertices[state.currentPolygon.verticesCount - 1].edgeColor = "black";
  }

  // dodajemy wierzchołek do wielokąta
  state.currentPolygon.vertices.push(new Vertex(state.prevPoint));
  state.currentPolygon.verticesCount++;

  // jeśli są co najmniej dwa wierzchołki to łączymy dwa ostatnie (szegóły w classes.js)
  if (state.currentPolygon.verticesCount > 1) {
    state.currentPolygon.vertices[state.currentPolygon.verticesCount - 2].nextVertex = state.currentPolygon.vertices[state.currentPolygon.verticesCount - 1];
    state.currentPolygon.vertices[state.currentPolygon.verticesCount - 1].prevVertex = state.currentPolygon.vertices[state.currentPolygon.verticesCount - 2];
  }

  // jeśli są co najmniej trzy wierzchołki to możemy już przestać, jeśli chcemy
  if (state.currentPolygon.verticesCount > 2) {
    addButton.removeAttribute("disabled");
  }

  // odświerzamy canvas (szczegóły w functions.js)
  refreshCanvas();
}

// poruszanie kursorem
const moveCursor = event => {
  state.currPoint = getPoint(event); // zapisujemy bieżący punkt

  refreshCanvas(); // odświeżamy canvas
  drawPoint(state.currPoint, 5, "red"); // rysujemy punkt pod kursorem (czerwone kółeczko)

  // jeśli jest poprzedni punkt (tzn. gdzieś naciśnięto) to rysujemy linię
  if (state.prevPoint) drawLine(state.prevPoint, state.currPoint, "red");

  // tworzymy linię domykającą nasz wielokąt bieżącym punktem
  if (state.currentPolygon.verticesCount) drawLine(state.currentPolygon.vertices[0].position, state.currPoint, "red");

  // gdy zbliżymy się blisko pierwszego wierzchołka to zapala się duża czerwona kropka 
  // (po jej kliknięciu kończymy dodawanie wielokąta)
  if (state.currentPolygon.verticesCount > 2 && calcDistance(state.currPoint, state.currentPolygon.vertices[0].position) <= 15) {
    drawPoint(state.currentPolygon.vertices[0].position, 15, "red");
  }
}

// dodawanie predefiniowanego wielokąta
function createPredefinedPolygon() {
  const polygonBtn = document.createElement("button");
  polygonBtn.innerText = "Edytuj wielokąt #1";
  polygonBtn.className = "polygons-btn_polygon btn";
  polygonsDiv.appendChild(polygonBtn);

  const polygon = new Polygon(polygonBtn);

  polygon.vertices.push(new Vertex({ x: 254, y: 91 }));
  polygon.vertices.push(new Vertex({ x: 30, y: 196 }));
  polygon.vertices.push(new Vertex({ x: 75, y: 360 }));
  polygon.vertices.push(new Vertex({ x: 356, y: 412 }));
  polygon.vertices.push(new Vertex({ x: 569, y: 285 }));
  polygon.vertices.push(new Vertex({ x: 493, y: 135 }));

  for (let i = 1; i < 6; i++) {
    polygon.vertices[i - 1].nextVertex = polygon.vertices[i];
    polygon.vertices[i].prevVertex = polygon.vertices[i - 1];
    polygon.vertices[i].edgeColor = "black";
  }
  polygon.vertices[5].nextVertex = polygon.vertices[0];
  polygon.vertices[0].prevVertex = polygon.vertices[5];
  polygon.vertices[0].edgeColor = "black";

  polygon.verticesCount = 6;

  polygon.vertices[0].relationId = 0;
  polygon.vertices[0].relation = "equal";
  polygon.vertices[0].relativeVertex = polygon.vertices[3];

  polygon.vertices[2].relationId = 1;
  polygon.vertices[2].relation = "parallel";
  polygon.vertices[2].relativeVertex = polygon.vertices[5];

  polygon.vertices[3].relationId = 0;
  polygon.vertices[3].relation = "equal";
  polygon.vertices[3].relativeVertex = polygon.vertices[0];

  polygon.vertices[5].relationId = 1;
  polygon.vertices[5].relation = "parallel";
  polygon.vertices[5].relativeVertex = polygon.vertices[2];

  return polygon;
}


