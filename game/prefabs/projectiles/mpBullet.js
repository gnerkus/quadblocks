'use strict';

// The MPBullet object extends the BasePrefab object
var BasePrefab = require('./../base/base');

// Behaviours the MPBullet prefab will possess.
// The MPBullet will move with a specified velocity
var bullet = require('./../../behaviours/movement/bullet');

var MPBullet = function (game, x, y) {
	// Call super class constructor
    BasePrefab.call(this, game, x, y, 'smallBullet');

    this.addBehaviour(bullet);
    this.bulletInit();

    this.damage = 50;

};

MPBullet.prototype = Object.create(BasePrefab.prototype);
MPBullet.prototype.constructor = MPBullet;

MPBullet.prototype.update = function () {

};

module.exports = MPBullet;