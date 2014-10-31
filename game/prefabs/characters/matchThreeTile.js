'use strict';

var Tile = require('./../base/tile');

var MatchThreeTile = function (game, x, y, key, colour) {
	Tile.call(this, game, x, y, key, colour);

	this.animations.add(this.animNames[0], [0], 60, false);
	this.animations.add(this.animNames[1], [1], 60, false);
	this.animations.add(this.animNames[2], [2], 60, false);
	this.animations.add(this.animNames[3], [3], 60, false);

	this.animations.play(this.animNames[this.tileType]);

	this.inputEnabled = true;
	this.input.enableDrag();
	this.input.enableSnap(MatchThreeTile.tileWidth, MatchThreeTile.tileHeight, false, true);

	this.events.onDragStart.add(this.onTileDrag, this);
	this.events.onDragStop.add(this.dropTile, this);
};

MatchThreeTile.prototype = Object.create(Tile.prototype);
MatchThreeTile.prototype.constructor = MatchThreeTile;

MatchThreeTile.prototype.update = function () {
	
};

MatchThreeTile.prototype.onTileDrag = function () {
	this.z = 100;
	this.board.selectedTile = this;
};

MatchThreeTile.prototype.dropTile = function () {
	var temp = this.board.getTileXY(this.x, this.y);
	this.board.tempTile = temp;
	this.board.validateMove();
};

MatchThreeTile.tileWidth = 48;
MatchThreeTile.tileHeight = 48;
MatchThreeTile.prototype.animNames = ['star', 'heart', 'cross', 'diamond'];
MatchThreeTile.tileTypeCount = MatchThreeTile.prototype.animNames.length;

MatchThreeTile.prototype.setType = function (type) {
	this.tileType = type;
	this.animations.play(this.animNames[this.tileType]);
};

module.exports = MatchThreeTile;