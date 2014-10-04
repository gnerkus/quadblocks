'use strict';

// The Enemy object extends the BasePrefab object
var BasePrefab = require('./../base/base');

// Behaviours the Player prefab will possess.
// The Enemy will be able to detect objects within a range
var lineOfSight = require('./../../behaviours/intelligence/lineOfSight');
// The Enemy will be able to follow an object
var follow = require('./../../behaviours/movement/follow');

var Enemy = function (game, x, y) {
	// Call super class constructor
    BasePrefab.call(this, game, x, y, 'enemy');
    this.game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 0.5);

    this.addBehaviour(lineOfSight);

    this.addBehaviour(follow);

    this.health = 100;

};

Enemy.prototype = Object.create(BasePrefab.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
    // Line of sight behaviour
    this.lineOfSightMoveCone();

    // Follow behaviour
    if (this.lineOfSightCanSeeTarget()) {
        this.followSetTarget(this.lineOfSight.target);
        this.followSetFollowingState();
        this.followFollowTarget();
        
    } else {
        this.followStop();
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    
};

module.exports = Enemy;