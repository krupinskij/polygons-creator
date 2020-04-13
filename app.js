!function(n){var t={};function e(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return n[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}e.m=n,e.c=t,e.d=function(n,t,r){e.o(n,t)||Object.defineProperty(n,t,{enumerable:!0,get:r})},e.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},e.t=function(n,t){if(1&t&&(n=e(n)),8&t)return n;if(4&t&&"object"==typeof n&&n&&n.__esModule)return n;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:n}),2&t&&"string"!=typeof n)for(var o in n)e.d(r,o,function(t){return n[t]}.bind(null,o));return r},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},e.p="",e(e.s=4)}([function(n,t,e){var r=e(1),o=e(2);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[n.i,o,""]]);var i={insert:"head",singleton:!1},l=(r(o,i),o.locals?o.locals:{});n.exports=l},function(n,t,e){"use strict";var r,o=function(){return void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r},i=function(){var n={};return function(t){if(void 0===n[t]){var e=document.querySelector(t);if(window.HTMLIFrameElement&&e instanceof window.HTMLIFrameElement)try{e=e.contentDocument.head}catch(n){e=null}n[t]=e}return n[t]}}(),l=[];function a(n){for(var t=-1,e=0;e<l.length;e++)if(l[e].identifier===n){t=e;break}return t}function c(n,t){for(var e={},r=[],o=0;o<n.length;o++){var i=n[o],c=t.base?i[0]+t.base:i[0],s=e[c]||0,d="".concat(c," ").concat(s);e[c]=s+1;var u=a(d),g={css:i[1],media:i[2],sourceMap:i[3]};-1!==u?(l[u].references++,l[u].updater(g)):l.push({identifier:d,updater:p(g,t),references:1}),r.push(d)}return r}function s(n){var t=document.createElement("style"),r=n.attributes||{};if(void 0===r.nonce){var o=e.nc;o&&(r.nonce=o)}if(Object.keys(r).forEach((function(n){t.setAttribute(n,r[n])})),"function"==typeof n.insert)n.insert(t);else{var l=i(n.insert||"head");if(!l)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");l.appendChild(t)}return t}var d,u=(d=[],function(n,t){return d[n]=t,d.filter(Boolean).join("\n")});function g(n,t,e,r){var o=e?"":r.media?"@media ".concat(r.media," {").concat(r.css,"}"):r.css;if(n.styleSheet)n.styleSheet.cssText=u(t,o);else{var i=document.createTextNode(o),l=n.childNodes;l[t]&&n.removeChild(l[t]),l.length?n.insertBefore(i,l[t]):n.appendChild(i)}}function v(n,t,e){var r=e.css,o=e.media,i=e.sourceMap;if(o?n.setAttribute("media",o):n.removeAttribute("media"),i&&btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),n.styleSheet)n.styleSheet.cssText=r;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(r))}}var h=null,f=0;function p(n,t){var e,r,o;if(t.singleton){var i=f++;e=h||(h=s(t)),r=g.bind(null,e,i,!1),o=g.bind(null,e,i,!0)}else e=s(t),r=v.bind(null,e,t),o=function(){!function(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n)}(e)};return r(n),function(t){if(t){if(t.css===n.css&&t.media===n.media&&t.sourceMap===n.sourceMap)return;r(n=t)}else o()}}n.exports=function(n,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=o());var e=c(n=n||[],t);return function(n){if(n=n||[],"[object Array]"===Object.prototype.toString.call(n)){for(var r=0;r<e.length;r++){var o=a(e[r]);l[o].references--}for(var i=c(n,t),s=0;s<e.length;s++){var d=a(e[s]);0===l[d].references&&(l[d].updater(),l.splice(d,1))}e=i}}}},function(n,t,e){(t=e(3)(!1)).push([n.i,".project-container {\r\n    display: grid;\r\n\r\n    grid-template-columns: auto 1fr 1fr;\r\n    gap: 1%;\r\n\r\n    height: 600px;\r\n    width: 1200px;\r\n\r\n    margin: 1% 2%;\r\n    padding: 1% 2%;\r\n\r\n    border: 1px solid black;\r\n\r\n    align-items: center;\r\n}\r\n\r\n.panel-section {\r\n    margin: 0 10px;\r\n    padding: 10px 10%;\r\n    border: 1px solid black;\r\n\r\n    display: flex;\r\n    flex-direction: column;\r\n\r\n    height: auto;\r\n}\r\n\r\n.btn {\r\n    padding: 5px 0;\r\n}\r\n\r\n.line {\r\n    display: block;\r\n    border-top: 1px solid #888;\r\n    margin: 2px 0;\r\n}\r\n\r\n/* /// CANVAS PANEL /// */\r\n\r\n.canvas-panel {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n\r\ncanvas {\r\n    border: 1px solid black;\r\n\r\n    cursor: crosshair;\r\n}\r\n\r\n#hidden-canvas {\r\n    display: none;\r\n}\r\n\r\n/* /// POLYGONS PANEL /// */\r\n\r\n.polygons-panel {\r\n    display: grid;\r\n    grid-template-rows: min-content min-content min-content;\r\n    gap: 2%;\r\n}\r\n\r\n/* ADDING SECTION */\r\n\r\n.adding-btn {\r\n    font-size: 100%;\r\n}\r\n\r\n.adding-btn_add {\r\n    font-size: 120%;\r\n}\r\n\r\n/* EDGE EDITION SECTION */\r\n\r\n.edgeEdition-article {\r\n    margin: 2% 0;\r\n    text-align: center;\r\n}\r\n\r\n.thickness-inp {\r\n    width: 20%;\r\n}\r\n\r\n/* JSON SECTION */\r\n\r\n.json-section {\r\n    text-align: center;\r\n    padding-top: 5%;\r\n    padding-bottom: 5%;\r\n}\r\n\r\n.json-section * {\r\n    margin: 1% 0;\r\n}\r\n\r\n.json-section .line {\r\n    margin: 3% 0;\r\n}\r\n\r\n.load-inp {\r\n    width: 100%;;\r\n}\r\n\r\n/* /// EDITION PANEL /// */\r\n\r\n.edition-panel {\r\n    display: grid;\r\n    grid-template-rows: auto min-content min-content;\r\n    gap: 2%;\r\n}\r\n\r\n/* POLYGONS SECTION */\r\n\r\n.polygons-section {\r\n    display: grid;\r\n    grid-template-rows: 1fr auto;\r\n}\r\n\r\n.polygons-container {\r\n    height: 100%;\r\n    overflow-y: scroll;\r\n\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100px;\r\n}\r\n\r\n.polygons-btn_polygon {\r\n    font-size: 90%;\r\n\r\n    margin: 0 5%;\r\n}\r\n\r\n.polygons-btn_cancel {\r\n    font-size: 100%;\r\n}\r\n\r\n/* EDITION & RELATION SECTION */\r\n\r\n.edition-btn,\r\n.relation-btn {\r\n    font-size: 90%;\r\n}\r\n\r\n.relation-btn_equal,\r\n.relation-btn_parallel {\r\n    font-size: 80%;\r\n\r\n    margin: 0 5%;\r\n\r\n}\r\n\r\n.relation-btn_equal span {\r\n    display: inline-block;\r\n\r\n    background-color: orange;\r\n\r\n    width: 50%;\r\n}\r\n\r\n.relation-btn_parallel span {\r\n    display: inline-block;\r\n\r\n    background-color: pink;\r\n\r\n    width: 50%;\r\n}",""]),n.exports=t},function(n,t,e){"use strict";n.exports=function(n){var t=[];return t.toString=function(){return this.map((function(t){var e=function(n,t){var e=n[1]||"",r=n[3];if(!r)return e;if(t&&"function"==typeof btoa){var o=(l=r,a=btoa(unescape(encodeURIComponent(JSON.stringify(l)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),"/*# ".concat(c," */")),i=r.sources.map((function(n){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(n," */")}));return[e].concat(i).concat([o]).join("\n")}var l,a,c;return[e].join("\n")}(t,n);return t[2]?"@media ".concat(t[2]," {").concat(e,"}"):e})).join("")},t.i=function(n,e,r){"string"==typeof n&&(n=[[null,n,""]]);var o={};if(r)for(var i=0;i<this.length;i++){var l=this[i][0];null!=l&&(o[l]=!0)}for(var a=0;a<n.length;a++){var c=[].concat(n[a]);r&&o[c[0]]||(e&&(c[2]?c[2]="".concat(e," and ").concat(c[2]):c[2]=e),t.push(c))}},t}},function(n,t,e){"use strict";var r,o;e.r(t),e.d(t,"default",(function(){return P})),function(n){n.Red="rgb(255,0,0)",n.Black="rgb(0,0,0)",n.White="rgb(255,255,255)",n.Orange="orange",n.Pink="pink"}(r||(r={})),function(n){n[n.None=0]="None",n[n.Parallel=1]="Parallel",n[n.Equal=2]="Equal"}(o||(o={}));class i{constructor(n){this.position=n,this.radius=5,this.color=r.Black,this.edgeColor=r.Black,this.prevVertex=null,this.nextVertex=null,this.relation=o.None,this.relationId=null,this.correspondingVertex=null}}function l(n,t,e){P.context.fillStyle=e,P.context.beginPath(),P.context.arc(n.x,n.y,t,0,2*Math.PI,!0),P.context.fill(),P.context.fillStyle=r.Black}function a(n,t){P.context.fillRect(n.x,n.y,t,t)}function c(n,t,e,i){const l=(n.x+t.x)/2,a=(n.y+t.y)/2;e===o.Equal?P.context.fillStyle=r.Orange:e===o.Parallel?P.context.fillStyle=r.Pink:P.context.fillStyle=r.Black,P.context.fillRect(l+10,a+10,25,25),P.context.fillStyle=r.Black,P.context.fillText(String(i),l+15,a+25)}function s(n,t,e){P.context.fillStyle=e;let r=n.x,o=n.y,i=t.x,l=t.y;if(Math.abs(l-o)<Math.abs(i-r)){if(r>i){let n=r;r=i,i=n;let t=o;o=l,l=t}const n=i-r,t=l-o;let e=2*(t-n);const c=2*t,s=(l-o)*(i-r)>0?2*(t-n):2*(n+t),d=(l-o)*(i-r)>0?1:-1;let u=r,g=o;for(;u<i;){e*d<0?(e+=c,u++):(e+=s,u++,g+=d);for(let n=0;n<P.thickness;n++)a({x:u,y:Math.ceil(g-P.thickness/2)+n},1)}}else{if(o>l){let n=r;r=i,i=n;let t=o;o=l,l=t}const n=i-r,t=l-o;let e=2*(n-t);const c=2*n,s=(l-o)*(i-r)>0?2*(n-t):2*(n+t),d=(l-o)*(i-r)>0?1:-1;let u=r,g=o;for(;g<l;){e*d<0?(e+=c,g++):(e+=s,g++,u+=d);for(let n=0;n<P.thickness;n++)a({x:Math.ceil(u-P.thickness/2)+n,y:g},1)}}}function d(){P.polygons.forEach(n=>{for(let t=0;t<n.vertices.length;t++)v(n.vertices[t].position,n.vertices[(t+1)%n.vertices.length].position,n.vertices[t].edgeColor),g(n.vertices[t].position,n.vertices[t].radius,n.vertices[t].color)});const n=P.hContext.getImageData(0,0,P.hCanvas.width,P.hCanvas.height),t=new Uint8ClampedArray(P.canvas.width*P.canvas.height*4);for(let e=0,r=0;r<n.data.length/4;e+=8,r+=4)e%(4*P.hCanvas.width)==0&&e/(4*P.hCanvas.width)%2==1&&(e+=4*P.hCanvas.width),t[r]=Math.floor((n.data[e]+n.data[e+4]+n.data[e+4*P.hCanvas.width]+n.data[e+4*P.hCanvas.width+4])/4),t[r+1]=Math.floor((n.data[e+1]+n.data[e+5]+n.data[e+4*P.hCanvas.width+1]+n.data[e+4*P.hCanvas.width+5])/4),t[r+2]=Math.floor((n.data[e+2]+n.data[e+6]+n.data[e+4*P.hCanvas.width+2]+n.data[e+4*P.hCanvas.width+6])/4),t[r+3]=255;let e=new ImageData(t,P.canvas.width,P.canvas.height);P.context.putImageData(e,0,0),P.polygons.forEach(n=>{for(let t=0;t<n.vertices.length;t++)n.vertices[t].relation!==o.None&&c(n.vertices[t].position,n.vertices[(t+1)%n.vertices.length].position,n.vertices[t].relation,n.vertices[t].relation)})}function u(n,t){P.hContext.fillRect(n.x,n.y,t,t)}function g(n,t,e){P.hContext.fillStyle=e,P.hContext.beginPath(),P.hContext.arc(2*n.x,2*n.y,2*t,0,2*Math.PI,!0),P.hContext.fill(),P.hContext.fillStyle=r.Black}function v(n,t,e){P.hContext.fillStyle=e;let o=2*n.x,i=2*n.y,l=2*t.x,a=2*t.y;if(Math.abs(a-i)<Math.abs(l-o)){if(o>l){let n=o;o=l,l=n;let t=i;i=a,a=t}const n=l-o,t=a-i;let e=2*(t-n);const r=2*t,c=(a-i)*(l-o)>0?2*(t-n):2*(n+t),s=(a-i)*(l-o)>0?1:-1;let d=o,g=i;for(;d<l;){e*s<0?(e+=r,d++):(e+=c,d++,g+=s);for(let n=0;n<P.thickness;n++)u({x:d,y:g-P.thickness+2*n},2)}}else{if(i>a){let n=o;o=l,l=n;let t=i;i=a,a=t}const n=l-o,t=a-i;let e=2*(n-t);const r=2*n,c=(a-i)*(l-o)>0?2*(n-t):2*(n+t),s=(a-i)*(l-o)>0?1:-1;let d=o,g=i;for(;g<a;){e*s<0?(e+=r,g++):(e+=c,g++,d+=s);for(let n=0;n<P.thickness;n++)u({x:d-P.thickness+2*n,y:g},2)}}P.hContext.fillStyle=r.Black}document.getElementById("checkbox-antialiasing").addEventListener("change",f);const h=document.getElementById("checkbox-antialiasing");function f(){if(P.context.clearRect(0,0,P.canvas.width,P.canvas.height),h.checked){P.hContext.clearRect(0,0,P.hCanvas.width,P.hCanvas.height);const n=P.hContext.fillStyle;P.hContext.fillStyle=r.White,P.hContext.fillRect(0,0,P.hCanvas.width,P.hCanvas.height),P.hContext.fillStyle=n,d()}else P.polygons.forEach(n=>{for(let t=0;t<n.vertices.length;t++)s(n.vertices[t].position,n.vertices[(t+1)%n.vertices.length].position,n.vertices[t].edgeColor),l(n.vertices[t].position,n.vertices[t].radius,n.vertices[t].color),null!==n.vertices[t].relationId&&c(n.vertices[t].position,n.vertices[(t+1)%n.vertices.length].position,n.vertices[t].relation,n.vertices[t].relationId)})}class p{constructor(n){this.vertices=[],this.button=n,this.button.addEventListener("mouseover",()=>{this.changeColor(r.Red)}),this.button.addEventListener("mouseleave",()=>{this.changeColor(r.Black)}),this.button.addEventListener("click",()=>{var n,t,e,r,o,i,l,a;P.currentPolygon=this,null===(n=document.getElementById("button-polygon-cancel"))||void 0===n||n.removeAttribute("disabled"),P.addButton.setAttribute("disabled","disabled"),P.clearButton.setAttribute("disabled","disabled"),null===(t=document.getElementById("button-polygon-movePolygon"))||void 0===t||t.removeAttribute("disabled"),null===(e=document.getElementById("button-polygon-moveVertex"))||void 0===e||e.removeAttribute("disabled"),null===(r=document.getElementById("button-polygon-addVertex"))||void 0===r||r.removeAttribute("disabled"),null===(o=document.getElementById("button-polygon-deleteVertex"))||void 0===o||o.removeAttribute("disabled"),null===(i=document.getElementById("button-polygon-moveEdge"))||void 0===i||i.removeAttribute("disabled"),null===(l=document.getElementById("button-polygon-addRelation"))||void 0===l||l.removeAttribute("disabled"),null===(a=document.getElementById("button-polygon-deleteRelation"))||void 0===a||a.removeAttribute("disabled")})}changeColor(n){this.vertices.forEach(t=>{t.color=n,t.edgeColor=n}),f()}}var y;!function(n){n[n.Default=0]="Default",n[n.AddingPolygon=1]="AddingPolygon"}(y||(y={}));class b{constructor(n,t){this.x=n,this.y=t}}function m(n){return new b(n.x-P.canvas.offsetLeft,n.y-P.canvas.offsetTop)}function x(n,t){return Math.sqrt(Math.pow(n.x-t.x,2)+Math.pow(n.y-t.y,2))}e(0);class P{static init(){P.addButton.addEventListener("click",()=>{switch(P.mode){case y.Default:P.startAdding();break;case y.AddingPolygon:P.endAdding();break;default:throw new Error("Wystąpił błąd podczas dodawania wielokąta")}}),P.clearButton.addEventListener("click",P.clear)}static startAdding(){P.addButton.innerText="Gotowe",P.polygonsInterator++;const n=document.createElement("button");n.innerText="Edytuj wielokąt #"+P.polygonsInterator,n.className="polygons-btn_polygon btn",P.currentPolygon=new p(n),P.polygons.push(P.currentPolygon),P.canvas.addEventListener("click",P.addVertex),P.canvas.addEventListener("mousemove",P.moveCursor),P.mode=y.AddingPolygon,P.addButton.setAttribute("disabled","disabled"),P.clearButton.setAttribute("disabled","disabled")}static endAdding(){if(null===P.currentPolygon)throw new Error("Wystąpił błąd podczas dodawania wielokąta!");P.addButton.innerText="Dodaj wielokąt",P.currentPolygon.vertices[P.currentPolygon.vertices.length-1].edgeColor=r.Black,P.currentPolygon.vertices[P.currentPolygon.vertices.length-1].nextVertex=P.currentPolygon.vertices[0],P.currentPolygon.vertices[0].prevVertex=P.currentPolygon.vertices[P.currentPolygon.vertices.length-1],P.polygonsDiv.appendChild(P.currentPolygon.button),P.canvas.removeEventListener("click",P.addVertex),P.canvas.removeEventListener("mousemove",P.moveCursor),P.mode=y.Default,P.currentPolygon=null,P.prevPoint=P.currPoint=null,P.clearButton.removeAttribute("disabled"),f()}static addVertex(n){if(null===P.currentPolygon)throw new Error("Wystąpił błąd podczas dodawania wielokąta!");P.prevPoint=m(n),P.currentPolygon.vertices.length>2&&x(P.prevPoint,P.currentPolygon.vertices[0].position)<=10?P.endAdding():(P.currentPolygon.vertices.length>0&&(P.currentPolygon.vertices[P.currentPolygon.vertices.length-1].edgeColor=r.Black),P.currentPolygon.vertices.push(new i(P.prevPoint)),P.currentPolygon.vertices.length>1&&(P.currentPolygon.vertices[P.currentPolygon.vertices.length-2].nextVertex=P.currentPolygon.vertices[P.currentPolygon.vertices.length-1],P.currentPolygon.vertices[P.currentPolygon.vertices.length-1].prevVertex=P.currentPolygon.vertices[P.currentPolygon.vertices.length-2]),P.currentPolygon.vertices.length>2&&P.addButton.removeAttribute("disabled"),f())}static moveCursor(n){if(null===P.currentPolygon)throw new Error("Wystąpił błąd podczas dodawania wielokąta!");P.currPoint=m(n),f(),l(P.currPoint,5,r.Red),P.prevPoint&&s(P.prevPoint,P.currPoint,r.Red),P.currentPolygon.vertices.length&&s(P.currentPolygon.vertices[0].position,P.currPoint,r.Red),P.currentPolygon.vertices.length>2&&x(P.currPoint,P.currentPolygon.vertices[0].position)<=15&&l(P.currentPolygon.vertices[0].position,15,r.Red)}static clear(){P.polygons=[],P.polygonsInterator=0,P.currentPolygon=null,P.relationIterator=0,P.prevPoint=null,P.currPoint=null,P.polygonsDiv.innerHTML="",f()}}P.polygons=[],P.currentPolygon=null,P.polygonsInterator=0,P.mode=y.Default,P.prevPoint=null,P.currPoint=null,P.relationIterator=0,P.thickness=1,P.canvas=document.getElementById("canvas"),P.context=P.canvas.getContext("2d"),P.hCanvas=document.getElementById("hidden-canvas"),P.hContext=P.hCanvas.getContext("2d"),P.addButton=document.getElementById("button-add"),P.clearButton=document.getElementById("button-clear"),P.polygonsDiv=document.getElementById("div-polygons"),P.init()}]);