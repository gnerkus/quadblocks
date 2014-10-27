'use strict';

var Tile = require('./../base/tile');

var MatchThreeTile = function (game, x, y, key, colour) {
	Tile.call(this, game, x, y, key, colour);

	this.animations.add(this.animNames[0], [0], 60, false);
	this.animations.add(this.animNames[1], [1], 60, false);
	this.animations.add(this.animNames[2], [2], 60, false);
	this.animations.add(this.animNames[3], [3], 60, false);

	this.animations.play(this.animNames[this.tileType]);
};

MatchThreeTile.prototype = Object.create(Phaser.Sprite.prototype);
MatchThreeTile.prototype.constructor = MatchThreeTile;

MatchThreeTile.prototype.update = function () {

};

MatchThreeTile.tileWidth = 48;
MatchThreeTile.tileHeight = 48;
MatchThreeTile.prototype.animNames = ['star', 'heart', 'cross', 'diamond'];
MatchThreeTile.tileTypeCount = MatchThreeTile.prototype.animNames.length;

module.exports = MatchThreeTile;