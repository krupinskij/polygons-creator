"use strict";
exports.__esModule = true;
var Modification_1 = require("./Modification");
var Color_1 = require("./Color");
var Polygon = /** @class */ (function () {
    function Polygon(button) {
        var _this = this;
        this.vertices = [];
        this.button = button;
        this.lastModification = Modification_1.Modification.none;
        this.button.addEventListener('mouseover', function () { _this.changeColor(Color_1.Color.Red); });
        this.button.addEventListener('mouseleave', function () { _this.changeColor(Color_1.Color.Black); });
        this.button.addEventListener('click', function () {
            // TO DO set current polygon
        });
    }
    Polygon.prototype.changeColor = function (color) {
        this.vertices.forEach(function (vertex) {
            vertex.color = color;
            vertex.edgeColor = color;
        });
        // TO DO refreshCanvas();
    };
    return Polygon;
}());
exports.Polygon = Polygon;
