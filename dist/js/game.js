(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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


}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_d29f244f.js","/")
},{"./prefabs/environment/matchThreeBoard":5,"1YiZ5S":9,"buffer":6}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

// This class represents a game board filled with tiles.


var Board = function (game, columns, rows, top, left, parent) {
	Phaser.Group.call(this, game, parent);
	this.leftOffset = left;
	this.topOffset = top;
	this.x = this.leftOffset;
	this.y = this.topOffset;
	this.numRows = rows;
	this.numCols = columns;

    this.score = 0;
};

Board.prototype = Object.create(Phaser.Group.prototype);
Board.prototype.constructor = Board;

Board.prototype.update = function () {

};

Board.prototype.setTileClass = function (tileClass) {
	this.tileClass = tileClass;
	this.tileWidth = this.tileClass.tileWidth;
	this.tileHeight = this.tileClass.tileHeight;
	this.typeCount = this.tileClass.tileTypeCount;
};

Board.prototype.setTileSheet = function (sheet) {
	this.tileSheet = sheet;
};


/**
 * Fill an area of the board with Tiles.
 * @param  {Number} cl     The leftmost column of the area.
 * @param  {Number} rw     The topmost row of the area.
 * @param  {Number} width  The width of the area in tiles.
 * @param  {Number} height The height of the area in tiles.
 * @param  {Number} type The tileType for each Tile.
 * @return {null}        
 */
Board.prototype.fill = function (cl, rw, width, height, type) {
	if (!(cl >= 0 && cl < this.numCols && rw >= 0 && rw < this.numRows)) {
    	return false;
    }
    
    var columns = !!width ? (width + cl + 1 > this.numCols ? this.numCols : width) : this.numCols; 
    var rows = !!height ? (height + rw + 1 > this.numRows ? this.numRows : height) : this.numRows; 

    for (var i = rw; i < rows + rw; i++) {
   	    for (var j = cl; j < columns + cl; j++) {
   	    	var tile = new this.tileClass(this.game, j * this.tileWidth, i * this.tileHeight, this.tileSheet, type || Math.floor(Math.random() * this.typeCount));
            tile.board = this;
            this.setCell(tile, j, i);

   	    	this.add(tile);
   	    }
    }
};

// Set the Tile's position within the board.
Board.prototype.setCell = function (tile, col, row) {
    tile.tileColumn = col;
    tile.tileRow = row;
    tile.tileID = this.calculateTileID(col, row);
    tile.setPosition();
};

/**
 * Call a function for each Tile in a specified area.
 * @param  {Function} callback        The function to be called. The function should be available for each Tile.
 * @param  {Object}   callbackContext The context under which the function is called.
 * @param  {Number}   cl              The leftmost column of the area.
 * @param  {Number}   rw              The topmost row of the area.
 * @param  {Number}   width           The width of the area in tiles.
 * @param  {Number}   height          The height of the area in tiles.
 * @return {null}                   
 */
Board.prototype.forEachTile = function (callback, callbackContext, cl, rw, width, height) {
	if (!(cl >= 0 && cl < this.numCols && rw >= 0 && rw < this.numRows)) {
    	return false;
    }

    var columns = width ? (width + cl + 1 > this.numCols ? this.numCols : width) : this.numCols; 
    var rows = height ? (height + rw + 1 > this.numRows ? this.numRows : height) : this.numRows;
    var tiles = []; 

    for (var i = rw; i < rows + rw; i++) {
    	for (var j = cl; j < columns + cl; j++) {
            tiles[0] = this.getTile(j, i);
            callback.apply(callbackContext, tiles);
    	}
    }

};

/**
 * Get the tile at the coordinates given.
 * @param  {Number} cl The column to get the tile from.
 * @param  {Number} rw The row the get the tile from.
 * @return {Board.tileClass}      The Tile at the given coordinates or null if not found.
 */
