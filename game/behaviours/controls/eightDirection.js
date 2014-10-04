'use strict';

var EightDirectionBehaviour = (function () {
    var state = {
        name: 'eightDirection',

        attribs: {
            maxSpeed: 144,
            defaultControls: true,
            directions: 0,
            ignoreInput: false
        },

        updateMethods: {
            
        },

        methods: {
            eightDirectionInit: function () {
                // Enable physics
                if (!this.body) {
                    this.game.physics.arcade.enable(this);
                }
            },

            eightDirectionKeySignalListener: function (keypressSignal) {
            	/*
            	The keypressSignal looks like this:
            	{
	                direction: {
	                    x: 0,
	                    y: 1
	                }
            	}
            	In this example the signal instructs the player to move downwards.
            	 */
                if (!this.eightDirection.ignoreInput) {
                    this.body.velocity.x = keypressSignal.direction.x * this.eightDirection.maxSpeed;
                    this.body.velocity.y = keypressSignal.direction.y * this.eightDirection.maxSpeed;
                }
            },

            eightDirectionReverse: function () {
                this.body.velocity.x *= -1;
                this.body.velocity.y *= -1;
            },

            eightDirectionSetIgnoreInput: function (ignore) {
                this.eightDirection.ignoreInput = ignore;
            },

            eightDirectionSetMaxSpeed: function (speed) {
                this.eightDirection.maxSpeed = speed;
            },

            eightDirectionStop: function () {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }

        }

    };

    return state;
}());

module.exports = EightDirectionBehaviour;
