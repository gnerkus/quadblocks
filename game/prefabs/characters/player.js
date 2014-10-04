'use strict';

// The Player object extends the BasePrefab object
var BasePrefab = require('./../base/base');

// The Player carries an MPGun (Metal Piercing)
var MPGun = require('./../equipment/mpGun.js');

// Behaviours the Player prefab will possess.
// The Player will be controlled with the keyboard
var eightDirection = require('./../../behaviours/controls/eightDirection');

var Player = function (game, x, y) {
	// Call super class constructor
    BasePrefab.call(this, game, x, y, 'player');
    this.game.physics.arcade.enable(this);

    this.addBehaviour(eightDirection);
    this.eightDirectionInit();

    this.gun = new MPGun(this.game, this.x, this.y);
    this.game.add.existing(this.gun);
    this.gun.player = this;

    this.health = 100;
    this.power = 1000;

};

Player.prototype = Object.create(BasePrefab.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    this.rotation = this.game.physics.arcade.angleToPointer(this);
};

module.exports = Player;