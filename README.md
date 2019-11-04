# Polygons Creator

### SKRÓCONY OPIS:
Stan programu jest zawarty w obiekcie state.
W tym obiekcie w tablicy przechowujemy wielokąty.
Każdy wielokąt przechowuje tablicę wierzchołków.
Każdy wierzchołek przechowuje również informacje o krawędzi, którą "rozpoczyna", np. jej kolor.

### KLAWISZOLOGIA:
Przede wszystkim mamy trzy głowne przyciski:
- "Dodaj wielokąt" - po naciśnięciu możemy dodawać wielokąt klikając na canvasie. Po naciśnięciu przestanie on być aktywny, aż utworzymy co najmniej trójkąt. Dodając wielokąt pojawiąją się trzy rodzaje krawędzi:
  - **czarne** - stałe krawędzie należące do wielokąta
  - **niebieska** - tymczasowa, domykająca wielokąt
  - dwie **czerwone** - śledzące kursor
  Po utworzeniu co najmniej trójkąta możemy zakończyć dodawanie naciskając poprzedni przycisk (teraz zmienił mu się napis na "Gotowe") lub klikając na pierwszy wierzchołek wielokąta (przy czym przy najechaniu na niego powinna pojawić się duża czerwona kropka!).
- "Wyczyść" - usuwa wszystkie wierzchołki i czyści canvas
- "Resetuj / Pokaż predefiniowany wielokąt" - usuwa wszystkie wierzchołki i czyści canvas oraz rysuje przykładowy wielokąt.

>_Wszystkie przyciski są aktywne lub nieaktywne, zależnie od tego co robimy_

Poniżej mamy możliwość zmienienia grubości krawędzi oraz włączenia antialiasingu.

Jeszcze niżej mamy możliwość wczytania lub zapisania wielokąta w formacie .json.

- Aby wczytać wielokąt należy nacisnąć przycisk "Przeglądaj". Wyświetli nam się okno, w którym możemy wybrać plik do czytania. Należy wybrać plik w formacie ".json"! Następnie klikamy przycisk "Wczytaj wielokąt"
- Aby zapisać wielokąt wpisujemy nazwę pliku, który chcemu utwórzyć (jeśli jej nie podamy zostanie wybrana domyślna "polygons"), po czym klikamy przycisk "Zapisz wielokąt".


Po utworzeniu nowego wielokąta, pojawia się nowy przycisk z napisem "Edytuj wielokąt #{nr}". Po najechaniu na niego odpowiedni wielokąt staje się czerwony, żeby było wiadomo o który chodzi. Po naciśnięciu go możemy edytować dany wielokąt.
Poniżej jest dodatkowy przycisk "Zakończ edycję", ale o nim później.

Wielokąt możemy edytować na kilka sposobów:
- "Przesuń wielokąt" - klikamy w dowolnym miejscu na canvasie, trzymamy mysz i przesuwamy. Nasz wielokąt (i tylko ten) powinien się przesuwać.
- "Przesuń wierzchołek" - najeżdżamy kursorem na wybrany wierzchołek (powinien się on zapalić na czerwono!), klikamy na niego, trzymamy mysz i przesuwamy.
- "Dodaj wierzchołek" - najeżdżamy kursorem na wybraną krawędź (powinna się ona zapalić na czerwono, a także dwa wierzchołki!) i klikamy na nią. W miejscu kliknięcia powinien pojawić się nowy wierzchołek.
- "Usuń wierzchołek" - najeżdżamy kursorem na wybrany wierzchołek (powinien się on zapalić na czerwono!), klikamy na niego i on się usuwa.
- "Przesuń krawędź" - najeżdżamy kursorem na wybraną krawędź (powinna się ona zapalić na czerwono, a także dwa wierzchołki!), klikamy na nią, trzymamy mysz i przesuwamy.

>_W obrębie tego samego wielokąta możemy swobodnie przechodzić między modyfikacjami._

Dodatkowo krawędziom możemy nadawać relacje:
- Naciskamy na przycisk "Dodaj relację". Powinny się uaktywnić dwa nowe przyciski "Równa długość" i "Równoległe".
- Po naciśnięciu na dowolnych z nich możemy zacząć nadawać relacje.
- Najeżdżamy kursorem na wybraną krawędź (powinna się ona zapalić na czerwono, a także dwa wierzchołki!), klikamy na nią, dzięki czemu na stałe zachowuje kolor czerwony, a następnie w analogiczny sposób dodajemy drugą krawędź.
- Powinna nastąpić ewentualna zmiana układu wielokąta (w celu spełnienia relacji) oraz pojawić się nowe etykiety.
- Jeśli dwie krawędzie mają równą długość etykieta jest pomarańczowa, a jeśli są równoległe - różowa. Na etykiecie jest numer. 

>_Krawędzie połączone relacją mają ten sam numer._

Poniżej jest również przycisk "Usuń relację".
Najeżdżamy kursorem na wybraną krawędź z relacją (posiada ona etykietę, krawędź powinna się zapalić na czerwono, a także dwa wierzchołki!) i klikamy na nią. Po kliknięciu relacja powinna zniknąć.

Jeśli zakończyliśmy modyfikację wielokąta, naciskamy przycisk "Zakończ edycję", dzięki czemu wracamy do punktu wyjścia.

### NAJWAŻNIEJSZE ZAŁOŻENIA:
- "Najmniejszym" wielokątem jest trójkąt. Nie można z niego usunąć wierzchołka ani stworzyć wielokąta o mniejszej liczbie wierzchołków.
- Dwie kolejne krawędzie mogą być równoległe. To znaczy ułożą się na jednej prostej.

### IMPLEMENTACJA RELACJI
Relacje, przechowywane są w wierzchołkach.
Jeśli jakaś krawędź jest w relacji z inną to jej wierzchołek przechowuje:
- rodzaj relacji: "equal"/"parallel",
- referencję do drugiej krawędzi w relacji (czyli dosłownie do wierzchołka "rozpoczynącego" tę krawędź)
- identyfikator relacji, czyli numer używany w etykietach, jest to kolejny numer i nie ma na niego wpływu, ani rodzaj relacji, ani wcześniej usunięte inne relacje

Wielokąt powinien spełniać ograniczenia relacji po wywołaniu na nim funkcji.
Funkcja ta wywołuje się sama po działaniach, które mogą wpływać na strukturę wielokąta (np. przesunięcie wierzchołka)
Pobiera ona indeks wierchołka, na którym wystąpiła zmiana. Po czym zaczynając od niego przechodzi w pętli po wszystkich.
Szczegóły działania są w pliku relations.js.

>_Wszystkie szczegóły działania programu są w kodzie w komentarzach._
