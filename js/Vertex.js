"use strict";
exports.__esModule = true;
var Color_1 = require("./Color");
var Vertex = /** @class */ (function () {
    function Vertex(position) {
        this.position = position;
        this.radius = 5;
        this.color = Color_1.Color.Black;
        this.edgeColor = Color_1.Color.Black;
    }
    return Vertex;
}());
exports.Vertex = Vertex;
