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