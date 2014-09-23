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
    this.setDamage(this.bulletProperties.damage);
}

SmallBullet.prototype = Object.create(BasePrefab.prototype);
SmallBullet.prototype.constructor = SmallBullet;

SmallBullet.prototype.update = function () {

};

SmallBullet.gunProperties = {
    'shotDelay': 100,
    'bulletCount': 20
};

SmallBullet.prototype.bulletProperties = {
    'speed': 500,
    'damage': 20
};

module.exports = SmallBullet;