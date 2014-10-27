'use strict';

var Board = require('./../base/board');
var MatchThreeTile = require('./../characters/matchThreeTile');

var MatchThreeBoard = function (game, columns, rows, top, left, spritesheet, parent) {
    Board.call(this, game, columns, rows, top, left, parent);
    this.setTileSheet(spritesheet);
    this.setTileClass(MatchThreeTile);

    //this.tileWidth = 48;
	//this.tileHeight = 48;
	this.typeCount = 4;
};

MatchThreeBoard.prototype = Object.create(Board.prototype);
MatchThreeBoard.prototype.constructor = MatchThreeBoard;

MatchThreeBoard.prototype.update = function () {

};

module.exports = MatchThreeBoard;