Board.prototype.getTile = function (cl, rw) {
    if (cl >= 0 && cl < this.numCols && rw >= 0 && rw < this.numRows) {
    	return this.iterate('tileID', this.calculateTileID(cl, rw), Phaser.Group.RETURN_CHILD);
    } else {
    	return null;
    }
};

/**
 * Get the cell coordinates of the point clicked.
 * @param  {Number} x The x coordinate to fetch the column position.
 * @param  {Number} y The y coordinate to fetch the row position.
 * @return {Object | null}   The cell coordinates, if found, or null.
 */
Board.prototype.getCell = function (x, y) {
    var column = Math.floor((x - this.leftOffset) / this.tileWidth);
    var row = Math.floor((y - this.topOffset) / this.tileHeight);

    if (column >= 0 && column < this.numCols && row >= 0 && row < this.numRows) {
        return {column: column, row: row};
    } else {
        return null;
    }
};

/**
 * Get the tile at the x-y coordinates specified.
 * @param  {Number} x The x coordinate to fetch the tile from.
 * @param  {Number} y The y coordinate to fetch the tile from.
 * @return {Board.tileClass}   The Tile at the given coordinates or null if not found.
 */
Board.prototype.getTileXY = function (x, y) {
    var cell = this.getCell(x, y);
    return this.getTile(cell.column, cell.row);
};

/**
 * Get the tile above the coordinates given.
 * @param  {Number} cl The column to get the tile from.
 * @param  {Number} rw The row the get the tile from.
 * @return {Board.tileClass}      The Tile above the given coordinates or null if not found.
 */
Board.prototype.getTileAbove = function (cl, rw) {
    if (cl >= 0 && cl < this.numCols && rw > 0 && rw < this.numRows) {
    	return this.getTile(cl, rw - 1);
    } else {
    	return null;
    }
};

/**
 * Get the tile below the coordinates given.
 * @param  {Number} cl The column to get the tile from.
 * @param  {Number} rw The row the get the tile from.
 * @return {Board.tileClass}      The Tile below the given coordinates or null if not found.
 */
Board.prototype.getTileBelow = function (cl, rw) {
    if (cl >= 0 && cl < this.numCols && rw >= 0 && rw < this.numRows - 1) {
    	return this.getTile(cl, rw + 1);
    } else {
    	return null;
    }
};

/**
 * Get the tile to the left of the coordinates given.
 * @param  {Number} cl The column to get the tile from.
 * @param  {Number} rw The row the get the tile from.
 * @return {Board.tileClass}      The Tile to the left of the given coordinates or null if not found.
 */
Board.prototype.getTileLeft = function (cl, rw) {
    if (cl > 0 && cl < this.numCols && rw >= 0 && rw < this.numRows) {
    	return this.getTile(cl - 1, rw);
    } else {
    	return null;
    }
};

/**
 * Get the tile to the right of the coordinates given.
 * @param  {Number} cl The column to get the tile from.
 * @param  {Number} rw The row the get the tile from.
 * @return {Board.tileClass}      The Tile to the right of the given coordinates or null if not found.
 */
Board.prototype.getTileRight = function (cl, rw) {
    if (cl >= 0 && cl < this.numCols - 1 && rw >= 0 && rw < this.numRows) {
    	return this.getTile(cl + 1, rw);
    } else {
    	return null;
    }
};

/**
 * Check if there is a tile at the given location.
 * @param  {Number} cl The column to check for a tile.
 * @param  {Number} rw The row to check for a tile.
 * @return {Boolean}   True if there is a tile at the given location; otherwise false.
 */
Board.prototype.hasTile = function (cl, rw) {
    if (cl >= 0 && cl < this.numCols && rw >= 0 && rw < this.numRows) {
    	return !!(this.getTile(cl, rw));
    } else {
    	return false;
    }
};

/**
 * Puts a tile of the given colour value at the position specified. If you pass 'null'
 * as your tile, it will pass the arguments to removeTile.
 * @param  {Board.tileClass | Number | null} tile The tile to place or the type of tile to place.
 * @param  {Number} cl   The column to place the tile.
 * @param  {Number} rw   The row to place the tile.
 * @return {Board.tileClass}      The tile object that was added to the board.
 */
