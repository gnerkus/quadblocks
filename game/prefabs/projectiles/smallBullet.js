'use strict';

// The Player object extends the BasePrefab object
var BasePrefab = require('./../base/base');

// Behaviours the Player prefab will possess.
// The Player will be controlled with the keyboard
var bullet = require('./../../behaviours/movement/bullet');

function SmallBullet (game, x, y) {
    var sprite = 'smallBullet';
    var animationConfig = null;

	// Call super class constructor
    BasePrefab.call(this, game, x, y, sprite, animationConfig);

    this.addBehaviour(bullet); // Enable the bullet behaviour
}

SmallBullet.prototype = Object.create(BasePrefab.prototype);
SmallBullet.prototype.constructor = SmallBullet;

SmallBullet.prototype.update = function () {

};

SmallBullet.prototype.bulletProperties = {
    'shotDelay': 100,
    'speed': 500,
    'bulletCount': 20
};

SmallBullet.prototype.checkWorldBounds = true;
SmallBullet.prototype.outOfBoundsKill = true;

module.exports = SmallBullet;