'use strict';

// The Player object extends the BasePrefab object
var BasePrefab = require('./../base/base');

// Behaviours the Player prefab will possess.
// The Player will be controlled with the keyboard
var keyboardMovement = require('./../../behaviours/controls/keyboardMovement');
// The Player will be able to release projectiles
var mouseShooter = require('./../../behaviours/abilities/mouseShooter');
// The Player will be able to receive damage in contact with enemies
var target = require('./../../behaviours/abilities/target');
// The Player will be visible on enemy radars
var trigger = require('./../../behaviours/abilities/trigger');

// Default bullet types for the Player
var SmallBullet = require('./../projectiles/smallBullet');
var BigBullet = require('./../projectiles/bigBullet');

function Player (game, x, y, sprite, animationConfig) {
	//debugger;
	// Call super class constructor
    BasePrefab.call(this, game, x, y, sprite, animationConfig);

    this.health = 100;

    // Enable the keyboard controls
    this.addBehaviour(keyboardMovement);

    // Configure the movement controls
    var movementConfig = {
    	speed: 192,
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

    // Enable the target behaviour
    this.addBehaviour(target);

    // Enable the trigger behaviour
    this.addBehaviour(trigger);
    this.setTrigger();
}

Player.prototype = Object.create(BasePrefab.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {
	for (var index in this.behaviourMethods) {
		this[this.behaviourMethods[index]].call(this);
	}
};

module.exports = Player;