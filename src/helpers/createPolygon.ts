import Creator from '../creator';
import Polygon from '../model/Polygon';
import { createNewTab, getElementById } from './getElement';
import { throwError } from './throwError';

export function createPolygon(): HTMLLIElement {
  Creator.polygonsIterator++;
  Creator.currentPolygon = new Polygon(Creator.polygonsIterator);
  Creator.polygons = [...Creator.polygons, Creator.currentPolygon];

  const tabs: HTMLUListElement = getElementById('tabs');
  const tab = createNewTab(Creator.polygonsIterator);
  tab.addEventListener('click', () => {
    Creator.currentPolygon =
      Creator.polygons.find((polygon) => polygon.id === Creator.polygonsIterator) ||
      throwError('Error creating polygon');
  });
  tabs.appendChild(tab);

  return tab;
}
