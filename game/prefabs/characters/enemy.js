'use strict';

// The Enemy object extends the BasePrefab object
var BasePrefab = require('./../base/base');

// Behaviours the Enemy prefab will possess.
// The Enemy will be able to receive damage from bullets
var target = require('./../../behaviours/abilities/target');
// The Enemy will follow a detected player prefab
var follower = require('./../../behaviours/abilities/follower');
// The Enemy will be able to detect a player prefab within a specified radius
var turret = require('./../../behaviours/intelligence/turret');
// The Enemy will be able to deal damage to the player upon contact
var toxic = require('./../../behaviours/abilities/toxic');

function Enemy (game, x, y, sprite, animationConfig) {
	//debugger;
	// Call super class constructor
    BasePrefab.call(this, game, x, y, sprite, animationConfig);

    this.health = 100;

    // Enable the target behaviour
    this.addBehaviour(target);

    
    // Enable the follower behaviour
    // Call enemy.setTarget(this.gun) in the main.js as the enemy instance is created
    this.addBehaviour(follower);
    // Set the minimum distance and maximum speed
    this.setMinDistanceFromTarget(this.enemyProperties.minDistance);
    this.setMaxDistanceFromTarget(this.enemyProperties.maxDistance);
    this.setMaxFollowSpeed(this.enemyProperties.speed);


    // Enable the turret behaviour
    this.addBehaviour(turret);
    this.createRadar(this.enemyProperties.radarSprite);
    this.setTurretAction('setTargetToFollow');


    // Enable the toxic behaviour
    this.addBehaviour(toxic);
    this.setDamage(this.enemyProperties.damage);
}

Enemy.prototype = Object.create(BasePrefab.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
	for (var index in this.behaviourMethods) {
		this[this.behaviourMethods[index]].call(this);
	}
};

Enemy.prototype.enemyProperties = {
    'speed': 250,
    'minDistance': 32,
    'maxDistance': 128,
    'damage': 20,
    'radarSprite': 'radar'
};

module.exports = Enemy;