Board.prototype.putTile = function (tile, cl, rw) {
    if (tile === null) {
    	return this.removeTile(cl, rw);
    }

    if (cl >= 0 && cl < this.numCols && rw >= 0 && rw < this.numRows) {
    	if (tile instanceof this.tileClass) {
    		if (this.hasTile(cl, rw)) {
    			this.removeTile(cl, rw);
    		}

            tile.board = this;
            this.setCell(tile, cl, rw);

            this.add(tile);
    	} else {
    		if (this.hasTile(cl, rw)) {
    			this.removeTile(cl, rw);
    		} 

    		var newTile = new this.tileClass(this.game, cl * this.tileWidth, rw * this.tileHeight, this.tileSheet, +tile);
            newTile.board = this;
            this.setCell(newTile, cl, rw);

    	    this.add(newTile);
    	}
    } else {
    	return null;
    }
};

/**
 * Removes the tile at the specified coordinates.
 * @param  {Number} cl The column to obtain the tile from.
 * @param  {Number} rw The row to obtain the tile from.
 * @param  {Boolean} destroy If True, call destroy on the child that was removed.
 * @return {Board.tileClass}    The tile object that was removed from the board.
 */
Board.prototype.removeTile = function (cl, rw, destroy) {
    if (cl >= 0 && cl < this.numCols && rw >= 0 && rw < this.numRows) {
    	var tile = this.getTile(cl, rw);
    	this.remove(tile, destroy, false);
    	return tile;
    } else {
    	return null;
    }
};

/**
 * Scans the given area for tiles with a type matching srcType and updates their type to match destType.
 * @param  {Number} srcType  The tile type to scan for.
 * @param  {Number} destType The tile type to replace found tiles with.
 * @param  {Number} The leftmost column of the area.       
 * @param  {Number} The topmost row of the area.       
 * @param  {Number} The width of the area in tiles.    
 * @param  {Number} The height of the area in tiles.   
 * @return {[type]}          
 */
Board.prototype.replaceTiles = function (srcType, destType, cl, rw, width, height) {
    if (!(cl >= 0 && cl < this.numCols && rw >= 0 && rw < this.numRows)) {
    	return false;
    }

    var columns = width ? (width + cl + 1 > this.numCols ? this.numCols : width) : this.numCols; 
    var rows = height ? (height + rw + 1 > this.numRows ? this.numRows : height) : this.numRows;

    for (var i = rw; i < rows + rw; i++) {
    	for (var j = cl; j < columns + cl; j++) {
            var tile = this.getTile(j, i);

            if (tile.getType() === srcType) {
            	tile.setType(destType);
            }
    	}
    }
};

/**
 * Shuffle a set of tiles in a given area.
 * @param  {Number} cl     The leftmost column of the area.
 * @param  {Number} rw     The topmost column of the area.
 * @param  {Number} width  The width of the area in tiles.
 * @param  {Number} height The height of the area in tiles.
 * @return {[type]}        [description]
 */
Board.prototype.shuffle = function (cl, rw, width, height) {
    var columns = width ? (width + cl + 1 > this.numCols ? this.numCols : width) : this.numCols; 
    var rows = height ? (height + rw + 1 > this.numRows ? this.numRows : height) : this.numRows;

    var indexes = [];

    for (var i = rw; i < rows + rw; i++) {
    	for (var j = cl; j < columns + cl; j++) {
            var tile = this.getTile(j, i);
            indexes.push(tile.getType());
    	}
    }

    Phaser.Utils.shuffle(indexes);

    for (var s = rw; s < rows + rw; s++) {
    	for (var t = cl; t < columns + cl; t++) {
            var newTile = this.getTile(t, s);
            var type = indexes.pop();
            newTile.setType(type);
    	}
    }
};

