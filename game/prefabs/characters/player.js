'use strict';

// The Player object extends the BasePrefab object
var BasePrefab = require('./../base/base');

// Behaviours the Player prefab will possess.
// The Player will be controlled with the keyboard
var keyboardMovement = require('./../../behaviours/controls/keyboardMovement');
// The Player will be able to release projectiles
var mouseShooter = require('./../../behaviours/actions/mouseShooter');

// Default bullet types for the Player
var SmallBullet = require('./../projectiles/smallBullet');
var BigBullet = require('./../projectiles/bigBullet');

function Player (game, x, y, sprite, animationConfig) {
	// Call super class constructor
    BasePrefab.call(this, game, x, y, sprite, animationConfig);

    // Enable the keyboard controls
    this.addBehaviour(keyboardMovement);

    // Configure the movement controls
    var movementConfig = {
    	speed: 48,
    	right: 'D',
    	down: 'S',
    	left: 'A',
    	up: 'W',
    };

    this.configureMovementControls(movementConfig);

    // Enable the shooting ability
    this.addBehaviour(mouseShooter);

    this.addBulletType({
    	name: 'smallBullet',
    	class: SmallBullet
    });
    this.addBulletType({
    	name: 'bigBullet',
    	class: BigBullet
    });

    this.setPrimaryBullet('smallBullet');
    this.setSecondaryBullet('bigBullet');
    this.createPrimaryBulletPool();
    this.createSecondaryBulletPool();


}

Player.prototype = Object.create(BasePrefab.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {

};

module.exports = Player;