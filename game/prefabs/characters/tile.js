'use strict';

var Tile = function (game, x, y) {
	var randomFrame = Math.floor(Math.random() * 4);
	Phaser.Sprite.call(this, game, x, y, 'tileFaces', randomFrame);
	this.colour = randomFrame;
};

Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.update = function () {

};

module.exports = Tile;