/**
 * Swaps two tiles.
 * @param  {Board.tileClass} tileA The first tile.
 * @param  {Board.tileClass} tileB The second tile.
 * @return {[type]}       [description]
 */
Board.prototype.swap = function (tileA, tileB) {
    if (!(tileA instanceof this.tileClass) || !(tileB instanceof this.tileClass)) {
    	return false;
    }

    var aType = tileA.getType();
    var bType = tileB.getType();

    tileA.setType(bType);
    tileB.setType(aType);

    this.setCell(tileA, tileA.tileColumn, tileA.tileRow);
    this.setCell(tileB, tileB.tileColumn, tileB.tileRow);
};

/**
 * [calculateTileID description]
 * @param  {[type]} col [description]
 * @param  {[type]} row [description]
 * @return {[type]}     [description]
 */
Board.prototype.calculateTileID = function (col, row) {
    return row * this.numCols + col;
};

module.exports = Board;
}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/prefabs/base/board.js","/prefabs/base")
},{"1YiZ5S":9,"buffer":6}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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
}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/prefabs/base/tile.js","/prefabs/base")
},{"1YiZ5S":9,"buffer":6}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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
}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/prefabs/characters/matchThreeTile.js","/prefabs/characters")
},{"./../base/tile":3,"1YiZ5S":9,"buffer":6}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

var Board = require('./../base/board');
var MatchThreeTile = require('./../characters/matchThreeTile');

var MatchThreeBoard = function (game, columns, rows, top, left, spritesheet, parent) {
    Board.call(this, game, columns, rows, top, left, parent);
    this.setTileSheet(spritesheet);
    this.setTileClass(MatchThreeTile);

	this.typeCount = 4;

    /* The selected Tile. */
	this.selectedTile = null;

	/* The Tile the selected Tile is swapped with */
	this.tempTile = null;

	this.allowInput = false;
	this.minMatch = 3;
};

MatchThreeBoard.prototype = Object.create(Board.prototype);
MatchThreeBoard.prototype.constructor = MatchThreeBoard;

MatchThreeBoard.prototype.update = function () {

};

/**
 * Count how many games of the same colour are above, below, to the left and right 
 * of the tile argument. If there are more than the minMatch matched tiles, remove
 * them. If not, return the tiles to their starting positions.
 * @return {[type]} [description]
 */
MatchThreeBoard.prototype.checkForMatches = function (tile) {
    if (!tile) {
        return false;
    }

	var countUp = this.countSameTiles(tile, 0, -1);
    var countDown = this.countSameTiles(tile, 0, 1);
    var countLeft = this.countSameTiles(tile, -1, 0);
    var countRight = this.countSameTiles(tile, 1, 0);
    
    var countHoriz = countLeft + countRight + 1;
    var countVert = countUp + countDown + 1;

    if (countVert >= this.minMatch) {
        this.score += countVert;
        this.removeMatchedTiles(tile.tileColumn, tile.tileRow - countUp, tile.tileColumn, tile.tileRow + countDown);
    }

    if (countHoriz >= this.minMatch) {
        this.score += countHoriz;
        this.removeMatchedTiles(tile.tileColumn - countLeft, tile.tileRow, tile.tileColumn + countRight, tile.tileRow);
    }

    if (countVert < this.minMatch && countHoriz < this.minMatch) {
        this.swap(this.selectedTile, this.tempTile);
        this.resetSelectedTile();
    }
};

MatchThreeBoard.prototype.countSameTiles = function (tile, moveX, moveY) {
    var type = tile.getType();
    var curColumn = tile.tileColumn + moveX;
    var curRow = tile.tileRow + moveY;
    var currentTile = this.getTile(curColumn, curRow);
    var count = 0;

    while (currentTile && currentTile.getType() === type) {
        count++;
        curColumn += moveX;
        curRow += moveY;
        currentTile = this.getTile(curColumn, curRow);
    }

    return count;
};

