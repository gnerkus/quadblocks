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