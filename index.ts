import './node_modules/materialize-css/dist/css/materialize.min.css';
import './style.scss';

import './src/assets/logo.svg';
import './src/assets/favicon.ico';

const M = require('./node_modules/materialize-css/dist/js/materialize.min');

import Creator from './src/creator';

document.addEventListener('DOMContentLoaded', function () {
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.Collapsible.init(document.querySelectorAll('.collapsible'));

  const sidenavInstance = M.Sidenav.getInstance(document.getElementById('slide-out'));
  document.querySelectorAll('#slide-out button').forEach((button) => {
    button.addEventListener('click', () => {
      sidenavInstance.close();
    });
  });

  Creator.init();
});