/**
 * Check if the selectedTile can be moved to the tempTile cell.
 * @return {undefined}         
 */
MatchThreeBoard.prototype.validateMove = function () {
    if (!this.tempTile) {
    	this.resetSelectedTile();
    } else {
        var vert = Math.abs(this.selectedTile.tileColumn - this.tempTile.tileColumn);
        var horiz = Math.abs(this.selectedTile.tileRow - this.tempTile.tileRow);

        if (vert === 1 && horiz === 0 || vert === 0 && horiz === 1) {
            this.swap(this.selectedTile, this.tempTile);
            this.checkForMatches(this.tempTile);

            var dropTileDuration = this.dropTiles();
            this.game.time.events.add(dropTileDuration * 100, this.refillBoard, this);

        } else {
            this.resetSelectedTile();
        }
    }
};

MatchThreeBoard.prototype.resetSelectedTile = function () {
    this.setCell(this.selectedTile, this.selectedTile.tileColumn, this.selectedTile.tileRow);
    this.selectedTile = null;
    this.tempTile = null;
};


MatchThreeBoard.prototype.removeMatchedTiles = function (sCol, sRow, eCol, eRow) {
    var startCol = Phaser.Math.clamp(sCol, 0, this.numCols - 1);
    var startRow = Phaser.Math.clamp(sRow , 0, this.numRows - 1);
    var endCol = Phaser.Math.clamp(eCol, 0, this.numCols - 1);
    var endRow = Phaser.Math.clamp(eRow, 0, this.numRows - 1);
    for (var i = startCol; i <= endCol; i++) {
        for (var j = startRow; j <= endRow; j++) {
            var tile = this.getTile(i, j);
            tile.kill();
            this.setCell(tile, -1, -1);
        }
    }
};

MatchThreeBoard.prototype.dropTiles = function () {
    //debugger;
    var dropRowCountMax = 0;
    for (var i = 0; i < this.numCols; i++) {
        var dropRowCount = 0;
        for (var j = this.numRows - 1; j >= 0; j--) {
            var tile = this.getTile(i, j);
            if (tile === null) {
                dropRowCount++;
            } else if (dropRowCount > 0) {
                this.setCell(tile, tile.tileColumn, tile.tileRow + dropRowCount);
            }
        }
        dropRowCountMax = Math.max(dropRowCount, dropRowCountMax);
    }
    return dropRowCountMax;
};

MatchThreeBoard.prototype.refillBoard = function () {
    var maxMissingTiles = 0;
    for (var i = 0; i < this.numCols; i++) {
        var missingTiles = 0;
        for (var j = this.numRows - 1; j >= 0; j--) {
            var tile = this.getTile(i, j);
            if (tile === null) {
                missingTiles++;
                tile = this.getFirstDead();
                tile.reset(i * this.tileWidth, -missingTiles * this.tileHeight);
                tile.setType(Math.floor(Math.random() * this.typeCount));
                this.setCell(tile, i, j);
            }
        }
        maxMissingTiles = Math.max(maxMissingTiles, missingTiles);
    }
    this.game.time.events.add(maxMissingTiles * 2 * 100, this.boardRefilled, this);
};

MatchThreeBoard.prototype.boardRefilled = function () {
    console.log('Working!');
};

module.exports = MatchThreeBoard;
}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/prefabs/environment/matchThreeBoard.js","/prefabs/environment")
},{"./../base/board":2,"./../characters/matchThreeTile":4,"1YiZ5S":9,"buffer":6}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/index.js","/../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer")
},{"1YiZ5S":9,"base64-js":7,"buffer":6,"ieee754":8}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js","/../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib")
},{"1YiZ5S":9,"buffer":6}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js","/../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754")
},{"1YiZ5S":9,"buffer":6}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/gulp-browserify/node_modules/browserify/node_modules/process/browser.js","/../node_modules/gulp-browserify/node_modules/browserify/node_modules/process")
},{"1YiZ5S":9,"buffer":6}]},{},[1])