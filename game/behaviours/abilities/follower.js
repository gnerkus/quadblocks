'use strict';

var FollowerBehaviour  = (function () {

    var state = {
        name: 'follower',

        attribs: {
            target: null,
            minDistance: 0,
            maxDistance: 0,
            maxSpeed: 0,
            isActive: false
        },

        updateMethods: {
            followTarget: function () {
                // Calculate distance to target
                var distance = this.game.math.distance(this.x, this.y, this.state.follower.target.x, this.state.follower.target.y);

                // If the distance > MIN_DISTANCE then move
                if (distance > this.state.follower.minDistance && distance < this.state.follower.maxDistance && this.state.follower.isActive) {
                    // Calculate the angle to the target
                    var rotation = this.game.math.angleBetween(this.x, this.y, this.state.follower.target.x, this.state.follower.target.y);

                    // Calculate velocity vector based on rotation and this.MAX_SPEED
                    this.body.velocity.x = Math.cos(rotation) * this.state.follower.maxSpeed;
                    this.body.velocity.y = Math.sin(rotation) * this.state.follower.maxSpeed;
                } else {
                    this.body.velocity.setTo(0, 0);
                }
            }
        },

        methods: {
            setTargetToFollow: function (isActive, target) {
                this.state.follower.isActive = isActive;
                this.state.follower.target = target;
            },

            setMinDistanceFromTarget: function (distance) {
                this.state.follower.minDistance = distance;
            },

            setMaxDistanceFromTarget: function (distance) {
                this.state.follower.maxDistance = distance;
            },

            setMaxFollowSpeed: function (speed) {
                this.state.follower.maxSpeed = speed;
            },

            activateFollow: function () {
                this.state.follower.isActive = true;
            }
        },

        behaviour: {

        },

        handler: function (instruction) {
        	this[instruction.action](instruction.value);
        }
    };

    return state;
}());

module.exports = FollowerBehaviour;