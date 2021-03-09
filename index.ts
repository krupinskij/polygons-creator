import './node_modules/materialize-css/dist/css/materialize.min.css';
import './style.scss';

import './src/assets/logo.svg';
import './src/assets/favicon.ico';

const M = require('./node_modules/materialize-css/dist/js/materialize.min');

import Creator from './src/creator';
import { getElementById } from './src/helpers/getElement';

document.addEventListener('DOMContentLoaded', function () {
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.Collapsible.init(document.querySelectorAll('.collapsible'));
  M.Tabs.init(document.querySelectorAll('.tabs'));

  const layer = getElementById('layer');
  const canvasContainer = getElementById('canvas-container');
  const sidenavInstance = M.Sidenav.getInstance(document.getElementById('slide-out'));
  document.querySelectorAll('#slide-out button').forEach((button) => {
    button.addEventListener('click', () => {
      sidenavInstance.close();
      layer.classList.remove('layer-hidden');
      canvasContainer.classList.add('canvas-panel-edit');
    });
  });

  Creator.init();

  layer.addEventListener('click', () => {
    Creator.endAdding();
    layer.classList.add('layer-hidden');
    canvasContainer.classList.remove('canvas-panel-edit');
  });
  getElementById('none-tab').addEventListener('click', Creator.unsetCurrentPolygon);

  const addButton = getElementById('add-button');
  addButton.addEventListener('click', () => {
    const tab = Creator.startAdding();
    const tabs = document.getElementById('tabs');
    const instance = M.Tabs.getInstance(tabs);
    tab.addEventListener('click', Creator.setCurrentPolygon);

    const a = tab.firstChild as HTMLElement;
    instance.$tabLinks.add(a);
    instance.select(a.id);
  });

  const lineThicknessInput: HTMLInputElement = getElementById('line-thickness');
  lineThicknessInput.addEventListener('change', (event: Event) => {
    const target: any = event.target;
    Creator.setThickness(target.value);
  });
});
