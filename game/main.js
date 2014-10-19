'use strict';

//var Tile = require('./prefabs/characters/tile');

/* Initialize state variables */
var GameState = function(game) {
    //this.tileWidth = 48;
    this.selectedTile = null; /* a pointer to the tile that has been clicked */
    this.allowInput = true; /* Disable input while gems are dropping */
    this.minMatch = 3; /* The minimum number of tiles of the same colour that would be considered a match. */
};


/* Load images and sounds */
GameState.prototype.preload = function() {
	/* Set the background to white */
	this.game.stage.backgroundColor = 0xffffff;

	//this.load.spritesheet('tileFaces', './assets/tilesets/gemTileset.png', 48, 48, 4);

	/* Load the tilemap and the tileset */
    this.load.tilemap('board', './assets/levels/quadblocks.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gemTileset', './assets/tilesets/gemTileset.png');
};

/* Create game objects */
GameState.prototype.create = function() {
    //this.game.physics.startSystem(Phaser.Physics.ARCADE);

    /* Create the map */
    this.map = this.game.add.tilemap('board');
    this.map.addTilesetImage('gemTileset');
    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.resizeWorld();

    /* Shuffle the tiles. The tiles are initially arranged in order */
    this.map.shuffle(0, 0, 6, 10, this.layer);

    /* Add a mouse input listener to the state.*/
    this.game.input.onDown.add(this.getTile, this);
};


GameState.prototype.update = function() {
    

};

/**
 * Select a tile or move the selected tile.
 * @return { null }
 */
GameState.prototype.getTile = function () {
	/* Convert the mouse coordinated to tilemap coordinates */
	var x = this.layer.getTileX(this.game.input.activePointer.x);
	var y = this.layer.getTileY(this.game.input.activePointer.y);

	if (x === undefined || y === undefined) {
		return;
	}

    /* Get the tile at the specified coordinates */
	var tile = this.map.getTile(x, y, this.layer);

    /* Make the tile the selected tile if there's no selected tile. */
    if (!this.selectedTile) {
    	this.selectedTile = tile;
    } else {
    	//debugger;
    	var selected = this.selectedTile;

        /* Determine if the tile can be moved to the clicked position. */
    	if (this.checkTileMove(selected, tile)) {
    		if (this.checkMatches(selected, tile) || this.checkMatches(tile, selected)) {
    			this.swapTiles(selected, tile);

		    	this.selectedTile = null;
    		} else {
    			return;
    		}
            
    	} else {
            return;
    	}
    }
};


/**
 * Determine if a tile can be moved to the point clicked.
 * Returns true if the tile can be moved to the destination.
 * @param {Tile} selTile the previously selected tile
 * @param {Tile} destTile the current tile that was clicked on
 * @return { null } 
 */
GameState.prototype.checkTileMove = function (selTile, destTile) {
	// if the destination tile is two 'blocks' or more to the right
    if (destTile.x > selTile.x + 1 ||
        destTile.x < selTile.x - 1 || 
        destTile.y > selTile.y + 1 ||
        destTile.y < selTile.y - 1 ) {
    	return false;
    }

    return true;
};


/**
 * Swap two tiles.
 * @param  {Tile} selTile  The previously selected tile.
 * @param  {Tile} destTile The current tile that was clicked on.
 * @return {null}          
 */
GameState.prototype.swapTiles = function (selTile, destTile) {
	this.map.removeTile(selTile.x, selTile.y, this.layer);
	this.map.putTile(destTile, selTile.x, selTile.y, this.layer);
	this.map.removeTile(destTile.x, destTile.y, this.layer);
	this.map.putTile(selTile, destTile.x, destTile.y, this.layer);

    //var movedTile = this.map.getTile(destTile.x, destTile.y, this.layer);
	this.clearTiles(selTile, destTile);
};


GameState.prototype.checkMatches = function (selTile, destTile) {
	var countUp = this.countSameTiles(destTile, 0, -1, selTile.index);
	var countDown = this.countSameTiles(destTile, 0, 1, selTile.index);
	var countLeft = this.countSameTiles(destTile, -1, 0, selTile.index);
	var countRight = this.countSameTiles(destTile, 1, 0, selTile.index);
	
    var countHoriz = countLeft + countRight + 1;
    var countVertical = countUp + countDown + 1;

    if (countHoriz >= this.minMatch || countVertical >= this.minMatch) {
    	return true;
    }

    return false;
};


GameState.prototype.countSameTiles = function (startTile, moveX, moveY, idx) {
    var curX = startTile.x + moveX;
	var curY = startTile.y + moveY;
	var count = 0;
	var currentTile = this.map.getTile(curX, curY, this.layer);
	while (currentTile && currentTile.index === idx) {
		count++;
		curX += moveX;
		curY += moveY;
		currentTile = this.map.getTile(curX, curY, this.layer);
	}
	return count;
};


GameState.prototype.clearTiles = function (selTile, destTile) {
    var countUp = this.countSameTiles(destTile, 0, -1, selTile.index);
	var countDown = this.countSameTiles(destTile, 0, 1, selTile.index);
	var countLeft = this.countSameTiles(destTile, -1, 0, selTile.index);
	var countRight = this.countSameTiles(destTile, 1, 0, selTile.index);
	
    var countHoriz = countLeft + countRight + 1;
    var countVertical = countUp + countDown + 1;
    var startHoriz = destTile.x - countLeft;
    var endHoriz = destTile.x + countRight;
    var startVertical = destTile.y - countUp;
    var endVertical = destTile.y + countDown;

    if (countHoriz >= this.minMatch) {
    	for (var i = startHoriz; i <= endHoriz; i++) {
    		this.map.removeTile(i, destTile.y, this.layer);
    	}
    }
    if (countVertical >= this.minMatch) {
    	for (var j = startVertical; j <= endVertical; j++) {
    		this.map.removeTile(destTile.x, j, this.layer);
    	}
    }

    var dropDuration = this.dropGems();
    this.game.time.events.add(dropDuration * 100, this.refillBoard, this);
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


var game = new Phaser.Game(288, 480, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);

