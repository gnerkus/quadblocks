'use strict';

var Tile = function (game, x, y, key, type) {
	Phaser.Sprite.call(this, game, x, y, key);
	this.tileType = type;
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

module.exports = Tile;