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

  const sidenavInstance = M.Sidenav.getInstance(document.getElementById('slide-out'));
  document.querySelectorAll('#slide-out button').forEach((button) => {
    button.addEventListener('click', () => {
      sidenavInstance.close();
    });
  });

  Creator.init();

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

  const stopButton = getElementById('stop-button');
  stopButton.addEventListener('click', () => {
    Creator.endAdding();
  });
});
