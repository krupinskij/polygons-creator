"use strict"

// "klasa" wielokąta
class Polygon {

  constructor(button) {
    this.vertices = []; // tablica wierzchołków
    this.verticesCount = 0; // ilość wierzchołków w wielokącie
    this.button = button; // odpowiadający przycisk (parametr konstruktora)
    this.lastModification = null; // ostatnia modyfikacja (np. przesuwanie wielokąta, usuwanie wierzchołka itd.)
    // (do usuwana listenerów z canvasu i przyłączania nowych, szczegóły edition.js)

    // zmiana koloru wszystich wierzchołków i krawędzi
    this.changeColorListener = color => {
      this.vertices.forEach(vertex => {
        vertex.color = color;
        vertex.edgeColor = color;
      });
      refreshCanvas();
    };

    // po najechaniu na przycisk zmieniamy kolor na czerwony, po zjechaniu na czarny
    this.button.addEventListener('mouseover', event => { this.changeColorListener("red"); });
    this.button.addEventListener('mouseleave', event => { this.changeColorListener("black"); });

    //po naciśnięciu przycisku ustawiamy bieżący wielokąt i wyłączamy niektóre przyciski
    this.button.addEventListener('click', event => {
      state.currentPolygon = this;

      cancelButton.removeAttribute("disabled");

      addButton.setAttribute("disabled", "disabled");
      clearButton.setAttribute("disabled", "disabled");
      resetButton.setAttribute("disabled", "disabled");

      polygonButtons.forEach(button => {
        button.removeAttribute("disabled");
      });
    });
  }

}

// "klasa" wierzchołka
class Vertex {

  constructor(position) {
    this.position = position; // pozycja
    this.radius = 5; // promień

    this.color = "black"; // kolor wierchołka
    this.edgeColor = "blue"; // kolor krawędzi
    // każdy wierzchołek przechowuje informacje o swojej krawędzi (tzn. następnej, która z niego wychodzi)

    this.nextVertex; // następny wierzchołek
    this.prevVertex; // poprzedni wierzchołek
    // dodane raczej z wygody :)
    // zawsze to lepiej niż:
    //     - szukać wierzchołka w całej tablicy, 
    //     - pobrać indeks, 
    //     - zwiększyć/zmiejszyć go (pamiętając o zakresie),
    //     - otrzymać następny/poprzedni wierchołek
    // ale używane raczej rzadko

    this.relation; // rodzaj relacji w jakiej jest krawędź ("equal"/"parallel")
    this.relativeVertex; // druga krawędź w relacji
    this.relationId; // numer relacji (do etykiety)
  }

}
