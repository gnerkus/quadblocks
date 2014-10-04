'use strict';

var FollowBehaviour = (function () {
	var state = {
		name: 'follow',

		attribs: {
			target: null,
			maxSpeed: 48,
			isFollowing: false
		},

		updateMethods: {
            
		},

		methods: {
			followInit: function () {

			},

			followSetFollowingState: function () {
            	this.follow.isFollowing = !!this.follow.target;
            },

            followFollowTarget: function () {
            	/*if (this.follow.isFollowing) {
            		this.game.physics.arcade.moveToObject(this, this.follow.target, this.follow.maxSpeed); 
            	}*/
            	if (this.follow.isFollowing) {
            		// Calculate the angle to the target
	                var rotation = this.game.math.radToDeg(this.game.math.angleBetween(this.body.x, this.body.y, this.follow.target.x, this.follow.target.y));

	                // Calculate velocity vector based on rotation and this.MAX_SPEED
	                this.body.velocity.x = Math.cos(rotation) * this.follow.maxSpeed;
	                this.body.velocity.y = Math.sin(rotation) * this.follow.maxSpeed;
            	}
            },

            followSetTarget: function (target) {
            	this.follow.target = target;
            },

            followSetMaxSpeed: function (speed) {
                this.follow.maxSpeed = speed;
            },

            followStop: function () {
            	this.follow.target = null;
            }
		}
	};

	return state;
}());

module.exports = FollowBehaviour;