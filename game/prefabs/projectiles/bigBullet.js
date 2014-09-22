'use strict';

// The Player object extends the BasePrefab object
var BasePrefab = require('./../base/base');

// Behaviours the Player prefab will possess.
// The Player will be controlled with the keyboard
var bullet = require('./../../behaviours/movement/bullet');

function BigBullet (game, x, y) {
    var sprite = 'bigBullet';
    var animationConfig = null;

	// Call super class constructor
    BasePrefab.call(this, game, x, y, sprite, animationConfig);

    this.addBehaviour(bullet); // Enable the bullet behaviour
}

BigBullet.prototype = Object.create(BasePrefab.prototype);
BigBullet.prototype.constructor = BigBullet;

BigBullet.prototype.update = function () {

};

BigBullet.prototype.bulletProperties = {
    'shotDelay': 500,
    'speed': 125,
    'bulletCount': 5
};

BigBullet.prototype.checkWorldBounds = true;
BigBullet.prototype.outOfBoundsKill = true;

module.exports = BigBullet;