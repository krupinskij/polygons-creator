const M = require('./node_modules/materialize-css/dist/js/materialize.min');

import './style.scss';

import './src/assets/logo.svg';
import './src/assets/favicon.ico';

import Creator from './src/creator';
import { getElementById } from './src/helpers/getElement';

document.addEventListener('DOMContentLoaded', function () {
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.Collapsible.init(document.querySelectorAll('.collapsible'));
  M.Tabs.init(document.querySelectorAll('.tabs'));

  const layer = getElementById('layer');
  const canvasContainer = getElementById('canvas-container');
  const sidenavInstance = M.Sidenav.getInstance(document.getElementById('slide-out'));
  document.querySelectorAll('#slide-out .edit-button').forEach((button) => {
    button.addEventListener('click', () => {
      layer.classList.remove('layer-hidden');
      canvasContainer.classList.add('canvas-panel-edit');
    });
  });
  document.querySelectorAll('#slide-out button').forEach((button) => {
    button.addEventListener('click', () => {
      sidenavInstance.close();
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

  const antialiasingInput: HTMLInputElement = getElementById('antialiasing');
  antialiasingInput.addEventListener('change', (event: Event) => {
    const target: any = event.target;
    Creator.setDrawer(target.checked);
  });
});
