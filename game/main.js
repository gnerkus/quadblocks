'use strict';

var MatchThreeBoard = require('./prefabs/environment/matchThreeBoard');

/* Initialize state variables */
var GameState = function(game) {
};


/* Load images and sounds */
GameState.prototype.preload = function() {
	/* Set the background to white */
	this.game.stage.backgroundColor = 0xffffff;

	this.load.spritesheet('tileFaces', './assets/tilesets/gemTileset.png', 48, 48, 4);
};

/* Create game objects */
GameState.prototype.create = function() {
    this.board = new MatchThreeBoard(this.game, 6, 10, 0, 0, 'tileFaces');
    this.board.fill(0, 0, 6, 10);

    this.scoreBoard = this.game.add.text(0, 480, this.board.score, {font: 'bold 16pt Arial'});
};


GameState.prototype.update = function() {
    this.scoreBoard.text = this.board.score;

};


/**
 * Look for gems with empty spaces beneath them and drop them.
 * @return { null }
 */
GameState.prototype.dropGems = function () {
    var dropRowCountMax = 0;
    for (var i = 0; i < 6; i++) {
    	var dropRowCount = 0;
    	for (var j = 9; j >= 0; j--) {
    		var tile = this.map.getTile(i, j, this.layer);
    		if (tile === null) {
    			dropRowCount++;
    		} else if (dropRowCount > 0) {
    			this.map.putTile(tile, i, j + dropRowCount, this.layer);
    			this.map.removeTile(i, j, this.layer);
    		}
    	}
    	dropRowCountMax = Math.max(dropRowCountMax, dropRowCount);
    }
    return dropRowCountMax;
};


GameState.prototype.refillBoard = function () {
    var maxMissTiles = 0;
    for (var i = 0; i < 6; i++) {
    	var missTiles = 0;
    	for (var j = 9; j >= 0; j--) {
    		var tile = this.map.getTile(i, j, this.layer);
    		if (tile === null) {
    			missTiles++;
    			var newTile = this.map.getTile(Math.floor(Math.random() * 6), 9, this.layer);
    			this.map.putTile(newTile, i, j, this.layer);
    		}
    	}
    	maxMissTiles = Math.max(missTiles, maxMissTiles);
    }
    game.time.events.add(maxMissTiles * 2 * 500, this.boardRefilled, this);
};

GameState.prototype.boardRefilled = function () {
	this.allowInput = true;
};


var game = new Phaser.Game(288, 500, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);

