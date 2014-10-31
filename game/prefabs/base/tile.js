'use strict';

var Tile = function (game, x, y, key, type) {
	Phaser.Sprite.call(this, game, x, y, key);
	this.tileType = type;
	this.tileRow = null;
	this.tileColumn = null;
	this.tileID = null;
};

Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.update = function () {
   
};

Tile.prototype.setType = function (type) {
	this.tileType = type;
};

Tile.prototype.getType = function () {
	return this.tileType;
};

Tile.prototype.setPosition = function () {
    this.x = this.tileColumn * this.board.tileWidth;
    this.y = this.tileRow * this.board.tileHeight;
};

module.exports = Tile;