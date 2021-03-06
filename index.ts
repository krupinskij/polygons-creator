import './node_modules/materialize-css/dist/css/materialize.min.css';
import './style.scss';
import './src/assets/logo.svg';
const M = require('./node_modules/materialize-css/dist/js/materialize.min');

document.addEventListener('DOMContentLoaded', function() {
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.Collapsible.init(document.querySelectorAll('.collapsible'))
});